"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database, Bookmark, BookmarkCheck } from "lucide-react"
import Image from "next/image"
import type { ComponentCategory } from "@/app/study/components/page"
import { Button } from "@/components/ui/button"

interface ComponentCardProps {
  component: ComponentCategory
  onClick: () => void
  isFavorite: boolean
  onToggleFavorite: () => void
}

export function ComponentCard({ component, onClick, isFavorite, onToggleFavorite }: ComponentCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleFavorite()
  }

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-md transition-all border-2 border-transparent hover:border-blue-100"
      onClick={onClick}
    >
      <CardHeader className="bg-blue-50 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Database className="h-5 w-5 text-blue-500" />
            {component.name}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="font-mono">
              {component.symbol}
            </Badge>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={handleFavoriteClick}>
              {isFavorite ? (
                <BookmarkCheck className="h-5 w-5 text-blue-500" />
              ) : (
                <Bookmark className="h-5 w-5 text-gray-400" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex gap-4 items-start">
          {component.image && (
            <div className="shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
              <Image
                src={component.image || "/placeholder.svg"}
                alt={component.name}
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{component.description}</p>
            <div className="flex flex-wrap gap-1">
              {component.models.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  {component.models.length} modelo{component.models.length !== 1 ? "s" : ""}
                </Badge>
              )}
              <Badge variant="outline" className="text-xs capitalize">
                {component.category === "passive"
                  ? "Passivo"
                  : component.category === "semiconductor"
                    ? "Semicondutor"
                    : component.category === "integrated"
                      ? "Integrado"
                      : component.category === "electromechanical"
                        ? "Eletromecânico"
                        : component.category === "power"
                          ? "Energia"
                          : component.category}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
