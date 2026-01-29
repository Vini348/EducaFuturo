-- ============================================================================
-- SCRIPT 2: COMPLETE SCHEMA SETUP - Criação do Schema Completo
-- ============================================================================
-- Este script cria todas as tabelas adicionais necessárias para o sistema
-- Deve ser executado DEPOIS de executar final-rls-setup.sql

-- ============================================================================
-- 1. TABELA DE TENTATIVAS DE QUIZ/DESAFIOS
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  challenge_id TEXT NOT NULL,
  challenge_title TEXT,
  difficulty TEXT CHECK (difficulty IN ('fácil', 'médio', 'difícil')),
  correct_answers INTEGER NOT NULL CHECK (correct_answers >= 0),
  total_questions INTEGER NOT NULL CHECK (total_questions > 0),
  accuracy NUMERIC(5,2) NOT NULL CHECK (accuracy >= 0 AND accuracy <= 100),
  time_spent_seconds INTEGER CHECK (time_spent_seconds >= 0),
  points_earned INTEGER DEFAULT 0 CHECK (points_earned >= 0),
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_user_quiz_attempts_user_id ON user_quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_quiz_attempts_challenge_id ON user_quiz_attempts(challenge_id);
CREATE INDEX IF NOT EXISTS idx_user_quiz_attempts_completed_at ON user_quiz_attempts(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_quiz_attempts_user_completed ON user_quiz_attempts(user_id, completed_at DESC);

-- Habilitar RLS
ALTER TABLE user_quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quiz attempts"
  ON user_quiz_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz attempts"
  ON user_quiz_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 2. TRIGGER PARA ATUALIZAR PONTOS TOTAIS
-- ============================================================================
DROP FUNCTION IF EXISTS update_user_total_points() CASCADE;

CREATE OR REPLACE FUNCTION update_user_total_points()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET 
    total_points = COALESCE(total_points, 0) + NEW.points_earned,
    updated_at = NOW()
  WHERE id = NEW.user_id;
  
  -- Também registrar no histórico
  INSERT INTO user_points_history (user_id, points, challenge_type, challenge_id, description)
  VALUES (
    NEW.user_id,
    NEW.points_earned,
    NEW.challenge_id,
    NEW.challenge_id,
    'Desafio: ' || COALESCE(NEW.challenge_title, NEW.challenge_id) || ' (' || NEW.difficulty || ')'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_user_total_points ON user_quiz_attempts;

CREATE TRIGGER trigger_update_user_total_points
AFTER INSERT ON user_quiz_attempts
FOR EACH ROW
EXECUTE FUNCTION update_user_total_points();

-- ============================================================================
-- 3. TABELA DE STREAKS DE ESTUDO (DIAS CONSECUTIVOS)
-- ============================================================================
CREATE TABLE IF NOT EXISTS study_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 1 CHECK (current_streak >= 0),
  longest_streak INTEGER DEFAULT 1 CHECK (longest_streak >= 0),
  last_study_date DATE,
  total_study_days INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice
CREATE INDEX IF NOT EXISTS idx_study_streaks_user_id ON study_streaks(user_id);

-- RLS
ALTER TABLE study_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own streaks"
  ON study_streaks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own streaks"
  ON study_streaks FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own streaks"
  ON study_streaks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 4. TABELA DE ANÁLISES DE DESAFIOS (FEEDBACK DETALHADO)
-- ============================================================================
CREATE TABLE IF NOT EXISTS challenge_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  quiz_attempt_id UUID NOT NULL REFERENCES user_quiz_attempts(id) ON DELETE CASCADE,
  challenge_id TEXT NOT NULL,
  learning_style TEXT,
  strengths TEXT[],
  weaknesses TEXT[],
  personalized_tips TEXT,
  recommended_topics TEXT[],
  performance_trend TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_challenge_analyses_user_id ON challenge_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_challenge_analyses_quiz_attempt_id ON challenge_analyses(quiz_attempt_id);

-- RLS
ALTER TABLE challenge_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analyses"
  ON challenge_analyses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses"
  ON challenge_analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 5. TABELA DE PREFERÊNCIAS DE APRENDIZADO PERSONALIZADAS
-- ============================================================================
CREATE TABLE IF NOT EXISTS learning_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  visual_score INTEGER DEFAULT 0 CHECK (visual_score >= 0 AND visual_score <= 100),
  auditivo_score INTEGER DEFAULT 0 CHECK (auditivo_score >= 0 AND auditivo_score <= 100),
  leitor_score INTEGER DEFAULT 0 CHECK (leitor_score >= 0 AND leitor_score <= 100),
  cinestesico_score INTEGER DEFAULT 0 CHECK (cinestesico_score >= 0 AND cinestesico_score <= 100),
  dominant_style TEXT,
  assessment_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice
CREATE INDEX IF NOT EXISTS idx_learning_preferences_user_id ON learning_preferences(user_id);

-- RLS
ALTER TABLE learning_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences"
  ON learning_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON learning_preferences FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 6. VIEWS PARA RELATÓRIOS E RANKINGS
-- ============================================================================

-- View: Ranking da Escola com Estilo de Aprendizado
DROP VIEW IF EXISTS school_ranking_with_style CASCADE;

CREATE VIEW school_ranking_with_style AS
SELECT 
  p.id,
  p.full_name,
  p.email,
  p.total_points,
  p.school_id,
  p.learning_style,
  p.avatar_url,
  s.name as school_name,
  ROW_NUMBER() OVER (PARTITION BY p.school_id ORDER BY p.total_points DESC) as rank_in_school,
  ROW_NUMBER() OVER (ORDER BY p.total_points DESC) as global_rank
FROM profiles p
LEFT JOIN schools s ON p.school_id = s.id
WHERE p.school_id IS NOT NULL AND p.onboarding_completed = TRUE
ORDER BY p.total_points DESC;

-- View: Desempenho por Tópico
DROP VIEW IF EXISTS user_performance_by_topic CASCADE;

CREATE VIEW user_performance_by_topic AS
SELECT 
  user_id,
  challenge_id,
  COUNT(*) as total_attempts,
  ROUND(AVG(accuracy)::numeric, 2) as average_accuracy,
  MAX(accuracy) as best_accuracy,
  MIN(accuracy) as worst_accuracy,
  SUM(points_earned) as total_points_earned,
  MAX(completed_at) as last_attempt,
  MIN(completed_at) as first_attempt
FROM user_quiz_attempts
GROUP BY user_id, challenge_id;

-- View: Top 5 Estudantes por Escola
DROP VIEW IF EXISTS top_students_by_school CASCADE;

CREATE VIEW top_students_by_school AS
SELECT 
  p.id,
  p.full_name,
  p.email,
  p.avatar_url,
  p.school_id,
  s.name as school_name,
  p.total_points,
  p.learning_style,
  ROW_NUMBER() OVER (PARTITION BY p.school_id ORDER BY p.total_points DESC) as rank
FROM profiles p
LEFT JOIN schools s ON p.school_id = s.id
WHERE p.school_id IS NOT NULL 
  AND p.onboarding_completed = TRUE
  AND p.total_points > 0
QUALIFY ROW_NUMBER() OVER (PARTITION BY p.school_id ORDER BY p.total_points DESC) <= 5;

-- View: Estatísticas Gerais de Desempenho
DROP VIEW IF EXISTS user_performance_stats CASCADE;

CREATE VIEW user_performance_stats AS
SELECT 
  user_id,
  COUNT(*) as total_challenges_completed,
  SUM(points_earned) as total_points,
  ROUND(AVG(accuracy)::numeric, 2) as average_accuracy,
  MAX(accuracy) as best_accuracy,
  COUNT(DISTINCT DATE(completed_at)) as study_days,
  MAX(completed_at) as last_challenge_date,
  MIN(completed_at) as first_challenge_date,
  ROUND(AVG(time_spent_seconds)::numeric, 0) as average_time_seconds
FROM user_quiz_attempts
GROUP BY user_id;

-- ============================================================================
-- 7. FUNCTION PARA ATUALIZAR STREAK DE ESTUDO
-- ============================================================================
DROP FUNCTION IF EXISTS update_study_streak(uuid) CASCADE;

CREATE OR REPLACE FUNCTION update_study_streak(p_user_id UUID)
RETURNS TABLE(current_streak INT, longest_streak INT) AS $$
DECLARE
  v_today DATE := CURRENT_DATE;
  v_yesterday DATE := CURRENT_DATE - INTERVAL '1 day';
  v_current_streak INT;
  v_longest_streak INT;
BEGIN
  -- Se não existe registro, criar um
  INSERT INTO study_streaks (user_id, last_study_date, current_streak, longest_streak)
  VALUES (p_user_id, v_today, 1, 1)
  ON CONFLICT (user_id) DO UPDATE SET updated_at = NOW()
  WHERE study_streaks.user_id = p_user_id;
  
  -- Buscar dados atualizados
  SELECT s.current_streak, s.longest_streak
  INTO v_current_streak, v_longest_streak
  FROM study_streaks s
  WHERE s.user_id = p_user_id;
  
  -- Se estudou ontem, incrementar streak
  IF (SELECT last_study_date FROM study_streaks WHERE user_id = p_user_id) = v_yesterday THEN
    v_current_streak := v_current_streak + 1;
    UPDATE study_streaks
    SET 
      current_streak = v_current_streak,
      longest_streak = CASE WHEN v_current_streak > longest_streak THEN v_current_streak ELSE longest_streak END,
      last_study_date = v_today,
      total_study_days = total_study_days + 1,
      updated_at = NOW()
    WHERE user_id = p_user_id;
  -- Se não estudou ontem, resetar streak
  ELSIF (SELECT last_study_date FROM study_streaks WHERE user_id = p_user_id) < v_yesterday THEN
    UPDATE study_streaks
    SET 
      current_streak = 1,
      last_study_date = v_today,
      total_study_days = total_study_days + 1,
      updated_at = NOW()
    WHERE user_id = p_user_id;
  END IF;
  
  RETURN QUERY SELECT current_streak, longest_streak FROM study_streaks WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 8. GRANTS DE PERMISSÕES
-- ============================================================================
GRANT EXECUTE ON FUNCTION create_profile_for_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION update_user_total_points() TO authenticated;
GRANT EXECUTE ON FUNCTION update_study_streak(uuid) TO authenticated;

-- ============================================================================
-- 9. VERIFICAÇÃO FINAL
-- ============================================================================
-- Verificar que todas as tabelas foram criadas com RLS habilitado
SELECT 
  tablename,
  rowsecurity,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = pg_tables.tablename) as policy_count
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN (
    'profiles', 'schools', 'user_points_history', 'user_quiz_attempts',
    'study_streaks', 'challenge_analyses', 'learning_preferences'
  )
ORDER BY tablename;

-- Listar todas as views criadas
SELECT viewname FROM pg_views WHERE schemaname = 'public' AND viewname LIKE '%rank%' OR viewname LIKE '%performance%';
