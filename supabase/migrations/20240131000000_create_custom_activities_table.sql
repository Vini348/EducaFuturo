-- Create custom_activities table
CREATE TABLE IF NOT EXISTS custom_activities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_custom_activities_user_id ON custom_activities(user_id);

-- Set up Row Level Security (RLS)
ALTER TABLE custom_activities ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own custom activities" 
ON custom_activities FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own custom activities" 
ON custom_activities FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own custom activities" 
ON custom_activities FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own custom activities" 
ON custom_activities FOR DELETE 
USING (auth.uid() = user_id);

-- Set up realtime subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE custom_activities;
