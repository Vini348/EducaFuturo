-- Script para corrigir recursão infinita nas políticas RLS
-- Este script remove a política problemática e cria uma solução alternativa

-- 1. Remover todas as políticas existentes
DROP POLICY IF EXISTS "Schools are viewable by everyone" ON schools;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view profiles from their school" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own points history" ON user_points_history;
DROP POLICY IF EXISTS "Users can insert their own points" ON user_points_history;

-- 2. Criar função auxiliar para pegar school_id do usuário sem recursão
CREATE OR REPLACE FUNCTION get_user_school_id(user_uuid UUID)
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
  WHERE id = user_uuid;
  
  RETURN user_school;
END;
$$;

-- 3. Recriar políticas sem recursão
-- Políticas para schools
CREATE POLICY "Schools are viewable by everyone"
  ON schools FOR SELECT
  USING (true);

-- Políticas para profiles - CORRIGIDAS
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Política corrigida usando função auxiliar para evitar recursão
CREATE POLICY "Users can view profiles from their school"
  ON profiles FOR SELECT
  USING (
    school_id IS NOT NULL 
    AND school_id = get_user_school_id(auth.uid())
  );

-- Políticas para user_points_history
CREATE POLICY "Users can view their own points history"
  ON user_points_history FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own points"
  ON user_points_history FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- 4. Garantir que RLS está habilitado
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_points_history ENABLE ROW LEVEL SECURITY;

-- Mensagem de sucesso
DO $$ 
BEGIN
  RAISE NOTICE 'Políticas RLS corrigidas com sucesso!';
  RAISE NOTICE 'Recursão infinita resolvida usando função auxiliar.';
END $$;
