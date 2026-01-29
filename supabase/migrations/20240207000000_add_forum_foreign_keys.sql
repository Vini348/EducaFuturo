-- Function to check if a constraint exists
CREATE OR REPLACE FUNCTION constraint_exists(p_schema_name text, p_table_name text, p_constraint_name text) RETURNS boolean AS $$
DECLARE
  found boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_schema = p_schema_name
    AND table_name = p_table_name
    AND constraint_name = p_constraint_name
  ) INTO found;
  RETURN found;
END;
$$ LANGUAGE plpgsql;

-- Add foreign key constraint to forum_posts table if it doesn't exist
DO $$
BEGIN
  IF NOT constraint_exists('public', 'forum_posts', 'forum_posts_user_id_fkey') THEN
    ALTER TABLE forum_posts
    ADD CONSTRAINT forum_posts_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE;
  END IF;
END $$;

-- Add foreign key constraint to forum_comments table if it doesn't exist
DO $$
BEGIN
  IF NOT constraint_exists('public', 'forum_comments', 'forum_comments_user_id_fkey') THEN
    ALTER TABLE forum_comments
    ADD CONSTRAINT forum_comments_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE;
  END IF;
END $$;

-- Add foreign key constraint from forum_comments to forum_posts if it doesn't exist
DO $$
BEGIN
  IF NOT constraint_exists('public', 'forum_comments', 'forum_comments_post_id_fkey') THEN
    ALTER TABLE forum_comments
    ADD CONSTRAINT forum_comments_post_id_fkey
    FOREIGN KEY (post_id)
    REFERENCES forum_posts(id)
    ON DELETE CASCADE;
  END IF;
END $$;

-- Drop the function after use
DROP FUNCTION IF EXISTS constraint_exists(text, text, text);
