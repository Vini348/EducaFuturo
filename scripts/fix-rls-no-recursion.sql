-- Remove TODAS as políticas da tabela profiles para começar do zero
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view profiles from their school" ON profiles;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;

-- Criar função auxiliar para pegar school_id do usuário sem causar recursão
CREATE OR REPLACE FUNCTION get_user_school_id()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_school UUID;
BEGIN
  SELECT school_id INTO user_school
  FROM profiles
  WHERE id = auth.uid()
  LIMIT 1;
  
  RETURN user_school;
END;
$$;

-- Criar políticas RLS simples que NÃO causam recursão

-- 1. Usuários podem ver seu próprio perfil
CREATE POLICY "users_select_own_profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- 2. Usuários podem inserir seu próprio perfil
CREATE POLICY "users_insert_own_profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 3. Usuários podem atualizar seu próprio perfil
CREATE POLICY "users_update_own_profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 4. Usuários podem ver perfis da mesma escola (usando função auxiliar)
CREATE POLICY "users_view_school_profiles"
  ON profiles FOR SELECT
  USING (
    school_id IS NOT NULL 
    AND school_id = get_user_school_id()
    AND id != auth.uid()  -- Evita duplicação com política 1
  );

-- Garantir que RLS está habilitado
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Garantir que a função handle_new_user existe
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, created_at, updated_at, onboarding_completed)
  VALUES (NEW.id, NOW(), NOW(), FALSE)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Recriar trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
