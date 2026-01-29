"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, X, AlertCircle, ImagePlus } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

interface ImageUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpload: (url: string) => Promise<void>
  user?: any
}

export function ImageUploadDialog({ open, onOpenChange, onUpload, user }: ImageUploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Verificar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      setError("Por favor, selecione uma imagem válida (JPEG, PNG ou GIF).")
      return
    }

    // Verificar tamanho do arquivo (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("A imagem deve ter menos de 5MB.")
      return
    }

    setError(null)
    setSelectedFile(file)

    // Criar URL de preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const clearSelection = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const simulateProgress = () => {
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return prev
        }
        return prev + 5
      })
    }, 100)
    return interval
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    setError(null)

    // Simular progresso de upload
    const progressInterval = simulateProgress()

    try {
      // Verificar se o usuário está autenticado
      const { data: sessionData } = await supabase.auth.getSession()
      if (!sessionData.session) {
        throw new Error("Você precisa estar logado para fazer upload de imagens.")
      }

      const userId = sessionData.session.user.id

      // Gerar um nome de arquivo único baseado no ID do usuário e timestamp
      const fileExt = selectedFile.name.split(".").pop()
      const fileName = `${userId}-${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      console.log("Uploading file to path:", filePath)

      // Fazer upload do arquivo para o bucket 'avatars'
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, selectedFile, {
          cacheControl: "3600",
          upsert: true,
        })

      if (uploadError) {
        console.error("Supabase upload error:", uploadError)
        throw new Error(`Erro ao fazer upload: ${uploadError.message}`)
      }

      console.log("Upload successful:", uploadData)

      // Completar o progresso
      clearInterval(progressInterval)
      setUploadProgress(100)

      // Obter a URL pública do arquivo
      const { data: urlData } = await supabase.storage.from("avatars").getPublicUrl(filePath)

      if (!urlData?.publicUrl) {
        throw new Error("Não foi possível obter a URL da imagem")
      }

      console.log("Public URL:", urlData.publicUrl)

      // Chamar a função de callback com a URL da imagem
      await onUpload(urlData.publicUrl)

      // Fechar o diálogo após o upload bem-sucedido
      onOpenChange(false)

      toast({
        title: "Sucesso",
        description: "Imagem de perfil atualizada com sucesso!",
        variant: "default",
      })
    } catch (error) {
      console.error("Upload error:", error)
      setError(error instanceof Error ? error.message : "Erro ao fazer upload da imagem")
      clearInterval(progressInterval)
      setUploadProgress(0)

      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao fazer upload da imagem",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]

      // Verificar tipo de arquivo
      if (!file.type.startsWith("image/")) {
        setError("Por favor, selecione uma imagem válida (JPEG, PNG ou GIF).")
        return
      }

      // Verificar tamanho do arquivo (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("A imagem deve ter menos de 5MB.")
        return
      }

      setError(null)
      setSelectedFile(file)

      // Criar URL de preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!uploading) {
          onOpenChange(isOpen)
          if (!isOpen) {
            clearSelection()
            setUploadProgress(0)
          }
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Atualizar foto de perfil</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div
            className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
              previewUrl ? "border-primary/20 hover:border-primary/30" : "border-gray-300 hover:border-gray-400"
            }`}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Clique ou arraste uma imagem para fazer upload"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                fileInputRef.current?.click()
              }
            }}
          >
            {previewUrl ? (
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-background shadow-md">
                  <AvatarImage src={previewUrl} alt="Preview" />
                  <AvatarFallback>
                    {user?.fullName
                      ? user.fullName
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                      : "U"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -right-2 -top-2 h-8 w-8 rounded-full shadow-md"
                  onClick={(e) => {
                    e.stopPropagation()
                    clearSelection()
                  }}
                  aria-label="Remover imagem selecionada"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <Avatar className="h-32 w-32 border-4 border-background shadow-md">
                  <AvatarImage src={user?.profileImage || ""} alt={user?.fullName || "Usuário"} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {user?.fullName
                      ? user.fullName
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                      : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-center mt-4">
                  <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">Clique ou arraste uma imagem aqui</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG ou GIF (máx. 5MB)</p>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              aria-label="Selecionar imagem para upload"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span>Enviando...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" aria-label={`Upload em progresso: ${uploadProgress}%`} />
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between sm:justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={uploading}
            className="flex-1 sm:flex-initial"
          >
            Cancelar
          </Button>
          <Button onClick={handleUpload} disabled={!selectedFile || uploading} className="flex-1 sm:flex-initial">
            {uploading ? (
              <>
                <span className="mr-2">Enviando...</span>
                <Upload className="h-4 w-4 animate-pulse" />
              </>
            ) : (
              <>
                <span className="mr-2">Salvar</span>
                <Upload className="h-4 w-4" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
