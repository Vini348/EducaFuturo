-- Script simplificado para corrigir o onboarding
-- Execute este script no Supabase SQL Editor

-- 1. Remove a função antiga se existir
DROP FUNCTION IF EXISTS save_user_onboarding;

-- 2. Cria a função simplificada que aceita user_id como parâmetro
CREATE OR REPLACE FUNCTION save_user_onboarding(
  p_user_id UUID,
  p_school_id UUID,
  p_grade TEXT,
  p_target_course TEXT,
  p_target_exam TEXT,
  p_study_location TEXT,
  p_learning_style TEXT,
  p_study_goals TEXT[]
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result JSON;
BEGIN
  -- Insere ou atualiza o perfil do usuário
  INSERT INTO profiles (
    id,
    school_id,
    grade,
    target_course,
    target_exam,
    study_location,
    learning_style,
    study_goals,
    onboarding_completed,
    total_points,
    updated_at
  ) VALUES (
    p_user_id,
    p_school_id,
    p_grade,
    p_target_course,
    p_target_exam,
    p_study_location,
    p_learning_style,
    p_study_goals,
    true,
    0,
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    grade = EXCLUDED.grade,
    target_course = EXCLUDED.target_course,
    target_exam = EXCLUDED.target_exam,
    study_location = EXCLUDED.study_location,
    learning_style = EXCLUDED.learning_style,
    study_goals = EXCLUDED.study_goals,
    onboarding_completed = true,
    updated_at = NOW();

  -- Retorna sucesso
  v_result := json_build_object(
    'success', true,
    'message', 'Onboarding salvo com sucesso'
  );
  
  RETURN v_result;
  
EXCEPTION WHEN OTHERS THEN
  -- Retorna erro
  v_result := json_build_object(
    'success', false,
    'message', SQLERRM
  );
  RETURN v_result;
END;
$$;

-- 3. Garante que a coluna onboarding_completed existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'onboarding_completed'
  ) THEN
    ALTER TABLE profiles ADD COLUMN onboarding_completed BOOLEAN DEFAULT false;
  END IF;
END $$;

-- 4. Atualiza a política RLS para permitir INSERT/UPDATE
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR ALL
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());
