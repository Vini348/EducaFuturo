-- ============================================================================
-- SCRIPT 1: FINAL RLS SETUP - Configuração de Segurança e Políticas
-- ============================================================================
-- Este script configura todas as políticas de Row Level Security (RLS) sem recursão infinita
-- Deve ser executado PRIMEIRO no Supabase SQL Editor

-- ============================================================================
-- 1. REMOVER FUNÇÕES E POLÍTICAS ANTIGAS PROBLEMÁTICAS
-- ============================================================================
DROP FUNCTION IF EXISTS get_user_school_id() CASCADE;
DROP FUNCTION IF EXISTS save_user_onboarding(text, text, text, text, text, text, text) CASCADE;
DROP FUNCTION IF EXISTS save_user_onboarding(text, text, text, text, text, text, uuid) CASCADE;

-- Remover políticas antigas que causam recursão
DROP POLICY IF EXISTS "Users can view profiles from their school" ON profiles;
DROP POLICY IF EXISTS "Users can view school members" ON profiles;
DROP POLICY IF EXISTS "Schools are viewable by everyone" ON schools;
DROP POLICY IF EXISTS "Schools are viewable by all users" ON schools;

-- ============================================================================
-- 2. CRIAR TABELA DE ESCOLAS
-- ============================================================================
CREATE TABLE IF NOT EXISTS schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  city TEXT,
  state TEXT DEFAULT 'DF',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir todos os campi do IFB
INSERT INTO schools (name, city, state) VALUES
  ('IFB Brasília', 'Brasília', 'DF'),
  ('IFB Ceilândia', 'Ceilândia', 'DF'),
  ('IFB Gama', 'Gama', 'DF'),
  ('IFB Planaltina', 'Planaltina', 'DF'),
  ('IFB Riacho Fundo', 'Riacho Fundo', 'DF'),
  ('IFB Samambaia', 'Samambaia', 'DF'),
  ('IFB São Sebastião', 'São Sebastião', 'DF'),
  ('IFB Taguatinga', 'Taguatinga', 'DF'),
  ('IFB Taguatinga Centro', 'Taguatinga', 'DF'),
  ('IFB Recanto das Emas', 'Recanto das Emas', 'DF'),
  ('IFB Estrutural', 'Estrutural', 'DF')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- 3. ADICIONAR COLUNAS FALTANTES NA TABELA PROFILES
-- ============================================================================
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS grade_level TEXT,
ADD COLUMN IF NOT EXISTS course TEXT,
ADD COLUMN IF NOT EXISTS study_location TEXT,
ADD COLUMN IF NOT EXISTS learning_style TEXT CHECK (learning_style IN ('visual', 'auditivo', 'leitor', 'cinestésico')),
ADD COLUMN IF NOT EXISTS study_goals TEXT[],
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS total_points INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- ============================================================================
-- 4. CRIAR ÍNDICES PARA PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_school_id ON profiles(school_id);
CREATE INDEX IF NOT EXISTS idx_profiles_total_points ON profiles(total_points DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding ON profiles(onboarding_completed);

-- ============================================================================
-- 5. HABILITAR RLS NAS TABELAS
-- ============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 6. CRIAR POLÍTICAS RLS SIMPLES E SEM RECURSÃO
-- ============================================================================

-- Políticas para PROFILES
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Política para visualizar perfis da mesma escola (SEGURA - sem recursão)
CREATE POLICY "Users can view profiles from same school"
  ON profiles FOR SELECT
  USING (
    school_id = (
      SELECT school_id 
      FROM profiles 
      WHERE id = auth.uid() 
      LIMIT 1
    )
  );

-- Políticas para SCHOOLS (permissão de leitura para todos os usuários autenticados)
DROP POLICY IF EXISTS "Schools are viewable by authenticated users" ON schools;

CREATE POLICY "Schools are viewable by authenticated users"
  ON schools FOR SELECT
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- 7. CRIAR FUNÇÃO PARA AUTO-CRIAR PERFIL AO REGISTRAR
-- ============================================================================
DROP FUNCTION IF EXISTS create_profile_for_new_user() CASCADE;

CREATE OR REPLACE FUNCTION create_profile_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, updated_at)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remover trigger antigo se existir
DROP TRIGGER IF EXISTS create_profile_for_new_user ON auth.users;

-- Criar novo trigger
CREATE TRIGGER create_profile_for_new_user
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION create_profile_for_new_user();

-- ============================================================================
-- 8. CRIAR TABELA DE HISTÓRICO DE PONTOS
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_points_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  points INTEGER NOT NULL CHECK (points > 0),
  challenge_type TEXT NOT NULL,
  challenge_id TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_user_points_history_user_id ON user_points_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_points_history_created_at ON user_points_history(created_at DESC);

-- RLS para histórico de pontos
ALTER TABLE user_points_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own points history"
  ON user_points_history FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================================================
-- 9. VERIFICAÇÃO FINAL
-- ============================================================================
-- Verificar que o RLS está habilitado
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'schools', 'user_points_history')
ORDER BY tablename;
