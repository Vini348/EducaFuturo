"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/authContext"
import { supabase } from "@/lib/supabaseClient"
import { toast } from "@/components/ui/use-toast"
import { addPoints } from "@/lib/points-system"
import {
  CheckCircle2,
  Calendar,
  RefreshCw,
  LightbulbIcon,
  BookOpen,
  Brain,
  Zap,
  Play,
  Clock,
  Target,
  Star,
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SelfAssessmentModal, type SelfAssessmentData } from "@/components/self-assessment-modal"

interface ChallengeVerification {
  type: "quiz" | "flashcard" | "reading" | "practice" | "reflection"
  requiredActions: string[]
  completedActions: string[]
  verificationMethod: "activity" | "time" | "interaction" | "performance"
  minimumRequirement: number
  currentProgress: number
  timeSpent: number
  startTime?: number
}

interface Challenge {
  id: string
  title: string
  description: string
  type: "quiz" | "flashcard" | "reading" | "practice" | "reflection"
  icon: string
  completed: boolean
  verification: ChallengeVerification
  progress: number
  startTime?: number
  completionEvidence?: any
  estimatedTime: number // Tempo estimado para conclusão
  difficulty: "easy" | "medium" | "hard" // Nível de dificuldade
}

const verificationSystem = {
  trackActivity: (challengeId: string, activityType: string, data: any) => {
    const storageKey = `challenge_verification_${challengeId}`
    const existing = JSON.parse(localStorage.getItem(storageKey) || "{}")

    existing[activityType] = {
      ...existing[activityType],
      timestamp: Date.now(),
      data: data,
    }

    const progress = verificationSystem.calculateProgress(challengeId, activityType, data)
    existing.currentProgress = progress

    localStorage.setItem(storageKey, JSON.stringify(existing))

    window.dispatchEvent(
      new CustomEvent("challengeProgressUpdate", {
        detail: { challengeId, progress, activityType, data },
      }),
    )
  },

  calculateProgress: (challengeId: string, activityType: string, data: any): number => {
    const storageKey = `challenge_verification_${challengeId}`
    const evidence = JSON.parse(localStorage.getItem(storageKey) || "{}")

    switch (activityType) {
      case "quizCompleted":
        return Math.min((data.questionsAnswered / 5) * 100, 100)
      case "flashcardsReviewed":
        return Math.min((data.flashcardsReviewed / 20) * 100, 100)
      case "readingActivity":
        const timeProgress = Math.min((data.timeSpent / 1200000) * 50, 50) // 20 min = 50%
        const interactionProgress = Math.min((data.pageInteractions / 10) * 50, 50) // 10 interactions = 50%
        return timeProgress + interactionProgress
      case "exercisesCompleted":
        return Math.min((data.exercisesCompleted / 5) * 100, 100)
      case "reflectionWritten":
        const textProgress = Math.min((data.textWritten / 200) * 50, 50) // 200 chars = 50%
        const timeReflectionProgress = Math.min((data.timeSpent / 600000) * 50, 50) // 10 min = 50%
        return textProgress + timeReflectionProgress
      default:
        return 0
    }
  },

  verifyChallengeCompletion: (challenge: Challenge): boolean => {
    const storageKey = `challenge_verification_${challenge.id}`
    const evidence = JSON.parse(localStorage.getItem(storageKey) || "{}")

    switch (challenge.type) {
      case "quiz":
        return evidence.quizCompleted && evidence.questionsAnswered >= 5 && evidence.timeSpent >= 120000

      case "flashcard":
        return evidence.flashcardsReviewed >= 20 && evidence.timeSpent >= 300000

      case "reading":
        return evidence.timeSpent >= 1200000 && evidence.pageInteractions >= 10

      case "practice":
        return evidence.exercisesCompleted >= 5 && evidence.timeSpent >= 600000

      case "reflection":
        return evidence.textWritten >= 200 && evidence.timeSpent >= 600000

      default:
        return false
    }
  },

  startChallengeTracking: (challengeId: string, type: string) => {
    const storageKey = `challenge_verification_${challengeId}`
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        startTime: Date.now(),
        type: type,
        interactions: 0,
        currentProgress: 0,
      }),
    )
  },

  getCurrentProgress: (challengeId: string): number => {
    const storageKey = `challenge_verification_${challengeId}`
    const evidence = JSON.parse(localStorage.getItem(storageKey) || "{}")
    return evidence.currentProgress || 0
  },
}

