"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlayCircle, Clock, User, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Video {
  id: { videoId: string }
  snippet: {
    title: string
    channelTitle: string
    thumbnails: {
      medium: {
        url: string
      }
    }
  }
  contentDetails: {
    duration: string
  }
}

interface YouTubeVideoListProps {
  category: string
  searchQuery: string
}

const mockVideos = [
  {
    id: { videoId: "1" },
    snippet: {
      title: "Introdução à Eletrônica Digital",
      channelTitle: "Prof. Carlos Silva",
      thumbnails: {
        medium: { url: "/placeholder.svg?height=180&width=320" },
      },
    },
    contentDetails: {
      duration: "15:33",
    },
  },
  {
    id: { videoId: "2" },
    snippet: {
      title: "Circuitos Digitais - Aula 1",
      channelTitle: "Eng. Ana Paula",
      thumbnails: {
        medium: { url: "/placeholder.svg?height=180&width=320" },
      },
    },
    contentDetails: {
      duration: "22:15",
    },
  },
  {
    id: { videoId: "3" },
    snippet: {
      title: "Portas Lógicas - Conceitos Básicos",
      channelTitle: "Tech Education",
      thumbnails: {
        medium: { url: "/placeholder.svg?height=180&width=320" },
      },
    },
    contentDetails: {
      duration: "18:44",
    },
  },
]

export function YouTubeVideoList({ category, searchQuery }: YouTubeVideoListProps) {
  const [videos, setVideos] = useState<Video[]>([])
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    // Simulate API delay
    setTimeout(() => {
      setVideos(mockVideos)
      setIsLoading(false)
    }, 1000)
  }, [searchQuery])

  const getVideoId = (video: Video): string => video.id.videoId

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (videos.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Sem resultados</AlertTitle>
        <AlertDescription>Nenhum vídeo encontrado para esta categoria.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{category}</h2>
      {videos.map((video) => (
        <Card key={getVideoId(video)} className="overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3">
              <img
                src={video.snippet.thumbnails.medium.url}
                alt={video.snippet.title}
                className="w-full h-auto"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg?height=180&width=320"
                }}
              />
            </div>
            <div className="md:w-2/3 p-4">
              <h3 className="font-semibold mb-2">{video.snippet.title}</h3>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <User className="mr-1 h-4 w-4" />
                <span>{video.snippet.channelTitle}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Clock className="mr-1 h-4 w-4" />
                <span>{video.contentDetails.duration}</span>
              </div>
              <Button onClick={() => setSelectedVideo(getVideoId(video))}>
                <PlayCircle className="mr-2 h-4 w-4" />
                Assistir
              </Button>
            </div>
          </div>
          {selectedVideo === getVideoId(video) && (
            <CardContent className="pt-4">
              <div className="relative pb-[56.25%] h-0">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${getVideoId(video)}`}
                  title={video.snippet.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}
