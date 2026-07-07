-- =============================================================================
-- Security hardening
-- Closes three critical exploits reported in the pre-launch security review:
--   1. Any authenticated user could self-grant is_admin / un-ban / is_premium
--      because the "Users can update their own profile" policy has no column
--      restriction. We add a BEFORE UPDATE trigger that reverts privileged
--      columns for non-admin, non-service callers.
--   2. Every new signup received 999,999 coins (leftover test value in
--      handle_new_user). Reset to a sane starter amount.
--   3. gift_transactions allowed self-gifting (sender_id = receiver_id), which
--      combined with claim_gift minted unlimited coins. Add a CHECK constraint.
--
-- NOTE: This does NOT yet lock down client-side writes to coins / total_exp /
-- energy / gacha_tickets. Fully closing currency cheating requires moving those
-- mutations into SECURITY DEFINER RPCs (follow-up work). This migration removes
-- the privilege-escalation and free-money paths without breaking the current
-- client-authoritative economy.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Protect privileged profile columns from client tampering
-- -----------------------------------------------------------------------------
-- auth.uid() IS NULL  -> service-role context (edge functions); allow.
-- check_is_admin()    -> caller is an admin; allow (admin panel edits users).
-- Otherwise           -> a normal authenticated user; freeze privileged flags
--                        at their previous values so they cannot be changed.
CREATE OR REPLACE FUNCTION public.enforce_privileged_profile_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR public.check_is_admin() THEN
    RETURN NEW;
  END IF;

  -- Non-admin user: privileged columns may not change client-side.
  NEW.is_admin   := OLD.is_admin;
  NEW.is_banned  := OLD.is_banned;
  NEW.banned_at  := OLD.banned_at;
  NEW.ban_reason := OLD.ban_reason;
  NEW.is_premium := OLD.is_premium;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_privileged_profile_columns_trg ON public.profiles;
CREATE TRIGGER enforce_privileged_profile_columns_trg
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_privileged_profile_columns();

-- -----------------------------------------------------------------------------
-- 2. Sane starting coins for new users (was 999999)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, coins)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), 100);
  RETURN NEW;
END;
$function$;

-- -----------------------------------------------------------------------------
-- 3. Prevent self-gifting (blocks the infinite-coin duplication path)
-- -----------------------------------------------------------------------------
-- NOT VALID: enforced on all new rows; existing rows are not re-checked so the
-- migration cannot fail on legacy data.
ALTER TABLE public.gift_transactions
  DROP CONSTRAINT IF EXISTS gift_transactions_no_self_gift;
ALTER TABLE public.gift_transactions
  ADD CONSTRAINT gift_transactions_no_self_gift
  CHECK (sender_id <> receiver_id) NOT VALID;

-- -----------------------------------------------------------------------------
-- 4. Floor guards so currency/resource columns can never go negative
--    (defence-in-depth until the RPC refactor lands)
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_coins_non_negative;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_coins_non_negative CHECK (coins >= 0) NOT VALID;
