-- Add likes column to forum_posts table
ALTER TABLE forum_posts
ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;
