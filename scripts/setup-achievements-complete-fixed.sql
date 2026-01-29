-- Complete achievements system setup
-- Run this script to create all necessary tables and functions

-- Step 1: Drop everything to start fresh
DROP FUNCTION IF EXISTS check_and_update_achievements(uuid);
DROP FUNCTION IF EXISTS check_and_update_achievements(uuid, text);
DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TYPE IF EXISTS condition_type CASCADE;
DROP TYPE IF EXISTS achievement_tier CASCADE;
DROP TYPE IF EXISTS achievement_category CASCADE;

-- Step 2: Create enum types
CREATE TYPE achievement_category AS ENUM ('iniciante', 'intermediario', 'avancado', 'mestre');
CREATE TYPE achievement_tier AS ENUM ('bronze', 'prata', 'ouro', 'platina', 'diamante');
CREATE TYPE condition_type AS ENUM (
    'total_points',
    'quiz_completed',
    'flashcards_reviewed',
    'days_streak',
    'challenges_completed',
    'perfect_score',
    'study_time'
);

-- Step 3: Create achievements table with all columns
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    category achievement_category NOT NULL,
    tier achievement_tier NOT NULL,
    icon TEXT NOT NULL,
    requirement_type condition_type NOT NULL,
    requirement_value INTEGER NOT NULL,
    points_reward INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 4: Create user_achievements table
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Step 5: Create indexes
CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement ON user_achievements(achievement_id);
CREATE INDEX idx_achievements_category ON achievements(category);
CREATE INDEX idx_achievements_tier ON achievements(tier);

-- Step 6: Enable RLS
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Step 7: Create RLS policies
CREATE POLICY "Anyone can view achievements"
    ON achievements FOR SELECT
    USING (true);

CREATE POLICY "Users can view their own achievements"
    ON user_achievements FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "System can insert user achievements"
    ON user_achievements FOR INSERT
    WITH CHECK (true);

-- Step 8: Insert achievements data
INSERT INTO achievements (name, description, category, tier, icon, requirement_type, requirement_value, points_reward) VALUES
-- Iniciante - Bronze
('Primeiro Passo', 'Complete seu primeiro desafio diário', 'iniciante', 'bronze', '🎯', 'challenges_completed', 1, 50),
('Estudante Dedicado', 'Acumule 100 pontos totais', 'iniciante', 'bronze', '📚', 'total_points', 100, 50),
('Quiz Master Iniciante', 'Complete 5 questionários', 'iniciante', 'bronze', '✅', 'quiz_completed', 5, 50),

-- Iniciante - Prata
('Sequência Iniciada', 'Estude por 3 dias consecutivos', 'iniciante', 'prata', '🔥', 'days_streak', 3, 100),
('Pontuador', 'Acumule 500 pontos totais', 'iniciante', 'prata', '⭐', 'total_points', 500, 100),
('Quiz Entusiasta', 'Complete 15 questionários', 'iniciante', 'prata', '📝', 'quiz_completed', 15, 100),

-- Intermediário - Ouro
('Semana Completa', 'Estude por 7 dias consecutivos', 'intermediario', 'ouro', '📅', 'days_streak', 7, 200),
('Milionário de Pontos', 'Acumule 1000 pontos totais', 'intermediario', 'ouro', '💰', 'total_points', 1000, 200),
('Perfeccionista', 'Obtenha 3 notas perfeitas (100%)', 'intermediario', 'ouro', '💯', 'perfect_score', 3, 200),
('Quiz Veterano', 'Complete 30 questionários', 'intermediario', 'ouro', '🎓', 'quiz_completed', 30, 200),

-- Intermediário - Platina
('Maratonista', 'Estude por 14 dias consecutivos', 'intermediario', 'platina', '🏃', 'days_streak', 14, 300),
('Rico em Conhecimento', 'Acumule 2500 pontos totais', 'intermediario', 'platina', '💎', 'total_points', 2500, 300),
('Expert em Quiz', 'Complete 50 questionários', 'intermediario', 'platina', '🧠', 'quiz_completed', 50, 300),
('Perfecção Consistente', 'Obtenha 5 notas perfeitas (100%)', 'intermediario', 'platina', '🌟', 'perfect_score', 5, 300),

