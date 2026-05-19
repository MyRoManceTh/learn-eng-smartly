ALTER TABLE public.story_progress REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.story_progress;