function generateDailyChallenges(date: Date, seed: number): Challenge[] {
  const day = date.getDay()
  const dayOfMonth = date.getDate()

  const quizChallenges = [
    {
      title: "Quiz Rápido",
      description: "Complete um quiz de 5 questões em qualquer matéria",
      estimatedTime: 10,
      difficulty: "easy" as const,
    },
    {
      title: "Desafio de Tempo",
      description: "Complete um quiz com tempo limitado de 10 minutos",
      estimatedTime: 10,
      difficulty: "medium" as const,
    },
    {
      title: "Revisão Específica",
      description: "Faça um quiz sobre o tema que você estudou ontem",
      estimatedTime: 15,
      difficulty: "medium" as const,
    },
    {
      title: "Quiz Difícil",
      description: "Tente um quiz de nível avançado e acerte pelo menos 70%",
      estimatedTime: 20,
      difficulty: "hard" as const,
    },
    {
      title: "Maratona de Questões",
      description: "Responda 15 questões de múltipla escolha",
      estimatedTime: 25,
      difficulty: "hard" as const,
    },
  ]

  const flashcardChallenges = [
    {
      title: "Revisão de Flashcards",
      description: "Revise 20 flashcards de qualquer matéria",
      estimatedTime: 15,
      difficulty: "easy" as const,
    },
    {
      title: "Crie Novos Flashcards",
      description: "Crie 5 novos flashcards sobre um tema difícil",
      estimatedTime: 20,
      difficulty: "medium" as const,
    },
    {
      title: "Flashcards Difíceis",
      description: "Revise os flashcards que você errou anteriormente",
      estimatedTime: 25,
      difficulty: "hard" as const,
    },
    {
      title: "Estudo Espaçado",
      description: "Revise flashcards que você não vê há mais de uma semana",
      estimatedTime: 20,
      difficulty: "medium" as const,
    },
    {
      title: "Flashcards Rápidos",
      description: "Complete uma sessão de flashcards em menos de 10 minutos",
      estimatedTime: 10,
      difficulty: "easy" as const,
    },
  ]

  const readingChallenges = [
    {
      title: "Leitura Focada",
      description: "Leia um resumo ou artigo por 20 minutos sem distrações",
      estimatedTime: 20,
      difficulty: "easy" as const,
    },
    {
      title: "Anotações Ativas",
      description: "Faça anotações detalhadas enquanto lê um material",
      estimatedTime: 30,
      difficulty: "medium" as const,
    },
    {
      title: "Leitura Complementar",
      description: "Leia sobre um tópico relacionado ao que você está estudando",
      estimatedTime: 25,
      difficulty: "medium" as const,
    },
    {
      title: "Resumo de Capítulo",
      description: "Leia e faça um resumo de um capítulo do seu material",
      estimatedTime: 35,
      difficulty: "hard" as const,
    },
    {
      title: "Leitura Técnica",
      description: "Leia um artigo técnico ou científico sobre sua área",
      estimatedTime: 30,
      difficulty: "hard" as const,
    },
  ]

  const practiceChallenges = [
    {
      title: "Exercícios Práticos",
      description: "Resolva 5 exercícios práticos de qualquer matéria",
      estimatedTime: 20,
      difficulty: "easy" as const,
    },
    {
      title: "Problema Desafiador",
      description: "Resolva um problema complexo que exija mais tempo",
      estimatedTime: 30,
      difficulty: "hard" as const,
    },
    {
      title: "Prática Cronometrada",
      description: "Resolva exercícios com tempo limitado, simulando prova",
      estimatedTime: 25,
      difficulty: "medium" as const,
    },
    {
      title: "Revisão de Erros",
      description: "Refaça exercícios que você errou anteriormente",
      estimatedTime: 20,
      difficulty: "medium" as const,
    },
    {
      title: "Aplicação Prática",
      description: "Aplique um conceito teórico em um problema do mundo real",
      estimatedTime: 35,
      difficulty: "hard" as const,
    },
  ]

  const reflectionChallenges = [
    {
      title: "Reflexão de Aprendizado",
      description: "Escreva sobre o que você aprendeu hoje por 10 minutos",
      estimatedTime: 15,
      difficulty: "easy" as const,
    },
    {
      title: "Mapa Mental",
      description: "Crie um mapa mental conectando conceitos que você estudou",
      estimatedTime: 25,
      difficulty: "medium" as const,
    },
    {
      title: "Ensine Alguém",
      description: "Explique um conceito para outra pessoa ou escreva como explicaria",
      estimatedTime: 20,
      difficulty: "medium" as const,
    },
    {
      title: "Autoavaliação",
      description: "Identifique seus pontos fortes e fracos no conteúdo atual",
      estimatedTime: 15,
      difficulty: "easy" as const,
    },
    {
      title: "Conexões de Conteúdo",
      description: "Relacione o que você está estudando com outros temas",
      estimatedTime: 20,
      difficulty: "medium" as const,
    },
  ]

  const selectChallenge = (list: any[], index: number) => {
    const adjustedIndex = (index + seed + dayOfMonth) % list.length
    return list[adjustedIndex]
  }

  const totalChallenges = ((day + seed + dayOfMonth) % 3) + 3
  const challenges: Challenge[] = []

  challenges.push({
    id: `quiz-${day}-${dayOfMonth}-${seed}`,
    ...selectChallenge(quizChallenges, day),
    type: "quiz",
    icon: "quiz",
    completed: false,
    verification: {
      type: "quiz",
      requiredActions: ["start_quiz", "answer_questions", "complete_quiz"],
      completedActions: [],
      verificationMethod: "performance",
      minimumRequirement: 5,
      currentProgress: 0,
      timeSpent: 0,
    },
    progress: 0,
    estimatedTime: selectChallenge(quizChallenges, day).estimatedTime,
    difficulty: selectChallenge(quizChallenges, day).difficulty,
  })

  challenges.push({
    id: `flashcard-${day}-${dayOfMonth}-${seed}`,
    ...selectChallenge(flashcardChallenges, day + 1),
    type: "flashcard",
    icon: "flashcard",
    completed: false,
    verification: {
      type: "flashcard",
      requiredActions: ["start_session", "review_cards", "complete_session"],
      completedActions: [],
      verificationMethod: "activity",
      minimumRequirement: 20,
      currentProgress: 0,
      timeSpent: 0,
    },
    progress: 0,
    estimatedTime: selectChallenge(flashcardChallenges, day + 1).estimatedTime,
    difficulty: selectChallenge(flashcardChallenges, day + 1).difficulty,
  })

  const remainingTypes = ["reading", "practice", "reflection"]
  for (let i = 0; i < totalChallenges - 2; i++) {
    const typeIndex = (day + i + seed) % remainingTypes.length
    const type = remainingTypes[typeIndex] as "reading" | "practice" | "reflection"

    let challengeList
    switch (type) {
      case "reading":
        challengeList = readingChallenges
        break
      case "practice":
        challengeList = practiceChallenges
        break
      case "reflection":
        challengeList = reflectionChallenges
        break
      default:
        challengeList = readingChallenges
    }

    const selectedChallenge = selectChallenge(challengeList, day + i)

    challenges.push({
      id: `${type}-${day}-${dayOfMonth}-${i}-${seed}`,
      ...selectedChallenge,
      type,
      icon: type,
      completed: false,
      verification: {
        type,
        requiredActions: [],
        completedActions: [],
        verificationMethod: "activity",
        minimumRequirement: type === "reading" ? 20 : 5,
        currentProgress: 0,
        timeSpent: 0,
      },
      progress: 0,
      estimatedTime: selectedChallenge.estimatedTime,
      difficulty: selectedChallenge.difficulty,
    })
  }

  return challenges
}

