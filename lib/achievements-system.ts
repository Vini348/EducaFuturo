import { supabase } from "./supabase"

export interface Achievement {
  achievement_id: string
  name: string
  description: string
  icon: string
  badge_image: string | null
  category: "iniciante" | "intermediario" | "avancado" | "mestre"
  tier: "bronze" | "prata" | "ouro" | "platina" | "diamante"
  progress: number
  unlocked: boolean
  unlocked_at: string | null
  reward_points: number
  order_index: number
}

export interface UnlockedAchievement {
  id: string
  name: string
  description: string
  icon: string
  tier: string
  reward_points: number
}

/**
 * Busca todas as conquistas do usuário
 */
export async function getUserAchievements(
  userId: string,
  includeLocked = true,
): Promise<{ data: Achievement[] | null; error: any }> {
  try {
    const { data, error } = await supabase.rpc("get_user_achievements", {
      p_user_id: userId,
      p_include_locked: includeLocked,
    })

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error("Erro ao buscar conquistas:", error)
    return { data: null, error }
  }
}

/**
 * Verifica e desbloqueia novas conquistas
 * Retorna array de conquistas recém-desbloqueadas
 */
export async function checkAndUnlockAchievements(
  userId: string,
): Promise<{ data: UnlockedAchievement[] | null; error: any }> {
  try {
    const { data, error } = await supabase.rpc("check_and_unlock_achievements", {
      p_user_id: userId,
    })

    if (error) throw error

    // O resultado é um array JSON com as conquistas desbloqueadas
    const newlyUnlocked = data?.[0]?.newly_unlocked || []

    return { data: newlyUnlocked, error: null }
  } catch (error) {
    console.error("Erro ao verificar conquistas:", error)
    return { data: null, error }
  }
}

/**
 * Marca conquistas como notificadas
 */
export async function markAchievementsAsNotified(userId: string, achievementIds: string[]): Promise<void> {
  try {
    await supabase
      .from("user_achievements")
      .update({ notified: true })
      .eq("user_id", userId)
      .in("achievement_id", achievementIds)
  } catch (error) {
    console.error("Erro ao marcar conquistas como notificadas:", error)
  }
}

/**
 * Busca estatísticas de conquistas do usuário
 */
export async function getAchievementStats(userId: string): Promise<{
  total: number
  unlocked: number
  bronze: number
  prata: number
  ouro: number
  platina: number
  diamante: number
}> {
  try {
    const { data } = await getUserAchievements(userId, true)

    if (!data) {
      return { total: 0, unlocked: 0, bronze: 0, prata: 0, ouro: 0, platina: 0, diamante: 0 }
    }

    const stats = {
      total: data.length,
      unlocked: data.filter((a) => a.unlocked).length,
      bronze: data.filter((a) => a.tier === "bronze" && a.unlocked).length,
      prata: data.filter((a) => a.tier === "prata" && a.unlocked).length,
      ouro: data.filter((a) => a.tier === "ouro" && a.unlocked).length,
      platina: data.filter((a) => a.tier === "platina" && a.unlocked).length,
      diamante: data.filter((a) => a.tier === "diamante" && a.unlocked).length,
    }

    return stats
  } catch (error) {
    console.error("Erro ao buscar estatísticas de conquistas:", error)
    return { total: 0, unlocked: 0, bronze: 0, prata: 0, ouro: 0, platina: 0, diamante: 0 }
  }
}
