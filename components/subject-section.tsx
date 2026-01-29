import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FlashcardProgress } from "@/components/flashcard-progress"
import Link from "next/link"
import { ChevronRight, Cpu, Zap, Activity } from "lucide-react"
import { cn } from "@/lib/utils"
import type { FlashcardSubject } from "@/types/flashcards"

interface SubjectSectionProps {
  subject: FlashcardSubject
  progress: Record<string, { completed: number; total: number }>
  cardCount: number
}

export function SubjectSection({ subject, progress, cardCount }: SubjectSectionProps) {
  const getSubjectIcon = (id: string) => {
    switch (id) {
      case "digital":
        return <Cpu className="h-5 w-5 text-blue-600" />
      case "analog":
        return <Activity className="h-5 w-5 text-green-600" />
      case "power":
        return <Zap className="h-5 w-5 text-orange-600" />
      default:
        return <Cpu className="h-5 w-5 text-primary" />
    }
  }

  const getSubjectColor = (id: string) => {
    switch (id) {
      case "digital":
        return "bg-blue-50 border-blue-200"
      case "analog":
        return "bg-green-50 border-green-200"
      case "power":
        return "bg-orange-50 border-orange-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  const getSubjectBadgeColor = (id: string) => {
    switch (id) {
      case "digital":
        return "bg-blue-100 text-blue-800"
      case "analog":
        return "bg-green-100 text-green-800"
      case "power":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className={cn("overflow-hidden", getSubjectColor(subject.id))}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            {getSubjectIcon(subject.id)}
            <span className="ml-2">{subject.title}</span>
          </CardTitle>
          <Badge className={getSubjectBadgeColor(subject.id)}>{cardCount} cartões</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subject.topics.map((topic) => {
            const topicId = `${subject.id}-${topic.id}`
            const topicProgress = progress[topicId]
            const totalCards = topic.cards.length

            return (
              <Link
                key={topic.id}
                href={`/flashcards/${topicId}`}
                className="block transition-transform hover:scale-[1.02]"
              >
                <Card className="h-full border hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium">{topic.title}</h3>
                      <Badge variant="outline">{totalCards}</Badge>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Fácil</span>
                        <span>{topic.cards.filter((c) => c.difficulty === "easy").length}</span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Médio</span>
                        <span>{topic.cards.filter((c) => c.difficulty === "medium").length}</span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Difícil</span>
                        <span>{topic.cards.filter((c) => c.difficulty === "hard").length}</span>
                      </div>
                    </div>

                    {topicProgress ? (
                      <div>
                        <FlashcardProgress completed={topicProgress.completed} total={topicProgress.total} />
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-muted-foreground">
                            {topicProgress.completed} de {topicProgress.total} concluídos
                          </span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-xs text-muted-foreground">Iniciar estudo</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
