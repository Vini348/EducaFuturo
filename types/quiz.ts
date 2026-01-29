export interface QuizOption {
  id: string
  text: string
  isCorrect: boolean
}

export interface QuizQuestion {
  id: string
  text: string
  options: QuizOption[]
  explanation?: string
}

export interface Quiz {
  id: string
  title: string
  subject: "digital" | "analog" | "power"
  subjectName: string
  description: string
  difficulty: 1 | 2 | 3 // 1-3 stars
  questions: QuizQuestion[]
  icon: string
}
