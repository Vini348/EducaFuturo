"use client"
import { Card, CardContent } from "@/components/ui/card"
import { FileIcon, FileTextIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import type { ForumAttachment } from "@/lib/forum"

interface AttachmentPreviewProps {
  attachment: ForumAttachment
  onDelete?: () => void
  showDelete?: boolean
}

export function AttachmentPreview({ attachment, onDelete, showDelete = false }: AttachmentPreviewProps) {
  const isImage = attachment.file_type.startsWith("image/")
  const isVideo = attachment.file_type.startsWith("video/")
  const isPdf = attachment.file_type === "application/pdf"
  const isText =
    attachment.file_type.startsWith("text/") ||
    attachment.file_type === "application/json" ||
    attachment.file_type === "application/xml"

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-2">
        <div className="relative">
          {showDelete && onDelete && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 z-10 h-6 w-6 rounded-full"
              onClick={onDelete}
            >
              <XIcon className="h-3 w-3" />
            </Button>
          )}

          {isImage && attachment.url ? (
            <div className="relative h-40 w-full">
              <Image
                src={attachment.url || "/placeholder.svg"}
                alt={attachment.file_name}
                fill
                className="object-cover rounded-md"
              />
            </div>
          ) : isVideo && attachment.url ? (
            <video src={attachment.url} controls className="w-full h-40 object-cover rounded-md" />
          ) : (
            <div className="flex items-center p-2 gap-2">
              {isPdf ? (
                <FileTextIcon className="h-8 w-8 text-red-500" />
              ) : isText ? (
                <FileTextIcon className="h-8 w-8 text-blue-500" />
              ) : (
                <FileIcon className="h-8 w-8 text-gray-500" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{attachment.file_name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(attachment.file_size)}</p>
              </div>
            </div>
          )}

          <div className="mt-2 flex justify-between items-center">
            {!isImage && !isVideo && (
              <a
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline"
              >
                Baixar arquivo
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
