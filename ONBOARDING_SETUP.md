# Configuração do Sistema de Onboarding e Ranking

Este documento descreve as funcionalidades implementadas e como configurá-las.

## 🎯 Funcionalidades Implementadas

### 1. Questionário de Onboarding
- **Localização**: `components/onboarding-modal.tsx`
- **Quando aparece**: Automaticamente no primeiro login do usuário
- **Informações coletadas**:
  - Escola do usuário
  - Série/Ano (1º, 2º, 3º ano ou Cursinho)
  - Curso pretendido
  - Local de estudo preferido
  - Estilo de aprendizagem (Visual, Auditivo, Leitura/Escrita, Prático)
  - Objetivos de estudo

### 2. Sistema de Pontos
- **Localização**: `lib/points-system.ts`
- **Pontuação por desafio**:
  - Fácil: 10 pontos
  - Médio: 20 pontos
  - Difícil: 30 pontos
  - Bônus diário (completar todos): +50 pontos
- **Rastreamento**: Todos os pontos são salvos em `user_points_history` e somados automaticamente em `profiles.total_points`

### 3. Ranking da Escola
- **Localização**: `components/school-ranking.tsx`
- **Funcionalidade**: Exibe top 5 estudantes da mesma escola ordenados por pontos
- **Destaque**: Usuário atual é destacado no ranking
- **Ícones especiais**: Troféu (1º), Medalha (2º), Prêmio (3º)

## 📋 Configuração do Banco de Dados

### Passo 1: Executar Script SQL
Execute o script `scripts/create-schools-and-update-profiles.sql` no Supabase:

1. Acesse o projeto no Supabase
2. Vá em "SQL Editor"
3. Clique em "New Query"
4. Cole o conteúdo do script
5. Clique em "Run"

Este script irá:
- Criar tabela `schools` com escolas de exemplo
- Adicionar campos ao `profiles`: `school_id`, `onboarding_completed`, `total_points`, `grade_level`, `course`, `study_location`, `learning_style`, `study_goals`, `avatar_url`
- Criar tabela `user_points_history` para rastreamento de pontos
- Configurar triggers automáticos para atualizar pontos
- Configurar políticas de segurança (RLS)

### Passo 2: Verificar Tabelas
Confirme que as seguintes tabelas foram criadas:
- ✅ `schools`
- ✅ `profiles` (com novos campos)
- ✅ `user_points_history`

## 🚀 Como Usar

### Para Novos Usuários
1. Faça login pela primeira vez
2. O modal de onboarding aparecerá automaticamente
3. Complete as 3 etapas do questionário
4. Clique em "Começar!" para salvar

### Para Adicionar Pontos
Use a função `addPoints` do sistema:

\`\`\`typescript
import { addPoints } from '@/lib/points-system'

// Exemplo: Adicionar pontos ao completar um quiz
await addPoints({
  userId: user.id,
  points: 20,
  activityType: 'quiz',
  activityId: 'quiz-123',
  description: 'Completou quiz de Matemática'
})
\`\`\`

### Tipos de Atividades Suportadas
- `challenge` - Desafios diários
- `quiz` - Questionários
- `flashcard` - Flashcards
- `essay` - Redações
- `simulado` - Simulados
- `bloco` - Blocos de estudo
- `daily_login` - Login diário
- `streak` - Sequências de estudo

## 🎨 Personalização

### Adicionar Mais Escolas
Edite o script SQL ou adicione via Supabase:

\`\`\`sql
INSERT INTO public.schools (name, city, state) VALUES
  ('Nome da Escola', 'Cidade', 'Estado');
\`\`\`

### Ajustar Pontuação
Edite `components/daily-challenges.tsx`:

\`\`\`typescript
const calculateChallengePointsForDifficulty = (difficulty: string): number => {
  switch (difficulty) {
    case 'easy': return 10    // Altere aqui
    case 'medium': return 20  // Altere aqui
    case 'hard': return 30    // Altere aqui
    default: return 10
  }
}
\`\`\`

### Modificar Perguntas do Onboarding
Edite `components/onboarding-modal.tsx` para adicionar/remover perguntas.

## 🔧 Troubleshooting

### Onboarding não aparece
- Verifique se o campo `onboarding_completed` está `false` no banco
- Limpe o cache do navegador
- Verifique o console para erros

### Ranking vazio
- Confirme que usuários têm `school_id` preenchido
- Verifique se há usuários com pontos na mesma escola
- Execute: `SELECT * FROM profiles WHERE school_id IS NOT NULL`

### Pontos não atualizam
- Verifique se o trigger `trigger_update_total_points` está ativo
- Confirme que a função `update_user_total_points()` existe
- Teste manualmente: `INSERT INTO user_points_history (user_id, points, activity_type) VALUES ('user-id', 10, 'test')`

## 📊 Consultas Úteis

### Ver ranking completo de uma escola
\`\`\`sql
SELECT full_name, total_points, grade_level
FROM profiles
WHERE school_id = 'school-uuid'
ORDER BY total_points DESC;
\`\`\`

### Ver histórico de pontos de um usuário
\`\`\`sql
SELECT * FROM user_points_history
WHERE user_id = 'user-uuid'
ORDER BY created_at DESC;
\`\`\`

### Top 10 usuários globais
\`\`\`sql
SELECT full_name, total_points, school_id
FROM profiles
ORDER BY total_points DESC
LIMIT 10;
\`\`\`

## ✅ Checklist de Implementação

- [x] Script SQL criado
- [x] Componente de onboarding implementado
- [x] Sistema de pontos funcional
- [x] Ranking da escola atualizado
- [x] Integração com desafios diários
- [x] Triggers automáticos configurados
- [x] Políticas de segurança (RLS) ativas
- [x] Imagens de perfil consistentes

## 🎉 Próximos Passos Sugeridos

1. **Gamificação Avançada**: Adicionar badges e conquistas
2. **Ranking Global**: Criar ranking entre todas as escolas
3. **Histórico Visual**: Gráfico de evolução de pontos
4. **Notificações**: Alertas quando subir no ranking
5. **Competições**: Desafios entre escolas
6. **Recompensas**: Sistema de troca de pontos por benefícios

---

**Desenvolvido para EducaFuturo** 🚀
