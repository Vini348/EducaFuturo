"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Clock, Users, Trophy, Star, Play, BookOpen, Target, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

interface QuizCardProps {
  id: string
  title: string
  description: string
  subject: string
  difficulty: "Fácil" | "Médio" | "Difícil"
  questions: number
  timeLimit: number
  attempts: number
  bestScore: number
  topics: string[]
  year: number
  isCompleted?: boolean
  progress?: number
}

export function QuizCard({
  id,
  title,
  description,
  subject,
  difficulty,
  questions,
  timeLimit,
  attempts,
  bestScore,
  topics,
  year,
  isCompleted = false,
  progress = 0,
}: QuizCardProps) {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Fácil":
        return "bg-green-100 text-green-800 border-green-200"
      case "Médio":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Difícil":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getSubjectColor = (subj: string) => {
    const colors = {
      "Eletrônica Digital": "text-blue-600",
      "Eletrônica Analógica": "text-green-600",
      "Eletrônica de Potência": "text-orange-600",
      "Circuitos Elétricos": "text-purple-600",
      Matemática: "text-indigo-600",
      Física: "text-cyan-600",
      Programação: "text-pink-600",
      "Sistemas de Comunicação": "text-teal-600",
      "Instalações Elétricas": "text-yellow-600",
      Manutenção: "text-amber-600",
      Controle: "text-red-600",
    }
    return colors[subj as keyof typeof colors] || "text-gray-600"
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 70) return "text-yellow-600"
    if (score >= 50) return "text-orange-600"
    return "text-red-600"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
      className="h-full"
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md overflow-hidden">
        {/* Header com gradiente */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-b">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge className={getDifficultyColor(difficulty)} variant="outline">
                  {difficulty}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {year}º Ano
                </Badge>
                {isCompleted && (
                  <Badge className="bg-green-100 text-green-800 border-green-200" variant="outline">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Concluído
                  </Badge>
                )}
              </div>
              <h3 className="font-bold text-lg leading-tight mb-1">{title}</h3>
              <p className={`text-sm font-medium ${getSubjectColor(subject)}`}>{subject}</p>
            </div>
            {bestScore > 0 && (
              <div className="text-right">
                <div className={`text-2xl font-bold ${getScoreColor(bestScore)}`}>{bestScore}%</div>
                <div className="text-xs text-muted-foreground">Melhor nota</div>
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </div>

        <CardContent className="p-4 flex-1 flex flex-col">
          {/* Estatísticas */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <BookOpen className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-lg font-bold text-blue-600">{questions}</div>
              <div className="text-xs text-muted-foreground">Questões</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Clock className="h-4 w-4 text-orange-600" />
              </div>
              <div className="text-lg font-bold text-orange-600">{timeLimit}</div>
              <div className="text-xs text-muted-foreground">Minutos</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
              <div className="text-lg font-bold text-purple-600">{attempts}</div>
              <div className="text-xs text-muted-foreground">Tentativas</div>
            </div>
          </div>

          {/* Progresso */}
          {progress > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progresso</span>
                <span className="text-sm text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Tópicos */}
          <div className="mb-4 flex-1">
            <div className="text-sm font-medium mb-2 flex items-center">
              <Target className="h-4 w-4 mr-1 text-gray-600" />
              Tópicos Abordados
            </div>
            <div className="flex flex-wrap gap-1">
              {topics.slice(0, 3).map((topic, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {topic}
                </Badge>
              ))}
              {topics.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{topics.length - 3} mais
                </Badge>
              )}
            </div>
          </div>

          {/* Ações */}
          <div className="space-y-2 mt-auto">
            <Link href={`/review/questionarios/${id}`} className="block">
              <Button className="w-full" size="sm">
                <Play className="h-4 w-4 mr-2" />
                {isCompleted ? "Refazer Quiz" : "Iniciar Quiz"}
              </Button>
            </Link>
            {bestScore > 0 && (
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <Trophy className="h-3 w-3 mr-1" />
                  Melhor: {bestScore}%
                </div>
                <div className="flex items-center">
                  <Star className="h-3 w-3 mr-1" />
                  {attempts} tentativas
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
