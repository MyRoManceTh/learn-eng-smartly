
-- 1. Restrict SECURITY DEFINER trigger function from being callable via API
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- 2. Restrict profiles table: users can only read their own full profile
DROP POLICY IF EXISTS "Authenticated users can read all profiles" ON public.profiles;
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 3. Expose only safe, non-sensitive columns to other users via a view for social/leaderboard features
CREATE OR REPLACE VIEW public.public_profiles
WITH (security_invoker = true) AS
SELECT
  user_id,
  display_name,
  total_exp,
  current_streak,
  equipped,
  evolution_stage,
  lessons_completed,
  energy,
  friend_code,
  current_level
FROM public.profiles;

-- Provide a permissive SELECT policy scoped to the view's columns only.
-- The view uses security_invoker, so we need a policy that lets authenticated users
-- see other users' rows too — the view itself is what restricts columns.
CREATE POLICY "Authenticated can read public profile columns via view"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- Wait: that re-opens table access. Instead, drop and use a SECURITY DEFINER view.
DROP POLICY IF EXISTS "Authenticated can read public profile columns via view" ON public.profiles;

-- Recreate as a SECURITY DEFINER view so it bypasses RLS but only exposes safe columns
DROP VIEW IF EXISTS public.public_profiles;
CREATE VIEW public.public_profiles
WITH (security_invoker = false) AS
SELECT
  user_id,
  display_name,
  total_exp,
  current_streak,
  equipped,
  evolution_stage,
  lessons_completed,
  energy,
  friend_code,
  current_level
FROM public.profiles;

GRANT SELECT ON public.public_profiles TO authenticated;

-- 4. Storage: remove broad SELECT policy that allows listing lesson-images bucket.
-- Files remain accessible via public URL because the bucket is public.
DROP POLICY IF EXISTS "Lesson images are publicly accessible" ON storage.objects;
