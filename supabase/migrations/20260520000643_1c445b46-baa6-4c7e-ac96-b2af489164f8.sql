-- 1) Normalized unique index so (A,B) and (B,A) count as the same friendship
CREATE UNIQUE INDEX IF NOT EXISTS friendships_unique_pair_idx
  ON public.friendships (
    LEAST(requester_id, addressee_id),
    GREATEST(requester_id, addressee_id)
  );

-- 2) Atomic gift claim
CREATE OR REPLACE FUNCTION public.claim_gift(_gift_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _gift record;
  _inv jsonb;
BEGIN
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  -- Atomically mark as claimed; row-lock prevents double-claim.
  -- The RLS policy on gift_transactions already restricts to receiver_id = auth.uid()
  -- for UPDATE, but we re-check here for defense-in-depth.
  UPDATE public.gift_transactions
     SET claimed = true
   WHERE id = _gift_id
     AND receiver_id = _uid
     AND claimed = false
  RETURNING id, coins, item_id, sender_id INTO _gift;

  IF _gift.id IS NULL THEN
    -- Either gift doesn't exist, not ours, or already claimed.
    RETURN jsonb_build_object('ok', false, 'reason', 'already_claimed');
  END IF;

  -- Apply rewards in the same transaction. If anything below raises,
  -- the UPDATE above is rolled back too -> gift stays unclaimed.
  IF _gift.item_id = 'energy' THEN
    UPDATE public.profiles
       SET energy = LEAST(5, COALESCE(energy, 5) + 1),
           coins  = COALESCE(coins, 0) + COALESCE(_gift.coins, 0)
     WHERE user_id = _uid;
  ELSIF _gift.item_id IS NOT NULL THEN
    SELECT COALESCE(inventory, '[]'::jsonb) INTO _inv
      FROM public.profiles WHERE user_id = _uid;

    UPDATE public.profiles
       SET inventory = _inv || to_jsonb(_gift.item_id),
           coins     = COALESCE(coins, 0) + COALESCE(_gift.coins, 0)
     WHERE user_id = _uid;
  ELSIF COALESCE(_gift.coins, 0) > 0 THEN
    UPDATE public.profiles
       SET coins = COALESCE(coins, 0) + _gift.coins
     WHERE user_id = _uid;
  END IF;

  RETURN jsonb_build_object(
    'ok', true,
    'coins', COALESCE(_gift.coins, 0),
    'item_id', _gift.item_id
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.claim_gift(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_gift(uuid) TO authenticated;