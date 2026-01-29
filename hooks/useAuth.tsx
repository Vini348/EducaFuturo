"use client"

import type React from "react"

import { createContext, useState, useEffect } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (email: string, password: string, fullName: string) => Promise<void>
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>
  updateUser: (data: Partial<User>) => Promise<void>
  updateSettings: (data: any) => Promise<void>
  deleteAccount: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe()
      }
    }
  }, [])

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const register = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    })
    if (error) throw error
  }

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    const { error } = await supabase.auth.updatePassword(currentPassword, newPassword)
    if (error) throw error
  }

  const updateUser = async (data: Partial<User>) => {
    const { error } = await supabase.auth.updateUser(data)
    if (error) throw error
    if (user) setUser({ ...user, ...data })
  }

  const updateSettings = async (data: any) => {
    if (user) {
      const { error } = await supabase
        .from("users")
        .update({ settings: { ...user.user_metadata?.settings, ...data } })
        .eq("id", user.id)
      if (error) throw error
    }
  }

  const deleteAccount = async () => {
    if (user) {
      const { error } = await supabase.auth.deleteUser()
      if (error) throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, login, logout, register, updatePassword, updateUser, updateSettings, deleteAccount }}
    >
      {children}
    </AuthContext.Provider>
  )
}

import { useContext as useReactContext } from "react"

export function useAuth() {
  const context = useReactContext(AuthContext)

  if (context === undefined) {
    console.warn("useAuth() called outside of AuthProvider. Using fallback implementation.")

    return {
      user: null,
      loading: false,
      isOnline: navigator.onLine,
      login: async () => {
        throw new Error("Auth context not available")
      },
      logout: async () => {
        throw new Error("Auth context not available")
      },
      register: async () => {
        throw new Error("Auth context not available")
      },
      updatePassword: async () => {
        throw new Error("Auth context not available")
      },
      updateUser: async () => {
        throw new Error("Auth context not available")
      },
      updateSettings: async () => {
        throw new Error("Auth context not available")
      },
      deleteAccount: async () => {
        throw new Error("Auth context not available")
      },
    }
  }

  return context
}
