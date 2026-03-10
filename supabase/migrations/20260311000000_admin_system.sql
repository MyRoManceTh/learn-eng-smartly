-- =============================================
-- Admin System: Role & Ban columns + RLS policies
-- =============================================

-- 1. Add admin & ban columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS banned_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS ban_reason TEXT;

-- 2. SQL function to check if current user is admin
CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 3. Admin RLS policies

-- Profiles: admin can read all
CREATE POLICY "admin_profiles_select" ON public.profiles
  FOR SELECT USING (public.check_is_admin());

-- Profiles: admin can update all
CREATE POLICY "admin_profiles_update" ON public.profiles
  FOR UPDATE USING (public.check_is_admin());

-- Lessons: admin full CRUD
CREATE POLICY "admin_lessons_all" ON public.lessons
  FOR ALL USING (public.check_is_admin());

-- Events: admin can manage
CREATE POLICY "admin_events_all" ON public.events
  FOR ALL USING (public.check_is_admin());

-- Analytics: admin can read all
CREATE POLICY "admin_analytics_select" ON public.analytics_events
  FOR SELECT USING (public.check_is_admin());

-- Daily missions: admin can read all
CREATE POLICY "admin_daily_missions_select" ON public.daily_missions
  FOR SELECT USING (public.check_is_admin());

-- Learning history: admin can read all
CREATE POLICY "admin_learning_history_select" ON public.learning_history
  FOR SELECT USING (public.check_is_admin());

-- Gacha history: admin can read all
CREATE POLICY "admin_gacha_history_select" ON public.gacha_history
  FOR SELECT USING (public.check_is_admin());

-- Friendships: admin can read all
CREATE POLICY "admin_friendships_select" ON public.friendships
  FOR SELECT USING (public.check_is_admin());
