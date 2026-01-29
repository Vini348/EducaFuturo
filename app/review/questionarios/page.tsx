"use client"

import { useState } from "react"
import { TopNav } from "@/components/top-nav"
import { BottomNav } from "@/components/bottom-nav"
import { quizzes, getQuizStats } from "@/data/quizzes"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, ArrowLeft, Star, BookOpen, Clock, Trophy, Filter, GraduationCap, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function QuestionariosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const router = useRouter()

  const stats = getQuizStats()

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch =
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.subjectName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesYear = selectedYear === null || quiz.year === selectedYear

    return matchesSearch && matchesYear
  })

  const quizzesByYear = {
    1: filteredQuizzes.filter((quiz) => quiz.year === 1),
    2: filteredQuizzes.filter((quiz) => quiz.year === 2),
    3: filteredQuizzes.filter((quiz) => quiz.year === 3),
  }

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return "bg-green-100 text-green-700 border-green-200"
      case 2:
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case 3:
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getDifficultyText = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return "Fácil"
      case 2:
        return "Médio"
      case 3:
        return "Difícil"
      default:
        return "N/A"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "digital":
        return "bg-blue-50 border-blue-200 hover:bg-blue-100"
      case "analog":
        return "bg-green-50 border-green-200 hover:bg-green-100"
      case "power":
        return "bg-orange-50 border-orange-200 hover:bg-orange-100"
      default:
        return "bg-gray-50 border-gray-200 hover:bg-gray-100"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "digital":
        return "💻"
      case "analog":
        return "⚡"
      case "power":
        return "🔋"
      default:
        return "📚"
    }
  }

  const getYearColor = (year: number) => {
    switch (year) {
      case 1:
        return "bg-blue-100 text-blue-800 border-blue-200"
      case 2:
        return "bg-purple-100 text-purple-800 border-purple-200"
      case 3:
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const renderQuizCard = (quiz: any) => (
    <motion.div
      key={quiz.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="h-full"
    >
      <Card
        className={`group cursor-pointer transition-all duration-300 hover:shadow-xl border-2 ${getCategoryColor(quiz.category)} backdrop-blur-sm h-full flex flex-col`}
        onClick={() => router.push(`/review/questionarios/${quiz.id}`)}
      >
        <CardHeader className="pb-3 flex-shrink-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getCategoryIcon(quiz.category)}</span>
              <Badge variant="outline" className="text-xs font-medium">
                {quiz.subjectName}
              </Badge>
            </div>
            <div className="flex flex-col gap-1">
              <Badge className={`text-xs font-medium border ${getDifficultyColor(quiz.difficulty)}`} variant="outline">
                {getDifficultyText(quiz.difficulty)}
              </Badge>
              <Badge className={`text-xs font-medium border ${getYearColor(quiz.year)}`} variant="outline">
                {quiz.year}º Ano
              </Badge>
            </div>
          </div>
          <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
            {quiz.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-0 flex-1 flex flex-col">
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed flex-1">{quiz.description}</p>

          <div className="space-y-3 mt-auto">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span className="font-medium">{quiz.questions.length} questões</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{Math.ceil((quiz.timeLimit || 900) / 60)} min</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                <span>{quiz.passingScore}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 transition-colors ${
                      i < quiz.difficulty ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <div className="flex flex-wrap gap-1">
                {quiz.tags.slice(0, 2).map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {quiz.tags.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{quiz.tags.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  const renderEmptyState = (message: string) => (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <BookOpen className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum questionário encontrado</h3>
      <p className="text-gray-500 max-w-md">{message}</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-16">
      <TopNav />

      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-blue-100 transition-colors"
              onClick={() => router.back()}
              aria-label="Voltar"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Questionários
              </h1>
              <p className="text-gray-600 mt-1">
                Teste seus conhecimentos com {stats.totalQuizzes} questionários de todas as matérias
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
              <Trophy className="w-4 h-4" />
              <span>Desafie-se!</span>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Buscar questionários..."
                className="pl-10 bg-white/70 border-gray-200 focus:border-blue-300 focus:ring-blue-200 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedYear === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedYear(null)}
                className="whitespace-nowrap"
              >
                Todos os Anos
              </Button>
              {[1, 2, 3].map((year) => (
                <Button
                  key={year}
                  variant={selectedYear === year ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedYear(year)}
                  className="whitespace-nowrap"
                >
                  {year}º Ano
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Total</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{filteredQuizzes.length}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">1º Ano</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{quizzesByYear[1].length}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">2º Ano</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">{quizzesByYear[2].length}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-gray-600">3º Ano</span>
            </div>
            <div className="text-2xl font-bold text-red-600">{quizzesByYear[3].length}</div>
          </motion.div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList className="bg-white/70 backdrop-blur-sm border border-gray-200 p-1">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all"
              >
                <Filter className="w-4 h-4 mr-2" />
                Todos ({filteredQuizzes.length})
              </TabsTrigger>
              <TabsTrigger
                value="year1"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all"
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                1º Ano ({quizzesByYear[1].length})
              </TabsTrigger>
              <TabsTrigger
                value="year2"
                className="data-[state=active]:bg-purple-500 data-[state=active]:text-white transition-all"
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                2º Ano ({quizzesByYear[2].length})
              </TabsTrigger>
              <TabsTrigger
                value="year3"
                className="data-[state=active]:bg-red-500 data-[state=active]:text-white transition-all"
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                3º Ano ({quizzesByYear[3].length})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.length > 0
              ? filteredQuizzes.map(renderQuizCard)
              : renderEmptyState("Tente ajustar os filtros ou termos de busca para encontrar questionários.")}
          </TabsContent>

          <TabsContent value="year1" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzesByYear[1].length > 0
              ? quizzesByYear[1].map(renderQuizCard)
              : renderEmptyState("Nenhum questionário do 1º ano encontrado com os filtros atuais.")}
          </TabsContent>

          <TabsContent value="year2" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzesByYear[2].length > 0
              ? quizzesByYear[2].map(renderQuizCard)
              : renderEmptyState("Nenhum questionário do 2º ano encontrado com os filtros atuais.")}
          </TabsContent>

          <TabsContent value="year3" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzesByYear[3].length > 0
              ? quizzesByYear[3].map(renderQuizCard)
              : renderEmptyState("Nenhum questionário do 3º ano encontrado com os filtros atuais.")}
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav active="review" />
    </div>
  )
}
