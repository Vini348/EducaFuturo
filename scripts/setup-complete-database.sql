-- ============================================================================
-- SETUP COMPLETO DO BANCO DE DADOS - EducaFuturo
-- ============================================================================
-- Este script cria TODAS as tabelas necessárias na ordem correta
-- Execute este script uma vez no Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- 0. LIMPAR TABELAS ANTIGAS (se existirem)
-- ============================================================================
DROP TRIGGER IF EXISTS after_quiz_check_achievements ON user_quiz_attempts;
DROP FUNCTION IF EXISTS trigger_check_achievements();
DROP FUNCTION IF EXISTS check_and_update_achievements(UUID);

DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS user_quiz_attempts CASCADE;

-- ============================================================================
-- 1. CRIAR TABELA user_quiz_attempts PRIMEIRO (dependência principal)
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  challenge_id TEXT NOT NULL,
  challenge_title TEXT,
  difficulty TEXT CHECK (difficulty IN ('fácil', 'médio', 'difícil')),
  subject TEXT,
  topic TEXT,
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
CREATE INDEX IF NOT EXISTS idx_user_quiz_attempts_subject ON user_quiz_attempts(subject);

-- Habilitar RLS
ALTER TABLE user_quiz_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own quiz attempts" ON user_quiz_attempts;
CREATE POLICY "Users can view own quiz attempts"
  ON user_quiz_attempts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own quiz attempts" ON user_quiz_attempts;
CREATE POLICY "Users can insert own quiz attempts"
  ON user_quiz_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 2. CRIAR TABELAS DE CONQUISTAS
-- ============================================================================
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('iniciante', 'intermediario', 'avancado', 'mestre')),
  tier TEXT NOT NULL CHECK (tier IN ('bronze', 'prata', 'ouro', 'platina', 'diamante')),
  icon TEXT NOT NULL,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  points_reward INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_achievements_category ON achievements(category);
CREATE INDEX IF NOT EXISTS idx_achievements_tier ON achievements(tier);

-- RLS
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Achievements are viewable by everyone" ON achievements;
CREATE POLICY "Achievements are viewable by everyone"
  ON achievements FOR SELECT
  USING (true);

-- ============================================================================
-- 3. CRIAR user_achievements
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON user_achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_unlocked_at ON user_achievements(unlocked_at DESC);

-- RLS
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own achievements" ON user_achievements;
CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own achievements" ON user_achievements;
CREATE POLICY "Users can insert own achievements"
  ON user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own achievements" ON user_achievements;
CREATE POLICY "Users can update own achievements"
  ON user_achievements FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 4. POPULAR CONQUISTAS
-- ============================================================================
INSERT INTO achievements (name, description, category, tier, icon, requirement_type, requirement_value, points_reward)
VALUES
  -- INICIANTE (Bronze)
  ('Primeira Jornada', 'Complete seu primeiro desafio', 'iniciante', 'bronze', '🎯', 'challenges_completed', 1, 50),
  ('Estudante Curioso', 'Complete 5 desafios', 'iniciante', 'bronze', '📚', 'challenges_completed', 5, 100),
  ('Primeiros Passos', 'Acumule 100 pontos', 'iniciante', 'bronze', '⭐', 'total_points', 100, 50),
  ('Dedicação Inicial', 'Estude por 3 dias consecutivos', 'iniciante', 'bronze', '🔥', 'study_streak', 3, 75),
  
  -- INICIANTE (Prata)
  ('Aprendiz Dedicado', 'Complete 10 desafios', 'iniciante', 'prata', '📖', 'challenges_completed', 10, 150),
  ('Colecionador de Estrelas', 'Acumule 500 pontos', 'iniciante', 'prata', '🌟', 'total_points', 500, 100),
  ('Semana de Estudos', 'Estude por 7 dias consecutivos', 'iniciante', 'prata', '📅', 'study_streak', 7, 200),
  
  -- INTERMEDIÁRIO (Ouro)
  ('Estudante Persistente', 'Complete 25 desafios', 'intermediario', 'ouro', '💪', 'challenges_completed', 25, 300),
  ('Mestre dos Pontos', 'Acumule 1000 pontos', 'intermediario', 'ouro', '💎', 'total_points', 1000, 250),
  ('Quinzena de Foco', 'Estude por 14 dias consecutivos', 'intermediario', 'ouro', '🏆', 'study_streak', 14, 400),
  ('Precisão', 'Atinja 80% de acerto em 5 desafios', 'intermediario', 'ouro', '🎯', 'high_accuracy_count', 5, 350),
  
  -- INTERMEDIÁRIO (Platina)
  ('Determinação', 'Complete 50 desafios', 'intermediario', 'platina', '🚀', 'challenges_completed', 50, 500),
  ('Coletor Platinum', 'Acumule 2500 pontos', 'intermediario', 'platina', '💰', 'total_points', 2500, 400),
  ('Mês de Disciplina', 'Estude por 30 dias consecutivos', 'intermediario', 'platina', '📆', 'study_streak', 30, 750),
  
  -- AVANÇADO (Diamante)
  ('Campeão', 'Complete 100 desafios', 'avancado', 'diamante', '👑', 'challenges_completed', 100, 1000),
  ('Fortuna Acumulada', 'Acumule 5000 pontos', 'avancado', 'diamante', '💸', 'total_points', 5000, 750),
  ('Bimestre Imparável', 'Estude por 60 dias consecutivos', 'avancado', 'diamante', '🔥', 'study_streak', 60, 1500),
  ('Perfeição', 'Atinja 100% de acerto em 3 desafios', 'avancado', 'diamante', '✨', 'perfect_score_count', 3, 1000),
  
  -- MESTRE (Lendário)
  ('Lenda Viva', 'Complete 250 desafios', 'mestre', 'diamante', '🏅', 'challenges_completed', 250, 2500),
  ('Tesouro do Conhecimento', 'Acumule 10000 pontos', 'mestre', 'diamante', '🏰', 'total_points', 10000, 2000),
  ('Trimestre Implacável', 'Estude por 90 dias consecutivos', 'mestre', 'diamante', '⚡', 'study_streak', 90, 3000),
  ('Mestre das Matérias', 'Complete desafios em 10 matérias diferentes', 'mestre', 'diamante', '🎓', 'subjects_mastered', 10, 2500),
  ('Elite da Precisão', 'Mantenha 90% de acerto médio em 20 desafios', 'mestre', 'diamante', '🎖️', 'elite_accuracy', 20, 3500)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- 5. FUNÇÃO PARA VERIFICAR E ATUALIZAR CONQUISTAS
