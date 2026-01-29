"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { CheckCircle2, Lock } from "lucide-react"

interface AchievementBadgeProps {
  name: string
  description: string
  icon: string
  tier: "bronze" | "prata" | "ouro" | "platina" | "diamante"
  progress: number
  unlocked: boolean
  size?: "sm" | "md" | "lg"
  showProgress?: boolean
}

const tierColors = {
  bronze: "from-amber-600 to-amber-800",
  prata: "from-gray-400 to-gray-600",
  ouro: "from-yellow-400 to-yellow-600",
  platina: "from-cyan-400 to-cyan-600",
  diamante: "from-blue-400 via-purple-500 to-pink-500",
}

const tierBorderColors = {
  bronze: "border-amber-600",
  prata: "border-gray-500",
  ouro: "border-yellow-500",
  platina: "border-cyan-500",
  diamante: "border-purple-500",
}

export function AchievementBadge({
  name,
  description,
  icon,
  tier,
  progress,
  unlocked,
  size = "md",
  showProgress = true,
}: AchievementBadgeProps) {
  const sizeClasses = {
    sm: "w-16 h-16 text-2xl",
    md: "w-24 h-24 text-4xl",
    lg: "w-32 h-32 text-5xl",
  }

  return (
    <motion.div
      className="relative flex flex-col items-center gap-2"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="relative">
        <motion.div
          className={cn(
            "relative rounded-full border-4 flex items-center justify-center",
            "transition-all duration-300",
            sizeClasses[size],
            unlocked
              ? `bg-gradient-to-br ${tierColors[tier]} ${tierBorderColors[tier]} shadow-lg`
              : "bg-gray-700 border-gray-600 opacity-50 grayscale",
          )}
          animate={unlocked ? { rotate: [0, 5, -5, 0] } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span className={unlocked ? "filter-none" : "filter grayscale opacity-50"}>{icon}</span>

          {unlocked && (
            <motion.div
              className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.3 }}
            >
              <CheckCircle2 className="w-4 h-4 text-white" />
            </motion.div>
          )}

          {!unlocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
              <Lock className="w-6 h-6 text-gray-300" />
            </div>
          )}
        </motion.div>

        {showProgress && !unlocked && progress > 0 && (
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-full px-2">
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="text-center">
        <p className={cn("font-semibold text-sm", unlocked ? "text-white" : "text-gray-400")}>{name}</p>
        {showProgress && (
          <p className="text-xs text-gray-500">{unlocked ? "Desbloqueado! 🎉" : `${Math.round(progress)}% completo`}</p>
        )}
      </div>
    </motion.div>
  )
}
