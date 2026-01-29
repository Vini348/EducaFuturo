"use client"

import { Button } from "@/components/ui/button"
import { Clock, User, Play } from "lucide-react"
import Image from "next/image"

interface VideoLessonCardProps {
  title: string
  description: string
  instructor: string
  duration: string
  thumbnail: string
  onWatch: () => void
  videoUrl: string
}

export function VideoLessonCard({
  title,
  description,
  instructor,
  duration,
  thumbnail,
  onWatch,
  videoUrl,
}: VideoLessonCardProps) {
  return (
    <div className="flex flex-col md:flex-row gap-6 items-start">
      <div className="w-full md:w-80 aspect-video relative bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        <Image src={thumbnail || "/placeholder.svg"} alt={title} fill className="object-cover" />
      </div>

      <div className="flex-1 space-y-4">
        <div>
          <h3 className="text-xl font-semibold mb-2 line-clamp-2">{title}</h3>
          <p className="text-gray-600 line-clamp-3">{description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="line-clamp-1">{instructor}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{duration}</span>
          </div>
        </div>

        <Button onClick={onWatch} className="gap-2">
          <Play className="h-4 w-4" />
          Assistir
        </Button>
      </div>
    </div>
  )
}
