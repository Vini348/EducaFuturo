-- Criar um bucket para armazenar os anexos do fórum
INSERT INTO storage.buckets (id, name, public)
VALUES ('forum_attachments', 'Forum Attachments', false)
ON CONFLICT (id) DO NOTHING;

-- Políticas para o bucket de anexos do fórum
CREATE POLICY "Allow authenticated users to upload forum attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'forum_attachments' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Allow users to update their own forum attachments"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'forum_attachments' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Allow users to delete their own forum attachments"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'forum_attachments' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Allow public read access to forum attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'forum_attachments');
