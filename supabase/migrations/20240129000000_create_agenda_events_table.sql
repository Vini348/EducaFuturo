-- Create agenda_events table
CREATE TABLE IF NOT EXISTS agenda_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_agenda_events_user_id ON agenda_events(user_id);

-- Set up Row Level Security (RLS)
ALTER TABLE agenda_events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own agenda events" 
ON agenda_events FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own agenda events" 
ON agenda_events FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own agenda events" 
ON agenda_events FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own agenda events" 
ON agenda_events FOR DELETE 
USING (auth.uid() = user_id);

-- Set up realtime subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE agenda_events;
