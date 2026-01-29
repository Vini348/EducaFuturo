-- Criar tabela de escolas
CREATE TABLE IF NOT EXISTS public.schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT,
  state TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar campos ao profiles para onboarding e pontos
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id),
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS total_points INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS grade_level TEXT, -- série/ano
ADD COLUMN IF NOT EXISTS course TEXT, -- curso pretendido
ADD COLUMN IF NOT EXISTS study_location TEXT, -- local de estudo preferido
ADD COLUMN IF NOT EXISTS learning_style TEXT, -- estilo de aprendizagem
ADD COLUMN IF NOT EXISTS study_goals TEXT[], -- objetivos de estudo
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Criar tabela de histórico de pontos
CREATE TABLE IF NOT EXISTS public.user_points_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  activity_type TEXT NOT NULL, -- 'challenge', 'quiz', 'flashcard', 'essay', etc.
  activity_id TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_profiles_school_id ON public.profiles(school_id);
CREATE INDEX IF NOT EXISTS idx_profiles_total_points ON public.profiles(total_points DESC);
CREATE INDEX IF NOT EXISTS idx_user_points_history_user_id ON public.user_points_history(user_id);

-- Inserir algumas escolas de exemplo
INSERT INTO public.schools (name, city, state) VALUES
  ('Colégio Dom Pedro II', 'Brasília', 'DF'),
  ('Centro Educacional 01', 'Brasília', 'DF'),
  ('Colégio Militar de Brasília', 'Brasília', 'DF'),
  ('Colégio La Salle', 'Brasília', 'DF'),
  ('Sigma', 'Brasília', 'DF')
ON CONFLICT DO NOTHING;

-- Habilitar RLS
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_points_history ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para schools (todos podem ler)
CREATE POLICY "Schools are viewable by everyone"
  ON public.schools FOR SELECT
  USING (true);

-- Políticas de segurança para user_points_history
CREATE POLICY "Users can view their own points history"
  ON public.user_points_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own points"
  ON public.user_points_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Função para atualizar total_points automaticamente
CREATE OR REPLACE FUNCTION update_user_total_points()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET total_points = total_points + NEW.points
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para atualizar pontos automaticamente
DROP TRIGGER IF EXISTS trigger_update_total_points ON public.user_points_history;
CREATE TRIGGER trigger_update_total_points
  AFTER INSERT ON public.user_points_history
  FOR EACH ROW
  EXECUTE FUNCTION update_user_total_points();

COMMENT ON TABLE public.schools IS 'Tabela de escolas para ranking';
COMMENT ON TABLE public.user_points_history IS 'Histórico de pontos ganhos pelos usuários';
COMMENT ON COLUMN public.profiles.onboarding_completed IS 'Indica se o usuário completou o questionário de onboarding';
COMMENT ON COLUMN public.profiles.total_points IS 'Total de pontos acumulados pelo usuário';
