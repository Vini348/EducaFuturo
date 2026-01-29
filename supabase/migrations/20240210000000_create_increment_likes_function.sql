-- Create the increment_likes function
CREATE OR REPLACE FUNCTION public.increment_likes(post_id UUID)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE forum_posts
  SET likes = COALESCE(likes, 0) + 1
  WHERE id = post_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.increment_likes(UUID) TO authenticated;
