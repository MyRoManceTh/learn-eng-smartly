-- =============================================
-- Skill Tree System: Placement Test + Branching Skill Tree
-- =============================================

-- Placement Test Results: ผลการทดสอบวัดระดับ
CREATE TABLE IF NOT EXISTS public.placement_test_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  overall_level INT NOT NULL,
  grammar_score INT NOT NULL DEFAULT 0,
  vocabulary_score INT NOT NULL DEFAULT 0,
  reading_score INT NOT NULL DEFAULT 0,
  listening_score INT NOT NULL DEFAULT 0,
  total_score INT NOT NULL DEFAULT 0,
  total_questions INT NOT NULL DEFAULT 16,
  detail JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Skill Tree Progress: ความก้าวหน้าใน Skill Tree
CREATE TABLE IF NOT EXISTS public.skill_tree_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  node_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  path_id TEXT NOT NULL DEFAULT 'core',
  quiz_score INT,
  quiz_total INT,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, node_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_skill_tree_user ON skill_tree_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_tree_module ON skill_tree_progress(user_id, module_id);
CREATE INDEX IF NOT EXISTS idx_skill_tree_path ON skill_tree_progress(user_id, path_id);
CREATE INDEX IF NOT EXISTS idx_placement_user ON placement_test_results(user_id);

-- =============================================
-- Profiles: เพิ่ม columns ใหม่
-- =============================================
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS placement_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS placement_level INT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS active_path TEXT DEFAULT 'core';

-- =============================================
-- RLS Policies
-- =============================================

-- placement_test_results
ALTER TABLE public.placement_test_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_placement_select" ON public.placement_test_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own_placement_insert" ON public.placement_test_results FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_placement_update" ON public.placement_test_results FOR UPDATE USING (auth.uid() = user_id);

-- skill_tree_progress
ALTER TABLE public.skill_tree_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_skill_tree_select" ON public.skill_tree_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own_skill_tree_insert" ON public.skill_tree_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_skill_tree_update" ON public.skill_tree_progress FOR UPDATE USING (auth.uid() = user_id);
