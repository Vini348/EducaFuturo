"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Network } from "lucide-react"
import Image from "next/image"

interface MindMapCardProps {
  id: string
  category: "Digital" | "Analógica" | "Potência"
  title: string
  topics: string[]
  imageUrl: string
  pdfUrl: string
}

export function MindMapCard({ id, category, title, topics, imageUrl, pdfUrl }: MindMapCardProps) {
  const handleDownload = () => {
    window.open(pdfUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <div className="absolute top-4 right-4 z-10">
          <Badge variant="black" className="font-medium">
            {category}
          </Badge>
        </div>
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          width={400}
          height={200}
          className="w-full h-[200px] object-cover bg-gray-100"
        />
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Network className="h-5 w-5 text-[#4F46E5]" />
          <h3 className="font-semibold">{title}</h3>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Tópicos abordados:</h4>
          <ul className="space-y-1 text-sm text-gray-600">
            {topics.map((topic, index) => (
              <li key={index}>{topic}</li>
            ))}
          </ul>
        </div>

        <Button variant="outline" className="w-full" onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Baixar PDF
        </Button>
      </div>
    </Card>
  )
}
