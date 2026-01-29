-- Create user_performance table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_performance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  study_days DATE[] DEFAULT ARRAY[]::DATE[],
  total_study_time INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_performance_user_id ON public.user_performance(user_id);

-- Set up Row Level Security (RLS)
ALTER TABLE public.user_performance ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own performance data"
ON public.user_performance FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own performance data"
ON public.user_performance FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own performance data"
ON public.user_performance FOR UPDATE
USING (auth.uid() = user_id);

-- Create a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_performance_updated_at
BEFORE UPDATE ON public.user_performance
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT ALL ON TABLE public.user_performance TO authenticated;
