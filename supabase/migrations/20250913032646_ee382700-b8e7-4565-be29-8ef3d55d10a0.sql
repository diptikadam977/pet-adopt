-- Create a public bucket for pet images
INSERT INTO storage.buckets (id, name, public)
VALUES ('pet-images', 'pet-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access for pet images
CREATE POLICY "Public can view pet images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'pet-images');

-- Users can upload to their own folder: {user_id}/<filename>
CREATE POLICY "Users can upload pet images to their folder"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'pet-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can update their own files
CREATE POLICY "Users can update their own pet images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'pet-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete their own files
CREATE POLICY "Users can delete their own pet images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'pet-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);