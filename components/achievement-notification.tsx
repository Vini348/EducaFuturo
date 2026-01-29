"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { UnlockedAchievement } from "@/lib/achievements-system"
import { markAchievementsAsNotified } from "@/lib/achievements-system"

interface AchievementNotificationProps {
  userId: string
  achievements: UnlockedAchievement[]
  onClose: () => void
}

export function AchievementNotification({ userId, achievements, onClose }: AchievementNotificationProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  const currentAchievement = achievements[currentIndex]

  useEffect(() => {
    if (!currentAchievement) return

    const timer = setTimeout(() => {
      handleNext()
    }, 5000)

    return () => clearTimeout(timer)
  }, [currentIndex, currentAchievement])

  const handleNext = () => {
    if (currentIndex < achievements.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      handleClose()
    }
  }

  const handleClose = async () => {
    setIsVisible(false)
    const achievementIds = achievements.map((a) => a.id)
    await markAchievementsAsNotified(userId, achievementIds)
    setTimeout(onClose, 300)
  }

  if (!currentAchievement) return null

  const tierColors = {
    bronze: "from-amber-600 to-amber-800",
    prata: "from-gray-400 to-gray-600",
    ouro: "from-yellow-400 to-yellow-600",
    platina: "from-cyan-400 to-cyan-600",
    diamante: "from-blue-400 via-purple-500 to-pink-500",
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-4 right-4 z-50 w-96"
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <div
            className={`relative rounded-lg p-6 shadow-2xl bg-gradient-to-br ${tierColors[currentAchievement.tier as keyof typeof tierColors]} text-white overflow-hidden`}
          >
            <div className="absolute inset-0 bg-black/20" />

            <motion.div
              className="absolute -top-10 -right-10 w-40 h-40"
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              <Sparkles className="w-full h-full text-white/20" />
            </motion.div>

            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 text-white hover:bg-white/20"
              onClick={handleClose}
            >
              <X className="w-4 h-4" />
            </Button>

            <div className="relative z-10 space-y-4">
              <motion.div
                className="text-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <div className="text-6xl mb-2">{currentAchievement.icon}</div>
                <h3 className="text-2xl font-bold">Conquista Desbloqueada!</h3>
              </motion.div>

              <motion.div
                className="text-center space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-xl font-semibold">{currentAchievement.name}</p>
                <p className="text-sm opacity-90">{currentAchievement.description}</p>

                {currentAchievement.reward_points > 0 && (
                  <motion.div
                    className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: "spring" }}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span className="font-bold">+{currentAchievement.reward_points} pontos</span>
                  </motion.div>
                )}
              </motion.div>

              {achievements.length > 1 && (
                <div className="flex justify-center gap-2 pt-2">
                  {achievements.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${index === currentIndex ? "bg-white" : "bg-white/30"}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
