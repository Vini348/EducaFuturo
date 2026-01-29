"use client"

import { Card } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface SubjectCardProps {
  icon: LucideIcon
  title: string
  progress: number
  total: number
  className?: string
  onClick?: () => void
}

export function SubjectCard({ icon: Icon, title, progress, total, className, onClick }: SubjectCardProps) {
  const progressPercentage = (progress / total) * 100

  return (
    <Card className={`p-4 hover:shadow-md transition-all dark:border-gray-800 ${className}`} onClick={onClick}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <Icon className="h-6 w-6 text-white dark:text-white" />
          <h3 className="font-medium text-white dark:text-white">{title}</h3>
        </div>
        <span className="text-white dark:text-white text-sm">
          {progress}/{total}
        </span>
      </div>
      <Progress value={progressPercentage} className="bg-white/20 dark:bg-white/10" />
    </Card>
  )
}
