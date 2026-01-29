-- Create forum_attachments table
CREATE TABLE IF NOT EXISTS forum_attachments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES forum_comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  
  -- Constraint to ensure attachment belongs to either a post OR a comment, not both
  CONSTRAINT attachment_belongs_to_post_or_comment CHECK (
    (post_id IS NOT NULL AND comment_id IS NULL) OR
    (post_id IS NULL AND comment_id IS NOT NULL)
  )
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_forum_attachments_post_id ON forum_attachments(post_id);
CREATE INDEX IF NOT EXISTS idx_forum_attachments_comment_id ON forum_attachments(comment_id);
CREATE INDEX IF NOT EXISTS idx_forum_attachments_user_id ON forum_attachments(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE forum_attachments ENABLE ROW LEVEL SECURITY;

-- Create policies for forum_attachments
CREATE POLICY "Allow public read access to forum attachments"
ON forum_attachments FOR SELECT
USING (true);

CREATE POLICY "Allow authenticated users to create forum attachments"
ON forum_attachments FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow users to update their own forum attachments"
ON forum_attachments FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own forum attachments"
ON forum_attachments FOR DELETE
USING (auth.uid() = user_id);
