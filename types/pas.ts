export interface Course {
  name: string
  degree: string
  schedule: string
  campus: string
  cutoffScores?: {
    universal: number
    blackQuota: number
    lowIncome: number
    lowIncomeBlack: number
    ppi: number
    pcd: number
  }
}

export interface PASGrade {
  exam: number
  essay: number
  language: {
    type: "english" | "spanish" | "french"
    grade: number
  }
}

export interface AdmissionSystem {
  id: string
  name: string
  description?: string
  isPublicSchool?: boolean
}

export interface PASResult {
  finalScore: number
  breakdown: {
    pas1: number
    pas2: number
    pas3: number
  }
  eligibleCourses: {
    course: Course
    status: "within" | "outside"
    difference: number
  }[]
}
