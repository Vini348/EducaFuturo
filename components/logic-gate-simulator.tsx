"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, RefreshCw, Trophy, HelpCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

interface LogicGate {
  id: string
  name: string
  symbol: React.ReactNode
  truthTable: boolean[][]
  description: string
}

const logicGates: LogicGate[] = [
  {
    id: "and",
    name: "Porta AND",
    symbol: (
      <svg viewBox="0 0 100 60" className="w-16 h-12">
        <path d="M10,10 L50,10 Q80,30 50,50 L10,50 Z" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    ),
    truthTable: [
      [false, false, false],
      [false, true, false],
      [true, false, false],
      [true, true, true],
    ],
    description: "A porta AND produz uma saída verdadeira (1) apenas quando todas as entradas são verdadeiras.",
  },
  {
    id: "or",
    name: "Porta OR",
    symbol: (
      <svg viewBox="0 0 100 60" className="w-16 h-12">
        <path d="M10,10 C40,10 50,30 80,30 C50,30 40,50 10,50 Z" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    ),
    truthTable: [
      [false, false, false],
      [false, true, true],
      [true, false, true],
      [true, true, true],
    ],
    description: "A porta OR produz uma saída verdadeira (1) quando pelo menos uma das entradas é verdadeira.",
  },
  {
    id: "not",
    name: "Porta NOT",
    symbol: (
      <svg viewBox="0 0 100 60" className="w-16 h-12">
        <path d="M20,10 L60,30 L20,50 Z" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="70" cy="30" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    ),
    truthTable: [
      [false, true],
      [true, false],
    ],
    description:
      "A porta NOT inverte o valor da entrada. Se a entrada for verdadeira, a saída será falsa, e vice-versa.",
  },
  {
    id: "nand",
    name: "Porta NAND",
    symbol: (
      <svg viewBox="0 0 100 60" className="w-16 h-12">
        <path d="M10,10 L50,10 Q80,30 50,50 L10,50 Z" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="90" cy="30" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    ),
    truthTable: [
      [false, false, true],
      [false, true, true],
      [true, false, true],
      [true, true, false],
    ],
    description:
      "A porta NAND é o inverso da porta AND. Produz uma saída falsa apenas quando todas as entradas são verdadeiras.",
  },
  {
    id: "nor",
    name: "Porta NOR",
    symbol: (
      <svg viewBox="0 0 100 60" className="w-16 h-12">
        <path d="M10,10 C40,10 50,30 80,30 C50,30 40,50 10,50 Z" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="90" cy="30" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    ),
    truthTable: [
      [false, false, true],
      [false, true, false],
      [true, false, false],
      [true, true, false],
    ],
    description:
      "A porta NOR é o inverso da porta OR. Produz uma saída verdadeira apenas quando todas as entradas são falsas.",
  },
  {
    id: "xor",
    name: "Porta XOR",
    symbol: (
      <svg viewBox="0 0 100 60" className="w-16 h-12">
        <path d="M5,10 C35,10 45,30 75,30 C45,30 35,50 5,50 Z" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M0,10 C30,10 40,30 70,30 C40,30 30,50 0,50" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    ),
    truthTable: [
      [false, false, false],
      [false, true, true],
      [true, false, true],
      [true, true, false],
    ],
    description: "A porta XOR (OU Exclusivo) produz uma saída verdadeira quando as entradas são diferentes entre si.",
  },
  {
    id: "xnor",
    name: "Porta XNOR",
    symbol: (
      <svg viewBox="0 0 100 60" className="w-16 h-12">
        <path d="M5,10 C35,10 45,30 75,30 C45,30 35,50 5,50 Z" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M0,10 C30,10 40,30 70,30 C40,30 30,50 0,50" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="85" cy="30" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    ),
    truthTable: [
      [false, false, true],
      [false, true, false],
      [true, false, false],
      [true, true, true],
    ],
    description: "A porta XNOR (NOR Exclusivo) produz uma saída verdadeira quando as entradas são iguais entre si.",
  },
]

interface Challenge {
  id: string
  title: string
  description: string
  gates: string[]
  inputs: boolean[][]
  expectedOutputs: boolean[]
  difficulty: "fácil" | "médio" | "difícil"
  points: number
}

const challenges: Challenge[] = [
  {
    id: "challenge1",
    title: "Identifique a Porta AND",
    description: "Analise o comportamento e identifique se é uma porta AND. Configure as saídas corretas.",
    gates: ["and"],
    inputs: [
      [false, false],
      [false, true],
      [true, false],
      [true, true],
    ],
    expectedOutputs: [false, false, false, true],
    difficulty: "fácil",
    points: 100,
  },
  {
    id: "challenge2",
    title: "Identifique a Porta OR",
    description: "Analise o comportamento e identifique se é uma porta OR. Configure as saídas corretas.",
    gates: ["or"],
    inputs: [
      [false, false],
      [false, true],
      [true, false],
      [true, true],
    ],
    expectedOutputs: [false, true, true, true],
    difficulty: "fácil",
    points: 100,
  },
  {
    id: "challenge3",
    title: "Identifique a Porta XOR",
    description: "Analise o comportamento e identifique se é uma porta XOR. Configure as saídas corretas.",
    gates: ["xor"],
    inputs: [
      [false, false],
      [false, true],
      [true, false],
      [true, true],
    ],
    expectedOutputs: [false, true, true, false],
    difficulty: "médio",
    points: 150,
  },
  {
    id: "challenge4",
    title: "Identifique a Porta NAND",
    description: "Analise o comportamento e identifique se é uma porta NAND. Configure as saídas corretas.",
    gates: ["nand"],
    inputs: [
      [false, false],
      [false, true],
      [true, false],
      [true, true],
    ],
    expectedOutputs: [true, true, true, false],
    difficulty: "médio",
    points: 150,
  },
  {
    id: "challenge5",
    title: "Identifique a Porta XNOR",
    description: "Analise o comportamento e identifique se é uma porta XNOR. Configure as saídas corretas.",
    gates: ["xnor"],
    inputs: [
      [false, false],
      [false, true],
      [true, false],
      [true, true],
    ],
    expectedOutputs: [true, false, false, true],
    difficulty: "difícil",
    points: 200,
  },
  {
    id: "challenge6",
    title: "Porta Misteriosa Complexa",
    description: "Identifique esta porta lógica complexa analisando apenas seu comportamento.",
    gates: ["nor"],
    inputs: [
      [false, false],
      [false, true],
      [true, false],
      [true, true],
    ],
    expectedOutputs: [true, false, false, false],
    difficulty: "difícil",
    points: 200,
  },
  {
    id: "challenge7",
    title: "Combinação Misteriosa A",
    description: "Identifique a saída desta combinação de portas lógicas. A combinação muda a cada acesso!",
    gates: ["and", "or"],
    inputs: [
      [false, false, false],
      [false, false, true],
      [false, true, false],
      [false, true, true],
      [true, false, false],
      [true, false, true],
      [true, true, false],
      [true, true, true],
    ],
    expectedOutputs: [], // Será calculado dinamicamente
    difficulty: "difícil",
    points: 250,
  },
  {
    id: "challenge8",
    title: "Combinação Misteriosa B",
    description: "Outra combinação misteriosa de portas lógicas. Analise o padrão!",
    gates: ["xor", "nand"],
    inputs: [
      [false, false, false],
      [false, false, true],
      [false, true, false],
      [false, true, true],
      [true, false, false],
      [true, false, true],
      [true, true, false],
      [true, true, true],
    ],
    expectedOutputs: [], // Será calculado dinamicamente
    difficulty: "difícil",
    points: 250,
  },
]

export function LogicGateSimulator() {
  const [activeTab, setActiveTab] = useState<string>("learn")
  const [selectedGate, setSelectedGate] = useState<LogicGate | null>(null)
  const [inputs, setInputs] = useState<boolean[]>([false, false])
  const [output, setOutput] = useState<boolean | null>(null)
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null)
  const [challengeIndex, setChallengeIndex] = useState(0)
  const [userOutputs, setUserOutputs] = useState<boolean[]>([])
  const [score, setScore] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([])
  const [gameCompleted, setGameCompleted] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (activeTab === "challenge" && !currentChallenge && challenges.length > 0) {
      setCurrentChallenge(challenges[0])
      setUserOutputs(new Array(challenges[0].expectedOutputs.length).fill(false))
    }
  }, [activeTab, currentChallenge])

  const calculateOutput = useCallback(() => {
    if (!selectedGate) return

    if (selectedGate.id === "not") {
      // NOT gate only needs one input
      const truthTableRow = selectedGate.truthTable.find((row) => row[0] === inputs[0])
      setOutput(truthTableRow ? truthTableRow[1] : null)
    } else {
      // Other gates need two inputs
      const truthTableRow = selectedGate.truthTable.find((row) => row[0] === inputs[0] && row[1] === inputs[1])
      setOutput(truthTableRow ? truthTableRow[2] : null)
    }
  }, [selectedGate, inputs])

  useEffect(() => {
    calculateOutput()
  }, [calculateOutput])

  useEffect(() => {
    if (activeTab === "challenge" && !gameCompleted) {
      if (!startTime) {
        setStartTime(Date.now())
      }

      const interval = setInterval(() => {
        setElapsedTime(Date.now() - (startTime || Date.now()))
      }, 100)
      setTimerInterval(interval)
      return () => clearInterval(interval)
    } else if (timerInterval) {
      clearInterval(timerInterval)
      setTimerInterval(null)
    }
  }, [activeTab, gameCompleted, startTime])

  const handleInputChange = (index: number, value: boolean) => {
    const newInputs = [...inputs]
    newInputs[index] = value
    setInputs(newInputs)
  }

  const handleGateSelect = (gate: LogicGate) => {
    setSelectedGate(gate)
    // Adjust inputs array based on gate type
    if (gate.id === "not") {
      setInputs([false])
    } else {
      setInputs([false, false])
    }
    calculateOutput()
  }

  const generateRandomCombination = (challengeId: string) => {
    const combinations = [
      // (A AND B) OR C
      (a: boolean, b: boolean, c: boolean) => (a && b) || c,
      // (A OR B) AND C
      (a: boolean, b: boolean, c: boolean) => (a || b) && c,
      // A XOR (B AND C)
      (a: boolean, b: boolean, c: boolean) => a !== (b && c),
      // (A NAND B) OR C
      (a: boolean, b: boolean, c: boolean) => !(a && b) || c,
      // A AND (B XOR C)
      (a: boolean, b: boolean, c: boolean) => a && b !== c,
    ]

    const savedCombination = localStorage.getItem(`combination_${challengeId}`)
    let combinationIndex = 0

    if (savedCombination) {
      combinationIndex = Number.parseInt(savedCombination)
    } else {
      combinationIndex = Math.floor(Math.random() * combinations.length)
      localStorage.setItem(`combination_${challengeId}`, combinationIndex.toString())
    }

    return combinations[combinationIndex]
  }

  const handleChallengeSelect = (challenge: Challenge) => {
    const updatedChallenge = { ...challenge }

    // Para desafios com combinações misteriosas
    if (challenge.id === "challenge7" || challenge.id === "challenge8") {
      const combination = generateRandomCombination(challenge.id)
      const outputs = challenge.inputs.map(([a, b, c]) => combination(a, b, c))
      updatedChallenge.expectedOutputs = outputs
    }

    setCurrentChallenge(updatedChallenge)
    setUserOutputs(new Array(updatedChallenge.expectedOutputs.length).fill(false))
    setShowHint(false)
  }

  const handleUserOutputChange = (index: number, value: boolean) => {
    const newOutputs = [...userOutputs]
    newOutputs[index] = value
    setUserOutputs(newOutputs)
  }

  const checkChallenge = () => {
    if (!currentChallenge) return

    const isCorrect = currentChallenge.expectedOutputs.every((expected, index) => expected === userOutputs[index])

    if (isCorrect) {
      toast({
        title: "Parabéns!",
        description: `Você completou o desafio "${currentChallenge.title}" corretamente!`,
        variant: "default",
      })

      if (!completedChallenges.includes(currentChallenge.id)) {
        setScore((prev) => prev + currentChallenge.points)
        setCompletedChallenges((prev) => [...prev, currentChallenge.id])
      }

      // Move to next challenge if available
      if (challengeIndex < challenges.length - 1) {
        setChallengeIndex((prev) => prev + 1)
        setCurrentChallenge(challenges[challengeIndex + 1])
        setUserOutputs(new Array(challenges[challengeIndex + 1].expectedOutputs.length).fill(false))
        setShowHint(false)
      } else {
        setGameCompleted(true)
      }
    } else {
      toast({
        title: "Tente novamente",
        description: "Sua solução não está correta. Verifique a tabela verdade e tente novamente.",
        variant: "destructive",
      })
      setShowHint(true)
    }
  }

  const resetChallenge = () => {
    if (currentChallenge) {
      setUserOutputs(new Array(currentChallenge.expectedOutputs.length).fill(false))
      setShowHint(false)
      // Não resetar o cronômetro nem o progresso geral
    }
  }

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const saveGameResults = async () => {
    try {
      // Verificar se o usuário está autenticado
      const { data: userData, error: userError } = await supabase.auth.getSession()

      if (userError || !userData.session) {
        // Se não estiver autenticado, salvar localmente e mostrar mensagem
        saveResultsLocally()
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
        game_type: "logic_gate_simulator",
        score: score,
        total_time: Math.floor(elapsedTime / 1000), // tempo em segundos
        accuracy: (completedChallenges.length / challenges.length) * 100,
        challenges_completed: completedChallenges.length,
      })

      if (error) throw error

      toast({
        title: "Progresso salvo",
        description: "Seu desempenho foi salvo com sucesso!",
        variant: "default",
      })
    } catch (err) {
      console.error("Error saving game results:", err)
      // Salvar localmente como fallback
      saveResultsLocally()
      toast({
        title: "Erro ao salvar online",
        description: "Seus resultados foram salvos localmente.",
        variant: "default",
      })
    }
  }

  // Função auxiliar para salvar resultados localmente
  const saveResultsLocally = () => {
    try {
      const localResults = JSON.parse(localStorage.getItem("gameResults") || "{}")
      localResults.logicGateSimulator = {
        score,
        completedChallenges,
        timestamp: new Date().toISOString(),
      }
      localStorage.setItem("gameResults", JSON.stringify(localResults))
    } catch (error) {
      console.error("Error saving results locally:", error)
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl">Simulador de Portas Lógicas</CardTitle>
          {activeTab === "challenge" && (
            <div className="flex items-center gap-4">
              {startTime && (
                <Badge variant="outline" className="text-lg">
                  ⏱️ {formatTime(elapsedTime)}
                </Badge>
              )}
              <Badge variant="secondary" className="text-lg">
                <Trophy className="h-5 w-5 mr-2" />
                {score} pontos
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="learn">Aprender</TabsTrigger>
            <TabsTrigger value="challenge">Desafios</TabsTrigger>
          </TabsList>

          <TabsContent value="learn" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1 space-y-4">
                <h3 className="text-lg font-semibold">Portas Lógicas</h3>
                <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                  {logicGates.map((gate) => (
                    <Button
                      key={gate.id}
                      variant={selectedGate?.id === gate.id ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => handleGateSelect(gate)}
                    >
                      <div className="w-8 h-8 mr-2 flex items-center justify-center">{gate.symbol}</div>
                      {gate.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                {selectedGate ? (
                  <>
                    <h3 className="text-lg font-semibold">{selectedGate.name}</h3>
                    <p className="text-gray-600">{selectedGate.description}</p>

                    <div className="bg-gray-100 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Simulação</h4>
                      <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="space-y-2">
                          {inputs.map((input, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Label htmlFor={`input-${index}`}>Entrada {index + 1}</Label>
                              <Switch
                                id={`input-${index}`}
                                checked={input}
                                onCheckedChange={(checked) => handleInputChange(index, checked)}
                              />
                              <Badge variant={input ? "default" : "outline"}>{input ? "1" : "0"}</Badge>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-center w-20 h-20">{selectedGate.symbol}</div>

                        <div className="flex items-center gap-2">
                          <Label>Saída</Label>
                          <Badge
                            variant={output ? "default" : "outline"}
                            className="h-8 w-8 flex items-center justify-center text-lg"
                          >
                            {output ? "1" : "0"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-100 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Tabela Verdade</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr>
                              {selectedGate.id === "not" ? (
                                <>
                                  <th className="px-4 py-2 text-left">Entrada</th>
                                  <th className="px-4 py-2 text-left">Saída</th>
                                </>
                              ) : (
                                <>
                                  <th className="px-4 py-2 text-left">Entrada A</th>
                                  <th className="px-4 py-2 text-left">Entrada B</th>
                                  <th className="px-4 py-2 text-left">Saída</th>
                                </>
                              )}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {selectedGate.truthTable.map((row, rowIndex) => (
                              <tr key={rowIndex}>
                                {row.map((value, colIndex) => {
                                  // Skip the last column for display if it's the output
                                  if (
                                    (selectedGate.id === "not" && colIndex > 0) ||
                                    (selectedGate.id !== "not" && colIndex > 1)
                                  )
                                    return null
                                  return (
                                    <td key={colIndex} className="px-4 py-2">
                                      <Badge variant={value ? "default" : "outline"}>{value ? "1" : "0"}</Badge>
                                    </td>
                                  )
                                })}
                                <td className="px-4 py-2">
                                  <Badge
                                    variant={
                                      selectedGate.id === "not"
                                        ? row[1]
                                          ? "default"
                                          : "outline"
                                        : row[2]
                                          ? "default"
                                          : "outline"
                                    }
                                  >
                                    {selectedGate.id === "not" ? (row[1] ? "1" : "0") : row[2] ? "1" : "0"}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <HelpCircle className="h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold">Selecione uma porta lógica</h3>
                    <p className="text-gray-600 mt-2">
                      Escolha uma porta lógica no painel à esquerda para ver sua descrição, simular seu funcionamento e
                      visualizar sua tabela verdade.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="challenge" className="space-y-4">
            {gameCompleted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="p-6 bg-green-50 border-green-200">
                  <div className="text-center space-y-4">
                    <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
                    <h3 className="text-2xl font-bold">Parabéns!</h3>
                    <p className="text-lg">Você completou todos os desafios do Simulador de Portas Lógicas!</p>
                    <div className="text-xl font-bold">Pontuação final: {score} pontos</div>
                    <div className="text-lg">Tempo total: {formatTime(elapsedTime)}</div>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                      <Button onClick={() => window.location.reload()}>Jogar Novamente</Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          saveGameResults()
                          router.push("/performance")
                        }}
                      >
                        Ver Desempenho Geral
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="md:w-1/4 space-y-4">
                    <h3 className="text-lg font-semibold">Desafios</h3>
                    <div className="space-y-2">
                      {challenges.map((challenge, index) => (
                        <Button
                          key={challenge.id}
                          variant={currentChallenge?.id === challenge.id ? "default" : "outline"}
                          className="w-full justify-between"
                          onClick={() => handleChallengeSelect(challenge)}
                        >
                          <span className="truncate">{challenge.title}</span>
                          {completedChallenges.includes(challenge.id) && (
                            <CheckCircle2 className="h-4 w-4 ml-2 text-green-500" />
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="md:w-3/4 space-y-4">
                    {currentChallenge && (
                      <>
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold">{currentChallenge.title}</h3>
                          <Badge
                            variant={
                              currentChallenge.difficulty === "fácil"
                                ? "outline"
                                : currentChallenge.difficulty === "médio"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {currentChallenge.difficulty}
                          </Badge>
                        </div>
                        <p className="text-gray-600">{currentChallenge.description}</p>

                        <div className="bg-gray-100 p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Portas disponíveis</h4>
                          <div className="flex flex-wrap gap-2">
                            {currentChallenge.gates.map((gateId) => {
                              const gate = logicGates.find((g) => g.id === gateId)
                              return gate ? (
                                <div key={gate.id} className="flex items-center p-2 bg-white rounded-md border">
                                  <div className="w-8 h-8 mr-2 flex items-center justify-center">{gate.symbol}</div>
                                  <span>{gate.name}</span>
                                </div>
                              ) : null
                            })}
                          </div>
                        </div>

                        <div className="bg-gray-100 p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Tabela Verdade do Desafio</h4>
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead>
                                <tr>
                                  {currentChallenge.inputs[0].map((_, index) => (
                                    <th key={index} className="px-4 py-2 text-left">
                                      Entrada {index + 1}
                                    </th>
                                  ))}
                                  <th className="px-4 py-2 text-left">Sua Saída</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {currentChallenge.inputs.map((inputRow, rowIndex) => (
                                  <tr key={rowIndex}>
                                    {inputRow.map((input, colIndex) => (
                                      <td key={colIndex} className="px-4 py-2">
                                        <Badge variant={input ? "default" : "outline"}>{input ? "1" : "0"}</Badge>
                                      </td>
                                    ))}
                                    <td className="px-4 py-2">
                                      <Switch
                                        checked={userOutputs[rowIndex]}
                                        onCheckedChange={(checked) => handleUserOutputChange(rowIndex, checked)}
                                      />
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {showHint && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-blue-50 p-4 rounded-lg text-blue-700"
                          >
                            <div className="flex items-start">
                              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                              <div>
                                <h4 className="font-medium">Dica:</h4>
                                <p>
                                  Analise cuidadosamente a tabela verdade e pense em como as portas lógicas disponíveis
                                  podem ser combinadas para produzir as saídas esperadas.
                                </p>
                                {currentChallenge.gates.length > 1 && (
                                  <p className="mt-2">
                                    Este desafio requer a combinação de múltiplas portas lógicas. Tente identificar
                                    padrões na tabela verdade.
                                  </p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}

                        <div className="flex justify-between">
                          <Button variant="outline" onClick={resetChallenge}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Reiniciar
                          </Button>
                          <div className="space-x-2">
                            <Button variant="outline" onClick={() => setShowHint(true)}>
                              <HelpCircle className="mr-2 h-4 w-4" />
                              Dica
                            </Button>
                            <Button onClick={checkChallenge}>
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Verificar
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
