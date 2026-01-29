"use client"

import { useState, useCallback } from "react"
import { Search, SortAsc, SortDesc, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { SubjectCard } from "@/components/subject-card"
import { Cpu, Brain, Zap } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLocalStorage } from "@/hooks/use-local-storage"

// Expanded subjects data with subcategories
const initialSubjects = [
  {
    id: 1,
    category: "Eletrônica Digital",
    icon: Cpu,
    className: "bg-[#4F46E5]",
    topics: [
      { title: "Fundamentos de Portas Lógicas", progress: 0, total: 15, icon: Cpu },
      { title: "Circuitos Sequenciais", progress: 0, total: 15, icon: Cpu },
      { title: "Máquinas de Estado", progress: 0, total: 15, icon: Cpu },
    ],
  },
  {
    id: 2,
    category: "Eletrônica Analógica",
    icon: Brain,
    className: "bg-[#9333EA]",
    topics: [
      { title: "Amplificadores Operacionais", progress: 0, total: 15, icon: Brain },
      { title: "Filtros Analógicos", progress: 0, total: 15, icon: Brain },
      { title: "Osciladores", progress: 0, total: 15, icon: Brain },
    ],
  },
  {
    id: 3,
    category: "Eletrônica de Potência",
    icon: Zap,
    className: "bg-[#FF6B00]",
    topics: [
      { title: "Conversores DC-DC", progress: 0, total: 15, icon: Zap },
      { title: "Inversores", progress: 0, total: 15, icon: Zap },
      { title: "Retificadores", progress: 0, total: 15, icon: Zap },
    ],
  },
]

type SortOption = "name-asc" | "name-desc" | "progress-high" | "progress-low"

export function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOption, setSortOption] = useState<SortOption>("name-asc")
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [favorites, setFavorites] = useLocalStorage<number[]>("favorite-subjects", [])
  const [subjects, setSubjects] = useState(initialSubjects)

  const toggleFavorite = (subjectId: number) => {
    setFavorites((prev) => (prev.includes(subjectId) ? prev.filter((id) => id !== subjectId) : [...prev, subjectId]))
  }

  const sortSubjects = (subjects: typeof initialSubjects) => {
    return [...subjects].sort((a, b) => {
      switch (sortOption) {
        case "name-asc":
          return a.category.localeCompare(b.category)
        case "name-desc":
          return b.category.localeCompare(a.category)
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
    let filtered = [...subjects]

    // Apply search filter
    if (searchTerm) {
      const normalizedTerm = searchTerm.toLowerCase()
      filtered = filtered.filter((subject) => {
        const categoryMatch = subject.category.toLowerCase().includes(normalizedTerm)
        const topicsMatch = subject.topics.some((topic) => topic.title.toLowerCase().includes(normalizedTerm))
        return categoryMatch || topicsMatch
      })
    }

    // Apply favorites filter
    if (showFavoritesOnly) {
      filtered = filtered.filter((subject) => favorites.includes(subject.id))
    }

    // Apply sorting
    return sortSubjects(filtered)
  }, [searchTerm, sortOption, showFavoritesOnly, favorites, subjects])

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
              <Button variant="outline" className="flex-shrink-0">
                {sortOption === "name-asc" && <SortAsc className="h-4 w-4 mr-2" />}
                {sortOption === "name-desc" && <SortDesc className="h-4 w-4 mr-2" />}
                Ordenar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortOption("name-asc")}>Nome (A-Z)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption("name-desc")}>Nome (Z-A)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption("progress-high")}>
                Progresso (Maior-Menor)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption("progress-low")}>Progresso (Menor-Maior)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="space-y-4">
        {filteredSubjects.map((subject) => (
          <div key={subject.category} className="flex gap-4 items-center">
            <Button variant="ghost" size="icon" onClick={() => toggleFavorite(subject.id)} className="flex-shrink-0">
              <Star className={`h-4 w-4 ${favorites.includes(subject.id) ? "fill-yellow-400 text-yellow-400" : ""}`} />
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
