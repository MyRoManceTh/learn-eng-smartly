INSERT INTO storage.buckets (id, name, public) VALUES ('lesson-images', 'lesson-images', true);

CREATE POLICY "Lesson images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'lesson-images');

CREATE POLICY "Service role can upload lesson images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'lesson-images');