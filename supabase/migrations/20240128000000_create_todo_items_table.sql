-- Create todo_items table
CREATE TABLE IF NOT EXISTS todo_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_todo_items_user_id ON todo_items(user_id);

-- Set up Row Level Security (RLS)
ALTER TABLE todo_items ENABLE ROW LEVEL SECURITY;

-- Create policies
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

-- Set up realtime subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE todo_items;
