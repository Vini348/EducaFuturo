"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Loader2 } from "lucide-react"

interface AuthWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AuthWrapper({ children, fallback }: AuthWrapperProps) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Adicione logs para depuração
  useEffect(() => {
    // Função para obter o usuário atual
    async function getUser() {
      try {
        setLoading(true)
        setError(null)

        console.log("AuthWrapper: Verificando sessão do usuário...")

        // Usar try/catch para lidar com erros de rede
        try {
          const { data, error } = await supabase.auth.getSession()

          if (error) {
            console.error("AuthWrapper: Erro ao obter sessão:", error)
            throw error
          }

          const userSession = data?.session?.user || null
          console.log("AuthWrapper: Sessão obtida:", userSession ? "usuário encontrado" : "nenhum usuário")

          setUser(userSession)
        } catch (err: any) {
          console.error("Error getting user session:", err)
          setError(err)
        }
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Configurar listener para mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("AuthWrapper: Estado de autenticação alterado:", event)
      setUser(session?.user || null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  // Mostrar loader enquanto verifica autenticação
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Mostrar fallback se não estiver autenticado ou ocorrer erro
  if (!user || error) {
    return (
      fallback || (
        <div className="p-4 text-center">
          <p className="text-muted-foreground">
            {error
              ? "Erro ao verificar autenticação. Tente novamente mais tarde."
              : "Você precisa estar logado para acessar este conteúdo."}
          </p>
        </div>
      )
    )
  }

  // Renderizar o conteúdo protegido
  return <>{children}</>
}
