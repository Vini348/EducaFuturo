"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

// Hook para usar autenticação Supabase fora do contexto AuthProvider
export function useSupabaseAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function getInitialSession() {
      try {
        setLoading(true)
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          throw error
        }

        setUser(data.session?.user || null)
      } catch (err: any) {
        console.error("Error getting initial session:", err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Configurar listener para mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  async function signIn(email: string, password: string) {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
    } catch (err: any) {
      console.error("Error signing in:", err)
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function signOut() {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
    } catch (err: any) {
      console.error("Error signing out:", err)
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    loading,
    error,
    signIn,
    signOut,
    supabase,
  }
}
