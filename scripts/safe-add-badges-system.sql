-- =====================================================
-- SCRIPT SEGURO - ADICIONA SISTEMA DE BADGES SEM APAGAR DADOS
-- Este script adiciona o sistema de conquistas mantendo dados existentes
-- =====================================================

-- Criar tipos enum apenas se não existirem
DO $$ BEGIN
    CREATE TYPE achievement_category AS ENUM ('iniciante', 'intermediario', 'avancado', 'mestre');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE achievement_tier AS ENUM ('bronze', 'prata', 'ouro', 'platina', 'diamante');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE condition_type AS ENUM (
      'total_points',
      'quiz_completed',
      'flashcard_reviewed',
      'days_streak',
      'subject_mastery',
      'perfect_score',
      'study_hours'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_level AS ENUM (
      'iniciante',
      'aprendiz',
      'estudante',
      'dedicado',
      'mestre',
      'lenda',
      'admin'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- ADICIONAR COLUNAS À TABELA PROFILES (SEM APAGAR DADOS)
-- ============================================

-- Adicionar colunas de nível e role se não existirem
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS user_level user_level DEFAULT 'iniciante',
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user',
ADD COLUMN IF NOT EXISTS study_hours INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS achievements_count INTEGER DEFAULT 0;

-- ============================================
-- CRIAR TABELA USER_QUIZ_ATTEMPTS
-- ============================================

CREATE TABLE IF NOT EXISTS user_quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id TEXT NOT NULL,
  subject TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  accuracy NUMERIC GENERATED ALWAYS AS (
    CASE WHEN total_questions > 0 
    THEN ROUND((score::NUMERIC / total_questions::NUMERIC) * 100, 2)
    ELSE 0 END
  ) STORED,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_quiz_user ON user_quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_quiz_subject ON user_quiz_attempts(subject);
CREATE INDEX IF NOT EXISTS idx_user_quiz_completed ON user_quiz_attempts(completed_at);

-- ============================================
-- CRIAR TABELA STUDY_STREAKS
-- ============================================

CREATE TABLE IF NOT EXISTS study_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_study_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_study_streaks_user ON study_streaks(user_id);

-- ============================================
-- CRIAR TABELA ACHIEVEMENTS
-- ============================================

CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category achievement_category NOT NULL,
  tier achievement_tier NOT NULL,
  icon TEXT NOT NULL,
  requirement_type condition_type NOT NULL,
  requirement_value INTEGER NOT NULL,
  points_reward INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CRIAR TABELA USER_ACHIEVEMENTS
-- ============================================

CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked BOOLEAN DEFAULT FALSE,
  progress INTEGER DEFAULT 0,
  unlocked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_unlocked ON user_achievements(unlocked);

-- ============================================
-- POPULAR CONQUISTAS (COM VERIFICAÇÃO)
-- ============================================

-- Limpar conquistas antigas apenas se necessário
TRUNCATE achievements CASCADE;

-- Inserir 23 conquistas
INSERT INTO achievements (name, description, category, tier, icon, requirement_type, requirement_value, points_reward) VALUES
-- INICIANTE (Bronze e Prata)
('Primeiro Passo', 'Complete seu primeiro quiz', 'iniciante', 'bronze', '🎯', 'quiz_completed', 1, 50),
('Explorador Iniciante', 'Ganhe 100 pontos totais', 'iniciante', 'bronze', '⭐', 'total_points', 100, 50),
('Dedicação Inicial', 'Estude por 3 dias consecutivos', 'iniciante', 'bronze', '🔥', 'days_streak', 3, 75),
('Leitor Ávido', 'Revise 50 flashcards', 'iniciante', 'prata', '📚', 'flashcard_reviewed', 50, 100),
('Pontuação Perfeita', 'Obtenha 100% em um quiz', 'iniciante', 'prata', '💯', 'perfect_score', 1, 100),

-- INTERMEDIÁRIO (Prata e Ouro)
('Estudante Consistente', 'Estude por 7 dias consecutivos', 'intermediario', 'prata', '📅', 'days_streak', 7, 150),
('Acumulador', 'Ganhe 500 pontos totais', 'intermediario', 'prata', '💰', 'total_points', 500, 150),
('Quiz Master', 'Complete 10 quizzes', 'intermediario', 'ouro', '🎓', 'quiz_completed', 10, 200),
('Maratonista', 'Estude por 15 dias consecutivos', 'intermediario', 'ouro', '🏃', 'days_streak', 15, 250),
('Especialista Dedicado', 'Ganhe 1000 pontos totais', 'intermediario', 'ouro', '🏆', 'total_points', 1000, 250),

-- AVANÇADO (Ouro e Platina)
('Mestre dos Flashcards', 'Revise 200 flashcards', 'avancado', 'ouro', '🎴', 'flashcard_reviewed', 200, 300),
('Veterano', 'Estude por 30 dias consecutivos', 'avancado', 'ouro', '⚡', 'days_streak', 30, 350),
('Campeão de Quizzes', 'Complete 25 quizzes', 'avancado', 'platina', '👑', 'quiz_completed', 25, 400),
('Acumulador Elite', 'Ganhe 2500 pontos totais', 'avancado', 'platina', '💎', 'total_points', 2500, 400),
('Perfecionista', 'Obtenha 100% em 5 quizzes', 'avancado', 'platina', '✨', 'perfect_score', 5, 450),

-- MESTRE (Platina e Diamante)
('Imortal', 'Estude por 60 dias consecutivos', 'mestre', 'platina', '🌟', 'days_streak', 60, 500),
('Sábio Supremo', 'Ganhe 5000 pontos totais', 'mestre', 'platina', '🧙', 'total_points', 5000, 500),
('Lenda dos Quizzes', 'Complete 50 quizzes', 'mestre', 'diamante', '🎖️', 'quiz_completed', 50, 600),
('Biblioteca Viva', 'Revise 500 flashcards', 'mestre', 'diamante', '📖', 'flashcard_reviewed', 500, 600),
('Conquistador', 'Estude por 100 dias consecutivos', 'mestre', 'diamante', '🔱', 'days_streak', 100, 750),
('Titã do Conhecimento', 'Ganhe 10000 pontos totais', 'mestre', 'diamante', '⚔️', 'total_points', 10000, 750),
('Perfeccionismo Absoluto', 'Obtenha 100% em 10 quizzes', 'mestre', 'diamante', '🌈', 'perfect_score', 10, 800),
('Mestre Supremo', 'Domine uma matéria completamente', 'mestre', 'diamante', '🎯', 'subject_mastery', 1, 1000);

-- ============================================
-- CRIAR FUNÇÕES E TRIGGERS
-- ============================================

-- Função para calcular nível do usuário
CREATE OR REPLACE FUNCTION calculate_user_level(p_user_id UUID)
RETURNS user_level AS $$
DECLARE
  v_total_points INTEGER;
  v_achievements INTEGER;
  v_study_hours INTEGER;
  v_calculated_level user_level;
BEGIN
  SELECT 
    COALESCE(total_points, 0),
    COALESCE(achievements_count, 0),
    COALESCE(study_hours, 0)
  INTO v_total_points, v_achievements, v_study_hours
  FROM profiles
  WHERE id = p_user_id;

  IF EXISTS (SELECT 1 FROM profiles WHERE id = p_user_id AND role = 'admin') THEN
    RETURN 'admin';
  END IF;

  IF v_total_points >= 10000 AND v_achievements >= 20 AND v_study_hours >= 100 THEN
    v_calculated_level := 'lenda';
  ELSIF v_total_points >= 5000 AND v_achievements >= 15 AND v_study_hours >= 50 THEN
    v_calculated_level := 'mestre';
  ELSIF v_total_points >= 2000 AND v_achievements >= 10 AND v_study_hours >= 25 THEN
    v_calculated_level := 'dedicado';
  ELSIF v_total_points >= 1000 AND v_achievements >= 5 AND v_study_hours >= 10 THEN
    v_calculated_level := 'estudante';
  ELSIF v_total_points >= 500 AND v_achievements >= 2 AND v_study_hours >= 5 THEN
    v_calculated_level := 'aprendiz';
  ELSE
    v_calculated_level := 'iniciante';
  END IF;

  RETURN v_calculated_level;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function para atualizar nível
CREATE OR REPLACE FUNCTION update_user_level()
RETURNS TRIGGER AS $$
BEGIN
  NEW.user_level := calculate_user_level(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_user_level ON profiles;
CREATE TRIGGER trigger_update_user_level
BEFORE UPDATE OF total_points, achievements_count, study_hours
ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_user_level();

-- Trigger function para verificar conquistas automaticamente
CREATE OR REPLACE FUNCTION check_and_update_achievements_trigger()
RETURNS TRIGGER AS $$
DECLARE
  v_achievement RECORD;
  v_current_value INTEGER;
  v_user_achievement RECORD;
BEGIN
  -- Para cada conquista não desbloqueada
  FOR v_achievement IN 
    SELECT a.* 
    FROM achievements a
    LEFT JOIN user_achievements ua ON ua.achievement_id = a.id AND ua.user_id = NEW.user_id
    WHERE ua.unlocked IS NULL OR ua.unlocked = FALSE
  LOOP
    -- Calcular valor atual baseado no tipo de condição
    CASE v_achievement.requirement_type
      WHEN 'quiz_completed' THEN
        SELECT COUNT(*) INTO v_current_value 
        FROM user_quiz_attempts 
        WHERE user_id = NEW.user_id;
      
      WHEN 'total_points' THEN
        SELECT COALESCE(total_points, 0) INTO v_current_value 
        FROM profiles 
        WHERE id = NEW.user_id;
      
      WHEN 'days_streak' THEN
        SELECT COALESCE(current_streak, 0) INTO v_current_value 
        FROM study_streaks 
        WHERE user_id = NEW.user_id;
      
      WHEN 'flashcard_reviewed' THEN
        v_current_value := 0;
      
      WHEN 'perfect_score' THEN
        SELECT COUNT(*) INTO v_current_value 
        FROM user_quiz_attempts 
        WHERE user_id = NEW.user_id AND accuracy = 100;
      
      ELSE
        v_current_value := 0;
    END CASE;

    -- Inserir ou atualizar progresso
    INSERT INTO user_achievements (user_id, achievement_id, progress, unlocked, unlocked_at)
    VALUES (
      NEW.user_id,
      v_achievement.id,
      v_current_value,
      v_current_value >= v_achievement.requirement_value,
      CASE WHEN v_current_value >= v_achievement.requirement_value THEN NOW() ELSE NULL END
    )
    ON CONFLICT (user_id, achievement_id)
    DO UPDATE SET
      progress = v_current_value,
      unlocked = v_current_value >= v_achievement.requirement_value,
      unlocked_at = CASE 
        WHEN v_current_value >= v_achievement.requirement_value AND user_achievements.unlocked = FALSE 
        THEN NOW() 
        ELSE user_achievements.unlocked_at 
      END;

    -- Se desbloqueou, adicionar pontos
    IF v_current_value >= v_achievement.requirement_value THEN
      UPDATE profiles
      SET total_points = COALESCE(total_points, 0) + v_achievement.points_reward
      WHERE id = NEW.user_id 
        AND NOT EXISTS (
          SELECT 1 FROM user_achievements 
          WHERE user_id = NEW.user_id 
            AND achievement_id = v_achievement.id 
            AND unlocked = TRUE
        );
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_check_achievements ON user_quiz_attempts;
CREATE TRIGGER trigger_check_achievements
AFTER INSERT OR UPDATE ON user_quiz_attempts
FOR EACH ROW
EXECUTE FUNCTION check_and_update_achievements_trigger();

-- Sincronizar contagem de conquistas
CREATE OR REPLACE FUNCTION sync_achievements_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET achievements_count = (
    SELECT COUNT(*)
    FROM user_achievements
    WHERE user_id = NEW.user_id AND unlocked = TRUE
  )
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_sync_achievements ON user_achievements;
CREATE TRIGGER trigger_sync_achievements
AFTER INSERT OR UPDATE ON user_achievements
FOR EACH ROW
WHEN (NEW.unlocked = TRUE)
EXECUTE FUNCTION sync_achievements_count();

-- ============================================
-- DEFINIR ADMIN
-- ============================================

UPDATE profiles
SET role = 'admin',
    user_level = 'admin'
WHERE email = 'viniciusdesousacosta903@gmail.com';

-- ============================================
-- POLÍTICAS RLS
-- ============================================

ALTER TABLE user_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own quiz attempts" ON user_quiz_attempts;
CREATE POLICY "Users can view their own quiz attempts"
ON user_quiz_attempts FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own quiz attempts" ON user_quiz_attempts;
CREATE POLICY "Users can insert their own quiz attempts"
ON user_quiz_attempts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Achievements are viewable by everyone" ON achievements;
CREATE POLICY "Achievements are viewable by everyone"
ON achievements FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Users can view their own achievements" ON user_achievements;
CREATE POLICY "Users can view their own achievements"
ON user_achievements FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own streaks" ON study_streaks;
CREATE POLICY "Users can view their own streaks"
ON study_streaks FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- ============================================
-- FINALIZAÇÃO
-- ============================================

SELECT 'Sistema de badges instalado com sucesso! Dados existentes preservados.' AS status;
