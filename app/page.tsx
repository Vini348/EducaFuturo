"use client"
 
import { useState, useEffect, useCallback } from "react"
import { TopNav } from "@/components/top-nav"
import { BottomNav } from "@/components/bottom-nav"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/authContext"
import {
  Cpu,
  Brain,
  Zap,
  Search,
  Calculator,
  Atom,
  Cog,
  Monitor,
  Home,
  Code,
  Wifi,
  Wrench,
  Settings,
} from "lucide-react"
import Link from "next/link"
import { useLocalStorage } from "@/lib/useLocalStorage"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SortAsc, SortDesc, Star } from "lucide-react"
import { SubjectCard } from "@/components/subject-card"
import { DailyChallenges } from "@/components/daily-challenges"
import { curriculumData } from "@/data/subjects-curriculum"

type SortOption = "name-asc" | "name-desc" | "progress-high" | "progress-low" | "year-asc"

// Mapeamento de ícones
const iconMap = {
  Zap,
  Calculator,
  Atom,
  Cog,
  Monitor,
  Home,
  Code,
  Wifi,
  Wrench,
  Settings,
  Cpu,
  Brain,
}

// Converter dados do currículo para o formato esperado
const curriculumSubjects = curriculumData.map((subject) => ({
  id: subject.id,
  category: `${subject.name} - ${subject.year}º Ano`,
  icon: iconMap[subject.icon as keyof typeof iconMap] || Cpu,
  className: subject.color,
  year: subject.year,
  topics: subject.topics.map((topic) => ({
    title: topic.title,
    progress: 0,
    total: 10, // Valor padrão para progresso
  })),
}))

export default function HomePage() {
  const { user } = useAuth()
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      setUserName(user.user_metadata.full_name)
    } else {
      setUserName(null)
    }
  }, [user])

  function SearchSection() {
    const [searchTerm, setSearchTerm] = useState("")
    const [sortOption, setSortOption] = useState<SortOption>("year-asc")
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
    const [selectedYear, setSelectedYear] = useState<number | "all">("all")
    const [favorites, setFavorites] = useLocalStorage<string[]>("favorite-subjects", [])

    const toggleFavorite = (subjectId: string) => {
      setFavorites((prev) => (prev.includes(subjectId) ? prev.filter((id) => id !== subjectId) : [...prev, subjectId]))
    }

    const sortSubjects = (subjects: typeof curriculumSubjects) => {
      return [...subjects].sort((a, b) => {
        switch (sortOption) {
          case "name-asc":
            return a.category.localeCompare(b.category)
          case "name-desc":
            return b.category.localeCompare(a.category)
          case "year-asc":
            return a.year - b.year
          case "progress-high":
            const progressA =
              ((a.topics?.reduce((acc, topic) => acc + topic.progress, 0) ?? 0) /
                (a.topics?.reduce((acc, topic) => acc + topic.total, 0) ?? 1)) *
              100
            const progressB =
              ((b.topics?.reduce((acc, topic) => acc + topic.progress, 0) ?? 0) /
                (b.topics?.reduce((acc, topic) => acc + topic.total, 0) ?? 1)) *
              100
            return progressB - progressA
          case "progress-low":
            const progressC =
              ((a.topics?.reduce((acc, topic) => acc + topic.progress, 0) ?? 0) /
                (a.topics?.reduce((acc, topic) => acc + topic.total, 0) ?? 1)) *
              100
            const progressD =
              ((b.topics?.reduce((acc, topic) => acc + topic.progress, 0) ?? 0) /
                (b.topics?.reduce((acc, topic) => acc + topic.total, 0) ?? 1)) *
              100
            return progressC - progressD
          default:
            return 0
        }
      })
    }

    const filterAndSortSubjects = useCallback(() => {
      let filtered = [...curriculumSubjects]

      // Filtro por ano
      if (selectedYear !== "all") {
        filtered = filtered.filter((subject) => subject.year === selectedYear)
      }

      // Filtro de busca
      if (searchTerm) {
        const normalizedTerm = searchTerm.toLowerCase()
        filtered = filtered.filter((subject) => {
          const categoryMatch = subject.category.toLowerCase().includes(normalizedTerm)
          const topicsMatch = subject.topics.some((topic) => topic.title.toLowerCase().includes(normalizedTerm))
          return categoryMatch || topicsMatch
        })
      }

      // Filtro de favoritos
      if (showFavoritesOnly) {
        filtered = filtered.filter((subject) => favorites.includes(subject.id))
      }

      return sortSubjects(filtered)
    }, [searchTerm, sortOption, showFavoritesOnly, favorites, selectedYear])

    const filteredSubjects = filterAndSortSubjects()

    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Input
              type="search"
              placeholder="Pesquisar matérias..."
              className="w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value === "all" ? "all" : Number.parseInt(e.target.value))}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="all">Todos os anos</option>
              <option value={1}>1º Ano</option>
              <option value={2}>2º Ano</option>
              <option value={3}>3º Ano</option>
            </select>
            <Button
              variant={showFavoritesOnly ? "default" : "outline"}
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className="flex-shrink-0"
            >
              <Star className="h-4 w-4 mr-2" />
              Favoritos
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex-shrink-0 bg-transparent">
                  {sortOption === "name-asc" && <SortAsc className="h-4 w-4 mr-2" />}
                  {sortOption === "name-desc" && <SortDesc className="h-4 w-4 mr-2" />}
                  Ordenar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortOption("year-asc")}>Por Ano</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("name-asc")}>Nome (A-Z)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("name-desc")}>Nome (Z-A)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("progress-high")}>
                  Progresso (Maior-Menor)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("progress-low")}>
                  Progresso (Menor-Maior)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="space-y-4">
          {filteredSubjects.map((subject) => (
            <div key={subject.id} className="flex gap-4 items-center">
              <Button variant="ghost" size="icon" onClick={() => toggleFavorite(subject.id)} className="flex-shrink-0">
                <Star
                  className={`h-4 w-4 ${favorites.includes(subject.id) ? "fill-yellow-400 text-yellow-400" : ""}`}
                />
              </Button>
              <Link href={`/subjects/${subject.id}`} className="flex-1">
                <SubjectCard
                  icon={subject.icon}
                  title={subject.category}
                  progress={subject.topics?.reduce((acc, topic) => acc + topic.progress, 0) ?? 0}
                  total={subject.topics?.reduce((acc, topic) => acc + topic.total, 0) ?? 0}
                  className={`${subject.className} cursor-pointer transition-all w-full`}
                />
              </Link>
            </div>
          ))}
          {filteredSubjects.length === 0 && (
            <div className="text-center py-8 text-gray-500">Nenhuma matéria encontrada</div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      <TopNav />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-900 dark:to-indigo-900 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-4">Olá, {userName || "Visitante"}!</h1>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso geral</span>
              <span>0%</span>
            </div>
            <Progress value={0} className="bg-white/20" />
          </div>
          {!user && (
            <Link href="/login">
              <Button className="w-full mt-4 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white">Entrar</Button>
            </Link>
          )}
        </div>

        <SearchSection />
        <div className="mt-6">
          <DailyChallenges />
        </div>
      </main>

      <BottomNav active="home" />
    </div>
  )
}
