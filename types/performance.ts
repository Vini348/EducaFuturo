export interface StudyMetrics {
  totalHours: number
  overallProgress: number
  studySessions: number
  masteredSubjects: number
  studyDays: number
}

export interface DetailedPerformance {
  quizzes: {
    totalAttempted: number
    correctAnswers: number
    averageScore: number
    timePerQuestion: number
    subjectScores: {
      [subject: string]: {
        attempted: number
        correct: number
        averageTime: number
      }
    }
  }
  simulations: {
    totalCompleted: number
    successRate: number
    averageTime: number
    byType: {
      [type: string]: {
        completed: number
        successful: number
        averageTime: number
      }
    }
  }
  practicalTests: {
    completed: number
    averageScore: number
    bySkill: {
      [skill: string]: {
        score: number
        attempts: number
      }
    }
  }
  studyTime: {
    total: number
    byActivity: {
      lectures: number
      quizzes: number
      simulations: number
      reading: number
    }
    bySubject: {
      [subject: string]: number
    }
  }
  skillLevels: {
    [skill: string]: {
      level: number // 1-5
      lastAssessed: string
      progress: number // 0-100
    }
  }
}

export interface WeeklyPerformance {
  week: number
  performance: number
}

export interface SubjectProgress {
  subject: string
  progress: number
}

export interface Achievement {
  id: string
  title: string
  progress: number
  total: number
  status: "completed" | "in-progress" | "not-started"
}

export interface NextActivity {
  id: string
  title: string
  link: string
}
