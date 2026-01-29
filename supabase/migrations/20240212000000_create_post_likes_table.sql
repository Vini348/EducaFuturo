-- Create post_likes table
CREATE TABLE IF NOT EXISTS post_likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(post_id, user_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated users to insert their own likes"
ON post_likes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own likes"
ON post_likes FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Allow users to view all likes"
ON post_likes FOR SELECT
USING (true);

-- Drop the old increment_likes function
DROP FUNCTION IF EXISTS public.increment_likes(UUID);

-- Create new toggle_like function
CREATE OR REPLACE FUNCTION public.toggle_like(post_id UUID, user_id UUID)
RETURNS TABLE(likes_count BIGINT, user_has_liked BOOLEAN)
LANGUAGE plpgsql
AS $$
DECLARE
  likes_count BIGINT;
  user_has_liked BOOLEAN;
BEGIN
  -- Check if the user has already liked the post
  SELECT EXISTS (
    SELECT 1 FROM post_likes
    WHERE post_likes.post_id = $1 AND post_likes.user_id = $2
  ) INTO user_has_liked;

  IF user_has_liked THEN
    -- User has already liked, so remove the like
    DELETE FROM post_likes
    WHERE post_likes.post_id = $1 AND post_likes.user_id = $2;
    user_has_liked := false;
  ELSE
    -- User hasn't liked, so add the like
    INSERT INTO post_likes (post_id, user_id)
    VALUES ($1, $2);
    user_has_liked := true;
  END IF;

  -- Count the total likes for the post
  SELECT COUNT(*) INTO likes_count
  FROM post_likes
  WHERE post_likes.post_id = $1;

  -- Update the likes count in the forum_posts table
  UPDATE forum_posts
  SET likes = likes_count
  WHERE id = $1;

  RETURN QUERY SELECT likes_count, user_has_liked;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.toggle_like(UUID, UUID) TO authenticated;
