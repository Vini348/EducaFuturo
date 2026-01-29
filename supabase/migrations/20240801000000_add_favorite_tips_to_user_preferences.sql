-- Adiciona a coluna favorite_tips à tabela user_preferences
ALTER TABLE IF EXISTS user_preferences 
ADD COLUMN IF NOT EXISTS favorite_tips TEXT[] DEFAULT '{}';

-- Atualiza as políticas RLS para a tabela user_preferences
CREATE POLICY IF NOT EXISTS "Usuários podem ler suas próprias preferências"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Usuários podem atualizar suas próprias preferências"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Usuários podem inserir suas próprias preferências"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);
