-- =====================================================
-- SCRIPT SQL COMPLETO - SISTEMA DE BADGES E CONQUISTAS
-- Execute este script completo no Supabase SQL Editor
-- =====================================================

-- ============================================
-- PARTE 1: LIMPAR TABELAS E FUNÇÕES EXISTENTES
-- ============================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP TRIGGER IF EXISTS update_achievements_trigger ON user_quiz_attempts CASCADE;
DROP FUNCTION IF EXISTS check_and_update_achievements(uuid) CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS get_user_school_id() CASCADE;

DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS study_streaks CASCADE;
DROP TABLE IF EXISTS user_quiz_attempts CASCADE;
DROP TABLE IF EXISTS user_points_history CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS schools CASCADE;

DROP TYPE IF EXISTS achievement_category CASCADE;
DROP TYPE IF EXISTS achievement_tier CASCADE;
DROP TYPE IF EXISTS condition_type CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- ============================================
-- PARTE 2: CRIAR TIPOS ENUM
-- ============================================

CREATE TYPE user_role AS ENUM ('user', 'admin', 'moderator');
CREATE TYPE achievement_category AS ENUM ('iniciante', 'intermediario', 'avancado', 'mestre');
CREATE TYPE achievement_tier AS ENUM ('bronze', 'prata', 'ouro', 'platina', 'diamante');
CREATE TYPE condition_type AS ENUM (
  'total_points',
  'quiz_completed',
  'flashcard_reviewed',
  'days_streak',
  'subject_mastery',
  'perfect_score',
  'study_hours'
);

-- ============================================
-- PARTE 3: CRIAR TABELA SCHOOLS
-- ============================================

CREATE TABLE IF NOT EXISTS schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  address TEXT,
  city TEXT DEFAULT 'Brasília',
  state TEXT DEFAULT 'DF',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Popular com os 11 campi do IFB
INSERT INTO schools (name, address, city) VALUES
  ('IFB - Campus Brasília', 'SGAN 610, Módulos D, E, F e G', 'Brasília'),
  ('IFB - Campus Ceilândia', 'QNN 31, Área Especial', 'Ceilândia'),
  ('IFB - Campus Gama', 'Setor Central, Área Especial', 'Gama'),
  ('IFB - Campus Planaltina', 'Rod. DF-128, Km 21', 'Planaltina'),
  ('IFB - Campus Riacho Fundo', 'Área Especial 1, QN 8', 'Riacho Fundo'),
  ('IFB - Campus Samambaia', 'QR 418, Área Especial', 'Samambaia'),
  ('IFB - Campus São Sebastião', 'Área Especial', 'São Sebastião'),
  ('IFB - Campus Taguatinga', 'QNM 40, Área Especial 01', 'Taguatinga'),
  ('IFB - Campus Taguatinga Centro', 'Pistão Sul, Setor C Norte', 'Taguatinga'),
  ('IFB - Campus Recanto das Emas', 'Área Especial Quadra 403', 'Recanto das Emas'),
  ('IFB - Campus Estrutural', 'Setor Central', 'Estrutural')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- PARTE 4: CRIAR TABELA PROFILES
-- ============================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'user',
  school_id UUID REFERENCES schools(id),
  grade_level TEXT,
  course TEXT,
  study_location TEXT,
  learning_style TEXT,
  study_goals TEXT[],
  onboarding_completed BOOLEAN DEFAULT FALSE,
  total_points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Marcar email específico como admin
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'viniciusdesousacosta903@gmail.com';

-- ============================================
-- PARTE 5: CRIAR TABELA USER_POINTS_HISTORY
-- ============================================

CREATE TABLE IF NOT EXISTS user_points_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  source TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_points_history_user ON user_points_history(user_id);

-- ============================================
-- PARTE 6: CRIAR TABELA STUDY_STREAKS
-- ============================================

CREATE TABLE IF NOT EXISTS study_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_study_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_study_streaks_user ON study_streaks(user_id);

-- ============================================
-- PARTE 7: CRIAR TABELA USER_QUIZ_ATTEMPTS
-- ============================================

