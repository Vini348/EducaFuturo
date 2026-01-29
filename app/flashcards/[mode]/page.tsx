"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { TopNav } from "@/components/top-nav"
import { BottomNav } from "@/components/bottom-nav"
import { FlashcardSession } from "@/components/flashcard-session"
import { flashcardsData, getFlashcardsByDifficulty, getAllFlashcards } from "@/data/flashcards"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, ArrowLeft, Clock, Loader2 } from "lucide-react"
import { useStudyTracker } from "@/hooks/use-study-tracker"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import confetti from "canvas-confetti"
import type { Flashcard } from "@/types/flashcards"

export default function FlashcardStudyPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [completedSession, setCompletedSession] = useState<{
    correct: number
    incorrect: number
    elapsedTime: number
  } | null>(null)
  const mode = params.mode as string
  const studyTracker = useStudyTracker("flashcards")

  const [cards, setCards] = useState<Flashcard[]>([])
  const [sessionTitle, setSessionTitle] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCards = async () => {
      try {
        console.log("Loading cards for mode:", mode)
        setIsLoading(true)

        // Get cards based on mode
        const { selectedCards, title } = getCardsAndTitle()
        console.log("Selected cards:", selectedCards.length, "Title:", title)

        if (!title || title.includes("undefined")) {
          console.error("Invalid title generated:", title)
          setError("Não foi possível carregar este conjunto de flashcards. Modo inválido ou não encontrado.")
          setIsLoading(false)
          return
        }

        if (selectedCards.length === 0) {
          console.error("No cards found for mode:", mode)
          setError("Não há cartões disponíveis para este modo de estudo.")
          setIsLoading(false)
          return
        }

        // Set session title
        setSessionTitle(title)

        // Simulate network delay
        setTimeout(() => {
          setCards(selectedCards)
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Failed to load cards:", error)
        setError("Ocorreu um erro ao carregar os cartões. Por favor, tente novamente.")
        setIsLoading(false)
        toast({
          title: "Erro ao carregar cartões",
          description: "Não foi possível carregar os cartões de estudo.",
          variant: "destructive",
        })
      }
    }

    loadCards()
  }, [mode, toast])

  const getCardsAndTitle = () => {
    console.log("Getting cards and title for mode:", mode)

    if (!mode) {
      console.error("Mode is undefined")
      return { selectedCards: [], title: "Modo Desconhecido" }
    }

    try {
      // Handle special modes: study, test, mixed
      if (mode === "study") {
        const selectedCards = getFlashcardsByDifficulty("easy").slice(0, 15)
        return {
          selectedCards,
          title: "Modo Estudo - Conceitos Básicos",
        }
      }

      if (mode === "test") {
        const selectedCards = getFlashcardsByDifficulty("medium").slice(0, 15)
        return {
          selectedCards,
          title: "Modo Teste - Conceitos Intermediários",
        }
      }

      if (mode === "mixed") {
        const selectedCards = getAllFlashcards()
          .sort(() => Math.random() - 0.5)
          .slice(0, 15)
        return {
          selectedCards,
          title: "Modo Misto - Todos os Conceitos",
        }
      }

      // Handle timed test modes
      if (mode === "timed-test-medium") {
        const selectedCards = getFlashcardsByDifficulty("medium")
          .sort(() => Math.random() - 0.5)
          .slice(0, 20)

        return {
          selectedCards,
          title: "Teste Cronometrado - Nível Intermediário",
        }
      }

      if (mode === "timed-test-hard") {
        const selectedCards = getFlashcardsByDifficulty("hard")
          .sort(() => Math.random() - 0.5)
          .slice(0, 15)

        return {
          selectedCards,
          title: "Desafio Avançado - Nível Difícil",
        }
      }

      // Handle study modes (study-subject-difficulty)
      if (mode.startsWith("study-")) {
        const parts = mode.split("-")
        console.log("Study mode parts:", parts)

        if (parts.length >= 3) {
          // For modes like "study-circuitos-1ano-easy", we need to reconstruct the subject ID
          const difficulty = parts[parts.length - 1] as "easy" | "medium" | "hard"
          const subjectParts = parts.slice(1, -1) // Remove "study" and difficulty
          const subjectId = subjectParts.join("-") // Reconstruct subject ID

          console.log("Difficulty:", difficulty, "Subject ID:", subjectId)

          const subject = flashcardsData.find((s) => s.id === subjectId)
          if (!subject) {
            console.error("Subject not found:", subjectId)
            return { selectedCards: [], title: "Assunto Não Encontrado" }
          }

          const difficultyMap = {
            easy: "Nível Fácil",
            medium: "Nível Intermediário",
            hard: "Nível Avançado",
          }

          const selectedCards = subject.topics
            .flatMap((topic) => topic.cards.filter((card) => card.difficulty === difficulty))
            .sort(() => Math.random() - 0.5)
            .slice(0, 15)

          console.log(`Found ${selectedCards.length} cards for subject ${subject.title} with difficulty ${difficulty}`)

          return {
            selectedCards,
            title: `${subject.title} - ${difficultyMap[difficulty] || "Desconhecido"}`,
          }
        }
      }

      // Handle review modes (review-subject-difficulty)
      if (mode.startsWith("review-")) {
        const parts = mode.split("-")
        console.log("Review mode parts:", parts)

        if (parts.length >= 3) {
          const difficulty = parts[parts.length - 1] as "easy" | "medium" | "hard"
          const subjectParts = parts.slice(1, -1) // Remove "review" and difficulty
          const subjectId = subjectParts.join("-") // Reconstruct subject ID

          const subject = flashcardsData.find((s) => s.id === subjectId)
          if (!subject) {
            console.error("Subject not found:", subjectId)
            return { selectedCards: [], title: "Assunto Não Encontrado" }
          }

          const difficultyMap = {
            easy: "Revisão Básica",
            medium: "Revisão Intermediária",
            hard: "Simulado de Prova",
          }

          const selectedCards = subject.topics
            .flatMap((topic) => topic.cards.filter((card) => card.difficulty === difficulty))
            .sort(() => Math.random() - 0.5)
            .slice(0, difficulty === "hard" ? 20 : 15)

          return {
            selectedCards,
            title: `${subject.title} - ${difficultyMap[difficulty] || "Revisão"}`,
          }
        }
      }

      // Handle mixed-difficulty modes
      if (mode.startsWith("mixed-")) {
        const difficulty = mode.split("-")[1] as "easy" | "medium" | "hard"
        const difficultyMap = {
          easy: "Nível Fácil",
          medium: "Nível Intermediário",
          hard: "Nível Avançado",
        }

        const selectedCards = getFlashcardsByDifficulty(difficulty).slice(0, 15)

        console.log(`Found ${selectedCards.length} cards for mixed mode with difficulty: ${difficulty}`)

        return {
          selectedCards,
          title: `Modo Misto - ${difficultyMap[difficulty] || "Desconhecido"}`,
        }
      }

      // Handle subject-topic modes
      const parts = mode.split("-")
      if (parts.length < 2) {
        console.error("Invalid mode format:", mode)
        return { selectedCards: [], title: "Modo Inválido" }
      }

      // Try to find the subject by testing different combinations
      let subject = null
      let remainingParts = []

      // Try different subject ID combinations
      for (let i = 1; i <= parts.length - 1; i++) {
        const potentialSubjectId = parts.slice(0, i + 1).join("-")
        const foundSubject = flashcardsData.find((s) => s.id === potentialSubjectId)

        if (foundSubject) {
          subject = foundSubject
          remainingParts = parts.slice(i + 1)
          break
        }
      }

      if (!subject) {
        console.error("Subject not found for mode:", mode)
        return { selectedCards: [], title: "Assunto Não Encontrado" }
      }

      console.log("Found subject:", subject.title, "Remaining parts:", remainingParts)

      // If there are remaining parts, treat the first one as topic ID
      if (remainingParts.length > 0) {
        const topicId = remainingParts[0]

        // Se topicId for "all", retorne todos os cartões do assunto
        if (topicId === "all") {
          const allCards = subject.topics.flatMap((topic) => topic.cards)
          console.log(`Found ${allCards.length} cards for all topics in subject: ${subject.title}`)
          return {
            selectedCards: allCards,
            title: `${subject.title} - Todos os Tópicos`,
          }
        }

        const topic = subject.topics.find((t) => t.id === topicId)
        if (!topic) {
          console.error("Topic not found:", topicId, "in subject:", subject.id)
          // If topic not found, return all cards from the subject
          const allCards = subject.topics.flatMap((topic) => topic.cards)
          return {
            selectedCards: allCards,
            title: `${subject.title} - Todos os Tópicos`,
          }
        }

        console.log(`Found topic "${topic.title}" with ${topic.cards.length} cards`)

        return {
          selectedCards: topic.cards || [],
          title: `${subject.title} - ${topic.title}`,
        }
      } else {
        // No topic specified, return all cards from the subject
        const allCards = subject.topics.flatMap((topic) => topic.cards)
        return {
          selectedCards: allCards,
          title: `${subject.title} - Todos os Tópicos`,
        }
      }
    } catch (error) {
      console.error("Error in getCardsAndTitle:", error)
      return { selectedCards: [], title: "Erro ao Processar Modo" }
    }
  }

  const handleComplete = (results: { correct: number; incorrect: number; elapsedTime: number }) => {
    setCompletedSession(results)

    // Save progress to localStorage
    try {
      const savedProgress = localStorage.getItem("flashcardProgress")
      const parsedProgress = savedProgress ? JSON.parse(savedProgress) : {}

      parsedProgress[mode] = {
        completed: results.correct,
        total: results.correct + results.incorrect,
      }

      localStorage.setItem("flashcardProgress", JSON.stringify(parsedProgress))

      // Trigger confetti if score is good
      if (results.correct / (results.correct + results.incorrect) >= 0.7) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
      }
    } catch (error) {
      console.error("Failed to save progress:", error)
    }
  }

  const handleExit = () => {
    router.push("/flashcards")
  }

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-16">
        <TopNav />
        <main className="container mx-auto px-4 py-6">
          <Button variant="ghost" onClick={handleExit} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          <Card className="max-w-md mx-auto p-8 text-center">
            <div className="text-red-500 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-4">Erro ao Carregar Flashcards</h2>
            <p className="mb-6 text-gray-600">{error}</p>
            <Button onClick={handleExit} className="w-full">
              Voltar para Flashcards
            </Button>
          </Card>
        </main>
        <BottomNav active="review" />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-16">
        <TopNav />
        <main className="container mx-auto px-4 py-6">
          <Button variant="ghost" onClick={handleExit} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          <div className="flex flex-col items-center justify-center h-[70vh]">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <h2 className="text-xl font-medium text-center">Carregando cartões de estudo...</h2>
            <p className="text-muted-foreground mt-2 text-center">Preparando sua sessão de estudo personalizada</p>
          </div>
        </main>
        <BottomNav active="review" />
      </div>
    )
  }

  if (completedSession) {
    const totalAnswered = completedSession.correct + completedSession.incorrect
    const accuracy = totalAnswered > 0 ? (completedSession.correct / totalAnswered) * 100 : 0

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-16">
        <TopNav />

        <main className="container mx-auto px-4 py-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="max-w-2xl mx-auto p-8 text-center border-0 shadow-xl">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
              <h2 className="text-2xl font-bold mb-4">Sessão Concluída!</h2>

              <div className="space-y-6 mb-8">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Precisão</p>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${accuracy}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${
                        accuracy >= 70 ? "bg-green-500" : accuracy >= 40 ? "bg-yellow-500" : "bg-red-500"
                      }`}
                    />
                  </div>
                  <p className="mt-2 font-medium text-lg">{accuracy.toFixed(1)}%</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 bg-green-50 rounded-lg border border-green-200"
                  >
                    <p className="text-green-600 font-medium text-2xl">{completedSession.correct}</p>
                    <p className="text-sm text-gray-500">Corretas</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="p-6 bg-red-50 rounded-lg border border-red-200"
                  >
                    <p className="text-red-600 font-medium text-2xl">{completedSession.incorrect}</p>
                    <p className="text-sm text-gray-500">Incorretas</p>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center justify-center gap-2 mt-2 text-sm text-muted-foreground"
                >
                  <Clock className="h-4 w-4" />
                  <span>Tempo total: {formatTime(completedSession.elapsedTime)}</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="p-4 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <p className="text-blue-700">
                    Total de cartões: {cards.length} | Respondidos: {totalAnswered}
                  </p>
                </motion.div>

                {accuracy >= 70 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="p-4 bg-yellow-50 rounded-lg border border-yellow-200"
                  >
                    <p className="text-yellow-700">🎉 Parabéns! Você teve um ótimo desempenho nesta sessão.</p>
                  </motion.div>
                )}

                {accuracy < 40 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="p-4 bg-blue-50 rounded-lg border border-blue-200"
                  >
                    <p className="text-blue-700">
                      💪 Continue praticando! Revisar os conceitos ajudará a melhorar seu desempenho.
                    </p>
                  </motion.div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleExit} variant="outline" className="flex-1 bg-transparent">
                  Voltar ao Início
                </Button>
                <Button
                  onClick={() => {
                    setCompletedSession(null)
                    setIsLoading(true)
                    setTimeout(() => {
                      const { selectedCards } = getCardsAndTitle()
                      setCards(selectedCards)
                      setIsLoading(false)
                    }, 500)
                  }}
                  className="flex-1"
                >
                  Tentar Novamente
                </Button>
              </div>
            </Card>
          </motion.div>
        </main>

        <BottomNav active="review" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-16">
      <TopNav />

      <main className="container mx-auto px-4 py-6">
        <Button variant="ghost" onClick={handleExit} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">{sessionTitle}</h1>
          <p className="text-muted-foreground">
            {cards.length} cartões de estudo • {cards.filter((c) => c.difficulty === "easy").length} fáceis •{" "}
            {cards.filter((c) => c.difficulty === "medium").length} médios •{" "}
            {cards.filter((c) => c.difficulty === "hard").length} difíceis
          </p>
        </div>

        <FlashcardSession cards={cards} onComplete={handleComplete} />
      </main>

      <BottomNav active="review" />
    </div>
  )
}
