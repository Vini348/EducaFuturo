"use client"

import { useState, useEffect } from "react"
import { TopNav } from "@/components/top-nav"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowLeft, Plus, Save } from "lucide-react"
import Link from "next/link"
import type { SubjectSchedule, TimeSlot, WeeklySchedule, CustomActivity } from "@/types/schedule"
import { ScheduleTable } from "@/components/schedule-table"
import { SubjectForm } from "@/components/subject-form"
import { exportScheduleToPDF } from "@/utils/pdf-export"
import { useAuth } from "@/lib/authContext"
import { scheduleDb } from "@/lib/schedule-db"
import { useToast } from "@/components/ui/use-toast"

const defaultTimeSlots: TimeSlot[] = [
  { id: "1", startTime: "07:00", endTime: "08:00", activity: "Acordar" },
  { id: "2", startTime: "08:00", endTime: "12:00", activity: "Atividades" },
  { id: "3", startTime: "12:00", endTime: "13:00", activity: "Almoço" },
  { id: "4", startTime: "13:00", endTime: "18:00", activity: "Estudar" },
  { id: "5", startTime: "18:00", endTime: "19:00", activity: "Estudar" },
  { id: "6", startTime: "19:00", endTime: "22:00", activity: "Descansar" },
]

const initialSchedule: WeeklySchedule = {
  monday: [...defaultTimeSlots],
  tuesday: [...defaultTimeSlots],
  wednesday: [...defaultTimeSlots],
  thursday: [...defaultTimeSlots],
  friday: [...defaultTimeSlots],
  saturday: [...defaultTimeSlots],
  sunday: [...defaultTimeSlots],
}

export default function StudySchedulePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [subjects, setSubjects] = useState<SubjectSchedule[]>([])
  const [schedule, setSchedule] = useState<WeeklySchedule>(initialSchedule)
  const [customActivities, setCustomActivities] = useState<CustomActivity[]>([])
  const [showSubjectForm, setShowSubjectForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      // Load subjects
      const loadedSubjects = await scheduleDb.getStudySchedule(user.id)
      setSubjects(loadedSubjects)

      // Load time slots
      const loadedTimeSlots = await scheduleDb.getTimeSlots(user.id)
      if (loadedTimeSlots.length > 0) {
        const newSchedule: WeeklySchedule = {
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
          saturday: [],
          sunday: [],
        }

        loadedTimeSlots.forEach((slot) => {
          newSchedule[slot.day_of_week.toLowerCase() as keyof WeeklySchedule].push({
            id: slot.id,
            startTime: slot.start_time,
            endTime: slot.end_time,
            activity: slot.activity,
            subject: slot.subject_id,
            description: slot.description,
          })
        })

        setSchedule(newSchedule)
      }

      // Load custom activities
      const loadedActivities = await scheduleDb.getCustomActivities(user.id)
      setCustomActivities(loadedActivities)
    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do cronograma",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSubject = async (subject: Omit<SubjectSchedule, "id">) => {
    if (!user) return

    try {
      const newSubject = await scheduleDb.addSubject(user.id, subject)
      if (newSubject) {
        setSubjects((prev) => [...prev, newSubject])
        setShowSubjectForm(false)
        toast({
          title: "Sucesso",
          description: "Matéria adicionada com sucesso",
        })
      }
    } catch (error) {
      console.error("Error saving subject:", error)
      toast({
        title: "Erro",
        description: "Não foi possível salvar a matéria",
        variant: "destructive",
      })
    }
  }

  const handleUpdateSchedule = async (day: keyof WeeklySchedule, slots: TimeSlot[]) => {
    if (!user) return

    try {
      // Update each slot in the database
      for (const slot of slots) {
        await scheduleDb.updateTimeSlot(user.id, day, slot)
      }

      setSchedule((prev) => ({
        ...prev,
        [day]: slots,
      }))

      toast({
        title: "Sucesso",
        description: "Cronograma atualizado com sucesso",
      })
    } catch (error) {
      console.error("Error updating schedule:", error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o cronograma",
        variant: "destructive",
      })
    }
  }

  const handleAddCustomActivity = async (activityName: string) => {
    if (!user) return

    try {
      const newActivity = await scheduleDb.addCustomActivity(user.id, activityName)
      if (newActivity) {
        setCustomActivities((prev) => [...prev, newActivity])
        toast({
          title: "Sucesso",
          description: "Atividade adicionada com sucesso",
        })
      }
    } catch (error) {
      console.error("Error adding custom activity:", error)
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a atividade",
        variant: "destructive",
      })
    }
  }

  const handleExportPDF = () => {
    exportScheduleToPDF(schedule, subjects, customActivities)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-16">
        <TopNav />
        <main className="container mx-auto px-4 py-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2">Carregando...</span>
              </div>
            </CardContent>
          </Card>
        </main>
        <BottomNav active="study" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <TopNav />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/study">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Cronograma de Estudos</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Matérias
                <Dialog open={showSubjectForm} onOpenChange={setShowSubjectForm}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Matéria
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Nova Matéria</DialogTitle>
                      <DialogDescription>Configure os detalhes da matéria e a frequência de estudos.</DialogDescription>
                    </DialogHeader>
                    <SubjectForm onSave={handleSaveSubject} />
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subjects.map((subject) => (
                  <div
                    key={subject.id}
                    className="p-4 rounded-lg border"
                    style={{ borderLeftColor: subject.color, borderLeftWidth: "4px" }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{subject.name}</h3>
                        <p className="text-sm text-gray-500">{subject.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {subjects.length === 0 && (
                  <p className="text-center text-gray-500 py-4">
                    Nenhuma matéria adicionada. Clique no botão acima para começar.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Horários
                <div className="flex space-x-2">
                  <Button onClick={() => handleUpdateSchedule} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </Button>
                  <Button onClick={handleExportPDF} className="flex-1">
                    Exportar PDF
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScheduleTable
                schedule={schedule}
                subjects={subjects}
                customActivities={customActivities}
                onUpdateSchedule={handleUpdateSchedule}
                onAddCustomActivity={handleAddCustomActivity}
              />
            </CardContent>
          </Card>
        </div>
      </main>

      <BottomNav active="study" />
    </div>
  )
}
