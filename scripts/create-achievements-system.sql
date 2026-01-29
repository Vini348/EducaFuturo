-- ============================================================================
-- SISTEMA DE CONQUISTAS DINÂMICO
-- ============================================================================
-- Este script cria um sistema completo de conquistas com badges visuais

-- ============================================================================
-- 1. CRIAR TABELA DE CONQUISTAS (se não existir)
-- ============================================================================
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  badge_image TEXT,
  category TEXT NOT NULL CHECK (category IN ('iniciante', 'intermediario', 'avancado', 'mestre')),
  tier TEXT NOT NULL CHECK (tier IN ('bronze', 'prata', 'ouro', 'platina', 'diamante')),
  points_required INTEGER,
  challenges_required INTEGER,
  streak_required INTEGER,
  accuracy_required NUMERIC(5,2),
  condition_type TEXT NOT NULL CHECK (condition_type IN ('points', 'challenges', 'streak', 'accuracy', 'time', 'subject_mastery', 'combo')),
  condition_value JSONB,
  reward_points INTEGER DEFAULT 0,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 2. ÍNDICES PARA PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_achievements_category ON achievements(category);
CREATE INDEX IF NOT EXISTS idx_achievements_tier ON achievements(tier);
CREATE INDEX IF NOT EXISTS idx_achievements_condition_type ON achievements(condition_type);
CREATE INDEX IF NOT EXISTS idx_achievements_active ON achievements(is_active) WHERE is_active = TRUE;

