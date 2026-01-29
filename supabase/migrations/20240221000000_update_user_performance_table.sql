-- Add new columns to user_performance table
ALTER TABLE public.user_performance
ADD COLUMN IF NOT EXISTS quiz_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS quiz_correct_answers INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS flashcard_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS flashcard_correct_answers INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS game_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS game_correct_answers INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_study_sessions INTEGER DEFAULT 0;

-- Update the total_study_time column to be in seconds
ALTER TABLE public.user_performance
ALTER COLUMN total_study_time TYPE INTEGER;

-- Add a function to update total_study_time
CREATE OR REPLACE FUNCTION update_total_study_time()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total_study_time = NEW.total_study_time + 
    COALESCE(NEW.quiz_attempts, 0) * 60 +  -- Assume 1 minute per quiz attempt
    COALESCE(NEW.flashcard_attempts, 0) * 30 +  -- Assume 30 seconds per flashcard attempt
    COALESCE((SELECT SUM(total_time) FROM game_results WHERE user_id = NEW.user_id), 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update total_study_time
CREATE TRIGGER update_study_time_trigger
BEFORE UPDATE ON public.user_performance
FOR EACH ROW
EXECUTE FUNCTION update_total_study_time();
