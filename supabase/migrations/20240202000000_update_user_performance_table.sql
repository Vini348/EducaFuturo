-- Update user_performance table to ensure it has the study_days column
ALTER TABLE user_performance
ADD COLUMN IF NOT EXISTS study_days DATE[] DEFAULT ARRAY[]::DATE[];

-- Create or replace function to update study days
CREATE OR REPLACE FUNCTION update_study_days(
  p_user_id UUID,
  p_study_days DATE[]
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_performance (user_id, study_days)
  VALUES (p_user_id, p_study_days)
  ON CONFLICT (user_id)
  DO UPDATE SET study_days = p_study_days;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION update_study_days TO authenticated;
GRANT ALL ON TABLE user_performance TO authenticated;