-- ============================================================================
-- 3. ATUALIZAR TABELA USER_ACHIEVEMENTS (se necessário)
-- ============================================================================
ALTER TABLE user_achievements 
ADD COLUMN IF NOT EXISTS progress NUMERIC(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS unlocked BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS notified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS unlocked_at TIMESTAMP WITH TIME ZONE;

CREATE INDEX IF NOT EXISTS idx_user_achievements_unlocked ON user_achievements(user_id, unlocked);
CREATE INDEX IF NOT EXISTS idx_user_achievements_progress ON user_achievements(user_id, progress);

-- ============================================================================
-- 4. POPULAR CONQUISTAS INICIAIS
-- ============================================================================
INSERT INTO achievements (name, description, icon, category, tier, condition_type, points_required, challenges_required, streak_required, accuracy_required, condition_value, reward_points, order_index) VALUES

-- CATEGORIA: INICIANTE (Bronze)
('Primeiro Passo', 'Complete seu primeiro desafio', '🎯', 'iniciante', 'bronze', 'challenges', NULL, 1, NULL, NULL, '{"type": "first_challenge"}', 10, 1),
('Estudante Dedicado', 'Acumule 50 pontos', '⭐', 'iniciante', 'bronze', 'points', 50, NULL, NULL, NULL, '{"threshold": 50}', 10, 2),
('Início da Jornada', 'Estude por 3 dias consecutivos', '🔥', 'iniciante', 'bronze', 'streak', NULL, NULL, 3, NULL, '{"days": 3}', 15, 3),
('Explorador', 'Complete desafios em 3 matérias diferentes', '🌍', 'iniciante', 'bronze', 'subject_mastery', NULL, 3, NULL, NULL, '{"subjects": 3}', 20, 4),
('Aprendiz Rápido', 'Obtenha 70% de acerto em qualquer desafio', '⚡', 'iniciante', 'bronze', 'accuracy', NULL, NULL, NULL, 70, '{"min_accuracy": 70}', 15, 5),

-- CATEGORIA: INTERMEDIÁRIO (Prata)
('Comprometido', 'Acumule 250 pontos', '💎', 'intermediario', 'prata', 'points', 250, NULL, NULL, NULL, '{"threshold": 250}', 25, 10),
('Sequência de Fogo', 'Estude por 7 dias consecutivos', '🔥', 'intermediario', 'prata', 'streak', NULL, NULL, 7, NULL, '{"days": 7}', 30, 11),
('Resolvedor', 'Complete 25 desafios', '🎓', 'intermediario', 'prata', 'challenges', NULL, 25, NULL, NULL, '{"count": 25}', 30, 12),
('Precisão Cirúrgica', 'Obtenha 85% de acerto em 5 desafios', '🎯', 'intermediario', 'prata', 'combo', NULL, 5, NULL, 85, '{"challenges": 5, "accuracy": 85}', 35, 13),
('Polímata', 'Complete desafios em 5 matérias diferentes', '📚', 'intermediario', 'prata', 'subject_mastery', NULL, 5, NULL, NULL, '{"subjects": 5}', 40, 14),

-- CATEGORIA: AVANÇADO (Ouro)
('Determinação de Aço', 'Acumule 500 pontos', '🏆', 'avancado', 'ouro', 'points', 500, NULL, NULL, NULL, '{"threshold": 500}', 50, 20),
('Maratona Mental', 'Estude por 15 dias consecutivos', '🔥', 'avancado', 'ouro', 'streak', NULL, NULL, 15, NULL, '{"days": 15}', 60, 21),
('Especialista', 'Complete 50 desafios', '🌟', 'avancado', 'ouro', 'challenges', NULL, 50, NULL, NULL, '{"count": 50}', 60, 22),
('Perfeicionista', 'Obtenha 90% de acerto em 10 desafios', '💯', 'avancado', 'ouro', 'combo', NULL, 10, NULL, 90, '{"challenges": 10, "accuracy": 90}', 70, 23),
('Conhecimento Amplo', 'Complete desafios em 8 matérias diferentes', '🎓', 'avancado', 'ouro', 'subject_mastery', NULL, 8, NULL, NULL, '{"subjects": 8}', 75, 24),
('Mestre do Tempo', 'Complete 20 desafios em menos de 5 minutos cada', '⏱️', 'avancado', 'ouro', 'combo', NULL, 20, NULL, NULL, '{"challenges": 20, "max_time": 300}', 80, 25),

-- CATEGORIA: MESTRE (Platina/Diamante)
('Lenda', 'Acumule 1000 pontos', '👑', 'mestre', 'platina', 'points', 1000, NULL, NULL, NULL, '{"threshold": 1000}', 100, 30),
('Inquebrantável', 'Estude por 30 dias consecutivos', '🔥', 'mestre', 'platina', 'streak', NULL, NULL, 30, NULL, '{"days": 30}', 120, 31),
('Campeão', 'Complete 100 desafios', '🏅', 'mestre', 'platina', 'challenges', NULL, 100, NULL, NULL, '{"count": 100}', 120, 32),
('Gênio', 'Obtenha 95% de acerto em 20 desafios', '🧠', 'mestre', 'diamante', 'combo', NULL, 20, NULL, 95, '{"challenges": 20, "accuracy": 95}', 150, 33),
('Mestre Universal', 'Domine todas as matérias disponíveis', '🌌', 'mestre', 'diamante', 'subject_mastery', NULL, 15, NULL, NULL, '{"subjects": 15, "min_accuracy": 80}', 200, 34),
('Velocista Mental', 'Complete 50 desafios em menos de 3 minutos cada', '⚡', 'mestre', 'diamante', 'combo', NULL, 50, NULL, NULL, '{"challenges": 50, "max_time": 180}', 180, 35)

ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  category = EXCLUDED.category,
  tier = EXCLUDED.tier,
  condition_type = EXCLUDED.condition_type,
  points_required = EXCLUDED.points_required,
  challenges_required = EXCLUDED.challenges_required,
  streak_required = EXCLUDED.streak_required,
  accuracy_required = EXCLUDED.accuracy_required,
  condition_value = EXCLUDED.condition_value,
  reward_points = EXCLUDED.reward_points,
  order_index = EXCLUDED.order_index,
  updated_at = NOW();

-- ============================================================================
-- 5. FUNÇÃO PARA VERIFICAR E DESBLOQUEAR CONQUISTAS AUTOMATICAMENTE
-- ============================================================================
CREATE OR REPLACE FUNCTION check_and_unlock_achievements(p_user_id UUID)
RETURNS TABLE(newly_unlocked JSONB) AS $$
DECLARE
  v_achievement RECORD;
  v_user_stats RECORD;
  v_progress NUMERIC;
  v_unlocked BOOLEAN;
  v_newly_unlocked JSONB := '[]'::JSONB;
BEGIN
  -- Buscar estatísticas do usuário
  SELECT 
    COALESCE(p.total_points, 0) as total_points,
    COALESCE(ss.current_streak, 0) as current_streak,
    COALESCE(ups.total_challenges_completed, 0) as total_challenges,
    COALESCE(ups.average_accuracy, 0) as average_accuracy,
    COALESCE((
      SELECT COUNT(DISTINCT challenge_id) 
      FROM user_quiz_attempts 
      WHERE user_id = p_user_id
    ), 0) as subjects_completed
  INTO v_user_stats
  FROM profiles p
  LEFT JOIN study_streaks ss ON ss.user_id = p.id
  LEFT JOIN user_performance_stats ups ON ups.user_id = p.id
  WHERE p.id = p_user_id;

  -- Iterar sobre todas as conquistas ativas
  FOR v_achievement IN 
    SELECT * FROM achievements 
    WHERE is_active = TRUE 
    ORDER BY order_index
  LOOP
    -- Verificar se a conquista já foi desbloqueada
    SELECT unlocked INTO v_unlocked
    FROM user_achievements
    WHERE user_id = p_user_id AND achievement_id = v_achievement.id;

    -- Se já desbloqueada, pular
    IF v_unlocked THEN
      CONTINUE;
    END IF;

    -- Calcular progresso baseado no tipo de condição
    v_progress := 0;
    v_unlocked := FALSE;

    CASE v_achievement.condition_type
      WHEN 'points' THEN
        v_progress := LEAST(100, (v_user_stats.total_points::NUMERIC / v_achievement.points_required::NUMERIC) * 100);
        v_unlocked := v_user_stats.total_points >= v_achievement.points_required;

      WHEN 'challenges' THEN
        v_progress := LEAST(100, (v_user_stats.total_challenges::NUMERIC / v_achievement.challenges_required::NUMERIC) * 100);
        v_unlocked := v_user_stats.total_challenges >= v_achievement.challenges_required;

      WHEN 'streak' THEN
        v_progress := LEAST(100, (v_user_stats.current_streak::NUMERIC / v_achievement.streak_required::NUMERIC) * 100);
        v_unlocked := v_user_stats.current_streak >= v_achievement.streak_required;

      WHEN 'accuracy' THEN
        v_progress := LEAST(100, (v_user_stats.average_accuracy / v_achievement.accuracy_required) * 100);
        v_unlocked := v_user_stats.average_accuracy >= v_achievement.accuracy_required;

      WHEN 'subject_mastery' THEN
        v_progress := LEAST(100, (v_user_stats.subjects_completed::NUMERIC / (v_achievement.condition_value->>'subjects')::NUMERIC) * 100);
        v_unlocked := v_user_stats.subjects_completed >= (v_achievement.condition_value->>'subjects')::INTEGER;

      WHEN 'combo' THEN
        -- Lógica complexa para combos (múltiplas condições)
        DECLARE
          v_combo_challenges INTEGER;
          v_combo_accuracy NUMERIC;
        BEGIN
          SELECT 
            COUNT(*),
            AVG(accuracy)
          INTO v_combo_challenges, v_combo_accuracy
          FROM user_quiz_attempts
          WHERE user_id = p_user_id 
            AND accuracy >= COALESCE((v_achievement.condition_value->>'accuracy')::NUMERIC, 0)
            AND (v_achievement.condition_value->>'max_time') IS NULL 
              OR time_spent_seconds <= (v_achievement.condition_value->>'max_time')::INTEGER;

          v_progress := LEAST(100, (v_combo_challenges::NUMERIC / (v_achievement.condition_value->>'challenges')::NUMERIC) * 100);
          v_unlocked := v_combo_challenges >= (v_achievement.condition_value->>'challenges')::INTEGER;
        END;

      ELSE
        v_progress := 0;
    END CASE;

    -- Inserir ou atualizar o progresso da conquista
    INSERT INTO user_achievements (user_id, achievement_id, progress, unlocked, unlocked_at, notified)
    VALUES (p_user_id, v_achievement.id, ROUND(v_progress, 2), v_unlocked, CASE WHEN v_unlocked THEN NOW() ELSE NULL END, FALSE)
    ON CONFLICT (user_id, achievement_id) 
    DO UPDATE SET 
      progress = ROUND(v_progress, 2),
      unlocked = v_unlocked,
      unlocked_at = CASE WHEN v_unlocked AND NOT user_achievements.unlocked THEN NOW() ELSE user_achievements.unlocked_at END,
      notified = CASE WHEN v_unlocked AND NOT user_achievements.unlocked THEN FALSE ELSE user_achievements.notified END,
      updated_at = NOW();

    -- Se foi recém-desbloqueada, adicionar à lista de retorno
    IF v_unlocked AND (SELECT NOT COALESCE(unlocked, FALSE) FROM user_achievements WHERE user_id = p_user_id AND achievement_id = v_achievement.id) THEN
      v_newly_unlocked := v_newly_unlocked || jsonb_build_object(
        'id', v_achievement.id,
        'name', v_achievement.name,
        'description', v_achievement.description,
        'icon', v_achievement.icon,
        'tier', v_achievement.tier,
        'reward_points', v_achievement.reward_points
      );

      -- Adicionar pontos de recompensa
      IF v_achievement.reward_points > 0 THEN
        INSERT INTO user_points_history (user_id, points, activity_type, activity_id, description)
        VALUES (p_user_id, v_achievement.reward_points, 'achievement', v_achievement.id::TEXT, 'Conquista desbloqueada: ' || v_achievement.name);
      END IF;
    END IF;
  END LOOP;

  RETURN QUERY SELECT v_newly_unlocked;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 6. TRIGGER PARA VERIFICAR CONQUISTAS APÓS ATIVIDADES
-- ============================================================================
CREATE OR REPLACE FUNCTION trigger_check_achievements()
RETURNS TRIGGER AS $$
BEGIN
  -- Verificar conquistas de forma assíncrona
  PERFORM check_and_unlock_achievements(NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger em user_quiz_attempts
DROP TRIGGER IF EXISTS trigger_check_achievements_after_quiz ON user_quiz_attempts;
CREATE TRIGGER trigger_check_achievements_after_quiz
AFTER INSERT ON user_quiz_attempts
FOR EACH ROW
EXECUTE FUNCTION trigger_check_achievements();

-- Criar trigger em user_points_history
DROP TRIGGER IF EXISTS trigger_check_achievements_after_points ON user_points_history;
CREATE TRIGGER trigger_check_achievements_after_points
AFTER INSERT ON user_points_history
FOR EACH ROW
EXECUTE FUNCTION trigger_check_achievements();

-- ============================================================================
-- 7. FUNÇÃO PARA BUSCAR CONQUISTAS DO USUÁRIO
-- ============================================================================
CREATE OR REPLACE FUNCTION get_user_achievements(p_user_id UUID, p_include_locked BOOLEAN DEFAULT TRUE)
RETURNS TABLE(
  achievement_id UUID,
  name TEXT,
  description TEXT,
  icon TEXT,
  badge_image TEXT,
  category TEXT,
  tier TEXT,
  progress NUMERIC,
  unlocked BOOLEAN,
  unlocked_at TIMESTAMP WITH TIME ZONE,
  reward_points INTEGER,
  order_index INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.name,
    a.description,
    a.icon,
    a.badge_image,
    a.category,
    a.tier,
    COALESCE(ua.progress, 0) as progress,
    COALESCE(ua.unlocked, FALSE) as unlocked,
    ua.unlocked_at,
    a.reward_points,
    a.order_index
  FROM achievements a
  LEFT JOIN user_achievements ua ON ua.achievement_id = a.id AND ua.user_id = p_user_id
  WHERE a.is_active = TRUE
    AND (p_include_locked OR ua.unlocked = TRUE)
  ORDER BY a.order_index;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 8. RLS POLICIES
-- ============================================================================
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active achievements"
  ON achievements FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Users can view their own achievement progress"
  ON user_achievements FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================================================
-- 9. GRANTS
-- ============================================================================
GRANT EXECUTE ON FUNCTION check_and_unlock_achievements(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_achievements(UUID, BOOLEAN) TO authenticated;

-- ============================================================================
-- FIM DO SCRIPT
-- ============================================================================
