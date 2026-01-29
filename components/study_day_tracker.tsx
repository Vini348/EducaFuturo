"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/authContext"
import { supabase } from "@/lib/supabaseClient"
import { Calendar, Flame, CheckCircle2, Clock, TrendingUp } from "lucide-react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, subDays, isToday } from "date-fns"
import { ptBR } from "date-fns/locale"

interface StudyDay {
  date: string
  studied: boolean
  challenges?: number
  timeSpent?: number
}

export function StudyDayTracker() {
  const { user } = useAuth()
  const [studyDays, setStudyDays] = useState<string[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [streak, setStreak] = useState(0)
  const [monthlyStats, setMonthlyStats] = useState({
    totalDays: 0,
    studiedDays: 0,
    percentage: 0,
  })

  useEffect(() => {
    if (user) {
      loadStudyDays()
    }
  }, [user, currentMonth])

  useEffect(() => {
    // Escutar atualizações de dias de estudo
    const handleStudyDaysUpdate = (event: CustomEvent) => {
      const { days } = event.detail
      setStudyDays(days)
      calculateStreak(days)
      calculateMonthlyStats(days)
    }

    window.addEventListener("studyDaysUpdated", handleStudyDaysUpdate as EventListener)

    return () => {
      window.removeEventListener("studyDaysUpdated", handleStudyDaysUpdate as EventListener)
    }
  }, [currentMonth])

  const loadStudyDays = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("user_performance")
        .select("study_days")
        .eq("user_id", user.id)
        .single()

      if (error && error.code !== "PGRST116") {
        console.error("Error loading study days:", error)
        return
      }

      const days = data?.study_days || []
      setStudyDays(days)
      calculateStreak(days)
      calculateMonthlyStats(days)
    } catch (error) {
      console.error("Error loading study days:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateStreak = (days: string[]) => {
    if (days.length === 0) {
      setStreak(0)
      return
    }

    // Ordenar dias em ordem decrescente (mais recente primeiro)
    const sortedDays = [...days].sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

    // Verificar se estudou hoje ou ontem
    const today = format(new Date(), "yyyy-MM-dd")
    const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd")

    const hasStudiedRecently = sortedDays[0] === today || sortedDays[0] === yesterday

    if (!hasStudiedRecently) {
      setStreak(0)
      return
    }

    // Calcular sequência atual
    let currentStreak = 1
    let currentDate = new Date(sortedDays[0])

    for (let i = 1; i < sortedDays.length; i++) {
      const previousDate = subDays(currentDate, 1)
      const previousDateString = format(previousDate, "yyyy-MM-dd")

      if (sortedDays[i] === previousDateString) {
        currentStreak++
        currentDate = previousDate
      } else if (sortedDays[i] === format(currentDate, "yyyy-MM-dd")) {
        // Mesmo dia, continua
        continue
      } else {
        // Sequência quebrada
        break
      }
    }

    setStreak(currentStreak)
  }

  const calculateMonthlyStats = (days: string[]) => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

    const studiedDaysInMonth = days.filter((day) => {
      const dayDate = new Date(day)
      return dayDate >= monthStart && dayDate <= monthEnd
    })

    const totalDays = daysInMonth.length
    const studiedDays = studiedDaysInMonth.length
    const percentage = totalDays > 0 ? Math.round((studiedDays / totalDays) * 100) : 0

    setMonthlyStats({
      totalDays,
      studiedDays,
      percentage,
    })
  }

  const getDayStatus = (date: Date): "studied" | "today" | "future" | "missed" => {
    const dateString = format(date, "yyyy-MM-dd")
    const today = new Date()

    if (isToday(date)) {
      return studyDays.includes(dateString) ? "studied" : "today"
    }

    if (date > today) {
      return "future"
    }

    return studyDays.includes(dateString) ? "studied" : "missed"
  }

  const getDayColor = (status: string): string => {
    switch (status) {
      case "studied":
        return "bg-green-500 text-white border-green-600"
      case "today":
        return "bg-blue-500 text-white border-blue-600 ring-2 ring-blue-300"
      case "future":
        return "bg-gray-100 text-gray-400 border-gray-200"
      case "missed":
        return "bg-red-100 text-red-600 border-red-200"
      default:
        return "bg-gray-100 text-gray-600 border-gray-200"
    }
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev)
      if (direction === "prev") {
        newMonth.setMonth(prev.getMonth() - 1)
      } else {
        newMonth.setMonth(prev.getMonth() + 1)
      }
      return newMonth
    })
  }

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Adicionar dias do mês anterior para completar a primeira semana
  const startDate = new Date(monthStart)
  startDate.setDate(startDate.getDate() - monthStart.getDay())

  // Adicionar dias do próximo mês para completar a última semana
  const endDate = new Date(monthEnd)
  endDate.setDate(endDate.getDate() + (6 - monthEnd.getDay()))

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })

  if (!user) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* Estatísticas do mês */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
          <div className="flex items-center justify-center mb-1">
            <Calendar className="h-4 w-4 text-blue-500 mr-1" />
            <span className="text-sm font-medium text-gray-600">Dias Estudados</span>
          </div>
          <div className="text-xl font-bold text-blue-600">{monthlyStats.studiedDays}</div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
          <div className="flex items-center justify-center mb-1">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm font-medium text-gray-600">Taxa Mensal</span>
          </div>
          <div className="text-xl font-bold text-green-600">{monthlyStats.percentage}%</div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
          <div className="flex items-center justify-center mb-1">
            <Flame className="h-4 w-4 text-orange-500 mr-1" />
            <span className="text-sm font-medium text-gray-600">Sequência</span>
          </div>
          <div className="text-xl font-bold text-orange-600">{streak}</div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
          <div className="flex items-center justify-center mb-1">
            <Clock className="h-4 w-4 text-purple-500 mr-1" />
            <span className="text-sm font-medium text-gray-600">Total</span>
          </div>
          <div className="text-xl font-bold text-purple-600">{studyDays.length}</div>
        </div>
      </div>

      {/* Calendário */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
            </CardTitle>
            <div className="flex gap-2">
              <button
                onClick={() => navigateMonth("prev")}
                className="p-1 rounded hover:bg-gray-100 transition-colors"
                disabled={isLoading}
              >
                ←
              </button>
              <button
                onClick={() => navigateMonth("next")}
                className="p-1 rounded hover:bg-gray-100 transition-colors"
                disabled={isLoading}
              >
                →
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Cabeçalho dos dias da semana */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Dias do calendário */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date) => {
              const status = getDayStatus(date)
              const isCurrentMonth = date.getMonth() === currentMonth.getMonth()
              const dayNumber = date.getDate()

              return (
                <div
                  key={date.toISOString()}
                  className={`
                    relative h-8 w-8 rounded-full border text-xs font-medium
                    flex items-center justify-center transition-all duration-200
                    ${getDayColor(status)}
                    ${!isCurrentMonth ? "opacity-30" : ""}
                    ${isCurrentMonth ? "hover:scale-110" : ""}
                  `}
                  title={
                    status === "studied"
                      ? `Estudou em ${format(date, "dd/MM/yyyy")}`
                      : status === "today"
                        ? "Hoje"
                        : status === "missed"
                          ? `Não estudou em ${format(date, "dd/MM/yyyy")}`
                          : format(date, "dd/MM/yyyy")
                  }
                >
                  {dayNumber}
                  {status === "studied" && (
                    <CheckCircle2 className="absolute -top-1 -right-1 h-3 w-3 text-green-600 bg-white rounded-full" />
                  )}
                </div>
              )
            })}
          </div>

          {/* Legenda */}
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-600">Estudou</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500 ring-2 ring-blue-300"></div>
              <span className="text-xs text-gray-600">Hoje</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-100 border border-red-200"></div>
              <span className="text-xs text-gray-600">Perdeu</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-gray-100 border border-gray-200"></div>
              <span className="text-xs text-gray-600">Futuro</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Motivação baseada na sequência */}
      {streak > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center gap-3">
            <Flame className="h-6 w-6 text-orange-500" />
            <div>
              <p className="font-semibold text-orange-700">
                🔥 Sequência de {streak} {streak === 1 ? "dia" : "dias"}!
              </p>
              <p className="text-sm text-orange-600">
                {streak >= 7
                  ? "Incrível! Você está mantendo uma rotina consistente!"
                  : streak >= 3
                    ? "Muito bem! Continue assim para formar um hábito!"
                    : "Bom começo! Mantenha o ritmo!"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
