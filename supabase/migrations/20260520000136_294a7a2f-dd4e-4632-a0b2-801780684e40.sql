CREATE OR REPLACE FUNCTION public.sync_story_progress(_entries jsonb)
RETURNS TABLE(story_id text, chapter_id text, completed_at timestamptz)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
BEGIN
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  -- Single atomic statement: insert all rows, skip conflicts, return everything
  -- now in the cloud for this user so client can reconcile in one round-trip.
  WITH input AS (
    SELECT
      (elem->>'story_id')::text   AS story_id,
      (elem->>'chapter_id')::text AS chapter_id
    FROM jsonb_array_elements(COALESCE(_entries, '[]'::jsonb)) AS elem
    WHERE elem->>'story_id' IS NOT NULL
      AND elem->>'chapter_id' IS NOT NULL
  )
  INSERT INTO public.story_progress (user_id, story_id, chapter_id)
  SELECT _uid, story_id, chapter_id FROM input
  ON CONFLICT (user_id, story_id, chapter_id) DO NOTHING;

  RETURN QUERY
  SELECT sp.story_id, sp.chapter_id, sp.completed_at
  FROM public.story_progress sp
  WHERE sp.user_id = _uid;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.sync_story_progress(jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.sync_story_progress(jsonb) TO authenticated;