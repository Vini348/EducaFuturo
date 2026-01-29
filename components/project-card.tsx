"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Lock, Upload, CheckCircle, XCircle, Clock } from "lucide-react"
import * as Icons from "lucide-react"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ProjectCardProps {
  icon: keyof typeof Icons
  title: string
  description: string
  components: string[]
  category: string
  difficulty: "Iniciante" | "Intermediário" | "Avançado"
  isLocked: boolean
  onUpload: (file: File) => Promise<void>
  feedback?: string // Adicionado campo para feedback
  status?: "pending" | "approved" | "rejected" // Adicionado campo para status
}

export function ProjectCard({
  icon,
  title,
  description,
  components,
  category,
  difficulty,
  isLocked,
  onUpload,
  feedback,
  status,
}: ProjectCardProps) {
  const Icon = Icons[icon]
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null) // Added error state
  const { toast } = useToast()
  const [showFeedback, setShowFeedback] = useState(false)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Iniciante":
        return "bg-black text-white"
      case "Intermediário":
        return "bg-gray-700 text-white"
      case "Avançado":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast({
          title: "Erro",
          description: "O arquivo deve ter menos de 5MB",
          variant: "destructive",
        })
      } else {
        setFile(selectedFile)
      }
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo para enviar.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    try {
      await onUpload(file)
      toast({
        title: "Sucesso",
        description: "Seu projeto foi enviado para revisão.",
      })
      setFile(null)
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Houve um problema ao enviar seu projeto. Tente novamente.",
        variant: "destructive",
      })
      setError(error.message) // Set error message
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="p-6 relative">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 rounded-lg ${isLocked ? "bg-gray-100" : "bg-blue-100"}`}>
          <Icon className={`h-6 w-6 ${isLocked ? "text-gray-400" : "text-blue-500"}`} />
        </div>
        <Badge className={getDifficultyColor(difficulty)}>{difficulty}</Badge>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>

        <div>
          <h4 className="font-medium mb-2">Componentes necessários:</h4>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            {components.map((component, index) => (
              <li key={index}>{component}</li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="bg-gray-100">
            {category}
          </Badge>

          {isLocked ? (
            <div className="flex items-center text-gray-500 text-sm">
              <Lock className="h-4 w-4 mr-1" />
              Bloqueado
            </div>
          ) : (
            <div className="space-y-2">
              <Input type="file" onChange={handleFileChange} accept="image/*,video/*,.pdf" />
              <Button onClick={handleUpload} disabled={!file || isUploading} className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                {isUploading ? "Enviando..." : "Enviar Projeto"}
              </Button>
            </div>
          )}
        </div>
        {status && (
          <div className="mt-4">
            <div
              className={`flex items-center gap-2 ${
                status === "approved" ? "text-green-600" : status === "rejected" ? "text-red-600" : "text-yellow-500"
              }`}
            >
              {status === "approved" && <CheckCircle className="h-4 w-4" />}
              {status === "rejected" && <XCircle className="h-4 w-4" />}
              {status === "pending" && <Clock className="h-4 w-4" />}
              <span className="font-medium">
                {status === "approved" ? "Aprovado" : status === "rejected" ? "Rejeitado" : "Em análise"}
              </span>
            </div>

            {status === "rejected" && feedback && (
              <div className="mt-2">
                <Button variant="outline" size="sm" onClick={() => setShowFeedback(!showFeedback)} className="text-xs">
                  {showFeedback ? "Ocultar feedback" : "Ver feedback"}
                </Button>

                {showFeedback && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md text-sm">
                    <p className="font-medium mb-1">Feedback do revisor:</p>
                    <p className="text-gray-700">{feedback}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {error && ( // Added error message display
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>

      {isLocked && (
        <div className="absolute inset-0 bg-gray-50/80 backdrop-blur-[1px] rounded-lg flex items-center justify-center">
          <div className="text-center p-6">
            <Lock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Complete o projeto anterior para desbloquear</p>
          </div>
        </div>
      )}
    </Card>
  )
}
