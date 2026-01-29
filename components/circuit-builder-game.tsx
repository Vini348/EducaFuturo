"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, Reorder } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, Zap, Trophy, Shuffle, Clock, XCircle } from "lucide-react"
import confetti from "canvas-confetti"
import { ErrorBoundary } from "react-error-boundary"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

interface CircuitComponent {
  id: string
  name: string
  symbol: React.ReactNode
  type: "input" | "output" | "component"
  connections: {
    input: string[]
    output: string[]
  }
  isWrong?: boolean
}

interface Challenge {
  id: string
  title: string
  description: string
  components: CircuitComponent[]
  correctOrder: string[]
  points: number
  hint: string
}

const allChallenges: Challenge[] = [
  {
    id: "1",
    title: "Circuito Simples",
    description: "Monte um circuito simples com uma fonte, um resistor e um LED",
    components: [
      {
        id: "battery",
        name: "Fonte",
        symbol: (
          <svg viewBox="0 0 100 60" className="w-12 h-12">
            <line x1="30" y1="10" x2="30" y2="50" stroke="currentColor" strokeWidth="4" />
            <line x1="50" y1="20" x2="50" y2="40" stroke="currentColor" strokeWidth="8" />
            <text x="15" y="30" fontSize="12" fill="currentColor">
              +
            </text>
            <text x="55" y="30" fontSize="12" fill="currentColor">
              -
            </text>
          </svg>
        ),
        type: "input",
        connections: {
          input: [],
          output: ["resistor"],
        },
      },
      {
        id: "resistor",
        name: "Resistor",
        symbol: (
          <svg viewBox="0 0 100 40" className="w-12 h-8">
            <path
              d="M10,20 L30,20 L35,10 L45,30 L55,10 L65,30 L75,10 L80,20 L100,20"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
          </svg>
        ),
        type: "component",
        connections: {
          input: ["battery"],
          output: ["led"],
        },
      },
      {
        id: "led",
        name: "LED",
        symbol: (
          <svg viewBox="0 0 100 60" className="w-12 h-12">
            <polygon points="50,10 70,40 30,40" stroke="currentColor" strokeWidth="4" fill="none" />
            <line x1="50" y1="40" x2="50" y2="60" stroke="currentColor" strokeWidth="4" />
            <line x1="30" y1="60" x2="70" y2="60" stroke="currentColor" strokeWidth="4" />
          </svg>
        ),
        type: "output",
        connections: {
          input: ["resistor"],
          output: [],
        },
      },
    ],
    correctOrder: ["battery", "resistor", "led"],
    points: 100,
    hint: "Lembre-se de que a corrente flui do positivo para o negativo. O resistor protege o LED de correntes excessivas.",
  },
  {
    id: "2",
    title: "Divisor de Tensão",
    description: "Crie um divisor de tensão usando dois resistores",
    components: [
      {
        id: "battery",
        name: "Fonte",
        symbol: (
          <svg viewBox="0 0 100 60" className="w-12 h-12">
            <line x1="30" y1="10" x2="30" y2="50" stroke="currentColor" strokeWidth="4" />
            <line x1="50" y1="20" x2="50" y2="40" stroke="currentColor" strokeWidth="8" />
            <text x="15" y="30" fontSize="12" fill="currentColor">
              +
            </text>
            <text x="55" y="30" fontSize="12" fill="currentColor">
              -
            </text>
          </svg>
        ),
        type: "input",
        connections: {
          input: [],
          output: ["resistor1"],
        },
      },
      {
        id: "resistor1",
        name: "Resistor 1",
        symbol: (
          <svg viewBox="0 0 100 40" className="w-12 h-8">
            <path
              d="M10,20 L30,20 L35,10 L45,30 L55,10 L65,30 L75,10 L80,20 L100,20"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
          </svg>
        ),
        type: "component",
        connections: {
          input: ["battery"],
          output: ["resistor2"],
        },
      },
      {
        id: "resistor2",
        name: "Resistor 2",
        symbol: (
          <svg viewBox="0 0 100 40" className="w-12 h-8">
            <path
              d="M10,20 L30,20 L35,10 L45,30 L55,10 L65,30 L75,10 L80,20 L100,20"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
          </svg>
        ),
        type: "component",
        connections: {
          input: ["resistor1"],
          output: ["ground"],
        },
      },
      {
        id: "ground",
        name: "Terra",
        symbol: (
          <svg viewBox="0 0 100 60" className="w-12 h-12">
            <line x1="50" y1="10" x2="50" y2="30" stroke="currentColor" strokeWidth="4" />
            <line x1="30" y1="30" x2="70" y2="30" stroke="currentColor" strokeWidth="4" />
            <line x1="40" y1="40" x2="60" y2="40" stroke="currentColor" strokeWidth="4" />
            <line x1="45" y1="50" x2="55" y2="50" stroke="currentColor" strokeWidth="4" />
          </svg>
        ),
        type: "output",
        connections: {
          input: ["resistor2"],
          output: [],
        },
      },
    ],
    correctOrder: ["battery", "resistor1", "resistor2", "ground"],
    points: 150,
    hint: "Um divisor de tensão divide a tensão de entrada entre dois resistores. A tensão de saída é medida entre os dois resistores.",
  },
  {
    id: "3",
    title: "Ponte Retificadora",
    description: "Monte uma ponte retificadora usando quatro diodos",
    components: [
      {
        id: "ac_source",
        name: "Fonte AC",
        symbol: (
          <svg viewBox="0 0 100 60" className="w-12 h-12">
            <circle cx="50" cy="30" r="20" stroke="currentColor" strokeWidth="4" fill="none" />
            <path d="M30,30 Q40,10 50,30 Q60,50 70,30" stroke="currentColor" strokeWidth="4" fill="none" />
          </svg>
        ),
        type: "input",
        connections: {
          input: [],
          output: ["diode1", "diode3"],
        },
      },
      {
        id: "diode1",
        name: "Diodo 1",
        symbol: (
          <svg viewBox="0 0 100 60" className="w-12 h-12">
            <polygon points="30,30 70,30 50,50" stroke="currentColor" strokeWidth="4" fill="none" />
            <line x1="30" y1="30" x2="70" y2="30" stroke="currentColor" strokeWidth="4" />
          </svg>
        ),
        type: "component",
        connections: {
          input: ["ac_source"],
          output: ["output_pos"],
        },
      },
      {
        id: "diode2",
        name: "Diodo 2",
        symbol: (
          <svg viewBox="0 0 100 60" className="w-12 h-12">
            <polygon points="30,30 70,30 50,50" stroke="currentColor" strokeWidth="4" fill="none" />
            <line x1="30" y1="30" x2="70" y2="30" stroke="currentColor" strokeWidth="4" />
          </svg>
        ),
        type: "component",
        connections: {
          input: ["output_neg"],
          output: ["ac_source"],
        },
      },
      {
        id: "diode3",
        name: "Diodo 3",
        symbol: (
          <svg viewBox="0 0 100 60" className="w-12 h-12">
            <polygon points="30,30 70,30 50,50" stroke="currentColor" strokeWidth="4" fill="none" />
            <line x1="30" y1="30" x2="70" y2="30" stroke="currentColor" strokeWidth="4" />
          </svg>
        ),
        type: "component",
        connections: {
          input: ["ac_source"],
          output: ["output_neg"],
        },
      },
      {
        id: "diode4",
        name: "Diodo 4",
        symbol: (
          <svg viewBox="0 0 100 60" className="w-12 h-12">
            <polygon points="30,30 70,30 50,50" stroke="currentColor" strokeWidth="4" fill="none" />
            <line x1="30" y1="30" x2="70" y2="30" stroke="currentColor" strokeWidth="4" />
          </svg>
        ),
        type: "component",
        connections: {
          input: ["output_pos"],
          output: ["ac_source"],
        },
      },
      {
        id: "output_pos",
        name: "Saída +",
        symbol: (
          <svg viewBox="0 0 100 60" className="w-12 h-12">
            <circle cx="50" cy="30" r="20" stroke="currentColor" strokeWidth="4" fill="none" />
            <text x="40" y="35" fontSize="20" fill="currentColor">
              +
            </text>
          </svg>
        ),
        type: "output",
        connections: {
          input: ["diode1", "diode4"],
          output: [],
        },
      },
      {
        id: "output_neg",
        name: "Saída -",
        symbol: (
          <svg viewBox="0 0 100 60" className="w-12 h-12">
            <circle cx="50" cy="30" r="20" stroke="currentColor" strokeWidth="4" fill="none" />
            <text x="40" y="35" fontSize="20" fill="currentColor">
              -
            </text>
          </svg>
        ),
        type: "output",
        connections: {
          input: ["diode2", "diode3"],
          output: [],
        },
      },
    ],
    correctOrder: ["ac_source", "diode1", "diode2", "diode3", "diode4", "output_pos", "output_neg"],
    points: 200,
    hint: "Uma ponte retificadora converte corrente alternada (AC) em corrente contínua (DC). Os diodos devem ser organizados para permitir o fluxo de corrente em ambas as direções do ciclo AC.",
  },
  {
    id: "4",
    title: "Circuito Amplificador Simples",
    description: "Monte um circuito amplificador básico com um transistor",
    components: [
      {
        id: "battery",
        name: "Fonte",
        symbol: (
          <svg viewBox="0 0 100 60" className="w-12 h-12">
            <line x1="30" y1="10" x2="30" y2="50" stroke="currentColor" strokeWidth="4" />
            <line x1="50" y1="20" x2="50" y2="40" stroke="currentColor" strokeWidth="8" />
            <text x="15" y="30" fontSize="12" fill="currentColor">
              +
            </text>
            <text x="55" y="30" fontSize="12" fill="currentColor">
              -
            </text>
          </svg>
        ),
        type: "input",
        connections: {
          input: [],
          output: ["resistor1", "transistor"],
        },
      },
      {
        id: "resistor1",
        name: "Resistor de Base",
        symbol: (
          <svg viewBox="0 0 100 40" className="w-12 h-8">
            <path
              d="M10,20 L30,20 L35,10 L45,30 L55,10 L65,30 L75,10 L80,20 L100,20"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
          </svg>
        ),
        type: "component",
        connections: {
          input: ["battery"],
          output: ["transistor"],
        },
      },
      {
        id: "transistor",
        name: "Transistor",
        symbol: (
          <svg viewBox="0 0 100 100" className="w-12 h-12">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="4" fill="none" />
            <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="4" />
            <line x1="50" y1="50" x2="90" y2="30" stroke="currentColor" strokeWidth="4" />
            <line x1="50" y1="50" x2="90" y2="70" stroke="currentColor" strokeWidth="4" />
          </svg>
        ),
        type: "component",
        connections: {
          input: ["resistor1", "battery"],
          output: ["resistor2"],
        },
      },
      {
        id: "resistor2",
        name: "Resistor de Coletor",
        symbol: (
          <svg viewBox="0 0 100 40" className="w-12 h-8">
            <path
              d="M10,20 L30,20 L35,10 L45,30 L55,10 L65,30 L75,10 L80,20 L100,20"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
          </svg>
        ),
        type: "component",
        connections: {
          input: ["transistor"],
          output: ["ground"],
        },
      },
      {
        id: "ground",
        name: "Terra",
        symbol: (
          <svg viewBox="0 0 100 60" className="w-12 h-12">
            <line x1="50" y1="10" x2="50" y2="30" stroke="currentColor" strokeWidth="4" />
            <line x1="30" y1="30" x2="70" y2="30" stroke="currentColor" strokeWidth="4" />
            <line x1="40" y1="40" x2="60" y2="40" stroke="currentColor" strokeWidth="4" />
            <line x1="45" y1="50" x2="55" y2="50" stroke="currentColor" strokeWidth="4" />
          </svg>
        ),
        type: "output",
        connections: {
          input: ["resistor2"],
          output: [],
        },
      },
    ],
    correctOrder: ["battery", "resistor1", "transistor", "resistor2", "ground"],
    points: 250,
    hint: "O transistor amplifica o sinal de entrada. Certifique-se de que a base, o coletor e o emissor estão conectados corretamente.",
  },
  {
    id: "5",
    title: "Circuito Oscilador",
    description: "Monte um circuito oscilador simples usando um capacitor e um indutor",
    components: [
      {
        id: "battery",
        name: "Fonte",
        symbol: (
          <svg viewBox="0 0 100 60" className="w-12 h-12">
            <line x1="30" y1="10" x2="30" y2="50" stroke="currentColor" strokeWidth="4" />
            <line x1="50" y1="20" x2="50" y2="40" stroke="currentColor" strokeWidth="8" />
            <text x="15" y="30" fontSize="12" fill="currentColor">
              +
            </text>
            <text x="55" y="30" fontSize="12" fill="currentColor">
              -
            </text>
          </svg>
        ),
        type: "input",
        connections: {
          input: [],
          output: ["inductor"],
        },
      },
      {
        id: "inductor",
        name: "Indutor",
        symbol: (
          <svg viewBox="0 0 100 40" className="w-12 h-8">
            <path d="M10,20 C25,5 35,35 50,20 C65,5 75,35 90,20" stroke="currentColor" strokeWidth="4" fill="none" />
          </svg>
        ),
        type: "component",
        connections: {
          input: ["battery"],
          output: ["capacitor"],
        },
      },
      {
        id: "capacitor",
        name: "Capacitor",
        symbol: (
          <svg viewBox="0 0 100 60" className="w-12 h-12">
            <line x1="40" y1="10" x2="40" y2="50" stroke="currentColor" strokeWidth="4" />
            <line x1="60" y1="10" x2="60" y2="50" stroke="currentColor" strokeWidth="4" />
          </svg>
        ),
        type: "component",
        connections: {
          input: ["inductor"],
          output: ["resistor"],
        },
      },
      {
        id: "resistor",
        name: "Resistor",
        symbol: (
          <svg viewBox="0 0 100 40" className="w-12 h-8">
            <path
              d="M10,20 L30,20 L35,10 L45,30 L55,10 L65,30 L75,10 L80,20 L100,20"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
          </svg>
        ),
        type: "component",
        connections: {
          input: ["capacitor"],
          output: ["ground"],
        },
      },
      {
        id: "ground",
        name: "Terra",
        symbol: (
          <svg viewBox="0 0 100 60" className="w-12 h-12">
            <line x1="50" y1="10" x2="50" y2="30" stroke="currentColor" strokeWidth="4" />
            <line x1="30" y1="30" x2="70" y2="30" stroke="currentColor" strokeWidth="4" />
            <line x1="40" y1="40" x2="60" y2="40" stroke="currentColor" strokeWidth="4" />
            <line x1="45" y1="50" x2="55" y2="50" stroke="currentColor" strokeWidth="4" />
          </svg>
        ),
        type: "output",
        connections: {
          input: ["resistor"],
          output: [],
        },
      },
    ],
    correctOrder: ["battery", "inductor", "capacitor", "resistor", "ground"],
    points: 300,
    hint: "O circuito oscilador LC usa a interação entre o indutor e o capacitor para gerar oscilações. O resistor ajuda a controlar a amplitude.",
  },
]

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert" className="p-4 bg-red-100 border border-red-400 rounded-lg">
      <h2 className="text-lg font-semibold text-red-800">Oops! Something went wrong:</h2>
      <pre className="mt-2 text-sm text-red-600">{error.message}</pre>
      <Button onClick={resetErrorBoundary} className="mt-4">
        Try again
      </Button>
    </div>
  )
}

