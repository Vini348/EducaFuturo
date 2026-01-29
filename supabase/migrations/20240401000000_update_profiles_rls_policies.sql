-- Remover políticas existentes para a tabela profiles
DROP POLICY IF EXISTS "Usuários podem ver seus próprios perfis" ON profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios perfis" ON profiles;
DROP POLICY IF EXISTS "Usuários podem inserir seus próprios perfis" ON profiles;
DROP POLICY IF EXISTS "Perfis públicos são visíveis para todos" ON profiles;

-- Habilitar RLS na tabela profiles (caso ainda não esteja habilitado)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir que usuários vejam seus próprios perfis
CREATE POLICY "Usuários podem ver seus próprios perfis"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Criar política para permitir que usuários atualizem seus próprios perfis
CREATE POLICY "Usuários podem atualizar seus próprios perfis"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Criar política para permitir que usuários insiram seus próprios perfis
CREATE POLICY "Usuários podem inserir seus próprios perfis"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Criar política para permitir que usuários vejam perfis públicos
CREATE POLICY "Perfis públicos são visíveis para todos"
ON profiles FOR SELECT
USING (true);

-- Adicionar colunas para preferências de estudo e notificação
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS study_preferences JSONB;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notification_preferences JSONB;

-- Atualizar políticas RLS para permitir atualização dessas colunas
CREATE POLICY "Usuários podem atualizar suas próprias preferências"
ON profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Configurar políticas para o bucket de armazenamento 'avatars'
-- Nota: Isso deve ser executado via interface do Supabase ou API de administração
