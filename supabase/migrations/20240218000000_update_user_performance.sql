-- Add new columns for study tracking
ALTER TABLE user_performance
ADD COLUMN IF NOT EXISTS total_study_days INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS study_days TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS study_streak INTEGER DEFAULT 0;

-- Create or replace function to update study days count
CREATE OR REPLACE FUNCTION update_study_days_count()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total_study_days := array_length(NEW.study_days, 1);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update total_study_days
DROP TRIGGER IF EXISTS update_study_days_count_trigger ON user_performance;
CREATE TRIGGER update_study_days_count_trigger
BEFORE INSERT OR UPDATE OF study_days ON user_performance
FOR EACH ROW
EXECUTE FUNCTION update_study_days_count();
