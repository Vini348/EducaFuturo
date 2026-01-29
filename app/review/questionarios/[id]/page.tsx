"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { TopNav } from "@/components/top-nav"
import { BottomNav } from "@/components/bottom-nav"
import { QuizQuestion } from "@/components/quiz-question"
import { QuizResults } from "@/components/quiz-results"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Clock, HelpCircle } from "lucide-react"
import Link from "next/link"
import { quizzes } from "@/data/quizzes"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function QuizSessionPage() {
  const params = useParams()
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [startTime, setStartTime] = useState<number>(Date.now())
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const quiz = quizzes.find((q) => q.id === params.id)

  useEffect(() => {
    if (!quiz) {
      router.push("/review/questionarios")
    } else {
      setIsLoading(false)
    }
  }, [quiz, router])

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined

    if (!showResults) {
      timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    }

    return () => {
      if (timer) {
        clearInterval(timer)
      }
    }
  }, [startTime, showResults])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <TopNav />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Carregando questionário...</p>
          </div>
        </main>
        <BottomNav active="review" />
      </div>
    )
  }

  if (!quiz) {
    return null
  }

  const handleAnswer = (answerId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [quiz.questions[currentQuestion].id]: answerId,
    }))
  }

  const handleNext = () => {
    // Parar qualquer síntese de fala em andamento
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      setShowResults(true)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    setStartTime(Date.now())
    setElapsedTime(0)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case "digital":
        return "bg-blue-100 text-blue-800"
      case "analog":
        return "bg-purple-100 text-purple-800"
      case "power":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <TopNav />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/review/questionarios">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold">{quiz.title}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Badge className={getCategoryColor(quiz.category)}>
                {quiz.category === "digital"
                  ? "Eletrônica Digital"
                  : quiz.category === "analog"
                    ? "Eletrônica Analógica"
                    : "Eletrônica de Potência"}
              </Badge>
              <span className="flex items-center">
                <HelpCircle className="h-3.5 w-3.5 mr-1" />
                {quiz.questions.length} questões
              </span>
            </div>
          </div>
        </div>

        {!showResults && (
          <Card className="bg-white shadow-sm border-0">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">
                  Questão {currentQuestion + 1} de {quiz.questions.length}
                </span>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="font-mono">{formatTime(elapsedTime)}</span>
                </div>
              </div>
              <Progress value={((currentQuestion + 1) / quiz.questions.length) * 100} className="h-2" />
            </CardContent>
          </Card>
        )}

        {showResults ? (
          <QuizResults questions={quiz.questions} answers={answers} totalTime={elapsedTime} onRestart={handleRestart} />
        ) : (
          <QuizQuestion
            question={quiz.questions[currentQuestion]}
            onAnswer={handleAnswer}
            onNext={handleNext}
            selectedAnswer={answers[quiz.questions[currentQuestion].id]}
            currentQuestion={currentQuestion + 1}
            totalQuestions={quiz.questions.length}
            elapsedTime={elapsedTime}
          />
        )}
      </main>

      <BottomNav active="review" />
    </div>
  )
}