CREATE TABLE IF NOT EXISTS user_quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  quiz_id TEXT NOT NULL,
  subject TEXT NOT NULL,
  questions_total INTEGER NOT NULL,
  questions_correct INTEGER NOT NULL,
  score INTEGER NOT NULL,
  accuracy DECIMAL(5,2) GENERATED ALWAYS AS (
    CASE 
      WHEN questions_total > 0 THEN (questions_correct::DECIMAL / questions_total::DECIMAL * 100)
      ELSE 0 
    END
  ) STORED,
  time_spent INTEGER,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON user_quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_subject ON user_quiz_attempts(subject);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_completed ON user_quiz_attempts(completed_at);

-- ============================================
-- PARTE 8: CRIAR TABELA ACHIEVEMENTS
-- ============================================

CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category achievement_category NOT NULL,
  tier achievement_tier NOT NULL,
  icon TEXT NOT NULL,
  requirement_type condition_type NOT NULL,
  requirement_value INTEGER NOT NULL,
  points_reward INTEGER DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PARTE 9: POPULAR CONQUISTAS (23 BADGES)
-- ============================================

INSERT INTO achievements (name, description, category, tier, icon, requirement_type, requirement_value, points_reward) VALUES
-- INICIANTE (Bronze/Prata) - 6 conquistas
('Primeiro Passo', 'Complete seu primeiro desafio', 'iniciante', 'bronze', '🎯', 'quiz_completed', 1, 50),
('Começando Bem', 'Acumule 100 pontos', 'iniciante', 'bronze', '⭐', 'total_points', 100, 75),
('Dedicação Inicial', 'Estude por 3 dias consecutivos', 'iniciante', 'bronze', '🔥', 'days_streak', 3, 75),
('Estudante Ativo', 'Complete 10 desafios', 'iniciante', 'prata', '📚', 'quiz_completed', 10, 100),
('Colecionador', 'Acumule 500 pontos', 'iniciante', 'prata', '💎', 'total_points', 500, 150),
('Semana Completa', 'Estude por 7 dias consecutivos', 'iniciante', 'prata', '📅', 'days_streak', 7, 200),

-- INTERMEDIÁRIO (Ouro/Platina) - 8 conquistas
('Dedicado', 'Complete 25 desafios', 'intermediario', 'ouro', '🏆', 'quiz_completed', 25, 250),
('Milhar', 'Acumule 1000 pontos', 'intermediario', 'ouro', '💰', 'total_points', 1000, 300),
('Maratonista', 'Estude por 15 dias consecutivos', 'intermediario', 'ouro', '🏃', 'days_streak', 15, 400),
('Expert', 'Complete 50 desafios', 'intermediario', 'platina', '🎓', 'quiz_completed', 50, 500),
('Fortuna', 'Acumule 2500 pontos', 'intermediario', 'platina', '🌟', 'total_points', 2500, 600),
('Mês Completo', 'Estude por 30 dias consecutivos', 'intermediario', 'platina', '📆', 'days_streak', 30, 750),
('Perfeição', 'Consiga 100% de acerto em um quiz', 'intermediario', 'ouro', '✨', 'perfect_score', 1, 500),
('Revisor Expert', 'Revise 100 flashcards', 'intermediario', 'ouro', '📖', 'flashcard_reviewed', 100, 300),

-- AVANÇADO (Diamante) - 5 conquistas
('Mestre', 'Complete 100 desafios', 'avancado', 'diamante', '👑', 'quiz_completed', 100, 1000),
('Rico', 'Acumule 5000 pontos', 'avancado', 'diamante', '💸', 'total_points', 5000, 1200),
('Persistente', 'Estude por 60 dias consecutivos', 'avancado', 'diamante', '🔥', 'days_streak', 60, 1500),
('Bibliotecário', 'Revise 500 flashcards', 'avancado', 'diamante', '📚', 'flashcard_reviewed', 500, 1000),
('Domínio Total', 'Alcance 100% de progresso em uma matéria', 'avancado', 'diamante', '🎯', 'subject_mastery', 100, 2000),

