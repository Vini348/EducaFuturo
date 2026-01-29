"use client"
import { supabase } from "./supabaseClient"

export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
  created_at: string
}

export interface AuthResponse {
  user: User | null
  error: string | null
}

export async function signUp(email: string, password: string, name?: string): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
        data: {
          name: name || "",
        },
      },
    })

    if (error) {
      return { user: null, error: error.message }
    }

    if (data.user) {
      return {
        user: {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.name || name,
          avatar_url: data.user.user_metadata?.avatar_url,
          created_at: data.user.created_at,
        },
        error: null,
      }
    }

    return { user: null, error: "Erro desconhecido durante o cadastro" }
  } catch (err) {
    return { user: null, error: "Erro de conexão. Tente novamente." }
  }
}

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { user: null, error: error.message }
    }

    if (data.user) {
      return {
        user: {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.name,
          avatar_url: data.user.user_metadata?.avatar_url,
          created_at: data.user.created_at,
        },
        error: null,
      }
    }

    return { user: null, error: "Erro desconhecido durante o login" }
  } catch (err) {
    return { user: null, error: "Erro de conexão. Tente novamente." }
  }
}

export async function signOut(): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      return { error: error.message }
    }

    return { error: null }
  } catch (err) {
    return { error: "Erro ao fazer logout. Tente novamente." }
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    return {
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.name,
      avatar_url: user.user_metadata?.avatar_url,
      created_at: user.created_at,
    }
  } catch (err) {
    return null
  }
}

export async function resetPassword(email: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/reset-password`,
    })

    if (error) {
      return { error: error.message }
    }

    return { error: null }
  } catch (err) {
    return { error: "Erro ao enviar email de recuperação. Tente novamente." }
  }
}

export async function updatePassword(newPassword: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      return { error: error.message }
    }

    return { error: null }
  } catch (err) {
    return { error: "Erro ao atualizar senha. Tente novamente." }
  }
}

export async function updateProfile(updates: { name?: string; avatar_url?: string }): Promise<{
  error: string | null
}> {
  try {
    const { error } = await supabase.auth.updateUser({
      data: updates,
    })

    if (error) {
      return { error: error.message }
    }

    return { error: null }
  } catch (err) {
    return { error: "Erro ao atualizar perfil. Tente novamente." }
  }
}
