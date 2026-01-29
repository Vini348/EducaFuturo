import { supabase } from "./supabaseClient"

export type PreferenceChangeType = "profile" | "study" | "notification"

export interface PreferenceHistoryItem {
  id: string
  change_type: PreferenceChangeType
  previous_value: any
  new_value: any
  changed_at: string
  changed_by: string
}

/**
 * Obtém o histórico de alterações das preferências do usuário
 */
export async function getUserPreferencesHistory(
  userId: string,
  changeType?: PreferenceChangeType,
  limit = 10,
  offset = 0,
): Promise<{ data: PreferenceHistoryItem[] | null; error: any }> {
  try {
    const { data, error } = await supabase.rpc("get_user_preferences_history", {
      user_id_param: userId,
      change_type_param: changeType || null,
      limit_param: limit,
      offset_param: offset,
    })

    return { data, error }
  } catch (error) {
    console.error("Erro ao obter histórico de preferências:", error)
    return { data: null, error }
  }
}

/**
 * Salva as preferências de perfil do usuário
 */
export async function saveProfilePreferences(
  userId: string,
  profileData: { full_name?: string; avatar_url?: string },
): Promise<{ success: boolean; error: any }> {
  try {
    // Verificar se o perfil existe
    const { data: existingProfile, error: checkError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle()

    if (checkError) {
      console.error("Erro ao verificar perfil existente:", checkError)
      return { success: false, error: checkError }
    }

    // Se o perfil não existir, criar um novo
    if (!existingProfile) {
      const { error: insertError } = await supabase.from("profiles").insert({
        id: userId,
        ...profileData,
        updated_at: new Date().toISOString(),
      })

      return { success: !insertError, error: insertError }
    }

    // Se o perfil existir, atualizá-lo
    const { error } = await supabase
      .from("profiles")
      .update({
        ...profileData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    // Verificar se a atualização foi bem-sucedida
    if (!error) {
      console.log("Perfil atualizado com sucesso:", profileData)
    }

    return { success: !error, error }
  } catch (error) {
    console.error("Erro ao salvar preferências de perfil:", error)
    return { success: false, error }
  }
}

/**
 * Salva as preferências de estudo do usuário
 */
export async function saveStudyPreferences(
  userId: string,
  studyPreferences: { studyGoal?: number; pomodoroDuration?: number },
): Promise<{ success: boolean; error: any }> {
  try {
    // Primeiro, obter as preferências atuais para mesclar com as novas
    const { data: currentProfile, error: fetchError } = await supabase
      .from("profiles")
      .select("study_preferences")
      .eq("id", userId)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      // Ignorar erro de não encontrado
      return { success: false, error: fetchError }
    }

    // Mesclar as preferências existentes com as novas
    const updatedPreferences = {
      ...(currentProfile?.study_preferences || {}),
      ...studyPreferences,
    }

    console.log("Atualizando preferências de estudo:", updatedPreferences)

    // Verificar se o perfil existe
    const { count, error: countError } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("id", userId)

    if (countError) {
      return { success: false, error: countError }
    }

    // Se o perfil não existir, criar um novo
    if (count === 0) {
      const { error: insertError } = await supabase.from("profiles").insert({
        id: userId,
        study_preferences: updatedPreferences,
        updated_at: new Date().toISOString(),
      })

      return { success: !insertError, error: insertError }
    }

    // Atualizar o perfil com as preferências mescladas
    const { error } = await supabase
      .from("profiles")
      .update({
        study_preferences: updatedPreferences,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    // Verificar se a atualização foi bem-sucedida
    if (!error) {
      console.log("Preferências de estudo atualizadas com sucesso:", updatedPreferences)
    }

    return { success: !error, error }
  } catch (error) {
    console.error("Erro ao salvar preferências de estudo:", error)
    return { success: false, error }
  }
}

/**
 * Salva as preferências de notificação do usuário
 */
export async function saveNotificationPreferences(
  userId: string,
  notificationPreferences: {
    email?: boolean
    push?: boolean
    studyReminders?: boolean
    contentUpdates?: boolean
    forumResponses?: boolean
  },
): Promise<{ success: boolean; error: any }> {
  try {
    // Primeiro, obter as preferências atuais para mesclar com as novas
    const { data: currentProfile, error: fetchError } = await supabase
      .from("profiles")
      .select("notification_preferences")
      .eq("id", userId)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      // Ignorar erro de não encontrado
      return { success: false, error: fetchError }
    }

    // Mesclar as preferências existentes com as novas
    const updatedPreferences = {
      ...(currentProfile?.notification_preferences || {}),
      ...notificationPreferences,
    }

    console.log("Atualizando preferências de notificação:", updatedPreferences)

    // Verificar se o perfil existe
    const { count, error: countError } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("id", userId)

    if (countError) {
      return { success: false, error: countError }
    }

    // Se o perfil não existir, criar um novo
    if (count === 0) {
      const { error: insertError } = await supabase.from("profiles").insert({
        id: userId,
        notification_preferences: updatedPreferences,
        updated_at: new Date().toISOString(),
      })

      return { success: !insertError, error: insertError }
    }

    // Atualizar o perfil com as preferências mescladas
    const { error } = await supabase
      .from("profiles")
      .update({
        notification_preferences: updatedPreferences,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    // Verificar se a atualização foi bem-sucedida
    if (!error) {
      console.log("Preferências de notificação atualizadas com sucesso:", updatedPreferences)
    }

    return { success: !error, error }
  } catch (error) {
    console.error("Erro ao salvar preferências de notificação:", error)
    return { success: false, error }
  }
}
