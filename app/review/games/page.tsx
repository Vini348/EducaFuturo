"use client"

import { useState, useMemo } from "react"
import { TopNav } from "@/components/top-nav"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  ExternalLink,
  Search,
  Clock,
  Trophy,
  Filter,
  Gamepad2,
  Brain,
  Zap,
  Target,
  Puzzle,
  Users,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ComponentMatchingGame } from "@/components/component-matching-game"
import { CircuitBuilderGame } from "@/components/circuit-builder-game"
import { LogicGateSimulator } from "@/components/logic-gate-simulator"
import { ElectronicQuizGame } from "@/components/electronic-quiz-game"
import { MemoryMatchGame } from "@/components/memory-match-game"
import { curriculumGames, searchGames, getGameStats, getRecommendedGames } from "@/data/games-curriculum"

const externalGames = [
  {
    title: "Portas Lógicas Interativas",
    description: "Aprenda sobre portas lógicas de forma interativa com simulações",
    url: "https://www.silvergames.com/br/logic-gates",
    category: "Eletrônica Digital",
    difficulty: "medium",
  },
  {
    title: "Símbolos de Circuitos",
    description: "Relacione palavras aos seus símbolos e pictogramas eletrônicos",
    url: "https://wordwall.net/pt/resource/35149267/f%c3%adsica/relacione-a-palavra-aos-seus-s%c3%admbolos-pictogramas-de",
    category: "Circuitos",
    difficulty: "easy",
  },
  {
    title: "Elementos da Protoboard",
    description: "Aprenda sobre os principais elementos da placa de prototipagem",
    url: "https://wordwall.net/pt/resource/37235351/physics/os-principais-elementos-da-placa-de-prototipagem",
    category: "Eletrônica Prática",
    difficulty: "easy",
  },
  {
    title: "Simulador de Circuitos Falstad",
    description: "Simulador online completo para circuitos eletrônicos",
    url: "https://www.falstad.com/circuit/",
    category: "Simulação",
    difficulty: "hard",
  },
  {
    title: "Khan Academy - Circuitos",
    description: "Curso interativo sobre análise de circuitos elétricos",
    url: "https://pt.khanacademy.org/science/electrical-engineering",
    category: "Educação",
    difficulty: "medium",
  },
]

const typeIcons = {
  memory: Brain,
  quiz: Target,
  simulation: Zap,
  matching: Users,
  puzzle: Puzzle,
  strategy: Gamepad2,
}

const difficultyColors = {
  easy: "bg-green-100 text-green-800 border-green-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  hard: "bg-red-100 text-red-800 border-red-200",
}

const yearColors = {
  1: "bg-blue-100 text-blue-800 border-blue-200",
  2: "bg-purple-100 text-purple-800 border-purple-200",
  3: "bg-orange-100 text-orange-800 border-orange-200",
}

