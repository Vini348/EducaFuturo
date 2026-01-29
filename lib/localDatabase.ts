import { supabase } from "@/lib/supabase"
import type { StudySession } from "@/types/flashcards"

interface User {
  id: string
  fullName: string
  email: string
  password: string
  profileImage?: string
  settings?: {
    theme: "light" | "dark"
    language: string
    notifications: {
      email: boolean
      push: boolean
    }
    privacy: {
      publicProfile: boolean
      shareProgress: boolean
    }
  }
}

interface UserProgress {
  user_id: string
  flashcard_progress?: Record<string, boolean>
  quiz_progress?: Record<string, { completed: boolean; score: number }>
  study_sessions?: StudySession[]
  total_study_time?: number
  study_days?: string[]
  last_update?: string
  subject_progress?: Record<string, number>
  game_progress?: Record<string, number>
  performance?: DetailedPerformance
  updated_at?: string
}

interface PerformanceData {
  total_study_time: number
  study_days: string[]
  activity_type?: string
  session_data?: {
    duration: number
    type: string
    timestamp: string
  }
}

interface DetailedPerformance {
  quizzes: {
    totalAttempted: number
    correctAnswers: number
    averageScore: number
    timePerQuestion: number
    subjectScores: Record<string, number>
  }
  simulations: {
    totalCompleted: number
    successRate: number
    averageTime: number
    byType: Record<string, number>
  }
  practicalTests: {
    completed: number
    averageScore: number
    bySkill: Record<string, number>
  }
  studyTime: {
    total: number
    byActivity: {
      lectures: number
      quizzes: number
      simulations: number
      reading: number
    }
    bySubject: Record<string, number>
  }
  skillLevels: Record<string, number>
}

class SupabaseDatabase {
  // Função auxiliar para lidar com erros de promessas
  private async handlePromise<T>(promise: Promise<T>): Promise<[T | null, any]> {
    try {
      const data = await promise
      return [data, null]
    } catch (error) {
      console.error("Promise error:", error)
      return [null, error]
    }
  }

