-- Create the game_results table
CREATE TABLE IF NOT EXISTS public.game_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  game_type TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_time INTEGER NOT NULL,
  accuracy FLOAT NOT NULL,
  challenges_completed INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add RLS policies
ALTER TABLE public.game_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own game results" ON public.game_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own game results" ON public.game_results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own game results" ON public.game_results
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own game results" ON public.game_results
  FOR DELETE USING (auth.uid() = user_id);
