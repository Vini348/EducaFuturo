"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { TopNav } from "@/components/top-nav"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/authContext"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  BookOpen,
  Globe,
  Calculator,
  Atom,
  Trophy,
  Users,
  Filter,
  Flame,
  Star,
  User,
  CheckCircle,
  XCircle,
  BarChart3,
  ArrowLeft,
  Layers,
  Clock,
} from "lucide-react"

// Tipos para as questões e áreas
interface Question {
  id: number
  text: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

interface StudyArea {
  id: string
  name: string
  icon: React.ReactNode
  disciplines: string[]
  score: number
  questionsAnswered: number
  totalQuestions: number
  questions: Question[]
  color: string
}

// Dados das áreas de conhecimento
const studyAreas: StudyArea[] = [
  {
    id: "linguagens",
    name: "Linguagens",
    icon: <BookOpen className="h-6 w-6" />,
    disciplines: ["Língua Portuguesa", "Literatura", "Inglês/Espanhol", "Artes", "Educação Física"],
    score: 0,
    questionsAnswered: 0,
    totalQuestions: 50,
    color: "bg-purple-500",
    questions: [
      {
        id: 1,
        text: "(ENEM) O uso da vírgula pode alterar o sentido da frase. Assinale a alternativa correta:",
        options: [
          "Ela só gosta de estudar matemática.",
          "Ela só, gosta de estudar matemática.",
          "Ela gosta, só de estudar matemática.",
          "Todas as alternativas acima estão corretas.",
        ],
        correctAnswer: 3,
        explanation: "A vírgula pode alterar completamente o sentido da frase dependendo de sua posição.",
      },
      {
        id: 2,
        text: "(ENEM) Leia o trecho: 'A tecnologia avança rapidamente.' A palavra 'rapidamente' funciona como:",
        options: ["Substantivo", "Advérbio", "Adjetivo", "Pronome"],
        correctAnswer: 1,
        explanation: "A palavra 'rapidamente' modifica o verbo 'avança', sendo portanto um advérbio de modo.",
      },
    ],
  },
  {
    id: "humanas",
    name: "Ciências Humanas",
    icon: <Globe className="h-6 w-6" />,
    disciplines: ["Filosofia", "História", "Geografia", "Sociologia"],
    score: 0,
    questionsAnswered: 0,
    totalQuestions: 50,
    color: "bg-green-500",
    questions: [
      {
        id: 1,
        text: "(ENEM) A Revolução Francesa iniciou-se em:",
        options: ["1776", "1789", "1815", "1848"],
        correctAnswer: 1,
        explanation: "A Revolução Francesa começou em 1789 com a convocação dos Estados Gerais.",
      },
      {
        id: 2,
        text: "(ENEM) Um dos principais objetivos do Iluminismo era:",
        options: [
          "Manutenção do absolutismo",
          "Defesa da fé católica acima da razão",
          "Valorização da razão e do conhecimento científico",
          "Reforçar os privilégios da nobreza",
        ],
        correctAnswer: 2,
        explanation: "O Iluminismo defendia o uso da razão e do método científico para compreender o mundo.",
      },
    ],
  },
  {
    id: "matematica",
    name: "Matemática",
    icon: <Calculator className="h-6 w-6" />,
    disciplines: ["Matemática aplicada à realidade"],
    score: 0,
    questionsAnswered: 0,
    totalQuestions: 50,
    color: "bg-blue-500",
    questions: [
      {
        id: 1,
        text: "(ENEM) Resolva o sistema: 2x + y = 10 e x - y = 2",
        options: ["x=4, y=2", "x=3, y=4", "x=2, y=6", "x=5, y=0"],
        correctAnswer: 0,
        explanation: "Resolvendo o sistema: x = 4 e y = 2. Verificação: 2(4) + 2 = 10 ✓ e 4 - 2 = 2 ✓",
      },
      {
        id: 2,
        text: "(ENEM) A função f(x) = 2x + 3 tem valor f(5) igual a:",
        options: ["10", "11", "12", "13"],
        correctAnswer: 3,
        explanation: "f(5) = 2(5) + 3 = 10 + 3 = 13",
      },
    ],
  },
  {
    id: "natureza",
    name: "Ciências da Natureza",
    icon: <Atom className="h-6 w-6" />,
    disciplines: ["Biologia", "Física", "Química"],
    score: 0,
    questionsAnswered: 0,
    totalQuestions: 50,
    color: "bg-orange-500",
    questions: [
      {
        id: 1,
        text: "(ENEM) A água entra em ebulição quando:",
        options: [
          "A temperatura atinge 50°C",
          "A pressão atmosférica é igual à pressão de vapor do líquido",
          "O líquido atinge 90°C em qualquer condição",
          "A pressão do gás sobre o líquido é menor que 1 atm",
        ],
        correctAnswer: 1,
        explanation: "A ebulição ocorre quando a pressão de vapor do líquido se iguala à pressão atmosférica.",
      },
      {
        id: 2,
        text: "(ENEM) Em uma reação química, o reagente A se combina totalmente com B para formar C. Esse é um exemplo de:",
        options: ["Reação de síntese", "Reação de decomposição", "Reação de combustão", "Reação de neutralização"],
        correctAnswer: 0,
        explanation: "Quando dois ou mais reagentes se combinam para formar um produto, temos uma reação de síntese.",
      },
    ],
  },
]

export default function SimulaProPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("treinar")
  const [areas, setAreas] = useState<StudyArea[]>(studyAreas)
  const [selectedArea, setSelectedArea] = useState<StudyArea | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [showTrainingOptions, setShowTrainingOptions] = useState(false)
  const [userStats, setUserStats] = useState({
    totalScore: 0,
    totalQuestions: 0,
    rank: 1,
    flame: 0,
    stars: 0,
  })

