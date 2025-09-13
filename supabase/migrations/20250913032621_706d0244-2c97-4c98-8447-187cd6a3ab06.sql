-- Create a public bucket for pet images (idempotent)
insert into storage.buckets (id, name, public)
values ('pet-images', 'pet-images', true)
on conflict (id) do nothing;

-- Policies for pet-images bucket
-- Public read access
create policy if not exists "Public can view pet images"
on storage.objects
for select
using (bucket_id = 'pet-images');

-- Users can upload to their own folder: {user_id}/<filename>
create policy if not exists "Users can upload pet images to their folder"
on storage.objects
for insert
with check (
  bucket_id = 'pet-images'
  and auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can update their own files
create policy if not exists "Users can update their own pet images"
on storage.objects
for update
using (
  bucket_id = 'pet-images'
  and auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete their own files
create policy if not exists "Users can delete their own pet images"
on storage.objects
for delete
using (
  bucket_id = 'pet-images'
  and auth.uid()::text = (storage.foldername(name))[1]
);
