-- Fix RLS policies to allow users to update their own profiles
-- This script ensures users can update their onboarding status

-- Drop existing UPDATE policy if it exists
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create a simple UPDATE policy that allows users to update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Verify the policy was created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'profiles' AND cmd = 'UPDATE';
