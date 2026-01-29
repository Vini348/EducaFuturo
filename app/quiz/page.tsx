"use client"

import { useState } from "react"
import { TopNav } from "@/components/top-nav"
import { BottomNav } from "@/components/bottom-nav"
import { QuizCard } from "@/components/quiz-card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import { quizzes } from "@/data/quizzes"
import { useRouter } from "next/navigation"

export default function QuizPage() {
  const router = useRouter()
  const [subject, setSubject] = useState<string>("all")
  const [selectedQuiz, setSelectedQuiz] = useState<string>("")

  const filteredQuizzes = subject === "all" ? quizzes : quizzes.filter((quiz) => quiz.subject === subject)

  const handleQuizSelect = (quizId: string) => {
    router.push(`/quiz/${quizId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <TopNav />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">Quiz</h1>
        </div>

        <div className="space-y-4">
          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger>
              <SelectValue placeholder="Todas as matérias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as matérias</SelectItem>
              <SelectItem value="digital">Eletrônica Digital</SelectItem>
              <SelectItem value="analog">Eletrônica Analógica</SelectItem>
              <SelectItem value="power">Eletrônica de Potência</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedQuiz} onValueChange={handleQuizSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um quiz" />
            </SelectTrigger>
            <SelectContent>
              {filteredQuizzes.map((quiz) => (
                <SelectItem key={quiz.id} value={quiz.id}>
                  {quiz.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {filteredQuizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} onClick={() => handleQuizSelect(quiz.id)} />
          ))}
        </div>
      </main>

      <BottomNav active="review" />
    </div>
  )
}
