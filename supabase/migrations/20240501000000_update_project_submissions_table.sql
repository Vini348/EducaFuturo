-- Adiciona coluna de feedback à tabela project_submissions
ALTER TABLE project_submissions ADD COLUMN IF NOT EXISTS feedback TEXT;

-- Adiciona coluna de timestamp de submissão
ALTER TABLE project_submissions ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Adiciona coluna de timestamp de avaliação
ALTER TABLE project_submissions ADD COLUMN IF NOT EXISTS evaluated_at TIMESTAMP WITH TIME ZONE;

-- Atualiza a função de RLS para permitir que administradores atualizem o feedback
CREATE OR REPLACE FUNCTION check_is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role = 'admin'
    FROM auth.users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atualiza as políticas para permitir que administradores atualizem o feedback
DROP POLICY IF EXISTS "Admins can update project submissions" ON project_submissions;
CREATE POLICY "Admins can update project submissions"
ON project_submissions
FOR UPDATE
TO authenticated
USING (check_is_admin())
WITH CHECK (check_is_admin());
