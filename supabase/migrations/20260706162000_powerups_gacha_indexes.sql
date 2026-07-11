-- =============================================================================
-- Power-up columns + atomic power-up purchase, gacha duplicate compensation,
-- and hot-path indexes. Fixes issues found in the pre-launch readiness audit.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Power-up counter columns. The RewardsShop wrote to these columns but they
--    never existed, so 4 of 6 power-ups silently failed (and, after coins moved
--    to spend_coins, charged the user for nothing). Create them.
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS streak_freeze_count int NOT NULL DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS double_xp_count     int NOT NULL DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS hint_count          int NOT NULL DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS double_coins_count  int NOT NULL DEFAULT 0;

-- -----------------------------------------------------------------------------
-- 2. purchase_power_up: atomic debit + effect in one transaction, so a user can
--    never be charged without receiving the power-up (the previous spend_coins +
--    separate update split could debit then fail the effect write).
--    Returns { ok, coins } or raises.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.purchase_power_up(p_action text, p_price int)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _coins int;
BEGIN
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;
  IF p_price IS NULL OR p_price < 0 THEN
    RAISE EXCEPTION 'invalid price';
  END IF;

  SELECT COALESCE(coins, 0) INTO _coins
    FROM public.profiles WHERE user_id = _uid FOR UPDATE;

  IF _coins < p_price THEN
    RAISE EXCEPTION 'insufficient coins';
  END IF;

  UPDATE public.profiles
     SET coins = _coins - p_price,
         streak_freeze_count = streak_freeze_count + (CASE WHEN p_action = 'freeze'       THEN 1 ELSE 0 END),
         double_xp_count     = double_xp_count     + (CASE WHEN p_action = 'double_xp'    THEN 1 ELSE 0 END),
         hint_count          = hint_count          + (CASE WHEN p_action = 'hints'        THEN 5 ELSE 0 END),
         double_coins_count  = double_coins_count  + (CASE WHEN p_action = 'double_coins' THEN 1 ELSE 0 END),
         gacha_tickets       = COALESCE(gacha_tickets, 0) + (CASE WHEN p_action = 'gacha' THEN 1 ELSE 0 END),
         energy              = CASE WHEN p_action = 'refill' THEN 5 ELSE energy END,
         energy_last_refill  = CASE WHEN p_action = 'refill' THEN now() ELSE energy_last_refill END
   WHERE user_id = _uid;

  RETURN jsonb_build_object('ok', true, 'coins', _coins - p_price);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.purchase_power_up(text, int) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.purchase_power_up(text, int) TO authenticated;

