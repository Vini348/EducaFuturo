-- Update study_schedule table schema
DROP TABLE IF EXISTS study_schedule;
CREATE TABLE study_schedule (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  subject_name TEXT NOT NULL,
  description TEXT,
  color TEXT,
  frequency INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE study_schedule ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own study schedule" 
  ON study_schedule FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own study schedule" 
  ON study_schedule FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own study schedule" 
  ON study_schedule FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own study schedule" 
  ON study_schedule FOR DELETE 
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_study_schedule_user_id ON study_schedule(user_id);