-- Avançado - Diamante
('Mestre da Consistência', 'Estude por 30 dias consecutivos', 'avancado', 'diamante', '👑', 'days_streak', 30, 500),
('Fortuna do Saber', 'Acumule 5000 pontos totais', 'avancado', 'diamante', '💵', 'total_points', 5000, 500),
('Lenda dos Quiz', 'Complete 100 questionários', 'avancado', 'diamante', '🏆', 'quiz_completed', 100, 500),
('Perfeição Absoluta', 'Obtenha 10 notas perfeitas (100%)', 'avancado', 'diamante', '✨', 'perfect_score', 10, 500),

-- Mestre - Diamante
('Imortal do Estudo', 'Estude por 60 dias consecutivos', 'mestre', 'diamante', '🔱', 'days_streak', 60, 1000),
('Imperador do Conhecimento', 'Acumule 10000 pontos totais', 'mestre', 'diamante', '👑', 'total_points', 10000, 1000),
('Deus dos Quiz', 'Complete 200 questionários', 'mestre', 'diamante', '⚡', 'quiz_completed', 200, 1000),
('Lendário', 'Complete 500 desafios', 'mestre', 'diamante', '🌠', 'challenges_completed', 500, 1000),
('Mestre Perfeito', 'Obtenha 25 notas perfeitas (100%)', 'mestre', 'diamante', '🎖️', 'perfect_score', 25, 1000);

-- Step 9: Create function to check and unlock achievements
CREATE OR REPLACE FUNCTION check_and_update_achievements(p_user_id UUID)
RETURNS TABLE(achievement_id UUID, achievement_name TEXT, unlocked_at TIMESTAMPTZ) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    v_achievement RECORD;
    v_user_value INTEGER;
    v_already_unlocked BOOLEAN;
BEGIN
    FOR v_achievement IN 
        SELECT id, name, requirement_type, requirement_value 
        FROM achievements 
        ORDER BY requirement_value ASC
    LOOP
        SELECT EXISTS(
            SELECT 1 FROM user_achievements 
            WHERE user_id = p_user_id AND achievement_id = v_achievement.id
        ) INTO v_already_unlocked;
        
        IF v_already_unlocked THEN
            CONTINUE;
        END IF;
        
        CASE v_achievement.requirement_type
            WHEN 'total_points' THEN
                SELECT COALESCE(total_points, 0) INTO v_user_value
                FROM profiles WHERE id = p_user_id;
                
            WHEN 'quiz_completed' THEN
                SELECT COUNT(*) INTO v_user_value
                FROM user_quiz_attempts WHERE user_id = p_user_id;
                
            WHEN 'challenges_completed' THEN
                SELECT COUNT(*) INTO v_user_value
                FROM user_quiz_attempts 
                WHERE user_id = p_user_id AND score >= 70;
                
            WHEN 'days_streak' THEN
                SELECT COALESCE(current_streak, 0) INTO v_user_value
                FROM study_streaks WHERE user_id = p_user_id;
                
            WHEN 'perfect_score' THEN
                SELECT COUNT(*) INTO v_user_value
                FROM user_quiz_attempts 
                WHERE user_id = p_user_id AND score = 100;
                
            ELSE
                v_user_value := 0;
        END CASE;
        
        IF v_user_value >= v_achievement.requirement_value THEN
            INSERT INTO user_achievements (user_id, achievement_id)
            VALUES (p_user_id, v_achievement.id)
            ON CONFLICT DO NOTHING;
            
            RETURN QUERY 
            SELECT v_achievement.id, v_achievement.name, NOW();
        END IF;
    END LOOP;
    
    RETURN;
END;
$$;

COMMENT ON FUNCTION check_and_update_achievements IS 'Checks user progress and unlocks achievements automatically';
COMMENT ON TABLE achievements IS 'Stores all available achievements in the system';
COMMENT ON TABLE user_achievements IS 'Tracks which achievements each user has unlocked';
