-- Create time_slots table
CREATE TABLE IF NOT EXISTS time_slots (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  day_of_week TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  activity TEXT NOT NULL,
  subject_id TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_time_slots_user_id ON time_slots(user_id);

-- Set up Row Level Security (RLS)
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own time slots" 
ON time_slots FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own time slots" 
ON time_slots FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own time slots" 
ON time_slots FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own time slots" 
ON time_slots FOR DELETE 
USING (auth.uid() = user_id);

-- Set up realtime subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE time_slots;
