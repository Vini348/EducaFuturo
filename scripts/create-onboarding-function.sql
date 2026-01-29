-- Função para salvar dados de onboarding
-- Usa SECURITY DEFINER para bypassar RLS temporariamente
CREATE OR REPLACE FUNCTION save_user_onboarding(
  p_school_id UUID,
  p_grade_level TEXT,
  p_course TEXT,
  p_study_location TEXT,
  p_learning_style TEXT,
  p_study_goals TEXT[]
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Atualiza o perfil do usuário autenticado
  UPDATE profiles
  SET 
    school_id = p_school_id,
    grade_level = p_grade_level,
    course = p_course,
    study_location = p_study_location,
    learning_style = p_learning_style,
    study_goals = p_study_goals,
    onboarding_completed = true,
    updated_at = NOW()
  WHERE id = auth.uid();
  
  -- Verifica se o UPDATE afetou alguma linha
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Perfil não encontrado para o usuário autenticado';
  END IF;
  
  RETURN true;
END;
$$;

-- Garante que apenas usuários autenticados possam executar a função
REVOKE ALL ON FUNCTION save_user_onboarding FROM PUBLIC;
GRANT EXECUTE ON FUNCTION save_user_onboarding TO authenticated;

-- Comentário explicativo
COMMENT ON FUNCTION save_user_onboarding IS 
  'Salva os dados de onboarding do usuário. Usa SECURITY DEFINER para bypassar RLS.';
