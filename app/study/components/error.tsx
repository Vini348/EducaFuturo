"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Algo deu errado!</AlertTitle>
          <AlertDescription>Não foi possível carregar o banco de componentes.</AlertDescription>
        </Alert>
        <Button onClick={reset} className="w-full">
          Tentar novamente
        </Button>
      </div>
    </div>
  )
}
