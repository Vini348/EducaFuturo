"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, CheckCircle } from "lucide-react"
import { useAuth } from "@/lib/authContext"

interface ForgotPasswordDialogProps {
  children: React.ReactNode
}

export function ForgotPasswordDialog({ children }: ForgotPasswordDialogProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [open, setOpen] = useState(false)
  const { resetPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!email) {
      setError("Por favor, digite seu email.")
      setIsLoading(false)
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Por favor, digite um email válido.")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await resetPassword(email)

      if (error) {
        if (error.message.includes("User not found")) {
          setError("Email não encontrado. Verifique se o email está correto.")
        } else if (error.message.includes("Email rate limit exceeded")) {
          setError("Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.")
        } else {
          setError(error.message)
        }
      } else {
        setSuccess(true)
        // Fechar o dialog após 3 segundos
        setTimeout(() => {
          setOpen(false)
          setSuccess(false)
          setEmail("")
        }, 3000)
      }
    } catch (error) {
      setError("Erro inesperado. Tente novamente mais tarde.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      // Reset form when closing
      setEmail("")
      setError("")
      setSuccess(false)
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Recuperar Senha
          </DialogTitle>
          <DialogDescription>Digite seu email para receber um link de recuperação de senha.</DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center space-y-4 py-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-medium text-green-600 dark:text-green-400">Email Enviado!</h3>
              <p className="text-sm text-muted-foreground">
                Verifique sua caixa de entrada e clique no link para redefinir sua senha.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Enviando..." : "Enviar Link"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
