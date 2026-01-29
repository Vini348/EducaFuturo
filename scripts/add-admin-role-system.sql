-- ============================================================================
-- SISTEMA DE ROLES E BADGE ADMIN
-- ============================================================================
-- Este script adiciona suporte para roles de usuário com badge ADMIN visível

-- ============================================================================
-- 1. ADICIONAR COLUNA ROLE NA TABELA PROFILES
-- ============================================================================
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('user', 'admin', 'moderator');
  END IF;
END $$;

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'user';

-- Criar índice para consultas rápidas por role
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- ============================================================================
-- 2. DEFINIR ADMIN PARA O EMAIL ESPECÍFICO
-- ============================================================================
UPDATE profiles
SET role = 'admin'
WHERE email = 'viniciusdesousacosta903@gmail.com';

-- ============================================================================
-- 3. ATUALIZAR POLÍTICAS RLS PARA PERMITIR VISUALIZAÇÃO DE ROLE
-- ============================================================================

-- Permitir que todos os usuários autenticados vejam o role de outros usuários
DROP POLICY IF EXISTS "Users can view profiles from same school" ON profiles;

CREATE POLICY "Users can view profiles from same school"
  ON profiles FOR SELECT
  USING (
    auth.uid() = id OR
    school_id = (
      SELECT school_id 
      FROM profiles 
      WHERE id = auth.uid() 
      LIMIT 1
    )
  );

-- ============================================================================
-- 4. CRIAR FUNÇÃO PARA VERIFICAR SE USUÁRIO É ADMIN
-- ============================================================================
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 5. VERIFICAÇÃO FINAL
-- ============================================================================
SELECT email, role 
FROM profiles 
WHERE email = 'viniciusdesousacosta903@gmail.com';
