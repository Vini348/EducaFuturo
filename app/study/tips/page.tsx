"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useAuth } from "@/hooks/useAuth"
import {
  BookmarkCheck,
  Clock,
  Brain,
  Calendar,
  BookOpen,
  Target,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Star,
  StarOff,
  Download,
  Coffee,
  Zap,
  ArrowLeft,
} from "lucide-react"

// Tipos para as dicas de estudo
interface StudyTip {
  id: string
  title: string
  description: string
  content: string[]
  category: string
  difficulty: "iniciante" | "intermediário" | "avançado"
  timeToImplement: string
  tags: string[]
  isFavorite?: boolean
  isExpanded?: boolean
}

// Categorias de dicas
const categories = [
  { id: "all", name: "Todas as Dicas", icon: <Lightbulb className="h-5 w-5" /> },
  { id: "techniques", name: "Técnicas de Estudo", icon: <Brain className="h-5 w-5" /> },
  { id: "organization", name: "Organização", icon: <Calendar className="h-5 w-5" /> },
  { id: "focus", name: "Concentração", icon: <Target className="h-5 w-5" /> },
  { id: "exams", name: "Preparação para Provas", icon: <BookOpen className="h-5 w-5" /> },
  { id: "productivity", name: "Produtividade", icon: <Zap className="h-5 w-5" /> },
]

