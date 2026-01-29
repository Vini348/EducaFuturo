"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import type { SubjectSchedule, TimeSlot, WeeklySchedule, CustomActivity } from "@/types/schedule"

interface ScheduleTableProps {
  schedule: WeeklySchedule
  subjects: SubjectSchedule[]
  customActivities: CustomActivity[]
  onUpdateSchedule: (day: keyof WeeklySchedule, slots: TimeSlot[]) => void
  onAddCustomActivity: (activityName: string) => void
}

export function ScheduleTable({
  schedule,
  subjects,
  customActivities,
  onUpdateSchedule,
  onAddCustomActivity,
}: ScheduleTableProps) {
  const [newActivityName, setNewActivityName] = useState("")
  const [selectedDay, setSelectedDay] = useState<keyof WeeklySchedule>("monday")

  const days = [
    { key: "monday" as const, label: "Segunda" },
    { key: "tuesday" as const, label: "Terça" },
    { key: "wednesday" as const, label: "Quarta" },
    { key: "thursday" as const, label: "Quinta" },
    { key: "friday" as const, label: "Sexta" },
    { key: "saturday" as const, label: "Sábado" },
    { key: "sunday" as const, label: "Domingo" },
  ]

  const handleTimeChange = (
    day: keyof WeeklySchedule,
    slotId: string,
    field: "startTime" | "endTime",
    value: string,
  ) => {
    const updatedSlots = schedule[day].map((slot) => (slot.id === slotId ? { ...slot, [field]: value } : slot))
    onUpdateSchedule(day, updatedSlots)
  }

  const handleActivityChange = (day: keyof WeeklySchedule, slotId: string, activity: string) => {
    const updatedSlots = schedule[day].map((slot) =>
      slot.id === slotId ? { ...slot, activity, subject: undefined, description: undefined } : slot,
    )
    onUpdateSchedule(day, updatedSlots)
  }

  const handleSubjectChange = (day: keyof WeeklySchedule, slotId: string, subjectId: string) => {
    const subject = subjects.find((s) => s.id === subjectId)
    const updatedSlots = schedule[day].map((slot) => {
      if (slot.id === slotId) {
        return {
          ...slot,
          activity: "Estudar",
          subject: subject?.name,
          description: subject?.description,
        }
      }
      return slot
    })
    onUpdateSchedule(day, updatedSlots)
  }

  const handleAddNewActivity = () => {
    if (newActivityName.trim()) {
      onAddCustomActivity(newActivityName.trim())
      setNewActivityName("")
    }
  }

  return (
    <div className="space-y-4">
      <div className="md:hidden">
        <Select value={selectedDay} onValueChange={(value) => setSelectedDay(value as keyof WeeklySchedule)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione um dia" />
          </SelectTrigger>
          <SelectContent>
            {days.map((day) => (
              <SelectItem key={day.key} value={day.key}>
                {day.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Horário</TableHead>
              {days.map((day) => (
                <TableHead key={day.key} className="hidden md:table-cell">
                  {day.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedule[selectedDay].map((timeSlot) => (
              <TableRow key={timeSlot.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    <Input
                      type="time"
                      value={timeSlot.startTime}
                      onChange={(e) => handleTimeChange(selectedDay, timeSlot.id, "startTime", e.target.value)}
                      className="w-24"
                    />
                    <span>-</span>
                    <Input
                      type="time"
                      value={timeSlot.endTime}
                      onChange={(e) => handleTimeChange(selectedDay, timeSlot.id, "endTime", e.target.value)}
                      className="w-24"
                    />
                  </div>
                </TableCell>
                {days.map((day) => {
                  const slot = schedule[day.key].find((s) => s.id === timeSlot.id)
                  const subject = subjects.find((s) => s.name === slot?.subject)

                  return (
                    <TableCell key={day.key} className={day.key === selectedDay ? "" : "hidden md:table-cell"}>
                      <Select
                        value={slot?.activity || ""}
                        onValueChange={(value) => {
                          if (value === "Estudar") {
                            handleSubjectChange(day.key, timeSlot.id, "")
                          } else {
                            handleActivityChange(day.key, timeSlot.id, value)
                          }
                        }}
                      >
                        <SelectTrigger
                          className={subject ? "border-l-4" : ""}
                          style={subject ? { borderLeftColor: subject.color } : {}}
                        >
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Estudar">Estudar</SelectItem>
                          {customActivities.map((activity) => (
                            <SelectItem key={activity.id} value={activity.name}>
                              {activity.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {slot?.activity === "Estudar" && (
                        <Select
                          value={slot?.subject || ""}
                          onValueChange={(value) => handleSubjectChange(day.key, timeSlot.id, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a matéria" />
                          </SelectTrigger>
                          <SelectContent>
                            {subjects.map((subject) => (
                              <SelectItem key={subject.id} value={subject.id}>
                                {subject.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      {slot?.description && <p className="text-xs text-gray-500 mt-1">{slot.description}</p>}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Nova Atividade
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Nova Atividade</DialogTitle>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <Input
              value={newActivityName}
              onChange={(e) => setNewActivityName(e.target.value)}
              placeholder="Nome da nova atividade"
            />
            <Button onClick={handleAddNewActivity}>Adicionar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
