"use client"

import type React from "react"
import { useState, useEffect } from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/authContext"
import { OfflineWarning } from "@/components/offline-warning"
import OnboardingModal from "@/components/onboarding-modal"
import { useAuth } from "@/lib/authContext"
import { supabase } from "@/lib/supabase"

function OnboardingChecker({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [loading, setLoading] = useState(true)
  const [hasChecked, setHasChecked] = useState(false)

  useEffect(() => {
    const sessionCompleted = sessionStorage.getItem("onboarding_completed")
    if (sessionCompleted === "true") {
      setLoading(false)
      setHasChecked(true)
      return
    }

    if (user && !hasChecked) {
      checkOnboarding()
    } else if (!user) {
      setLoading(false)
    }
  }, [user, hasChecked])

  const checkOnboarding = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      let retries = 3
      let lastError: Error | null = null

      while (retries > 0) {
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("onboarding_completed")
            .eq("id", user.id)
            .single()

          if (error) {
            lastError = new Error(error.message)
            retries--

            if (retries > 0) {
              // Aguardar antes de tentar novamente
              await new Promise((resolve) => setTimeout(resolve, 1000))
              continue
            }
            break
          }

          if (!data?.onboarding_completed) {
            setShowOnboarding(true)
          } else {
            sessionStorage.setItem("onboarding_completed", "true")
          }

          setHasChecked(true)
          setLoading(false)
          return
        } catch (error) {
          lastError = error as Error
          retries--

          if (retries > 0) {
            await new Promise((resolve) => setTimeout(resolve, 1000))
          }
        }
      }

      setHasChecked(true)
    } catch (error) {
      setHasChecked(true)
    } finally {
      setLoading(false)
    }
  }

  const handleOnboardingComplete = () => {
    setShowOnboarding(false)
    sessionStorage.setItem("onboarding_completed", "true")
  }

  const handleOnboardingClose = () => {
    setShowOnboarding(false)
  }

  if (loading) {
    return <>{children}</>
  }

  return (
    <>
      {children}
      <OnboardingModal open={showOnboarding} onComplete={handleOnboardingComplete} onClose={handleOnboardingClose} />
    </>
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthProvider>
        <OnboardingChecker>
          {children}
          <OfflineWarning />
        </OnboardingChecker>
      </AuthProvider>
    </ThemeProvider>
  )
}
