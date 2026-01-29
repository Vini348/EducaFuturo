"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
import type { Flashcard } from "@/types/flashcards"
import { Check, X, RotateCcw, ChevronRight, ChevronLeft, Clock, Volume2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface FlashcardSessionProps {
  cards: Flashcard[]
  onComplete: (results: { correct: number; incorrect: number; elapsedTime: number }) => void
}

export function FlashcardSession({ cards = [], onComplete }: FlashcardSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [incorrect, setIncorrect] = useState(0)
  const [startTime] = useState(Date.now())
  const [elapsedTime, setElapsedTime] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()
  const [hasCards, setHasCards] = useState(cards && cards.length > 0)
  const [cardsReviewed, setCardsReviewed] = useState(0)
  const [interactionCount, setInteractionCount] = useState(0)

  useEffect(() => {
    setHasCards(cards && cards.length > 0)
  }, [cards])

  useEffect(() => {
    // Atualizar o tempo decorrido a cada segundo
    timerRef.current = setInterval(() => {
      const newElapsedTime = Math.floor((Date.now() - startTime) / 1000)
      setElapsedTime(newElapsedTime)

      if (newElapsedTime % 30 === 0 && newElapsedTime > 0) {
        const challengeId = localStorage.getItem("currentChallengeId")
        if (challengeId) {
          const event = new CustomEvent("flashcardActivity", {
            detail: {
              challengeId,
              cardsReviewed,
              timeSpent: Date.now() - startTime,
            },
          })
          window.dispatchEvent(event)
        }
      }
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      // Garantir que qualquer áudio seja interrompido ao desmontar o componente
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [startTime, cardsReviewed])

  const handleFlip = () => {
    setInteractionCount((prev) => prev + 1)

    // Parar qualquer áudio em reprodução
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }
    setIsFlipped(!isFlipped)
  }

  const handleNext = () => {
    if (isFlipped) {
      setCardsReviewed((prev) => prev + 1)
    }
    setInteractionCount((prev) => prev + 1)

    // Parar qualquer áudio em reprodução
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }

    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    }
  }

  const handlePrevious = () => {
    setInteractionCount((prev) => prev + 1)

    // Parar qualquer áudio em reprodução
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }

    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsFlipped(false)
    }
  }

  const handleCorrect = () => {
    if (!isFlipped) {
      toast({
        title: "Vire o cartão primeiro",
        description: "Você precisa ver a resposta antes de marcar como correto.",
        variant: "default",
      })
      return
    }

    setCardsReviewed((prev) => prev + 1)
    setInteractionCount((prev) => prev + 1)
    setCorrect(correct + 1)

    toast({
      title: "Resposta correta!",
      description: "Muito bem! Continue assim.",
      variant: "default",
    })

    const challengeId = localStorage.getItem("currentChallengeId")
    if (challengeId) {
      const event = new CustomEvent("flashcardActivity", {
        detail: {
          challengeId,
          cardsReviewed: cardsReviewed + 1,
          timeSpent: Date.now() - startTime,
        },
      })
      window.dispatchEvent(event)
    }

    // Verificar se é o último cartão
    if (currentIndex === cards.length - 1) {
      // Sessão completa
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      onComplete({
        correct: correct + 1,
        incorrect,
        elapsedTime,
      })
    } else {
      handleNext()
    }
  }

  const handleIncorrect = () => {
    if (!isFlipped) {
      toast({
        title: "Vire o cartão primeiro",
        description: "Você precisa ver a resposta antes de marcar como incorreto.",
        variant: "default",
      })
      return
    }

    setCardsReviewed((prev) => prev + 1)
    setInteractionCount((prev) => prev + 1)
    setIncorrect(incorrect + 1)

    toast({
      title: "Resposta incorreta",
      description: "Continue praticando para melhorar.",
      variant: "destructive",
    })

    const challengeId = localStorage.getItem("currentChallengeId")
    if (challengeId) {
      const event = new CustomEvent("flashcardActivity", {
        detail: {
          challengeId,
          cardsReviewed: cardsReviewed + 1,
          timeSpent: Date.now() - startTime,
        },
      })
      window.dispatchEvent(event)
    }

    // Verificar se é o último cartão
    if (currentIndex === cards.length - 1) {
      // Sessão completa
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      onComplete({
        correct,
        incorrect: incorrect + 1,
        elapsedTime,
      })
    } else {
      handleNext()
    }
  }

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-amber-100 text-amber-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Função para ler o texto em voz alta
  const speak = (text: string) => {
    try {
      setInteractionCount((prev) => prev + 1)

      if ("speechSynthesis" in window) {
        // Cancelar qualquer fala anterior
        window.speechSynthesis.cancel()

        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = "pt-BR"
        window.speechSynthesis.speak(utterance)
      } else {
        toast({
          title: "Recurso não suportado",
          description: "Seu navegador não suporta a funcionalidade de leitura de texto.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error with text-to-speech:", error)
      toast({
        title: "Erro",
        description: "Não foi possível reproduzir o áudio.",
        variant: "destructive",
      })
    }
  }

  const currentCard = cards[currentIndex]

  if (!hasCards) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-amber-500 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-4">Nenhum cartão disponível</h2>
        <p className="mb-6 text-gray-600">
          Não há cartões disponíveis para este modo de estudo. Por favor, tente outro modo ou entre em contato com o
          suporte.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-3xl mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              Cartão {currentIndex + 1} de {cards.length}
            </Badge>
            <Badge variant="outline" className={getDifficultyColor(currentCard.difficulty)}>
              {currentCard.difficulty === "easy" ? "Fácil" : currentCard.difficulty === "medium" ? "Médio" : "Difícil"}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{formatTime(elapsedTime)}</span>
          </div>
        </div>

        <Progress value={((currentIndex + 1) / cards.length) * 100} className="h-2" />
      </div>

      <div className="w-full max-w-3xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex + (isFlipped ? "-flipped" : "")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <Card className="w-full h-[300px] md:h-[400px] cursor-pointer relative" onClick={handleFlip}>
              {/* Lado da pergunta */}
              {!isFlipped && (
                <CardContent className="absolute inset-0 p-6 flex flex-col justify-center items-center">
                  <div className="text-center">
                    <h3 className="text-xl md:text-2xl font-bold mb-4">Pergunta</h3>
                    <p className="text-lg md:text-xl">{currentCard.question}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-4"
                      onClick={(e) => {
                        e.stopPropagation() // Impede que o clique se propague para o cartão
                        speak(currentCard.question)
                      }}
                    >
                      <Volume2 className="h-4 w-4 mr-2" />
                      Ouvir pergunta
                    </Button>
                  </div>
                  <div className="absolute bottom-4 text-center w-full text-sm text-muted-foreground">
                    Clique para ver a resposta
                  </div>
                </CardContent>
              )}

              {/* Lado da resposta */}
              {isFlipped && (
                <CardContent className="absolute inset-0 p-6 flex flex-col justify-center items-center">
                  <div className="text-center">
                    <h3 className="text-xl md:text-2xl font-bold mb-4">Resposta</h3>
                    <p className="text-lg md:text-xl">{currentCard.answer}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-4"
                      onClick={(e) => {
                        e.stopPropagation() // Impede que o clique se propague para o cartão
                        speak(currentCard.answer)
                      }}
                    >
                      <Volume2 className="h-4 w-4 mr-2" />
                      Ouvir resposta
                    </Button>
                  </div>
                  <div className="absolute bottom-4 text-center w-full text-sm text-muted-foreground">
                    Clique para ver a pergunta
                  </div>
                </CardContent>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 w-full max-w-3xl">
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="flex-1 sm:flex-initial bg-transparent"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>

          <div className="flex-1 grid grid-cols-2 gap-3">
            <Button
              onClick={handleIncorrect}
              variant="destructive"
              className={!isFlipped ? "opacity-70 cursor-not-allowed" : ""}
              aria-disabled={!isFlipped}
            >
              <X className="h-4 w-4 mr-2" />
              Incorreto
            </Button>
            <Button
              onClick={handleCorrect}
              variant="default"
              className={`bg-green-600 hover:bg-green-700 ${!isFlipped ? "opacity-70 cursor-not-allowed" : ""}`}
              aria-disabled={!isFlipped}
            >
              <Check className="h-4 w-4 mr-2" />
              Correto
            </Button>
          </div>

          <Button
            variant="outline"
            onClick={handleNext}
            disabled={currentIndex === cards.length - 1}
            className="flex-1 sm:flex-initial bg-transparent"
          >
            Próximo
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        <div className="mt-4 flex justify-center">
          <Button variant="ghost" onClick={handleFlip} className="flex items-center">
            <RotateCcw className="h-4 w-4 mr-2" />
            Virar cartão
          </Button>
        </div>
      </div>

      <div className="mt-8 w-full max-w-3xl">
        <div className="flex justify-between text-sm text-muted-foreground">
          <div>Corretas: {correct}</div>
          <div>Incorretas: {incorrect}</div>
          <div>Restantes: {cards.length - correct - incorrect}</div>
        </div>
      </div>
    </div>
  )
}
