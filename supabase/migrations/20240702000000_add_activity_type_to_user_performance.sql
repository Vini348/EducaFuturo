-- Verifica se a coluna já existe antes de tentar adicioná-la
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'user_performance'
        AND column_name = 'activity_type'
    ) THEN
        ALTER TABLE user_performance ADD COLUMN activity_type TEXT;
    END IF;
END $$;

-- Atualiza os registros existentes para ter um valor padrão
UPDATE user_performance
SET activity_type = 'general'
WHERE activity_type IS NULL;

-- Comentário para explicar a migração
COMMENT ON COLUMN user_performance.activity_type IS 'Tipo de atividade de estudo (flashcards, quiz, leitura, etc.)';
