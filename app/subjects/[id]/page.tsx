"use client"

import { useParams } from "next/navigation"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { BottomNav } from "@/components/bottom-nav"
import {
  BookOpen,
  Clock,
  Target,
  CheckCircle,
  PlayCircle,
  FileText,
  Gamepad2,
  Calculator,
  Video,
  Zap,
  Award,
  GraduationCap,
  ArrowLeft,
} from "lucide-react"
import { curriculumData } from "@/data/subjects-curriculum"
import Link from "next/link"

export default function SubjectDetailPage() {
  const params = useParams()
  const subjectId = params.id as string
  const [isLoading, setIsLoading] = useState(false)

  // Find subject in curriculum data
  const subject = curriculumData.find((s) => s.id === subjectId)

  if (!subject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2 xs:p-3 sm:p-4">
        <div className="max-w-4xl mx-auto">
          <BottomNav active="home" />
          <div className="text-center py-8 xs:py-12 sm:py-16">
            <h1 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 mb-2 xs:mb-4">
              Matéria não encontrada
            </h1>
            <p className="text-xs xs:text-sm text-gray-600 mb-4 xs:mb-6">A matéria solicitada não foi encontrada.</p>
            <Link href="/">
              <Button size="sm" className="h-7 xs:h-8 sm:h-9">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Início
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2 xs:p-3 sm:p-4">
        <div className="max-w-4xl mx-auto space-y-3 xs:space-y-4 sm:space-y-6">
          <BottomNav active="home" />
          <Skeleton className="h-16 xs:h-20 sm:h-24 w-full" />
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 xs:gap-3 sm:gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-16 xs:h-20 sm:h-24" />
            ))}
          </div>
          <Skeleton className="h-32 xs:h-40 sm:h-48 w-full" />
        </div>
      </div>
    )
  }

  const completedTopics = Math.floor(Math.random() * subject.topics.length)
  const progressPercentage = (completedTopics / subject.topics.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2 xs:p-3 sm:p-4">
      <div className="max-w-4xl mx-auto space-y-3 xs:space-y-4 sm:space-y-6">
        <BottomNav active="home" />

        {/* Back Button */}
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Voltar
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-4">
          <div className="space-y-1 xs:space-y-2">
            <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight break-words">
              {subject.name}
            </h1>
            <div className="flex flex-wrap items-center gap-1 xs:gap-2 text-xs xs:text-sm text-gray-600">
              <span className="truncate">{subject.year}º Ano</span>
              <span>•</span>
              <span>{subject.topics.length} tópicos</span>
              <span>•</span>
              <span className="capitalize">{subject.description.split(" ").slice(0, 3).join(" ")}</span>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs px-1.5 py-0.5 xs:px-2 xs:py-1 w-fit">
            {subject.year}º Ano
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 xs:gap-3 sm:gap-4">
          <Card className="p-2 xs:p-3 sm:p-4">
            <div className="flex items-center gap-1 xs:gap-2">
              <BookOpen className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5 text-blue-600" />
              <div>
                <p className="text-xs xs:text-sm font-medium">{subject.topics.length}</p>
                <p className="text-xs text-gray-600">Tópicos</p>
              </div>
            </div>
          </Card>

          <Card className="p-2 xs:p-3 sm:p-4">
            <div className="flex items-center gap-1 xs:gap-2">
              <Clock className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5 text-green-600" />
              <div>
                <p className="text-xs xs:text-sm font-medium">{subject.year}º Ano</p>
                <p className="text-xs text-gray-600">Período</p>
              </div>
            </div>
          </Card>

          <Card className="p-2 xs:p-3 sm:p-4">
            <div className="flex items-center gap-1 xs:gap-2">
              <Award className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5 text-yellow-600" />
              <div>
                <p className="text-xs xs:text-sm font-medium">{subject.objectives.length}</p>
                <p className="text-xs text-gray-600">Objetivos</p>
              </div>
            </div>
          </Card>

          <Card className="p-2 xs:p-3 sm:p-4">
            <div className="flex items-center gap-1 xs:gap-2">
              <CheckCircle className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5 text-purple-600" />
              <div>
                <p className="text-xs xs:text-sm font-medium">{Math.round(progressPercentage)}%</p>
                <p className="text-xs text-gray-600">Progresso</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-3 xs:space-y-4">
          <TabsList className="grid w-full grid-cols-4 h-auto">
            <TabsTrigger value="overview" className="text-xs xs:text-sm px-2 py-2">
              <span className="xs:hidden">V</span>
              <span className="hidden xs:inline sm:hidden">Visão</span>
              <span className="hidden sm:inline">Visão Geral</span>
            </TabsTrigger>
            <TabsTrigger value="topics" className="text-xs xs:text-sm px-2 py-2">
              <span className="xs:hidden">T</span>
              <span className="hidden xs:inline sm:hidden">Tóp.</span>
              <span className="hidden sm:inline">Tópicos</span>
            </TabsTrigger>
            <TabsTrigger value="activities" className="text-xs xs:text-sm px-2 py-2">
              <span className="xs:hidden">A</span>
              <span className="hidden xs:inline sm:hidden">Ativ.</span>
              <span className="hidden sm:inline">Atividades</span>
            </TabsTrigger>
            <TabsTrigger value="resources" className="text-xs xs:text-sm px-2 py-2">
              <span className="xs:hidden">R</span>
              <span className="hidden xs:inline sm:hidden">Rec.</span>
              <span className="hidden sm:inline">Recursos</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-3 xs:space-y-4">
            <Card>
              <CardHeader className="p-2 xs:p-3 sm:p-4">
                <CardTitle className="text-sm xs:text-base sm:text-lg">Descrição</CardTitle>
              </CardHeader>
              <CardContent className="p-2 xs:p-3 sm:p-4 pt-0">
                <p className="text-xs xs:text-sm text-gray-700 leading-relaxed">{subject.description}</p>
              </CardContent>
            </Card>

            <div className="grid gap-3 xs:gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="p-2 xs:p-3 sm:p-4">
                  <CardTitle className="text-sm xs:text-base flex items-center gap-1 xs:gap-2">
                    <Target className="h-3 w-3 xs:h-4 xs:w-4" />
                    Objetivos
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 xs:p-3 sm:p-4 pt-0">
                  <ul className="space-y-1 xs:space-y-2">
                    {subject.objectives.map((objective, index) => (
                      <li key={index} className="text-xs xs:text-sm text-gray-700 flex items-start gap-1 xs:gap-2">
                        <CheckCircle className="h-3 w-3 xs:h-4 xs:w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="break-words">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-2 xs:p-3 sm:p-4">
                  <CardTitle className="text-sm xs:text-base flex items-center gap-1 xs:gap-2">
                    <GraduationCap className="h-3 w-3 xs:h-4 xs:w-4" />
                    Pré-requisitos
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 xs:p-3 sm:p-4 pt-0">
                  {subject.prerequisites && subject.prerequisites.length > 0 ? (
                    <div className="flex flex-wrap gap-1 xs:gap-2">
                      {subject.prerequisites.map((prereq, index) => (
                        <Badge key={index} variant="outline" className="text-xs px-1.5 py-0.5">
                          {prereq}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs xs:text-sm text-gray-500 italic">Nenhum pré-requisito</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="topics" className="space-y-3 xs:space-y-4">
            <div className="space-y-2 xs:space-y-3">
              {subject.topics.map((topic, index) => (
                <Card key={topic.id}>
                  <CardHeader className="p-2 xs:p-3 sm:p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <CardTitle className="text-sm xs:text-base break-words">
                          {index + 1}. {topic.title}
                        </CardTitle>
                        <CardDescription className="text-xs xs:text-sm break-words">
                          {topic.description}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          topic.difficulty === "easy"
                            ? "default"
                            : topic.difficulty === "medium"
                              ? "secondary"
                              : "destructive"
                        }
                        className="text-xs px-1.5 py-0.5 flex-shrink-0"
                      >
                        {topic.difficulty === "easy" ? "Fácil" : topic.difficulty === "medium" ? "Médio" : "Difícil"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-2 xs:p-3 sm:p-4 pt-0">
                    <div className="flex items-center gap-1 xs:gap-2 mb-2">
                      <Progress value={Math.random() * 100} className="flex-1 h-1 xs:h-2" />
                      <span className="text-xs text-gray-600 w-8 xs:w-12">{Math.round(Math.random() * 100)}%</span>
                    </div>
                    {topic.content && (
                      <p className="text-xs xs:text-sm text-gray-600 mb-2 line-clamp-2">{topic.content}</p>
                    )}
                    <div className="flex flex-wrap gap-1 xs:gap-2">
                      <Button size="sm" variant="outline" className="h-6 xs:h-7 text-xs px-2 bg-transparent">
                        <FileText className="h-3 w-3 mr-1" />
                        Teoria
                      </Button>
                      <Button size="sm" variant="outline" className="h-6 xs:h-7 text-xs px-2 bg-transparent">
                        <Calculator className="h-3 w-3 mr-1" />
                        Prática
                      </Button>
                      <Button size="sm" variant="outline" className="h-6 xs:h-7 text-xs px-2 bg-transparent">
                        <Video className="h-3 w-3 mr-1" />
                        Vídeos
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activities" className="space-y-3 xs:space-y-4">
            <div className="grid gap-2 xs:gap-3 xs:grid-cols-2 md:grid-cols-4">
              <Link href={`/flashcards?subject=${subject.id}`}>
                <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-2 xs:p-3 sm:p-4 text-center">
                    <BookOpen className="h-6 w-6 xs:h-8 xs:w-8 mx-auto mb-1 xs:mb-2 text-blue-600" />
                    <h3 className="text-xs xs:text-sm font-medium mb-1">Flashcards</h3>
                    <p className="text-xs text-gray-600">Memorização ativa</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href={`/quiz?subject=${subject.id}`}>
                <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-2 xs:p-3 sm:p-4 text-center">
                    <CheckCircle className="h-6 w-6 xs:h-8 xs:w-8 mx-auto mb-1 xs:mb-2 text-green-600" />
                    <h3 className="text-xs xs:text-sm font-medium mb-1">Questionários</h3>
                    <p className="text-xs text-gray-600">Teste seus conhecimentos</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href={`/review/games?subject=${subject.id}`}>
                <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-2 xs:p-3 sm:p-4 text-center">
                    <Gamepad2 className="h-6 w-6 xs:h-8 xs:w-8 mx-auto mb-1 xs:mb-2 text-purple-600" />
                    <h3 className="text-xs xs:text-sm font-medium mb-1">Jogos</h3>
                    <p className="text-xs text-gray-600">Aprendizado divertido</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href={`/study/summaries?subject=${subject.id}`}>
                <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-2 xs:p-3 sm:p-4 text-center">
                    <FileText className="h-6 w-6 xs:h-8 xs:w-8 mx-auto mb-1 xs:mb-2 text-orange-600" />
                    <h3 className="text-xs xs:text-sm font-medium mb-1">Teoria</h3>
                    <p className="text-xs text-gray-600">Conteúdo detalhado</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href={`/study/video?subject=${subject.id}`} className="xs:col-span-2">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-2 xs:p-3 sm:p-4 text-center">
                    <PlayCircle className="h-6 w-6 xs:h-8 xs:w-8 mx-auto mb-1 xs:mb-2 text-red-600" />
                    <h3 className="text-xs xs:text-sm font-medium mb-1">Vídeo Aulas</h3>
                    <p className="text-xs text-gray-600">Explicações visuais</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href={`/review/simuladores?subject=${subject.id}`} className="xs:col-span-2">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-2 xs:p-3 sm:p-4 text-center">
                    <Zap className="h-6 w-6 xs:h-8 xs:w-8 mx-auto mb-1 xs:mb-2 text-yellow-600" />
                    <h3 className="text-xs xs:text-sm font-medium mb-1">Simuladores</h3>
                    <p className="text-xs text-gray-600">Prática interativa</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-3 xs:space-y-4">
            <Card>
              <CardHeader className="p-2 xs:p-3 sm:p-4">
                <CardTitle className="text-sm xs:text-base">Recursos de Estudo</CardTitle>
              </CardHeader>
              <CardContent className="p-2 xs:p-3 sm:p-4 pt-0">
                <div className="grid gap-3 xs:gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="text-xs xs:text-sm font-medium mb-2">Materiais Teóricos</h4>
                    <ul className="space-y-1 text-xs xs:text-sm text-gray-600">
                      <li>• Resumos dos tópicos</li>
                      <li>• Mapas mentais</li>
                      <li>• Fórmulas essenciais</li>
                      <li>• Exemplos práticos</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs xs:text-sm font-medium mb-2">Atividades Práticas</h4>
                    <ul className="space-y-1 text-xs xs:text-sm text-gray-600">
                      <li>• Exercícios resolvidos</li>
                      <li>• Simulações interativas</li>
                      <li>• Projetos práticos</li>
                      <li>• Laboratórios virtuais</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-2 xs:p-3 sm:p-4">
                <CardTitle className="text-sm xs:text-base">Estatísticas de Progresso</CardTitle>
              </CardHeader>
              <CardContent className="p-2 xs:p-3 sm:p-4 pt-0">
                <div className="space-y-2 xs:space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs xs:text-sm text-gray-700">Tópicos Concluídos</span>
                    <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                      {completedTopics}/{subject.topics.length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs xs:text-sm text-gray-700">Progresso Geral</span>
                    <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                      {Math.round(progressPercentage)}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs xs:text-sm text-gray-700">Tempo Estimado</span>
                    <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                      {subject.topics.length * 2}h
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
