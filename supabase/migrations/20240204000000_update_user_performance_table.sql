-- Add new columns to user_performance table
ALTER TABLE public.user_performance
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS study_streak INTEGER DEFAULT 0;

-- Update the function to handle the new columns
CREATE OR REPLACE FUNCTION update_study_streak()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if it's a new day
  IF NEW.last_login::date > OLD.last_login::date THEN
    -- If it's been more than 2 days, reset the streak
    IF NEW.last_login::date > (OLD.last_login::date + INTERVAL '2 days') THEN
      NEW.study_streak := 1;
    ELSE
      -- Otherwise, increment the streak
      NEW.study_streak := OLD.study_streak + 1;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to update the study streak
CREATE TRIGGER update_study_streak_trigger
BEFORE UPDATE ON public.user_performance
FOR EACH ROW
WHEN (NEW.last_login IS DISTINCT FROM OLD.last_login)
EXECUTE FUNCTION update_study_streak();
