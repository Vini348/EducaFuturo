"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { CheckCircle, ArrowLeft, Clock, AlertTriangle } from "lucide-react"

interface Question {
  id: number
  text: string
  options: string[]
  correctAnswer: number
  area: string
  difficulty: "easy" | "medium" | "hard"
}

const simuladoQuestions: Question[] = [
  {
    id: 1,
    text: "(ENEM 2023) Leia o texto: 'A sustentabilidade ambiental tornou-se uma preocupação global.' A palavra 'sustentabilidade' é formada por:",
    options: ["Prefixo + radical + sufixo", "Radical + sufixo", "Prefixo + radical", "Apenas radical"],
    correctAnswer: 0,
    area: "Linguagens",
    difficulty: "medium",
  },
  {
    id: 2,
    text: "(ENEM 2023) A Revolução Industrial iniciada no século XVIII trouxe mudanças significativas. Qual foi seu principal impacto social?",
    options: [
      "Fortalecimento do feudalismo",
      "Surgimento da classe operária",
      "Diminuição da população urbana",
      "Fim do comércio internacional",
    ],
    correctAnswer: 1,
    area: "Ciências Humanas",
    difficulty: "medium",
  },
  {
    id: 3,
    text: "(ENEM 2023) Uma função f(x) = 3x - 2 tem como valor f(4):",
    options: ["8", "10", "12", "14"],
    correctAnswer: 1,
    area: "Matemática",
    difficulty: "easy",
  },
  {
    id: 4,
    text: "(ENEM 2023) A fotossíntese é um processo que ocorre em:",
    options: ["Mitocôndrias", "Cloroplastos", "Ribossomos", "Núcleo celular"],
    correctAnswer: 1,
    area: "Ciências da Natureza",
    difficulty: "easy",
  },
  {
    id: 5,
    text: "(ENEM 2022) Em uma progressão aritmética, o primeiro termo é 5 e a razão é 3. O quinto termo é:",
    options: ["17", "20", "23", "26"],
    correctAnswer: 0,
    area: "Matemática",
    difficulty: "medium",
  },
  {
    id: 6,
    text: "(ENEM 2022) A Lei de Ohm estabelece que V = R × I. Se a tensão é 12V e a corrente é 3A, a resistência é:",
    options: ["2Ω", "4Ω", "6Ω", "9Ω"],
    correctAnswer: 1,
    area: "Ciências da Natureza",
    difficulty: "medium",
  },
  {
    id: 7,
    text: "(ENEM 2022) O Tratado de Versalhes (1919) teve como principal consequência:",
    options: [
      "Fim da Primeira Guerra Mundial",
      "Início da Segunda Guerra Mundial",
      "Criação da ONU",
      "Divisão da Alemanha",
    ],
    correctAnswer: 0,
    area: "Ciências Humanas",
    difficulty: "hard",
  },
  {
    id: 8,
    text: "(ENEM 2021) Na frase 'Ele chegou cedo ontem', a palavra 'ontem' funciona como:",
    options: ["Adjunto adverbial de tempo", "Predicativo", "Objeto direto", "Sujeito"],
    correctAnswer: 0,
    area: "Linguagens",
    difficulty: "medium",
  },
]

export default function SimuladoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const area = searchParams.get("area")

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(simuladoQuestions.length).fill(null))
  const [timeLeft, setTimeLeft] = useState(3600) // 60 minutos
  const [isFinished, setIsFinished] = useState(false)
  const [showWarning, setShowWarning] = useState(false)

  const currentQuestion = simuladoQuestions[currentQuestionIndex]

  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      finishSimulado()
    }
  }, [timeLeft, isFinished])

  useEffect(() => {
    if (timeLeft === 600) {
      // 10 minutos restantes
      setShowWarning(true)
      setTimeout(() => setShowWarning(false), 5000)
    }
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const selectAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = answerIndex
    setAnswers(newAnswers)
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < simuladoQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(answers[currentQuestionIndex + 1])
    }
  }

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setSelectedAnswer(answers[currentQuestionIndex - 1])
    }
  }

  const finishSimulado = () => {
    setIsFinished(true)
  }

  const calculateResults = () => {
    const results = {
      total: 0,
      byArea: {} as Record<string, { correct: number; total: number }>,
    }

    simuladoQuestions.forEach((question, index) => {
      const area = question.area
      if (!results.byArea[area]) {
        results.byArea[area] = { correct: 0, total: 0 }
      }
      results.byArea[area].total++

      if (answers[index] === question.correctAnswer) {
        results.total++
        results.byArea[area].correct++
      }
    })

    return results
  }

  if (isFinished) {
    const results = calculateResults()
    const percentage = (results.total / simuladoQuestions.length) * 100

    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Simulado Concluído!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {results.total}/{simuladoQuestions.length}
              </div>
              <div className="text-lg text-muted-foreground">Acertos: {percentage.toFixed(1)}%</div>
              <Progress value={percentage} className="mt-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(results.byArea).map(([area, data]) => (
                <Card key={area}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{area}</h3>
                      <Badge variant="outline">
                        {data.correct}/{data.total}
                      </Badge>
                    </div>
                    <Progress value={(data.correct / data.total) * 100} className="h-2" />
                    <p className="text-sm text-muted-foreground mt-1">
                      {((data.correct / data.total) * 100).toFixed(1)}% de acerto
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex gap-3">
              <Button onClick={() => router.push("/study/simula-pro")} className="flex-1">
                Voltar ao SimulaPro
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()} className="flex-1">
                Refazer Simulado
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Aviso de tempo */}
      {showWarning && (
        <div className="fixed top-4 right-4 z-50">
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <span className="text-orange-800 font-medium">10 minutos restantes!</span>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header fixo */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => router.push("/study/simula-pro")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="font-semibold">Simulado ENEM</h1>
                <p className="text-sm text-muted-foreground">
                  Questão {currentQuestionIndex + 1} de {simuladoQuestions.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono text-sm">{formatTime(timeLeft)}</span>
              </div>
              <Badge variant="outline">{currentQuestion.area}</Badge>
            </div>
          </div>
          <Progress value={((currentQuestionIndex + 1) / simuladoQuestions.length) * 100} className="mt-2" />
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
                    variant={selectedAnswer === index ? "secondary" : "outline"}
                    className="w-full justify-start text-left h-auto p-4"
                    onClick={() => selectAnswer(index)}
                  >
                    <span className="mr-3 font-semibold">{String.fromCharCode(65 + index)})</span>
                    <span className="flex-1">{option}</span>
                    {selectedAnswer === index && <CheckCircle className="ml-2 h-5 w-5 text-primary" />}
                  </Button>
                ))}
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={previousQuestion} disabled={currentQuestionIndex === 0}>
                  Anterior
                </Button>
                <div className="flex gap-2">
                  {currentQuestionIndex < simuladoQuestions.length - 1 ? (
                    <Button onClick={nextQuestion}>Próxima</Button>
                  ) : (
                    <Button onClick={finishSimulado} className="bg-green-600 hover:bg-green-700">
                      Finalizar Simulado
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Navegação rápida */}
      <div className="fixed bottom-4 right-4">
        <Card className="p-2">
          <div className="grid grid-cols-8 gap-1">
            {simuladoQuestions.map((_, index) => (
              <Button
                key={index}
                size="sm"
                variant={index === currentQuestionIndex ? "default" : answers[index] !== null ? "secondary" : "outline"}
                className="w-8 h-8 p-0"
                onClick={() => {
                  setCurrentQuestionIndex(index)
                  setSelectedAnswer(answers[index])
                }}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