export default function GamesPage() {
  const [activeTab, setActiveTab] = useState("curriculum")
  const [activeGame, setActiveGame] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedSubject, setSelectedSubject] = useState<string>("all")

  const gameStats = useMemo(() => getGameStats(), [])

  const filteredGames = useMemo(() => {
    let games = curriculumGames

    if (searchQuery) {
      games = searchGames(searchQuery)
    }

    if (selectedYear !== "all") {
      games = games.filter((game) => game.year === Number.parseInt(selectedYear))
    }

    if (selectedDifficulty !== "all") {
      games = games.filter((game) => game.difficulty === selectedDifficulty)
    }

    if (selectedType !== "all") {
      games = games.filter((game) => game.type === selectedType)
    }

    if (selectedSubject !== "all") {
      games = games.filter((game) => game.subject === selectedSubject)
    }

    return games
  }, [searchQuery, selectedYear, selectedDifficulty, selectedType, selectedSubject])

  const uniqueSubjects = useMemo(() => {
    const subjects = [...new Set(curriculumGames.map((game) => game.subject))]
    return subjects.sort()
  }, [])

  const recommendedGames = useMemo(() => {
    return getRecommendedGames(2, 6) // Jogos recomendados do 2º ano
  }, [])

  const renderSelectedGame = () => {
    try {
      switch (activeGame) {
        case "component-matching":
          return <ComponentMatchingGame />
        case "circuit-builder":
          return <CircuitBuilderGame />
        case "logic-gate":
          return <LogicGateSimulator />
        case "electronic-quiz":
          return <ElectronicQuizGame />
        case "memory-match":
          return <MemoryMatchGame />
        default:
          return (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Card
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-300"
                  onClick={() => setActiveGame("component-matching")}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Jogo de Correspondência</CardTitle>
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Combine os nomes dos componentes eletrônicos com seus símbolos correspondentes.
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-green-100 text-green-800">Fácil</Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        15 min
                      </div>
                    </div>
                    <Button className="w-full mt-4">Jogar Agora</Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Card
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-300"
                  onClick={() => setActiveGame("circuit-builder")}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Construtor de Circuitos</CardTitle>
                      <Zap className="h-6 w-6 text-yellow-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Monte circuitos eletrônicos organizando os componentes na ordem correta.
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-yellow-100 text-yellow-800">Médio</Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        25 min
                      </div>
                    </div>
                    <Button className="w-full mt-4">Jogar Agora</Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Card
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-300"
                  onClick={() => setActiveGame("logic-gate")}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Simulador de Portas Lógicas</CardTitle>
                      <Zap className="h-6 w-6 text-purple-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Aprenda e pratique o funcionamento das portas lógicas em circuitos digitais.
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-yellow-100 text-yellow-800">Médio</Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        20 min
                      </div>
                    </div>
                    <Button className="w-full mt-4">Jogar Agora</Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Card
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-300"
                  onClick={() => setActiveGame("electronic-quiz")}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Quiz de Eletrônica</CardTitle>
                      <Target className="h-6 w-6 text-green-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Teste seus conhecimentos em eletrônica com perguntas de múltipla escolha.
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-yellow-100 text-yellow-800">Médio</Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        18 min
                      </div>
                    </div>
                    <Button className="w-full mt-4">Jogar Agora</Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Card
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-300"
                  onClick={() => setActiveGame("memory-match")}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Jogo da Memória</CardTitle>
                      <Brain className="h-6 w-6 text-pink-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Encontre os pares de componentes eletrônicos idênticos neste jogo da memória.
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-green-100 text-green-800">Fácil</Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        12 min
                      </div>
                    </div>
                    <Button className="w-full mt-4">Jogar Agora</Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )
      }
    } catch (error) {
      return (
        <div className="text-center p-8">
          <p className="text-red-600">Erro ao carregar o jogo. Tente novamente.</p>
          <Button onClick={() => setActiveGame(null)} className="mt-4">
            Voltar aos jogos
          </Button>
        </div>
      )
    }
  }

  const renderGameCard = (game: any) => {
    const TypeIcon = typeIcons[game.type as keyof typeof typeIcons] || Gamepad2

    return (
      <motion.div
        key={game.id}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="h-full hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-300">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{game.icon}</span>
                  <Badge className={yearColors[game.year as keyof typeof yearColors]}>{game.year}º Ano</Badge>
                </div>
                <CardTitle className="text-lg leading-tight">{game.title}</CardTitle>
              </div>
              <TypeIcon className="h-6 w-6 text-gray-400 flex-shrink-0" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{game.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Matéria:</span>
                <span className="font-medium">{game.subject}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Categoria:</span>
                <span className="font-medium">{game.category}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <Badge className={difficultyColors[game.difficulty as keyof typeof difficultyColors]}>
                {game.difficulty === "easy" ? "Fácil" : game.difficulty === "medium" ? "Médio" : "Difícil"}
              </Badge>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {game.estimatedTime}min
                </div>
                <div className="flex items-center">
                  <Trophy className="h-4 w-4 mr-1" />
                  {game.points}pts
                </div>
              </div>
            </div>

            <Button className="w-full" size="sm" onClick={() => (window.location.href = `/review/games/${game.id}`)}>
              Jogar Agora
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-16">
      <TopNav />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/review">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Jogos Educativos
            </h1>
            <p className="text-gray-600 mt-1">Aprenda brincando com jogos interativos</p>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-blue-600">{gameStats.totalGames}</div>
              <div className="text-sm text-gray-600">Total de Jogos</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-green-600">{gameStats.gamesByDifficulty.easy}</div>
              <div className="text-sm text-gray-600">Jogos Fáceis</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-yellow-600">{gameStats.gamesByDifficulty.medium}</div>
              <div className="text-sm text-gray-600">Jogos Médios</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-red-600">{gameStats.gamesByDifficulty.hard}</div>
              <div className="text-sm text-gray-600">Jogos Difíceis</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="curriculum">Jogos do Currículo</TabsTrigger>
            <TabsTrigger value="internal">Jogos Internos</TabsTrigger>
            <TabsTrigger value="external">Jogos Externos</TabsTrigger>
          </TabsList>

          <TabsContent value="curriculum" className="space-y-6">
            {/* Filtros */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar jogos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="Ano" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Anos</SelectItem>
                      <SelectItem value="1">1º Ano</SelectItem>
                      <SelectItem value="2">2º Ano</SelectItem>
                      <SelectItem value="3">3º Ano</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Dificuldade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="easy">Fácil</SelectItem>
                      <SelectItem value="medium">Médio</SelectItem>
                      <SelectItem value="hard">Difícil</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Tipos</SelectItem>
                      <SelectItem value="memory">Memória</SelectItem>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="simulation">Simulação</SelectItem>
                      <SelectItem value="matching">Associação</SelectItem>
                      <SelectItem value="puzzle">Puzzle</SelectItem>
                      <SelectItem value="strategy">Estratégia</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Matéria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as Matérias</SelectItem>
                      {uniqueSubjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Jogos Recomendados */}
            {!searchQuery &&
              selectedYear === "all" &&
              selectedDifficulty === "all" &&
              selectedType === "all" &&
              selectedSubject === "all" && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    Jogos Recomendados
                  </h2>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{recommendedGames.map(renderGameCard)}</div>
                </div>
              )}

            {/* Lista de Jogos Filtrados */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  {filteredGames.length} {filteredGames.length === 1 ? "Jogo Encontrado" : "Jogos Encontrados"}
                </h2>
                {(searchQuery ||
                  selectedYear !== "all" ||
                  selectedDifficulty !== "all" ||
                  selectedType !== "all" ||
                  selectedSubject !== "all") && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedYear("all")
                      setSelectedDifficulty("all")
                      setSelectedType("all")
                      setSelectedSubject("all")
                    }}
                  >
                    Limpar Filtros
                  </Button>
                )}
              </div>

              {filteredGames.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Gamepad2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhum jogo encontrado</h3>
                    <p className="text-gray-500">Tente ajustar os filtros para encontrar jogos.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{filteredGames.map(renderGameCard)}</div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="internal">
            <div className="space-y-8">
              {activeGame && (
                <Button variant="outline" onClick={() => setActiveGame(null)} className="mb-4">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para todos os jogos
                </Button>
              )}
              {renderSelectedGame()}
            </div>
          </TabsContent>

          <TabsContent value="external">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {externalGames.map((game, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-200">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{game.title}</CardTitle>
                        <ExternalLink className="h-5 w-5 text-gray-400" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{game.description}</p>
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="outline">{game.category}</Badge>
                        <Badge className={difficultyColors[game.difficulty as keyof typeof difficultyColors]}>
                          {game.difficulty === "easy" ? "Fácil" : game.difficulty === "medium" ? "Médio" : "Difícil"}
                        </Badge>
                      </div>
                      <Button asChild className="w-full">
                        <a href={game.url} target="_blank" rel="noopener noreferrer">
                          Jogar <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav active="review" />
    </div>
  )
}