// Dados das dicas de estudo
const studyTipsData: StudyTip[] = [
  {
    id: "1",
    title: "Técnica Pomodoro",
    description: "Estude com intervalos estratégicos para maximizar a concentração e produtividade",
    content: [
      "Defina uma tarefa específica para trabalhar",
      'Configure um temporizador para 25 minutos (um "pomodoro")',
      "Trabalhe na tarefa até o temporizador tocar",
      "Faça uma pausa curta de 5 minutos",
      "A cada 4 pomodoros, faça uma pausa mais longa de 15-30 minutos",
      "Registre seu progresso e ajuste os tempos conforme sua necessidade",
      'Aplicativos como "Forest" ou "Focus To-Do" podem ajudar a implementar esta técnica',
    ],
    category: "techniques",
    difficulty: "iniciante",
    timeToImplement: "5 minutos",
    tags: ["produtividade", "foco", "gerenciamento de tempo"],
  },
  {
    id: "2",
    title: "Mapa Mental",
    description: "Organize visualmente conceitos complexos para melhor compreensão e memorização",
    content: [
      "Comece com o conceito principal no centro da página",
      "Adicione ramificações para subtópicos relacionados",
      "Use cores diferentes para categorias distintas",
      "Inclua imagens e símbolos para estimular a memória visual",
      "Mantenha as palavras-chave curtas e significativas",
      "Conecte conceitos relacionados com linhas ou setas",
      "Revise e expanda seu mapa mental regularmente",
      "Ferramentas como MindMeister, XMind ou até papel e caneta colorida são ótimas opções",
    ],
    category: "techniques",
    difficulty: "intermediário",
    timeToImplement: "15-30 minutos",
    tags: ["organização", "visualização", "memorização"],
  },
  {
    id: "3",
    title: "Método Feynman",
    description: "Aprenda profundamente explicando conceitos de forma simples",
    content: [
      "Escolha um conceito para estudar",
      "Explique o conceito em termos simples como se estivesse ensinando a uma criança",
      "Identifique lacunas no seu entendimento",
      "Volte ao material de estudo para preencher essas lacunas",
      "Simplifique sua explicação, eliminando jargões técnicos",
      "Use analogias e exemplos do cotidiano",
      "Repita o processo até dominar completamente o assunto",
    ],
    category: "techniques",
    difficulty: "avançado",
    timeToImplement: "30-60 minutos",
    tags: ["compreensão", "explicação", "aprendizado profundo"],
  },
  {
    id: "4",
    title: "Sistema de Revisão Espaçada",
    description: "Otimize a memorização de longo prazo com revisões estratégicas",
    content: [
      "Estude o material pela primeira vez de forma completa",
      "Faça a primeira revisão 24 horas depois",
      "Segunda revisão após 3 dias",
      "Terceira revisão após 1 semana",
      "Quarta revisão após 2 semanas",
      "Quinta revisão após 1 mês",
      "Continue revisando em intervalos crescentes",
      "Use aplicativos como Anki ou Quizlet para automatizar este processo",
    ],
    category: "techniques",
    difficulty: "intermediário",
    timeToImplement: "15 minutos (configuração inicial)",
    tags: ["memorização", "revisão", "longo prazo"],
  },
  {
    id: "5",
    title: "Método Cornell de Anotações",
    description: "Sistema estruturado para fazer anotações eficientes durante aulas e leituras",
    content: [
      "Divida sua página em três seções: notas (maior parte à direita), dicas (coluna estreita à esquerda) e resumo (parte inferior)",
      "Durante a aula ou leitura, faça anotações na seção principal",
      "Após a aula, escreva palavras-chave e perguntas na coluna de dicas",
      "Escreva um resumo conciso na parte inferior da página",
      "Use as dicas para testar seu conhecimento cobrindo a seção principal",
      "Revise suas anotações regularmente usando o sistema de revisão espaçada",
    ],
    category: "organization",
    difficulty: "intermediário",
    timeToImplement: "10 minutos",
    tags: ["anotações", "organização", "revisão"],
  },
  {
    id: "6",
    title: "Ambiente de Estudo Otimizado",
    description: "Crie um espaço físico que maximize sua concentração e produtividade",
    content: [
      "Escolha um local quieto e com pouca distração",
      "Garanta boa iluminação, preferencialmente luz natural",
      "Mantenha a temperatura confortável (entre 20-22°C)",
      "Organize seu espaço com todos os materiais necessários ao alcance",
      "Elimine distrações digitais (silenciar notificações, usar apps de bloqueio)",
      "Personalize com elementos motivadores (plantas, citações inspiradoras)",
      "Mantenha água e lanches saudáveis por perto",
      "Considere usar ruído branco ou música instrumental de fundo se ajudar sua concentração",
    ],
    category: "focus",
    difficulty: "iniciante",
    timeToImplement: "30-60 minutos",
    tags: ["ambiente", "concentração", "produtividade"],
  },
  {
    id: "7",
    title: "Técnica de Estudo PQ4R",
    description: "Método estruturado para leitura e compreensão profunda de textos",
    content: [
      "Preview (Pré-visualização): Examine rapidamente o material para ter uma ideia geral",
      "Question (Questione): Formule perguntas sobre o conteúdo",
      "Read (Leia): Leia ativamente buscando respostas para suas perguntas",
      "Reflect (Reflita): Pense sobre o material e como ele se conecta ao que você já sabe",
      "Recite (Recite): Responda suas perguntas em voz alta sem olhar o material",
      "Review (Revise): Revise o material para consolidar o aprendizado",
      "Aplique esta técnica especialmente para textos densos ou complexos",
    ],
    category: "techniques",
    difficulty: "avançado",
    timeToImplement: "45-60 minutos por texto",
    tags: ["leitura", "compreensão", "textos"],
  },
  {
    id: "8",
    title: "Simulados de Exame",
    description: "Prepare-se efetivamente para provas simulando as condições reais",
    content: [
      "Obtenha provas anteriores ou crie simulados realistas",
      "Simule as condições exatas do exame (tempo, materiais permitidos)",
      "Faça o simulado sem interrupções ou consultas",
      "Corrija rigorosamente usando os critérios oficiais de avaliação",
      "Analise seus erros e identifique padrões de dificuldade",
      "Crie um plano de estudo focado nas áreas problemáticas",
      "Repita o processo várias vezes antes do exame real",
      "Aumente gradualmente a dificuldade dos simulados",
    ],
    category: "exams",
    difficulty: "intermediário",
    timeToImplement: "2-3 horas por simulado",
    tags: ["preparação", "exames", "avaliação"],
  },
  {
    id: "9",
    title: "Gerenciamento de Energia",
    description: "Otimize seus horários de estudo de acordo com seu ritmo biológico",
    content: [
      "Identifique seu cronótipo (matutino, vespertino ou intermediário)",
      "Programe tarefas que exigem mais concentração para seus horários de pico",
      "Reserve tarefas mais mecânicas para períodos de menor energia",
      "Mantenha uma rotina regular de sono (7-8 horas por noite)",
      "Faça pausas estratégicas para recarregar sua energia mental",
      "Alimente-se adequadamente com refeições balanceadas",
      "Pratique exercícios físicos regularmente para aumentar sua energia geral",
      "Monitore seu nível de energia por algumas semanas para identificar padrões",
    ],
    category: "productivity",
    difficulty: "intermediário",
    timeToImplement: "1 semana para identificar padrões",
    tags: ["energia", "produtividade", "saúde"],
  },
  {
    id: "10",
    title: "Técnica de Blocos de Tempo",
    description: "Organize seu dia em blocos dedicados para maximizar o foco e a produtividade",
    content: [
      "Divida seu dia em blocos de 1-2 horas",
      "Atribua uma tarefa ou tema específico para cada bloco",
      "Elimine todas as distrações durante cada bloco",
      "Trabalhe intensamente durante o tempo alocado",
      "Faça pausas curtas entre os blocos",
      "Agrupe tarefas similares no mesmo bloco quando possível",
      "Revise e ajuste seu sistema de blocos semanalmente",
      "Use aplicativos como Todoist ou Google Calendar para planejar seus blocos",
    ],
    category: "organization",
    difficulty: "intermediário",
    timeToImplement: "30 minutos (planejamento inicial)",
    tags: ["planejamento", "foco", "produtividade"],
  },
  {
    id: "11",
    title: "Técnica SQ3R para Leitura Eficiente",
    description: "Método estruturado para absorver e reter informações de textos acadêmicos",
    content: [
      "Survey (Pesquisa): Examine rapidamente o texto para ter uma visão geral",
      "Question (Questione): Formule perguntas baseadas nos títulos e subtítulos",
      "Read (Leia): Leia ativamente buscando respostas para suas perguntas",
      "Recite (Recite): Após cada seção, recite os principais pontos em suas próprias palavras",
      "Review (Revise): Revise todo o material para consolidar o aprendizado",
      "Faça anotações durante todo o processo",
      "Aplique esta técnica especialmente para textos densos ou técnicos",
    ],
    category: "techniques",
    difficulty: "intermediário",
    timeToImplement: "30-45 minutos por texto",
    tags: ["leitura", "compreensão", "retenção"],
  },
  {
    id: "12",
    title: "Mindfulness para Estudos",
    description: "Práticas de atenção plena para melhorar o foco e reduzir a ansiedade acadêmica",
    content: [
      "Comece cada sessão de estudo com 2-5 minutos de respiração consciente",
      'Pratique a técnica de "ancoragem" quando sua mente divagar (retorne gentilmente ao material)',
      "Faça pausas mindful de 1-2 minutos a cada 25-30 minutos de estudo",
      "Cultive uma atitude de curiosidade genuína sobre o material",
      "Observe sem julgamento quando surgirem pensamentos de procrastinação ou ansiedade",
      'Pratique a "varredura corporal" para liberar tensão física durante os estudos',
      "Use aplicativos como Headspace ou Calm para guiar práticas curtas",
      "Mantenha um diário de mindfulness para registrar insights sobre seus padrões mentais",
    ],
    category: "focus",
    difficulty: "iniciante",
    timeToImplement: "10 minutos diários",
    tags: ["concentração", "ansiedade", "bem-estar"],
  },
  {
    id: "13",
    title: "Estratégia de Estudo Baseada em Problemas",
    description: "Aprenda conceitos através da resolução ativa de problemas",
    content: [
      "Comece com problemas desafiadores antes de estudar a teoria",
      "Tente resolver usando seu conhecimento atual",
      "Identifique as lacunas específicas no seu entendimento",
      "Estude a teoria focando nessas lacunas",
      "Retorne ao problema e tente novamente",
      "Compare sua solução com exemplos resolvidos",
      "Crie variações do problema para testar seu entendimento",
      "Explique sua solução em voz alta para consolidar o aprendizado",
    ],
    category: "techniques",
    difficulty: "avançado",
    timeToImplement: "1-2 horas por sessão",
    tags: ["resolução de problemas", "aprendizado ativo", "compreensão profunda"],
  },
  {
    id: "14",
    title: "Preparação Mental para Exames",
    description: "Técnicas psicológicas para otimizar seu desempenho em situações de avaliação",
    content: [
      "Pratique visualização positiva do dia do exame",
      "Desenvolva rotinas pré-exame para reduzir a ansiedade",
      "Prepare-se para possíveis contratempos e como lidar com eles",
      "Pratique técnicas de respiração para momentos de ansiedade durante a prova",
      "Use afirmações positivas específicas para construir confiança",
      "Simule condições de pressão durante seus estudos",
      "Desenvolva um plano de contingência para diferentes cenários de prova",
      'Pratique a técnica de "conversa interna positiva" para momentos difíceis',
    ],
    category: "exams",
    difficulty: "intermediário",
    timeToImplement: "15-20 minutos diários",
    tags: ["ansiedade", "desempenho", "psicologia"],
  },
  {
    id: "15",
    title: "Método de Estudo Intercalado",
    description: "Alterne entre diferentes assuntos para melhorar a retenção e transferência de conhecimento",
    content: [
      "Em vez de estudar um único assunto por longos períodos (estudo massificado)",
      "Alterne entre diferentes tópicos durante uma sessão de estudo",
      "Por exemplo: 30 minutos de matemática, 30 de física, 30 de química",
      "Crie conexões entre os diferentes assuntos quando possível",
      "Aumente gradualmente a dificuldade dos tópicos",
      "Revise brevemente o tópico anterior antes de mudar para o próximo",
      "Mantenha um registro do seu desempenho em cada área",
      "Esta técnica é mais desafiadora inicialmente, mas produz resultados superiores a longo prazo",
    ],
    category: "techniques",
    difficulty: "avançado",
    timeToImplement: "2-3 horas por sessão",
    tags: ["retenção", "aprendizado eficiente", "transferência de conhecimento"],
  },
  {
    id: "16",
    title: "Rituais de Início e Encerramento",
    description: "Crie rotinas consistentes para entrar e sair do modo de estudo",
    content: [
      "Desenvolva um ritual de início consistente (ex: organizar materiais, definir objetivos, respiração profunda)",
      "Crie um ritual de encerramento (ex: revisar o que aprendeu, planejar a próxima sessão)",
      "Use sinais ambientais específicos (como uma vela, música instrumental ou postura)",
      "Estabeleça limites claros entre tempo de estudo e lazer",
      "Celebre pequenas vitórias ao final de cada sessão",
      "Registre seus insights e perguntas pendentes",
      "Pratique gratidão pelo que aprendeu",
      "Mantenha estes rituais mesmo em dias de menor motivação",
    ],
    category: "productivity",
    difficulty: "iniciante",
    timeToImplement: "5-10 minutos por sessão",
    tags: ["hábitos", "consistência", "transição mental"],
  },
  {
    id: "17",
    title: "Técnica de Recuperação Ativa",
    description: "Fortaleça a memória testando-se ativamente em vez de apenas reler o material",
    content: [
      "Após estudar um tópico, feche o livro/anotações",
      "Tente recordar ativamente o máximo de informações possível",
      "Escreva ou fale em voz alta o que conseguir lembrar",
      "Verifique o material original para identificar lacunas",
      "Concentre-se especialmente nos pontos que não conseguiu lembrar",
      "Repita o processo várias vezes, espaçando as tentativas",
      "Crie flashcards ou quizzes para facilitar a prática de recuperação",
      "Esta técnica é muito mais eficaz que simplesmente reler o material",
    ],
    category: "techniques",
    difficulty: "intermediário",
    timeToImplement: "20-30 minutos por tópico",
    tags: ["memorização", "retenção", "aprendizado ativo"],
  },
  {
    id: "18",
    title: "Método de Ensino Recíproco",
    description: "Aprenda profundamente ensinando e discutindo com colegas",
    content: [
      "Forme um grupo de estudo pequeno (2-4 pessoas)",
      'Cada membro se torna "especialista" em um tópico específico',
      "Prepare-se para ensinar seu tópico de forma clara e concisa",
      "Durante a sessão, cada membro ensina seu tópico aos outros",
      "Encoraje perguntas desafiadoras e discussões profundas",
      "Alterne os papéis de professor e aluno regularmente",
      "Documente insights coletivos e pontos de confusão",
      "Revise e expanda o material após cada sessão",
    ],
    category: "techniques",
    difficulty: "intermediário",
    timeToImplement: "1-2 horas por sessão",
    tags: ["aprendizado colaborativo", "ensino", "compreensão profunda"],
  },
  {
    id: "19",
    title: "Gerenciamento de Distrações Digitais",
    description: "Estratégias para minimizar interrupções tecnológicas durante o estudo",
    content: [
      "Use aplicativos de bloqueio como Freedom, Cold Turkey ou Forest",
      'Ative o modo "Não Perturbe" em todos os dispositivos',
      "Desative notificações push de todas as aplicações não essenciais",
      "Mantenha o celular em outro cômodo ou em uma gaveta",
      'Use a técnica "Pomodoro Digital": períodos definidos para verificar mensagens',
      "Crie um navegador ou perfil separado apenas para estudos",
      "Use extensões como StayFocusd para limitar o tempo em sites distrativos",
      "Comunique aos amigos e familiares seus horários de estudo para reduzir interrupções",
    ],
    category: "focus",
    difficulty: "iniciante",
    timeToImplement: "15-20 minutos (configuração inicial)",
    tags: ["distrações", "tecnologia", "foco"],
  },
  {
    id: "20",
    title: "Estratégia de Revisão Pré-Sono",
    description: "Aproveite o período antes de dormir para consolidar memórias",
    content: [
      "Reserve 10-15 minutos antes de dormir para revisão leve",
      "Revise brevemente os principais conceitos estudados durante o dia",
      "Não introduza material novo neste momento",
      "Use técnicas relaxantes como ler em voz baixa ou visualizar conceitos",
      "Faça perguntas que seu cérebro processará durante o sono",
      "Evite telas e luzes brilhantes durante esta revisão",
      "Mantenha um caderno ao lado da cama para anotar insights que surgirem durante a noite",
      "Esta técnica aproveita o processo natural de consolidação de memória que ocorre durante o sono",
    ],
    category: "techniques",
    difficulty: "iniciante",
    timeToImplement: "10-15 minutos diários",
    tags: ["sono", "memória", "consolidação"],
  },
]

