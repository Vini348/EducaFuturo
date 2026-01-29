-- Update the user_performance table to ensure proper study days tracking
ALTER TABLE user_performance 
ADD COLUMN IF NOT EXISTS total_study_days INTEGER DEFAULT 0;

-- Add a trigger to automatically update total_study_days
CREATE OR REPLACE FUNCTION update_total_study_days()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total_study_days := array_length(NEW.study_days, 1);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_study_days_count ON user_performance;
CREATE TRIGGER update_study_days_count
  BEFORE INSERT OR UPDATE OF study_days
  ON user_performance
  FOR EACH ROW
  EXECUTE FUNCTION update_total_study_days();

-- Update existing rows
UPDATE user_performance 
SET total_study_days = COALESCE(array_length(study_days, 1), 0)
WHERE true;
