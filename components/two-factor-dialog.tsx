"use client"

import { DialogFooter } from "@/components/ui/dialog"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, Smartphone } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"

interface TwoFactorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onEnable: () => void
}

export function TwoFactorDialog({ open, onOpenChange, onEnable }: TwoFactorDialogProps) {
  const [step, setStep] = useState<"intro" | "setup" | "verify">("intro")
  const [verificationCode, setVerificationCode] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Normally this would come from your backend
  const secretKey = "ABCDEFGHIJKLMNOP"
  const qrCodeUrl = `otpauth://totp/EducaFuturo:user@example.com?secret=${secretKey}&issuer=EducaFuturo`

  const handleVerify = async () => {
    setError("")
    setIsLoading(true)

    try {
      // Here you would verify the code with your backend
      if (verificationCode === "123456") {
        onEnable()
        onOpenChange(false)
        setStep("intro")
        setVerificationCode("")
      } else {
        setError("Código inválido")
      }
    } catch (err) {
      setError("Erro ao verificar código")
    }

    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Autenticação em duas etapas</DialogTitle>
          <DialogDescription>
            {step === "intro" && "Proteja sua conta com uma camada extra de segurança."}
            {step === "setup" && "Escaneie o código QR com seu aplicativo autenticador."}
            {step === "verify" && "Digite o código de 6 dígitos do seu aplicativo."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {step === "intro" && (
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <Smartphone className="h-6 w-6 text-primary" />
                <div>
                  <h4 className="font-medium">Aplicativo Autenticador</h4>
                  <p className="text-sm text-muted-foreground">Use Google Authenticator, Authy ou outro app similar.</p>
                </div>
              </div>
              <Button onClick={() => setStep("setup")} className="w-full">
                Começar configuração
              </Button>
            </div>
          )}

          {step === "setup" && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <QRCodeSVG value={qrCodeUrl} size={200} />
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Não consegue escanear? Use este código:</p>
                <code className="bg-muted px-2 py-1 rounded">{secretKey}</code>
              </div>
              <Button onClick={() => setStep("verify")} className="w-full">
                Próximo
              </Button>
            </div>
          )}

          {step === "verify" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Código de verificação</Label>
                <Input
                  id="code"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button onClick={handleVerify} disabled={verificationCode.length !== 6 || isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verificar
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false)
              setStep("intro")
              setVerificationCode("")
            }}
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