export default function StudyTipsPage() {
  const [tips, setTips] = useState<StudyTip[]>([])
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [checkedTips, setCheckedTips] = useState<string[]>([])
  const [favoriteTips, setFavoriteTips] = useState<string[]>([])

  const router = useRouter()
  const { toast } = useToast()
  const supabase = useSupabaseClient()
  const { user } = useAuth()

  useEffect(() => {
    // Inicializar as dicas
    setTips(studyTipsData.map((tip) => ({ ...tip, isExpanded: false })))

    // Carregar dicas favoritas do localStorage ou Supabase
    const loadFavorites = async () => {
      setIsLoading(true)

      try {
        // Primeiro tenta carregar do localStorage para acesso offline
        const localFavorites = localStorage.getItem("favoriteTips")
        if (localFavorites) {
          setFavoriteTips(JSON.parse(localFavorites))
        }

        // Se o usuário estiver logado, sincroniza com o Supabase
        if (user) {
          const { data, error } = await supabase
            .from("user_preferences")
            .select("favorite_tips")
            .eq("user_id", user.id)
            .single()

          if (data && !error) {
            setFavoriteTips(data.favorite_tips || [])
            // Atualiza o localStorage com os dados do servidor
            localStorage.setItem("favoriteTips", JSON.stringify(data.favorite_tips || []))
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dicas favoritas:", error)
      } finally {
        setIsLoading(false)
      }
    }

    // Carregar dicas marcadas como concluídas
    const loadCheckedTips = () => {
      const savedCheckedTips = localStorage.getItem("checkedTips")
      if (savedCheckedTips) {
        setCheckedTips(JSON.parse(savedCheckedTips))
      }
    }

    loadFavorites()
    loadCheckedTips()
  }, [user, supabase])

  // Filtrar dicas com base na categoria e pesquisa
  const filteredTips = tips.filter((tip) => {
    const matchesCategory = activeCategory === "all" || tip.category === activeCategory
    const matchesSearch =
      searchQuery === "" ||
      tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tip.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tip.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesCategory && matchesSearch
  })

  // Expandir ou colapsar uma dica
  const toggleExpand = (id: string) => {
    setTips(tips.map((tip) => (tip.id === id ? { ...tip, isExpanded: !tip.isExpanded } : tip)))
  }

  // Marcar uma dica como favorita
  const toggleFavorite = async (id: string) => {
    const isFavorite = favoriteTips.includes(id)
    const newFavorites = isFavorite ? favoriteTips.filter((tipId) => tipId !== id) : [...favoriteTips, id]

    setFavoriteTips(newFavorites)

    // Salvar no localStorage para acesso offline
    localStorage.setItem("favoriteTips", JSON.stringify(newFavorites))

    // Se o usuário estiver logado, sincronizar com o Supabase
    if (user) {
      try {
        const { error } = await supabase.from("user_preferences").upsert({
          user_id: user.id,
          favorite_tips: newFavorites,
          updated_at: new Date().toISOString(),
        })

        if (error) throw error

        toast({
          title: isFavorite ? "Dica removida dos favoritos" : "Dica adicionada aos favoritos",
          description: "Suas preferências foram atualizadas com sucesso.",
          duration: 3000,
        })
      } catch (error) {
        console.error("Erro ao atualizar favoritos:", error)
        toast({
          title: "Erro ao atualizar favoritos",
          description: "Suas alterações foram salvas localmente, mas não puderam ser sincronizadas.",
          variant: "destructive",
          duration: 5000,
        })
      }
    }
  }

  // Marcar uma dica como concluída/implementada
  const toggleChecked = (id: string) => {
    const newCheckedTips = checkedTips.includes(id) ? checkedTips.filter((tipId) => tipId !== id) : [...checkedTips, id]

    setCheckedTips(newCheckedTips)
    localStorage.setItem("checkedTips", JSON.stringify(newCheckedTips))

    toast({
      title: checkedTips.includes(id) ? "Dica desmarcada" : "Dica marcada como implementada",
      description: checkedTips.includes(id)
        ? "Você pode implementá-la novamente quando quiser."
        : "Continue aplicando mais dicas para melhorar seus estudos!",
      duration: 3000,
    })
  }

  // Exportar dicas favoritas
  const exportFavorites = () => {
    const favoriteTipsData = tips.filter((tip) => favoriteTips.includes(tip.id))
    const exportData = JSON.stringify(favoriteTipsData, null, 2)
    const blob = new Blob([exportData], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "minhas_dicas_de_estudo.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Dicas exportadas com sucesso",
      description: "Suas dicas favoritas foram salvas em um arquivo JSON.",
      duration: 3000,
    })
  }

  // Voltar para a página anterior
  const handleGoBack = () => {
    router.back()
  }

  // Renderizar o indicador de dificuldade
  const renderDifficultyBadge = (difficulty: string) => {
    let color = ""
    switch (difficulty) {
      case "iniciante":
        color = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
        break
      case "intermediário":
        color = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
        break
      case "avançado":
        color = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
        break
      default:
        color = "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }

    return (
      <Badge variant="outline" className={`${color} ml-2`}>
        {difficulty}
      </Badge>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-4 mb-8">
        {/* Botão Voltar */}
        <div className="flex justify-start mb-2">
          <Button variant="outline" size="sm" onClick={handleGoBack} className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>

        <h1 className="text-3xl font-bold text-center">Dicas de Estudo</h1>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto">
          Explore nossa coleção de técnicas e estratégias comprovadas para otimizar seu aprendizado, melhorar sua
          concentração e alcançar melhores resultados nos estudos.
        </p>

        {/* Barra de pesquisa */}
        <div className="relative max-w-md mx-auto w-full">
          <input
            type="text"
            placeholder="Pesquisar dicas..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              onClick={() => setSearchQuery("")}
            >
              ×
            </button>
          )}
        </div>

        {/* Estatísticas rápidas */}
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-300" />
            <span>
              <strong>{tips.length}</strong> dicas disponíveis
            </span>
          </div>
          <div className="bg-green-50 dark:bg-green-900 p-3 rounded-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-300" />
            <span>
              <strong>{checkedTips.length}</strong> dicas implementadas
            </span>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900 p-3 rounded-lg flex items-center gap-2">
            <BookmarkCheck className="h-5 w-5 text-purple-600 dark:text-purple-300" />
            <span>
              <strong>{favoriteTips.length}</strong> dicas favoritas
            </span>
          </div>
        </div>
      </div>

      {/* Abas de categorias */}
      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="w-full mb-8">
        <div className="overflow-x-auto pb-2">
          <TabsList className="flex w-full justify-start">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-1.5 px-4">
                {category.icon}
                <span>{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Conteúdo das abas */}
        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredTips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTips.map((tip) => (
                  <Card
                    key={tip.id}
                    className={`overflow-hidden transition-all duration-200 ${
                      checkedTips.includes(tip.id) ? "border-green-500 dark:border-green-700" : ""
                    } ${favoriteTips.includes(tip.id) ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <Checkbox
                            id={`check-${tip.id}`}
                            checked={checkedTips.includes(tip.id)}
                            onCheckedChange={() => toggleChecked(tip.id)}
                            className="mr-2"
                          />
                          <CardTitle className="text-lg">{tip.title}</CardTitle>
                        </div>
                        <button
                          onClick={() => toggleFavorite(tip.id)}
                          className="text-gray-400 hover:text-yellow-500 transition-colors"
                          aria-label={
                            favoriteTips.includes(tip.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"
                          }
                        >
                          {favoriteTips.includes(tip.id) ? (
                            <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                          ) : (
                            <StarOff className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {renderDifficultyBadge(tip.difficulty)}
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {tip.timeToImplement}
                        </Badge>
                      </div>
                      <CardDescription className="mt-2">{tip.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="pb-2">
                      {tip.isExpanded && (
                        <div className="mt-2 space-y-2 text-sm">
                          <h4 className="font-medium">Como implementar:</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {tip.content.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                          <div className="flex flex-wrap gap-1 mt-3">
                            {tip.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="flex justify-between pt-2">
                      <Button variant="ghost" size="sm" onClick={() => toggleExpand(tip.id)} className="text-sm">
                        {tip.isExpanded ? (
                          <>
                            <ChevronUp className="h-4 w-4 mr-1" /> Menos detalhes
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4 mr-1" /> Mais detalhes
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-xl font-medium mb-2">Nenhuma dica encontrada</h3>
                <p className="text-muted-foreground max-w-md">
                  Não encontramos dicas que correspondam aos seus critérios de pesquisa. Tente termos diferentes ou
                  explore outras categorias.
                </p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Seção de dicas favoritas */}
      {favoriteTips.length > 0 && (
        <div className="mt-8 mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold flex items-center">
              <BookmarkCheck className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
              Minhas Dicas Favoritas
            </h2>
            <Button variant="outline" size="sm" onClick={exportFavorites}>
              <Download className="h-4 w-4 mr-2" /> Exportar Favoritos
            </Button>
          </div>

          <ScrollArea className="h-72 rounded-md border p-4">
            {tips
              .filter((tip) => favoriteTips.includes(tip.id))
              .map((tip) => (
                <div key={tip.id} className="flex items-start py-3 border-b last:border-0">
                  <div className="mr-4 mt-1">
                    <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">{tip.title}</h3>
                    <p className="text-sm text-muted-foreground">{tip.description}</p>
                    <div className="flex gap-2 mt-1">
                      {renderDifficultyBadge(tip.difficulty)}
                      <Badge variant="outline" className="flex items-center gap-1 text-xs">
                        <Clock className="h-3 w-3" />
                        {tip.timeToImplement}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="ml-auto" onClick={() => toggleFavorite(tip.id)}>
                    <StarOff className="h-4 w-4" />
                  </Button>
                </div>
              ))}
          </ScrollArea>
        </div>
      )}

      {/* Seção de dicas para o dia */}
      <div className="mt-8 mb-12">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Coffee className="h-6 w-6 mr-2 text-amber-600 dark:text-amber-400" />
          Dica do Dia
        </h2>

        {/* Seleciona uma dica aleatória usando a data atual como seed */}
        {(() => {
          const today = new Date()
          const seed = today.getDate() + today.getMonth() * 31
          const randomTip = tips[seed % tips.length]

          if (!randomTip) return null

          return (
            <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border-amber-200 dark:border-amber-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2 text-amber-600" />
                  {randomTip.title}
                </CardTitle>
                <CardDescription className="text-base mt-2">{randomTip.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h4 className="font-medium">Como implementar:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {randomTip.content.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex gap-2">
                  {renderDifficultyBadge(randomTip.difficulty)}
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {randomTip.timeToImplement}
                  </Badge>
                </div>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    if (!checkedTips.includes(randomTip.id)) {
                      toggleChecked(randomTip.id)
                    }
                    if (!favoriteTips.includes(randomTip.id)) {
                      toggleFavorite(randomTip.id)
                    }
                    toast({
                      title: "Ótima escolha!",
                      description: "Esta dica foi marcada como implementada e adicionada aos seus favoritos.",
                      duration: 3000,
                    })
                  }}
                >
                  Implementar Hoje
                </Button>
              </CardFooter>
            </Card>
          )
        })()}
      </div>

      {/* Seção de recursos adicionais */}
      <div className="mt-8 mb-12">
        <h2 className="text-2xl font-bold mb-4">Recursos Adicionais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ferramentas de Estudo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Explore aplicativos e ferramentas que podem potencializar suas sessões de estudo.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => router.push("/study")}>
                <ArrowRight className="h-4 w-4 mr-2" /> Explorar Ferramentas
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Técnicas de Memorização</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Aprenda métodos avançados para memorizar conteúdos complexos de forma eficiente.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => router.push("/flashcards")}>
                <ArrowRight className="h-4 w-4 mr-2" /> Ver Técnicas
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Comunidade de Estudantes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Conecte-se com outros estudantes para compartilhar dicas e experiências.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => router.push("/forum")}>
                <ArrowRight className="h-4 w-4 mr-2" /> Acessar Fórum
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Seção de feedback */}
      <div className="mt-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 text-center">
        <h2 className="text-xl font-bold mb-2">Tem uma dica para compartilhar?</h2>
        <p className="text-muted-foreground mb-4">
          Ajude outros estudantes compartilhando suas próprias técnicas e estratégias de estudo.
        </p>
        <Button onClick={() => router.push("/forum")}>Compartilhar Minha Dica</Button>
      </div>
    </div>
  )
}
