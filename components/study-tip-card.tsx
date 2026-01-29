"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Star, StarOff, Clock, ChevronDown, ChevronUp } from "lucide-react"

interface StudyTipCardProps {
  id: string
  title: string
  description: string
  content: string[]
  category: string
  difficulty: "iniciante" | "intermediário" | "avançado"
  timeToImplement: string
  tags: string[]
  isFavorite: boolean
  isChecked: boolean
  onToggleFavorite: (id: string) => void
  onToggleChecked: (id: string) => void
}

export function StudyTipCard({
  id,
  title,
  description,
  content,
  category,
  difficulty,
  timeToImplement,
  tags,
  isFavorite,
  isChecked,
  onToggleFavorite,
  onToggleChecked,
}: StudyTipCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Renderizar o indicador de dificuldade
  const renderDifficultyBadge = (difficulty: string) => {
    let color = ""
    switch (difficulty) {
      case "iniciante":
        color = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
        break
      case "intermediário":
        color = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
        break
      case "avançado":
        color = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
        break
      default:
        color = "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }

    return (
      <Badge variant="outline" className={`${color} ml-2`}>
        {difficulty}
      </Badge>
    )
  }

  return (
    <Card
      className={`overflow-hidden transition-all duration-200 ${
        isChecked ? "border-green-500 dark:border-green-700" : ""
      } ${isFavorite ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <Checkbox
              id={`check-${id}`}
              checked={isChecked}
              onCheckedChange={() => onToggleChecked(id)}
              className="mr-2"
            />
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <button
            onClick={() => onToggleFavorite(id)}
            className="text-gray-400 hover:text-yellow-500 transition-colors"
            aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            {isFavorite ? (
              <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
            ) : (
              <StarOff className="h-5 w-5" />
            )}
          </button>
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {renderDifficultyBadge(difficulty)}
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {timeToImplement}
          </Badge>
        </div>
        <CardDescription className="mt-2">{description}</CardDescription>
      </CardHeader>

      <CardContent className="pb-2">
        {isExpanded && (
          <div className="mt-2 space-y-2 text-sm">
            <h4 className="font-medium">Como implementar:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {content.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-1 mt-3">
              {tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between pt-2">
        <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="text-sm">
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" /> Menos detalhes
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" /> Mais detalhes
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
