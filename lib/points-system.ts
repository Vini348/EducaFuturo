import { supabase } from "./supabase"

export type ActivityType =
  | "challenge"
  | "quiz"
  | "flashcard"
  | "essay"
  | "simulado"
  | "bloco"
  | "daily_login"
  | "streak"

interface AddPointsParams {
  userId: string
  points: number
  activityType: ActivityType
  activityId?: string
  description?: string
}

/**
 * Adiciona pontos ao usuário e registra no histórico
 */
export async function addPoints({ userId, points, activityType, activityId, description }: AddPointsParams) {
  try {
    // Inserir no histórico (o trigger atualizará automaticamente o total_points)
    const { error } = await supabase.from("user_points_history").insert({
      user_id: userId,
      points,
      activity_type: activityType,
      activity_id: activityId,
      description: description || `${points} pontos ganhos em ${activityType}`,
    })

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Erro ao adicionar pontos:", error)
    return { success: false, error }
  }
}

/**
 * Busca o histórico de pontos do usuário
 */
export async function getUserPointsHistory(userId: string, limit = 20) {
  try {
    const { data, error } = await supabase
      .from("user_points_history")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error("Erro ao buscar histórico de pontos:", error)
    return { data: null, error }
  }
}

/**
 * Busca o total de pontos do usuário
 */
export async function getUserTotalPoints(userId: string) {
  try {
    const { data, error } = await supabase.from("profiles").select("total_points").eq("id", userId).single()

    if (error) throw error

    return { points: data?.total_points || 0, error: null }
  } catch (error) {
    console.error("Erro ao buscar total de pontos:", error)
    return { points: 0, error }
  }
}

/**
 * Calcula pontos baseado no desempenho em um desafio/quiz
 */
export function calculateChallengePoints(correctAnswers: number, totalQuestions: number, timeBonus = 0): number {
  const basePoints = correctAnswers * 10
  const accuracyBonus = correctAnswers === totalQuestions ? 50 : 0
  return basePoints + accuracyBonus + timeBonus
}
