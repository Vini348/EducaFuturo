"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/authContext"
import { checkAndUnlockAchievements, type UnlockedAchievement } from "@/lib/achievements-system"
import { AchievementNotification } from "./achievement-notification"

export function AchievementTracker() {
  const { user } = useAuth()
  const [newAchievements, setNewAchievements] = useState<UnlockedAchievement[]>([])
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    if (!user?.id) return

    const interval = setInterval(() => {
      checkForNewAchievements()
    }, 10000)

    checkForNewAchievements()

    return () => clearInterval(interval)
  }, [user])

  const checkForNewAchievements = async () => {
    if (!user?.id) return

    try {
      const { data } = await checkAndUnlockAchievements(user.id)
      if (data && data.length > 0) {
        setNewAchievements(data)
        setShowNotification(true)
      }
    } catch (error) {
      console.error("Erro ao verificar conquistas:", error)
    }
  }

  if (!showNotification || newAchievements.length === 0) return null

  return (
    <AchievementNotification
      userId={user!.id}
      achievements={newAchievements}
      onClose={() => {
        setShowNotification(false)
        setNewAchievements([])
      }}
    />
  )
}
