-- Primeiro, remover políticas existentes para evitar conflitos
DROP POLICY IF EXISTS "Qualquer pessoa pode visualizar avatares" ON storage.objects;
DROP POLICY IF EXISTS "Usuários autenticados podem fazer upload de seus próprios avatares" ON storage.objects;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios avatares" ON storage.objects;
DROP POLICY IF EXISTS "Usuários podem excluir seus próprios avatares" ON storage.objects;

-- Criar políticas para o bucket de avatares
-- Para SELECT (download)
CREATE POLICY "Qualquer pessoa pode visualizar avatares"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Para INSERT (upload)
CREATE POLICY "Usuários autenticados podem fazer upload de seus próprios avatares"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  ((auth.uid() = owner) OR (auth.uid() IS NOT NULL))
);

-- Para UPDATE
CREATE POLICY "Usuários podem atualizar seus próprios avatares"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  auth.uid() = owner
);

-- Para DELETE
CREATE POLICY "Usuários podem excluir seus próprios avatares"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' AND
  auth.uid() = owner
);