  // Carregar dados do localStorage
  useEffect(() => {
    const savedAreas = localStorage.getItem("simulaPro_areas")
    const savedStats = localStorage.getItem("simulaPro_stats")

    if (savedAreas) {
      setAreas(JSON.parse(savedAreas))
    }
    if (savedStats) {
      setUserStats(JSON.parse(savedStats))
    }
  }, [])

  // Salvar dados no localStorage
  const saveData = (newAreas: StudyArea[], newStats: typeof userStats) => {
    localStorage.setItem("simulaPro_areas", JSON.stringify(newAreas))
    localStorage.setItem("simulaPro_stats", JSON.stringify(newStats))
  }

  // Iniciar treino de uma área
  const startTraining = (area: StudyArea) => {
    setSelectedArea(area)
    const availableQuestions = area.questions.filter(
      (q) => !area.questions.slice(0, area.questionsAnswered).includes(q),
    )
    if (availableQuestions.length > 0) {
      setCurrentQuestion(availableQuestions[0])
      setSelectedAnswer(null)
      setShowResult(false)
    }
  }

  // Responder questão
  const answerQuestion = (answerIndex: number) => {
    if (!currentQuestion || !selectedArea) return

    setSelectedAnswer(answerIndex)
    setShowResult(true)

    // Calcular nova pontuação usando TRI simulado
    const isCorrect = answerIndex === currentQuestion.correctAnswer
    const newScore = isCorrect ? selectedArea.score + 20 : Math.max(0, selectedArea.score - 5)

    // Atualizar área
    const updatedAreas = areas.map((area) => {
      if (area.id === selectedArea.id) {
        return {
          ...area,
          score: newScore,
          questionsAnswered: area.questionsAnswered + 1,
        }
      }
      return area
    })

    // Atualizar estatísticas gerais
    const newStats = {
      ...userStats,
      totalQuestions: userStats.totalQuestions + 1,
      totalScore: userStats.totalScore + (isCorrect ? 20 : 0),
      flame: userStats.flame + (isCorrect ? 1 : 0),
      stars: userStats.stars + (isCorrect ? 1 : 0),
    }

    setAreas(updatedAreas)
    setUserStats(newStats)
    saveData(updatedAreas, newStats)

    // Próxima questão após 3 segundos
    setTimeout(() => {
      const nextQuestions = selectedArea.questions.filter(
        (q) => !selectedArea.questions.slice(0, selectedArea.questionsAnswered + 1).includes(q),
      )
      if (nextQuestions.length > 0) {
        setCurrentQuestion(nextQuestions[0])
        setSelectedAnswer(null)
        setShowResult(false)
      } else {
        setSelectedArea(null)
        setCurrentQuestion(null)
      }
    }, 3000)
  }

  const showTrainingOptionsForArea = (area: StudyArea) => {
    setSelectedArea(area)
    setShowTrainingOptions(true)
  }

  const startBloco = () => {
    if (selectedArea) {
      router.push(`/study/simula-pro/bloco?area=${selectedArea.id}`)
    }
  }

