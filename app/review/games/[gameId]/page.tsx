"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { TopNav } from "@/components/top-nav"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Clock, Trophy, Target, CheckCircle, XCircle, RotateCcw, Gamepad2, Brain, Zap } from "lucide-react"
import { curriculumGames } from "@/data/games-curriculum"
import { motion, AnimatePresence } from "framer-motion"

const difficultyColors = {
  easy: "bg-green-100 text-green-800 border-green-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  hard: "bg-red-100 text-red-800 border-red-200",
}

const yearColors = {
  1: "bg-blue-100 text-blue-800 border-blue-200",
  2: "bg-purple-100 text-purple-800 border-purple-200",
  3: "bg-orange-100 text-orange-800 border-orange-200",
}

interface MemoryCard {
  id: string
  content: string
  isFlipped: boolean
  isMatched: boolean
  pairId: string
}

interface MatchingItem {
  id: string
  left: string
  right: string
  isMatched: boolean
}

export default function GamePage() {
  const params = useParams()
  const router = useRouter()
  const gameId = params.gameId as string

  const [game, setGame] = useState<any>(null)
  const [gameState, setGameState] = useState<"loading" | "ready" | "playing" | "completed">("loading")
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [score, setScore] = useState(0)
  const [progress, setProgress] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)

  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>([])
  const [flippedCards, setFlippedCards] = useState<string[]>([])
  const [matchedPairs, setMatchedPairs] = useState(0)

  const [matchingItems, setMatchingItems] = useState<MatchingItem[]>([])
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const [selectedRight, setSelectedRight] = useState<string | null>(null)

  const [simulationParams, setSimulationParams] = useState<Record<string, number>>({})
  const [simulationResult, setSimulationResult] = useState<string>("")

  useEffect(() => {
    const loadingTimer = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(loadingTimer)
          return 100
        }
        return prev + Math.random() * 15 + 5
      })
    }, 200)

    const foundGame = curriculumGames.find((g) => g.id === gameId)
    if (foundGame) {
      setGame(foundGame)
      setTimeLeft(foundGame.estimatedTime * 60)
      setGameState("ready")
      initializeGameData(foundGame)
      clearInterval(loadingTimer)
      setLoadingProgress(100)
    } else {
      setTimeout(() => {
        setGameState("loading")
        clearInterval(loadingTimer)
      }, 500)
    }

    return () => clearInterval(loadingTimer)
  }, [gameId])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (gameStarted && timeLeft > 0 && gameState === "playing") {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0 && gameStarted) {
      setGameState("completed")
    }
    return () => clearTimeout(timer)
  }, [timeLeft, gameStarted, gameState])

  const initializeGameData = (gameData: any) => {
    if (gameData.type === "memory" && gameData.content.pairs) {
      const cards: MemoryCard[] = []
      gameData.content.pairs.forEach((pair: any, index: number) => {
        cards.push({
          id: `${pair.id}-1`,
          content: pair.name,
          isFlipped: false,
          isMatched: false,
          pairId: pair.id,
        })
        cards.push({
          id: `${pair.id}-2`,
          content: pair.description || pair.symbol || pair.image,
          isFlipped: false,
          isMatched: false,
          pairId: pair.id,
        })
      })
      setMemoryCards(shuffleArray(cards))
    }

    if (gameData.type === "matching" && gameData.content.items) {
      const items: MatchingItem[] = gameData.content.items.map((item: any, index: number) => ({
        id: `item-${index}`,
        left: Object.values(item)[0] as string,
        right: Object.values(item)[1] as string,
        isMatched: false,
      }))
      setMatchingItems(shuffleArray(items))
    }

    if (gameData.type === "simulation") {
      const params: Record<string, number> = {}
      if (gameData.content.parameters) {
        gameData.content.parameters.forEach((param: string) => {
          params[param] = 50
        })
      }
      setSimulationParams(params)
    }
  }

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const startGame = () => {
    setGameStarted(true)
    setGameState("playing")
    setProgress(0)
    setScore(0)
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setMatchedPairs(0)
    setFlippedCards([])
    setSelectedLeft(null)
    setSelectedRight(null)
  }

  const handleQuizAnswer = (answerIndex: number) => {
    if (showResult) return

    setSelectedAnswer(answerIndex)
    setShowResult(true)

    const isCorrect = game.content.questions[currentQuestion]?.correct === answerIndex
    if (isCorrect) {
      setScore(score + Math.round(game.points / game.content.questions.length))
    }

    setTimeout(() => {
      if (currentQuestion < game.content.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setShowResult(false)
        setProgress(((currentQuestion + 1) / game.content.questions.length) * 100)
      } else {
        setGameState("completed")
        setProgress(100)
      }
    }, 2500)
  }

  const handleMemoryCardClick = (cardId: string) => {
    if (flippedCards.length >= 2) return

    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)

    setMemoryCards((prev) => prev.map((card) => (card.id === cardId ? { ...card, isFlipped: true } : card)))

    if (newFlippedCards.length === 2) {
      const [firstCard, secondCard] = newFlippedCards.map((id) => memoryCards.find((card) => card.id === id))

      setTimeout(() => {
        if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
          setMemoryCards((prev) =>
            prev.map((card) => (card.pairId === firstCard.pairId ? { ...card, isMatched: true } : card)),
          )
          setMatchedPairs((prev) => prev + 1)
          setScore((prev) => prev + Math.round(game.points / (game.content.pairs.length || 1)))

          if (matchedPairs + 1 >= (game.content.pairs?.length || 0)) {
            setGameState("completed")
            setProgress(100)
          } else {
            setProgress(((matchedPairs + 1) / (game.content.pairs?.length || 1)) * 100)
          }
        } else {
          setMemoryCards((prev) =>
            prev.map((card) => (newFlippedCards.includes(card.id) ? { ...card, isFlipped: false } : card)),
          )
        }
        setFlippedCards([])
      }, 1000)
    }
  }

  const handleMatchingClick = (side: "left" | "right", itemId: string, content: string) => {
    if (side === "left") {
      setSelectedLeft(selectedLeft === itemId ? null : itemId)
      setSelectedRight(null)
    } else {
      if (selectedLeft) {
        const leftItem = matchingItems.find((item) => item.id === selectedLeft)
        const rightItem = matchingItems.find((item) => item.id === itemId)

        if (leftItem && rightItem && leftItem.right === content) {
          setMatchingItems((prev) =>
            prev.map((item) => (item.id === selectedLeft || item.id === itemId ? { ...item, isMatched: true } : item)),
          )
          setScore((prev) => prev + Math.round(game.points / matchingItems.length))

          const newMatchedCount = matchingItems.filter((item) => item.isMatched).length + 1
          setProgress((newMatchedCount / matchingItems.length) * 100)

          if (newMatchedCount >= matchingItems.length) {
            setGameState("completed")
          }
        }
        setSelectedLeft(null)
        setSelectedRight(null)
      } else {
        setSelectedRight(selectedRight === itemId ? null : itemId)
      }
    }
  }

  const handleSimulation = () => {
    let result = "Simulação executada com sucesso!\n\n"

    if (game.id.includes("leis-newton")) {
      const force = simulationParams.força || 50
      const mass = simulationParams.massa || 10
      const acceleration = force / mass
      result += `Força: ${force}N\nMassa: ${mass}kg\nAceleração: ${acceleration.toFixed(2)}m/s²`
    } else if (game.id.includes("circuitos")) {
      const voltage = simulationParams.tensão || 12
      const resistance = simulationParams.resistência || 100
      const current = voltage / resistance
      result += `Tensão: ${voltage}V\nResistência: ${resistance}Ω\nCorrente: ${current.toFixed(3)}A`
    } else {
      result += "Parâmetros configurados:\n"
      Object.entries(simulationParams).forEach(([key, value]) => {
        result += `${key}: ${value}\n`
      })
    }

    setSimulationResult(result)
    setScore(game.points)
    setProgress(100)

    setTimeout(() => {
      setGameState("completed")
    }, 2000)
  }

  const restartGame = () => {
    setGameStarted(false)
    setGameState("ready")
    setScore(0)
    setProgress(0)
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setTimeLeft(game.estimatedTime * 60)
    setMatchedPairs(0)
    setFlippedCards([])
    setSelectedLeft(null)
    setSelectedRight(null)
    setSimulationResult("")
    initializeGameData(game)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (gameState === "loading" || !game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-16">
        <TopNav />
        <main className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="max-w-md w-full">
              <CardContent className="pt-8 pb-8">
                <div className="text-center space-y-6">
                  <div className="flex justify-center space-x-4 mb-6">
                    <motion.div
                      animate={{
                        rotate: 360,
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        rotate: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                        scale: { duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
                      }}
                    >
                      <Gamepad2 className="h-8 w-8 text-blue-500" />
                    </motion.div>
                    <motion.div
                      animate={{
                        y: [-10, 10, -10],
                        rotate: [0, 180, 360],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                        delay: 0.2,
                      }}
                    >
                      <Brain className="h-8 w-8 text-purple-500" />
                    </motion.div>
                    <motion.div
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                        delay: 0.4,
                      }}
                    >
                      <Zap className="h-8 w-8 text-yellow-500" />
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Preparando seu jogo...
                    </h1>
                    <p className="text-gray-600 mt-2">Carregando conteúdo educativo</p>
                  </motion.div>

                  <div className="space-y-3">
                    <Progress value={loadingProgress} className="h-3 bg-gray-200" />
                    <motion.p
                      className="text-sm text-gray-500"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                    >
                      {loadingProgress < 30 && "Inicializando componentes..."}
                      {loadingProgress >= 30 && loadingProgress < 60 && "Carregando conteúdo..."}
                      {loadingProgress >= 60 && loadingProgress < 90 && "Preparando interface..."}
                      {loadingProgress >= 90 && "Quase pronto!"}
                    </motion.p>
                  </div>

                  <div className="flex justify-center space-x-2">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-3 h-3 bg-blue-500 rounded-full"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.3, 1, 0.3],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>

                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                    <Button onClick={() => router.back()} variant="outline" className="mt-4">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Voltar
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <BottomNav active="review" />
      </div>
    )
  }

  const renderGameContent = () => {
    if (gameState === "ready") {
      return (
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="text-4xl">{game.icon}</span>
              <div>
                <CardTitle className="text-2xl">{game.title}</CardTitle>
                <p className="text-gray-600 mt-2">{game.description}</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 mt-4">
              <Badge className={yearColors[game.year as keyof typeof yearColors]}>{game.year}º Ano</Badge>
              <Badge className={difficultyColors[game.difficulty as keyof typeof difficultyColors]}>
                {game.difficulty === "easy" ? "Fácil" : game.difficulty === "medium" ? "Médio" : "Difícil"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center justify-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>{game.estimatedTime} min</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span>{game.points} pts</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Target className="h-4 w-4 text-green-500" />
                <span>{game.category}</span>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Como Jogar:</h3>
              <p className="text-sm text-gray-600">
                {game.type === "quiz" && "Responda às perguntas de múltipla escolha sobre o tema."}
                {game.type === "memory" && "Encontre os pares correspondentes clicando nas cartas."}
                {game.type === "matching" &&
                  "Clique primeiro no item da esquerda, depois no correspondente da direita."}
                {game.type === "simulation" && "Ajuste os parâmetros e execute a simulação."}
                {game.type === "puzzle" && "Organize as peças na ordem correta."}
                {game.type === "strategy" && "Use estratégias para resolver os problemas."}
              </p>
            </div>
            <Button onClick={startGame} size="lg" className="w-full">
              Começar Jogo
            </Button>
          </CardContent>
        </Card>
      )
    }

    if (gameState === "completed") {
      return (
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <CardTitle className="text-2xl">Parabéns!</CardTitle>
            <p className="text-gray-600">Você completou o jogo!</p>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">{Math.round(score)}</div>
              <div className="text-sm text-gray-600">Pontos Conquistados</div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded">
                <div className="font-semibold">Tempo Restante</div>
                <div className="text-blue-600">{formatTime(timeLeft)}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="font-semibold">Progresso</div>
                <div className="text-green-600">{Math.round(progress)}%</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={restartGame} variant="outline" className="flex-1 bg-transparent">
                <RotateCcw className="h-4 w-4 mr-2" />
                Jogar Novamente
              </Button>
              <Button onClick={() => router.back()} className="flex-1">
                Voltar aos Jogos
              </Button>
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <span className="text-2xl">{game.icon}</span>
                <div>
                  <h2 className="font-semibold">{game.title}</h2>
                  <p className="text-sm text-gray-600">{game.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatTime(timeLeft)}
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4" />
                  {Math.round(score)}
                </div>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${game.type}-${currentQuestion}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {game.type === "quiz" && game.content.questions && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Pergunta {currentQuestion + 1} de {game.content.questions.length}
                    </CardTitle>
                    <Badge variant="outline">{game.subject}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h3 className="text-xl font-medium">{game.content.questions[currentQuestion]?.question}</h3>
                  <div className="grid gap-3">
                    {game.content.questions[currentQuestion]?.options.map((option: string, index: number) => (
                      <Button
                        key={index}
                        variant={
                          showResult
                            ? index === game.content.questions[currentQuestion].correct
                              ? "default"
                              : index === selectedAnswer
                                ? "destructive"
                                : "outline"
                            : selectedAnswer === index
                              ? "default"
                              : "outline"
                        }
                        className="justify-start text-left h-auto p-4"
                        onClick={() => handleQuizAnswer(index)}
                        disabled={showResult}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium">
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="flex-1">{option}</span>
                          {showResult && index === game.content.questions[currentQuestion].correct && (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          )}
                          {showResult &&
                            index === selectedAnswer &&
                            index !== game.content.questions[currentQuestion].correct && (
                              <XCircle className="h-5 w-5 text-red-600" />
                            )}
                        </div>
                      </Button>
                    ))}
                  </div>
                  {showResult && game.content.questions[currentQuestion]?.explanation && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400"
                    >
                      <h4 className="font-medium text-blue-800 mb-2">Explicação:</h4>
                      <p className="text-blue-700">{game.content.questions[currentQuestion].explanation}</p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            )}

            {game.type === "memory" && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Jogo da Memória - {game.category}</CardTitle>
                    <div className="text-sm text-gray-600">
                      Pares encontrados: {matchedPairs} / {game.content.pairs?.length || 0}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-3 max-w-2xl mx-auto">
                    {memoryCards.map((card) => (
                      <motion.div
                        key={card.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`aspect-square rounded-lg cursor-pointer transition-all duration-300 ${
                          card.isFlipped || card.isMatched
                            ? card.isMatched
                              ? "bg-green-100 border-2 border-green-400"
                              : "bg-blue-100 border-2 border-blue-400"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                        onClick={() => !card.isMatched && !card.isFlipped && handleMemoryCardClick(card.id)}
                      >
                        <div className="h-full flex items-center justify-center p-2 text-center">
                          {card.isFlipped || card.isMatched ? (
                            <span className="text-sm font-medium">{card.content}</span>
                          ) : (
                            <span className="text-2xl">?</span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {game.type === "matching" && (
              <Card>
                <CardHeader>
                  <CardTitle>Jogo de Associação - {game.category}</CardTitle>
                  <p className="text-sm text-gray-600">
                    Clique primeiro no item da esquerda, depois no correspondente da direita
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-8 max-w-3xl mx-auto">
                    <div className="space-y-3">
                      <h3 className="font-semibold text-center mb-4">Itens</h3>
                      {matchingItems.map((item) => (
                        <Button
                          key={`left-${item.id}`}
                          variant={item.isMatched ? "default" : selectedLeft === item.id ? "default" : "outline"}
                          className={`w-full h-auto p-4 text-left ${
                            item.isMatched ? "bg-green-100 text-green-800 border-green-400" : ""
                          }`}
                          onClick={() => !item.isMatched && handleMatchingClick("left", item.id, item.right)}
                          disabled={item.isMatched}
                        >
                          {item.left}
                        </Button>
                      ))}
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-semibold text-center mb-4">Correspondentes</h3>
                      {shuffleArray([...matchingItems]).map((item) => (
                        <Button
                          key={`right-${item.id}`}
                          variant={item.isMatched ? "default" : selectedRight === item.id ? "default" : "outline"}
                          className={`w-full h-auto p-4 text-left ${
                            item.isMatched ? "bg-green-100 text-green-800 border-green-400" : ""
                          }`}
                          onClick={() => !item.isMatched && handleMatchingClick("right", item.id, item.right)}
                          disabled={item.isMatched}
                        >
                          {item.right}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {game.type === "simulation" && (
              <Card>
                <CardHeader>
                  <CardTitle>Simulação - {game.category}</CardTitle>
                  <p className="text-sm text-gray-600">Ajuste os parâmetros e execute a simulação</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(simulationParams).map(([param, value]) => (
                      <div key={param} className="space-y-2">
                        <label className="text-sm font-medium capitalize">{param.replace("_", " ")}</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="1"
                            max="100"
                            value={value}
                            onChange={(e) =>
                              setSimulationParams((prev) => ({
                                ...prev,
                                [param]: Number.parseInt(e.target.value),
                              }))
                            }
                            className="flex-1"
                          />
                          <span className="text-sm font-mono w-12">{value}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {simulationResult && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Resultado da Simulação:</h4>
                      <pre className="text-sm whitespace-pre-wrap">{simulationResult}</pre>
                    </div>
                  )}

                  <Button onClick={handleSimulation} className="w-full" size="lg">
                    Executar Simulação
                  </Button>
                </CardContent>
              </Card>
            )}

            {(game.type === "puzzle" || game.type === "strategy") && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {game.type === "puzzle" ? "Puzzle" : "Estratégia"} - {game.category}
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    {game.type === "puzzle"
                      ? "Clique nos números para organizá-los em ordem crescente"
                      : "Resolva o problema usando a estratégia correta"}
                  </p>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    {game.type === "puzzle" ? (
                      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                        {[7, 2, 4, 5, 1, 9, 8, 3, 6].map((num, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="aspect-square bg-transparent"
                            onClick={() => {
                              setScore(game.points)
                              setProgress(100)
                              setTimeout(() => setGameState("completed"), 1000)
                            }}
                          >
                            {num}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="text-lg font-medium">
                          {game.content.problems?.[0]?.problem || "Resolva este problema de estratégia"}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setScore(game.points)
                              setProgress(100)
                              setTimeout(() => setGameState("completed"), 1000)
                            }}
                          >
                            Estratégia A
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setScore(Math.round(game.points * 0.7))
                              setProgress(100)
                              setTimeout(() => setGameState("completed"), 1000)
                            }}
                          >
                            Estratégia B
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-16">
      <TopNav />

      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {gameState === "ready" ? "Preparar Jogo" : gameState === "playing" ? "Jogando" : "Jogo Concluído"}
            </h1>
            <p className="text-gray-600">
              {game.subject} • {game.category}
            </p>
          </div>
        </div>

        {renderGameContent()}
      </main>

      <BottomNav active="review" />
    </div>
  )
}
