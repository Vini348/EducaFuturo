-- Remover políticas existentes para a tabela user_performance
DROP POLICY IF EXISTS "Usuários podem ver apenas seus próprios dados de desempenho" ON user_performance;
DROP POLICY IF EXISTS "Usuários podem inserir apenas seus próprios dados de desempenho" ON user_performance;
DROP POLICY IF EXISTS "Usuários podem atualizar apenas seus próprios dados de desempenho" ON user_performance;
DROP POLICY IF EXISTS "Usuários podem excluir apenas seus próprios dados de desempenho" ON user_performance;

-- Habilitar RLS na tabela user_performance (caso não esteja habilitado)
ALTER TABLE user_performance ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir que usuários vejam apenas seus próprios dados
CREATE POLICY "Usuários podem ver apenas seus próprios dados de desempenho"
ON user_performance
FOR SELECT
USING (auth.uid() = user_id);

-- Criar política para permitir que usuários insiram apenas seus próprios dados
CREATE POLICY "Usuários podem inserir apenas seus próprios dados de desempenho"
ON user_performance
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Criar política para permitir que usuários atualizem apenas seus próprios dados
CREATE POLICY "Usuários podem atualizar apenas seus próprios dados de desempenho"
ON user_performance
FOR UPDATE
USING (auth.uid() = user_id);

-- Criar política para permitir que usuários excluam apenas seus próprios dados
CREATE POLICY "Usuários podem excluir apenas seus próprios dados de desempenho"
ON user_performance
FOR DELETE
USING (auth.uid() = user_id);

-- Comentário para explicar a migração
COMMENT ON TABLE user_performance IS 'Armazena dados de desempenho dos usuários com políticas RLS para garantir que cada usuário acesse apenas seus próprios dados';
