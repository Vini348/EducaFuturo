"use client"

import { useState, useEffect } from "react"
import { localDB } from "@/lib/localDatabase"
import { useAuth } from "@/lib/authContext"

export function useStudyTracker(activityType: string) {
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [isTracking, setIsTracking] = useState(false)
  const { user } = useAuth()

  // Start tracking when component mounts
  useEffect(() => {
    if (user) {
      setStartTime(new Date())
      setIsTracking(true)
    }
  }, [user])

  // Update study time when component unmounts or user changes
  useEffect(() => {
    return () => {
      if (user && startTime && isTracking) {
        const endTime = new Date()
        const studyDuration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000) // in seconds

        // Update user's study time in local database
        const progress = localDB.getUserProgress(user.id)
        const currentTime = progress?.performanceData?.totalStudyTime || 0
        const currentDays = new Set(progress?.performanceData?.studyDays || [])

        // Add today to study days
        const today = new Date().toISOString().split("T")[0]
        currentDays.add(today)

        // Update performance data
        localDB.updatePerformanceData(user.id, currentTime + studyDuration, today)
      }
    }
  }, [user, startTime, isTracking])

  // Return current session duration for real-time display if needed
  const getCurrentSessionDuration = () => {
    if (!startTime || !isTracking) return 0
    const now = new Date()
    return Math.floor((now.getTime() - startTime.getTime()) / 1000)
  }

  return {
    isTracking,
    getCurrentSessionDuration,
    startTime,
  }
}
