"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { TopNav } from "@/components/top-nav"
import { BottomNav } from "@/components/bottom-nav"
import { MetricsCard } from "@/components/metrics-card"
import { AchievementItem } from "@/components/achievement-item"
import { StudyDayTracker } from "@/components/study_day_tracker"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
  PieChart as RechartsPieChart,
  Pie,
  Legend,
} from "recharts"
import {
  BookOpen,
  Layers,
  Gamepad2,
  Clock,
  PieChart,
  Zap,
  Trophy,
  Calendar,
  ArrowRight,
  Loader2,
  ClipboardList,
  LineChart as LineChart2,
  Target,
  Award,
  TrendingUp,
  BookMarked,
  Lightbulb,
  Flame,
  Sparkles,
  Star,
  BarChart3,
  Activity,
} from "lucide-react"
import { useAuth } from "@/lib/authContext"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { toast } from "@/components/ui/use-toast"
import { RestrictedAccess } from "@/components/restricted-access"
import { Badge } from "@/components/ui/badge"

import { getAllSubjects } from "@/data/subjects-curriculum"

interface PerformanceData {
  totalStudyTime: number
  studyDays: number[]
  quizAttempts: number
  quizCorrectAnswers: number
  flashcardAttempts: number
  flashcardCorrectAnswers: number
  gameAttempts: number
  gameCorrectAnswers: number
  totalStudySessions: number
  studyStreak: number
  weeklyPerformance: { week: string; value: number }[]
  subjectProgress: { name: string; completed: number; total: number; color: string; remaining: number }[]
  accuracyHistory: { date: string; accuracy: number }[]
  lastCalibrationDate?: string
  subjectStudyTime: { subject: string; time: number }[]
  sessionsByDay: { day: string; count: number }[]
}

interface UserActivity {
  id: string
  type: "quiz" | "flashcard" | "game" | "study" | "video" | "project"
  title: string
  details: string
  timestamp: string
  score?: number
  accuracy?: number
  duration?: number
  subject?: string
  icon: React.ReactNode
  color: string
}

const initialPerformanceData: PerformanceData = {
  totalStudyTime: 0,
  studyDays: [],
  quizAttempts: 0,
  quizCorrectAnswers: 0,
  flashcardAttempts: 0,
  flashcardCorrectAnswers: 0,
  gameAttempts: 0,
  gameCorrectAnswers: 0,
  totalStudySessions: 0,
  studyStreak: 0,
  weeklyPerformance: [
    { week: "Semana 1", value: 0 },
    { week: "Semana 2", value: 0 },
    { week: "Semana 3", value: 0 },
    { week: "Semana 4", value: 0 },
  ],
  subjectProgress: [
    { name: "Eletrônica Digital", completed: 0, total: 100, color: "#4F46E5", remaining: 100 },
    { name: "Eletrônica Analógica", completed: 0, total: 100, color: "#7C3AED", remaining: 100 },
    { name: "Eletrônica de Potência", completed: 0, total: 100, color: "#EC4899", remaining: 100 },
  ],
  accuracyHistory: [],
  subjectStudyTime: [
    { subject: "Eletrônica Digital", time: 0 },
    { subject: "Eletrônica Analógica", time: 0 },
    { subject: "Eletrônica de Potência", time: 0 },
  ],
  sessionsByDay: [
    { day: "Domingo", count: 0 },
    { day: "Segunda", count: 0 },
    { day: "Terça", count: 0 },
    { day: "Quarta", count: 0 },
    { day: "Quinta", count: 0 },
    { day: "Sexta", count: 0 },
    { day: "Sábado", count: 0 },
  ],
}

const achievements = [
  {
    id: "1",
    title: "Complete 50% de Eletrônica Analógica",
    progress: 0,
    total: 50,
    status: "not-started" as const,
  },
  {
    id: "2",
    title: "Resolva 100 questões",
    progress: 0,
    total: 100,
    status: "not-started" as const,
  },
  {
    id: "3",
    title: "Mantenha uma sequência de estudo de 7 dias",
    progress: 0,
    total: 7,
    status: "not-started" as const,
  },
  {
    id: "4",
    title: "Obtenha 90% de precisão em um quiz de Eletrônica Digital",
    progress: 0,
    total: 90,
    status: "not-started" as const,
  },
]

const nextActivities = [
  {
    id: "1",
    title: "Revisar Amplificadores Operacionais",
    link: "/study/summaries/analog/operational-amplifiers",
    icon: <BookMarked className="h-4 w-4" />,
    subject: "Eletrônica Analógica",
  },
  {
    id: "2",
    title: "Praticar Circuitos Digitais",
    link: "/study/projects/digital/circuits",
    icon: <Lightbulb className="h-4 w-4" />,
    subject: "Eletrônica Digital",
  },
  {
    id: "3",
    title: "Assistir aula sobre Conversores CC-CC",
    link: "/study/video/power/dc-dc-converters",
    icon: <Flame className="h-4 w-4" />,
    subject: "Eletrônica de Potência",
  },
]

// Função para calcular a sequência de estudos atual
const calculateStudyStreak = (days: number[]): number => {
  if (days.length === 0) return 0

  // Ordenar os dias em ordem decrescente (mais recente primeiro)
  const sortedDays = [...days].sort((a, b) => b - a)

  // Obter o dia atual como número de dias desde 1970
  const today = Math.floor(Date.now() / (1000 * 60 * 60 * 24))
  const yesterday = today - 1

  // Verificar se o usuário estudou hoje ou ontem
  const hasStudiedRecently = sortedDays[0] === today || sortedDays[0] === yesterday

  if (!hasStudiedRecently) return 0

  // Calcular a sequência atual
  let streak = 1
  let currentDay = sortedDays[0]

  for (let i = 1; i < sortedDays.length; i++) {
    // Se o próximo dia na lista é exatamente um dia antes do atual
    if (sortedDays[i] === currentDay - 1) {
      streak++
      currentDay = sortedDays[i]
    } else if (sortedDays[i] === currentDay) {
      // Mesmo dia, continua
      continue
    } else {
      // Sequência quebrada
      break
    }
  }

  return streak
}

