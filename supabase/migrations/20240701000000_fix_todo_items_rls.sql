-- Desativar temporariamente as políticas RLS existentes
DROP POLICY IF EXISTS "Todo items are viewable by owner" ON "todo_items";
DROP POLICY IF EXISTS "Todo items are insertable by owner" ON "todo_items";
DROP POLICY IF EXISTS "Todo items are updatable by owner" ON "todo_items";
DROP POLICY IF EXISTS "Todo items are deletable by owner" ON "todo_items";

-- Garantir que RLS está habilitado
ALTER TABLE "todo_items" ENABLE ROW LEVEL SECURITY;

-- Criar novas políticas RLS
CREATE POLICY "Todo items are viewable by owner"
ON "todo_items"
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Todo items are insertable by authenticated users"
ON "todo_items"
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Todo items are updatable by owner"
ON "todo_items"
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Todo items are deletable by owner"
ON "todo_items"
FOR DELETE
USING (auth.uid() = user_id);