export function CircuitBuilderGame() {
  const router = useRouter()
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [currentChallenge, setCurrentChallenge] = useState(0)
  const [components, setComponents] = useState<CircuitComponent[]>([])
  const [score, setScore] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [wrongAttempts, setWrongAttempts] = useState(0)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [startTime, setStartTime] = useState(Date.now())
  const [challengeTimes, setChallengeTimes] = useState<number[]>([])
  const [challengeErrors, setChallengeErrors] = useState<number[]>([])
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    try {
      // Shuffle challenges when the game starts
      setChallenges(shuffleArray(allChallenges))
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An unknown error occurred"))
    }
  }, [])

  useEffect(() => {
    if (challenges.length > 0) {
      try {
        setComponents(shuffleArray(challenges[currentChallenge].components))
        setWrongAttempts(0)
        setStartTime(Date.now())
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An unknown error occurred"))
      }
    }
  }, [currentChallenge, challenges])

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const checkCircuit = () => {
    try {
      const currentOrder = components.map((c) => c.id)
      const isCorrect = challenges[currentChallenge].correctOrder.every((id, index) => id === currentOrder[index])

      if (!isCorrect) {
        setWrongAttempts((prev) => prev + 1)
        if (wrongAttempts >= 1) {
          setShowHint(true)
        }
        setComponents((prevComponents) => {
          return prevComponents.map((component, index) => ({
            ...component,
            isWrong: challenges[currentChallenge].correctOrder[index] !== component.id,
          }))
        })
      } else {
        setIsCorrect(true)
        const challengeTime = Math.floor((Date.now() - startTime) / 1000) // Time in seconds
        setChallengeTimes((prev) => [...prev, challengeTime])
        setChallengeErrors((prev) => [...prev, wrongAttempts])
        setScore((prev) => prev + challenges[currentChallenge].points)
        setWrongAttempts(0)
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        }).catch((err) => {
          console.error("Error with confetti:", err)
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An unknown error occurred"))
    }
  }

  const nextChallenge = () => {
    try {
      if (currentChallenge < challenges.length - 1) {
        setCurrentChallenge((prev) => prev + 1)
        setIsCorrect(false)
        setShowHint(false)
        setWrongAttempts(0)
        setComponents(shuffleArray(challenges[currentChallenge + 1].components))
      } else {
        setGameCompleted(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An unknown error occurred"))
    }
  }

  const restartChallenge = () => {
    try {
      setComponents(shuffleArray(challenges[currentChallenge].components))
      setIsCorrect(false)
      setShowHint(false)
      setWrongAttempts(0)
      setStartTime(Date.now())
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An unknown error occurred"))
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const saveGameResults = async () => {
    try {
      const totalTime = challengeTimes.reduce((a, b) => a + b, 0)
      const totalErrors = challengeErrors.reduce((a, b) => a + b, 0)
      const accuracy = ((challenges.length - totalErrors) / challenges.length) * 100

      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError

      const { error } = await supabase.from("game_results").insert({
        user_id: userData.user.id,
        game_type: "circuit_builder",
        score: score,
        total_time: totalTime,
        accuracy: accuracy,
        challenges_completed: challenges.length,
      })

      if (error) throw error
    } catch (err) {
      console.error("Error saving game results:", err)
      setError(err instanceof Error ? err : new Error("Failed to save game results"))
    }
  }

  if (error) {
    return <ErrorFallback error={error} resetErrorBoundary={() => setError(null)} />
  }

  if (gameCompleted) {
    const totalTime = challengeTimes.reduce((a, b) => a + b, 0)
    const totalErrors = challengeErrors.reduce((a, b) => a + b, 0)
    const accuracy = ((challenges.length - totalErrors) / challenges.length) * 100

    return (
      <div className="space-y-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-3xl font-bold text-center">Resumo de Desempenho</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <h3 className="text-xl font-semibold mb-2">Pontuação Total</h3>
            <p className="text-2xl font-bold text-green-600">{score} pontos</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-xl font-semibold mb-2">Tempo Total</h3>
            <p className="text-2xl font-bold text-blue-600">{formatTime(totalTime)}</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-xl font-semibold mb-2">Precisão Geral</h3>
            <p className="text-2xl font-bold text-purple-600">{accuracy.toFixed(2)}%</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-xl font-semibold mb-2">Desafios Completados</h3>
            <p className="text-2xl font-bold text-yellow-600">{challenges.length}</p>
          </Card>
        </div>
        <Card className="p-4">
          <h3 className="text-xl font-semibold mb-2">Desempenho por Desafio</h3>
          <ul className="space-y-2">
            {challenges.map((challenge, index) => (
              <li key={challenge.id} className="flex justify-between items-center">
                <span>{challenge.title}</span>
                <div>
                  <Badge variant="secondary" className="mr-2">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatTime(challengeTimes[index] || 0)}
                  </Badge>
                  <Badge variant={challengeErrors[index] > 0 ? "destructive" : "secondary"}>
                    <XCircle className="w-4 h-4 mr-1" />
                    {challengeErrors[index] || 0} erros
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        </Card>
        <div className="flex justify-center gap-4">
          <Button onClick={() => window.location.reload()} className="w-full md:w-auto">
            Jogar Novamente
          </Button>
          <Button
            onClick={() => {
              saveGameResults()
              router.push("/performance")
            }}
            className="w-full md:w-auto"
          >
            Ver Desempenho Geral
          </Button>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        setChallenges(shuffleArray(allChallenges))
        setCurrentChallenge(0)
        setScore(0)
        setGameCompleted(false)
      }}
    >
      <div className="space-y-8 p-6 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Construtor de Circuitos</h2>
          <Badge variant="secondary" className="text-lg">
            <Trophy className="h-5 w-5 mr-2" />
            {score} pontos
          </Badge>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{challenges[currentChallenge]?.title}</h3>
            <p className="text-gray-600">{challenges[currentChallenge]?.description}</p>

            <div className="my-8">
              <Reorder.Group
                axis="x"
                values={components}
                onReorder={setComponents}
                className="flex justify-center items-center gap-4"
              >
                {components.map((component) => (
                  <Reorder.Item
                    key={component.id}
                    value={component}
                    className={`p-4 bg-white rounded-lg shadow-sm cursor-grab ${
                      component.isWrong && !isCorrect
                        ? "border-2 border-red-500"
                        : isCorrect
                          ? "ring-2 ring-green-500"
                          : ""
                    }`}
                  >
                    <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col items-center gap-2">
                      {component.symbol}
                      <span className="text-sm font-medium">{component.name}</span>
                    </motion.div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </div>

            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => setShowHint(true)} className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Dica
              </Button>
              <Button
                onClick={checkCircuit}
                className="flex items-center gap-2"
                variant={isCorrect ? "outline" : "default"}
              >
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    Correto!
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5" />
                    Verificar Circuito
                  </>
                )}
              </Button>
              <Button onClick={restartChallenge} className="flex items-center gap-2" variant="outline">
                <Shuffle className="h-5 w-5" />
                Reiniciar Desafio
              </Button>
              {isCorrect && (
                <Button onClick={nextChallenge} className="flex items-center gap-2">
                  {currentChallenge === challenges.length - 1 ? "Finalizar" : "Próximo Desafio"}
                </Button>
              )}
            </div>

            {showHint && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-blue-50 rounded-lg text-blue-700"
              >
                <p>{challenges[currentChallenge]?.hint}</p>
              </motion.div>
            )}
          </div>
        </Card>
      </div>
    </ErrorBoundary>
  )
}