// Função para calcular a precisão com base em todas as atividades
const calculateOverallAccuracy = async (user_id: string) => {
  try {
    // Verificar se o usuário tem dados de precisão
    const { data: performanceData, error: performanceError } = await supabase
      .from("user_performance")
      .select("accuracy_calibration, last_calibration_date")
      .eq("user_id", user_id)
      .single()

    // Se temos dados de calibração recentes (menos de 24h), usamos eles
    if (
      performanceData?.accuracy_calibration !== undefined &&
      performanceData?.last_calibration_date &&
      isCalibrationRecent(performanceData.last_calibration_date)
    ) {
      console.log("Usando precisão calibrada recente:", performanceData.accuracy_calibration)
      return Math.min(performanceData.accuracy_calibration, 100)
    }

    // Caso contrário, calculamos uma nova precisão
    console.log("Calculando nova precisão...")

    // Fetch quiz results
    const { data: quizData, error: quizError } = await supabase
      .from("quiz_results")
      .select("score, total_questions")
      .eq("user_id", user_id)
      .limit(100)

    // Fetch flashcard results
    const { data: flashcardData, error: flashcardError } = await supabase
      .from("flashcard_results")
      .select("correct_answers, total_cards")
      .eq("user_id", user_id)
      .limit(100)

    // Fetch game results
    const { data: gameData, error: gameError } = await supabase
      .from("game_results")
      .select("accuracy")
      .eq("user_id", user_id)
      .limit(100)

    let totalCorrect = 0
    let totalAttempts = 0

    // Calculate quiz accuracy
    if (quizData && quizData.length > 0) {
      quizData.forEach((quiz) => {
        totalCorrect += quiz.score
        totalAttempts += quiz.total_questions
      })
    }

    // Calculate flashcard accuracy
    if (flashcardData && flashcardData.length > 0) {
      flashcardData.forEach((flashcard) => {
        totalCorrect += flashcard.correct_answers
        totalAttempts += flashcard.total_cards
      })
    }

    // Calculate game accuracy - já vem em percentual (0-100)
    if (gameData && gameData.length > 0) {
      let gameAccuracySum = 0
      gameData.forEach((game) => {
        const gameAccuracy = Math.min(Math.max(game.accuracy, 0), 100)
        gameAccuracySum += gameAccuracy
      })
      const gameAverageAccuracy = gameAccuracySum / gameData.length
      totalCorrect += gameAverageAccuracy
      totalAttempts += 1
    }

    // Calculate overall accuracy -Limitar a 100%
    const overallAccuracy = totalAttempts > 0 ? totalCorrect / totalAttempts : 0
    const cappedAccuracy = Math.min(overallAccuracy, 100)

    // Salvar a nova precisão calibrada
    await saveCalibrationData(user_id, cappedAccuracy)

    return cappedAccuracy
  } catch (error) {
    console.error("Error calculating overall accuracy:", error)
    return 0
  }
}

// Verifica se a calibração é recente (menos de 24 horas)
const isCalibrationRecent = (lastCalibrationDate: string): boolean => {
  const lastCalibration = new Date(lastCalibrationDate)
  const now = new Date()
  const diffHours = (now.getTime() - lastCalibration.getTime()) / (1000 * 60 * 60)
  return diffHours < 24
}

// Salva os dados de calibração
const saveCalibrationData = async (userId: string, accuracy: number) => {
  try {
    const now = new Date().toISOString()

    // Garantir que a precisão não excede 100%
    const cappedAccuracy = Math.min(accuracy, 100)

    // Verificar se o registro já existe
    const { data, error } = await supabase.from("user_performance").select("user_id").eq("user_id", userId).single()

    if (error && error.code !== "PGRST116") {
      console.error("Error checking user performance:", error)
      return
    }

    // Obter histórico de precisão atual
    const { data: historyData } = await supabase
      .from("user_performance")
      .select("accuracy_history")
      .eq("user_id", userId)
      .single()

    // Preparar o novo histórico
    let accuracyHistory = historyData?.accuracy_history || []

    // Adicionar novo ponto de dados ao histórico (com limite de 100%)
    accuracyHistory.push({
      date: now,
      accuracy: cappedAccuracy,
    })

    // Limitar o histórico aos últimos 30 pontos
    if (accuracyHistory.length > 30) {
      accuracyHistory = accuracyHistory.slice(-30)
    }

    // Atualizar ou inserir os dados
    if (data) {
      // Atualizar registro existente
      await supabase
        .from("user_performance")
        .update({
          accuracy_calibration: cappedAccuracy,
          last_calibration_date: now,
          accuracy_history: accuracyHistory,
        })
        .eq("user_id", userId)
    } else {
      // Inserir novo registro
      await supabase.from("user_performance").insert({
        user_id: userId,
        accuracy_calibration: cappedAccuracy,
        last_calibration_date: now,
        accuracy_history: accuracyHistory,
      })
    }
  } catch (error) {
    console.error("Error saving calibration data:", error)
  }
}

const allSubjects = getAllSubjects()
const subjectColors = [
  "#4F46E5",
  "#7C3AED",
  "#EC4899",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
  "#EF4444",
  "#14B8A6",
  "#F97316",
  "#6366F1",
  "#A855F7",
  "#06B6D4",
  "#84CC16",
  "#EAB308",
]

