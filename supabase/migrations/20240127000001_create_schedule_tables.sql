-- Create study_schedule table
CREATE TABLE IF NOT EXISTS study_schedule (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  subject_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  frequency INTEGER NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

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

-- Create custom_activities table
CREATE TABLE IF NOT EXISTS custom_activities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create agenda_events table
CREATE TABLE IF NOT EXISTS agenda_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create todo_items table
CREATE TABLE IF NOT EXISTS todo_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE study_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE agenda_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE todo_items ENABLE ROW LEVEL SECURITY;

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

-- Time slots policies
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

-- Custom activities policies
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

-- Agenda events policies
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

-- Todo items policies
CREATE POLICY "Users can view their own todo items" 
ON todo_items FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own todo items" 
ON todo_items FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own todo items" 
ON todo_items FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own todo items" 
ON todo_items FOR DELETE 
USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_study_schedule_user_id ON study_schedule(user_id);
CREATE INDEX idx_time_slots_user_id ON time_slots(user_id);
CREATE INDEX idx_custom_activities_user_id ON custom_activities(user_id);
CREATE INDEX idx_agenda_events_user_id ON agenda_events(user_id);
CREATE INDEX idx_todo_items_user_id ON todo_items(user_id);

-- Set up realtime subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE study_schedule;
ALTER PUBLICATION supabase_realtime ADD TABLE time_slots;
ALTER PUBLICATION supabase_realtime ADD TABLE custom_activities;
ALTER PUBLICATION supabase_realtime ADD TABLE agenda_events;
ALTER PUBLICATION supabase_realtime ADD TABLE todo_items;
