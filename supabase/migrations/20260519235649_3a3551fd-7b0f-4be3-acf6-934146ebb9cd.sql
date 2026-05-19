CREATE TABLE public.story_progress (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  story_id text NOT NULL,
  chapter_id text NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, story_id, chapter_id)
);

CREATE INDEX idx_story_progress_user ON public.story_progress(user_id);

ALTER TABLE public.story_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own_story_progress_select" ON public.story_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "own_story_progress_insert" ON public.story_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "own_story_progress_delete" ON public.story_progress
  FOR DELETE USING (auth.uid() = user_id);