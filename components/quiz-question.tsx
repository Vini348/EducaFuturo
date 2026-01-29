"use client"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX } from "lucide-react"
import { useState, useEffect } from "react"
import type { QuizQuestion as QuizQuestionType } from "@/types/quiz"
import { motion } from "framer-motion"

interface QuizQuestionProps {
  question: QuizQuestionType
  onAnswer: (optionId: string) => void
  onNext: () => void
  selectedAnswer: string | undefined
  currentQuestion: number
  totalQuestions: number
  elapsedTime: number
}

export function QuizQuestion({
  question,
  onAnswer,
  onNext,
  selectedAnswer,
  currentQuestion,
  totalQuestions,
  elapsedTime,
}: QuizQuestionProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(true)
  const [isOptionHovered, setIsOptionHovered] = useState<string | null>(null)
  const [questionStartTime] = useState(Date.now())
  const [interactionCount, setInteractionCount] = useState(0)

  useEffect(() => {
    // Verificar se o navegador suporta a API de síntese de fala
    setSpeechSupported("speechSynthesis" in window)

    // Limpar qualquer fala em andamento quando o componente for desmontado
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  // Efeito para parar a fala quando a pergunta mudar
  useEffect(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
    }

    const challengeId = localStorage.getItem("currentChallengeId")
    if (challengeId) {
      const event = new CustomEvent("quizActivity", {
        detail: {
          challengeId,
          questionsAnswered: currentQuestion,
          timeSpent: Date.now() - questionStartTime,
          completed: false,
        },
      })
      window.dispatchEvent(event)
    }
  }, [question.id, currentQuestion, questionStartTime])

  const handleAnswer = (optionId: string) => {
    setInteractionCount((prev) => prev + 1)

    const challengeId = localStorage.getItem("currentChallengeId")
    if (challengeId) {
      const event = new CustomEvent("quizActivity", {
        detail: {
          challengeId,
          questionsAnswered: currentQuestion + 1,
          timeSpent: Date.now() - questionStartTime,
          completed: currentQuestion + 1 >= totalQuestions,
        },
      })
      window.dispatchEvent(event)
    }

    onAnswer(optionId)
  }

  const speakQuestion = () => {
    if (!speechSupported) return

    setInteractionCount((prev) => prev + 1)

    // Se já estiver falando, pare
    if (isPlaying) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      return
    }

    // Preparar o texto para falar: enunciado seguido das opções
    let textToSpeak = `Questão ${currentQuestion} de ${totalQuestions}. ${question.text}. `

    // Adicionar as opções
    question.options.forEach((option, index) => {
      textToSpeak += `Opção ${index + 1}: ${option.text}. `
    })

    const utterance = new SpeechSynthesisUtterance(textToSpeak)
    utterance.lang = "pt-BR"
    utterance.rate = 1.0
    utterance.pitch = 1.0

    // Quando terminar de falar
    utterance.onend = () => {
      setIsPlaying(false)
    }

    // Quando ocorrer um erro
    utterance.onerror = () => {
      setIsPlaying(false)
    }

    setIsPlaying(true)
    window.speechSynthesis.speak(utterance)
  }

  // Adicione este useEffect após os outros useEffect existentes
  useEffect(() => {
    // Parar o áudio quando o componente for desmontado ou quando a questão mudar
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel()
        setIsPlaying(false)
      }
    }
  }, [question.id])

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="max-w-2xl mx-auto overflow-hidden">
        <CardHeader className="border-b bg-gray-50">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-semibold">{question.text}</CardTitle>
            {speechSupported && (
              <Button
                variant="ghost"
                size="icon"
                onClick={speakQuestion}
                className="ml-2 flex-shrink-0 rounded-full"
                title={isPlaying ? "Parar de ouvir" : "Ouvir pergunta e opções"}
              >
                {isPlaying ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                <span className="sr-only">{isPlaying ? "Parar de ouvir" : "Ouvir pergunta e opções"}</span>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-3">
            {question.options.map((option) => (
              <motion.div key={option.id} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <label
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer
                    ${
                      selectedAnswer === option.id
                        ? "border-primary bg-primary/5"
                        : isOptionHovered === option.id
                          ? "border-gray-300 bg-gray-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }
                  `}
                  onMouseEnter={() => {
                    setIsOptionHovered(option.id)
                    setInteractionCount((prev) => prev + 1)
                  }}
                  onMouseLeave={() => setIsOptionHovered(null)}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={option.id}
                    checked={selectedAnswer === option.id}
                    onChange={() => handleAnswer(option.id)}
                    className="hidden"
                  />
                  <div
                    className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedAnswer === option.id ? "border-primary bg-primary" : "border-gray-300 bg-white"
                    }`}
                  >
                    {selectedAnswer === option.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="h-2 w-2 rounded-full bg-white"
                      />
                    )}
                  </div>
                  <span className="flex-1">{option.text}</span>
                </label>
              </motion.div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="border-t p-6 bg-gray-50">
          <Button onClick={onNext} disabled={!selectedAnswer} className="w-full" size="lg">
            {currentQuestion === totalQuestions ? "Finalizar" : "Próxima"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