-- ============================================================================
CREATE OR REPLACE FUNCTION check_and_update_achievements(p_user_id UUID)
RETURNS TABLE(new_achievements_unlocked INTEGER) AS $$
DECLARE
  v_challenges_completed INTEGER;
  v_total_points INTEGER;
  v_study_streak INTEGER;
  v_high_accuracy_count INTEGER;
  v_perfect_score_count INTEGER;
  v_subjects_count INTEGER;
  v_elite_accuracy_count INTEGER;
  v_new_unlocked INTEGER := 0;
  achievement_record RECORD;
BEGIN
  -- Calcular estatísticas do usuário
  SELECT 
    COUNT(*),
    COALESCE(SUM(points_earned), 0),
    COUNT(*) FILTER (WHERE accuracy >= 80),
    COUNT(*) FILTER (WHERE accuracy = 100),
    COUNT(DISTINCT subject),
    COUNT(*) FILTER (WHERE accuracy >= 90)
  INTO 
    v_challenges_completed,
    v_total_points,
    v_high_accuracy_count,
    v_perfect_score_count,
    v_subjects_count,
    v_elite_accuracy_count
  FROM user_quiz_attempts
  WHERE user_id = p_user_id;

  -- Buscar streak atual
  SELECT COALESCE(current_streak, 0)
  INTO v_study_streak
  FROM study_streaks
  WHERE user_id = p_user_id;

  -- Verificar cada conquista
  FOR achievement_record IN 
    SELECT * FROM achievements
  LOOP
    -- Verificar se o usuário já tem esta conquista
    IF NOT EXISTS (
      SELECT 1 FROM user_achievements 
      WHERE user_id = p_user_id 
        AND achievement_id = achievement_record.id 
        AND is_completed = TRUE
    ) THEN
      -- Verificar se o requisito foi atingido
      IF (
        (achievement_record.requirement_type = 'challenges_completed' AND v_challenges_completed >= achievement_record.requirement_value) OR
        (achievement_record.requirement_type = 'total_points' AND v_total_points >= achievement_record.requirement_value) OR
        (achievement_record.requirement_type = 'study_streak' AND v_study_streak >= achievement_record.requirement_value) OR
        (achievement_record.requirement_type = 'high_accuracy_count' AND v_high_accuracy_count >= achievement_record.requirement_value) OR
        (achievement_record.requirement_type = 'perfect_score_count' AND v_perfect_score_count >= achievement_record.requirement_value) OR
        (achievement_record.requirement_type = 'subjects_mastered' AND v_subjects_count >= achievement_record.requirement_value) OR
        (achievement_record.requirement_type = 'elite_accuracy' AND v_elite_accuracy_count >= achievement_record.requirement_value)
      ) THEN
        -- Desbloquear conquista
        INSERT INTO user_achievements (user_id, achievement_id, progress, is_completed)
        VALUES (p_user_id, achievement_record.id, achievement_record.requirement_value, TRUE)
        ON CONFLICT (user_id, achievement_id) 
        DO UPDATE SET 
          is_completed = TRUE,
          progress = achievement_record.requirement_value,
          unlocked_at = NOW();
        
        -- Adicionar pontos de recompensa
        UPDATE profiles
        SET total_points = COALESCE(total_points, 0) + achievement_record.points_reward
        WHERE id = p_user_id;
        
        v_new_unlocked := v_new_unlocked + 1;
      END IF;
    END IF;
  END LOOP;

  RETURN QUERY SELECT v_new_unlocked;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 6. TRIGGER PARA VERIFICAR CONQUISTAS APÓS COMPLETAR DESAFIO
-- ============================================================================
CREATE OR REPLACE FUNCTION trigger_check_achievements()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM check_and_update_achievements(NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER after_quiz_check_achievements
AFTER INSERT ON user_quiz_attempts
FOR EACH ROW
EXECUTE FUNCTION trigger_check_achievements();

-- ============================================================================
-- 7. GRANTS
-- ============================================================================
GRANT EXECUTE ON FUNCTION check_and_update_achievements(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION trigger_check_achievements() TO authenticated;

-- ============================================================================
-- VERIFICAÇÃO FINAL
-- ============================================================================
SELECT 'Setup completo! Tabelas criadas:' as status;
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('user_quiz_attempts', 'achievements', 'user_achievements')
ORDER BY tablename;

SELECT 'Total de conquistas cadastradas: ' || COUNT(*) as achievements_count 
FROM achievements;
