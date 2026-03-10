-- =============================================
-- Notifications Table
-- =============================================

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'system',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can read their own notifications
CREATE POLICY "own_notifications_select" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update (mark as read) their own notifications
CREATE POLICY "own_notifications_update" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Admin can insert notifications for anyone
CREATE POLICY "admin_notifications_insert" ON public.notifications
  FOR INSERT WITH CHECK (public.check_is_admin());

-- Admin can read all notifications
CREATE POLICY "admin_notifications_select" ON public.notifications
  FOR SELECT USING (public.check_is_admin());

-- Service role bypass for edge functions
CREATE POLICY "service_notifications_insert" ON public.notifications
  FOR INSERT WITH CHECK (true);

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
