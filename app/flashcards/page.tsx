"use client"

import { useState, useEffect } from "react"
import { TopNav } from "@/components/top-nav"
import { BottomNav } from "@/components/bottom-nav"
import { flashcardsData, getSubjectsByYear } from "@/data/flashcards"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  BookOpen,
  Brain,
  Lightbulb,
  Zap,
  Clock,
  ArrowLeft,
  Timer,
  GraduationCap,
  FileText,
  Award,
  Cpu,
  Activity,
  Bookmark,
  Calculator,
  Atom,
  Monitor,
  Code,
  Wifi,
  Settings,
  Wrench,
  TrendingUp,
  Target,
  Star,
} from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/authContext"
import { RestrictedAccess } from "@/components/restricted-access"
import { Badge } from "@/components/ui/badge"

const iconMap: Record<string, any> = {
  Zap,
  Cpu,
  Calculator,
  Atom,
  Monitor,
  Code,
  Wifi,
  Settings,
  Wrench,
  Brain,
  Activity,
  Bookmark,
}

export default function FlashcardsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState<Record<string, { completed: number; total: number }>>({})
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [selectedYear, setSelectedYear] = useState<1 | 2 | 3>(1)

  // Estatísticas gerais
  const totalCards = flashcardsData.reduce((acc, subject) => acc + subject.topics.flatMap((t) => t.cards).length, 0)
  const easyCards = flashcardsData.reduce(
    (acc, subject) => acc + subject.topics.flatMap((t) => t.cards.filter((c) => c.difficulty === "easy")).length,
    0,
  )
  const mediumCards = flashcardsData.reduce(
    (acc, subject) => acc + subject.topics.flatMap((t) => t.cards.filter((c) => c.difficulty === "medium")).length,
    0,
  )
  const hardCards = flashcardsData.reduce(
    (acc, subject) => acc + subject.topics.flatMap((t) => t.cards.filter((c) => c.difficulty === "hard")).length,
    0,
  )

  useEffect(() => {
    setMounted(true)
    // Load progress from localStorage
    try {
      const savedProgress = localStorage.getItem("flashcardProgress")
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress))
      }
    } catch (error) {
      console.error("Failed to load progress:", error)
    }

    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (!mounted) {
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-16">
        <TopNav />
        <main className="container mx-auto px-4 py-6">
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4 max-w-md" />
            <Skeleton className="h-4 w-full max-w-lg" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <Skeleton className="h-32 rounded-lg" />
              <Skeleton className="h-32 rounded-lg" />
              <Skeleton className="h-32 rounded-lg" />
              <Skeleton className="h-32 rounded-lg" />
            </div>

            <Skeleton className="h-8 w-1/2 mt-8" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-64 rounded-lg" />
              <Skeleton className="h-64 rounded-lg" />
              <Skeleton className="h-64 rounded-lg" />
            </div>
          </div>
        </main>
        <BottomNav active="review" />
      </div>
    )
  }

  if (!user) {
    return <RestrictedAccess activeNavItem="review" />
  }

  const handleResetProgress = () => {
    try {
      localStorage.removeItem("flashcardProgress")
      setProgress({})
      toast({
        title: "Progresso reiniciado",
        description: "Todo o seu progresso de estudo foi reiniciado com sucesso.",
      })
    } catch (error) {
      console.error("Failed to reset progress:", error)
      toast({
        title: "Erro ao reiniciar",
        description: "Não foi possível reiniciar seu progresso. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || Bookmark
    return <IconComponent className="h-5 w-5" />
  }

  const getYearSubjects = (year: 1 | 2 | 3) => getSubjectsByYear(year)

  if (!flashcardsData || flashcardsData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-16">
        <TopNav />
        <main className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Carregando flashcards...</h1>
            <p className="text-muted-foreground">Por favor, aguarde enquanto carregamos o conteúdo.</p>
          </div>
        </main>
        <BottomNav active="review" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-16">
      <TopNav />

      <main className="container mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Link
                  href="/review"
                  className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  <span>Voltar para Revisão</span>
                </Link>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Flashcards
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Domine conceitos de eletrônica com cartões de memorização inteligentes
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleResetProgress}>
                <TrendingUp className="h-4 w-4 mr-2" />
                Reiniciar Progresso
              </Button>
            </div>
          </div>

          {/* Estatísticas Gerais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total de Cartões</p>
                    <p className="text-3xl font-bold text-blue-700">{totalCards}</p>
                  </div>
                  <div className="p-3 bg-blue-500 rounded-full">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Nível Fácil</p>
                    <p className="text-3xl font-bold text-green-700">{easyCards}</p>
                  </div>
                  <div className="p-3 bg-green-500 rounded-full">
                    <Lightbulb className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-amber-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-amber-600">Nível Médio</p>
                    <p className="text-3xl font-bold text-amber-700">{mediumCards}</p>
                  </div>
                  <div className="p-3 bg-amber-500 rounded-full">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600">Nível Difícil</p>
                    <p className="text-3xl font-bold text-red-700">{hardCards}</p>
                  </div>
                  <div className="p-3 bg-red-500 rounded-full">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Seletor de Ano */}
          <Card className="mb-8 border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <GraduationCap className="h-5 w-5 mr-2" />
                Selecione o Ano do Curso
              </CardTitle>
              <CardDescription className="text-indigo-100">
                Escolha o ano para ver as matérias específicas do currículo
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-3">
                {[1, 2, 3].map((year) => (
                  <Button
                    key={year}
                    variant={selectedYear === year ? "default" : "outline"}
                    onClick={() => setSelectedYear(year as 1 | 2 | 3)}
                    className={`flex items-center gap-2 ${
                      selectedYear === year
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                        : ""
                    }`}
                  >
                    <Star className="h-4 w-4" />
                    {year}º Ano
                    <Badge variant="secondary" className="ml-1">
                      {getYearSubjects(year as 1 | 2 | 3).length} matérias
                    </Badge>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="study" className="mb-8">
            <TabsList className="grid w-full grid-cols-3 h-12">
              <TabsTrigger value="study" className="flex items-center gap-2 text-sm">
                <BookOpen className="h-4 w-4" />
                <span>Estudar</span>
              </TabsTrigger>
              <TabsTrigger value="review" className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4" />
                <span>Revisão</span>
              </TabsTrigger>
              <TabsTrigger value="test" className="flex items-center gap-2 text-sm">
                <Timer className="h-4 w-4" />
                <span>Teste</span>
              </TabsTrigger>
            </TabsList>

            {/* ESTUDAR */}
            <TabsContent value="study" className="mt-6">
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">Modo Estudo - {selectedYear}º Ano</h2>
                  <p className="text-muted-foreground">Aprenda conceitos fundamentais com explicações detalhadas</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getYearSubjects(selectedYear).map((subject) => (
                    <Card
                      key={subject.id}
                      className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                    >
                      <div className={`h-2 bg-gradient-to-r ${subject.color}`} />
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className={`p-3 rounded-xl bg-gradient-to-r ${subject.color}`}>
                            {getIcon(subject.icon)}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {subject.topics.flatMap((t) => t.cards).length} cartões
                          </Badge>
                        </div>
                        <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                          {subject.title}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {subject.year}º Ano • {subject.topics.length} tópicos
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          {/* Nível Fácil */}
                          <Button
                            onClick={() => router.push(`/flashcards/study-${subject.id}-easy`)}
                            size="sm"
                            className="bg-green-500 hover:bg-green-600 text-white text-xs py-2"
                          >
                            <Lightbulb className="h-3 w-3 mr-1" />
                            Fácil
                          </Button>

                          {/* Nível Médio */}
                          <Button
                            onClick={() => router.push(`/flashcards/study-${subject.id}-medium`)}
                            size="sm"
                            className="bg-amber-500 hover:bg-amber-600 text-white text-xs py-2"
                          >
                            <Brain className="h-3 w-3 mr-1" />
                            Médio
                          </Button>

                          {/* Nível Difícil */}
                          <Button
                            onClick={() => router.push(`/flashcards/study-${subject.id}-hard`)}
                            size="sm"
                            className="bg-red-500 hover:bg-red-600 text-white text-xs py-2"
                          >
                            <Zap className="h-3 w-3 mr-1" />
                            Difícil
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Progresso</span>
                            <span>0%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                              style={{ width: "0%" }}
                            ></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* REVISÃO */}
            <TabsContent value="review" className="mt-6">
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">Modo Revisão - {selectedYear}º Ano</h2>
                  <p className="text-muted-foreground">Revise e consolide seus conhecimentos com testes focados</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getYearSubjects(selectedYear).map((subject) => (
                    <Card
                      key={subject.id}
                      className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                    >
                      <div className={`h-2 bg-gradient-to-r ${subject.color}`} />
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className={`p-3 rounded-xl bg-gradient-to-r ${subject.color}`}>
                            {getIcon(subject.icon)}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Revisão
                          </Badge>
                        </div>
                        <CardTitle className="text-lg group-hover:text-purple-600 transition-colors">
                          {subject.title}
                        </CardTitle>
                        <CardDescription className="text-sm">Teste seus conhecimentos adquiridos</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          {/* Revisão Básica */}
                          <Button
                            onClick={() => router.push(`/flashcards/review-${subject.id}-easy`)}
                            size="sm"
                            className="bg-green-500 hover:bg-green-600 text-white text-xs py-2"
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            Básica
                          </Button>

                          {/* Revisão Intermediária */}
                          <Button
                            onClick={() => router.push(`/flashcards/review-${subject.id}-medium`)}
                            size="sm"
                            className="bg-amber-500 hover:bg-amber-600 text-white text-xs py-2"
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            Inter.
                          </Button>

                          {/* Simulado */}
                          <Button
                            onClick={() => router.push(`/flashcards/review-${subject.id}-hard`)}
                            size="sm"
                            className="bg-red-500 hover:bg-red-600 text-white text-xs py-2"
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            Prova
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* TESTE */}
            <TabsContent value="test" className="mt-6">
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">Testes Cronometrados</h2>
                  <p className="text-muted-foreground">Desafie-se com testes cronometrados de múltiplas matérias</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Teste Médio - Todas as matérias */}
                  <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold flex items-center">
                            <Timer className="h-5 w-5 mr-2" />
                            Teste Cronometrado
                          </h3>
                          <p className="text-purple-100 mt-1 text-sm">Nível Intermediário</p>
                        </div>
                        <Badge className="bg-white/20 hover:bg-white/30 text-white">15 min</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Target className="h-4 w-4 mr-2 text-purple-200" />
                          <span>20 questões mistas</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-2 text-purple-200" />
                          <span>Tempo limitado</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Award className="h-4 w-4 mr-2 text-purple-200" />
                          <span>Feedback imediato</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 bg-white">
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">O que esperar:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li className="flex items-start">
                            <span className="text-purple-500 mr-2">•</span>
                            Questões de todas as matérias do {selectedYear}º ano
                          </li>
                          <li className="flex items-start">
                            <span className="text-purple-500 mr-2">•</span>
                            Dificuldade intermediária
                          </li>
                          <li className="flex items-start">
                            <span className="text-purple-500 mr-2">•</span>
                            Relatório detalhado de desempenho
                          </li>
                        </ul>
                      </div>
                      <Button
                        onClick={() => router.push(`/flashcards/timed-test-medium`)}
                        className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                      >
                        <Timer className="h-4 w-4 mr-2" />
                        Iniciar Teste
                      </Button>
                    </div>
                  </Card>

                  {/* Teste Difícil - Todas as matérias */}
                  <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="bg-gradient-to-r from-rose-500 to-red-600 p-6 text-white">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold flex items-center">
                            <Zap className="h-5 w-5 mr-2" />
                            Desafio Avançado
                          </h3>
                          <p className="text-rose-100 mt-1 text-sm">Nível Avançado</p>
                        </div>
                        <Badge className="bg-white/20 hover:bg-white/30 text-white">10 min</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Target className="h-4 w-4 mr-2 text-rose-200" />
                          <span>15 questões difíceis</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-2 text-rose-200" />
                          <span>Tempo reduzido</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Award className="h-4 w-4 mr-2 text-rose-200" />
                          <span>Pontuação por tempo</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 bg-white">
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">O que esperar:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li className="flex items-start">
                            <span className="text-rose-500 mr-2">•</span>
                            Questões avançadas e desafiadoras
                          </li>
                          <li className="flex items-start">
                            <span className="text-rose-500 mr-2">•</span>
                            Tempo limitado para máximo desafio
                          </li>
                          <li className="flex items-start">
                            <span className="text-rose-500 mr-2">•</span>
                            Ranking de desempenho
                          </li>
                        </ul>
                      </div>
                      <Button
                        onClick={() => router.push(`/flashcards/timed-test-hard`)}
                        className="w-full bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700"
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Iniciar Desafio
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Dicas de Estudo */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <GraduationCap className="h-5 w-5 mr-2" />
                Dicas para Maximizar seu Aprendizado
              </CardTitle>
              <CardDescription className="text-emerald-100">
                Estratégias comprovadas para melhorar sua retenção de conhecimento
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Estude Regularmente</h3>
                    <p className="text-sm text-muted-foreground">
                      Sessões de 15-20 minutos diárias são mais eficazes que estudos longos esporádicos.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-full flex-shrink-0">
                    <Brain className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Repetição Espaçada</h3>
                    <p className="text-sm text-muted-foreground">
                      Revise os cartões em intervalos crescentes para melhorar a retenção a longo prazo.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-amber-100 p-3 rounded-full flex-shrink-0">
                    <Award className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Progressão Gradual</h3>
                    <p className="text-sm text-muted-foreground">
                      Comece com cartões fáceis e avance gradualmente para os mais difíceis.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <BottomNav active="review" />
    </div>
  )
}