-- MESTRE (Elite) - 4 conquistas
('Lenda', 'Complete 200 desafios', 'mestre', 'diamante', '⚡', 'quiz_completed', 200, 2000),
('Milionário', 'Acumule 10000 pontos', 'mestre', 'diamante', '💎', 'total_points', 10000, 2500),
('Inabalável', 'Estude por 100 dias consecutivos', 'mestre', 'diamante', '🌟', 'days_streak', 100, 3000),
('Sábio', 'Alcance 50 horas de estudo', 'mestre', 'diamante', '🧠', 'study_hours', 50, 5000);

-- ============================================
-- PARTE 10: CRIAR TABELA USER_ACHIEVEMENTS
-- ============================================

CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  unlocked BOOLEAN DEFAULT FALSE,
  unlocked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_unlocked ON user_achievements(unlocked);

-- ============================================
-- PARTE 11: CRIAR FUNÇÕES AUXILIARES
-- ============================================

-- Função para obter school_id do usuário (evita recursão RLS)
CREATE OR REPLACE FUNCTION get_user_school_id()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_school UUID;
BEGIN
  SELECT school_id INTO user_school
  FROM profiles
  WHERE id = auth.uid()
  LIMIT 1;
  
  RETURN user_school;
END;
$$;

-- Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  
  RETURN NEW;
END;
$$;

-- ============================================
-- PARTE 12: FUNÇÃO DE VERIFICAÇÃO DE CONQUISTAS
-- ============================================

-- Removendo função antiga e criando versão trigger
DROP FUNCTION IF EXISTS check_and_update_achievements(UUID);

-- Função trigger para verificar conquistas automaticamente
CREATE OR REPLACE FUNCTION check_and_update_achievements()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_total_points INTEGER;
  v_quiz_count INTEGER;
  v_flashcard_count INTEGER;
  v_current_streak INTEGER;
  v_achievement RECORD;
  v_current_progress INTEGER;
  v_newly_unlocked BOOLEAN;
  v_user_id UUID;
BEGIN
  -- Pegar user_id do registro NEW
  v_user_id := NEW.user_id;
  
  -- Buscar estatísticas do usuário
  SELECT COALESCE(total_points, 0) INTO v_total_points
  FROM profiles WHERE id = v_user_id;
  
  SELECT COUNT(*) INTO v_quiz_count
  FROM user_quiz_attempts WHERE user_id = v_user_id;
  
  -- Flashcard count (placeholder)
  v_flashcard_count := 0;
  
  SELECT COALESCE(current_streak, 0) INTO v_current_streak
  FROM study_streaks WHERE user_id = v_user_id;
  
  -- Iterar sobre todas as conquistas
  FOR v_achievement IN SELECT * FROM achievements LOOP
    v_current_progress := 0;
    
    -- Calcular progresso baseado no tipo de requisito
    CASE v_achievement.requirement_type
      WHEN 'total_points' THEN
        v_current_progress := v_total_points;
      WHEN 'quiz_completed' THEN
        v_current_progress := v_quiz_count;
      WHEN 'flashcard_reviewed' THEN
        v_current_progress := v_flashcard_count;
      WHEN 'days_streak' THEN
        v_current_progress := v_current_streak;
      WHEN 'perfect_score' THEN
        SELECT COUNT(*) INTO v_current_progress
        FROM user_quiz_attempts
        WHERE user_id = v_user_id AND accuracy >= 100;
      ELSE
        v_current_progress := 0;
    END CASE;
    
    -- Verificar se já desbloqueou
    v_newly_unlocked := v_current_progress >= v_achievement.requirement_value;
    
    -- Inserir ou atualizar user_achievements
    INSERT INTO user_achievements (user_id, achievement_id, progress, unlocked, unlocked_at)
    VALUES (
      v_user_id,
      v_achievement.id,
      LEAST(v_current_progress, v_achievement.requirement_value),
      v_newly_unlocked,
      CASE WHEN v_newly_unlocked THEN NOW() ELSE NULL END
    )
    ON CONFLICT (user_id, achievement_id) DO UPDATE
    SET 
      progress = LEAST(v_current_progress, v_achievement.requirement_value),
      unlocked = v_newly_unlocked OR user_achievements.unlocked,
      unlocked_at = CASE 
        WHEN v_newly_unlocked AND NOT user_achievements.unlocked THEN NOW()
        ELSE user_achievements.unlocked_at
      END;
    
    -- Se desbloqueou agora, adicionar pontos de recompensa
    IF v_newly_unlocked THEN
      PERFORM 1 FROM user_achievements 
      WHERE user_id = v_user_id 
        AND achievement_id = v_achievement.id 
        AND unlocked = TRUE
        AND unlocked_at < NOW() - INTERVAL '1 second';
      
      IF NOT FOUND THEN
        UPDATE profiles 
        SET total_points = COALESCE(total_points, 0) + v_achievement.points_reward
        WHERE id = v_user_id;
        
        INSERT INTO user_points_history (user_id, points, source, description)
        VALUES (
          v_user_id,
          v_achievement.points_reward,
          'achievement',
          'Conquista desbloqueada: ' || v_achievement.name
        );
      END IF;
    END IF;
  END LOOP;
  
  RETURN NEW;
