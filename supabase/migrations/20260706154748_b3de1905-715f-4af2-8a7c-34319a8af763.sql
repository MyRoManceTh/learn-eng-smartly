
CREATE OR REPLACE FUNCTION public.get_public_profiles(_ids uuid[])
RETURNS TABLE (
  user_id uuid,
  display_name text,
  total_exp integer,
  current_streak integer,
  equipped jsonb,
  evolution_stage integer,
  lessons_completed integer,
  energy integer,
  friend_code text,
  current_level integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.user_id, p.display_name, p.total_exp, p.current_streak,
         p.equipped, p.evolution_stage, p.lessons_completed, p.energy,
         p.friend_code, p.current_level
  FROM public.profiles p
  WHERE p.user_id = ANY(_ids)
$$;

CREATE OR REPLACE FUNCTION public.get_user_id_by_friend_code(_code text)
RETURNS TABLE (user_id uuid, display_name text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.user_id, p.display_name
  FROM public.profiles p
  WHERE p.friend_code = _code
  LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.get_leaderboard(_limit integer DEFAULT 100)
RETURNS TABLE (
  user_id uuid,
  display_name text,
  total_exp integer,
  current_streak integer,
  equipped jsonb,
  evolution_stage integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.user_id, p.display_name, p.total_exp, p.current_streak,
         p.equipped, p.evolution_stage
  FROM public.profiles p
  WHERE p.display_name IS NOT NULL
  ORDER BY p.total_exp DESC NULLS LAST
  LIMIT COALESCE(_limit, 100)
$$;

REVOKE EXECUTE ON FUNCTION public.get_public_profiles(uuid[]) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_user_id_by_friend_code(text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_leaderboard(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_public_profiles(uuid[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_id_by_friend_code(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_leaderboard(integer) TO authenticated;
