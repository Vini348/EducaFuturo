"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, XCircle, Clock, Trophy, ArrowRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { supabase } from "@/lib/supabaseClient"

interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: number
  explanation: string
  category: "analog" | "digital" | "power" | "general"
  difficulty: "easy" | "medium" | "hard"
}

// Banco de perguntas
const questions: Question[] = [
  {
    id: "q1",
    text: "Qual componente é usado para armazenar carga elétrica em um circuito?",
    options: ["Resistor", "Capacitor", "Indutor", "Diodo"],
    correctAnswer: 1,
    explanation:
      "Capacitores armazenam energia elétrica na forma de carga elétrica. Eles consistem em duas placas condutoras separadas por um material isolante (dielétrico).",
    category: "analog",
    difficulty: "easy",
  },
  {
    id: "q2",
    text: "Qual porta lógica implementa a função booleana Y = A · B?",
    options: ["OR", "AND", "NOT", "XOR"],
    correctAnswer: 1,
    explanation:
      "A porta AND (E) implementa a multiplicação lógica, onde a saída é 1 apenas quando todas as entradas são 1.",
    category: "digital",
    difficulty: "easy",
  },
  {
    id: "q3",
    text: "Qual dispositivo é usado para converter corrente alternada (AC) em corrente contínua (DC)?",
    options: ["Transformador", "Capacitor", "Retificador", "Transistor"],
    correctAnswer: 2,
    explanation:
      "Retificadores são dispositivos que convertem corrente alternada (AC) em corrente contínua (DC), permitindo que a corrente flua em apenas uma direção.",
    category: "power",
    difficulty: "easy",
  },
  {
    id: "q4",
    text: "Qual é a unidade de medida da capacitância?",
    options: ["Ohm (Ω)", "Farad (F)", "Henry (H)", "Tesla (T)"],
    correctAnswer: 1,
    explanation:
      "A capacitância é medida em Farads (F). Na prática, frequentemente usamos microfarads (μF) ou picofarads (pF) devido ao tamanho típico dos capacitores.",
    category: "analog",
    difficulty: "easy",
  },
  {
    id: "q5",
    text: "Qual componente é usado para limitar a corrente em um circuito?",
    options: ["Capacitor", "Diodo", "Resistor", "Transistor"],
    correctAnswer: 2,
    explanation:
      "Resistores limitam o fluxo de corrente elétrica em um circuito, convertendo energia elétrica em calor de acordo com a Lei de Ohm (V = I × R).",
    category: "analog",
    difficulty: "easy",
  },
  {
    id: "q6",
    text: "Qual é a função de um flip-flop em circuitos digitais?",
    options: ["Amplificar sinais", "Armazenar um bit de informação", "Filtrar ruído", "Converter AC para DC"],
    correctAnswer: 1,
    explanation:
      "Flip-flops são circuitos sequenciais que armazenam um bit de informação. Eles são os blocos básicos de construção para registradores e memórias em sistemas digitais.",
    category: "digital",
    difficulty: "medium",
  },
  {
    id: "q7",
    text: "O que é PWM em eletrônica de potência?",
    options: [
      "Power Wattage Measurement",
      "Pulse Width Modulation",
      "Passive Waveform Monitor",
      "Potential Wiring Method",
    ],
    correctAnswer: 1,
    explanation:
      "PWM (Modulação por Largura de Pulso) é uma técnica que controla a potência entregue a dispositivos variando a largura do pulso de um sinal digital, mantendo sua frequência constante.",
    category: "power",
    difficulty: "medium",
  },
  {
    id: "q8",
    text: "Qual é a função principal de um amplificador operacional?",
    options: ["Armazenar dados", "Amplificar sinais", "Converter AC para DC", "Gerar clock"],
    correctAnswer: 1,
    explanation:
      "Amplificadores operacionais (op-amps) são dispositivos de alta amplificação projetados para realizar operações matemáticas em sinais analógicos, como amplificação, soma, subtração, etc.",
    category: "analog",
    difficulty: "medium",
  },
  {
    id: "q9",
    text: "Qual é o teorema que afirma que qualquer rede resistiva pode ser substituída por um circuito equivalente com uma única fonte de tensão e um resistor em série?",
    options: ["Lei de Ohm", "Lei de Kirchhoff", "Teorema de Norton", "Teorema de Thévenin"],
    correctAnswer: 3,
    explanation:
      "O Teorema de Thévenin afirma que qualquer circuito linear de duas portas pode ser substituído por um circuito equivalente consistindo de uma fonte de tensão em série com um resistor.",
    category: "analog",
    difficulty: "hard",
  },
  {
    id: "q10",
    text: "Qual tipo de memória perde seu conteúdo quando a energia é desligada?",
    options: ["ROM", "EEPROM", "RAM", "Flash"],
    correctAnswer: 2,
    explanation:
      "A RAM (Random Access Memory) é volátil, o que significa que perde seu conteúdo quando a energia é desligada. É usada como memória de trabalho temporária em computadores.",
    category: "digital",
    difficulty: "medium",
  },
  {
    id: "q11",
    text: "Qual componente é usado para armazenar energia em um campo magnético?",
    options: ["Capacitor", "Resistor", "Indutor", "Diodo"],
    correctAnswer: 2,
    explanation:
      "Indutores armazenam energia em um campo magnético quando a corrente flui através deles. Eles resistem a mudanças na corrente elétrica.",
    category: "analog",
    difficulty: "medium",
  },
  {
    id: "q12",
    text: "Qual é a função de um multiplexador (MUX) em circuitos digitais?",
    options: [
      "Dividir um sinal em múltiplos sinais",
      "Selecionar um entre vários sinais de entrada",
      "Multiplicar a frequência de um sinal",
      "Converter sinais analógicos em digitais",
    ],
    correctAnswer: 1,
    explanation:
      "Um multiplexador (MUX) seleciona uma entre várias entradas digitais e encaminha a selecionada para uma única saída, baseado em sinais de seleção.",
    category: "digital",
    difficulty: "medium",
  },
  {
    id: "q13",
    text: "Qual é o propósito de um regulador de tensão em uma fonte de alimentação?",
    options: [
      "Aumentar a corrente",
      "Manter uma tensão de saída constante",
      "Converter DC para AC",
      "Filtrar ruído de alta frequência",
    ],
    correctAnswer: 1,
    explanation:
      "Reguladores de tensão mantêm uma tensão de saída constante independentemente de variações na tensão de entrada ou na carga, protegendo circuitos sensíveis.",
    category: "power",
    difficulty: "medium",
  },
  {
    id: "q14",
    text: "Qual é a Lei de Ohm?",
    options: ["I = V/R", "P = VI", "V = IR", "E = mc²"],
    correctAnswer: 2,
    explanation:
      "A Lei de Ohm afirma que a corrente através de um condutor entre dois pontos é diretamente proporcional à tensão e inversamente proporcional à resistência (V = IR).",
    category: "general",
    difficulty: "easy",
  },
  {
    id: "q15",
    text: "O que é um MOSFET?",
    options: ["Um tipo de resistor", "Um tipo de capacitor", "Um tipo de transistor", "Um tipo de diodo"],
    correctAnswer: 2,
    explanation:
      "MOSFET (Metal-Oxide-Semiconductor Field-Effect Transistor) é um tipo de transistor usado para amplificar ou chavear sinais eletrônicos, comum em circuitos integrados.",
    category: "analog",
    difficulty: "medium",
  },
]