// Função para calcular o progresso das matérias com base no desempenho
const calculateSubjectProgress = async (userId: string) => {
  try {
    // Buscar resultados de quizzes por matéria
    const { data: quizData, error: quizError } = await supabase
      .from("quiz_results")
      .select("subject, score, total_questions")
      .eq("user_id", userId)
      .limit(100)

    // Buscar resultados de flashcards por matéria
    const { data: flashcardData, error: flashcardError } = await supabase
      .from("flashcard_results")
      .select("subject, correct_answers, total_cards")
      .eq("user_id", userId)
      .limit(100)

    const subjects: Record<string, { correct: number; total: number }> = {}
    allSubjects.forEach((subject) => {
      subjects[subject.id] = { correct: 0, total: 0 }
    })

    // Processar dados de quizzes
    if (quizData && quizData.length > 0) {
      quizData.forEach((quiz) => {
        const subject = quiz.subject || allSubjects[0]?.id
        if (subjects[subject]) {
          subjects[subject].correct += quiz.score
          subjects[subject].total += quiz.total_questions
        }
      })
    }

    // Processar dados de flashcards
    if (flashcardData && flashcardData.length > 0) {
      flashcardData.forEach((flashcard) => {
        const subject = flashcard.subject || allSubjects[0]?.id
        if (subjects[subject]) {
          subjects[subject].correct += flashcard.correct_answers
          subjects[subject].total += flashcard.total_cards
        }
      })
    }

    const progress = allSubjects.map((subject, index) => {
      const subjectData = subjects[subject.id]
      const completed =
        subjectData.total > 0 ? Math.min(100, Math.round((subjectData.correct / subjectData.total) * 100)) : 0

      return {
        name: subject.name,
        completed,
        total: 100,
        color: subjectColors[index % subjectColors.length],
        remaining: 100 - completed,
      }
    })

    return progress
  } catch (error) {
    console.error("Error calculating subject progress:", error)
    return initialPerformanceData.subjectProgress
  }
}

// Função para calcular o tempo de estudo por matéria
const calculateSubjectStudyTime = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("study_sessions")
      .select("subject, duration")
      .eq("user_id", userId)
      .limit(100)

    if (error) throw error

    const subjectTimes: Record<string, number> = {}
    allSubjects.forEach((subject) => {
      subjectTimes[subject.id] = 0
    })

    if (data && data.length > 0) {
      data.forEach((session) => {
        const subject = session.subject || allSubjects[0]?.id
        if (subjectTimes[subject] !== undefined) {
          subjectTimes[subject] += session.duration || 0
        }
      })
    }

    return allSubjects.map((subject) => ({
      subject: subject.name,
      time: subjectTimes[subject.id] || 0,
    }))
  } catch (error) {
    console.error("Error calculating subject study time:", error)
    return initialPerformanceData.subjectStudyTime
  }
}

// Substituir a função calculateSessionsByDay por esta versão corrigida:

// Função para calcular atividades por dia da semana
const calculateSessionsByDay = async (userId: string) => {
  try {
    // Inicializar contadores para todos os dias da semana
    const dayCount = [0, 0, 0, 0, 0, 0, 0] // Dom, Seg, Ter, Qua, Qui, Sex, Sáb

    // Buscar todas as atividades do usuário de diferentes tabelas
    const promises = [
      supabase.from("quiz_results").select("created_at").eq("user_id", userId),
      supabase.from("flashcard_results").select("created_at").eq("user_id", userId),
      supabase.from("game_results").select("created_at").eq("user_id", userId),
      supabase.from("study_sessions").select("created_at").eq("user_id", userId),
    ]

    const results = await Promise.all(promises)

    // Processar cada tipo de atividade
    results.forEach((result) => {
      if (result.data && result.data.length > 0) {
        result.data.forEach((item) => {
          if (item.created_at) {
            const date = new Date(item.created_at)
            const dayOfWeek = date.getDay() // 0 = Domingo, 6 = Sábado
            dayCount[dayOfWeek]++
          }
        })
      }
    })

    // Retornar sempre todos os 7 dias da semana
    return [
      { day: "Domingo", count: dayCount[0] },
      { day: "Segunda", count: dayCount[1] },
      { day: "Terça", count: dayCount[2] },
      { day: "Quarta", count: dayCount[3] },
      { day: "Quinta", count: dayCount[4] },
      { day: "Sexta", count: dayCount[5] },
      { day: "Sábado", count: dayCount[6] },
    ]
  } catch (error) {
    console.error("Error calculating activities by day:", error)
    // Em caso de erro, retornar todos os dias com zero
    return [
      { day: "Domingo", count: 0 },
      { day: "Segunda", count: 0 },
      { day: "Terça", count: 0 },
      { day: "Quarta", count: 0 },
      { day: "Quinta", count: 0 },
      { day: "Sexta", count: 0 },
      { day: "Sábado", count: 0 },
    ]
  }
}

