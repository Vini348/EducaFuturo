"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { CheckCircle, XCircle, ArrowLeft, Clock } from "lucide-react"

interface Question {
  id: number
  text: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: "easy" | "medium" | "hard"
}

const enemQuestions: Question[] = [
  {
    id: 1,
    text: "(ENEM 2023) A função f(x) = 2x + 3 representa o custo de produção de x unidades de um produto. Se o custo total foi de R$ 23,00, quantas unidades foram produzidas?",
    options: ["8 unidades", "10 unidades", "12 unidades", "15 unidades"],
    correctAnswer: 1,
    explanation: "Para encontrar x: 2x + 3 = 23, então 2x = 20, logo x = 10 unidades.",
    difficulty: "easy",
  },
  {
    id: 2,
    text: "(ENEM 2022) Em uma pesquisa sobre preferências musicais, 60% dos entrevistados gostam de rock, 40% gostam de pop e 25% gostam de ambos. Qual a porcentagem que não gosta de nenhum dos dois estilos?",
    options: ["15%", "20%", "25%", "30%"],
    correctAnswer: 2,
    explanation:
      "Usando o princípio da inclusão-exclusão: Rock ∪ Pop = 60% + 40% - 25% = 75%. Logo, 100% - 75% = 25% não gostam de nenhum.",
    difficulty: "medium",
  },
  {
    id: 3,
    text: "(ENEM 2021) Uma empresa de delivery cobra R$ 5,00 de taxa fixa mais R$ 2,50 por quilômetro rodado. Se uma entrega custou R$ 17,50, qual foi a distância percorrida?",
    options: ["4 km", "5 km", "6 km", "7 km"],
    correctAnswer: 1,
    explanation: "Custo = 5 + 2,5x = 17,5, então 2,5x = 12,5, logo x = 5 km.",
    difficulty: "medium",
  },
  {
    id: 4,
    text: "(ENEM 2020) Em um triângulo retângulo, os catetos medem 3 cm e 4 cm. Qual é a medida da hipotenusa?",
    options: ["5 cm", "6 cm", "7 cm", "8 cm"],
    correctAnswer: 0,
    explanation: "Pelo teorema de Pitágoras: h² = 3² + 4² = 9 + 16 = 25, então h = 5 cm.",
    difficulty: "easy",
  },
  {
    id: 5,
    text: "(ENEM 2019) Uma função quadrática f(x) = ax² + bx + c tem vértice no ponto (2, -1) e passa pelo ponto (0, 3). Qual o valor de a?",
    options: ["1", "2", "-1", "-2"],
    correctAnswer: 0,
    explanation:
      "Com vértice (2, -1) e passando por (0, 3), temos c = 3. Usando a forma canônica e substituindo, encontramos a = 1.",
    difficulty: "hard",
  },
]

export default function BlocoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const area = searchParams.get("area")

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(5).fill(null))
  const [timeLeft, setTimeLeft] = useState(900) // 15 minutos
  const [isFinished, setIsFinished] = useState(false)

  const currentQuestion = enemQuestions[currentQuestionIndex]

  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      finishBloco()
    }
  }, [timeLeft, isFinished])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const answerQuestion = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    setShowResult(true)

    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = answerIndex
    setAnswers(newAnswers)
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < enemQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      finishBloco()
    }
  }

  const finishBloco = () => {
    setIsFinished(true)
  }

  const calculateScore = () => {
    return answers.reduce((score, answer, index) => {
      if (answer === enemQuestions[index].correctAnswer) {
        return score + 1
      }
      return score
    }, 0)
  }

  if (isFinished) {
    const score = calculateScore()
    const percentage = (score / enemQuestions.length) * 100

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Bloco Concluído!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">{score}/5</div>
              <div className="text-lg text-muted-foreground">Acertos: {percentage.toFixed(0)}%</div>
            </div>

            <div className="space-y-3">
              {enemQuestions.map((question, index) => (
                <div key={question.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm">Questão {index + 1}</span>
                  {answers[index] === question.correctAnswer ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button onClick={() => router.push("/study/simula-pro")} className="flex-1">
                Voltar ao SimulaPro
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()} className="flex-1">
                Refazer Bloco
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header fixo */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => router.push("/study/simula-pro")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="font-semibold">Bloco - {area}</h1>
                <p className="text-sm text-muted-foreground">Questão {currentQuestionIndex + 1} de 5</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono text-sm">{formatTime(timeLeft)}</span>
              </div>
              <Badge variant="outline">{currentQuestion.difficulty}</Badge>
            </div>
          </div>
          <Progress value={((currentQuestionIndex + 1) / enemQuestions.length) * 100} className="mt-2" />
        </div>
      </div>

      {/* Questão */}
      <div className="container mx-auto px-4 py-6">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-lg leading-relaxed">{currentQuestion.text}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                    <span className="flex-1">{option}</span>
                    {showResult && index === currentQuestion.correctAnswer && (
                      <CheckCircle className="ml-2 h-5 w-5 text-green-600" />
                    )}
                    {showResult && index === selectedAnswer && index !== currentQuestion.correctAnswer && (
                      <XCircle className="ml-2 h-5 w-5 text-red-600" />
                    )}
                  </Button>
                ))}
              </div>

              {showResult && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Explicação:</h4>
                  <p className="text-blue-800">{currentQuestion.explanation}</p>
                  <Button onClick={nextQuestion} className="mt-4">
                    {currentQuestionIndex < enemQuestions.length - 1 ? "Próxima Questão" : "Finalizar Bloco"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