  const startSimulado = () => {
    if (selectedArea) {
      router.push(`/study/simula-pro/simulado?area=${selectedArea.id}`)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <TopNav />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Acesso Restrito</h2>
            <p className="text-gray-500 mb-8">Faça login para acessar o SimulaPro</p>
            <Button onClick={() => router.push("/login")}>Fazer Login</Button>
          </div>
        </main>
        <BottomNav active="study" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <TopNav />

      {/* Header do SimulaPro */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/study")}
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">SimulaPro</h1>
                <p className="text-indigo-100">Treine com questões ajustadas ao seu nível</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-400" />
                <span className="font-semibold">{userStats.flame}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="font-semibold">{userStats.stars}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span className="text-sm">#{userStats.rank}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6">
        {showTrainingOptions && selectedArea && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-md w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {selectedArea.icon}
                  {selectedArea.name}
                </CardTitle>
                <CardDescription>Escolha como deseja treinar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start h-auto p-4" onClick={startBloco}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Layers className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Bloco</div>
                      <div className="text-sm text-muted-foreground">
                        Pratique com um bloco de 5 questões, com resolução detalhada e dificuldade crescente
                      </div>
                    </div>
                  </div>
                </Button>

                <Button className="w-full justify-start h-auto p-4" onClick={startSimulado}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Clock className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Simulado</div>
                      <div className="text-sm text-muted-foreground">
                        Simule o dia da prova e veja seu desempenho com estatísticas detalhadas
                      </div>
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => setShowTrainingOptions(false)}
                >
                  Cancelar
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Questão em andamento */}
        {currentQuestion && selectedArea && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <Card className="border-2 border-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {selectedArea.icon}
                    {selectedArea.name}
                  </CardTitle>
                  <Badge variant="secondary">Questão {selectedArea.questionsAnswered + 1}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg mb-6">{currentQuestion.text}</p>
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <Button
                      key={index}
                      variant={
                        showResult
                          ? index === currentQuestion.correctAnswer
                            ? "default"
                            : index === selectedAnswer
                              ? "destructive"
                              : "outline"
                          : selectedAnswer === index
                            ? "secondary"
                            : "outline"
                      }
                      className="w-full justify-start text-left h-auto p-4"
                      onClick={() => !showResult && answerQuestion(index)}
                      disabled={showResult}
                    >
                      <span className="mr-3 font-semibold">{String.fromCharCode(65 + index)})</span>
                      {option}
                      {showResult && index === currentQuestion.correctAnswer && (
                        <CheckCircle className="ml-auto h-5 w-5 text-green-600" />
                      )}
                      {showResult && index === selectedAnswer && index !== currentQuestion.correctAnswer && (
                        <XCircle className="ml-auto h-5 w-5 text-red-600" />
                      )}
                    </Button>
                  ))}
                </div>
                {showResult && currentQuestion.explanation && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Explicação:</strong> {currentQuestion.explanation}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="treinar">Treinar</TabsTrigger>
            <TabsTrigger value="grupos">Grupos</TabsTrigger>
            <TabsTrigger value="ranking">Ranking</TabsTrigger>
          </TabsList>

          <TabsContent value="treinar" className="mt-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Treine com questões ajustadas ao seu nível</h2>
              <p className="text-muted-foreground">Descubra sua nota com o TRI</p>

              {/* Filtros */}
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Áreas
                </Button>
                <Button variant="outline" size="sm">
                  Competências
                </Button>
                <Button variant="outline" size="sm">
                  Habilidades
                </Button>
              </div>
            </div>

            {/* Áreas de Conhecimento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {areas.map((area) => (
                <motion.div key={area.id} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                  <Card className="h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg ${area.color} text-white`}>{area.icon}</div>
                          {area.name}
                        </CardTitle>
                        <Badge variant="secondary">Nota: {area.score}</Badge>
                      </div>
                      <CardDescription>{area.disciplines.join(", ")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Progresso</span>
                            <span>
                              {area.questionsAnswered}/{area.totalQuestions}
                            </span>
                          </div>
                          <Progress value={(area.questionsAnswered / area.totalQuestions) * 100} className="h-2" />
                        </div>
                        <Button
                          className="w-full"
                          onClick={() => showTrainingOptionsForArea(area)}
                          disabled={area.questionsAnswered >= area.totalQuestions}
                        >
                          {area.questionsAnswered >= area.totalQuestions ? "Concluído" : "Treinar"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="grupos" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Grupos de Estudo
                </CardTitle>
                <CardDescription>Crie ou participe de grupos para compartilhar seu desempenho</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">Funcionalidade em desenvolvimento</p>
                  <Button variant="outline">Criar Grupo</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ranking" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Ranking Geral
                </CardTitle>
                <CardDescription>Veja sua posição entre todos os usuários</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold">
                        1
                      </div>
                      <div>
                        <p className="font-semibold">{user.email}</p>
                        <p className="text-sm text-muted-foreground">{userStats.totalScore} pontos</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{userStats.totalQuestions} questões</span>
                    </div>
                  </div>

                  <div className="text-center py-4 text-muted-foreground">
                    <p>Continue treinando para subir no ranking!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav active="study" />
    </div>
  )
}
