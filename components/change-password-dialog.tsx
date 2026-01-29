"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabaseClient"
import { Loader2, Check, X, AlertCircle, Eye, EyeOff } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function ChangePasswordDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordFeedback, setPasswordFeedback] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()

  // Avaliar a força da senha quando ela muda
  useEffect(() => {
    if (!newPassword) {
      setPasswordStrength(0)
      setPasswordFeedback("")
      return
    }

    // Critérios de força da senha
    const hasMinLength = newPassword.length >= 8
    const hasUpperCase = /[A-Z]/.test(newPassword)
    const hasLowerCase = /[a-z]/.test(newPassword)
    const hasNumbers = /[0-9]/.test(newPassword)
    const hasSpecialChars = /[^A-Za-z0-9]/.test(newPassword)

    // Calcular pontuação (0-100)
    let strength = 0
    if (hasMinLength) strength += 20
    if (hasUpperCase) strength += 20
    if (hasLowerCase) strength += 20
    if (hasNumbers) strength += 20
    if (hasSpecialChars) strength += 20

    setPasswordStrength(strength)

    // Feedback baseado na força
    if (strength < 40) {
      setPasswordFeedback("Senha fraca")
    } else if (strength < 80) {
      setPasswordFeedback("Senha média")
    } else {
      setPasswordFeedback("Senha forte")
    }
  }, [newPassword])

  // Validar os campos do formulário
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!currentPassword) {
      newErrors.currentPassword = "A senha atual é obrigatória"
    }

    if (!newPassword) {
      newErrors.newPassword = "A nova senha é obrigatória"
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "A senha deve ter pelo menos 8 caracteres"
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirme sua nova senha"
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChangePassword = async () => {
    if (!validateForm()) return

    try {
      setIsLoading(true)

      // Primeiro, verificar a senha atual fazendo login
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: (await supabase.auth.getUser()).data.user?.email || "",
        password: currentPassword,
      })

      if (signInError) {
        toast({
          title: "Erro",
          description: "Senha atual incorreta. Por favor, tente novamente.",
          variant: "destructive",
        })
        setErrors({ currentPassword: "Senha atual incorreta" })
        return
      }

      // Atualizar a senha
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error

      toast({
        title: "Senha alterada",
        description: "Sua senha foi alterada com sucesso.",
        variant: "default",
      })

      // Limpar campos e fechar o diálogo
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      onOpenChange(false)
    } catch (error: any) {
      console.error("Error changing password:", error)

      // Mensagens de erro mais amigáveis baseadas no código de erro
      let errorMessage = "Não foi possível alterar sua senha. Por favor, tente novamente."

      if (error.message?.includes("auth")) {
        if (error.message.includes("weak-password")) {
          errorMessage = "Sua senha é muito fraca. Escolha uma senha mais forte."
        } else if (error.message.includes("requires-recent-login")) {
          errorMessage = "Por motivos de segurança, faça login novamente antes de alterar sua senha."
        }
      }

      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Função para obter a cor da barra de progresso baseada na força da senha
  const getStrengthColor = () => {
    if (passwordStrength < 40) return "bg-destructive"
    if (passwordStrength < 80) return "bg-amber-500"
    return "bg-emerald-500"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Alterar senha</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para alterar sua senha. Certifique-se de escolher uma senha forte.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Senha atual */}
          <div className="space-y-2">
            <Label htmlFor="current-password" className="text-sm font-medium">
              Senha atual
            </Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={`pr-10 ${errors.currentPassword ? "border-destructive" : ""}`}
                aria-invalid={!!errors.currentPassword}
                aria-describedby={errors.currentPassword ? "current-password-error" : undefined}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                aria-label={showCurrentPassword ? "Ocultar senha atual" : "Mostrar senha atual"}
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.currentPassword && (
              <p id="current-password-error" className="text-sm text-destructive flex items-center mt-1">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.currentPassword}
              </p>
            )}
          </div>

          {/* Nova senha */}
          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-sm font-medium">
              Nova senha
            </Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`pr-10 ${errors.newPassword ? "border-destructive" : ""}`}
                aria-invalid={!!errors.newPassword}
                aria-describedby={errors.newPassword ? "new-password-error" : "password-strength"}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                onClick={() => setShowNewPassword(!showNewPassword)}
                aria-label={showNewPassword ? "Ocultar nova senha" : "Mostrar nova senha"}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.newPassword ? (
              <p id="new-password-error" className="text-sm text-destructive flex items-center mt-1">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.newPassword}
              </p>
            ) : (
              newPassword && (
                <div id="password-strength" className="space-y-1 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs">Força da senha:</span>
                    <span
                      className={`text-xs font-medium ${
                        passwordStrength < 40
                          ? "text-destructive"
                          : passwordStrength < 80
                            ? "text-amber-500"
                            : "text-emerald-500"
                      }`}
                    >
                      {passwordFeedback}
                    </span>
                  </div>
                  <Progress
                    value={passwordStrength}
                    className="h-1.5"
                    indicatorClassName={getStrengthColor()}
                    aria-label="Força da senha"
                  />
                  <ul className="text-xs space-y-1 mt-2 text-muted-foreground">
                    <li className="flex items-center">
                      {newPassword.length >= 8 ? (
                        <Check className="h-3 w-3 mr-1 text-emerald-500" />
                      ) : (
                        <X className="h-3 w-3 mr-1 text-destructive" />
                      )}
                      Mínimo de 8 caracteres
                    </li>
                    <li className="flex items-center">
                      {/[A-Z]/.test(newPassword) ? (
                        <Check className="h-3 w-3 mr-1 text-emerald-500" />
                      ) : (
                        <X className="h-3 w-3 mr-1 text-destructive" />
                      )}
                      Pelo menos uma letra maiúscula
                    </li>
                    <li className="flex items-center">
                      {/[0-9]/.test(newPassword) ? (
                        <Check className="h-3 w-3 mr-1 text-emerald-500" />
                      ) : (
                        <X className="h-3 w-3 mr-1 text-destructive" />
                      )}
                      Pelo menos um número
                    </li>
                  </ul>
                </div>
              )
            )}
          </div>

          {/* Confirmar senha */}
          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-sm font-medium">
              Confirmar senha
            </Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`pr-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Ocultar confirmação de senha" : "Mostrar confirmação de senha"}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p id="confirm-password-error" className="text-sm text-destructive flex items-center mt-1">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" onClick={handleChangePassword} disabled={isLoading} className="ml-2">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Alterando...
              </>
            ) : (
              "Alterar senha"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
