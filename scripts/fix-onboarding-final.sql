-- ============================================
-- Script final para corrigir onboarding
-- Remove funções antigas e recria corretamente
-- ============================================

-- 1. Remover função antiga se existir
DROP FUNCTION IF EXISTS save_user_onboarding(UUID, TEXT, TEXT, TEXT, TEXT, TEXT[]);

-- 2. Criar função para criar perfis automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id, created_at, updated_at)
  VALUES (NEW.id, NOW(), NOW())
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- 3. Recriar trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 4. Criar perfis para usuários existentes
INSERT INTO public.profiles (id, created_at, updated_at)
SELECT 
  au.id,
  NOW(),
  NOW()
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = au.id
)
ON CONFLICT (id) DO NOTHING;

-- 5. Criar nova função save_user_onboarding com UPSERT correto
CREATE OR REPLACE FUNCTION save_user_onboarding(
  p_school_id UUID,
  p_grade_level TEXT,
  p_course TEXT,
  p_study_location TEXT,
  p_learning_style TEXT,
  p_study_goals TEXT[]
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_result JSON;
BEGIN
  -- Pegar o ID do usuário autenticado
  v_user_id := auth.uid();
  
  -- Verificar se o usuário está autenticado
  IF v_user_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Usuário não autenticado'
    );
  END IF;
  
  -- Fazer UPSERT do perfil
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
  )
  VALUES (
    v_user_id,
    p_school_id,
    p_grade_level,
    p_course,
    p_study_location,
    p_learning_style,
    p_study_goals,
    true,
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    grade_level = EXCLUDED.grade_level,
    course = EXCLUDED.course,
    study_location = EXCLUDED.study_location,
    learning_style = EXCLUDED.learning_style,
    study_goals = EXCLUDED.study_goals,
    onboarding_completed = true,
    updated_at = NOW();
  
  -- Retornar sucesso
  RETURN json_build_object(
    'success', true,
    'user_id', v_user_id
  );
  
EXCEPTION WHEN OTHERS THEN
  -- Retornar erro detalhado
  RETURN json_build_object(
    'success', false,
    'error', SQLERRM,
    'detail', SQLSTATE
  );
END;
$$;

-- 6. Garantir permissões corretas
REVOKE ALL ON FUNCTION save_user_onboarding FROM PUBLIC;
GRANT EXECUTE ON FUNCTION save_user_onboarding TO authenticated;

-- 7. Adicionar comentários
COMMENT ON FUNCTION save_user_onboarding IS 
  'Salva dados de onboarding do usuário. Retorna JSON com success/error.';

COMMENT ON FUNCTION public.handle_new_user IS
  'Cria perfil automaticamente quando usuário se registra.';

-- 8. Script de verificação (execute separadamente para testar)
-- SELECT * FROM profiles WHERE id = auth.uid();
-- SELECT save_user_onboarding(
--   (SELECT id FROM schools LIMIT 1),
--   '3º Ano',
--   'Medicina',
--   'Casa',
--   'Visual',
--   ARRAY['Passar no vestibular']
-- );
