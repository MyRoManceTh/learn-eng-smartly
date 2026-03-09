-- =============================================
-- Dopamine Loop System: Migration
-- =============================================

-- Daily Rewards: กล่องสุ่มรางวัลประจำวัน
CREATE TABLE IF NOT EXISTS public.daily_rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_date DATE NOT NULL DEFAULT CURRENT_DATE,
  reward_type TEXT NOT NULL,
  reward_data JSONB NOT NULL DEFAULT '{}',
  claimed BOOLEAN DEFAULT FALSE,
  claimed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, reward_date, reward_type)
);

-- Daily Missions: ภารกิจประจำวัน
CREATE TABLE IF NOT EXISTS public.daily_missions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mission_date DATE NOT NULL DEFAULT CURRENT_DATE,
  mission_type TEXT NOT NULL,
  mission_title TEXT NOT NULL,
  target_count INT NOT NULL DEFAULT 1,
  current_count INT NOT NULL DEFAULT 0,
  reward_coins INT DEFAULT 0,
  reward_exp INT DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, mission_date, mission_type)
);

-- Gacha History: ประวัติการสุ่มกาชา
CREATE TABLE IF NOT EXISTS public.gacha_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,
  rarity TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Friendships: ระบบเพื่อน
CREATE TABLE IF NOT EXISTS public.friendships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  addressee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(requester_id, addressee_id),
  CHECK(requester_id != addressee_id)
);

-- Gift Transactions: ส่งของขวัญ
CREATE TABLE IF NOT EXISTS public.gift_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id TEXT,
  coins INT DEFAULT 0,
  message TEXT,
  claimed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quiz Challenges: ท้าดวล
CREATE TABLE IF NOT EXISTS public.quiz_challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  challenger_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  opponent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id),
  challenger_score INT,
  opponent_score INT,
  status TEXT DEFAULT 'pending',
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Season Pass: Season pass รายเดือน
CREATE TABLE IF NOT EXISTS public.season_pass (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  season_month TEXT NOT NULL,
  current_tier INT DEFAULT 0,
  exp_earned INT DEFAULT 0,
  rewards_claimed JSONB DEFAULT '[]',
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, season_month)
);

-- Events: อีเว้นท์จำกัดเวลา
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_thai TEXT NOT NULL,
  description TEXT,
  theme TEXT,
  exclusive_items JSONB DEFAULT '[]',
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics Events: ติดตามพฤติกรรม
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_analytics_type_date ON analytics_events(event_type, created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_user ON analytics_events(user_id, created_at);

-- =============================================
-- Profiles: เพิ่ม columns ใหม่
-- =============================================
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS daily_mission_streak INT DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_mission_complete_date DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS mystery_box_last_claimed DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS evolution_stage INT DEFAULT 1;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_free_gacha DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gacha_tickets INT DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS energy INT DEFAULT 5;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS energy_last_refill TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS total_missions_completed INT DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS friend_code TEXT;

-- Generate unique friend code for existing profiles
UPDATE public.profiles SET friend_code = UPPER(SUBSTRING(MD5(user_id::text) FROM 1 FOR 6))
WHERE friend_code IS NULL;

-- =============================================
-- RLS Policies
-- =============================================

-- daily_rewards
ALTER TABLE public.daily_rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_rewards_select" ON public.daily_rewards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own_rewards_insert" ON public.daily_rewards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_rewards_update" ON public.daily_rewards FOR UPDATE USING (auth.uid() = user_id);

-- daily_missions
ALTER TABLE public.daily_missions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_missions_select" ON public.daily_missions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own_missions_insert" ON public.daily_missions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_missions_update" ON public.daily_missions FOR UPDATE USING (auth.uid() = user_id);

-- gacha_history
ALTER TABLE public.gacha_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_gacha_select" ON public.gacha_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own_gacha_insert" ON public.gacha_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- friendships
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read_own_friendships" ON public.friendships FOR SELECT
  USING (auth.uid() = requester_id OR auth.uid() = addressee_id);
CREATE POLICY "create_friend_requests" ON public.friendships FOR INSERT
  WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "update_friend_status" ON public.friendships FOR UPDATE
  USING (auth.uid() = addressee_id OR auth.uid() = requester_id);

-- gift_transactions
ALTER TABLE public.gift_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read_own_gifts" ON public.gift_transactions FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "send_gifts" ON public.gift_transactions FOR INSERT
  WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "claim_gifts" ON public.gift_transactions FOR UPDATE
  USING (auth.uid() = receiver_id);

-- quiz_challenges
ALTER TABLE public.quiz_challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read_own_challenges" ON public.quiz_challenges FOR SELECT
  USING (auth.uid() = challenger_id OR auth.uid() = opponent_id);
CREATE POLICY "create_challenges" ON public.quiz_challenges FOR INSERT
  WITH CHECK (auth.uid() = challenger_id);
CREATE POLICY "update_challenges" ON public.quiz_challenges FOR UPDATE
  USING (auth.uid() = challenger_id OR auth.uid() = opponent_id);

-- season_pass
ALTER TABLE public.season_pass ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_season_pass" ON public.season_pass FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own_season_pass_insert" ON public.season_pass FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_season_pass_update" ON public.season_pass FOR UPDATE USING (auth.uid() = user_id);

-- events (read-only for all)
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "events_read_all" ON public.events FOR SELECT USING (true);

-- analytics_events
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_analytics_insert" ON public.analytics_events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_analytics_select" ON public.analytics_events FOR SELECT USING (auth.uid() = user_id);

-- Leaderboard: ให้อ่าน profiles ของคนอื่นได้ (สำหรับ leaderboard)
-- profiles already has SELECT policy; we'll query with service key or adjust
