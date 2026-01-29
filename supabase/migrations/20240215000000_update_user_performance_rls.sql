-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own performance data" ON public.user_performance;
DROP POLICY IF EXISTS "Users can insert their own performance data" ON public.user_performance;
DROP POLICY IF EXISTS "Users can update their own performance data" ON public.user_performance;

-- Create new policies
CREATE POLICY "Users can view their own performance data"
ON public.user_performance
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own performance data"
ON public.user_performance
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own performance data"
ON public.user_performance
FOR UPDATE
USING (auth.uid() = user_id);

-- Ensure RLS is enabled
ALTER TABLE public.user_performance ENABLE ROW LEVEL SECURITY;
