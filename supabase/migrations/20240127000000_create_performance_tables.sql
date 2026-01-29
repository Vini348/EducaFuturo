-- Create user_performance table
CREATE TABLE IF NOT EXISTS user_performance (
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  performance JSONB NOT NULL DEFAULT '{}'::jsonb,
  total_study_time INTEGER DEFAULT 0,
  study_days TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (user_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_performance_user_id ON user_performance(user_id);

-- Set up Row Level Security (RLS)
ALTER TABLE user_performance ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own performance" 
ON user_performance FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own performance" 
ON user_performance FOR UPDATE 
USING (auth.uid() = user_id);

-- Create a trigger to set updated_at on every update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_performance_updated_at
  BEFORE UPDATE ON user_performance
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Set up realtime subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE user_performance;