export function DailyChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [todayCompleted, setTodayCompleted] = useState(false)
  const today = new Date()
  const { user } = useAuth()

  const CHALLENGES_STORAGE_KEY = "educaFuturo_dailyChallenges"

  const [challengeProgress, setChallengeProgress] = useState<{ [key: string]: number }>({})
  const [verificationStatus, setVerificationStatus] = useState<{ [key: string]: boolean }>({})
  const [challengeStartTimes, setChallengeStartTimes] = useState<{ [key: string]: number }>({})

  const [selfAssessmentModal, setSelfAssessmentModal] = useState<{
    isOpen: boolean
    challengeId: string
    challengeTitle: string
  }>({
    isOpen: false,
    challengeId: "",
    challengeTitle: "",
  })

  useEffect(() => {
    if (user) {
      loadChallenges()
    } else {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    const handleProgressUpdate = (event: CustomEvent) => {
      const { challengeId, progress } = event.detail
      setChallengeProgress((prev) => ({
        ...prev,
        [challengeId]: progress,
      }))

      if (progress >= 100) {
        setVerificationStatus((prev) => ({
          ...prev,
          [challengeId]: true,
        }))
      }
    }

    const handleQuizActivity = (event: CustomEvent) => {
      const { challengeId, questionsAnswered, timeSpent, completed } = event.detail
      verificationSystem.trackActivity(challengeId, "quizCompleted", {
        questionsAnswered,
        timeSpent,
        completed,
      })
    }

    const handleFlashcardActivity = (event: CustomEvent) => {
      const { challengeId, cardsReviewed, timeSpent } = event.detail
      verificationSystem.trackActivity(challengeId, "flashcardsReviewed", {
        flashcardsReviewed: cardsReviewed,
        timeSpent,
      })
    }

    const handleReadingActivity = (event: CustomEvent) => {
      const { challengeId, timeSpent, interactions } = event.detail
      verificationSystem.trackActivity(challengeId, "readingActivity", {
        timeSpent,
        pageInteractions: interactions,
      })
    }

    window.addEventListener("challengeProgressUpdate", handleProgressUpdate as EventListener)
    window.addEventListener("quizActivity", handleQuizActivity as EventListener)
    window.addEventListener("flashcardActivity", handleFlashcardActivity as EventListener)
    window.addEventListener("readingActivity", handleReadingActivity as EventListener)

    return () => {
      window.removeEventListener("challengeProgressUpdate", handleProgressUpdate as EventListener)
      window.removeEventListener("quizActivity", handleQuizActivity as EventListener)
      window.removeEventListener("flashcardActivity", handleFlashcardActivity as EventListener)
      window.removeEventListener("readingActivity", handleReadingActivity as EventListener)
    }
  }, [])

  const loadChallenges = async () => {
    if (!user) return

    setIsLoading(true)

    try {
      const currentDate = new Date()
      currentDate.setHours(0, 0, 0, 0)

      const storedData = localStorage.getItem(CHALLENGES_STORAGE_KEY)
      let storedChallenges: { date: string; challenges: Challenge[]; completed: boolean } | null = null

      if (storedData) {
        storedChallenges = JSON.parse(storedData)
        const storedDate = new Date(storedChallenges.date)
        storedDate.setHours(0, 0, 0, 0)

        if (storedDate.getTime() === currentDate.getTime()) {
          setChallenges(storedChallenges.challenges)
          setTodayCompleted(storedChallenges.completed)
          updateProgress(storedChallenges.challenges)

          const progressData: { [key: string]: number } = {}
          storedChallenges.challenges.forEach((challenge) => {
            const currentProgress = verificationSystem.getCurrentProgress(challenge.id)
            progressData[challenge.id] = currentProgress
          })
          setChallengeProgress(progressData)

          setIsLoading(false)
          return
        }
      }

      const seed = Number.parseInt(user.id.substring(0, 8), 16) % 1000
      const newChallenges = generateDailyChallenges(currentDate, seed)

      const { data: performanceData } = await supabase
        .from("user_performance")
        .select("study_days")
        .eq("user_id", user.id)
        .single()

      const studyDays = performanceData?.study_days || []
      const dateString = format(currentDate, "yyyy-MM-dd")
      const isDayCompleted = studyDays.includes(dateString)

      if (isDayCompleted) {
        newChallenges.forEach((challenge) => (challenge.completed = true))
        setTodayCompleted(true)
      } else {
        setTodayCompleted(false)
      }

      setChallenges(newChallenges)
      updateProgress(newChallenges)

      localStorage.setItem(
        CHALLENGES_STORAGE_KEY,
        JSON.stringify({
          date: currentDate.toISOString(),
          challenges: newChallenges,
          completed: isDayCompleted,
        }),
      )
    } catch (error) {
      console.error("Erro ao carregar desafios:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os desafios diários",
        variant: "destructive",
      })

      const seed = new Date().getDate()
      const fallbackChallenges = generateDailyChallenges(new Date(), seed)
      setChallenges(fallbackChallenges)
      updateProgress(fallbackChallenges)
    } finally {
      setIsLoading(false)
    }
  }

  const updateProgress = (currentChallenges: Challenge[]) => {
    if (currentChallenges.length === 0) {
      setProgress(0)
      return
    }

    const completedCount = currentChallenges.filter((c) => c.completed).length
    const newProgress = Math.round((completedCount / currentChallenges.length) * 100)
    setProgress(newProgress)
  }

  const toggleChallenge = async (id: string) => {
    if (isLoading || todayCompleted) return

    const challenge = challenges.find((c) => c.id === id)
    if (!challenge) return

    if (challenge.title === "Autoavaliação" && !challenge.completed) {
      setSelfAssessmentModal({
        isOpen: true,
        challengeId: id,
        challengeTitle: challenge.title,
      })
      return
    }

    const isVerified = verificationSystem.verifyChallengeCompletion(challenge)

    if (!challenge.completed && !isVerified) {
      toast({
        title: "Desafio não concluído",
        description: `Complete a atividade necessária antes de marcar este desafio como concluído.`,
        variant: "destructive",
      })
      return
    }

    const updatedChallenges = challenges.map((challenge) =>
      challenge.id === id ? { ...challenge, completed: !challenge.completed } : challenge,
    )

    setChallenges(updatedChallenges)
    updateProgress(updatedChallenges)

    localStorage.setItem(
      CHALLENGES_STORAGE_KEY,
      JSON.stringify({
        date: new Date().toISOString(),
        challenges: updatedChallenges,
        completed: false,
      }),
    )

    if (!challenge.completed && user) {
      const points = calculateChallengePointsForDifficulty(challenge.difficulty)
      await addPoints({
        userId: user.id,
        points,
        activityType: "challenge",
        activityId: challenge.id,
        description: `Completou desafio: ${challenge.title}`,
      })

      toast({
        title: "Desafio concluído!",
        description: `Você ganhou ${points} pontos! 🎉`,
        variant: "default",
      })
    }

    const allCompleted = updatedChallenges.every((c) => c.completed)

    if (allCompleted && !todayCompleted) {
      await markDayAsCompleted()
    }
  }

  const startChallenge = (challengeId: string, type: string) => {
    if (type === "reflection") {
      const challenge = challenges.find((c) => c.id === challengeId)
      if (challenge?.title === "Autoavaliação") {
        setSelfAssessmentModal({
          isOpen: true,
          challengeId: challengeId,
          challengeTitle: challenge.title,
        })
        return
      }
    }

    verificationSystem.startChallengeTracking(challengeId, type)
    setChallengeStartTimes((prev) => ({
      ...prev,
      [challengeId]: Date.now(),
    }))

    switch (type) {
      case "quiz":
        window.open("/quiz", "_blank")
        break
      case "flashcard":
        window.open("/flashcards", "_blank")
        break
      case "reading":
        window.open("/study", "_blank")
        break
      case "practice":
        window.open("/review/games", "_blank")
        break
      default:
        break
    }
  }

  const markDayAsCompleted = async () => {
    if (!user) return

    try {
      setIsLoading(true)

      const currentDate = new Date()
      const today = format(currentDate, "yyyy-MM-dd")

      const { data: performanceData, error: fetchError } = await supabase
        .from("user_performance")
        .select("study_days, total_study_days")
        .eq("user_id", user.id)
        .single()

      if (fetchError && fetchError.code === "PGRST116") {
        const { error: insertError } = await supabase.from("user_performance").insert({
          user_id: user.id,
          study_days: [today],
          total_study_days: 1,
          updated_at: new Date().toISOString(),
        })

        if (insertError) throw insertError

        setTodayCompleted(true)

        localStorage.setItem(
          CHALLENGES_STORAGE_KEY,
          JSON.stringify({
            date: currentDate.toISOString(),
            challenges: challenges,
            completed: true,
          }),
        )

        await addPoints({
          userId: user.id,
          points: 50,
          activityType: "daily_login",
          description: "Bônus por completar todos os desafios diários",
        })

        toast({
          title: "Parabéns!",
          description: "Você completou todos os desafios de hoje! Dia de estudo registrado. +50 pontos de bônus! 🎉",
          variant: "success",
        })

        const event = new CustomEvent("studyDaysUpdated", {
          detail: {
            count: 1,
            days: [today],
            isIncrementing: true,
          },
        })
        window.dispatchEvent(event)

        return
      } else if (fetchError) {
        throw fetchError
      }

      const studyDays = performanceData?.study_days || []
      let totalStudyDays = performanceData?.total_study_days || 0

      if (!studyDays.includes(today)) {
        studyDays.push(today)
        totalStudyDays += 1

        const { error: updateError } = await supabase
          .from("user_performance")
          .update({
            study_days: studyDays,
            total_study_days: totalStudyDays,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id)

        if (updateError) throw updateError

        setTodayCompleted(true)

        localStorage.setItem(
          CHALLENGES_STORAGE_KEY,
          JSON.stringify({
            date: currentDate.toISOString(),
            challenges: challenges,
            completed: true,
          }),
        )

        await addPoints({
          userId: user.id,
          points: 50,
          activityType: "daily_login",
          description: "Bônus por completar todos os desafios diários",
        })

        toast({
          title: "Parabéns!",
          description: "Você completou todos os desafios de hoje! Dia de estudo registrado. +50 pontos de bônus! 🎉",
          variant: "success",
        })

        const event = new CustomEvent("studyDaysUpdated", {
          detail: {
            count: studyDays.length,
            days: studyDays,
            isIncrementing: true,
          },
        })
        window.dispatchEvent(event)
      }
    } catch (error) {
      console.error("Erro ao marcar dia como completo:", error)
      toast({
        title: "Erro",
        description: "Não foi possível registrar o dia de estudo",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formattedDate = format(today, "EEEE, d 'de' MMMM", { locale: ptBR })

  if (!user) {
    return null
  }

  const renderIcon = (iconType: string) => {
    switch (iconType) {
      case "quiz":
        return <Brain className="h-5 w-5 text-blue-600" />
      case "flashcard":
        return <BookOpen className="h-5 w-5 text-purple-600" />
      case "reading":
        return <BookOpen className="h-5 w-5 text-green-600" />
      case "practice":
        return <Zap className="h-5 w-5 text-yellow-600" />
      case "reflection":
        return <LightbulbIcon className="h-5 w-5 text-orange-600" />
      default:
        return <Calendar className="h-5 w-5 text-gray-500" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200"
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200"
    }
  }

  const calculateChallengePointsForDifficulty = (difficulty: string): number => {
    switch (difficulty) {
      case "easy":
        return 10
      case "medium":
        return 20
      case "hard":
        return 30
      default:
        return 10
    }
  }

  const handleSelfAssessmentComplete = (assessment: SelfAssessmentData) => {
    const existingAssessments = JSON.parse(localStorage.getItem("selfAssessments") || "{}")

    if (!existingAssessments[selfAssessmentModal.challengeId]) {
      existingAssessments[selfAssessmentModal.challengeId] = []
    }

    existingAssessments[selfAssessmentModal.challengeId].push(assessment)
    localStorage.setItem("selfAssessments", JSON.stringify(existingAssessments))

    const updatedChallenges = challenges.map((challenge) =>
      challenge.id === selfAssessmentModal.challengeId ? { ...challenge, completed: true } : challenge,
    )

    setChallenges(updatedChallenges)
    updateProgress(updatedChallenges)

    localStorage.setItem(
      CHALLENGES_STORAGE_KEY,
      JSON.stringify({
        date: new Date().toISOString(),
        challenges: updatedChallenges,
        completed: false,
      }),
    )

    if (user) {
      const challenge = challenges.find((c) => c.id === selfAssessmentModal.challengeId)
      if (challenge) {
        const points = calculateChallengePointsForDifficulty(challenge.difficulty)
        addPoints({
          userId: user.id,
          points,
          activityType: "challenge",
          activityId: challenge.id,
          description: `Completou autoavaliação: ${challenge.title}`,
        })
      }
    }

    const allCompleted = updatedChallenges.every((c) => c.completed)
    if (allCompleted && !todayCompleted) {
      markDayAsCompleted()
    }

    setSelfAssessmentModal({
      isOpen: false,
      challengeId: "",
      challengeTitle: "",
    })

    toast({
      title: "Autoavaliação concluída!",
      description: "Sua reflexão foi registrada com sucesso.",
      variant: "default",
    })
  }

  return (
    <>
      <Card className="max-w-md mx-auto shadow-lg border-2">
        <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">🎯 Desafios Diários</CardTitle>
            <Target className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-sm text-muted-foreground capitalize font-medium">{formattedDate}</p>
          <div className="mt-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progresso Geral</span>
              <span className="text-sm font-bold text-blue-600">{progress}%</span>
            </div>
            <Progress value={progress} className="h-3 bg-gray-200 dark:bg-gray-700" />
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : (
            <div className="space-y-4">
              {challenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                    challenge.completed
                      ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">{renderIcon(challenge.icon)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3
                            className={`font-semibold text-base ${challenge.completed ? "text-green-700 dark:text-green-400" : "text-gray-800 dark:text-gray-200"}`}
                          >
                            {challenge.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">{challenge.description}</p>

                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                              {challenge.difficulty === "easy"
                                ? "Fácil"
                                : challenge.difficulty === "medium"
                                  ? "Médio"
                                  : "Difícil"}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              {challenge.estimatedTime}min
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                              <Star className="h-3 w-3 mr-1" />
                              {calculateChallengePointsForDifficulty(challenge.difficulty)} pts
                            </Badge>
                          </div>
                        </div>

                        <Checkbox
                          checked={challenge.completed}
                          onCheckedChange={() => toggleChallenge(challenge.id)}
                          disabled={
                            isLoading ||
                            todayCompleted ||
                            (!verificationStatus[challenge.id] &&
                              !challenge.completed &&
                              challenge.title !== "Autoavaliação")
                          }
                          className={`${challenge.completed ? "text-green-600 border-green-600" : ""} scale-125`}
                        />
                      </div>

                      {!challenge.completed && (
                        <div className="mt-3 space-y-3">
                          {challenge.title !== "Autoavaliação" && (
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                  Progresso do Desafio
                                </span>
                                <span className="text-xs font-bold text-blue-600">
                                  {Math.round(challengeProgress[challenge.id] || 0)}%
                                </span>
                              </div>
                              <Progress
                                value={challengeProgress[challenge.id] || 0}
                                className="h-2 bg-gray-200 dark:bg-gray-700"
                              />
                              {challengeProgress[challenge.id] > 0 && challengeProgress[challenge.id] < 100 && (
                                <p className="text-xs text-muted-foreground mt-1">Continue para completar o desafio!</p>
                              )}
                              {challengeProgress[challenge.id] >= 100 && (
                                <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-medium">
                                  ✅ Desafio concluído! Marque como completo acima.
                                </p>
                              )}
                            </div>
                          )}

                          <Button
                            size="sm"
                            onClick={() => startChallenge(challenge.id, challenge.type)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            {challenge.title === "Autoavaliação"
                              ? "Iniciar Autoavaliação"
                              : challengeProgress[challenge.id] > 0
                                ? "Continuar Desafio"
                                : "Iniciar Desafio"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {todayCompleted && (
            <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-4 rounded-xl border-2 border-green-200 dark:border-green-800">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                <div>
                  <p className="font-bold text-green-700 dark:text-green-400">🎉 Todos os desafios concluídos!</p>
                  <p className="text-sm text-green-600 dark:text-green-300">Dia de estudo registrado com sucesso.</p>
                </div>
              </div>
            </div>
          )}

          {challenges.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Nenhum desafio disponível para esta data.</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-3 bg-gray-50 dark:bg-gray-900/50">
          <p className="text-xs text-muted-foreground w-full text-center font-medium">
            💡 Complete todos os desafios para registrar um dia de estudo e ganhar +50 pontos de bônus!
          </p>
        </CardFooter>
      </Card>

      <SelfAssessmentModal
        isOpen={selfAssessmentModal.isOpen}
        onClose={() => setSelfAssessmentModal({ isOpen: false, challengeId: "", challengeTitle: "" })}
        challengeTitle={selfAssessmentModal.challengeTitle}
        onComplete={handleSelfAssessmentComplete}
      />
    </>
  )
}
