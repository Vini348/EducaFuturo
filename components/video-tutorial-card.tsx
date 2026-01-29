import { Card } from "@/components/ui/card"
import { Clock } from "lucide-react"
import Image from "next/image"

interface VideoTutorialCardProps {
  title: string
  description: string
  duration: string
  thumbnail: string
  href: string
}

export function VideoTutorialCard({ title, description, duration, thumbnail, href }: VideoTutorialCardProps) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      <Card className="overflow-hidden hover:shadow-md transition-shadow h-[400px] flex flex-col">
        <div className="aspect-video relative bg-gray-100">
          <Image
            src={thumbnail || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg?height=200&width=400"
            }}
          />
        </div>
        <div className="p-4 space-y-2 flex flex-col flex-1">
          <h3 className="font-semibold text-lg line-clamp-2">{title}</h3>
          <p className="text-sm text-gray-600 line-clamp-4 flex-1">{description}</p>
          <div className="flex items-center text-sm text-gray-500 mt-auto">
            <Clock className="h-4 w-4 mr-1" />
            {duration}
          </div>
        </div>
      </Card>
    </a>
  )
}
