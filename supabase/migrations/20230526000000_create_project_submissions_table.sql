-- Create project_submissions table
CREATE TABLE project_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id TEXT NOT NULL,
  file_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX project_submissions_user_id_idx ON project_submissions(user_id);
CREATE INDEX project_submissions_project_id_idx ON project_submissions(project_id);

-- Set up Row Level Security (RLS)
ALTER TABLE project_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own submissions" 
ON project_submissions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own submissions" 
ON project_submissions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending submissions" 
ON project_submissions FOR UPDATE 
USING (auth.uid() = user_id AND status = 'pending');

-- Create a trigger to set updated_at on every update
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON project_submissions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Set up realtime subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE project_submissions;
