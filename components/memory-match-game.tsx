"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, RotateCcw, Zap, CheckCircle2, Lightbulb, Calculator } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import Image from "next/image"
import confetti from "canvas-confetti"

interface MemoryCard {
  id: number
  name: string
  image?: string
  symbol?: React.ReactNode
  matched: boolean
  flipped: boolean
  category?: string
}

// Imagens de alta qualidade para componentes eletrônicos
const electronicComponentImages = [
  {
    id: 1,
    name: "Capacitor",
    image: "/images/components/capacitor-hq.png",
    category: "component",
  },
  {
    id: 2,
    name: "Resistor",
    image: "/images/components/resistor-hq.png",
    category: "component",
  },
  {
    id: 3,
    name: "Diodo",
    image: "/images/components/diode-hq.png",
    category: "component",
  },
  {
    id: 4,
    name: "LED",
    image: "/images/components/led-hq.png",
    category: "component",
  },
  {
    id: 5,
    name: "Transistor",
    image: "/images/components/transistor-hq.png",
    category: "component",
  },
  {
    id: 6,
    name: "Circuito Integrado",
    image: "/images/components/ic-chip-hq.png",
    category: "component",
  },
  {
    id: 7,
    name: "Indutor",
    image: "/images/components/inductor-hq.png",
    category: "component",
  },
  {
    id: 8,
    name: "Transformador",
    image: "/images/components/transformer-hq.png",
    category: "component",
  },
]

// Imagens de alta qualidade para fórmulas matemáticas
const formulaImages = [
  {
    id: 101,
    name: "Lei de Ohm",
    image: "/images/formulas/ohms-law.png",
    category: "formula",
  },
  {
    id: 102,
    name: "Lei da Potência",
    image: "/images/formulas/power-law.png",
    category: "formula",
  },
  {
    id: 103,
    name: "Lei de Kirchhoff",
    image: "/images/formulas/kirchhoff-law.png",
    category: "formula",
  },
  {
    id: 104,
    name: "Constante de Tempo RC",
    image: "/images/formulas/rc-time.png",
    category: "formula",
  },
  {
    id: 105,
    name: "Frequência de Ressonância",
    image: "/images/formulas/resonance.png",
    category: "formula",
  },
  {
    id: 106,
    name: "Impedância",
    image: "/images/formulas/impedance.png",
    category: "formula",
  },
]

const electronicSymbols = [
  {
    id: 201,
    name: "Resistor",
    symbol: (
      <svg viewBox="0 0 100 40" className="w-full h-full">
        <path
          d="M10,20 L30,20 L35,10 L45,30 L55,10 L65,30 L75,10 L80,20 L100,20"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
      </svg>
    ),
    category: "symbol",
  },
  {
    id: 202,
    name: "Capacitor",
    symbol: (
      <svg viewBox="0 0 100 60" className="w-full h-full">
        <line x1="40" y1="10" x2="40" y2="50" stroke="currentColor" strokeWidth="4" />
        <line x1="60" y1="10" x2="60" y2="50" stroke="currentColor" strokeWidth="4" />
      </svg>
    ),
    category: "symbol",
  },
  {
    id: 203,
    name: "Indutor",
    symbol: (
      <svg viewBox="0 0 100 40" className="w-full h-full">
        <path d="M10,20 C25,5 35,35 50,20 C65,5 75,35 90,20" stroke="currentColor" strokeWidth="4" fill="none" />
      </svg>
    ),
    category: "symbol",
  },
  {
    id: 204,
    name: "Diodo",
    symbol: (
      <svg viewBox="0 0 100 60" className="w-full h-full">
        <polygon points="30,30 70,30 50,50" stroke="currentColor" strokeWidth="4" fill="none" />
        <line x1="30" y1="30" x2="70" y2="30" stroke="currentColor" strokeWidth="4" />
      </svg>
    ),
    category: "symbol",
  },
  {
    id: 205,
    name: "Transistor",
    symbol: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="4" fill="none" />
        <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="4" />
        <line x1="50" y1="50" x2="90" y2="30" stroke="currentColor" strokeWidth="4" />
        <line x1="50" y1="50" x2="90" y2="70" stroke="currentColor" strokeWidth="4" />
      </svg>
    ),
    category: "symbol",
  },
  {
    id: 206,
    name: "LED",
    symbol: (
      <svg viewBox="0 0 100 60" className="w-full h-full">
        <polygon points="50,10 70,40 30,40" stroke="currentColor" strokeWidth="4" fill="none" />
        <line x1="50" y1="40" x2="50" y2="60" stroke="currentColor" strokeWidth="4" />
        <line x1="30" y1="60" x2="70" y2="60" stroke="currentColor" strokeWidth="4" />
      </svg>
    ),
    category: "symbol",
  },
  {
    id: 207,
    name: "Terra",
    symbol: (
      <svg viewBox="0 0 100 60" className="w-full h-full">
        <line x1="50" y1="10" x2="50" y2="30" stroke="currentColor" strokeWidth="4" />
        <line x1="30" y1="30" x2="70" y2="30" stroke="currentColor" strokeWidth="4" />
        <line x1="40" y1="40" x2="60" y2="40" stroke="currentColor" strokeWidth="4" />
        <line x1="45" y1="50" x2="55" y2="50" stroke="currentColor" strokeWidth="4" />
      </svg>
    ),
    category: "symbol",
  },
  {
    id: 208,
    name: "Amplificador Operacional",
    symbol: (
      <svg viewBox="0 0 100 80" className="w-full h-full">
        <polygon points="10,10 10,70 90,40" fill="none" stroke="currentColor" strokeWidth="4" />
        <line x1="25" y1="30" x2="10" y2="30" stroke="currentColor" strokeWidth="4" />
        <line x1="25" y1="50" x2="10" y2="50" stroke="currentColor" strokeWidth="4" />
      </svg>
    ),
    category: "symbol",
  },
]

