"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { TopNav } from "@/components/top-nav"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { DailyChallenges } from "@/components/daily-challenges"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/authContext"
import {
  LogIn,
  Book,
  Video,
  Wrench,
  Network,
  AlertTriangle,
  Database,
  PlayCircle,
  Calendar,
  Timer,
  Calculator,
  BookOpen,
  Brain,
  Lightbulb,
  Sparkles,
  BarChart,
  Clock,
  Zap,
  PenTool,
} from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import SchoolRanking from "@/components/school-ranking" // Importando o componente SchoolRanking

// Definição de tipos para os cards de estudo
interface StudyCardProps {
  icon: React.ReactNode
  iconBgColor: string
  title: string
  description: string
  href: string
  badge?: "novo" | "recomendado" | "atualizado"
  category: "material" | "ferramentas" | "prática" | "organização"
}

// Componente de card de estudo com animação
const StudyCard = ({ icon, iconBgColor, title, description, href, badge, category }: StudyCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.2 }}
    >
      <Link href={href} className="block h-full">
        <Card className="h-full border border-gray-200 bg-white transition-all hover:border-primary/20">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-lg ${iconBgColor}`}>{icon}</div>
              {badge && (
                <Badge
                  variant={badge === "novo" ? "destructive" : badge === "atualizado" ? "default" : "secondary"}
                  className="ml-auto"
                >
                  {badge === "novo" ? "Novo" : badge === "atualizado" ? "Atualizado" : "Recomendado"}
                </Badge>
              )}
            </div>
            <CardTitle className="mt-3 text-lg font-semibold">{title}</CardTitle>
            <CardDescription className="line-clamp-2 text-sm text-muted-foreground">{description}</CardDescription>
          </CardHeader>
          <CardFooter className="pt-0">
            <div className="mt-auto flex w-full items-center justify-between">
              <span className="text-xs text-muted-foreground capitalize">{category}</span>
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                Explorar
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  )
}

// Componente de seção com título
const SectionTitle = ({ title, description }: { title: string; description?: string }) => (
  <div className="mb-6">
    <h2 className="text-xl font-bold">{title}</h2>
    {description && <p className="text-sm text-muted-foreground">{description}</p>}
  </div>
)

export default function StudyPage() {
  const [activeTab, setActiveTab] = useState("todos")
  const router = useRouter()
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Dados dos cards de estudo
  const studyCards: StudyCardProps[] = [
    {
      icon: <Book className="h-6 w-6 text-purple-500" />,
      iconBgColor: "bg-purple-100",
      title: "Resumos",
      description: "Acesse resumos teóricos e práticos dos principais tópicos de estudo",
      href: "/study/summaries",
      category: "material",
    },
    {
      icon: <Video className="h-6 w-6 text-red-500" />,
      iconBgColor: "bg-red-100",
      title: "Tutoriais em Vídeo",
      description: "Vídeos explicativos curtos sobre temas complexos com exemplos práticos",
      href: "/study/tutorials",
      badge: "novo",
      category: "material",
    },
    {
      icon: <Wrench className="h-6 w-6 text-green-500" />,
      iconBgColor: "bg-green-100",
      title: "Projetos Práticos",
      description: "Biblioteca de projetos simples e avançados para aplicar seus conhecimentos",
      href: "/study/projects",
      badge: "novo",
      category: "prática",
    },
    {
      icon: <Network className="h-6 w-6 text-yellow-500" />,
      iconBgColor: "bg-yellow-100",
      title: "Mapas Mentais",
      description: "Diagramas visuais de conceitos e fórmulas para facilitar a compreensão",
      href: "/study/mindmaps",
      badge: "recomendado",
      category: "material",
    },
    {
      icon: <AlertTriangle className="h-6 w-6 text-orange-500" />,
      iconBgColor: "bg-orange-100",
      title: "Análise de Erros",
      description: "Aprenda com erros comuns em projetos e evite-os em seus estudos",
      href: "/study/errors",
      category: "prática",
    },
    {
      icon: <Database className="h-6 w-6 text-blue-500" />,
      iconBgColor: "bg-blue-100",
      title: "Banco de Componentes",
      description: "Consulte características de 15 componentes eletrônicos essenciais",
      href: "/study/banco-componentes",
      badge: "atualizado",
      category: "material",
    },
    {
      icon: <PlayCircle className="h-6 w-6 text-cyan-500" />,
      iconBgColor: "bg-cyan-100",
      title: "Videoaulas",
      description: "Assista aulas gravadas completas sobre diversos temas da eletrônica",
      href: "/study/video",
      category: "material",
    },
    {
      icon: <Calendar className="h-6 w-6 text-emerald-500" />,
      iconBgColor: "bg-emerald-100",
      title: "Agenda",
      description: "Organize seus horários de estudo e compromissos acadêmicos",
      href: "/study/agenda",
      category: "organização",
    },
    {
      icon: <Timer className="h-6 w-6 text-pink-500" />,
      iconBgColor: "bg-pink-100",
      title: "Pomodoro",
      description: "Gerencie seu tempo de estudo com a técnica Pomodoro para maior produtividade",
      href: "/study/pomodoro",
      category: "ferramentas",
    },
    {
      icon: <Calendar className="h-6 w-6 text-indigo-500" />,
      iconBgColor: "bg-indigo-100",
      title: "Cronograma de Estudos",
      description: "Organize e planeje seus horários de estudo de forma eficiente",
      href: "/study/schedule",
      badge: "novo",
      category: "organização",
    },
    {
      icon: <Calculator className="h-6 w-6 text-violet-500" />,
      iconBgColor: "bg-violet-100",
      title: "Calculadora ENEM",
      description: "Calcule suas chances no ENEM com base nas suas notas e pesos",
      href: "/study/enem-calculator",
      category: "ferramentas",
    },
    {
      icon: <BookOpen className="h-6 w-6 text-teal-500" />,
      iconBgColor: "bg-teal-100",
      title: "Flashcards",
      description: "Estude com cartões de memorização para fixar conceitos importantes",
      href: "/flashcards",
      category: "ferramentas",
    },
    {
      icon: <Brain className="h-6 w-6 text-rose-500" />,
      iconBgColor: "bg-rose-100",
      title: "Simulados",
      description: "Teste seus conhecimentos com simulados de provas e concursos",
      href: "/review/simuladores",
      category: "prática",
    },
    {
      icon: <Lightbulb className="h-6 w-6 text-amber-500" />,
      iconBgColor: "bg-amber-100",
      title: "Dicas de Estudo",
      description: "Técnicas e métodos eficientes para otimizar seu aprendizado",
      href: "/study/tips",
      category: "organização",
    },
    {
      icon: <Clock className="h-6 w-6 text-emerald-600" />,
      iconBgColor: "bg-emerald-100",
      title: "R.E.C - Rotina de Estudo Consistente",
      description: "Crie uma rotina de estudos personalizada adaptada ao seu perfil e objetivos",
      href: "/study/rec",
      badge: "novo",
      category: "organização",
    },
    {
      icon: <Sparkles className="h-6 w-6 text-sky-500" />,
      iconBgColor: "bg-sky-100",
      title: "Jogos Educativos",
      description: "Aprenda enquanto se diverte com jogos educativos interativos",
      href: "/review/games",
      category: "prática",
    },
    {
      icon: <PenTool className="h-6 w-6 text-purple-600" />,
      iconBgColor: "bg-purple-100",
      title: "Revisão de Redações",
      description: "Corrija suas redações com IA baseada nas 5 competências do ENEM",
      href: "/study/essay-review",
      badge: "novo",
      category: "ferramentas",
    },
    {
      icon: <Brain className="h-6 w-6 text-indigo-600" />,
      iconBgColor: "bg-indigo-100",
      title: "SimulaPro",
      description: "Treine com questões ajustadas ao seu nível e descubra sua nota com o TRI",
      href: "/study/simula-pro",
      badge: "novo",
      category: "prática",
    },
  ]

  // Filtrar cards por categoria
  const getCardsByCategory = (category: string) => {
    return studyCards.filter((card) => (category === "todos" ? true : card.category === category))
  }

  if (!mounted) {
    return null
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <TopNav />
        <main className="flex-1 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-md"
          >
            <div className="bg-primary/5 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <LogIn className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Acesso Restrito</h2>
            <p className="text-gray-500 mb-8">
              Faça login ou crie uma conta para acessar todos os recursos de estudo e acompanhar seu progresso
            </p>
            <div className="space-x-4">
              <Button onClick={() => router.push("/login")} size="lg">
                Fazer Login
              </Button>
              <Button variant="outline" onClick={() => router.push("/register")} size="lg">
                Criar Conta
              </Button>
            </div>
          </motion.div>
        </main>
        <BottomNav active="study" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <TopNav />

      <main className="container mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Área de Estudo</h1>
              <p className="text-muted-foreground mt-1">
                Explore recursos, materiais e ferramentas para otimizar seu aprendizado
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-2">
              <Button variant="outline" onClick={() => router.push("/performance")}>
                <BarChart className="mr-2 h-4 w-4" />
                Meu Desempenho
              </Button>
              <Button onClick={() => router.push("/flashcards")}>
                <Zap className="mr-2 h-4 w-4" />
                Iniciar Revisão
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-5 mb-6">
                  <TabsTrigger value="todos">Todos</TabsTrigger>
                  <TabsTrigger value="material">Materiais</TabsTrigger>
                  <TabsTrigger value="ferramentas">Ferramentas</TabsTrigger>
                  <TabsTrigger value="prática">Prática</TabsTrigger>
                  <TabsTrigger value="organização">Organização</TabsTrigger>
                </TabsList>

                <TabsContent value="todos" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {studyCards.map((card, index) => (
                      <StudyCard key={index} {...card} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="material" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getCardsByCategory("material").map((card, index) => (
                      <StudyCard key={index} {...card} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="ferramentas" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getCardsByCategory("ferramentas").map((card, index) => (
                      <StudyCard key={index} {...card} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="prática" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getCardsByCategory("prática").map((card, index) => (
                      <StudyCard key={index} {...card} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="organização" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getCardsByCategory("organização").map((card, index) => (
                      <StudyCard key={index} {...card} />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <DailyChallenges />

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart className="mr-2 h-5 w-5 text-primary" />
                    Ranking da Escola
                  </CardTitle>
                  <CardDescription className="text-xs">Top estudantes da sua escola</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <SchoolRanking />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recursos Rápidos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                    <Link href="/calculator">
                      <Calculator className="mr-2 h-4 w-4" />
                      Calculadoras
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                    <Link href="/forum">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
                        <path d="m18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
                      </svg>
                      Fórum de Dúvidas
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                    <Link href="/review">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                      Revisão
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                    <Link href="/performance">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                      </svg>
                      Desempenho
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </main>

      <BottomNav active="study" />
    </div>
  )
}
