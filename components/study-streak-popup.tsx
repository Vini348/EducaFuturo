"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/authContext"
import { supabase } from "@/lib/supabase"

export function StudyStreakPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [streak, setStreak] = useState(0)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      checkAndShowPopup()
    }
  }, [user])

  const checkAndShowPopup = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("user_performance")
        .select("last_login, study_streak")
        .eq("user_id", user.id)
        .single()

      if (error) throw error

      const lastLogin = data?.last_login ? new Date(data.last_login) : null
      const today = new Date()
      const oneDayAgo = new Date(today)
      oneDayAgo.setDate(today.getDate() - 1)
      const twoDaysAgo = new Date(today)
      twoDaysAgo.setDate(today.getDate() - 2)

      if (!lastLogin || lastLogin <= twoDaysAgo) {
        // Reset streak if more than 2 days have passed
        setStreak(0)
      } else if (lastLogin <= oneDayAgo) {
        // Increment streak if logging in the next day
        setStreak((data?.study_streak || 0) + 1)
      } else {
        // Maintain current streak
        setStreak(data?.study_streak || 0)
      }

      setIsOpen(true)
    } catch (error) {
      console.error("Error checking login streak:", error)
    }
  }

  const handleMarkStudyDay = async () => {
    if (!user || !selectedDate) return

    try {
      const { error } = await supabase.from("user_performance").upsert({
        user_id: user.id,
        last_login: new Date().toISOString(),
        study_streak: streak,
        study_days: supabase.sql`array_append(study_days, ${selectedDate.toISOString().split("T")[0]})`,
      })

      if (error) throw error

      toast({
        title: "Sucesso",
        description: "Dia de estudo marcado com sucesso!",
      })

      setIsOpen(false)
    } catch (error) {
      console.error("Error marking study day:", error)
      toast({
        title: "Erro",
        description: "Não foi possível marcar o dia de estudo. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Marcar Dia de Estudo</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-4">Sua sequência atual de estudos: {streak} dias</p>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => date > new Date() || date < new Date(Date.now() - 86400000 * 2)}
            className="rounded-md border"
          />
        </div>
        <DialogFooter>
          <Button onClick={handleMarkStudyDay}>Marcar Dia de Estudo</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
