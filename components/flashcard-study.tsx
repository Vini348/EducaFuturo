"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import type { Flashcard } from "@/types/flashcards"
import { localDB } from "@/lib/localDatabase"

interface FlashcardStudyProps {
  flashcards: Flashcard[]
  onComplete: () => void
}

export function FlashcardStudy({ flashcards, onComplete }: FlashcardStudyProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [studyComplete, setStudyComplete] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  const currentFlashcard = flashcards[currentIndex]

  // Obter ID do usuário atual
  useEffect(() => {
    const getUserId = async () => {
      try {
        // Usar localStorage como fonte primária para evitar problemas de rede
        const storedUserId = localStorage.getItem("userId")
        if (storedUserId) {
          setUserId(storedUserId)
          return
        }

        // Se não tiver no localStorage, tentar obter do Supabase
        const { supabase } = await import("@/lib/supabaseClient")
        const { data } = await supabase.auth.getSession()
        const id = data.session?.user?.id || null

        if (id) {
          localStorage.setItem("userId", id)
          setUserId(id)
        }
      } catch (error) {
        console.error("Erro ao obter ID do usuário:", error)
      }
    }

    getUserId()
  }, [])

  const flipCard = () => setIsFlipped(!isFlipped)

  const updateProgress = useCallback(
    async (isCorrect: boolean) => {
      if (!currentFlashcard || !userId) return

      try {
        await localDB.updateFlashcardProgress(userId, currentFlashcard.id, isCorrect)
      } catch (error) {
        console.error("Erro ao atualizar progresso do flashcard:", error)
      }
    },
    [userId, currentFlashcard],
  )

  const nextCard = useCallback(
    async (isCorrect: boolean) => {
      try {
        await updateProgress(isCorrect)
      } catch (error) {
        console.error("Erro ao processar cartão:", error)
      }

      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex((prevIndex) => prevIndex + 1)
        setIsFlipped(false)
      } else {
        setStudyComplete(true)
      }
    },
    [currentIndex, flashcards.length, updateProgress],
  )

  useEffect(() => {
    if (studyComplete) {
      onComplete()
    }
  }, [studyComplete, onComplete])

  if (!currentFlashcard) {
    return <div>Nenhum flashcard disponível.</div>
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md">
        <div className={`flashcard ${isFlipped ? "flipped" : ""} cursor-pointer`} onClick={flipCard}>
          <div className="front p-4">
            <h2 className="text-xl font-bold mb-2">Pergunta:</h2>
            <p>{currentFlashcard.question}</p>
          </div>
          <div className="back p-4">
            <h2 className="text-xl font-bold mb-2">Resposta:</h2>
            <p>{currentFlashcard.answer}</p>
          </div>
        </div>
        <div className="mt-4 flex justify-between">
          <Button onClick={() => nextCard(false)} variant="outline">
            Incorreto
          </Button>
          <Button onClick={() => nextCard(true)} variant="default">
            Correto
          </Button>
        </div>
      </div>
      <div className="mt-4">
        {currentIndex + 1} / {flashcards.length}
      </div>
      {!userId && (
        <div className="mt-4 text-sm text-amber-600 bg-amber-50 p-2 rounded">Faça login para salvar seu progresso</div>
      )}
    </div>
  )
}
