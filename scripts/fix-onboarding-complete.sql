-- ============================================
-- Script completo para corrigir o onboarding
-- ============================================

-- 1. Criar função para criar perfis automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, created_at, updated_at)
  VALUES (NEW.id, NOW(), NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Criar trigger para executar a função quando novo usuário é criado
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 3. Criar perfis para usuários existentes que não têm perfil
INSERT INTO public.profiles (id, created_at, updated_at)
SELECT 
  au.id,
  NOW(),
  NOW()
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- 4. Modificar a função save_user_onboarding para fazer UPSERT
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
  -- Usa UPSERT para inserir ou atualizar o perfil
  INSERT INTO profiles (
    id,
    school_id,
    grade_level,
    course,
    study_location,
    learning_style,
    study_goals,
    onboarding_completed,
    created_at,
    updated_at
  )
  VALUES (
    auth.uid(),
    p_school_id,
    p_grade_level,
    p_course,
    p_study_location,
    p_learning_style,
    p_study_goals,
    true,
    NOW(),
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
  
  RETURN true;
END;
$$;

-- 5. Garantir que apenas usuários autenticados possam executar a função
REVOKE ALL ON FUNCTION save_user_onboarding FROM PUBLIC;
GRANT EXECUTE ON FUNCTION save_user_onboarding TO authenticated;

-- 6. Comentário explicativo
COMMENT ON FUNCTION save_user_onboarding IS 
  'Salva os dados de onboarding do usuário usando UPSERT. Usa SECURITY DEFINER para bypassar RLS.';

COMMENT ON FUNCTION public.handle_new_user IS
  'Cria automaticamente um perfil quando um novo usuário se registra.';
