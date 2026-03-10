-- =============================================
-- Leaderboard Cache Table
-- =============================================

CREATE TABLE IF NOT EXISTS public.leaderboard_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  period TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL,
  total_exp INTEGER NOT NULL DEFAULT 0,
  display_name TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(period, user_id)
);

ALTER TABLE public.leaderboard_cache ENABLE ROW LEVEL SECURITY;

-- Everyone can read the leaderboard
CREATE POLICY "leaderboard_public_read" ON public.leaderboard_cache
  FOR SELECT USING (true);

-- Only admin can modify
CREATE POLICY "admin_leaderboard_all" ON public.leaderboard_cache
  FOR ALL USING (public.check_is_admin());