export function ElectronicQuizGame() {
  const [activeTab, setActiveTab] = useState<string>("play")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [isQuizActive, setIsQuizActive] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([])
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([])
  const { toast } = useToast()

  // Filtrar perguntas com base na categoria e dificuldade selecionadas
  useEffect(() => {
    let filtered = [...questions]

    if (selectedCategory !== "all") {
      filtered = filtered.filter((q) => q.category === selectedCategory)
    }

    if (selectedDifficulty !== "all") {
      filtered = filtered.filter((q) => {
        if (selectedDifficulty === "easy") return q.difficulty === "easy"
        if (selectedDifficulty === "medium") return q.difficulty === "medium"
        if (selectedDifficulty === "hard") return q.difficulty === "hard"
        return true
      })
    }

    // Embaralhar as perguntas
    filtered = filtered.sort(() => Math.random() - 0.5)

    setFilteredQuestions(filtered)
    setCurrentQuestionIndex(0)
    setIsAnswerSubmitted(false)
    setSelectedAnswer(null)
  }, [selectedCategory, selectedDifficulty])

  // Timer para as perguntas
  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isQuizActive && timeLeft > 0 && !isAnswerSubmitted) {
      timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && !isAnswerSubmitted) {
      handleSubmitAnswer()
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [timeLeft, isQuizActive, isAnswerSubmitted])

  const startQuiz = () => {
    setIsQuizActive(true)
    setScore(0)
    setTimeLeft(30)
    setCurrentQuestionIndex(0)
    setIsAnswerSubmitted(false)
    setSelectedAnswer(null)
    setQuizCompleted(false)
    setAnsweredQuestions([])
  }

  const handleAnswerSelect = (index: number) => {
    if (!isAnswerSubmitted) {
      setSelectedAnswer(index)
    }
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null && timeLeft > 0) {
      toast({
        title: "Selecione uma resposta",
        description: "Por favor, selecione uma resposta antes de continuar.",
        variant: "destructive",
      })
      return
    }

    setIsAnswerSubmitted(true)

    const currentQuestion = filteredQuestions[currentQuestionIndex]
    setAnsweredQuestions((prev) => [...prev, currentQuestion.id])

    if (selectedAnswer === currentQuestion.correctAnswer) {
      // Pontuação baseada no tempo restante e dificuldade
      let pointsToAdd = 10
      if (currentQuestion.difficulty === "medium") pointsToAdd = 20
      if (currentQuestion.difficulty === "hard") pointsToAdd = 30

      // Bônus por responder rápido
      const timeBonus = Math.floor(timeLeft / 3)
      pointsToAdd += timeBonus

      setScore((prev) => prev + pointsToAdd)

      toast({
        title: "Resposta Correta!",
        description: `+${pointsToAdd} pontos`,
        variant: "default",
      })
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setIsAnswerSubmitted(false)
      setTimeLeft(30)
    } else {
      // Quiz completo
      setQuizCompleted(true)
      setIsQuizActive(false)
      saveQuizResults()
    }
  }

  const saveQuizResults = async () => {
    try {
      // Verificar se o usuário está autenticado
      const { data: userData, error: userError } = await supabase.auth.getSession()

      if (userError || !userData.session) {
        // Se não estiver autenticado, salvar localmente
        const localResults = JSON.parse(localStorage.getItem("gameResults") || "{}")
        localResults.electronicQuiz = {
          score,
          answeredQuestions,
          timestamp: new Date().toISOString(),
        }
        localStorage.setItem("gameResults", JSON.stringify(localResults))

        toast({
          title: "Resultados salvos localmente",
          description: "Faça login para salvar seu progresso na nuvem!",
          variant: "default",
        })
        return
      }

      // Se estiver autenticado, salvar no Supabase
      const { error } = await supabase.from("game_results").insert({
        user_id: userData.session.user.id,
        game_type: "electronic_quiz",
        score: score,
        total_time: 0,
        accuracy: (answeredQuestions.length / filteredQuestions.length) * 100,
        challenges_completed: answeredQuestions.length,
      })

      if (error) throw error

      toast({
        title: "Progresso salvo",
        description: "Seu desempenho foi salvo com sucesso!",
        variant: "default",
      })
    } catch (err) {
      console.error("Error saving quiz results:", err)
      toast({
        title: "Erro ao salvar",
        description: "Seus resultados foram salvos localmente.",
        variant: "default",
      })
    }
  }

  const renderDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return (
          <Badge variant="outline" className="bg-green-50">
            Fácil
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="bg-yellow-50">
            Médio
          </Badge>
        )
      case "hard":
        return (
          <Badge variant="outline" className="bg-red-50">
            Difícil
          </Badge>
        )
      default:
        return null
    }
  }

  const renderCategoryBadge = (category: string) => {
    switch (category) {
      case "analog":
        return (
          <Badge variant="outline" className="bg-blue-50">
            Analógica
          </Badge>
        )
      case "digital":
        return (
          <Badge variant="outline" className="bg-purple-50">
            Digital
          </Badge>
        )
      case "power":
        return (
          <Badge variant="outline" className="bg-orange-50">
            Potência
          </Badge>
        )
      case "general":
        return (
          <Badge variant="outline" className="bg-gray-50">
            Geral
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl">Quiz de Eletrônica</CardTitle>
          {isQuizActive && (
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-lg flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                {score} pontos
              </Badge>
              <Badge variant={timeLeft > 10 ? "outline" : "destructive"} className="text-lg flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {timeLeft}s
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="play">Jogar</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="play" className="space-y-4">
            {!isQuizActive && !quizCompleted ? (
              <div className="text-center py-8 space-y-6">
                <h3 className="text-xl font-semibold">Teste seus conhecimentos em eletrônica!</h3>
                <p className="text-gray-600">
                  Responda perguntas sobre eletrônica analógica, digital e de potência. Quanto mais rápido você
                  responder, mais pontos ganhará!
                </p>
                <Button size="lg" onClick={startQuiz}>
                  Iniciar Quiz
                </Button>
              </div>
            ) : quizCompleted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="p-6 bg-green-50 border-green-200">
                  <div className="text-center space-y-4">
                    <Trophy className="h-16 w-16 text-yellow-500 mx-auto" />
                    <h3 className="text-2xl font-bold">Quiz Completo!</h3>
                    <p className="text-lg">Você completou o quiz de eletrônica!</p>
                    <div className="text-xl font-bold">Pontuação final: {score} pontos</div>
                    <p>Você respondeu {answeredQuestions.length} perguntas.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                      <Button onClick={startQuiz}>Jogar Novamente</Button>
                      <Button variant="outline" onClick={() => setActiveTab("settings")}>
                        Mudar Configurações
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {filteredQuestions.length > 0 ? (
                  <>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        {renderCategoryBadge(filteredQuestions[currentQuestionIndex].category)}
                        {renderDifficultyBadge(filteredQuestions[currentQuestionIndex].difficulty)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Pergunta {currentQuestionIndex + 1} de {filteredQuestions.length}
                      </div>
                    </div>

                    <Progress value={(currentQuestionIndex / filteredQuestions.length) * 100} className="h-2" />

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-4">{filteredQuestions[currentQuestionIndex].text}</h3>

                      <RadioGroup value={selectedAnswer?.toString() || ""} className="space-y-3">
                        {filteredQuestions[currentQuestionIndex].options.map((option, index) => (
                          <div
                            key={index}
                            className={`
                              flex items-center space-x-2 p-3 rounded-lg border cursor-pointer
                              ${selectedAnswer === index ? "border-primary bg-primary/5" : "border-gray-200"}
                              ${
                                isAnswerSubmitted && index === filteredQuestions[currentQuestionIndex].correctAnswer
                                  ? "border-green-500 bg-green-50"
                                  : ""
                              }
                              ${
                                isAnswerSubmitted &&
                                selectedAnswer === index &&
                                index !== filteredQuestions[currentQuestionIndex].correctAnswer
                                  ? "border-red-500 bg-red-50"
                                  : ""
                              }
                            `}
                            onClick={() => handleAnswerSelect(index)}
                          >
                            <RadioGroupItem
                              value={index.toString()}
                              id={`option-${index}`}
                              disabled={isAnswerSubmitted}
                            />
                            <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                              {option}
                            </Label>
                            {isAnswerSubmitted && index === filteredQuestions[currentQuestionIndex].correctAnswer && (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            )}
                            {isAnswerSubmitted &&
                              selectedAnswer === index &&
                              index !== filteredQuestions[currentQuestionIndex].correctAnswer && (
                                <XCircle className="h-5 w-5 text-red-500" />
                              )}
                          </div>
                        ))}
                      </RadioGroup>

                      {isAnswerSubmitted && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 p-4 bg-blue-50 rounded-lg"
                        >
                          <h4 className="font-medium mb-1">Explicação:</h4>
                          <p>{filteredQuestions[currentQuestionIndex].explanation}</p>
                        </motion.div>
                      )}
                    </div>

                    <div className="flex justify-end">
                      {!isAnswerSubmitted ? (
                        <Button onClick={handleSubmitAnswer}>Responder</Button>
                      ) : (
                        <Button onClick={handleNextQuestion}>
                          {currentQuestionIndex < filteredQuestions.length - 1 ? (
                            <>
                              Próxima Pergunta
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                          ) : (
                            "Finalizar Quiz"
                          )}
                        </Button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p>Nenhuma pergunta encontrada com os filtros selecionados.</p>
                    <Button variant="outline" onClick={() => setActiveTab("settings")} className="mt-4">
                      Mudar Filtros
                    </Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Categoria</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={selectedCategory === "all" ? "default" : "outline"}
                      onClick={() => setSelectedCategory("all")}
                    >
                      Todas
                    </Button>
                    <Button
                      variant={selectedCategory === "analog" ? "default" : "outline"}
                      onClick={() => setSelectedCategory("analog")}
                    >
                      Analógica
                    </Button>
                    <Button
                      variant={selectedCategory === "digital" ? "default" : "outline"}
                      onClick={() => setSelectedCategory("digital")}
                    >
                      Digital
                    </Button>
                    <Button
                      variant={selectedCategory === "power" ? "default" : "outline"}
                      onClick={() => setSelectedCategory("power")}
                    >
                      Potência
                    </Button>
                    <Button
                      variant={selectedCategory === "general" ? "default" : "outline"}
                      onClick={() => setSelectedCategory("general")}
                      className="col-span-2"
                    >
                      Geral
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Dificuldade</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={selectedDifficulty === "all" ? "default" : "outline"}
                      onClick={() => setSelectedDifficulty("all")}
                    >
                      Todas
                    </Button>
                    <Button
                      variant={selectedDifficulty === "easy" ? "default" : "outline"}
                      onClick={() => setSelectedDifficulty("easy")}
                    >
                      Fácil
                    </Button>
                    <Button
                      variant={selectedDifficulty === "medium" ? "default" : "outline"}
                      onClick={() => setSelectedDifficulty("medium")}
                    >
                      Médio
                    </Button>
                    <Button
                      variant={selectedDifficulty === "hard" ? "default" : "outline"}
                      onClick={() => setSelectedDifficulty("hard")}
                    >
                      Difícil
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => {
                  setActiveTab("play")
                  if (filteredQuestions.length > 0) {
                    startQuiz()
                  }
                }}
              >
                Iniciar Quiz com Estas Configurações
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
