-- Executando script para criar tabela essay_evaluations
-- Criar tabela para armazenar avaliações de redações
CREATE TABLE IF NOT EXISTS essay_evaluations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  original_text TEXT NOT NULL,
  total_score INTEGER NOT NULL CHECK (total_score >= 0 AND total_score <= 1000),
  competencies JSONB NOT NULL,
  positive_points TEXT NOT NULL,
  improvement_points TEXT NOT NULL,
  rewrite_suggestion TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_essay_evaluations_user_id ON essay_evaluations(user_id);
CREATE INDEX IF NOT EXISTS idx_essay_evaluations_created_at ON essay_evaluations(created_at);
CREATE INDEX IF NOT EXISTS idx_essay_evaluations_total_score ON essay_evaluations(total_score);

-- Habilitar RLS (Row Level Security)
ALTER TABLE essay_evaluations ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem apenas suas próprias redações
CREATE POLICY "Users can view own essay evaluations" ON essay_evaluations
  FOR SELECT USING (auth.uid() = user_id);

-- Política para usuários inserirem suas próprias redações
CREATE POLICY "Users can insert own essay evaluations" ON essay_evaluations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para usuários atualizarem suas próprias redações
CREATE POLICY "Users can update own essay evaluations" ON essay_evaluations
  FOR UPDATE USING (auth.uid() = user_id);

-- Política para usuários deletarem suas próprias redações
CREATE POLICY "Users can delete own essay evaluations" ON essay_evaluations
  FOR DELETE USING (auth.uid() = user_id);
