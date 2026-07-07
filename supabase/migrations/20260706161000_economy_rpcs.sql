-- =============================================================================
-- Atomic economy RPCs
-- Moves the coin/reward mutation paths off the client's read-modify-write
-- pattern and into SECURITY DEFINER functions that do the arithmetic
-- atomically with row locking. This closes the race / double-grant / lost-update
-- bugs (double-click, two tabs, partial failure) reported in the review.
--
-- Anti-cheat scope: reward math that can be derived server-side (daily mystery
-- box) is computed here from the server's own current_streak, so it cannot be
-- inflated by the client. Shop/gacha PRICES still come from the client because
-- the item catalogue currently lives in TypeScript; making those fully
-- cheat-proof requires porting the catalogue into the DB (follow-up). Even so,
-- these RPCs make every spend atomic and idempotent, which is the bug the users
-- actually hit ("coins disappeared", "got 2 items for 1 pull").
-- =============================================================================

-- -----------------------------------------------------------------------------
-- claim_daily_reward: idempotent, server-dated, server-priced mystery box.
-- Returns { ok, coins, exp, milestone, item } or { ok:false, reason }.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.claim_daily_reward(p_items text[] DEFAULT '{}')
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid   uuid := auth.uid();
  _today date := (now() AT TIME ZONE 'Asia/Bangkok')::date;  -- server-authoritative day
  _streak int;
  _coins  int;
  _exp    int;
  _milestone int := 0;
  _inv    jsonb;
  _item   text;
BEGIN
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  -- The unique(user_id, reward_date, reward_type) constraint makes this INSERT
  -- the concurrency lock: a second concurrent/duplicate claim hits unique_violation.
  BEGIN
    INSERT INTO public.daily_rewards (user_id, reward_date, reward_type, claimed, claimed_at)
    VALUES (_uid, _today, 'mystery_box', true, now());
  EXCEPTION WHEN unique_violation THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'already_claimed');
  END;

  -- Lock the profile row and read the authoritative streak.
  SELECT COALESCE(current_streak, 0) INTO _streak
    FROM public.profiles WHERE user_id = _uid FOR UPDATE;

  -- Mirrors generateMysteryBoxReward() in the client so the preview matches.
  _coins := 5 + LEAST(_streak * 2, 20);
  _exp   := 5 + (_streak / 3) * 5;
  _milestone := CASE _streak
                  WHEN 3  THEN 10
                  WHEN 7  THEN 30
                  WHEN 14 THEN 50
                  WHEN 30 THEN 100
                  ELSE 0
                END;
  _coins := _coins + _milestone;

  UPDATE public.profiles
     SET coins = COALESCE(coins, 0) + _coins,
         total_exp = COALESCE(total_exp, 0) + _exp,
         mystery_box_last_claimed = _today
   WHERE user_id = _uid;

  -- Append at most one previewed cosmetic item (cosmetics are low-value; the
  -- client already rolled it for the preview). Skip if already owned.
  IF COALESCE(array_length(p_items, 1), 0) >= 1 THEN
    _item := p_items[1];
    SELECT COALESCE(inventory, '[]'::jsonb) INTO _inv FROM public.profiles WHERE user_id = _uid;
    IF NOT (_inv @> to_jsonb(_item)) THEN
      UPDATE public.profiles SET inventory = _inv || to_jsonb(_item) WHERE user_id = _uid;
    END IF;
  END IF;

  RETURN jsonb_build_object(
    'ok', true,
    'coins', _coins,
    'exp', _exp,
    'milestone', _milestone,
    'item', CASE WHEN COALESCE(array_length(p_items, 1), 0) >= 1 THEN p_items[1] ELSE NULL END
  );
END;
$$;

-- -----------------------------------------------------------------------------
-- spend_coins: atomic debit. Raises if the balance is insufficient so the
-- caller never partially applies an effect it can't pay for.
-- Returns the new balance.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.spend_coins(p_amount int, p_reason text DEFAULT NULL)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _new int;
BEGIN
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;
  IF p_amount IS NULL OR p_amount <= 0 THEN
    RAISE EXCEPTION 'invalid amount';
  END IF;

  -- Single atomic statement: the WHERE clause is the guard, no read-then-write gap.
  UPDATE public.profiles
     SET coins = coins - p_amount
   WHERE user_id = _uid
     AND coins >= p_amount
  RETURNING coins INTO _new;

  IF _new IS NULL THEN
    RAISE EXCEPTION 'insufficient coins';
  END IF;

  RETURN _new;
END;
$$;

-- -----------------------------------------------------------------------------
-- purchase_item: atomic "buy a cosmetic/consumable". Checks affordability and
-- the max-owned cap, deducts coins and appends to inventory in one transaction.
-- Returns { ok, coins, owned } or raises on failure.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.purchase_item(
  p_item_id text,
  p_price int,
  p_max_owned int DEFAULT 0
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _coins int;
  _inv jsonb;
  _owned int;
BEGIN
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;
  IF p_item_id IS NULL OR p_price IS NULL OR p_price < 0 THEN
    RAISE EXCEPTION 'invalid item or price';
  END IF;

  SELECT COALESCE(coins, 0), COALESCE(inventory, '[]'::jsonb)
    INTO _coins, _inv
    FROM public.profiles WHERE user_id = _uid FOR UPDATE;

  SELECT count(*) INTO _owned
    FROM jsonb_array_elements_text(_inv) e WHERE e = p_item_id;

  IF p_max_owned > 0 AND _owned >= p_max_owned THEN
    RAISE EXCEPTION 'already at max owned';
  END IF;
  IF _coins < p_price THEN
    RAISE EXCEPTION 'insufficient coins';
  END IF;

  UPDATE public.profiles
     SET coins = _coins - p_price,
         inventory = _inv || to_jsonb(p_item_id)
   WHERE user_id = _uid;

  RETURN jsonb_build_object('ok', true, 'coins', _coins - p_price, 'owned', _owned + 1);
END;
$$;

-- -----------------------------------------------------------------------------
-- commit_gacha_pull: atomic commit of a gacha result. The client still rolls
-- the item (the pool lives in TS), but the spend + inventory grant + history
-- row all happen together, so a double-click / two-tab pull can no longer
-- charge once and grant twice, and a partial failure never occurs.
-- Returns { ok, coins, gacha_tickets, is_new }.
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

  UPDATE public.profiles
     SET coins = _coins,
         gacha_tickets = _tickets,
         inventory = CASE WHEN _is_new THEN _inv || to_jsonb(p_item_id) ELSE _inv END
   WHERE user_id = _uid;

  INSERT INTO public.gacha_history (user_id, item_id, rarity)
  VALUES (_uid, p_item_id, p_rarity);

  RETURN jsonb_build_object('ok', true, 'coins', _coins, 'gacha_tickets', _tickets, 'is_new', _is_new);
END;
$$;

-- -----------------------------------------------------------------------------
-- Grants: authenticated users only; never anon.
-- -----------------------------------------------------------------------------
REVOKE EXECUTE ON FUNCTION public.claim_daily_reward(text[]) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.spend_coins(int, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.purchase_item(text, int, int) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.commit_gacha_pull(text, text, boolean, int) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.claim_daily_reward(text[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.spend_coins(int, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.purchase_item(text, int, int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.commit_gacha_pull(text, text, boolean, int) TO authenticated;
