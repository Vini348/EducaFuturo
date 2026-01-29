"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface FlashcardProgressProps {
  completed: number
  total: number
  showAnimation?: boolean
  className?: string
}

export function FlashcardProgress({ completed, total, showAnimation = true, className }: FlashcardProgressProps) {
  const percentage = total > 0 ? (completed / total) * 100 : 0

  // Determine difficulty level based on the cards in this topic
  const getDifficultyLabel = () => {
    if (percentage < 33) {
      return "Iniciante"
    } else if (percentage < 66) {
      return "Intermediário"
    } else {
      return "Avançado"
    }
  }

  // Determine color based on difficulty
  const getProgressColor = () => {
    if (percentage < 33) {
      return "bg-purple-500" // Fácil - roxo
    } else if (percentage < 66) {
      return "bg-fuchsia-500" // Médio - fúcsia
    } else {
      return "bg-pink-500" // Difícil - rosa
    }
  }

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex justify-between items-center text-xs">
        <span className="text-muted-foreground">
          {completed} de {total} dominados
        </span>
        <span className="font-medium">{getDifficultyLabel()}</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        {showAnimation ? (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-full rounded-full ${getProgressColor()}`}
          />
        ) : (
          <div className={`h-full rounded-full ${getProgressColor()}`} style={{ width: `${percentage}%` }} />
        )}
      </div>
    </div>
  )
}
