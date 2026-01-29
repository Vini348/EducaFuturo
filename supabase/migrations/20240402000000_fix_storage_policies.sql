-- Instruções para configurar políticas de armazenamento
-- Nota: Estas instruções são apenas para referência e devem ser executadas manualmente
-- no console do Supabase, pois as políticas de armazenamento não podem ser configuradas
-- diretamente via SQL.

/*
Para configurar o bucket 'avatars' no Supabase:

1. Acesse o dashboard do Supabase
2. Vá para Storage > Buckets
3. Crie um bucket chamado 'avatars' (se ainda não existir)
4. Configure o bucket como público
5. Configure as seguintes políticas:

   Para SELECT (download):
   - Descrição: "Qualquer pessoa pode visualizar avatares"
   - Definição da política: true

   Para INSERT (upload):
   - Descrição: "Usuários autenticados podem fazer upload de seus próprios avatares"
   - Definição da política: (auth.uid() = owner) OR (auth.uid() IS NOT NULL)

   Para UPDATE:
   - Descrição: "Usuários podem atualizar seus próprios avatares"
   - Definição da política: auth.uid() = owner

   Para DELETE:
   - Descrição: "Usuários podem excluir seus próprios avatares"
   - Definição da política: auth.uid() = owner
*/
