"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/authContext"
import { toast } from "@/components/ui/use-toast"

// Local storage keys
const STUDY_DAYS_KEY = "educaFuturo_studyDays"
const LAST_LOGIN_KEY = "educaFuturo_lastLogin"

export function StudyDayTracker() {
  const [weekDays, setWeekDays] = useState<("studied" | "missed" | "unmarked")[]>(Array(7).fill("unmarked"))
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [studyDaysData, setStudyDaysData] = useState<string[]>([])

  useEffect(() => {
    if (user) {
      loadWeekStudyDays()
    }
  }, [user])

  const loadWeekStudyDays = async () => {
    if (!user) return
    setIsLoading(true)

    try {
      const today = new Date()
      const startOfWeek = new Date(today)
      startOfWeek.setDate(today.getDate() - today.getDay())
      startOfWeek.setHours(0, 0, 0, 0)

      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)
      endOfWeek.setHours(23, 59, 59, 999)

      // Get data from localStorage
      let studyDays: string[] = []
      let storedWeekDays = Array(7).fill("unmarked")
      let lastLogin = new Date()
      const currentWeekIdentifier = startOfWeek.toISOString()

      const storedDataString = localStorage.getItem(STUDY_DAYS_KEY)
      const storedLogin = localStorage.getItem(LAST_LOGIN_KEY)

      if (storedDataString) {
        const storedData = JSON.parse(storedDataString)

        // Check if we're in a new week
        if (storedData.weekIdentifier && storedData.weekIdentifier !== currentWeekIdentifier) {
          // It's a new week, reset the week days but keep the study days history
          console.log("New week detected, resetting week days")
          storedWeekDays = Array(7).fill("unmarked")
        } else {
          // Same week, use stored week days
          studyDays = storedData.studyDays || []
          storedWeekDays = storedData.weekDays || Array(7).fill("unmarked")
        }
      }

      if (storedLogin) {
        lastLogin = new Date(storedLogin)
      }

      setStudyDaysData(studyDays)
      setWeekDays(storedWeekDays)

      // Save the current week identifier
      const updatedStorageData = {
        weekIdentifier: currentWeekIdentifier,
        studyDays,
        weekDays: storedWeekDays,
        lastUpdated: new Date().toISOString(),
      }
      localStorage.setItem(STUDY_DAYS_KEY, JSON.stringify(updatedStorageData))
    } catch (error) {
      console.error("Error loading week study days:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dias de estudo.",
        variant: "destructive",
      })

      // Use empty data as last resort
      setWeekDays(Array(7).fill("unmarked"))
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to process study days data
  const processStudyDays = (studyDays: string[], lastLogin: Date, startOfWeek: Date, endOfWeek: Date, today: Date) => {
    const weekStudyDays = Array(7).fill("unmarked")

    let firstStudyDay = null
    studyDays.forEach((day: string) => {
      const studyDate = new Date(day)
      if (studyDate >= startOfWeek && studyDate <= endOfWeek) {
        weekStudyDays[studyDate.getDay()] = "studied"
        if (!firstStudyDay || studyDate < firstStudyDay) {
          firstStudyDay = studyDate
        }
      }
    })

    if (firstStudyDay) {
      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startOfWeek)
        currentDate.setDate(startOfWeek.getDate() + i)
        if (
          currentDate < today &&
          currentDate >= firstStudyDay &&
          weekStudyDays[i] === "unmarked" &&
          currentDate > lastLogin
        ) {
          weekStudyDays[i] = "missed"
        }
      }
    }

    setWeekDays(weekStudyDays)
  }

  const toggleStudyDay = async (index: number) => {
    if (!user) return
    if (isLoading) return

    setIsLoading(true)
    const today = new Date()
    const currentDayIndex = today.getDay()

    if (index !== currentDayIndex) {
      toast({
        title: "Aviso",
        description: "Você só pode marcar o dia atual como dia de estudo.",
        variant: "warning",
      })
      setIsLoading(false)
      return
    }

    const newWeekDays = [...weekDays]
    const isMarking = newWeekDays[index] === "unmarked"
    newWeekDays[index] = isMarking ? "studied" : "unmarked"
    setWeekDays(newWeekDays)

    const formattedDate = today.toISOString().split("T")[0]

    // Update local state first
    let updatedStudyDays = [...studyDaysData]

    if (isMarking) {
      if (!updatedStudyDays.includes(formattedDate)) {
        updatedStudyDays.push(formattedDate)
      }
    } else {
      updatedStudyDays = updatedStudyDays.filter((day) => day !== formattedDate)
    }

    setStudyDaysData(updatedStudyDays)

    // Store in localStorage with week identifier to handle resets
    const currentWeekStart = new Date(today)
    currentWeekStart.setDate(today.getDate() - today.getDay())
    currentWeekStart.setHours(0, 0, 0, 0)
    const weekIdentifier = currentWeekStart.toISOString()

    const storageData = {
      weekIdentifier,
      studyDays: updatedStudyDays,
      weekDays: newWeekDays,
      lastUpdated: new Date().toISOString(),
    }

    localStorage.setItem(STUDY_DAYS_KEY, JSON.stringify(storageData))
    localStorage.setItem(LAST_LOGIN_KEY, new Date().toISOString())

    try {
      // Dispatch event to update performance metrics
      const event = new CustomEvent("studyDaysUpdated", {
        detail: {
          count: updatedStudyDays.length,
          days: updatedStudyDays.map((day: string) => new Date(day).getTime()),
          isIncrementing: isMarking, // Add this flag to indicate if we're adding or removing a day
        },
      })
      window.dispatchEvent(event)

      toast({
        title: isMarking ? "Dia marcado" : "Dia desmarcado",
        description: isMarking ? "Dia de estudo registrado com sucesso!" : "Dia de estudo removido com sucesso!",
        variant: "success",
      })
    } catch (error) {
      console.error("Error updating study day:", error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o dia de estudo.",
        variant: "destructive",
      })
      // Revert the local state change if the update failed
      setWeekDays((prevDays) => {
        const revertedDays = [...prevDays]
        revertedDays[index] = prevDays[index] === "unmarked" ? "studied" : "unmarked"
        return revertedDays
      })
      // Also revert localStorage
      localStorage.setItem(
        STUDY_DAYS_KEY,
        JSON.stringify({
          weekIdentifier,
          studyDays: studyDaysData,
          weekDays: weekDays,
          lastUpdated: new Date().toISOString(),
        }),
      )
    } finally {
      setIsLoading(false)
    }
  }

  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

  if (!user) {
    return null // Return null instead of the login prompt card
  }

  return null
}
