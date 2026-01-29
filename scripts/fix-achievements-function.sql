-- Drop existing function and create condition_type enum
-- This fixes the "cannot change return type" error

-- Step 1: Drop the existing function
DROP FUNCTION IF EXISTS check_and_update_achievements(uuid);
DROP FUNCTION IF EXISTS check_and_update_achievements(uuid, text);

-- Step 2: Create condition_type enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE condition_type AS ENUM (
        'total_points',
        'quiz_completed',
        'flashcards_reviewed',
        'days_streak',
        'challenges_completed',
        'perfect_score',
        'study_time'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Step 3: Ensure achievements table has correct structure
ALTER TABLE achievements 
ADD COLUMN IF NOT EXISTS requirement_type condition_type,
ADD COLUMN IF NOT EXISTS requirement_value INTEGER;

-- Step 4: Recreate the function with correct return type
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
    -- Loop through all achievements
    FOR v_achievement IN 
        SELECT id, name, requirement_type, requirement_value 
        FROM achievements 
        ORDER BY requirement_value ASC
    LOOP
        -- Check if already unlocked
        SELECT EXISTS(
            SELECT 1 FROM user_achievements 
            WHERE user_id = p_user_id AND achievement_id = v_achievement.id
        ) INTO v_already_unlocked;
        
        IF v_already_unlocked THEN
            CONTINUE;
        END IF;
        
        -- Get current user value based on requirement type
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
        
        -- Check if requirement is met
        IF v_user_value >= v_achievement.requirement_value THEN
            -- Unlock achievement
            INSERT INTO user_achievements (user_id, achievement_id)
            VALUES (p_user_id, v_achievement.id)
            ON CONFLICT DO NOTHING;
            
            -- Return the unlocked achievement
            RETURN QUERY 
            SELECT v_achievement.id, v_achievement.name, NOW();
        END IF;
    END LOOP;
    
    RETURN;
END;
$$;

-- Step 5: Update achievements to use condition_type
UPDATE achievements 
SET requirement_type = CAST(
    CASE 
        WHEN requirement_type::text = 'total_points' THEN 'total_points'
        WHEN requirement_type::text = 'quiz_completed' THEN 'quiz_completed'
        WHEN requirement_type::text = 'challenges_completed' THEN 'challenges_completed'
        WHEN requirement_type::text = 'days_streak' THEN 'days_streak'
        WHEN requirement_type::text = 'perfect_score' THEN 'perfect_score'
        ELSE 'total_points'
    END AS condition_type
)
WHERE requirement_type IS NOT NULL;

COMMENT ON FUNCTION check_and_update_achievements IS 'Checks user progress and unlocks achievements automatically';
