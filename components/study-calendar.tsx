"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Clock, CalendarIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabaseClient"
import {
  CalendarProvider,
  CalendarDate,
  CalendarDatePicker,
  CalendarMonthPicker,
  CalendarYearPicker,
  CalendarDatePagination,
  CalendarHeader,
  CalendarBody,
  CalendarItem,
  type Feature,
  type Status,
} from "@/components/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"

export function StudyCalendar() {
  interface CalendarEvent {
    id: string
    user_id?: string
    title: string
    date: string
    time?: string
    description?: string
  }

  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [showEventDialog, setShowEventDialog] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: "",
    time: "",
    description: "",
  })
  const { toast } = useToast()

  // Obter ID do usuário atual
  useEffect(() => {
    const getUserId = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        setUserId(data.session?.user?.id || null)
      } catch (error) {
        console.error("Erro ao obter ID do usuário:", error)
        setUserId(null)
      }
    }

    getUserId()
  }, [])

  // Carregar eventos do localStorage ou Supabase ao iniciar
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true)

        // Sempre carregar do localStorage primeiro para garantir que temos dados
        const savedEvents = localStorage.getItem("calendarEvents")
        let localEvents: CalendarEvent[] = []

        if (savedEvents) {
          try {
            localEvents = JSON.parse(savedEvents)
            // Definir eventos do localStorage imediatamente
            setEvents(localEvents)
          } catch (e) {
            console.error("Erro ao analisar eventos do localStorage:", e)
          }
        }

        // Se o usuário estiver autenticado, tentar carregar do Supabase
        if (userId) {
          try {
            const { data, error } = await supabase
              .from("calendar_events")
              .select("*")
              .eq("user_id", userId)
              .order("date", { ascending: true })

            if (!error && data) {
              // Se conseguir carregar do Supabase, atualizar os eventos
              setEvents(data)
            }
          } catch (error) {
            console.error("Erro ao carregar eventos do Supabase:", error)
            // Já temos os eventos do localStorage, então não precisamos fazer nada aqui
          }
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadEvents()
  }, [userId])

  // Salvar eventos no localStorage quando mudar
  useEffect(() => {
    try {
      localStorage.setItem("calendarEvents", JSON.stringify(events))
    } catch (error) {
      console.error("Erro ao salvar eventos no localStorage:", error)
    }
  }, [events])

  // Converter eventos para o formato Feature
  const eventsAsFeatures: Feature[] = events.map((event) => {
    const eventDate = new Date(event.date)

    // Status padrão para eventos
    const status: Status = {
      id: "1",
      name: "Evento",
      color: "#3b82f6", // Azul
    }

    return {
      id: event.id,
      name: event.title,
      startAt: eventDate,
      endAt: eventDate,
      status,
    }
  })

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date)
    setNewEvent({
      title: "",
      time: "",
      description: "",
      date: format(date, "yyyy-MM-dd"),
    })
    setShowEventDialog(true)
  }

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.date) {
      toast({
        title: "Erro",
        description: "Por favor, preencha pelo menos o título do evento.",
        variant: "destructive",
      })
      return
    }

    try {
      // Criar um novo evento com ID local
      const newEventData: CalendarEvent = {
        id: Date.now().toString(),
        user_id: userId || undefined,
        title: newEvent.title,
        date: newEvent.date,
        time: newEvent.time,
        description: newEvent.description,
      }

      // Atualizar estado local imediatamente
      setEvents((prev) => [...prev, newEventData])
      setShowEventDialog(false)

      // Mostrar toast de sucesso
      toast({
        title: "Evento adicionado",
        description: "Seu evento foi adicionado com sucesso.",
      })

      // Se o usuário estiver autenticado, tentar salvar no Supabase
      if (userId) {
        try {
          const { error } = await supabase.from("calendar_events").insert({
            user_id: userId,
            title: newEventData.title,
            date: newEventData.date,
            time: newEventData.time || null,
            description: newEventData.description || null,
          })

          if (error) {
            console.error("Erro ao salvar evento no Supabase:", error)
          }
        } catch (error) {
          console.error("Erro ao salvar evento no Supabase:", error)
          // Já atualizamos o estado local, então o usuário não perde dados
        }
      }
    } catch (error) {
      console.error("Erro ao adicionar evento:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar o evento, mas ele foi salvo localmente.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Calendário Organizacional</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendário Organizacional</CardTitle>
      </CardHeader>
      <CardContent>
        <CalendarProvider locale="pt-BR" startDay={0} className="border rounded-md">
          <CalendarDate>
            <CalendarDatePicker>
              <CalendarMonthPicker />
              <CalendarYearPicker start={2020} end={2030} />
            </CalendarDatePicker>
            <CalendarDatePagination />
          </CalendarDate>
          <CalendarHeader />
          <CalendarBody features={eventsAsFeatures} onSelectDate={handleSelectDate}>
            {({ feature }) => <CalendarItem key={feature.id} feature={feature} />}
          </CalendarBody>
        </CalendarProvider>

        <p className="text-sm text-gray-500 text-center mt-4">Clique em uma data para adicionar um evento.</p>

        {/* Diálogo para adicionar eventos */}
        <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedDate ? `Adicionar evento para ${format(selectedDate, "dd/MM/yyyy")}` : "Adicionar evento"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={newEvent.title || ""}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Ex: Reunião de projeto"
                />
              </div>
              <div>
                <Label htmlFor="time">Horário (opcional)</Label>
                <Input
                  id="time"
                  type="time"
                  value={newEvent.time || ""}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Input
                  id="description"
                  value={newEvent.description || ""}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Detalhes adicionais..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddEvent}>Salvar Evento</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Lista de eventos próximos */}
        <div className="mt-6">
          <h3 className="font-medium text-lg mb-3">Próximos Eventos</h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {events
              .filter((event) => {
                try {
                  // Filtrar apenas eventos futuros ou de hoje
                  const eventDate = new Date(event.date)
                  const today = new Date()
                  today.setHours(0, 0, 0, 0)
                  return eventDate >= today
                } catch (error) {
                  console.error("Erro ao filtrar evento:", error, event)
                  return false
                }
              })
              .sort((a, b) => {
                try {
                  // Ordenar por data (mais próximos primeiro)
                  return new Date(a.date).getTime() - new Date(b.date).getTime()
                } catch (error) {
                  console.error("Erro ao ordenar eventos:", error, a, b)
                  return 0
                }
              })
              .slice(0, 5) // Limitar a 5 eventos
              .map((event) => (
                <div key={event.id} className="p-3 border rounded-md">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{event.title}</h4>
                    <div className="flex items-center text-sm bg-gray-100 px-2 py-1 rounded">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      <span>{new Date(event.date).toLocaleDateString("pt-BR")}</span>
                    </div>
                  </div>
                  {event.time && (
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{event.time}</span>
                    </div>
                  )}
                  {event.description && <p className="text-sm mt-2 text-gray-700">{event.description}</p>}
                </div>
              ))}
            {events.filter((event) => {
              try {
                const eventDate = new Date(event.date)
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                return eventDate >= today
              } catch (error) {
                return false
              }
            }).length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">Não há eventos próximos agendados.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