END;
$$;

-- ============================================
-- PARTE 13: CRIAR TRIGGERS
-- ============================================

-- Trigger para criar perfil ao registrar usuário
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Trigger para verificar conquistas após completar quiz
CREATE TRIGGER update_achievements_trigger
  AFTER INSERT ON user_quiz_attempts
  FOR EACH ROW
  EXECUTE FUNCTION check_and_update_achievements();

-- ============================================
-- PARTE 14: CONFIGURAR RLS (ROW LEVEL SECURITY)
-- ============================================

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_points_history ENABLE ROW LEVEL SECURITY;

-- Políticas para PROFILES
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view profiles from their school" ON profiles;

CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can view profiles from their school" ON profiles FOR SELECT USING (school_id = get_user_school_id());

-- Políticas para SCHOOLS
DROP POLICY IF EXISTS "Schools are viewable by everyone" ON schools;
CREATE POLICY "Schools are viewable by everyone" ON schools FOR SELECT TO authenticated USING (true);

-- Políticas para USER_QUIZ_ATTEMPTS
DROP POLICY IF EXISTS "Users can view own attempts" ON user_quiz_attempts;
DROP POLICY IF EXISTS "Users can insert own attempts" ON user_quiz_attempts;

CREATE POLICY "Users can view own attempts" ON user_quiz_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own attempts" ON user_quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para STUDY_STREAKS
DROP POLICY IF EXISTS "Users can view own streak" ON study_streaks;
DROP POLICY IF EXISTS "Users can manage own streak" ON study_streaks;

CREATE POLICY "Users can view own streak" ON study_streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own streak" ON study_streaks FOR ALL USING (auth.uid() = user_id);

-- Políticas para ACHIEVEMENTS
DROP POLICY IF EXISTS "Achievements are viewable by everyone" ON achievements;
CREATE POLICY "Achievements are viewable by everyone" ON achievements FOR SELECT TO authenticated USING (true);

-- Políticas para USER_ACHIEVEMENTS
DROP POLICY IF EXISTS "Users can view own achievements" ON user_achievements;
DROP POLICY IF EXISTS "Users can manage own achievements" ON user_achievements;

CREATE POLICY "Users can view own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own achievements" ON user_achievements FOR ALL USING (auth.uid() = user_id);

-- Políticas para USER_POINTS_HISTORY
DROP POLICY IF EXISTS "Users can view own points history" ON user_points_history;
CREATE POLICY "Users can view own points history" ON user_points_history FOR SELECT USING (auth.uid() = user_id);

-- =====================================================
-- FIM DO SCRIPT - SISTEMA COMPLETO CONFIGURADO!
-- =====================================================

-- Verificar se tudo foi criado corretamente
SELECT 'Tabelas criadas:' as status;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'schools', 'user_quiz_attempts', 'study_streaks', 'achievements', 'user_achievements', 'user_points_history');

SELECT 'Total de conquistas cadastradas:' as status, COUNT(*) as total FROM achievements;
