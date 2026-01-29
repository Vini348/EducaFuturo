"use client"

import { useEffect, useState } from "react"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function OfflineWarning() {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    // Verificar estado inicial
    setIsOffline(!navigator.onLine)

    // Adicionar event listeners
    const handleOffline = () => setIsOffline(true)
    const handleOnline = () => setIsOffline(false)

    window.addEventListener("offline", handleOffline)
    window.addEventListener("online", handleOnline)

    return () => {
      window.removeEventListener("offline", handleOffline)
      window.removeEventListener("online", handleOnline)
    }
  }, [])

  if (!isOffline) return null

  return (
    <Alert variant="destructive" className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Você está offline</AlertTitle>
      <AlertDescription>
        Algumas funcionalidades podem não estar disponíveis. Verifique sua conexão com a internet.
      </AlertDescription>
    </Alert>
  )
}
