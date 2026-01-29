import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FlashcardProgress } from "@/components/flashcard-progress"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface MixedModeCardProps {
  title: string
  description: string
  icon: ReactNode
  color: string
  iconBg: string
  mode: string
  count: number
  progress?: { completed: number; total: number }
  badgeColor: string
}

export function MixedModeCard({
  title,
  description,
  icon,
  color,
  iconBg,
  mode,
  count,
  progress,
  badgeColor,
}: MixedModeCardProps) {
  return (
    <Link href={`/flashcards/${mode}`} className="block transition-transform hover:scale-[1.02]">
      <Card className={cn("h-full border overflow-hidden", color)}>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className={cn("p-3 rounded-lg", iconBg)}>{icon}</div>
            <Badge className={badgeColor}>{count} cartões</Badge>
          </div>
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
        <CardFooter className="p-6 pt-0 flex flex-col items-start">
          {progress ? (
            <div className="w-full">
              <FlashcardProgress completed={progress.completed} total={progress.total} />
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-muted-foreground">
                  {progress.completed} de {progress.total} concluídos
                </span>
                <ArrowRight className="h-4 w-4 text-primary" />
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center w-full">
              <span className="text-sm text-muted-foreground">Iniciar estudo</span>
              <ArrowRight className="h-4 w-4 text-primary" />
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}
