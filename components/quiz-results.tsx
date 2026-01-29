"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Clock, BarChart, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"
import type { QuizQuestion } from "@/types/quiz"
import confetti from "canvas-confetti"
import { useRouter } from "next/navigation"

interface QuizResultsProps {
  questions: QuizQuestion[]
  answers: Record<string, string>
  totalTime: number
  onRestart: () => void
}

export function QuizResults({ questions, answers, totalTime, onRestart }: QuizResultsProps) {
  const [score, setScore] = useState(0)
  const [showAnswers, setShowAnswers] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Calcular pontuação
    let correctCount = 0
    questions.forEach((question) => {
      const selectedAnswer = answers[question.id]
      const correctAnswer = question.options.find((option) => option.isCorrect)
      if (selectedAnswer && correctAnswer && selectedAnswer === correctAnswer.id) {
        correctCount++
      }
    })
    setScore(correctCount)

    // Lançar confetti se a pontuação for boa
    const percentage = (correctCount / questions.length) * 100
    if (percentage >= 70) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }
  }, [questions, answers])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const getScoreColor = () => {
    const percentage = (score / questions.length) * 100
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100
    if (percentage >= 90) return "Excelente! Você domina este assunto!"
    if (percentage >= 80) return "Muito bom! Você está quase lá!"
    if (percentage >= 70) return "Bom trabalho! Continue estudando."
    if (percentage >= 60) return "Você está no caminho certo. Continue praticando."
    if (percentage >= 50) return "Você pode melhorar. Revise o material."
    return "Não desanime. Revise o conteúdo e tente novamente."
  }

  const handleNavigateToQuestionarios = () => {
    router.push("/review/questionarios")
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center border-b">
          <CardTitle className="text-2xl font-bold">Resultados do Quiz</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className={`text-5xl font-bold ${getScoreColor()}`}
            >
              {score}/{questions.length}
            </motion.div>
            <p className="text-gray-500 mt-2">{getScoreMessage()}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 flex items-center gap-3">
              <Clock className="h-6 w-6 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Tempo Total</p>
                <p className="font-semibold">{formatTime(totalTime)}</p>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <p className="text-sm text-gray-500">Acertos</p>
                <p className="font-semibold">{score} questões</p>
              </div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 flex items-center gap-3">
              <XCircle className="h-6 w-6 text-red-600" />
              <div>
                <p className="text-sm text-gray-500">Erros</p>
                <p className="font-semibold">{questions.length - score} questões</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="font-medium">Precisão</p>
              <p className="font-medium">{Math.round((score / questions.length) * 100)}%</p>
            </div>
            <Progress value={(score / questions.length) * 100} className="h-2" />
          </div>

          <Button variant="outline" onClick={() => setShowAnswers(!showAnswers)} className="w-full">
            {showAnswers ? "Ocultar Respostas" : "Ver Respostas"}
          </Button>

          {showAnswers && (
            <div className="space-y-4 mt-4">
              <h3 className="font-semibold text-lg">Respostas Corretas</h3>
              {questions.map((question, index) => {
                const selectedAnswer = answers[question.id]
                const correctAnswer = question.options.find((option) => option.isCorrect)
                const isCorrect = selectedAnswer === correctAnswer?.id

                return (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <div className={isCorrect ? "text-green-600" : "text-red-600"}>
                        {isCorrect ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="font-medium">
                          {index + 1}. {question.text}
                        </p>
                        <p className="text-sm mt-1">
                          <span className="text-gray-500">Sua resposta: </span>
                          {question.options.find((o) => o.id === selectedAnswer)?.text || "Não respondida"}
                        </p>
                        <p className="text-sm mt-1">
                          <span className="text-gray-500">Resposta correta: </span>
                          <span className="text-green-600 font-medium">{correctAnswer?.text}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t p-6 flex flex-col sm:flex-row gap-3">
          <Button onClick={onRestart} className="w-full sm:w-auto flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Tentar Novamente
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-auto flex items-center gap-2 bg-transparent"
            onClick={handleNavigateToQuestionarios}
          >
            <BarChart className="h-4 w-4" />
            Outros Questionários
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