  // Função para verificar se o usuário está autenticado
  private async isUserAuthenticated(): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        console.error("Error checking authentication:", error)
        return false
      }
      return !!data.session
    } catch (error) {
      console.error("Unexpected error checking authentication:", error)
      return false
    }
  }

  async registerUser(fullName: string, email: string, password: string): Promise<User | null> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        console.error("Error registering user:", error)
        return null
      }

      if (data.user) {
        // Não tentamos criar um perfil aqui, pois isso será feito por um trigger no Supabase
        return {
          id: data.user.id,
          fullName,
          email,
          password: "", // Não armazenamos a senha
        }
      }

      return null
    } catch (error) {
      console.error("Unexpected error during registration:", error)
      return null
    }
  }

  async loginUser(email: string, password: string): Promise<User | null> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Error logging in:", error)
        return null
      }

      if (data.user) {
        const { data: userData, error: userError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single()

        if (userError) {
          console.error("Error fetching user data:", userError)
          return null
        }

        return {
          id: data.user.id,
          fullName: userData.full_name || "",
          email: data.user.email || "",
          password: "",
          profileImage: userData.avatar_url,
          settings: userData.settings,
        }
      }

      return null
    } catch (error) {
      console.error("Unexpected error during login:", error)
      return null
    }
  }

  async updateUser(updatedUser: User): Promise<void> {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: updatedUser.fullName,
          avatar_url: updatedUser.profileImage,
          settings: updatedUser.settings,
          updated_at: new Date().toISOString(),
        })
        .eq("id", updatedUser.id)

      if (error) {
        console.error("Error updating user:", error)
      }
    } catch (error) {
      console.error("Unexpected error updating user:", error)
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      // Primeiro, excluímos o perfil
      const { error: profileError } = await supabase.from("profiles").delete().eq("id", userId)

      if (profileError) {
        console.error("Error deleting user profile:", profileError)
      }

      // Em seguida, excluímos o usuário da autenticação
      const { error: authError } = await supabase.auth.admin.deleteUser(userId)

      if (authError) {
        console.error("Error deleting user authentication:", authError)
      }
    } catch (error) {
      console.error("Unexpected error deleting user:", error)
    }
  }

  // Método modificado para usar apenas localStorage e evitar problemas de RLS
  async getUserProgress(userId: string): Promise<UserProgress> {
    try {
      // Primeiro, tente obter do localStorage
      const localProgress = this.getProgressFromLocalStorage(userId)

      // Se o usuário estiver autenticado, tente obter do Supabase também
      if (userId && (await this.isUserAuthenticated())) {
        try {
          const { data, error } = await supabase.from("user_performance").select("*").eq("user_id", userId)

          // Se conseguirmos obter dados do Supabase, use-os
          if (!error && data && data.length > 0) {
            // Mesclar dados do Supabase com localStorage para garantir que não perdemos nada
            const mergedProgress = this.mergeProgress(data[0] as UserProgress, localProgress)

            // Atualizar o localStorage com os dados mesclados
            this.saveProgressToLocalStorage(userId, mergedProgress)

            return mergedProgress
          }
        } catch (supabaseError) {
          console.error("Error fetching from Supabase:", supabaseError)
          // Continue usando o localStorage se o Supabase falhar
        }
      }

      // Se não conseguirmos obter do Supabase ou o usuário não estiver autenticado,
      // use o localStorage
      return localProgress
    } catch (error) {
      console.error("Unexpected error in getUserProgress:", error)
      // Retornar um objeto vazio em vez de lançar um erro
      return { user_id: userId }
    }
  }

  // Método auxiliar para mesclar dados do Supabase e localStorage
  private mergeProgress(supabaseProgress: UserProgress, localProgress: UserProgress): UserProgress {
    // Criar uma cópia do progresso do Supabase
    const merged = { ...supabaseProgress }

    // Se não houver progresso local, retorne apenas o do Supabase
    if (!localProgress || Object.keys(localProgress).length === 0) {
      return merged
    }

    // Mesclar arrays de study_days
    if (localProgress.study_days && localProgress.study_days.length > 0) {
      merged.study_days = Array.from(new Set([...(merged.study_days || []), ...localProgress.study_days]))
    }

    // Usar o maior valor de tempo de estudo
    if (localProgress.total_study_time) {
      merged.total_study_time = Math.max(merged.total_study_time || 0, localProgress.total_study_time)
    }

    // Mesclar outros objetos de progresso
    if (localProgress.flashcard_progress) {
      merged.flashcard_progress = {
        ...(merged.flashcard_progress || {}),
        ...localProgress.flashcard_progress,
      }
    }

    if (localProgress.quiz_progress) {
      merged.quiz_progress = {
        ...(merged.quiz_progress || {}),
        ...localProgress.quiz_progress,
      }
    }

    if (localProgress.subject_progress) {
      merged.subject_progress = {
        ...(merged.subject_progress || {}),
        ...localProgress.subject_progress,
      }
    }

    if (localProgress.game_progress) {
      merged.game_progress = {
        ...(merged.game_progress || {}),
        ...localProgress.game_progress,
      }
    }

    return merged
  }

  // Método para obter progresso do localStorage
  private getProgressFromLocalStorage(userId: string): UserProgress {
    try {
      const key = `user_progress_${userId}`
      const storedData = localStorage.getItem(key)

      if (storedData) {
        return JSON.parse(storedData) as UserProgress
      }

      // Se não houver dados armazenados, retorne um objeto vazio
      return {
        user_id: userId,
        total_study_time: 0,
        study_days: [],
        updated_at: new Date().toISOString(),
      }
    } catch (error) {
      console.error("Error reading progress from localStorage:", error)
      return { user_id: userId }
    }
  }

  // Método modificado para tentar Supabase primeiro, mas sempre atualizar localStorage
  async updateUserProgress(progress: UserProgress): Promise<void> {
    try {
      // Sempre salve no localStorage primeiro para garantir que os dados não sejam perdidos
      this.saveProgressToLocalStorage(progress.user_id, progress)

      // Tente atualizar no Supabase se o usuário estiver autenticado
      if (progress.user_id && (await this.isUserAuthenticated())) {
        try {
          // Verificar se o registro já existe
          const { data, error: checkError } = await supabase
            .from("user_performance")
            .select("user_id")
            .eq("user_id", progress.user_id)
            .single()

          if (checkError && checkError.code !== "PGRST116") {
            // PGRST116 significa que o registro não foi encontrado, o que é esperado
            console.error("Error checking user_performance record:", checkError)
          }

          // Se o registro existir, atualize-o
          if (data) {
            const { error } = await supabase.from("user_performance").update(progress).eq("user_id", progress.user_id)

            if (error) {
              console.error("Error updating user progress in Supabase:", error)
            }
          } else {
            // Se o registro não existir, insira-o
            const { error } = await supabase.from("user_performance").insert(progress)

            if (error) {
              console.error("Error inserting user progress in Supabase:", error)
            }
          }
        } catch (supabaseError) {
          console.error("Failed to update progress in Supabase:", supabaseError)
          // Já salvamos no localStorage, então não precisamos fazer nada aqui
        }
      }
    } catch (error) {
      console.error("Unexpected error in updateUserProgress:", error)
      // Tentar salvar no localStorage como último recurso
      try {
        this.saveProgressToLocalStorage(progress.user_id, progress)
      } catch (localStorageError) {
        console.error("Failed to save to localStorage:", localStorageError)
      }
    }
  }

  private saveProgressToLocalStorage(userId: string, progress: UserProgress): void {
    try {
      const key = `user_progress_${userId}`
      localStorage.setItem(key, JSON.stringify(progress))
    } catch (error) {
      console.error("Error saving progress to localStorage:", error)
    }
  }

  async updateFlashcardProgress(userId: string, flashcardId: string, isCorrect: boolean): Promise<void> {
    try {
      // Sempre salve no localStorage primeiro
      this.saveFlashcardProgressToLocalStorage(userId, flashcardId, isCorrect)

      // Tente atualizar no Supabase se o usuário estiver autenticado
      if (userId && (await this.isUserAuthenticated())) {
        try {
          const { error } = await supabase.from("flashcard_progress").upsert(
            {
              user_id: userId,
              flashcard_id: flashcardId,
              is_correct: isCorrect,
              last_reviewed: new Date().toISOString(),
            },
            { onConflict: "user_id,flashcard_id" },
          )

          if (error) {
            console.error("Error updating flashcard progress in Supabase:", error)
            // Já salvamos no localStorage, então não precisamos fazer nada aqui
          }
        } catch (supabaseError) {
          console.error("Failed to update flashcard progress in Supabase:", supabaseError)
          // Já salvamos no localStorage, então não precisamos fazer nada aqui
        }
      }
    } catch (error) {
      console.error("Unexpected error in updateFlashcardProgress:", error)
      // Já tentamos salvar no localStorage no início da função
    }
  }

  private saveFlashcardProgressToLocalStorage(userId: string, flashcardId: string, isCorrect: boolean): void {
    try {
      const key = `flashcard_progress_${userId}`
      const existingData = localStorage.getItem(key)
      let progress: Record<string, boolean> = {}

      if (existingData) {
        progress = JSON.parse(existingData)
      }

      progress[flashcardId] = isCorrect
      localStorage.setItem(key, JSON.stringify(progress))
    } catch (error) {
      console.error("Error saving flashcard progress to localStorage:", error)
    }
  }

  async updateQuizProgress(userId: string, quizId: string, completed: boolean, score: number): Promise<void> {
    try {
      // Sempre salve no localStorage primeiro
      this.saveQuizProgressToLocalStorage(userId, quizId, completed, score)

      // Tente atualizar no Supabase se o usuário estiver autenticado
      if (userId && (await this.isUserAuthenticated())) {
        try {
          const { error } = await supabase.from("quiz_progress").upsert(
            {
              user_id: userId,
              quiz_id: quizId,
              completed,
              score,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id,quiz_id" },
          )

          if (error) {
            console.error("Error updating quiz progress in Supabase:", error)
            // Já salvamos no localStorage, então não precisamos fazer nada aqui
          }
        } catch (supabaseError) {
          console.error("Failed to update quiz progress in Supabase:", supabaseError)
          // Já salvamos no localStorage, então não precisamos fazer nada aqui
        }
      }
    } catch (error) {
      console.error("Unexpected error in updateQuizProgress:", error)
      // Já tentamos salvar no localStorage no início da função
    }
  }

  private saveQuizProgressToLocalStorage(userId: string, quizId: string, completed: boolean, score: number): void {
    try {
      const key = `quiz_progress_${userId}`
      const existingData = localStorage.getItem(key)
      let progress: Record<string, { completed: boolean; score: number }> = {}

      if (existingData) {
        progress = JSON.parse(existingData)
      }

      progress[quizId] = { completed, score }
      localStorage.setItem(key, JSON.stringify(progress))
    } catch (error) {
      console.error("Error saving quiz progress to localStorage:", error)
    }
  }

  async addStudySession(userId: string, session: StudySession): Promise<void> {
    try {
      // Sempre salve no localStorage primeiro
      this.saveStudySessionToLocalStorage(userId, session)

      // Tente atualizar no Supabase se o usuário estiver autenticado
      if (userId && (await this.isUserAuthenticated())) {
        try {
          const { error } = await supabase.from("study_sessions").insert({ user_id: userId, ...session })

          if (error) {
            console.error("Error adding study session to Supabase:", error)
            // Já salvamos no localStorage, então não precisamos fazer nada aqui
          }
        } catch (supabaseError) {
          console.error("Failed to add study session to Supabase:", supabaseError)
          // Já salvamos no localStorage, então não precisamos fazer nada aqui
        }
      }
    } catch (error) {
      console.error("Unexpected error in addStudySession:", error)
      // Já tentamos salvar no localStorage no início da função
    }
  }

  private saveStudySessionToLocalStorage(userId: string, session: StudySession): void {
    try {
      const key = `study_sessions_${userId}`
      const existingData = localStorage.getItem(key)
      let sessions: StudySession[] = []

      if (existingData) {
        sessions = JSON.parse(existingData)
      }

      sessions.push(session)
      localStorage.setItem(key, JSON.stringify(sessions))
    } catch (error) {
      console.error("Error saving study session to localStorage:", error)
    }
  }

  async updatePerformanceData(userId: string, data: PerformanceData): Promise<void> {
    try {
      // Sempre salve no localStorage primeiro
      this.savePerformanceToLocalStorage(userId, data)

      // Tente atualizar no Supabase se o usuário estiver autenticado
      if (userId && (await this.isUserAuthenticated())) {
        try {
          // Verificar se o usuário existe na tabela de perfis
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("id")
            .eq("id", userId)
            .single()

          // Se o perfil não existir, não tentamos criar um novo
          if (profileError || !profileData) {
            console.log("User profile not found, using localStorage only")
            return
          }

          // Verificar se o registro já existe
          const { data: existingData, error: checkError } = await supabase
            .from("user_performance")
            .select("user_id, total_study_time, study_days")
            .eq("user_id", userId)
            .single()

          // Preparar os dados para atualização ou inserção
          const updateData: any = {
            user_id: userId,
            total_study_time: data.total_study_time,
            study_days: data.study_days,
            updated_at: new Date().toISOString(),
          }

          // Adicionar activity_type apenas se estiver definido
          if (data.activity_type) {
            updateData.activity_type = data.activity_type
          }

          // Se o registro existir, atualize-o
          if (!checkError && existingData) {
            console.log("Updating existing performance record for user:", userId)
            const { error } = await supabase.from("user_performance").update(updateData).eq("user_id", userId)

            if (error) {
              console.error("Error updating performance data in Supabase:", error)
            }
          } else {
            // Se o registro não existir, insira-o
            console.log("Creating new performance record for user:", userId)
            const { error } = await supabase.from("user_performance").insert(updateData)

            if (error) {
              console.error("Error inserting performance data in Supabase:", error)
            }
          }
        } catch (supabaseError) {
          console.error("Failed to update performance data in Supabase:", supabaseError)
          // Já salvamos no localStorage, então não precisamos fazer nada aqui
        }
      } else {
        console.log("User not authenticated, saving to localStorage only")
      }
    } catch (error) {
      console.error("Unexpected error in updatePerformanceData:", error)
      // Já tentamos salvar no localStorage no início da função
    }
  }

  // Método auxiliar para salvar dados no localStorage
  private savePerformanceToLocalStorage(userId: string, data: PerformanceData): void {
    try {
      const storageKey = `user_performance_${userId}`
      const existingData = localStorage.getItem(storageKey)
      let updatedData: PerformanceData

      if (existingData) {
        const parsedData = JSON.parse(existingData) as PerformanceData
        updatedData = {
          total_study_time: data.total_study_time || parsedData.total_study_time,
          study_days: Array.from(new Set([...(parsedData.study_days || []), ...(data.study_days || [])])),
          activity_type: data.activity_type || parsedData.activity_type,
          session_data: data.session_data || parsedData.session_data,
        }
      } else {
        updatedData = data
      }

      localStorage.setItem(storageKey, JSON.stringify(updatedData))
    } catch (storageError) {
      console.error("Failed to save to localStorage:", storageError)
    }
  }

  async getPerformanceData(userId: string): Promise<PerformanceData | null> {
    try {
      // Primeiro tente obter do localStorage
      const localData = this.getPerformanceFromLocalStorage(userId)

      // Se o usuário estiver autenticado, tente obter do Supabase também
      if (userId && (await this.isUserAuthenticated())) {
        try {
          const { data, error } = await supabase.from("user_performance").select("*").eq("user_id", userId).single()

          // Se conseguirmos obter dados do Supabase, mescle com os dados locais
          if (!error && data) {
            const supabaseData: PerformanceData = {
              total_study_time: data.total_study_time || 0,
              study_days: data.study_days || [],
              activity_type: data.activity_type,
              session_data: data.session_data,
            }

            // Mesclar dados do Supabase com localStorage
            return this.mergePerformanceData(supabaseData, localData)
          }
        } catch (supabaseError) {
          console.error("Error fetching performance data from Supabase:", supabaseError)
          // Continue usando o localStorage se o Supabase falhar
        }
      }

      // Se não conseguirmos obter do Supabase ou o usuário não estiver autenticado,
      // use o localStorage
      return localData
    } catch (error) {
      console.error("Error in getPerformanceData:", error)
      // Fallback para localStorage
      return this.getPerformanceFromLocalStorage(userId)
    }
  }

  // Método auxiliar para mesclar dados de desempenho
  private mergePerformanceData(
    supabaseData: PerformanceData | null,
    localData: PerformanceData | null,
  ): PerformanceData {
    if (!supabaseData && !localData) {
      return {
        total_study_time: 0,
        study_days: [],
      }
    }

    if (!supabaseData) return localData!
    if (!localData) return supabaseData

    // Mesclar os dados
    return {
      total_study_time: Math.max(supabaseData.total_study_time, localData.total_study_time),
      study_days: Array.from(new Set([...supabaseData.study_days, ...localData.study_days])),
      activity_type: supabaseData.activity_type || localData.activity_type,
      session_data: supabaseData.session_data || localData.session_data,
    }
  }

  private getPerformanceFromLocalStorage(userId: string): PerformanceData | null {
    try {
      const storageKey = `user_performance_${userId}`
      const storedData = localStorage.getItem(storageKey)

      if (storedData) {
        return JSON.parse(storedData) as PerformanceData
      }

      return null
    } catch (error) {
      console.error("Error reading from localStorage:", error)
      return null
    }
  }

  async updateSubjectProgress(userId: string, subject: string, progress: number): Promise<void> {
    try {
      // Sempre salve no localStorage primeiro
      this.saveSubjectProgressToLocalStorage(userId, subject, progress)

      // Tente atualizar no Supabase se o usuário estiver autenticado
      if (userId && (await this.isUserAuthenticated())) {
        try {
          // Primeiro, obtenha o progresso atual
          const { data, error } = await supabase
            .from("user_performance")
            .select("subject_progress")
            .eq("user_id", userId)
            .single()

          let subjectProgress: Record<string, number> = {}

          if (!error && data && data.subject_progress) {
            subjectProgress = data.subject_progress
          }

          // Atualize o progresso da disciplina
          subjectProgress[subject] = progress

          // Verificar se o registro já existe
          if (!error && data) {
            // Se o registro existir, atualize-o
            const { error: updateError } = await supabase
              .from("user_performance")
              .update({
                subject_progress: subjectProgress,
                updated_at: new Date().toISOString(),
              })
              .eq("user_id", userId)

            if (updateError) {
              console.error("Error updating subject progress in Supabase:", updateError)
            }
          } else {
            // Se o registro não existir, insira-o
            const { error: insertError } = await supabase.from("user_performance").insert({
              user_id: userId,
              subject_progress: subjectProgress,
              updated_at: new Date().toISOString(),
            })

            if (insertError) {
              console.error("Error inserting subject progress in Supabase:", insertError)
            }
          }
        } catch (supabaseError) {
          console.error("Failed to update subject progress in Supabase:", supabaseError)
          // Já salvamos no localStorage, então não precisamos fazer nada aqui
        }
      }
    } catch (error) {
      console.error("Unexpected error in updateSubjectProgress:", error)
      // Já tentamos salvar no localStorage no início da função
    }
  }

  private saveSubjectProgressToLocalStorage(userId: string, subject: string, progress: number): void {
    try {
      const key = `subject_progress_${userId}`
      const existingData = localStorage.getItem(key)
      let subjectProgress: Record<string, number> = {}

      if (existingData) {
        subjectProgress = JSON.parse(existingData)
      }

      subjectProgress[subject] = progress
      localStorage.setItem(key, JSON.stringify(subjectProgress))
    } catch (error) {
      console.error("Error saving subject progress to localStorage:", error)
    }
  }

  async updateGameProgress(userId: string, gameProgress: Record<string, number>): Promise<void> {
    try {
      // Sempre salve no localStorage primeiro
      this.saveGameProgressToLocalStorage(userId, gameProgress)

      // Tente atualizar no Supabase se o usuário estiver autenticado
      if (userId && (await this.isUserAuthenticated())) {
        try {
          // Verificar se o registro já existe
          const { data, error } = await supabase
            .from("user_performance")
            .select("user_id")
            .eq("user_id", userId)
            .single()

          if (!error && data) {
            // Se o registro existir, atualize-o
            const { error: updateError } = await supabase
              .from("user_performance")
              .update({
                game_progress: gameProgress,
                updated_at: new Date().toISOString(),
              })
              .eq("user_id", userId)

            if (updateError) {
              console.error("Error updating game progress in Supabase:", updateError)
            }
          } else {
            // Se o registro não existir, insira-o
            const { error: insertError } = await supabase.from("user_performance").insert({
              user_id: userId,
              game_progress: gameProgress,
              updated_at: new Date().toISOString(),
            })

            if (insertError) {
              console.error("Error inserting game progress in Supabase:", insertError)
            }
          }
        } catch (supabaseError) {
          console.error("Failed to update game progress in Supabase:", supabaseError)
          // Já salvamos no localStorage, então não precisamos fazer nada aqui
        }
      }
    } catch (error) {
      console.error("Unexpected error in updateGameProgress:", error)
      // Já tentamos salvar no localStorage no início da função
    }
  }

  private saveGameProgressToLocalStorage(userId: string, gameProgress: Record<string, number>): void {
    try {
      localStorage.setItem(`game_progress_${userId}`, JSON.stringify(gameProgress))
    } catch (error) {
      console.error("Error saving game progress to localStorage:", error)
    }
  }

  async getDetailedPerformance(userId: string): Promise<DetailedPerformance> {
    try {
      // Primeiro tente obter do localStorage
      const localData = this.getDetailedPerformanceFromLocalStorage(userId)

      // Se o usuário estiver autenticado, tente obter do Supabase também
      if (userId && (await this.isUserAuthenticated())) {
        try {
          const { data, error } = await supabase
            .from("user_performance")
            .select("performance")
            .eq("user_id", userId)
            .single()

          if (!error && data && data.performance) {
            // Se tivermos dados locais, mescle-os com os dados do Supabase
            if (localData) {
              return this.mergeDetailedPerformance(data.performance as DetailedPerformance, localData)
            }
            return data.performance as DetailedPerformance
          }
        } catch (supabaseError) {
          console.error("Error fetching detailed performance from Supabase:", supabaseError)
          // Continue usando o localStorage se o Supabase falhar
        }
      }

      // Se não conseguirmos obter do Supabase ou o usuário não estiver autenticado,
      // use o localStorage ou retorne a estrutura padrão
      return localData || this.getDefaultDetailedPerformance()
    } catch (error) {
      console.error("Error in getDetailedPerformance:", error)
      return this.getDefaultDetailedPerformance()
    }
  }

  private getDetailedPerformanceFromLocalStorage(userId: string): DetailedPerformance | null {
    try {
      const key = `detailed_performance_${userId}`
      const storedData = localStorage.getItem(key)

      if (storedData) {
        return JSON.parse(storedData) as DetailedPerformance
      }

      return null
    } catch (error) {
      console.error("Error reading detailed performance from localStorage:", error)
      return null
    }
  }

  // Método auxiliar para mesclar dados de desempenho detalhados
  private mergeDetailedPerformance(
    supabaseData: DetailedPerformance,
    localData: DetailedPerformance,
  ): DetailedPerformance {
    // Implementação básica de mesclagem - pode ser expandida conforme necessário
    return {
      quizzes: {
        totalAttempted: Math.max(supabaseData.quizzes.totalAttempted, localData.quizzes.totalAttempted),
        correctAnswers: Math.max(supabaseData.quizzes.correctAnswers, localData.quizzes.correctAnswers),
        averageScore: Math.max(supabaseData.quizzes.averageScore, localData.quizzes.averageScore),
        timePerQuestion: Math.min(
          supabaseData.quizzes.timePerQuestion || Number.POSITIVE_INFINITY,
          localData.quizzes.timePerQuestion || Number.POSITIVE_INFINITY,
        ),
        subjectScores: { ...localData.quizzes.subjectScores, ...supabaseData.quizzes.subjectScores },
      },
      simulations: {
        totalCompleted: Math.max(supabaseData.simulations.totalCompleted, localData.simulations.totalCompleted),
        successRate: Math.max(supabaseData.simulations.successRate, localData.simulations.successRate),
        averageTime: Math.min(
          supabaseData.simulations.averageTime || Number.POSITIVE_INFINITY,
          localData.simulations.averageTime || Number.POSITIVE_INFINITY,
        ),
        byType: { ...localData.simulations.byType, ...supabaseData.simulations.byType },
      },
      practicalTests: {
        completed: Math.max(supabaseData.practicalTests.completed, localData.practicalTests.completed),
        averageScore: Math.max(supabaseData.practicalTests.averageScore, localData.practicalTests.averageScore),
        bySkill: { ...localData.practicalTests.bySkill, ...supabaseData.practicalTests.bySkill },
      },
      studyTime: {
        total: Math.max(supabaseData.studyTime.total, localData.studyTime.total),
        byActivity: {
          lectures: Math.max(supabaseData.studyTime.byActivity.lectures, localData.studyTime.byActivity.lectures),
          quizzes: Math.max(supabaseData.studyTime.byActivity.quizzes, localData.studyTime.byActivity.quizzes),
          simulations: Math.max(
            supabaseData.studyTime.byActivity.simulations,
            localData.studyTime.byActivity.simulations,
          ),
          reading: Math.max(supabaseData.studyTime.byActivity.reading, localData.studyTime.byActivity.reading),
        },
        bySubject: { ...localData.studyTime.bySubject, ...supabaseData.studyTime.bySubject },
      },
      skillLevels: { ...localData.skillLevels, ...supabaseData.skillLevels },
    }
  }

  private getDefaultDetailedPerformance(): DetailedPerformance {
    return {
      quizzes: {
        totalAttempted: 0,
        correctAnswers: 0,
        averageScore: 0,
        timePerQuestion: 0,
        subjectScores: {},
      },
      simulations: {
        totalCompleted: 0,
        successRate: 0,
        averageTime: 0,
        byType: {},
      },
      practicalTests: {
        completed: 0,
        averageScore: 0,
        bySkill: {},
      },
      studyTime: {
        total: 0,
        byActivity: {
          lectures: 0,
          quizzes: 0,
          simulations: 0,
          reading: 0,
        },
        bySubject: {},
      },
      skillLevels: {},
    }
  }

  async updateDetailedPerformance(userId: string, performance: DetailedPerformance): Promise<void> {
    try {
      // Sempre salve no localStorage primeiro
      this.saveDetailedPerformanceToLocalStorage(userId, performance)

      // Tente atualizar no Supabase se o usuário estiver autenticado
      if (userId && (await this.isUserAuthenticated())) {
        try {
          // Verificar se o registro já existe
          const { data, error } = await supabase
            .from("user_performance")
            .select("user_id")
            .eq("user_id", userId)
            .single()

          if (!error && data) {
            // Se o registro existir, atualize-o
            const { error: updateError } = await supabase
              .from("user_performance")
              .update({
                performance,
                updated_at: new Date().toISOString(),
              })
              .eq("user_id", userId)

            if (updateError) {
              console.error("Error updating detailed performance in Supabase:", updateError)
            }
          } else {
            // Se o registro não existir, insira-o
            const { error: insertError } = await supabase.from("user_performance").insert({
              user_id: userId,
              performance,
              updated_at: new Date().toISOString(),
            })

            if (insertError) {
              console.error("Error inserting detailed performance in Supabase:", insertError)
            }
          }
        } catch (supabaseError) {
          console.error("Failed to update detailed performance in Supabase:", supabaseError)
          // Já salvamos no localStorage, então não precisamos fazer nada aqui
        }
      }
    } catch (error) {
      console.error("Unexpected error in updateDetailedPerformance:", error)
      // Já tentamos salvar no localStorage no início da função
    }
  }

  private saveDetailedPerformanceToLocalStorage(userId: string, performance: DetailedPerformance): void {
    try {
      localStorage.setItem(`detailed_performance_${userId}`, JSON.stringify(performance))
    } catch (error) {
      console.error("Error saving detailed performance to localStorage:", error)
    }
  }
}

export const localDB = new SupabaseDatabase()
