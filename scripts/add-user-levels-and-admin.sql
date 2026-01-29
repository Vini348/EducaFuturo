-- Criar tipo enum para níveis de usuário
CREATE TYPE user_level AS ENUM (
  'iniciante',
  'aprendiz',
  'estudante',
  'dedicado',
  'mestre',
  'lenda',
  'admin'
);

-- Adicionar colunas para níveis e admin
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS user_level user_level DEFAULT 'iniciante',
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user',
ADD COLUMN IF NOT EXISTS study_hours INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS achievements_count INTEGER DEFAULT 0;

-- Definir admin para o email específico
UPDATE profiles
SET role = 'admin',
    user_level = 'admin'
WHERE email = 'viniciusdesousacosta903@gmail.com';

-- Criar função para calcular nível do usuário baseado em pontos e conquistas
CREATE OR REPLACE FUNCTION calculate_user_level(p_user_id UUID)
RETURNS user_level AS $$
DECLARE
  v_total_points INTEGER;
  v_achievements INTEGER;
  v_study_hours INTEGER;
  v_calculated_level user_level;
BEGIN
  -- Buscar dados do usuário
  SELECT 
    COALESCE(total_points, 0),
    COALESCE(achievements_count, 0),
    COALESCE(study_hours, 0)
  INTO v_total_points, v_achievements, v_study_hours
  FROM profiles
  WHERE id = p_user_id;

  -- Se for admin, retornar admin
  IF EXISTS (SELECT 1 FROM profiles WHERE id = p_user_id AND role = 'admin') THEN
    RETURN 'admin';
  END IF;

  -- Calcular nível baseado em pontos, conquistas e horas de estudo
  -- Lenda: 10000+ pontos, 20+ conquistas, 100+ horas
  IF v_total_points >= 10000 AND v_achievements >= 20 AND v_study_hours >= 100 THEN
    v_calculated_level := 'lenda';
  -- Mestre: 5000+ pontos, 15+ conquistas, 50+ horas
  ELSIF v_total_points >= 5000 AND v_achievements >= 15 AND v_study_hours >= 50 THEN
    v_calculated_level := 'mestre';
  -- Dedicado: 2000+ pontos, 10+ conquistas, 25+ horas
  ELSIF v_total_points >= 2000 AND v_achievements >= 10 AND v_study_hours >= 25 THEN
    v_calculated_level := 'dedicado';
  -- Estudante: 1000+ pontos, 5+ conquistas, 10+ horas
  ELSIF v_total_points >= 1000 AND v_achievements >= 5 AND v_study_hours >= 10 THEN
    v_calculated_level := 'estudante';
  -- Aprendiz: 500+ pontos, 2+ conquistas, 5+ horas
  ELSIF v_total_points >= 500 AND v_achievements >= 2 AND v_study_hours >= 5 THEN
    v_calculated_level := 'aprendiz';
  -- Iniciante: padrão
  ELSE
    v_calculated_level := 'iniciante';
  END IF;

  RETURN v_calculated_level;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger para atualizar nível automaticamente
CREATE OR REPLACE FUNCTION update_user_level()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualizar nível do usuário
  NEW.user_level := calculate_user_level(NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger na tabela profiles
DROP TRIGGER IF EXISTS trigger_update_user_level ON profiles;
CREATE TRIGGER trigger_update_user_level
BEFORE UPDATE OF total_points, achievements_count, study_hours
ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_user_level();

-- Criar função para atualizar contagem de conquistas
CREATE OR REPLACE FUNCTION sync_achievements_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualizar contagem de conquistas no perfil do usuário
  UPDATE profiles
  SET achievements_count = (
    SELECT COUNT(*)
    FROM user_achievements
    WHERE user_id = NEW.user_id AND unlocked = true
  )
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para sincronizar conquistas
DROP TRIGGER IF EXISTS trigger_sync_achievements ON user_achievements;
CREATE TRIGGER trigger_sync_achievements
AFTER INSERT OR UPDATE ON user_achievements
FOR EACH ROW
WHEN (NEW.unlocked = true)
EXECUTE FUNCTION sync_achievements_count();

-- Atualizar níveis de todos os usuários existentes
UPDATE profiles
SET user_level = calculate_user_level(id)
WHERE role != 'admin';
