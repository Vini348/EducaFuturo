-- Function to check if a policy exists
CREATE OR REPLACE FUNCTION policy_exists(p_table_name text, p_policy_name text) RETURNS boolean AS $$
DECLARE
  found boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = p_table_name
      AND policyname = p_policy_name
  ) INTO found;
  RETURN found;
END;
$$ LANGUAGE plpgsql;

-- Create policies for forum_posts if they don't exist
DO $$
BEGIN
  -- Allow public read access to forum posts
  IF NOT policy_exists('forum_posts', 'Allow public read access to forum posts') THEN
    CREATE POLICY "Allow public read access to forum posts"
    ON forum_posts FOR SELECT
    USING (true);
  END IF;

  -- Allow authenticated users to create forum posts
  IF NOT policy_exists('forum_posts', 'Allow authenticated users to create forum posts') THEN
    CREATE POLICY "Allow authenticated users to create forum posts"
    ON forum_posts FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');
  END IF;

  -- Allow users to update their own forum posts
  IF NOT policy_exists('forum_posts', 'Allow users to update their own forum posts') THEN
    CREATE POLICY "Allow users to update their own forum posts"
    ON forum_posts FOR UPDATE
    USING (auth.uid() = user_id);
  END IF;

  -- Allow users to delete their own forum posts
  IF NOT policy_exists('forum_posts', 'Allow users to delete their own forum posts') THEN
    CREATE POLICY "Allow users to delete their own forum posts"
    ON forum_posts FOR DELETE
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create policies for forum_comments if they don't exist
DO $$
BEGIN
  -- Allow public read access to forum comments
  IF NOT policy_exists('forum_comments', 'Allow public read access to forum comments') THEN
    CREATE POLICY "Allow public read access to forum comments"
    ON forum_comments FOR SELECT
    USING (true);
  END IF;

  -- Allow authenticated users to create forum comments
  IF NOT policy_exists('forum_comments', 'Allow authenticated users to create forum comments') THEN
    CREATE POLICY "Allow authenticated users to create forum comments"
    ON forum_comments FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');
  END IF;

  -- Allow users to update their own forum comments
  IF NOT policy_exists('forum_comments', 'Allow users to update their own forum comments') THEN
    CREATE POLICY "Allow users to update their own forum comments"
    ON forum_comments FOR UPDATE
    USING (auth.uid() = user_id);
  END IF;

  -- Allow users to delete their own forum comments
  IF NOT policy_exists('forum_comments', 'Allow users to delete their own forum comments') THEN
    CREATE POLICY "Allow users to delete their own forum comments"
    ON forum_comments FOR DELETE
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- Drop the policy_exists function after use
DROP FUNCTION IF EXISTS policy_exists(text, text);
