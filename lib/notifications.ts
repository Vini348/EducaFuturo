import { supabase } from "./supabaseClient"

// Tipos de notificação
export type NotificationType = "forum" | "study" | "achievement"

// Interface para notificação
export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  message: string
  read: boolean
  created_at: string
}

// Função para criar uma nova notificação
export async function createNotification(userId: string, type: NotificationType, message: string) {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .insert({
        user_id: userId,
        type,
        message,
      })
      .select()
      .single()

    if (error) {
      console.error("Erro ao criar notificação:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Erro ao criar notificação:", error)
    return null
  }
}

// Função para marcar notificação como lida
export async function markNotificationAsRead(notificationId: string) {
  try {
    const { error } = await supabase.from("notifications").update({ read: true }).eq("id", notificationId)

    if (error) {
      console.error("Erro ao marcar notificação como lida:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Erro ao marcar notificação como lida:", error)
    return false
  }
}

// Função para marcar todas as notificações como lidas
export async function markAllNotificationsAsRead(userId: string) {
  try {
    const { error } = await supabase.from("notifications").update({ read: true }).eq("user_id", userId)

    if (error) {
      console.error("Erro ao marcar todas notificações como lidas:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Erro ao marcar todas notificações como lidas:", error)
    return false
  }
}

// Função para excluir uma notificação
export async function deleteNotification(notificationId: string) {
  try {
    const { error } = await supabase.from("notifications").delete().eq("id", notificationId)

    if (error) {
      console.error("Erro ao excluir notificação:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Erro ao excluir notificação:", error)
    return false
  }
}

// Função para excluir todas as notificações de um usuário
export async function deleteAllNotifications(userId: string) {
  try {
    const { error } = await supabase.from("notifications").delete().eq("user_id", userId)

    if (error) {
      console.error("Erro ao excluir todas as notificações:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Erro ao excluir todas as notificações:", error)
    return false
  }
}

// Função para contar notificações não lidas
export async function countUnreadNotifications(userId: string) {
  try {
    const { count, error } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("read", false)

    if (error) {
      console.error("Erro ao contar notificações não lidas:", error)
      return 0
    }

    return count || 0
  } catch (error) {
    console.error("Erro ao contar notificações não lidas:", error)
    return 0
  }
}
