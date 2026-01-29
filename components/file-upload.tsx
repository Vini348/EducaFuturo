"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ImageIcon, FileIcon, XIcon, Loader2 } from "lucide-react"

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void
  maxFiles?: number
  acceptedFileTypes?: string
  maxSizeMB?: number
}

export function FileUpload({
  onFilesSelected,
  maxFiles = 5,
  acceptedFileTypes = "image/*,video/*,application/pdf,text/*",
  maxSizeMB = 10,
}: FileUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<{ file: File; preview: string }[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    setIsLoading(true)

    const files = Array.from(e.target.files || [])

    // Check if adding these files would exceed the max number
    if (selectedFiles.length + files.length > maxFiles) {
      setError(`Você pode anexar no máximo ${maxFiles} arquivos.`)
      setIsLoading(false)
      return
    }

    // Check file sizes
    const oversizedFiles = files.filter((file) => file.size > maxSizeMB * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      setError(`Alguns arquivos excedem o tamanho máximo de ${maxSizeMB}MB.`)
      setIsLoading(false)
      return
    }

    // Create previews for images
    const newPreviews = files.map((file) => {
      let preview = ""
      if (file.type.startsWith("image/")) {
        preview = URL.createObjectURL(file)
      }
      return { file, preview }
    })

    setSelectedFiles((prev) => [...prev, ...files])
    setPreviews((prev) => [...prev, ...newPreviews])
    onFilesSelected([...selectedFiles, ...files])
    setIsLoading(false)

    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeFile = (index: number) => {
    // Revoke object URL to avoid memory leaks
    if (previews[index].preview) {
      URL.revokeObjectURL(previews[index].preview)
    }

    const newFiles = [...selectedFiles]
    newFiles.splice(index, 1)

    const newPreviews = [...previews]
    newPreviews.splice(index, 1)

    setSelectedFiles(newFiles)
    setPreviews(newPreviews)
    onFilesSelected(newFiles)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {previews.map((item, index) => (
          <div key={index} className="relative w-24 h-24">
            {item.file.type.startsWith("image/") ? (
              <div className="relative w-24 h-24 border rounded-md overflow-hidden">
                <img
                  src={item.preview || "/placeholder.svg"}
                  alt={`Preview ${index}`}
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-5 w-5 rounded-full"
                  onClick={() => removeFile(index)}
                >
                  <XIcon className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="w-24 h-24 border rounded-md flex items-center justify-center bg-gray-100 relative">
                <FileIcon className="h-8 w-8 text-gray-500" />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-5 w-5 rounded-full"
                  onClick={() => removeFile(index)}
                >
                  <XIcon className="h-3 w-3" />
                </Button>
                <span className="absolute bottom-1 text-xs truncate w-full text-center px-1">
                  {item.file.name.length > 10 ? `${item.file.name.substring(0, 7)}...` : item.file.name}
                </span>
              </div>
            )}
          </div>
        ))}

        {selectedFiles.length < maxFiles && (
          <Button
            type="button"
            variant="outline"
            className="w-24 h-24 border-dashed"
            onClick={triggerFileInput}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <ImageIcon className="h-6 w-6 mr-2" />
                <span className="sr-only">Adicionar arquivo</span>
              </>
            )}
          </Button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
        accept={acceptedFileTypes}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <p className="text-xs text-gray-500">
        Você pode anexar até {maxFiles} arquivos (máx. {maxSizeMB}MB cada). Formatos aceitos: imagens, vídeos, PDFs e
        arquivos de texto.
      </p>
    </div>
  )
}
