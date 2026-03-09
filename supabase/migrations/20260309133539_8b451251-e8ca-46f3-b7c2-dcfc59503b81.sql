CREATE TABLE public.lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level integer NOT NULL DEFAULT 1,
  lesson_order integer NOT NULL DEFAULT 1,
  title text NOT NULL,
  title_thai text NOT NULL,
  vocabulary jsonb NOT NULL DEFAULT '[]'::jsonb,
  article_sentences jsonb NOT NULL DEFAULT '[]'::jsonb,
  article_translation text NOT NULL DEFAULT '',
  image_url text,
  image_prompt text,
  quiz jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(level, lesson_order)
);

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Everyone can read published lessons
CREATE POLICY "Anyone can read published lessons"
  ON public.lessons FOR SELECT
  TO public
  USING (is_published = true);

-- Track which lessons each user has completed
CREATE TABLE public.user_lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed_at timestamptz NOT NULL DEFAULT now(),
  quiz_score integer,
  quiz_total integer,
  UNIQUE(user_id, lesson_id)
);

ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON public.user_lesson_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON public.user_lesson_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);