// Função para buscar as atividades recentes do usuário
const fetchUserActivities = async (userId: string): Promise<UserActivity[]> => {
  try {
    // Buscar resultados de quizzes
    const { data: quizData, error: quizError } = await supabase
      .from("quiz_results")
      .select("id, quiz_id, score, total_questions, created_at, subject")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5)

    // Buscar resultados de flashcards
    const { data: flashcardData, error: flashcardError } = await supabase
      .from("flashcard_results")
      .select("id, deck_id, correct_answers, total_cards, created_at, subject")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5)

    // Buscar resultados de jogos
    const { data: gameData, error: gameError } = await supabase
      .from("game_results")
      .select("id, game_id, score, accuracy, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5)

    // Buscar sessões de estudo
    const { data: studyData, error: studyError } = await supabase
      .from("study_sessions")
      .select("id, subject, duration, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5)

    // Combinar todos os resultados em um array de atividades
    const activities: UserActivity[] = []

    // Processar resultados de quizzes
    if (quizData && quizData.length > 0) {
      quizData.forEach((quiz) => {
        const accuracy = quiz.total_questions > 0 ? Math.min((quiz.score / quiz.total_questions) * 100, 100) : 0
        activities.push({
          id: `quiz-${quiz.id}`,
          type: "quiz",
          title: `Quiz de ${quiz.subject || "Eletrônica"}`,
          details: `${quiz.score}/${quiz.total_questions} questões corretas`,
          timestamp: quiz.created_at,
          score: quiz.score,
          accuracy: accuracy,
          subject: quiz.subject,
          icon: <BookOpen className="h-5 w-5" />,
          color: "blue",
        })
      })
    }

    // Processar resultados de flashcards
    if (flashcardData && flashcardData.length > 0) {
      flashcardData.forEach((flashcard) => {
        const accuracy =
          flashcard.total_cards > 0 ? Math.min((flashcard.correct_answers / flashcard.total_cards) * 100, 100) : 0
        activities.push({
          id: `flashcard-${flashcard.id}`,
          type: "flashcard",
          title: `Flashcards de ${flashcard.subject || "Eletrônica"}`,
          details: `${flashcard.correct_answers}/${flashcard.total_cards} cartões corretos`,
          timestamp: flashcard.created_at,
          score: flashcard.correct_answers,
          accuracy: accuracy,
          subject: flashcard.subject,
          icon: <Layers className="h-5 w-5" />,
          color: "purple",
        })
      })
    }

    // Processar resultados de jogos
    if (gameData && gameData.length > 0) {
      gameData.forEach((game) => {
        activities.push({
          id: `game-${game.id}`,
          type: "game",
          title: `Jogo Educativo`,
          details: `Pontuação: ${game.score}, Precisão: ${Math.min(Math.round(game.accuracy), 100)}%`,
          timestamp: game.created_at,
          score: game.score,
          accuracy: game.accuracy,
          icon: <Gamepad2 className="h-5 w-5" />,
          color: "green",
        })
      })
    }

    // Processar sessões de estudo
    if (studyData && studyData.length > 0) {
      studyData.forEach((session) => {
        const durationMinutes = Math.round(session.duration / 60)
        activities.push({
          id: `study-${session.id}`,
          type: "study",
          title: `Sessão de Estudo`,
          details: `${durationMinutes} minutos em ${session.subject || "Eletrônica"}`,
          timestamp: session.created_at,
          duration: session.duration,
          subject: session.subject,
          icon: <Clock className="h-5 w-5" />,
          color: "amber",
        })
      })
    }

    // Ordenar todas as atividades por timestamp (mais recente primeiro)
    return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10)
  } catch (error) {
    console.error("Error fetching user activities:", error)
    return []
  }
}

