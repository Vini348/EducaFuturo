# Guia de Testes - EducaFuturo

## 1. Executar Scripts SQL

Execute os seguintes scripts **em ordem** no Supabase SQL Editor:

### Passo 1: Setup RLS Final
\`\`\`sql
-- Copie todo o conteúdo de scripts/final-rls-setup.sql
-- Cole no Supabase SQL Editor
-- Execute
\`\`\`

### Passo 2: Schema Completo
\`\`\`sql
-- Copie todo o conteúdo de scripts/create-complete-schema.sql
-- Cole no Supabase SQL Editor
-- Execute
\`\`\`

---

## 2. Testar Registro de Usuário

### Teste 1: Validação de Email
1. Acesse `/register`
2. Preencha com email inválido (ex: "teste")
3. Clique em "Cadastrar"
4. **Esperado:** Mensagem de erro "Email inválido"

### Teste 2: Validação de Senha
1. Acesse `/register`
2. Preencha email válido
3. Digite senha com menos de 6 caracteres
4. Clique em "Cadastrar"
5. **Esperado:** Mensagem "A senha deve ter pelo menos 6 caracteres"

### Teste 3: Senhas Diferentes
1. Acesse `/register`
2. Preencha email válido
3. Digite senhas diferentes
4. Clique em "Cadastrar"
5. **Esperado:** Mensagem "As senhas não coincidem"

### Teste 4: Cadastro Bem-sucedido
1. Acesse `/register`
2. Preencha:
   - Nome Completo: "João Silva"
   - Email: "joao@test.com"
   - Senha: "senha123"
   - Confirmar: "senha123"
3. Clique em "Cadastrar"
4. **Esperado:** Mensagem verde "Registro realizado com sucesso"
5. Redireciona para `/login` após 3 segundos

---

## 3. Testar Login

### Teste 1: Login Bem-sucedido
1. Acesse `/login`
2. Digite email e senha cadastrados
3. Clique em "Entrar"
4. **Esperado:** Redireciona para home `/`

### Teste 2: Credenciais Inválidas
1. Acesse `/login`
2. Digite email/senha incorretos
3. Clique em "Entrar"
4. **Esperado:** Mensagem de erro em vermelho

---

## 4. Testar Onboarding

### Teste 1: Modal Aparece na Primeira Vez
1. Faça login com novo usuário
2. Será redirecionado para `/`
3. **Esperado:** Modal "Bem-vindo ao EducaFuturo!" aparece

### Teste 2: Etapa 1 - Informações Acadêmicas
1. Selecione uma escola (ex: "IFB Brasília")
2. Selecione série (ex: "3º Ano")
3. Clique em "Próximo"
4. **Esperado:** Vai para etapa 2

### Teste 3: Etapa 2 - Objetivos
1. Digite curso (ex: "Medicina")
2. Selecione local (ex: "Em casa")
3. Clique em "Próximo"
4. **Esperado:** Vai para etapa 3

### Teste 4: Etapa 3 - Preferências
1. Selecione estilo (ex: "Visual")
2. Marque pelo menos 2 objetivos
3. Clique em "Começar!"
4. **Esperado:**
   - Modal fecha
   - Dados aparecem no banco (`profiles` atualizado)
   - Não aparece novamente no login

### Teste 5: Fechar Modal com X
1. Abra onboarding (navegue ou limpe sessionStorage)
2. Clique no X (canto superior direito)
3. **Esperado:** Modal fecha sem salvar dados

---

## 5. Testar Ranking da Escola

### Teste 1: Visualizar Ranking
1. Login
2. Complete onboarding
3. Acesse `/study`
4. Procure pela seção "Ranking da Escola"
5. **Esperado:**
   - Mostra top 5 estudantes da mesma escola
   - Seus dados aparecem destacados
   - Mostra posição, avatar, nome, pontos

### Teste 2: Filtrar por Estilo
1. No ranking, veja as abas de estilos
2. Clique em "V" (Visual)
3. **Esperado:** Mostra apenas estudantes com estilo Visual
4. Clique em "Todos"
5. **Esperado:** Volta a mostrar todos

---

## 6. Testar Sistema de Pontos

### Teste 1: Completar Desafio Diário
1. Na seção Desafios Diários
2. Clique em completar um desafio
3. **Esperado:** 
   - Toast mostra pontos ganhos (ex: "Você ganhou 20 pontos!")
   - Desafio marcado como concluído

### Teste 2: Bônus Diário
1. Complete todos os desafios do dia
2. **Esperado:**
   - Toast final: "+50 pontos de bônus!"
   - Total_points atualizado no banco

### Teste 3: Verificar Pontos no Ranking
1. Atualize a página
2. Veja seus pontos no ranking
3. **Esperado:** Pontos aparecem atualizados

---

## 7. Testar Análise de Desafios

### Teste 1: Análise Manual
1. Complete um quiz
2. Clique em "Analisar Desafio" (se disponível)
3. **Esperado:**
   - Mostra precisão (%)
   - Mostra respostas corretas
   - Mostra tempo gasto
   - Mostra feedback personalizado

### Teste 2: Feedback Baseado em Precisão
- **100% de acerto:** "Perfeito! Você dominou..."
- **80-99%:** "Excelente desempenho..."
- **60-79%:** "Bom trabalho!..."
- **40-59%:** "Você está no caminho..."
- **< 40%:** "Não desista!..."

---

## 8. Verificar Banco de Dados

### Testar Profiles
\`\`\`sql
SELECT id, full_name, school_id, learning_style, onboarding_completed, total_points
FROM profiles
WHERE email = 'seu@email.com';
\`\`\`
**Esperado:** Todos os campos preenchidos

### Testar Quiz Attempts
\`\`\`sql
SELECT user_id, challenge_id, accuracy, points_earned, completed_at
FROM user_quiz_attempts
WHERE user_id = 'seu-user-id'
ORDER BY completed_at DESC;
\`\`\`
**Esperado:** Tentativas registradas

### Testar Ranking View
\`\`\`sql
SELECT * FROM school_ranking_with_style
WHERE school_id = 'sua-school-id'
ORDER BY rank
LIMIT 5;
\`\`\`
**Esperado:** Top 5 estudantes da escola

---

## 9. Checklist Final

- [ ] Registro funciona com validações
- [ ] Login funciona
- [ ] Onboarding aparece 1x e salva dados
- [ ] Pontos são ganhos ao completar desafios
- [ ] Ranking mostra estudantes da escola
- [ ] Filtro por estilo funciona
- [ ] Análise de desafio funciona
- [ ] Feedback personalizado aparece
- [ ] Dados persistem após reload
- [ ] Banco de dados está atualizado

---

## 10. Troubleshooting

### "Erro ao salvar onboarding"
- Verifique se `final-rls-setup.sql` foi executado
- Verifique se user está autenticado
- Veja logs do navegador (F12 → Console)

### "Desafio não aparece no ranking"
- Verifique se school_id foi preenchido
- Verifique RLS com query SQL
- Confirme que total_points foi atualizado

### "API retorna 401"
- Verifique se usuário está logado
- Limpe cookies/storage e faça login novamente

### "Pontos não atualizam"
- Verifique trigger `trigger_update_user_total_points`
- Confirme que `user_quiz_attempts` tem pontos_earned
- Execute manualmente UPDATE se necessário

---

## Próximos Testes (FASE 3)

- [ ] Performance com 1000+ usuários
- [ ] Animações de pontos
- [ ] Recomendações personalizadas
- [ ] Dashboard de desempenho
- [ ] Exportar relatórios
