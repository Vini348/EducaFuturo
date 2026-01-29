"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Shuffle, Clock } from "lucide-react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

interface Component {
  id: number
  name: string
  symbol: React.ReactNode
  description: string
  color: string
}

const components: Component[] = [
  {
    id: 1,
    name: "Indutor",
    symbol: (
      <svg viewBox="0 0 100 40" className="w-16 h-8">
        <path d="M10,20 Q25,5 40,20 Q55,35 70,20 Q85,5 100,20" stroke="currentColor" strokeWidth="4" fill="none" />
      </svg>
    ),
    description: "Armazena energia em um campo magnético",
    color: "#4CAF50",
  },
  {
    id: 2,
    name: "Transistor",
    symbol: (
      <svg viewBox="0 0 100 100" className="w-16 h-16">
        <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="4" />
        <line x1="50" y1="30" x2="90" y2="10" stroke="currentColor" strokeWidth="4" />
        <line x1="50" y1="70" x2="90" y2="90" stroke="currentColor" strokeWidth="4" />
        <polygon points="85,85 95,95 95,75" fill="currentColor" />
      </svg>
    ),
    description: "Componente semicondutor para amplificação ou chaveamento",
    color: "#9C27B0",
  },
  {
    id: 3,
    name: "Diodo",
    symbol: (
      <svg viewBox="0 0 100 60" className="w-16 h-10">
        <polygon points="10,30 50,10 50,50" fill="currentColor" />
        <line x1="50" y1="10" x2="50" y2="50" stroke="currentColor" strokeWidth="4" />
        <line x1="50" y1="30" x2="90" y2="30" stroke="currentColor" strokeWidth="4" />
      </svg>
    ),
    description: "Permite o fluxo de corrente em uma direção",
    color: "#FF5722",
  },
  {
    id: 4,
    name: "Amplificador Operacional",
    symbol: (
      <svg viewBox="0 0 100 80" className="w-16 h-12">
        <polygon points="10,10 10,70 90,40" fill="none" stroke="currentColor" strokeWidth="4" />
        <line x1="25" y1="30" x2="10" y2="30" stroke="currentColor" strokeWidth="4" />
        <line x1="25" y1="50" x2="10" y2="50" stroke="currentColor" strokeWidth="4" />
        <text x="20" y="35" fontSize="20" fill="currentColor">
          +
        </text>
        <text x="20" y="60" fontSize="20" fill="currentColor">
          -
        </text>
      </svg>
    ),
    description: "Amplificador de alta precisão",
    color: "#00BCD4",
  },
  {
    id: 5,
    name: "LED",
    symbol: (
      <svg viewBox="0 0 100 80" className="w-16 h-12">
        <polygon points="10,40 50,10 50,70" fill="currentColor" />
        <line x1="50" y1="10" x2="50" y2="70" stroke="currentColor" strokeWidth="4" />
        <line x1="50" y1="40" x2="90" y2="40" stroke="currentColor" strokeWidth="4" />
        <line x1="60" y1="10" x2="80" y2="0" stroke="currentColor" strokeWidth="2" />
        <line x1="70" y1="20" x2="90" y2="10" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    description: "Diodo emissor de luz",
    color: "#E91E63",
  },
  {
    id: 6,
    name: "Resistor",
    symbol: (
      <svg viewBox="0 0 100 40" className="w-16 h-8">
        <path
          d="M10,20 L30,20 L35,10 L45,30 L55,10 L65,30 L75,10 L80,20 L100,20"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
      </svg>
    ),
    description: "Componente que limita o fluxo de corrente elétrica",
    color: "#FF9800",
  },
  {
    id: 7,
    name: "Terra",
    symbol: (
      <svg viewBox="0 0 100 80" className="w-16 h-12">
        <line x1="50" y1="10" x2="50" y2="40" stroke="currentColor" strokeWidth="4" />
        <line x1="30" y1="40" x2="70" y2="40" stroke="currentColor" strokeWidth="4" />
        <line x1="35" y1="50" x2="65" y2="50" stroke="currentColor" strokeWidth="4" />
        <line x1="40" y1="60" x2="60" y2="60" stroke="currentColor" strokeWidth="4" />
      </svg>
    ),
    description: "Referência de tensão zero do circuito",
    color: "#795548",
  },
  {
    id: 8,
    name: "Transformador",
    symbol: (
      <svg viewBox="0 0 100 80" className="w-16 h-12">
        <circle cx="30" cy="40" r="20" fill="none" stroke="currentColor" strokeWidth="4" />
        <circle cx="70" cy="40" r="20" fill="none" stroke="currentColor" strokeWidth="4" />
        <line x1="50" y1="10" x2="50" y2="70" stroke="currentColor" strokeWidth="4" />
      </svg>
    ),
    description: "Transfere energia entre circuitos por indução",
    color: "#3F51B5",
  },
]

export function ComponentMatchingGame() {
  const router = useRouter()
  const [shuffledNames, setShuffledNames] = useState<Component[]>([])
  const [shuffledSymbols, setShuffledSymbols] = useState<Component[]>([])
  const [selectedName, setSelectedName] = useState<number | null>(null)
  const [selectedSymbol, setSelectedSymbol] = useState<number | null>(null)
  const [matchedPairs, setMatchedPairs] = useState<number[]>([])
  const [showCongrats, setShowCongrats] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [endTime, setEndTime] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState<string>("00:00")
  const [gameStarted, setGameStarted] = useState(false)
  const [buttonText, setButtonText] = useState("Iniciar Jogo")
  const [wrongAttempts, setWrongAttempts] = useState(0)

  const shuffleArray = useCallback((array: Component[]) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }, [])

  useEffect(() => {
    if (gameStarted) {
      setShuffledNames(shuffleArray(components))
      setShuffledSymbols(shuffleArray(components))
      setStartTime(Date.now())
    }
  }, [gameStarted, shuffleArray])

  useEffect(() => {
    if (gameStarted && startTime && !endTime) {
      const timer = setInterval(() => {
        const now = Date.now()
        const elapsed = Math.floor((now - startTime) / 1000)
        const minutes = Math.floor(elapsed / 60)
        const seconds = elapsed % 60
        setElapsedTime(`${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`)
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [gameStarted, startTime, endTime])

  const handleNameClick = (id: number) => {
    if (!gameStarted) return
    if (selectedName === id || matchedPairs.includes(id)) return
    setSelectedName(id)
    checkMatch(id, selectedSymbol)
  }

  const handleSymbolClick = (id: number) => {
    if (!gameStarted) return
    if (selectedSymbol === id || matchedPairs.includes(id)) return
    setSelectedSymbol(id)
    checkMatch(selectedName, id)
  }

  const checkMatch = (nameId: number | null, symbolId: number | null) => {
    if (nameId !== null && symbolId !== null) {
      if (nameId === symbolId) {
        setMatchedPairs((prev) => {
          const newMatches = [...prev, nameId]
          if (newMatches.length === components.length) {
            setEndTime(Date.now())
            setShowCongrats(true)
          }
          return newMatches
        })
      } else {
        setWrongAttempts((prev) => prev + 1)
      }
      setSelectedName(null)
      setSelectedSymbol(null)
    }
  }

  const resetGame = () => {
    setShuffledNames(shuffleArray(components))
    setShuffledSymbols(shuffleArray(components))
    setSelectedName(null)
    setSelectedSymbol(null)
    setMatchedPairs([])
    setShowCongrats(false)
    setStartTime(null)
    setEndTime(null)
    setElapsedTime("00:00")
    setGameStarted(false)
    setButtonText("Iniciar Jogo")
    setWrongAttempts(0)
  }

  const startGame = () => {
    if (!gameStarted) {
      setGameStarted(true)
      setStartTime(Date.now())
      setButtonText("Reiniciar Jogo")
      setShuffledNames(shuffleArray(components))
      setShuffledSymbols(shuffleArray(components))
    } else {
      resetGame()
    }
  }

  const saveGameResults = async () => {
    try {
      const totalTime = endTime && startTime ? Math.floor((endTime - startTime) / 1000) : 0
      const accuracy = ((components.length - wrongAttempts) / components.length) * 100

      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError

      const { error } = await supabase.from("game_results").insert({
        user_id: userData.user.id,
        game_type: "component_matching",
        score: matchedPairs.length,
        total_time: totalTime,
        accuracy: accuracy,
        challenges_completed: matchedPairs.length,
      })

      if (error) throw error
    } catch (err) {
      console.error("Error saving game results:", err)
    }
  }

  return (
    <TooltipProvider>
      <div className="space-y-8 p-6 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Jogo de Correspondência</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-lg font-mono">
              <Clock className="h-5 w-5" />
              {elapsedTime}
            </div>
            <Button onClick={startGame} variant="outline" size="lg" className="flex items-center">
              {gameStarted ? <Shuffle className="mr-2 h-6 w-6" /> : null}
              {buttonText}
            </Button>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6">
            <h3 className="font-semibold text-xl mb-6">Nomes dos Componentes</h3>
            <div className="grid grid-cols-1 gap-4">
              {shuffledNames.map((component) => (
                <Button
                  key={`name-${component.id}`}
                  onClick={() => handleNameClick(component.id)}
                  variant={selectedName === component.id ? "secondary" : "outline"}
                  className={`h-20 text-lg ${
                    matchedPairs.includes(component.id) ? "bg-green-100 hover:bg-green-200 text-green-800" : ""
                  }`}
                  disabled={matchedPairs.includes(component.id) || !gameStarted}
                >
                  {component.name}
                  {matchedPairs.includes(component.id) && <CheckCircle2 className="ml-2 h-6 w-6 text-green-600" />}
                </Button>
              ))}
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold text-xl mb-6">Símbolos dos Componentes</h3>
            <div className="grid grid-cols-1 gap-4">
              {shuffledSymbols.map((component) => (
                <Button
                  key={`symbol-${component.id}`}
                  onClick={() => handleSymbolClick(component.id)}
                  variant={selectedSymbol === component.id ? "secondary" : "outline"}
                  className={`h-20 ${matchedPairs.includes(component.id) ? "bg-green-100 hover:bg-green-200" : ""}`}
                  disabled={matchedPairs.includes(component.id) || !gameStarted}
                >
                  <div
                    className={`w-16 h-16 flex items-center justify-center ${
                      matchedPairs.includes(component.id) ? `text-[${component.color}]` : "text-current"
                    }`}
                  >
                    {component.symbol}
                  </div>
                  {matchedPairs.includes(component.id) && <CheckCircle2 className="ml-2 h-6 w-6 text-green-600" />}
                </Button>
              ))}
            </div>
          </Card>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-xl font-semibold">
            Pares encontrados: {matchedPairs.length} / {components.length}
          </p>
        </div>
        {showCongrats && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8 bg-green-100 text-green-800">
              <h3 className="text-3xl font-bold text-center mb-4">Parabéns!</h3>
              <p className="text-center text-xl mb-4">
                Você completou o jogo em {elapsedTime}! Sua compreensão dos símbolos de componentes eletrônicos é
                impressionante.
              </p>
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
            </Card>
          </motion.div>
        )}
      </div>
    </TooltipProvider>
  )
}
