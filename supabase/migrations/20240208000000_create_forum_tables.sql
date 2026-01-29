-- Create forum_posts table if it doesn't exist
CREATE TABLE IF NOT EXISTS forum_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create forum_comments table if it doesn't exist
CREATE TABLE IF NOT EXISTS forum_comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_forum_posts_user_id ON forum_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_created_at ON forum_posts(created_at);
CREATE INDEX IF NOT EXISTS idx_forum_comments_post_id ON forum_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_forum_comments_user_id ON forum_comments(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_comments ENABLE ROW LEVEL SECURITY;

-- Create policies for forum_posts
CREATE POLICY "Allow public read access to forum posts"
ON forum_posts FOR SELECT
USING (true);

CREATE POLICY "Allow authenticated users to create forum posts"
ON forum_posts FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow users to update their own forum posts"
ON forum_posts FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own forum posts"
ON forum_posts FOR DELETE
USING (auth.uid() = user_id);

-- Create policies for forum_comments
CREATE POLICY "Allow public read access to forum comments"
ON forum_comments FOR SELECT
USING (true);

CREATE POLICY "Allow authenticated users to create forum comments"
ON forum_comments FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow users to update their own forum comments"
ON forum_comments FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own forum comments"
ON forum_comments FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_forum_posts_updated_at
BEFORE UPDATE ON forum_posts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_comments_updated_at
BEFORE UPDATE ON forum_comments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
