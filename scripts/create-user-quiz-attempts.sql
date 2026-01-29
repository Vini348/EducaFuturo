-- Script para criar tabela user_quiz_attempts
-- Esta tabela armazena todas as tentativas de quizzes/desafios dos usuários

-- Remove a tabela se já existir
DROP TABLE IF EXISTS user_quiz_attempts CASCADE;

-- Cria a tabela user_quiz_attempts
CREATE TABLE user_quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id TEXT NOT NULL,
  subject TEXT NOT NULL,
  topic TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  score INTEGER NOT NULL DEFAULT 0,
  max_score INTEGER NOT NULL,
  accuracy DECIMAL(5,2) GENERATED ALWAYS AS (
    CASE 
      WHEN max_score > 0 THEN LEAST((score::DECIMAL / max_score::DECIMAL * 100), 100)
      ELSE 0 
    END
  ) STORED,
  time_spent INTEGER, -- em segundos
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  answers JSONB, -- armazena as respostas do usuário
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhorar performance
CREATE INDEX idx_user_quiz_attempts_user_id ON user_quiz_attempts(user_id);
CREATE INDEX idx_user_quiz_attempts_subject ON user_quiz_attempts(subject);
CREATE INDEX idx_user_quiz_attempts_completed_at ON user_quiz_attempts(completed_at);
CREATE INDEX idx_user_quiz_attempts_user_subject ON user_quiz_attempts(user_id, subject);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_user_quiz_attempts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_quiz_attempts_updated_at
  BEFORE UPDATE ON user_quiz_attempts
  FOR EACH ROW
  EXECUTE FUNCTION update_user_quiz_attempts_updated_at();

-- Políticas RLS
ALTER TABLE user_quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Usuários podem visualizar suas próprias tentativas
CREATE POLICY "Users can view their own quiz attempts"
  ON user_quiz_attempts
  FOR SELECT
  USING (auth.uid() = user_id);

-- Usuários podem inserir suas próprias tentativas
CREATE POLICY "Users can insert their own quiz attempts"
  ON user_quiz_attempts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Usuários podem atualizar suas próprias tentativas
CREATE POLICY "Users can update their own quiz attempts"
  ON user_quiz_attempts
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Comentários para documentação
COMMENT ON TABLE user_quiz_attempts IS 'Armazena todas as tentativas de quizzes e desafios dos usuários';
COMMENT ON COLUMN user_quiz_attempts.accuracy IS 'Precisão calculada automaticamente (0-100%)';
COMMENT ON COLUMN user_quiz_attempts.answers IS 'JSON com as respostas do usuário para análise posterior';