-- -----------------------------------------------------------------------------
-- 3. Gacha duplicate compensation. The UI promises "ซ้ำ (ได้รับเหรียญแทน)"
--    (duplicate -> coins instead) but commit_gacha_pull granted nothing on a
--    duplicate. Replace it so a duplicate credits coins by rarity.
--    Returns { ok, coins, gacha_tickets, is_new, dupe_coins }.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.commit_gacha_pull(
  p_item_id text,
  p_rarity text,
  p_use_ticket boolean,
  p_cost int
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _coins int;
  _tickets int;
  _inv jsonb;
  _is_new boolean;
  _dupe int := 0;
BEGIN
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;
  IF p_item_id IS NULL THEN
    RAISE EXCEPTION 'invalid item';
  END IF;

  SELECT COALESCE(coins, 0), COALESCE(gacha_tickets, 0), COALESCE(inventory, '[]'::jsonb)
    INTO _coins, _tickets, _inv
    FROM public.profiles WHERE user_id = _uid FOR UPDATE;

  IF p_use_ticket THEN
    IF _tickets < 1 THEN RAISE EXCEPTION 'no gacha tickets'; END IF;
    _tickets := _tickets - 1;
  ELSE
    IF p_cost IS NULL OR p_cost < 0 THEN RAISE EXCEPTION 'invalid cost'; END IF;
    IF _coins < p_cost THEN RAISE EXCEPTION 'insufficient coins'; END IF;
    _coins := _coins - p_cost;
  END IF;

  _is_new := NOT (_inv @> to_jsonb(p_item_id));

  -- Duplicate -> coin refund by rarity (honours the on-screen promise).
  IF NOT _is_new THEN
    _dupe := CASE p_rarity
               WHEN 'common' THEN 5  WHEN 'uncommon' THEN 10 WHEN 'rare' THEN 20
               WHEN 'epic' THEN 40   WHEN 'legendary' THEN 80 WHEN 'mythic' THEN 150
               ELSE 5 END;
    _coins := _coins + _dupe;
  END IF;

  UPDATE public.profiles
     SET coins = _coins,
         gacha_tickets = _tickets,
         inventory = CASE WHEN _is_new THEN _inv || to_jsonb(p_item_id) ELSE _inv END
   WHERE user_id = _uid;

  INSERT INTO public.gacha_history (user_id, item_id, rarity)
  VALUES (_uid, p_item_id, p_rarity);

  RETURN jsonb_build_object('ok', true, 'coins', _coins, 'gacha_tickets', _tickets, 'is_new', _is_new, 'dupe_coins', _dupe);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.commit_gacha_pull(text, text, boolean, int) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.commit_gacha_pull(text, text, boolean, int) TO authenticated;

-- -----------------------------------------------------------------------------
-- 4. Hot-path indexes: the friends list filters friendships by addressee_id and
--    the leaderboard sorts profiles by total_exp. Both were full scans/sorts.
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS friendships_addressee_id_idx ON public.friendships (addressee_id);
CREATE INDEX IF NOT EXISTS friendships_requester_id_idx ON public.friendships (requester_id);
CREATE INDEX IF NOT EXISTS profiles_total_exp_idx ON public.profiles (total_exp DESC);

-- -----------------------------------------------------------------------------
-- 5. increment_mission: atomic daily-mission progress + reward. Replaces the
--    client read-modify-write that (a) let a user self-write coins/XP, (b) lost
--    updates under concurrent lesson completions, and (c) double-fired the
--    x2 all-done bonus / streak from a stale in-memory closure. The reward is
--    read from the mission row (clamped) and coins/XP are applied server-side.
--    Returns { ok, found, completed, current_count, all_done, coins, exp, title }.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.increment_mission(p_type text, p_amount int DEFAULT 1)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _today date := (now() AT TIME ZONE 'Asia/Bangkok')::date;
  _m record;
  _newcount int;
  _completed boolean;
  _all_done boolean := false;
  _coins int := 0;
  _exp int := 0;
  _amt int := GREATEST(COALESCE(p_amount, 1), 1);
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;

  -- Lock the caller's incomplete mission of this type for the (server) day.
  SELECT * INTO _m FROM public.daily_missions
   WHERE user_id = _uid AND mission_date = _today
     AND mission_type = p_type AND completed = false
   ORDER BY id LIMIT 1
   FOR UPDATE;

  IF _m.id IS NULL THEN
    RETURN jsonb_build_object('ok', true, 'found', false);
  END IF;

  _newcount := LEAST(_m.current_count + _amt, _m.target_count);
  _completed := _newcount >= _m.target_count;

  UPDATE public.daily_missions
     SET current_count = _newcount,
         completed = _completed,
         completed_at = CASE WHEN _completed THEN now() ELSE completed_at END
   WHERE id = _m.id;

  IF NOT _completed THEN
    RETURN jsonb_build_object('ok', true, 'found', true, 'completed', false, 'current_count', _newcount);
  END IF;

  -- Reward from the mission row, clamped (reward columns are client-seeded today).
  _coins := LEAST(COALESCE(_m.reward_coins, 0), 50);
  _exp   := LEAST(COALESCE(_m.reward_exp, 0), 50);

  SELECT bool_and(completed) INTO _all_done
    FROM public.daily_missions
   WHERE user_id = _uid AND mission_date = _today;

  IF _all_done THEN
    _coins := _coins * 2;
    _exp := _exp * 2;
    -- Bump the mission streak at most once per day.
    UPDATE public.profiles
       SET daily_mission_streak = COALESCE(daily_mission_streak, 0) + 1,
           last_mission_complete_date = _today
     WHERE user_id = _uid
       AND COALESCE(last_mission_complete_date, DATE '1970-01-01') <> _today;
  END IF;

  UPDATE public.profiles
     SET coins = COALESCE(coins, 0) + _coins,
         total_exp = COALESCE(total_exp, 0) + _exp,
         total_missions_completed = COALESCE(total_missions_completed, 0) + 1
   WHERE user_id = _uid;

  RETURN jsonb_build_object(
    'ok', true, 'found', true, 'completed', true, 'current_count', _newcount,
    'all_done', COALESCE(_all_done, false), 'coins', _coins, 'exp', _exp, 'title', _m.mission_title
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.increment_mission(text, int) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.increment_mission(text, int) TO authenticated;
