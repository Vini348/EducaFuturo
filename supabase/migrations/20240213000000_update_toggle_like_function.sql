-- Update the toggle_like function
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
