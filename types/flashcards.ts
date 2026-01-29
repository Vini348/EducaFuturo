export type Difficulty = "easy" | "medium" | "hard"

export interface Flashcard {
  id: string
  question: string // Now a simple string
  answer: string // Now a simple string
  difficulty: Difficulty
  subject: "digital" | "analog" | "power"
  topic: string
  completed: boolean
}

export interface StudySession {
  id: string
  date: Date
  correct: number
  incorrect: number
  cards: string[]
  mode: string
}

export interface Topic {
  id: string
  title: string // Now a simple string
  description: string // Now a simple string
  cards: Flashcard[]
}

export interface Subject {
  id: string
  title: string // Now a simple string
  icon: string
  className: string
  topics: Topic[]
}
