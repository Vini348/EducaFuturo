-- ============================================
-- Script de Atualização: Sistema de Onboarding e Ranking
-- Versão 2.0 - Idempotente (pode ser executado múltiplas vezes)
-- ============================================

-- 1. Criar tabela de escolas (se não existir)
CREATE TABLE IF NOT EXISTS schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  city TEXT,
  state TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Inserir escolas de exemplo (ignorar se já existirem)
INSERT INTO schools (name, city, state) 
VALUES 
  ('Colégio Dom Pedro II', 'Rio de Janeiro', 'RJ'),
  ('Escola Estadual de São Paulo', 'São Paulo', 'SP'),
  ('Instituto Federal de Brasília', 'Brasília', 'DF'),
  ('Colégio Militar de Belo Horizonte', 'Belo Horizonte', 'MG'),
  ('Escola Técnica de Curitiba', 'Curitiba', 'PR')
ON CONFLICT (name) DO NOTHING;

-- 3. Adicionar colunas à tabela profiles (se não existirem)
DO $$ 
BEGIN
  -- Adicionar school_id
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='school_id') THEN
    ALTER TABLE profiles ADD COLUMN school_id UUID REFERENCES schools(id);
  END IF;

  -- Adicionar onboarding_completed
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='onboarding_completed') THEN
    ALTER TABLE profiles ADD COLUMN onboarding_completed BOOLEAN DEFAULT FALSE;
  END IF;

  -- Adicionar grade
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='grade') THEN
    ALTER TABLE profiles ADD COLUMN grade TEXT;
  END IF;

  -- Adicionar intended_course
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='intended_course') THEN
    ALTER TABLE profiles ADD COLUMN intended_course TEXT;
  END IF;

  -- Adicionar study_location
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='study_location') THEN
    ALTER TABLE profiles ADD COLUMN study_location TEXT;
  END IF;

  -- Adicionar learning_style
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='learning_style') THEN
    ALTER TABLE profiles ADD COLUMN learning_style TEXT;
  END IF;

  -- Adicionar study_goals
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='study_goals') THEN
    ALTER TABLE profiles ADD COLUMN study_goals TEXT[];
  END IF;

  -- Adicionar total_points
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='total_points') THEN
    ALTER TABLE profiles ADD COLUMN total_points INTEGER DEFAULT 0;
  END IF;

  -- Adicionar daily_streak
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='daily_streak') THEN
    ALTER TABLE profiles ADD COLUMN daily_streak INTEGER DEFAULT 0;
  END IF;

  -- Adicionar last_activity_date
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='last_activity_date') THEN
    ALTER TABLE profiles ADD COLUMN last_activity_date DATE;
  END IF;
END $$;

-- 4. Criar tabela de histórico de pontos (se não existir)
CREATE TABLE IF NOT EXISTS user_points_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  activity_type TEXT NOT NULL,
  activity_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_profiles_school_id ON profiles(school_id);
CREATE INDEX IF NOT EXISTS idx_profiles_total_points ON profiles(total_points DESC);
CREATE INDEX IF NOT EXISTS idx_points_history_user_id ON user_points_history(user_id);
CREATE INDEX IF NOT EXISTS idx_points_history_created_at ON user_points_history(created_at DESC);

-- 6. Remover políticas antigas (se existirem) e criar novas
DROP POLICY IF EXISTS "Schools are viewable by everyone" ON schools;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view profiles from their school" ON profiles;
DROP POLICY IF EXISTS "Users can view their own points history" ON user_points_history;
DROP POLICY IF EXISTS "Users can insert their own points" ON user_points_history;

-- Habilitar RLS
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_points_history ENABLE ROW LEVEL SECURITY;

-- Criar políticas
CREATE POLICY "Schools are viewable by everyone" 
  ON schools FOR SELECT 
  USING (true);

CREATE POLICY "Users can view their own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can view profiles from their school" 
  ON profiles FOR SELECT 
  USING (
    school_id IN (
      SELECT school_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own points history" 
  ON user_points_history FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own points" 
  ON user_points_history FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- 7. Criar função para atualizar pontos totais
CREATE OR REPLACE FUNCTION update_total_points()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles 
  SET total_points = total_points + NEW.points
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Remover trigger antigo (se existir) e criar novo
DROP TRIGGER IF EXISTS trigger_update_total_points ON user_points_history;

CREATE TRIGGER trigger_update_total_points
  AFTER INSERT ON user_points_history
  FOR EACH ROW
  EXECUTE FUNCTION update_total_points();

-- ============================================
-- Script concluído com sucesso!
-- ============================================
