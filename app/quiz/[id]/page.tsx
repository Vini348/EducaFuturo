"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { TopNav } from "@/components/top-nav"
import { BottomNav } from "@/components/bottom-nav"
import { QuizQuestion } from "@/components/quiz-question"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Trophy, Clock, Target } from "lucide-react"
import { quizzes } from "@/data/quizzes"

export default function QuizSessionPage() {
  const params = useParams()
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isComplete, setIsComplete] = useState(false)
  const [startTime, setStartTime] = useState<Date>(new Date())
  const [elapsedTime, setElapsedTime] = useState(0)

  const quiz = quizzes.find((q) => q.id === params.id)

  useEffect(() => {
    setStartTime(new Date())

    // Iniciar o contador de tempo
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((new Date().getTime() - startTime.getTime()) / 1000))
    }, 1000)

    // Limpar o timer quando o componente for desmontado
    return () => clearInterval(timer)
  }, [startTime])

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 pb-16">
        <TopNav />
        <main className="container mx-auto px-4 py-6">
          <Card className="p-6 text-center">
            <p>Quiz não encontrado.</p>
            <Button className="mt-4" onClick={() => router.push("/quiz")}>
              Voltar aos Quizzes
            </Button>
          </Card>
        </main>
        <BottomNav active="review" />
      </div>
    )
  }

  const handleAnswer = (optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [quiz.questions[currentQuestion].id]: optionId,
    }))
  }

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      setIsComplete(true)
    }
  }

  const calculateScore = () => {
    let correct = 0
    Object.entries(answers).forEach(([questionId, answerId]) => {
      const question = quiz.questions.find((q) => q.id === questionId)
      if (question?.options.find((o) => o.id === answerId)?.isCorrect) {
        correct++
      }
    })
    return {
      correct,
      total: quiz.questions.length,
      percentage: (correct / quiz.questions.length) * 100,
      timeSpent: elapsedTime,
    }
  }

  if (isComplete) {
    const score = calculateScore()
    const minutes = Math.floor(score.timeSpent / 60)
    const seconds = score.timeSpent % 60

    return (
      <div className="min-h-screen bg-gray-50 pb-16">
        <TopNav />

        <main className="container mx-auto px-4 py-6">
          <Card className="max-w-2xl mx-auto p-8">
            <div className="text-center mb-8">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
              <h2 className="text-2xl font-bold mb-2">Quiz Concluído!</h2>
              <p className="text-gray-600">Veja seu desempenho abaixo</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <Card className="p-4 text-center">
                <Target className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold text-green-500">{score.percentage.toFixed(1)}%</div>
                <div className="text-sm text-gray-500">Precisão</div>
              </Card>

              <Card className="p-4 text-center">
                <Clock className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold text-blue-500">
                  {minutes}:{seconds.toString().padStart(2, "0")}
                </div>
                <div className="text-sm text-gray-500">Tempo Total</div>
              </Card>
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Respostas Corretas</span>
                  <span>
                    {score.correct} de {score.total}
                  </span>
                </div>
                <Progress value={(score.correct / score.total) * 100} />
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" className="w-full" onClick={() => router.push("/quiz")}>
                Voltar aos Quizzes
              </Button>
              <Button
                className="w-full"
                onClick={() => {
                  setCurrentQuestion(0)
                  setAnswers({})
                  setIsComplete(false)
                  setStartTime(new Date())
                  setElapsedTime(0)
                }}
              >
                Tentar Novamente
              </Button>
            </div>
          </Card>
        </main>

        <BottomNav active="review" />
      </div>
    )
  }

  const progress = (currentQuestion / quiz.questions.length) * 100

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <TopNav />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <Button variant="ghost" onClick={() => router.push("/quiz")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar aos Quizzes
        </Button>

        <QuizQuestion
          question={quiz.questions[currentQuestion]}
          currentQuestion={currentQuestion + 1}
          totalQuestions={quiz.questions.length}
          onAnswer={handleAnswer}
          onNext={handleNext}
          selectedAnswer={answers[quiz.questions[currentQuestion].id]}
          elapsedTime={elapsedTime}
          progress={progress}
        />
      </main>

      <BottomNav active="review" />
    </div>
  )
}
