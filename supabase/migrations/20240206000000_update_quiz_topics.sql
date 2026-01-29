-- Corrigir o tipo da coluna 'options' para TEXT[]
ALTER TABLE quiz_questions
ALTER COLUMN options TYPE TEXT[] USING options::text[];

-- Corrigir o tipo da coluna 'incorrect_answers' para TEXT[]
ALTER TABLE quiz_questions
ALTER COLUMN incorrect_answers TYPE TEXT[] USING incorrect_answers::text[];


-- Agora vamos limpar a tabela existente (caso ainda tenha dados incorretos)
TRUNCATE TABLE quiz_questions;

-- Agora podemos inserir as questões com os tipos corretos
-- Eletrônica Digital
-- Conceitos Básicos (Fácil - 1 estrela)
INSERT INTO quiz_questions (subject, difficulty, question, correct_answer, options, incorrect_answers, explanation) VALUES
('Digital', 'Fácil', 'O que é um bit em eletrônica digital?', 'A menor unidade de informação que pode ser 0 ou 1', ARRAY['A menor unidade de informação que pode ser 0 ou 1', 'Um tipo de circuito integrado', 'Uma unidade de tensão', 'Um componente eletrônico'], ARRAY['Um tipo de circuito integrado', 'Uma unidade de tensão', 'Um componente eletrônico'], 'Um bit (dígito binário) é a unidade fundamental de informação em sistemas digitais, podendo assumir apenas dois estados: 0 ou 1.'),
('Digital', 'Fácil', 'Qual é a função básica de uma porta AND?', 'Produzir saída 1 apenas quando todas as entradas são 1', ARRAY['Produzir saída 1 apenas quando todas as entradas são 1', 'Inverter o sinal de entrada', 'Somar sinais digitais', 'Produzir saída 1 quando qualquer entrada é 1'], ARRAY['Inverter o sinal de entrada', 'Somar sinais digitais', 'Produzir saída 1 quando qualquer entrada é 1'], 'A porta AND é um componente fundamental que implementa a operação lógica E, produzindo saída 1 apenas quando todas as suas entradas são 1.');
-- ... (restante das questões)
