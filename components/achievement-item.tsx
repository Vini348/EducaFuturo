import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Circle, Clock } from "lucide-react"
import type { Achievement } from "@/types/performance"

interface AchievementItemProps {
  achievement: Achievement
}

export function AchievementItem({ achievement }: AchievementItemProps) {
  const progressPercentage = (achievement.progress / achievement.total) * 100

  const getStatusIcon = () => {
    switch (achievement.status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <Circle className="h-4 w-4 text-gray-300" />
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        <span className="text-sm">{achievement.title}</span>
      </div>
      <Progress value={progressPercentage} />
      <div className="text-xs text-gray-500 text-right">{progressPercentage.toFixed(0)}%</div>
    </div>
  )
}
