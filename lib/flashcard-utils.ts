import type { Flashcard, Difficulty, StudySession } from "@/types/flashcards"

export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

export function filterCardsByDifficulty(cards: Flashcard[], difficulty: Difficulty): Flashcard[] {
  return cards.filter((card) => card.difficulty === difficulty)
}

export function getProgress(sessions: StudySession[]): {
  totalCards: number
  correctAnswers: number
  incorrectAnswers: number
  completionRate: number
} {
  const totalCards = sessions.reduce((acc, session) => acc + session.cards.length, 0)
  const correctAnswers = sessions.reduce((acc, session) => acc + session.correct, 0)
  const incorrectAnswers = sessions.reduce((acc, session) => acc + session.incorrect, 0)
  const completionRate = totalCards > 0 ? (correctAnswers / totalCards) * 100 : 0

  return {
    totalCards,
    correctAnswers,
    incorrectAnswers,
    completionRate,
  }
}
