-- Remove a função antiga e recria com parâmetro user_id
DROP FUNCTION IF EXISTS save_user_onboarding(uuid, text, text, text, text, text, text[]);
DROP FUNCTION IF EXISTS save_user_onboarding(text, text, text, text, text, text[]);

-- Cria a função com user_id como parâmetro
CREATE OR REPLACE FUNCTION save_user_onboarding(
  p_user_id uuid,
  p_school_id text,
  p_grade_level text,
  p_course text,
  p_study_location text,
  p_learning_style text,
  p_study_goals text[]
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_authenticated_user_id uuid;
BEGIN
  -- Pega o ID do usuário autenticado
  v_authenticated_user_id := auth.uid();
  
  -- Verifica se há um usuário autenticado
  IF v_authenticated_user_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Usuário não autenticado'
    );
  END IF;
  
  -- Verifica se o usuário está tentando atualizar seu próprio perfil
  IF v_authenticated_user_id != p_user_id THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Você só pode atualizar seu próprio perfil'
    );
  END IF;
  
  -- Faz UPSERT no perfil do usuário
  INSERT INTO profiles (
    id,
    school_id,
    grade_level,
    course,
    study_location,
    learning_style,
    study_goals,
    onboarding_completed,
    updated_at
  ) VALUES (
    p_user_id,
    p_school_id::uuid,
    p_grade_level,
    p_course,
    p_study_location,
    p_learning_style,
    p_study_goals,
    true,
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    grade_level = EXCLUDED.grade_level,
    course = EXCLUDED.course,
    study_location = EXCLUDED.study_location,
    learning_style = EXCLUDED.learning_style,
    study_goals = EXCLUDED.study_goals,
    onboarding_completed = true,
    updated_at = now();
  
  RETURN json_build_object(
    'success', true,
    'message', 'Onboarding salvo com sucesso'
  );
  
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object(
    'success', false,
    'error', SQLERRM
  );
END;
$$;

-- Garante que a função pode ser executada por usuários autenticados
GRANT EXECUTE ON FUNCTION save_user_onboarding(uuid, text, text, text, text, text, text[]) TO authenticated;
