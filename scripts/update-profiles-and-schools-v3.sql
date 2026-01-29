-- Script de atualização do banco de dados para Sistema de Onboarding e Ranking
-- Versão 3: Corrigido e com campi do IFB

-- 1. Criar tabela de escolas se não existir
CREATE TABLE IF NOT EXISTS schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Adicionar constraint UNIQUE na coluna name se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'schools_name_key' 
    AND conrelid = 'schools'::regclass
  ) THEN
    ALTER TABLE schools ADD CONSTRAINT schools_name_key UNIQUE (name);
  END IF;
END $$;

-- 2. Adicionar novos campos à tabela profiles se não existirem
DO $$ 
BEGIN
  -- school_id
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'profiles' AND column_name = 'school_id') THEN
    ALTER TABLE profiles ADD COLUMN school_id UUID REFERENCES schools(id);
  END IF;
  
  -- grade (série)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'profiles' AND column_name = 'grade') THEN
    ALTER TABLE profiles ADD COLUMN grade TEXT;
  END IF;
  
  -- intended_course (curso pretendido)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'profiles' AND column_name = 'intended_course') THEN
    ALTER TABLE profiles ADD COLUMN intended_course TEXT;
  END IF;
  
  -- study_location (local de estudo preferido)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'profiles' AND column_name = 'study_location') THEN
    ALTER TABLE profiles ADD COLUMN study_location TEXT;
  END IF;
  
  -- learning_style (estilo de aprendizagem)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'profiles' AND column_name = 'learning_style') THEN
    ALTER TABLE profiles ADD COLUMN learning_style TEXT;
  END IF;
  
  -- study_goals (objetivos de estudo)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'profiles' AND column_name = 'study_goals') THEN
    ALTER TABLE profiles ADD COLUMN study_goals TEXT[];
  END IF;
  
  -- onboarding_completed
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'profiles' AND column_name = 'onboarding_completed') THEN
    ALTER TABLE profiles ADD COLUMN onboarding_completed BOOLEAN DEFAULT FALSE;
  END IF;
  
  -- total_points
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'profiles' AND column_name = 'total_points') THEN
    ALTER TABLE profiles ADD COLUMN total_points INTEGER DEFAULT 0;
  END IF;
  
  -- avatar_url
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'profiles' AND column_name = 'avatar_url') THEN
    ALTER TABLE profiles ADD COLUMN avatar_url TEXT;
  END IF;
END $$;

-- 3. Criar tabela de histórico de pontos se não existir
CREATE TABLE IF NOT EXISTS user_points_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  reason TEXT NOT NULL,
  challenge_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_user_points_history_user_id ON user_points_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_points_history_created_at ON user_points_history(created_at);

-- 4. Inserir campi do IFB (Instituto Federal de Brasília)
INSERT INTO schools (name, city, state) VALUES
  ('IFB - Campus Brasília', 'Brasília', 'DF'),
  ('IFB - Campus Ceilândia', 'Ceilândia', 'DF'),
  ('IFB - Campus Gama', 'Gama', 'DF'),
  ('IFB - Campus Planaltina', 'Planaltina', 'DF'),
  ('IFB - Campus Riacho Fundo', 'Riacho Fundo', 'DF'),
  ('IFB - Campus Samambaia', 'Samambaia', 'DF'),
  ('IFB - Campus São Sebastião', 'São Sebastião', 'DF'),
  ('IFB - Campus Taguatinga', 'Taguatinga', 'DF'),
  ('IFB - Campus Taguatinga Centro', 'Taguatinga', 'DF'),
  ('IFB - Campus Recanto das Emas', 'Recanto das Emas', 'DF'),
  ('IFB - Campus Estrutural', 'Estrutural', 'DF')
ON CONFLICT (name) DO NOTHING;

-- 5. Criar ou substituir função para atualizar pontos totais
CREATE OR REPLACE FUNCTION update_total_points()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET total_points = (
    SELECT COALESCE(SUM(points), 0)
    FROM user_points_history
    WHERE user_id = NEW.user_id
  )
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Criar trigger se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'trigger_update_total_points'
  ) THEN
    CREATE TRIGGER trigger_update_total_points
    AFTER INSERT ON user_points_history
    FOR EACH ROW
    EXECUTE FUNCTION update_total_points();
  END IF;
END $$;

-- 7. Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Schools are viewable by everyone" ON schools;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view profiles from their school" ON profiles;
DROP POLICY IF EXISTS "Users can view their own points history" ON user_points_history;
DROP POLICY IF EXISTS "Users can insert their own points" ON user_points_history;

-- 8. Habilitar RLS nas tabelas
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_points_history ENABLE ROW LEVEL SECURITY;

-- 9. Criar políticas de segurança
-- Políticas para schools
CREATE POLICY "Schools are viewable by everyone"
  ON schools FOR SELECT
  USING (true);

-- Políticas para profiles
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

-- Políticas para user_points_history
CREATE POLICY "Users can view their own points history"
  ON user_points_history FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own points"
  ON user_points_history FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- 10. Criar índices adicionais para performance
CREATE INDEX IF NOT EXISTS idx_profiles_school_id ON profiles(school_id);
CREATE INDEX IF NOT EXISTS idx_profiles_total_points ON profiles(total_points DESC);

-- Mensagem de sucesso
DO $$ 
BEGIN
  RAISE NOTICE 'Script executado com sucesso! Tabelas e políticas configuradas.';
  RAISE NOTICE 'Campi do IFB adicionados: Brasília, Ceilândia, Gama, Planaltina, Riacho Fundo, Samambaia, São Sebastião, Taguatinga, Taguatinga Centro, Recanto das Emas, Estrutural';
END $$;