export function MemoryMatchGame() {
  const [cards, setCards] = useState<MemoryCard[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState<number>(0)
  const [moves, setMoves] = useState<number>(0)
  const [gameStarted, setGameStarted] = useState<boolean>(false)
  const [gameCompleted, setGameCompleted] = useState<boolean>(false)
  const [timer, setTimer] = useState<number>(0)
  const [difficulty, setDifficulty] = useState<"fácil" | "médio" | "difícil">("fácil")
  const [score, setScore] = useState<number>(0)
  const [category, setCategory] = useState<"components" | "formulas" | "symbols" | "mixed">("components")
  const { toast } = useToast()
  const router = useRouter()
  const [accuracy, setAccuracy] = useState<number>(0)

  // Initialize game
  useEffect(() => {
    if (gameStarted) {
      initializeGame()
    }
  }, [gameStarted, difficulty, category])

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (gameStarted && !gameCompleted) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameStarted, gameCompleted])

  // Check for game completion
  useEffect(() => {
    if (gameStarted && matchedPairs === getCardCount() / 2) {
      setGameCompleted(true)
      calculateScore()
    }
  }, [matchedPairs, gameStarted])

  const getCardCount = () => {
    switch (difficulty) {
      case "fácil":
        return 8 // 4 pares
      case "médio":
        return 12 // 6 pares
      case "difícil":
        return 16 // 8 pares
      default:
        return 8
    }
  }

  const initializeGame = () => {
    const cardCount = getCardCount()
    let cardPairs: MemoryCard[] = []
    let itemsToUse: any[] = []

    // Selecionar os itens com base na categoria escolhida
    switch (category) {
      case "components":
        itemsToUse = shuffleArray([...electronicComponentImages])
        break
      case "formulas":
        itemsToUse = shuffleArray([...formulaImages])
        break
      case "symbols":
        itemsToUse = shuffleArray([...electronicSymbols])
        break
      case "mixed":
        // Combinar componentes e fórmulas para o modo misto
        const allItems = [...electronicComponentImages, ...formulaImages, ...electronicSymbols]
        itemsToUse = shuffleArray(allItems)
        break
    }

    // Limitar ao número necessário de pares
    itemsToUse = itemsToUse.slice(0, cardCount / 2)

    // Criar pares de cartas
    itemsToUse.forEach((item) => {
      // Primeira carta do par
      cardPairs.push({
        id: item.id,
        name: item.name,
        image: item.image,
        symbol: item.symbol,
        matched: false,
        flipped: false,
        category: item.category,
      })

      // Segunda carta do par
      cardPairs.push({
        id: item.id + 1000, // Adicionar 1000 para criar um ID único para o segundo cartão
        name: item.name,
        image: item.image,
        symbol: item.symbol,
        matched: false,
        flipped: false,
        category: item.category,
      })
    })

    // Embaralhar os cartões
    cardPairs = shuffleArray(cardPairs)

    setCards(cardPairs)
    setFlippedCards([])
    setMatchedPairs(0)
    setMoves(0)
    setTimer(0)
    setGameCompleted(false)
  }

  const shuffleArray = (array: any[]) => {
    const newArray = [...array]

    // Algoritmo de Fisher-Yates para embaralhamento mais eficiente
    for (let i = newArray.length - 1; i > 0; i--) {
      // Gerar um índice aleatório entre 0 e i (inclusive)
      const j = Math.floor(Math.random() * (i + 1))
      // Trocar os elementos nas posições i e j
      ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }

    return newArray
  }

  const handleCardClick = (index: number) => {
    // Prevent clicking if already two cards are flipped or the card is already matched or flipped
    if (flippedCards.length === 2 || cards[index].matched || cards[index].flipped) return

    // Flip the card
    const newCards = [...cards]
    newCards[index].flipped = true
    setCards(newCards)

    // Add to flipped cards
    const newFlippedCards = [...flippedCards, index]
    setFlippedCards(newFlippedCards)

    // Check for match if two cards are flipped
    if (newFlippedCards.length === 2) {
      setMoves((prev) => prev + 1)

      const [firstIndex, secondIndex] = newFlippedCards
      if (cards[firstIndex].id % 1000 === cards[secondIndex].id % 1000) {
        // Match found
        setTimeout(() => {
          const matchedCards = [...cards]
          matchedCards[firstIndex].matched = true
          matchedCards[secondIndex].matched = true
          setCards(matchedCards)
          setFlippedCards([])
          setMatchedPairs((prev) => prev + 1)

          // Celebrar o match encontrado
          celebrateMatch()

          toast({
            title: "Combinação encontrada!",
            description: `Você encontrou um par de ${cards[firstIndex].name}`,
            variant: "default",
          })
        }, 500)
      } else {
        // No match
        setTimeout(() => {
          const unmatchedCards = [...cards]
          unmatchedCards[firstIndex].flipped = false
          unmatchedCards[secondIndex].flipped = false
          setCards(unmatchedCards)
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  const celebrateMatch = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })
  }

  const calculateScore = () => {
    // Base score depends on difficulty
    let baseScore = 0
    switch (difficulty) {
      case "fácil":
        baseScore = 100
        break
      case "médio":
        baseScore = 200
        break
      case "difícil":
        baseScore = 300
        break
    }

    // Calculate time bonus (faster = more points)
    const timeBonus = Math.max(0, 300 - timer) * 2

    // Calculate moves bonus (fewer moves = more points)
    const optimalMoves = getCardCount() / 2 // One move per pair in the perfect game
    const movesBonus = Math.max(0, 200 - (moves - optimalMoves) * 10)

    // Calculate accuracy
    const calculatedAccuracy = (getCardCount() / 2 / moves) * 100
    setAccuracy(calculatedAccuracy)

    const totalScore = baseScore + timeBonus + movesBonus
    setScore(totalScore)

    return totalScore
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const startGame = (selectedDifficulty: "fácil" | "médio" | "difícil") => {
    setDifficulty(selectedDifficulty)
    setGameStarted(true)
  }

  const resetGame = () => {
    setGameStarted(false)
    setGameCompleted(false)
    setCards([])
    setFlippedCards([])
    setMatchedPairs(0)
    setMoves(0)
    setTimer(0)
    setScore(0)
    // O embaralhamento será feito automaticamente quando o jogo for iniciado novamente
  }

  const saveGameResults = async () => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError

      const { error } = await supabase.from("game_results").insert({
        user_id: userData.user.id,
        game_type: "memory_match",
        score: score,
        total_time: timer,
        accuracy: (getCardCount() / 2 / moves) * 100, // Perfect game would be 100%
        challenges_completed: matchedPairs,
      })

      if (error) throw error

      toast({
        title: "Progresso salvo",
        description: "Seu desempenho foi salvo com sucesso!",
        variant: "default",
      })
    } catch (err) {
      console.error("Error saving game results:", err)
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar seu progresso. Tente novamente mais tarde.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl">Jogo da Memória Eletrônica</CardTitle>
          {gameStarted && !gameCompleted && (
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-lg">
                <Clock className="h-5 w-5 mr-2" />
                {formatTime(timer)}
              </Badge>
              <Badge variant="outline" className="text-lg">
                <Zap className="h-5 w-5 mr-2" />
                {moves} jogadas
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!gameStarted ? (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold">Jogo da Memória com Componentes Eletrônicos</h2>
              <p className="text-gray-600">
                Encontre os pares de componentes eletrônicos idênticos. Teste sua memória e aprenda sobre os símbolos
                dos componentes!
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Selecione a categoria:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <Button
                  onClick={() => setCategory("components")}
                  variant={category === "components" ? "default" : "outline"}
                  className="h-auto py-4"
                >
                  <div className="text-center">
                    <Lightbulb className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-semibold">Componentes</div>
                  </div>
                </Button>
                <Button
                  onClick={() => setCategory("formulas")}
                  variant={category === "formulas" ? "default" : "outline"}
                  className="h-auto py-4"
                >
                  <div className="text-center">
                    <Calculator className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-semibold">Fórmulas</div>
                  </div>
                </Button>
                <Button
                  onClick={() => setCategory("symbols")}
                  variant={category === "symbols" ? "default" : "outline"}
                  className="h-auto py-4"
                >
                  <div className="text-center">
                    <svg
                      className="h-6 w-6 mx-auto mb-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 12h14M12 5v14" />
                    </svg>
                    <div className="font-semibold">Símbolos</div>
                  </div>
                </Button>
                <Button
                  onClick={() => setCategory("mixed")}
                  variant={category === "mixed" ? "default" : "outline"}
                  className="h-auto py-4"
                >
                  <div className="text-center">
                    <svg
                      className="h-6 w-6 mx-auto mb-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                      <line x1="9" y1="9" x2="9.01" y2="9" />
                      <line x1="15" y1="9" x2="15.01" y2="9" />
                    </svg>
                    <div className="font-semibold">Misto</div>
                  </div>
                </Button>
              </div>

              <h3 className="font-medium mt-6">Selecione a dificuldade:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button onClick={() => startGame("fácil")} variant="outline" className="h-auto py-4">
                  <div className="text-center">
                    <div className="font-semibold">Fácil</div>
                    <div className="text-sm text-gray-500">4 pares</div>
                  </div>
                </Button>
                <Button onClick={() => startGame("médio")} variant="outline" className="h-auto py-4">
                  <div className="text-center">
                    <div className="font-semibold">Médio</div>
                    <div className="text-sm text-gray-500">6 pares</div>
                  </div>
                </Button>
                <Button onClick={() => startGame("difícil")} variant="outline" className="h-auto py-4">
                  <div className="text-center">
                    <div className="font-semibold">Difícil</div>
                    <div className="text-sm text-gray-500">8 pares</div>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        ) : gameCompleted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center space-y-6">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold">Parabéns!</h2>
              <p className="text-lg">Você completou o jogo da memória!</p>

              <div className="bg-gray-100 p-6 rounded-lg">
                <div className="text-4xl font-bold mb-4">{score} pontos</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-lg">
                  <div>
                    <div className="font-semibold">Tempo</div>
                    <div>{formatTime(timer)}</div>
                  </div>
                  <div>
                    <div className="font-semibold">Jogadas</div>
                    <div>{moves}</div>
                  </div>
                  <div>
                    <div className="font-semibold">Precisão</div>
                    <div>{accuracy.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="font-semibold">Dificuldade</div>
                    <div className="capitalize">{difficulty}</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button onClick={resetGame} variant="outline">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Jogar Novamente
                </Button>
                <Button
                  onClick={() => {
                    saveGameResults()
                    router.push("/performance")
                  }}
                >
                  Ver Desempenho Geral
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {cards.map((card, index) => (
                <motion.div
                  key={index}
                  className={`aspect-square cursor-pointer rounded-lg overflow-hidden ${
                    card.matched ? "border-2 border-green-500 shadow-lg shadow-green-200" : ""
                  }`}
                  onClick={() => handleCardClick(index)}
                  whileHover={{ scale: card.flipped || card.matched ? 1 : 1.05 }}
                  animate={{
                    rotateY: card.flipped || card.matched ? 180 : 0,
                    scale: card.matched ? 1.03 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative w-full h-full">
                    {/* Back of card (symbol or image) */}
                    <div
                      className={`absolute inset-0 flex items-center justify-center bg-white border rounded-lg p-4 ${
                        card.flipped || card.matched ? "z-10" : "z-0"
                      } ${card.matched ? "bg-green-50" : "bg-white"}`}
                      style={{
                        transform: "rotateY(180deg)",
                        backfaceVisibility: "hidden",
                      }}
                    >
                      {card.image ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <Image
                            src={card.image || "/placeholder.svg"}
                            alt={card.name}
                            width={120}
                            height={120}
                            className="object-contain max-h-full max-w-full"
                          />
                        </div>
                      ) : (
                        <div className={`w-full h-full ${card.matched ? "text-green-600" : "text-blue-600"}`}>
                          {card.symbol}
                        </div>
                      )}
                      {card.matched && (
                        <div className="absolute top-1 right-1">
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        </div>
                      )}
                    </div>

                    {/* Front of card */}
                    <div
                      className={`absolute inset-0 flex items-center justify-center bg-blue-600 rounded-lg ${
                        card.flipped || card.matched ? "z-0" : "z-10"
                      }`}
                      style={{
                        backfaceVisibility: "hidden",
                      }}
                    >
                      <Zap className="h-12 w-12 text-white" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-between">
              <Badge variant="outline">
                Pares encontrados: {matchedPairs} / {getCardCount() / 2}
              </Badge>
              <Button variant="outline" onClick={resetGame}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reiniciar
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
