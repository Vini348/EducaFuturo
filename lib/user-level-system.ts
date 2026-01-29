import { supabase } from "./supabase"

export type UserLevel = "iniciante" | "aprendiz" | "estudante" | "dedicado" | "mestre" | "lenda" | "admin"

export interface LevelInfo {
  level: UserLevel
  color: string
  gradient: string
  textColor: string
  badgeColor: string
  minPoints: number
  minAchievements: number
  minStudyHours: number
  nextLevel?: UserLevel
  icon: string
  title: string
}

export const USER_LEVELS: Record<UserLevel, LevelInfo> = {
  iniciante: {
    level: "iniciante",
    color: "text-gray-600",
    gradient: "from-gray-500 to-gray-600",
    textColor: "text-gray-600",
    badgeColor: "bg-gray-100 text-gray-700",
    minPoints: 0,
    minAchievements: 0,
    minStudyHours: 0,
    nextLevel: "aprendiz",
    icon: "🌱",
    title: "Iniciante",
  },
  aprendiz: {
    level: "aprendiz",
    color: "text-green-600",
    gradient: "from-green-500 to-green-600",
    textColor: "text-green-600",
    badgeColor: "bg-green-100 text-green-700",
    minPoints: 500,
    minAchievements: 2,
    minStudyHours: 5,
    nextLevel: "estudante",
    icon: "📚",
    title: "Aprendiz",
  },
  estudante: {
    level: "estudante",
    color: "text-blue-600",
    gradient: "from-blue-500 to-blue-600",
    textColor: "text-blue-600",
    badgeColor: "bg-blue-100 text-blue-700",
    minPoints: 1000,
    minAchievements: 5,
    minStudyHours: 10,
    nextLevel: "dedicado",
    icon: "🎓",
    title: "Estudante",
  },
  dedicado: {
    level: "dedicado",
    color: "text-purple-600",
    gradient: "from-purple-500 to-purple-600",
    textColor: "text-purple-600",
    badgeColor: "bg-purple-100 text-purple-700",
    minPoints: 2000,
    minAchievements: 10,
    minStudyHours: 25,
    nextLevel: "mestre",
    icon: "⭐",
    title: "Dedicado",
  },
  mestre: {
    level: "mestre",
    color: "text-orange-600",
    gradient: "from-orange-500 to-orange-600",
    textColor: "text-orange-600",
    badgeColor: "bg-orange-100 text-orange-700",
    minPoints: 5000,
    minAchievements: 15,
    minStudyHours: 50,
    nextLevel: "lenda",
    icon: "🏆",
    title: "Mestre",
  },
  lenda: {
    level: "lenda",
    color: "text-yellow-600",
    gradient: "from-yellow-500 via-yellow-600 to-amber-600",
    textColor: "text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-yellow-600 to-amber-600",
    badgeColor: "bg-gradient-to-r from-yellow-400 to-amber-500 text-white",
    minPoints: 10000,
    minAchievements: 20,
    minStudyHours: 100,
    icon: "👑",
    title: "Lenda",
  },
  admin: {
    level: "admin",
    color: "text-red-600",
    gradient: "from-red-600 via-red-700 to-red-800",
    textColor: "text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-700 to-red-800",
    badgeColor: "bg-gradient-to-r from-red-600 to-red-800 text-white",
    minPoints: 0,
    minAchievements: 0,
    minStudyHours: 0,
    icon: "⚡",
    title: "Admin",
  },
}

/**
 * Busca o nível do usuário
 */
export async function getUserLevel(userId: string): Promise<UserLevel> {
  try {
    const { data, error } = await supabase.from("profiles").select("user_level, role").eq("id", userId).maybeSingle()

    if (error) {
      console.error("Erro ao buscar nível do usuário:", error)
      return "iniciante"
    }

    if (!data) {
      return "iniciante"
    }

    if (data?.role === "admin") return "admin"

    return (data?.user_level as UserLevel) || "iniciante"
  } catch (error) {
    console.error("Erro ao buscar nível do usuário:", error)
    return "iniciante"
  }
}

/**
 * Busca informações completas do nível do usuário
 */
export async function getUserLevelInfo(userId: string): Promise<{
  currentLevel: LevelInfo
  progress: number
  nextLevelProgress: number
}> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("user_level, role, total_points, achievements_count, study_hours")
      .eq("id", userId)
      .maybeSingle()

    if (error || !data) {
      console.error("Erro ao buscar informações do nível:", error)
      return {
        currentLevel: USER_LEVELS.iniciante,
        progress: 0,
        nextLevelProgress: 0,
      }
    }

    const level = (data?.role === "admin" ? "admin" : data?.user_level || "iniciante") as UserLevel
    const currentLevel = USER_LEVELS[level]
    const nextLevel = currentLevel.nextLevel ? USER_LEVELS[currentLevel.nextLevel] : null

    const progress = 100
    let nextLevelProgress = 0

    if (nextLevel) {
      const totalPoints = data.total_points || 0
      const achievementsCount = data.achievements_count || 0
      const studyHours = data.study_hours || 0

      const pointsProgress = Math.min((totalPoints / nextLevel.minPoints) * 100, 100)
      const achievementsProgress = Math.min((achievementsCount / nextLevel.minAchievements) * 100, 100)
      const hoursProgress = Math.min((studyHours / nextLevel.minStudyHours) * 100, 100)

      nextLevelProgress = Math.round((pointsProgress + achievementsProgress + hoursProgress) / 3)
    }

    return {
      currentLevel,
      progress,
      nextLevelProgress,
    }
  } catch (error) {
    console.error("Erro ao buscar informações do nível:", error)
    return {
      currentLevel: USER_LEVELS.iniciante,
      progress: 0,
      nextLevelProgress: 0,
    }
  }
}

/**
 * Retorna a classe CSS para o nome do usuário baseado no nível
 */
export function getLevelNameClass(level: UserLevel): string {
  return USER_LEVELS[level].textColor
}

/**
 * Retorna o badge visual para o nível
 */
export function getLevelBadge(level: UserLevel): { color: string; text: string; icon: string } {
  const levelInfo = USER_LEVELS[level]
  return {
    color: levelInfo.badgeColor,
    text: levelInfo.title,
    icon: levelInfo.icon,
  }
}
