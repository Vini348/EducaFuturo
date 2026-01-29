"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useAuth } from "@/lib/authContext"
import { toast } from "@/components/ui/use-toast"

export function useStudyTracker() {
  const { user } = useAuth()
  const [studyDays, setStudyDays] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadStudyDays()
    }
  }, [user])

  const loadStudyDays = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("user_performance")
        .select("study_days")
        .eq("user_id", user.id)
        .single()

      if (error) {
        if (error.code === "PGRST116") {
          // Create new entry if none exists
          const { data: newData, error: insertError } = await supabase
            .from("user_performance")
            .insert([
              {
                user_id: user.id,
                study_days: [],
                total_study_time: 0,
                study_streak: 0,
              },
            ])
            .select()
            .single()

          if (insertError) throw insertError
          setStudyDays(newData?.study_days || [])
        } else {
          throw error
        }
      } else {
        setStudyDays(data?.study_days || [])
      }
    } catch (error) {
      console.error("Error loading study days:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dias de estudo",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleStudyDay = async (date: string) => {
    if (!user) return

    try {
      let newStudyDays: string[]
      if (studyDays.includes(date)) {
        newStudyDays = studyDays.filter((d) => d !== date)
      } else {
        newStudyDays = [...studyDays, date].sort()
      }

      const { error } = await supabase.from("user_performance").upsert({
        user_id: user.id,
        study_days: newStudyDays,
        total_study_days: newStudyDays.length,
      })

      if (error) throw error

      setStudyDays(newStudyDays)

      // Dispatch custom event with updated count
      const event = new CustomEvent("studyDaysUpdated", {
        detail: {
          count: newStudyDays.length,
          days: newStudyDays,
        },
      })
      window.dispatchEvent(event)

      toast({
        title: studyDays.includes(date) ? "Dia desmarcado" : "Dia marcado",
        description: studyDays.includes(date) ? "Dia removido dos dias de estudo" : "Dia adicionado aos dias de estudo",
        variant: studyDays.includes(date) ? "default" : "success",
      })
    } catch (error) {
      console.error("Error toggling study day:", error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o dia de estudo",
        variant: "destructive",
      })
    }
  }

  return {
    studyDays,
    isLoading,
    toggleStudyDay,
    studyDaysCount: studyDays.length,
  }
}
