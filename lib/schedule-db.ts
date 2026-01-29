import { supabase } from "./supabaseClient"
import type { SubjectSchedule, TimeSlot, CustomActivity } from "@/types/schedule"

export interface AgendaEvent {
  id: string
  user_id: string
  title: string
  date: string
  created_at: string
  updated_at: string
}

export interface TodoItem {
  id: string
  user_id: string
  text: string
  completed: boolean
  created_at: string
  updated_at: string
}

export const scheduleDb = {
  // Study Schedule
  async getStudySchedule(userId: string): Promise<SubjectSchedule[]> {
    const { data, error } = await supabase
      .from("study_schedule")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching study schedule:", error)
      throw error
    }

    return data
      ? data.map((item) => ({
          id: item.id,
          name: item.subject_name,
          description: item.description,
          color: item.color,
        }))
      : []
  },

  async addSubject(userId: string, subject: Omit<SubjectSchedule, "id">): Promise<SubjectSchedule | null> {
    const { data, error } = await supabase
      .from("study_schedule")
      .insert([
        {
          user_id: userId,
          subject_name: subject.name,
          description: subject.description,
          color: subject.color,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error adding subject:", error)
      throw error
    }

    return data
      ? {
          id: data.id,
          name: data.subject_name,
          description: data.description,
          color: data.color,
        }
      : null
  },

  async updateSubject(subject: SubjectSchedule): Promise<boolean> {
    const { error } = await supabase
      .from("study_schedule")
      .update({
        subject_name: subject.name,
        description: subject.description,
        color: subject.color,
      })
      .eq("id", subject.id)

    if (error) {
      console.error("Error updating subject:", error)
      throw error
    }

    return true
  },

  async deleteSubject(subjectId: string): Promise<boolean> {
    const { error } = await supabase.from("study_schedule").delete().eq("id", subjectId)

    if (error) {
      console.error("Error deleting subject:", error)
      throw error
    }

    return true
  },

  // Time Slots
  async getTimeSlots(userId: string): Promise<TimeSlot[]> {
    const { data, error } = await supabase
      .from("time_slots")
      .select("*")
      .eq("user_id", userId)
      .order("start_time", { ascending: true })

    if (error) {
      console.error("Error fetching time slots:", error)
      throw error
    }

    return data || []
  },

  async updateTimeSlot(userId: string, dayOfWeek: string, slot: TimeSlot): Promise<boolean> {
    const { error } = await supabase.from("time_slots").upsert({
      user_id: userId,
      day_of_week: dayOfWeek,
      start_time: slot.startTime,
      end_time: slot.endTime,
      activity: slot.activity,
      subject_id: slot.subject,
      description: slot.description,
    })

    if (error) {
      console.error("Error updating time slot:", error)
      throw error
    }

    return true
  },

  // Custom Activities
  async getCustomActivities(userId: string): Promise<CustomActivity[]> {
    const { data, error } = await supabase
      .from("custom_activities")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching custom activities:", error)
      throw error
    }

    return data || []
  },

  async addCustomActivity(userId: string, name: string): Promise<CustomActivity | null> {
    const { data, error } = await supabase
      .from("custom_activities")
      .insert([{ user_id: userId, name }])
      .select()
      .single()

    if (error) {
      console.error("Error adding custom activity:", error)
      throw error
    }

    return data
  },

  // Agenda Events
  async getAgendaEvents(userId: string): Promise<AgendaEvent[]> {
    const { data, error } = await supabase
      .from("agenda_events")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: true })

    if (error) {
      console.error("Error fetching agenda events:", error)
      throw error
    }

    return data || []
  },

  async addAgendaEvent(
    userId: string,
    title: string,
    date: string = new Date().toISOString(),
  ): Promise<AgendaEvent | null> {
    // Verificar se o usuário está autenticado
    const { data: sessionData } = await supabase.auth.getSession()
    if (!sessionData.session) {
      console.error("Usuário não autenticado ao adicionar evento")
      throw new Error("Usuário não autenticado")
    }

    console.log("Adicionando evento com user_id:", userId)

    try {
      const { data, error } = await supabase
        .from("agenda_events")
        .insert([
          {
            user_id: userId,
            title,
            date,
          },
        ])
        .select()
        .single()

      if (error) {
        console.error("Error adding agenda event:", error)
        throw error
      }

      return data
    } catch (error) {
      console.error("Exceção ao adicionar evento:", error)
      throw error
    }
  },

  async deleteAgendaEvent(eventId: string): Promise<boolean> {
    const { error } = await supabase.from("agenda_events").delete().eq("id", eventId)

    if (error) {
      console.error("Error deleting agenda event:", error)
      throw error
    }

    return true
  },

  // Todo Items
  async getTodoItems(userId: string): Promise<TodoItem[]> {
    const { data, error } = await supabase
      .from("todo_items")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching todo items:", error)
      throw error
    }

    return data || []
  },

  async addTodoItem(userId: string, text: string): Promise<TodoItem | null> {
    // Verificar se o usuário está autenticado
    const { data: sessionData } = await supabase.auth.getSession()
    if (!sessionData.session) {
      console.error("Usuário não autenticado ao adicionar tarefa")
      throw new Error("Usuário não autenticado")
    }

    console.log("Adicionando tarefa com user_id:", userId)

    try {
      // Verificar se o ID do usuário corresponde ao usuário autenticado
      if (userId !== sessionData.session.user.id) {
        console.warn("ID do usuário não corresponde ao usuário autenticado, usando ID da sessão")
        userId = sessionData.session.user.id
      }

      const { data, error } = await supabase
        .from("todo_items")
        .insert([
          {
            user_id: userId,
            text,
            completed: false,
          },
        ])
        .select()
        .single()

      if (error) {
        console.error("Error adding todo item:", error)
        throw error
      }

      return data
    } catch (error) {
      console.error("Exceção ao adicionar tarefa:", error)
      throw error
    }
  },

  async updateTodoItem(itemId: string, completed: boolean): Promise<boolean> {
    const { error } = await supabase.from("todo_items").update({ completed }).eq("id", itemId)

    if (error) {
      console.error("Error updating todo item:", error)
      throw error
    }

    return true
  },

  async deleteTodoItem(itemId: string): Promise<boolean> {
    const { error } = await supabase.from("todo_items").delete().eq("id", itemId)

    if (error) {
      console.error("Error deleting todo item:", error)
      throw error
    }

    return true
  },
}