export default function PerformancePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [performanceData, setPerformanceData] = useState<PerformanceData>(initialPerformanceData)
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [overallAccuracy, setOverallAccuracy] = useState<number>(0)
  const [mounted, setMounted] = useState(false)
  const [calibrationStatus, setCalibrationStatus] = useState<"not-calibrated" | "calibrating" | "calibrated">(
    "not-calibrated",
  )
  const [updatedAchievements, setUpdatedAchievements] = useState(achievements)
  const [userActivities, setUserActivities] = useState<UserActivity[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [partialLoading, setPartialLoading] = useState({
    accuracy: true,
    activities: true,
    charts: true,
  })
  const [selfAssessments, setSelfAssessments] = useState<any[]>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      setIsLoading(true)
      try {
        if (!user) {
          setIsLoading(false)
          return
        }

        // Carregamento progressivo - primeiro carregamos os dados básicos
        await fetchPerformanceData()

        // Depois carregamos os dados de precisão em paralelo
        fetchAccuracyData()

        // Carregamos as atividades do usuário
        fetchUserActivitiesData()

        // Atualizamos as conquistas com base nos dados já carregados
        updateAchievements()
      } catch (error) {
        console.error("Auth check or data fetch error:", error)
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao carregar seus dados. Mostrando dados parciais.",
          variant: "destructive",
        })
      } finally {
        // Garantimos que o estado de carregamento seja atualizado mesmo em caso de erro
        setIsLoading(false)
      }
    }

    const loadSelfAssessments = () => {
      try {
        const assessments = JSON.parse(localStorage.getItem("selfAssessments") || "{}")
        const allAssessments = []

        for (const [challengeId, challengeAssessments] of Object.entries(assessments)) {
          if (Array.isArray(challengeAssessments)) {
            challengeAssessments.forEach((assessment: any) => {
              allAssessments.push({
                challengeId,
                ...assessment,
              })
            })
          }
        }

        // Ordenar por data mais recente
        allAssessments.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
        setSelfAssessments(allAssessments.slice(0, 10)) // Últimas 10 avaliações
      } catch (error) {
        console.error("Erro ao carregar autoavaliações:", error)
        setSelfAssessments([])
      }
    }

    if (mounted) {
      checkAuthAndFetchData()
      loadSelfAssessments()
    }
  }, [user, router, mounted])

  const calculateSelfAssessmentMetrics = () => {
    if (selfAssessments.length === 0) {
      return {
        averageUnderstanding: 0,
        averageConfidence: 0,
        totalTimeSpent: 0,
        improvementTrend: 0,
      }
    }

    const totalUnderstanding = selfAssessments.reduce((sum, assessment) => sum + assessment.understanding, 0)
    const totalConfidence = selfAssessments.reduce((sum, assessment) => sum + assessment.confidence, 0)
    const totalTime = selfAssessments.reduce((sum, assessment) => sum + assessment.timeSpent, 0)

    // Calcular tendência de melhoria (últimas 5 vs primeiras 5 avaliações)
    let improvementTrend = 0
    if (selfAssessments.length >= 5) {
      const recent = selfAssessments.slice(0, 5)
      const older = selfAssessments.slice(-5)

      const recentAvg = recent.reduce((sum, a) => sum + a.understanding + a.confidence, 0) / (recent.length * 2)
      const olderAvg = older.reduce((sum, a) => sum + a.understanding + a.confidence, 0) / (older.length * 2)

      improvementTrend = ((recentAvg - olderAvg) / olderAvg) * 100
    }

    return {
      averageUnderstanding: totalUnderstanding / selfAssessments.length,
      averageConfidence: totalConfidence / selfAssessments.length,
      totalTimeSpent: totalTime,
      improvementTrend,
    }
  }

  // Função para carregar dados de precisão separadamente
  const fetchAccuracyData = async () => {
    if (!user) return

    try {
      // Verificar se precisamos calibrar
      const { data } = await supabase
        .from("user_performance")
        .select("accuracy_calibration, last_calibration_date")
        .eq("user_id", user.id)
        .single()

      if (data?.accuracy_calibration !== undefined && data?.last_calibration_date) {
        if (isCalibrationRecent(data.last_calibration_date)) {
          setCalibrationStatus("calibrated")
          setOverallAccuracy(data.accuracy_calibration)
        } else {
          setCalibrationStatus("calibrating")
          const accuracy = await calculateOverallAccuracy(user.id)
          setOverallAccuracy(accuracy)
          setCalibrationStatus("calibrated")
        }
      } else {
        // Primeira calibração
        setCalibrationStatus("calibrating")
        const accuracy = await calculateOverallAccuracy(user.id)
        setOverallAccuracy(accuracy)
        setCalibrationStatus("calibrated")
      }
    } catch (error) {
      console.error("Error fetching accuracy data:", error)
      // Em caso de erro, definimos um valor padrão
      setOverallAccuracy(0)
      setCalibrationStatus("calibrated")
    } finally {
      setPartialLoading((prev) => ({ ...prev, accuracy: false }))
    }
  }

  // Função para carregar atividades do usuário separadamente
  const fetchUserActivitiesData = async () => {
    if (!user) return

    try {
      const activities = await fetchUserActivities(user.id)
      setUserActivities(activities)
    } catch (error) {
      console.error("Error fetching user activities:", error)
      setUserActivities([])
    } finally {
      setPartialLoading((prev) => ({ ...prev, activities: false }))
    }
  }

  const fetchPerformanceData = async () => {
    if (!user) return

    try {
      const { data: performanceData, error: performanceError } = await supabase
        .from("user_performance")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (performanceError) {
        if (performanceError.code === "PGRST116") {
          // Se o registro não existir, criamos um novo com valores padrão
          try {
            const { data: newData, error: insertError } = await supabase
              .from("user_performance")
              .insert({
                user_id: user.id,
                total_study_time: 0,
                study_days: [],
                total_study_days: 0,
                study_streak: 0,
                quiz_attempts: 0,
                quiz_correct_answers: 0,
                flashcard_attempts: 0,
                flashcard_correct_answers: 0,
                game_attempts: 0,
                game_correct_answers: 0,
                total_study_sessions: 0,
                accuracy_calibration: 0,
                last_calibration_date: new Date().toISOString(),
                accuracy_history: [],
              })
              .select()
              .single()

            if (insertError) throw insertError

            if (newData) {
              setPerformanceData((prev) => ({
                ...prev,
                ...newData,
                studyDays: [],
                studyStreak: 0,
                accuracyHistory: [],
              }))
            }
          } catch (insertErr) {
            console.error("Error creating new performance record:", insertErr)
            // Usamos os dados iniciais como fallback
            setPerformanceData(initialPerformanceData)
          }
        } else {
          console.error("Error fetching performance data:", performanceError)
          // Usamos os dados iniciais como fallback
          setPerformanceData(initialPerformanceData)
        }
      } else if (performanceData) {
        // Processamento paralelo para melhorar o desempenho
        const [subjectProgress, subjectStudyTime, sessionsByDay] = await Promise.allSettled([
          calculateSubjectProgress(user.id),
          calculateSubjectStudyTime(user.id),
          calculateSessionsByDay(user.id),
        ])

        // Calcular sequência de estudos atual
        const currentStreak = calculateStudyStreak(performanceData.study_days || [])

        setPerformanceData((prev) => ({
          ...prev,
          totalStudyTime: performanceData.total_study_time || 0,
          studyDays: performanceData.study_days || [],
          quizAttempts: performanceData.quiz_attempts || 0,
          quizCorrectAnswers: performanceData.quiz_correct_answers || 0,
          flashcardAttempts: performanceData.flashcard_attempts || 0,
          flashcardCorrectAnswers: performanceData.flashcard_correct_answers || 0,
          gameAttempts: performanceData.game_attempts || 0,
          gameCorrectAnswers: performanceData.game_correct_answers || 0,
          totalStudySessions: performanceData.total_study_sessions || 0,
          studyStreak: currentStreak,
          accuracyHistory: performanceData.accuracy_history || [],
          lastCalibrationDate: performanceData.last_calibration_date,
          subjectProgress:
            subjectProgress.status === "fulfilled" ? subjectProgress.value : initialPerformanceData.subjectProgress,
          subjectStudyTime:
            subjectStudyTime.status === "fulfilled" ? subjectStudyTime.value : initialPerformanceData.subjectStudyTime,
          sessionsByDay:
            sessionsByDay.status === "fulfilled" ? sessionsByDay.value : initialPerformanceData.sessionsByDay,
        }))
      }
    } catch (error) {
      console.error("Error in fetchPerformanceData:", error)
      // Em caso de erro, usamos os dados iniciais como fallback
      setPerformanceData(initialPerformanceData)
    } finally {
      setPartialLoading((prev) => ({ ...prev, charts: false }))
    }
  }

  // Atualizar conquistas com base nos dados de desempenho
  const updateAchievements = () => {
    const newAchievements = [...achievements]

    // Conquista 1: Complete 50% de Eletrônica Analógica
    const analogProgress = performanceData.subjectProgress.find((s) => s.name === "Eletrônica Analógica")
    if (analogProgress) {
      newAchievements[0].progress = analogProgress.completed
      newAchievements[0].status =
        analogProgress.completed >= 50 ? "completed" : analogProgress.completed > 0 ? "in-progress" : "not-started"
    }

    // Conquista 2: Resolva 100 questões
    const totalQuestions = performanceData.quizAttempts
    newAchievements[1].progress = totalQuestions
    newAchievements[1].status = totalQuestions >= 100 ? "completed" : totalQuestions > 0 ? "in-progress" : "not-started"

    // Conquista 3: Mantenha uma sequência de estudo de 7 dias
    newAchievements[2].progress = performanceData.studyStreak
    newAchievements[2].status =
      performanceData.studyStreak >= 7 ? "completed" : performanceData.studyStreak > 0 ? "in-progress" : "not-started"

    // Conquista 4: Obtenha 90% de precisão em um quiz de Eletrônica Digital
    // Aqui precisaríamos de dados específicos de quizzes de Eletrônica Digital

    // Por enquanto, usamos a precisão geral como aproximação
    newAchievements[3].progress = Math.round(overallAccuracy)
    newAchievements[3].status =
      overallAccuracy >= 90 ? "completed" : overallAccuracy > 0 ? "in-progress" : "not-started"

    setUpdatedAchievements(newAchievements)
  }

  const handleStartStudy = () => {
    router.push("/study")
  }

  const formatTime = (seconds: number) => {
    if (seconds === 0) return "0h 0m"

    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (hours === 0) {
      return `${minutes}m`
    } else if (minutes === 0) {
      return `${hours}h`
    } else {
      return `${hours}h ${minutes}m`
    }
  }

  // Adaptar calculateMasteredSubjects para usar todas as matérias do currículo
  const calculateMasteredSubjects = () => {
    return performanceData.subjectProgress.filter((subject) => subject.completed >= 90).length
  }

  // Formata a data de calibração para exibição
  const formatCalibrationDate = (dateString?: string) => {
    if (!dateString) return "Nunca calibrado"

    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!mounted) {
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <TopNav />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Carregando...</p>
          </div>
        </main>
        <BottomNav active="performance" />
      </div>
    )
  }

  if (!user) {
    return <RestrictedAccess activeNavItem="performance" />
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <TopNav />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Cabeçalho com título e botão de iniciar estudo */}
        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold">Desempenho</h1>
            <p className="text-gray-500 text-sm">Acompanhe seu progresso e atividades</p>
          </div>
          <button
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
            onClick={handleStartStudy}
          >
            Iniciar Estudo
          </button>
        </div>

        {/* Tabs para organizar o conteúdo */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Visão Geral</span>
            </TabsTrigger>
            <TabsTrigger value="subjects" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              <span className="hidden sm:inline">Matérias</span>
            </TabsTrigger>
            <TabsTrigger value="activities" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Atividades</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Conquistas</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab: Visão Geral */}
          <TabsContent value="overview" className="space-y-6">
            {/* Métricas principais */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <MetricsCard
                title="Tempo de Estudo"
                value={formatTime(performanceData.totalStudyTime)}
                tooltip="Tempo total dedicado aos estudos"
                icon={<Clock className="h-5 w-5 text-blue-500" />}
              />
              <MetricsCard
                title="Precisão"
                value={partialLoading.accuracy ? "--" : overallAccuracy.toFixed(1) + "%"}
                tooltip={`Média de acertos em atividades`}
                icon={<Target className="h-5 w-5 text-purple-500" />}
                status={partialLoading.accuracy || calibrationStatus === "calibrating" ? "loading" : undefined}
              />
              <MetricsCard
                title="Sessões"
                value={performanceData.totalStudySessions.toString()}
                tooltip="Número total de sessões de estudo"
                icon={<Zap className="h-5 w-5 text-yellow-500" />}
              />
              <MetricsCard
                title="Matérias Dominadas"
                value={calculateMasteredSubjects().toString()}
                tooltip="Matérias com mais de 90% de aproveitamento"
                icon={<Award className="h-5 w-5 text-green-500" />}
              />
              <MetricsCard
                title="Dias de Estudo"
                value={performanceData.studyDays.length.toString()}
                tooltip="Total de dias de estudo"
                icon={<Calendar className="h-5 w-5 text-red-500" />}
              />
              <MetricsCard
                title="Sequência"
                value={performanceData.studyStreak.toString()}
                tooltip="Dias consecutivos de estudo"
                icon={<Flame className="h-5 w-5 text-orange-500" />}
              />
            </div>

            {/* Gráficos principais */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Progresso por matéria */}
              <Card className="overflow-hidden border border-gray-200 shadow-sm">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      Progresso por Matéria
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="h-[600px]">
                    {partialLoading.charts ? (
                      <div className="flex items-center justify-center h-[600px]">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={performanceData.subjectProgress}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                          <XAxis type="number" domain={[0, 100]} />
                          <YAxis dataKey="name" type="category" width={200} />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload
                                return (
                                  <div className="bg-white p-2 border rounded shadow">
                                    <p className="font-semibold">{data.name}</p>
                                    <p>Progresso: {data.completed}%</p>
                                    <p>Restante: {data.total - data.completed}%</p>
                                  </div>
                                )
                              }
                              return null
                            }}
                          />
                          <Bar dataKey="completed" stackId="a" fill="#4F46E5">
                            {performanceData.subjectProgress.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                            <LabelList dataKey="completed" position="inside" fill="#ffffff" />
                          </Bar>
                          <Bar dataKey="remaining" stackId="a" fill="#E5E7EB">
                            {performanceData.subjectProgress.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={`${entry.color}33`} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Distribuição do tempo de estudo */}
              <Card className="overflow-hidden border border-gray-200 shadow-sm">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-purple-500" />
                      Distribuição do Tempo
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="h-[500px]">
                    {partialLoading.charts ? (
                      <div className="flex items-center justify-center h-[500px]">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={performanceData.subjectStudyTime.map((item, index) => ({
                              name: item.subject,
                              value: item.time,
                              color: subjectColors[index % subjectColors.length],
                            }))}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {performanceData.subjectStudyTime.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={subjectColors[index % subjectColors.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0]
                                return (
                                  <div className="bg-white p-2 border rounded shadow">
                                    <p className="font-semibold">{data.name}</p>
                                    <p>Tempo: {data.value} min</p>
                                  </div>
                                )
                              }
                              return null
                            }}
                          />
                          <Legend verticalAlign="bottom" height={36} />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Histórico de precisão e Sessões por dia */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Histórico de precisão */}
              {performanceData.accuracyHistory && performanceData.accuracyHistory.length > 0 && (
                <Card className="overflow-hidden border border-gray-200 shadow-sm">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <LineChart2 className="h-5 w-5 text-green-500" />
                        Histórico de Precisão
                      </CardTitle>
                    </div>
                    <CardDescription className="text-xs text-gray-500">
                      Última calibração: {formatCalibrationDate(performanceData.lastCalibrationDate)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="h-[250px]">
                      {partialLoading.charts ? (
                        <div className="flex items-center justify-center h-[250px]">
                          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={performanceData.accuracyHistory.map((item) => ({
                              date: new Date(item.date).toLocaleDateString("pt-BR"),
                              accuracy: item.accuracy,
                            }))}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="date"
                              tick={{ fontSize: 12 }}
                              tickFormatter={(value) => value.split("/").slice(0, 2).join("/")}
                            />
                            <YAxis domain={[0, 100]} />
                            <Tooltip
                              formatter={(value) => [`${Math.min(Number(value).toFixed(1), 100)}%`, "Precisão"]}
                              labelFormatter={(label) => `Data: ${label}`}
                            />
                            <Line
                              type="monotone"
                              dataKey="accuracy"
                              stroke="#10B981"
                              strokeWidth={2}
                              dot={{ r: 4 }}
                              activeDot={{ r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Sessões por dia da semana */}
              <Card className="overflow-hidden border border-gray-200 shadow-sm">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-amber-500" />
                      Atividades por Dia
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="h-[250px]">
                    {partialLoading.charts ? (
                      <div className="flex items-center justify-center h-[250px]">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={performanceData.sessionsByDay}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" name="Atividades" fill="#F59E0B" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab: Matérias */}
          <TabsContent value="subjects" className="space-y-6">
            {/* Seletor de matéria */}
            <Card className="overflow-hidden border border-gray-200 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-indigo-500" />
                  Análise por Matéria
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-full md:w-[300px]">
                    <SelectValue placeholder="Selecione uma matéria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as matérias</SelectItem>
                    {/* Renderizar opções para todas as matérias do currículo */}
                    {allSubjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  {selectedSubject === "all" ? (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Visão Geral de Todas as Matérias</h3>
                      <p className="text-gray-600 mb-4">
                        Aqui você pode ver uma análise comparativa de seu desempenho em todas as matérias.
                      </p>

                      <div className="grid gap-4 md:grid-cols-3">
                        {performanceData.subjectProgress.map((subject, index) => (
                          <div
                            key={index}
                            className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                          >
                            <h4 className="font-medium text-gray-900">{subject.name}</h4>
                            <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className="h-2.5 rounded-full"
                                style={{ width: `${subject.completed}%`, backgroundColor: subject.color }}
                              ></div>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                              Progresso: <span className="font-medium">{subject.completed}%</span>
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Análise de {allSubjects.find((s) => s.id === selectedSubject)?.name || "Matéria Selecionada"}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Aqui você pode ver uma análise detalhada de seu desempenho nesta matéria específica.
                      </p>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <h4 className="font-medium text-gray-900 mb-2">Estatísticas</h4>
                          <ul className="space-y-2">
                            <li className="flex justify-between">
                              <span className="text-gray-600">Tempo de estudo:</span>
                              <span className="font-medium">
                                {formatTime(
                                  performanceData.subjectStudyTime.find(
                                    (s) => s.subject === allSubjects.find((sub) => sub.id === selectedSubject)?.name,
                                  )?.time || 0,
                                )}
                              </span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-gray-600">Progresso:</span>
                              <span className="font-medium">
                                {
                                  performanceData.subjectProgress.find(
                                    (s) => s.name === allSubjects.find((sub) => sub.id === selectedSubject)?.name,
                                  )?.completed
                                }
                                %
                              </span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-gray-600">Sessões:</span>
                              <span className="font-medium">12</span>{" "}
                              {/* Este valor precisa ser calculado dinamicamente */}
                            </li>
                            <li className="flex justify-between">
                              <span className="text-gray-600">Quizzes completados:</span>
                              <span className="font-medium">8</span>{" "}
                              {/* Este valor precisa ser calculado dinamicamente */}
                            </li>
                          </ul>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <h4 className="font-medium text-gray-900 mb-2">Recomendações</h4>
                          <ul className="space-y-2">
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              <span className="text-gray-600">Revisar conceitos básicos</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                              <span className="text-gray-600">Praticar mais exercícios</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                              <span className="text-gray-600">Assistir vídeo-aulas complementares</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contador de dias de estudo */}
            <Card className="overflow-hidden border border-gray-200 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-red-500" />
                  Dias de Estudo
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <StudyDayTracker />
              </CardContent>
            </Card>

            {/* Próximas atividades */}
            <Card className="overflow-hidden border border-gray-200 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-emerald-500" />
                  Próximas Atividades Recomendadas
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid gap-3 md:grid-cols-3">
                  {nextActivities.map((activity) => (
                    <Link
                      key={activity.id}
                      href={activity.link}
                      className="flex flex-col p-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 rounded-full bg-blue-100 text-blue-600">{activity.icon}</div>
                        <span className="text-xs text-gray-500">{activity.subject}</span>
                      </div>
                      <p className="font-medium text-gray-900">{activity.title}</p>
                      <div className="mt-auto pt-2 flex justify-end">
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Atividades */}
          <TabsContent value="activities" className="space-y-6">
            {/* Atividades recentes */}
            <Card className="overflow-hidden border border-gray-200 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-blue-500" />
                  Atividades Recentes
                </CardTitle>
                <CardDescription className="text-xs text-gray-500">
                  Suas últimas interações na plataforma
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                {partialLoading.activities ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : userActivities.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ClipboardList className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>Nenhuma atividade registrada ainda.</p>
                    <p className="text-sm mt-1">
                      Complete questionários, flashcards ou jogos para ver seu histórico aqui.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    {userActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-gray-50 border border-gray-200"
                      >
                        <div
                          className={`p-2 rounded-full flex-shrink-0`}
                          style={{
                            backgroundColor:
                              activity.type === "quiz"
                                ? "#EFF6FF"
                                : activity.type === "flashcard"
                                  ? "#F5F3FF"
                                  : activity.type === "game"
                                    ? "#ECFDF5"
                                    : "#FEF3C7",
                            color:
                              activity.type === "quiz"
                                ? "#2563EB"
                                : activity.type === "flashcard"
                                  ? "#7C3AED"
                                  : activity.type === "game"
                                    ? "#10B981"
                                    : "#F59E0B",
                          }}
                        >
                          {activity.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <p className="font-medium truncate">{activity.title}</p>
                            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                              {new Date(activity.timestamp).toLocaleDateString("pt-BR")}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">{activity.details}</p>
                          {activity.accuracy !== undefined && (
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                              <div
                                className={`h-1.5 rounded-full ${
                                  activity.accuracy >= 80
                                    ? "bg-green-500"
                                    : activity.accuracy >= 60
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                }`}
                                style={{ width: `${Math.min(100, Math.max(0, activity.accuracy))}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <button
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center justify-center w-full"
                    onClick={() => router.push("/account")}
                  >
                    Ver histórico completo
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Conquistas */}
          <TabsContent value="achievements" className="space-y-6">
            {/* Conquistas */}
            <Card className="overflow-hidden border border-gray-200 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50 pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Conquistas
                </CardTitle>
                <CardDescription className="text-xs text-gray-500">
                  Acompanhe seu progresso nas conquistas
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {updatedAchievements.map((achievement) => (
                    <AchievementItem key={achievement.id} achievement={achievement} />
                  ))}
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Complete conquistas para desbloquear novos recursos e reconhecimentos.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="self-assessment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Resumo das Autoavaliações
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selfAssessments.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {calculateSelfAssessmentMetrics().averageUnderstanding.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-600">Compreensão Média</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {calculateSelfAssessmentMetrics().averageConfidence.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-600">Confiança Média</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {calculateSelfAssessmentMetrics().totalTimeSpent}
                      </div>
                      <div className="text-sm text-gray-600">Minutos Totais</div>
                    </div>
                    <div className="text-center p-4 bg-amber-50 rounded-lg">
                      <div
                        className={`text-2xl font-bold ${
                          calculateSelfAssessmentMetrics().improvementTrend >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {calculateSelfAssessmentMetrics().improvementTrend >= 0 ? "+" : ""}
                        {calculateSelfAssessmentMetrics().improvementTrend.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">Tendência</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma autoavaliação registrada ainda.</p>
                    <p className="text-sm">Complete desafios de autoavaliação para ver seu progresso aqui.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {selfAssessments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Autoavaliações</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selfAssessments.map((assessment, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">Desafio #{assessment.challengeId}</h4>
                            <p className="text-sm text-gray-500">
                              {new Date(assessment.completedAt).toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                          <Badge variant="outline">{assessment.timeSpent} min</Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Compreensão:</span>
                            <div className="flex items-center gap-1 mt-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= assessment.understanding ? "text-yellow-400 fill-current" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">Dificuldade:</span>
                            <div className="flex items-center gap-1 mt-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= assessment.difficulty ? "text-red-400 fill-current" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">Confiança:</span>
                            <div className="flex items-center gap-1 mt-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= assessment.confidence ? "text-green-400 fill-current" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="subjects">Matérias</TabsTrigger>
            <TabsTrigger value="activities">Atividades</TabsTrigger>
            <TabsTrigger value="self-assessment" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Autoavaliações</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </main>

      <BottomNav active="performance" />
    </div>
  )
}
