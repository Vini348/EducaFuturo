"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { brazilianStates, stateAbbreviations, type ENEMUniversity } from "@/data/enem-universities"
import {
  Search,
  Calculator,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle,
  XCircle,
  BarChart3,
  BookText,
  GraduationCap,
  Target,
  TrendingUp,
  Download,
  Filter,
  AlertCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { TopNav } from "@/components/top-nav"
import { BottomNav } from "@/components/bottom-nav"
import Papa from "papaparse"

// Dados de fallback para garantir que a tabela sempre tenha conteúdo
const fallbackUniversities: ENEMUniversity[] = [
  {
    universidade: "UFAC",
    estado: "AC",
    curso: "Educação Física",
    pesoHumanas: 1.5,
    pesoLinguagens: 1.5,
    pesoRedacao: 1.5,
    pesoMatematica: 1,
    pesoCienciasNatureza: 2,
    notaCorteAprox: 560,
  },
  {
    universidade: "UFAL",
    estado: "AL",
    curso: "Serviço Social",
    pesoHumanas: 2.5,
    pesoLinguagens: 2,
    pesoRedacao: 2,
    pesoMatematica: 1,
    pesoCienciasNatureza: 1,
    notaCorteAprox: 580,
  },
  {
    universidade: "UFAP",
    estado: "AP",
    curso: "História",
    pesoHumanas: 3,
    pesoLinguagens: 2,
    pesoRedacao: 2,
    pesoMatematica: 1,
    pesoCienciasNatureza: 1,
    notaCorteAprox: 545,
  },
  {
    universidade: "UEA",
    estado: "AM",
    curso: "Biologia",
    pesoHumanas: 1.5,
    pesoLinguagens: 1.5,
    pesoRedacao: 1.5,
    pesoMatematica: 1.5,
    pesoCienciasNatureza: 3,
    notaCorteAprox: 545,
  },
  {
    universidade: "UNIR",
    estado: "RO",
    curso: "Sistemas de Informação",
    pesoHumanas: 1,
    pesoLinguagens: 1,
    pesoRedacao: 1.5,
    pesoMatematica: 3,
    pesoCienciasNatureza: 2,
    notaCorteAprox: 550,
  },
  {
    universidade: "UFRR",
    estado: "RR",
    curso: "Matemática",
    pesoHumanas: 1,
    pesoLinguagens: 1,
    pesoRedacao: 1,
    pesoMatematica: 3,
    pesoCienciasNatureza: 2,
    notaCorteAprox: 530,
  },
  {
    universidade: "UFT",
    estado: "TO",
    curso: "Química",
    pesoHumanas: 1,
    pesoLinguagens: 1,
    pesoRedacao: 1,
    pesoMatematica: 2.5,
    pesoCienciasNatureza: 3,
    notaCorteAprox: 540,
  },
  {
    universidade: "UFCG",
    estado: "PB",
    curso: "Engenharia de Petróleo",
    pesoHumanas: 1,
    pesoLinguagens: 1,
    pesoRedacao: 1.5,
    pesoMatematica: 3,
    pesoCienciasNatureza: 2.5,
    notaCorteAprox: 640,
  },
  {
    universidade: "UFERSA",
    estado: "RN",
    curso: "Biotecnologia",
    pesoHumanas: 1,
    pesoLinguagens: 1,
    pesoRedacao: 1.5,
    pesoMatematica: 2,
    pesoCienciasNatureza: 3,
    notaCorteAprox: 625,
  },
  {
    universidade: "UFPI",
    estado: "PI",
    curso: "Arqueologia",
    pesoHumanas: 2.5,
    pesoLinguagens: 2,
    pesoRedacao: 2,
    pesoMatematica: 1,
    pesoCienciasNatureza: 1.5,
    notaCorteAprox: 585,
  },
]

export default function ENEMCalculatorPage() {
  const [natureza, setNatureza] = useState<number | "">("")
  const [humanas, setHumanas] = useState<number | "">("")
  const [linguagens, setLinguagens] = useState<number | "">("")
  const [matematica, setMatematica] = useState<number | "">("")
  const [redacao, setRedacao] = useState<number | "">("")
  const [media, setMedia] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [universities, setUniversities] = useState<ENEMUniversity[]>(fallbackUniversities)
  const [filteredUniversities, setFilteredUniversities] = useState<ENEMUniversity[]>(fallbackUniversities)
  const [selectedState, setSelectedState] = useState<string>("all")
  const [selectedCourse, setSelectedCourse] = useState<string>("all")
  const [selectedUniversityCourse, setSelectedUniversityCourse] = useState<ENEMUniversity | null>(null)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "ascending" | "descending" }>({
    key: "notaCorteAprox",
    direction: "ascending",
  })
  const [showApproved, setShowApproved] = useState(false)
  const [weights, setWeights] = useState({
    natureza: 1,
    humanas: 1,
    linguagens: 1,
    matematica: 1,
    redacao: 1,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [availableCourses, setAvailableCourses] = useState<string[]>([])
  const [dataSource, setDataSource] = useState<string>("remote")
  const resultsRef = useRef<HTMLDivElement>(null)

  // Fetch university data from CSV
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // URLs para tentar carregar os dados
        const urls = [
          // URL original
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pesos_enem_universidades-pFFjzCYRTzPv5aFM8vj84X6NlLHcfg.csv",
          // URL atualizada (pode não existir ainda)
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pesos_enem_universidades_completo-Hs9Tz0Yx9Wd5Ck7Lm2Np3Qr4St5Uv6Wx7Yz8.csv",
        ]

        let csvText = ""
        let loadedSuccessfully = false

        // Tentar cada URL até conseguir carregar os dados
        for (const url of urls) {
          try {
            console.log(`Tentando carregar dados de: ${url}`)
            const response = await fetch(url)

            if (response.ok) {
              csvText = await response.text()
              console.log(`Dados carregados com sucesso de: ${url}`)
              loadedSuccessfully = true
              break
            }
          } catch (err) {
            console.error(`Erro ao carregar de ${url}:`, err)
          }
        }

        // Se não conseguiu carregar de nenhuma URL, usar dados de fallback
        if (!loadedSuccessfully) {
          console.warn("Não foi possível carregar dados remotos. Usando dados de fallback.")
          setDataSource("fallback")
          setUniversities(fallbackUniversities)
          setFilteredUniversities(fallbackUniversities)

          // Extrair cursos únicos dos dados de fallback
          const courses = [...new Set(fallbackUniversities.map((uni) => uni.curso))].sort()
          setAvailableCourses(courses)

          setLoading(false)
          return
        }

        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            console.log("Parsing CSV completo:", results)

            if (results.data && results.data.length > 0) {
              const parsedData = results.data
                .filter(
                  (item: any) =>
                    item.Universidade && item.Estado && item.Curso && !isNaN(Number(item.Nota_Corte_Aprox)),
                )
                .map((item: any) => ({
                  universidade: item.Universidade,
                  estado: stateAbbreviations[item.Estado] || item.Estado,
                  curso: item.Curso,
                  pesoHumanas: Number(item.Peso_Humanas) || 1,
                  pesoLinguagens: Number(item.Peso_Linguagens) || 1,
                  pesoRedacao: Number(item.Peso_Redacao) || 1,
                  pesoMatematica: Number(item.Peso_Matematica) || 1,
                  pesoCienciasNatureza: Number(item.Peso_Ciencias_Natureza) || 1,
                  notaCorteAprox: Number(item.Nota_Corte_Aprox) || 0,
                })) as ENEMUniversity[]

              console.log(`Dados processados: ${parsedData.length} registros`)

              if (parsedData.length === 0) {
                console.warn("Nenhum dado válido encontrado no CSV. Usando dados de fallback.")
                setDataSource("fallback")
                setUniversities(fallbackUniversities)
                setFilteredUniversities(fallbackUniversities)

                // Extrair cursos únicos dos dados de fallback
                const courses = [...new Set(fallbackUniversities.map((uni) => uni.curso))].sort()
                setAvailableCourses(courses)
              } else {
                setDataSource("remote")
                setUniversities(parsedData)
                setFilteredUniversities(parsedData)

                // Extract unique courses
                const courses = [...new Set(parsedData.map((uni) => uni.curso))].sort()
                setAvailableCourses(courses)
              }
            } else {
              console.warn("Dados CSV inválidos. Usando dados de fallback.")
              setDataSource("fallback")
              setUniversities(fallbackUniversities)
              setFilteredUniversities(fallbackUniversities)

              // Extrair cursos únicos dos dados de fallback
              const courses = [...new Set(fallbackUniversities.map((uni) => uni.curso))].sort()
              setAvailableCourses(courses)
            }

            setLoading(false)
          },
          error: (error) => {
            console.error("Error parsing CSV:", error)
            setError("Erro ao processar dados das universidades")

            // Usar dados de fallback em caso de erro
            setDataSource("fallback")
            setUniversities(fallbackUniversities)
            setFilteredUniversities(fallbackUniversities)

            // Extrair cursos únicos dos dados de fallback
            const courses = [...new Set(fallbackUniversities.map((uni) => uni.curso))].sort()
            setAvailableCourses(courses)

            setLoading(false)
          },
        })
      } catch (err) {
        console.error("Error fetching CSV:", err)
        setError("Erro ao carregar dados das universidades")

        // Usar dados de fallback em caso de erro
        setDataSource("fallback")
        setUniversities(fallbackUniversities)
        setFilteredUniversities(fallbackUniversities)

        // Extrair cursos únicos dos dados de fallback
        const courses = [...new Set(fallbackUniversities.map((uni) => uni.curso))].sort()
        setAvailableCourses(courses)

        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Calcular média ponderada para uma universidade específica
  const calcularMediaPonderadaUniversidade = (uni: ENEMUniversity) => {
    if (natureza === "" || humanas === "" || linguagens === "" || matematica === "" || redacao === "") {
      return 0
    }

    const totalWeight =
      uni.pesoCienciasNatureza + uni.pesoHumanas + uni.pesoLinguagens + uni.pesoMatematica + uni.pesoRedacao

    const weightedSum =
      Number(natureza) * uni.pesoCienciasNatureza +
      Number(humanas) * uni.pesoHumanas +
      Number(linguagens) * uni.pesoLinguagens +
      Number(matematica) * uni.pesoMatematica +
      Number(redacao) * uni.pesoRedacao

    return weightedSum / totalWeight
  }

  // Calcular média ponderada geral
  const calcularMediaPonderada = () => {
    if (natureza === "" || humanas === "" || linguagens === "" || matematica === "" || redacao === "") {
      return 0
    }

    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0)

    const weightedSum =
      Number(natureza) * weights.natureza +
      Number(humanas) * weights.humanas +
      Number(linguagens) * weights.linguagens +
      Number(matematica) * weights.matematica +
      Number(redacao) * weights.redacao

    return weightedSum / totalWeight
  }

  const calcularMedia = () => {
    const mediaCalculada = calcularMediaPonderada()
    setMedia(mediaCalculada)

    // Scroll to results after calculation
    setTimeout(() => {
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: "smooth" })
      }
    }, 100)
  }

  // Filtrar universidades
  useEffect(() => {
    if (loading) return

    let results = [...universities]

    // Filtrar por termo de busca
    if (searchTerm) {
      results = results.filter(
        (uni) =>
          uni.curso.toLowerCase().includes(searchTerm.toLowerCase()) ||
          uni.universidade.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtrar por estado
    if (selectedState !== "all") {
      results = results.filter((uni) => uni.estado === selectedState)
    }

    // Filtrar por curso
    if (selectedCourse !== "all") {
      results = results.filter((uni) => uni.curso === selectedCourse)
    }

    // Filtrar por aprovação
    if (showApproved && media > 0) {
      results = results.filter((uni) => {
        const uniMedia = calcularMediaPonderadaUniversidade(uni)
        return uniMedia >= uni.notaCorteAprox
      })
    }

    // Ordenar resultados
    results = [...results].sort((a, b) => {
      if (sortConfig.key === "notaCorteAprox") {
        return sortConfig.direction === "ascending"
          ? a.notaCorteAprox - b.notaCorteAprox
          : b.notaCorteAprox - a.notaCorteAprox
      } else {
        const aValue = a[sortConfig.key as keyof typeof a]
        const bValue = b[sortConfig.key as keyof typeof b]

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "ascending" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
        }
        return 0
      }
    })

    setFilteredUniversities(results)
  }, [searchTerm, selectedState, selectedCourse, sortConfig, showApproved, media, universities, loading])

  // Obter lista de estados únicos
  const states = ["all", ...new Set(universities.map((uni) => uni.estado))].sort()

  // Função para ordenar
  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  // Função para formatar o número
  const formatNumber = (num: number) => {
    if (num === undefined || num === null) return "0"
    return num.toFixed(1).replace(/\.0$/, "")
  }

  // Função para verificar se o usuário seria aprovado
  const isApproved = (uni: ENEMUniversity) => {
    const uniMedia = calcularMediaPonderadaUniversidade(uni)
    return uniMedia >= uni.notaCorteAprox
  }

  // Função para ajustar os pesos
  const handleWeightChange = (field: keyof typeof weights, value: number[]) => {
    setWeights((prev) => ({
      ...prev,
      [field]: value[0],
    }))
  }

  // Função para obter a classificação da nota
  const getScoreRating = () => {
    if (media === 0) return { text: "Não calculado", color: "text-gray-500" }
    if (media < 500) return { text: "Abaixo da média", color: "text-red-500" }
    if (media < 600) return { text: "Na média", color: "text-yellow-500" }
    if (media < 700) return { text: "Acima da média", color: "text-green-500" }
    if (media < 800) return { text: "Excelente", color: "text-blue-500" }
    return { text: "Excepcional", color: "text-purple-500" }
  }

  // Função para obter a porcentagem de aprovação
  const getApprovalPercentage = () => {
    if (media === 0 || universities.length === 0) return 0
    const totalCourses = universities.length
    const approvedCourses = universities.filter((uni) => isApproved(uni)).length
    return Math.round((approvedCourses / totalCourses) * 100)
  }

  // Função para obter o curso mais acessível
  const getMostAccessibleCourse = () => {
    if (media === 0 || universities.length === 0) return null

    const accessibleCourses = universities.filter((uni) => isApproved(uni))
    if (accessibleCourses.length === 0) return null

    // Ordenar por nota de corte (decrescente) para pegar o curso mais competitivo que o usuário passa
    return accessibleCourses.sort((a, b) => b.notaCorteAprox - a.notaCorteAprox)[0]
  }

  // Função para obter o próximo curso alcançável
  const getNextReachableCourse = () => {
    if (media === 0 || universities.length === 0) return null

    const unreachableCourses = universities.filter((uni) => !isApproved(uni))
    if (unreachableCourses.length === 0) return null

    // Ordenar por nota de corte (crescente) para pegar o curso mais próximo
    return unreachableCourses.sort((a, b) => a.notaCorteAprox - b.notaCorteAprox)[0]
  }

  // Função segura para formatar a nota de corte
  const safeFormatCutoff = (cutoff: number | undefined) => {
    if (cutoff === undefined || cutoff === null) return "0"
    return cutoff.toFixed(1)
  }

  // Função segura para calcular a diferença de pontos
  const calculatePointDifference = (uni: ENEMUniversity) => {
    if (uni.notaCorteAprox === undefined || uni.notaCorteAprox === null || media === 0) return "0"
    const uniMedia = calcularMediaPonderadaUniversidade(uni)
    return (uni.notaCorteAprox - uniMedia).toFixed(1)
  }

  // Função para selecionar um curso específico e aplicar seus pesos
  const selectSpecificCourse = (uni: ENEMUniversity) => {
    setSelectedUniversityCourse(uni)

    // Aplicar os pesos do curso selecionado
    setWeights({
      natureza: uni.pesoCienciasNatureza,
      humanas: uni.pesoHumanas,
      linguagens: uni.pesoLinguagens,
      matematica: uni.pesoMatematica,
      redacao: uni.pesoRedacao,
    })

    // Rolar para a seção da calculadora
    document.getElementById("calculator-section")?.scrollIntoView({ behavior: "smooth" })
  }

  // Função para exportar resultados como CSV
  const exportResults = () => {
    if (filteredUniversities.length === 0) return

    const headers = "Universidade,Estado,Curso,Nota de Corte,Sua Média,Status,Diferença\n"
    const rows = filteredUniversities
      .map((uni) => {
        const uniMedia = calcularMediaPonderadaUniversidade(uni)
        const status = isApproved(uni) ? "Aprovado" : "Reprovado"
        const diferenca = isApproved(uni)
          ? "+" + (uniMedia - uni.notaCorteAprox).toFixed(1)
          : "-" + (uni.notaCorteAprox - uniMedia).toFixed(1)

        return `"${uni.universidade}","${uni.estado}","${uni.curso}",${uni.notaCorteAprox},${uniMedia.toFixed(1)},"${status}",${diferenca}`
      })
      .join("\n")

    const csvContent = "data:text/csv;charset=utf-8," + headers + rows
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "resultados_enem.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Função para obter o nome completo do estado a partir da sigla
  const getStateName = (abbr: string) => {
    const state = brazilianStates.find((state) => state.id === abbr)
    return state ? state.name : abbr
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <TopNav />

      <main className="container mx-auto px-4 py-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Calculadora Avançada ENEM
            </h1>
            <p className="text-gray-600 mt-2">
              Calcule sua média com pesos reais, confira notas de corte e descubra suas chances de aprovação
            </p>
          </div>

          {dataSource === "fallback" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-yellow-800">Usando dados locais</h3>
                <p className="text-sm text-yellow-700">
                  Não foi possível carregar os dados completos do servidor. Estamos exibindo um conjunto limitado de
                  cursos. Tente novamente mais tarde para acessar a lista completa de universidades e cursos.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Calculator className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-blue-800">Calculadora</h3>
                  <p className="text-sm text-blue-600">Calcule sua média ponderada</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-purple-800">Notas de Corte</h3>
                  <p className="text-sm text-purple-600">Consulte as notas por curso</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-green-800">Simulador</h3>
                  <p className="text-sm text-green-600">Veja suas chances de aprovação</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {loading ? (
            <Card className="p-8 text-center">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 bg-blue-200 rounded-full mb-4"></div>
                <div className="h-4 w-48 bg-blue-200 rounded mb-2"></div>
                <div className="h-3 w-32 bg-blue-100 rounded"></div>
              </div>
              <p className="mt-4 text-gray-600">Carregando dados das universidades...</p>
            </Card>
          ) : error ? (
            <Card className="p-8 text-center">
              <div className="text-red-500 mb-4">
                <XCircle className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-red-700 mb-2">{error}</h3>
              <p className="text-gray-600">Tente novamente mais tarde ou entre em contato com o suporte.</p>
            </Card>
          ) : (
            <Card className="shadow-lg border-2 border-gray-100 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <GraduationCap className="h-6 w-6" />
                  Simulador ENEM
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Calcule sua média e descubra suas chances de aprovação em cada curso
                </CardDescription>
              </CardHeader>

              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Calculadora */}
                  <div className="p-6 border-r border-b" id="calculator-section">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Calculator className="h-5 w-5 text-blue-500" />
                      Calculadora de Média
                    </h3>

                    {selectedUniversityCourse && (
                      <div className="bg-blue-50 p-3 rounded-md border border-blue-200 text-sm mb-4">
                        <div className="font-medium text-blue-800">
                          Curso selecionado: {selectedUniversityCourse.curso}
                        </div>
                        <div className="text-blue-600">
                          {selectedUniversityCourse.universidade} ({selectedUniversityCourse.estado})
                        </div>
                        <div className="mt-2 text-xs text-blue-700 flex justify-between items-center">
                          <span>Os pesos deste curso foram aplicados automaticamente.</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-7 px-2"
                            onClick={() => setSelectedUniversityCourse(null)}
                          >
                            Limpar seleção
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="natureza" className="flex items-center gap-1 text-sm font-medium">
                            Ciências da Natureza
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-3.5 w-3.5 text-gray-400" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Física, Química e Biologia</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </Label>
                          <Badge variant="outline" className="font-normal bg-blue-50">
                            Peso: {weights.natureza}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Input
                            id="natureza"
                            type="number"
                            value={natureza}
                            onChange={(e) => setNatureza(e.target.value ? Number(e.target.value) : "")}
                            placeholder="0"
                            min="0"
                            max="1000"
                            className="border-blue-200 focus:border-blue-500"
                          />
                          <div className="w-24">
                            <Slider
                              defaultValue={[1]}
                              max={5}
                              min={1}
                              step={1}
                              value={[weights.natureza]}
                              onValueChange={(value) => handleWeightChange("natureza", value)}
                              className="py-2"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="humanas" className="flex items-center gap-1 text-sm font-medium">
                            Ciências Humanas
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-3.5 w-3.5 text-gray-400" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>História, Geografia, Filosofia e Sociologia</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </Label>
                          <Badge variant="outline" className="font-normal bg-green-50">
                            Peso: {weights.humanas}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Input
                            id="humanas"
                            type="number"
                            value={humanas}
                            onChange={(e) => setHumanas(e.target.value ? Number(e.target.value) : "")}
                            placeholder="0"
                            min="0"
                            max="1000"
                            className="border-green-200 focus:border-green-500"
                          />
                          <div className="w-24">
                            <Slider
                              defaultValue={[1]}
                              max={5}
                              min={1}
                              step={1}
                              value={[weights.humanas]}
                              onValueChange={(value) => handleWeightChange("humanas", value)}
                              className="py-2"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="linguagens" className="flex items-center gap-1 text-sm font-medium">
                            Linguagens e Códigos
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-3.5 w-3.5 text-gray-400" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Português, Literatura, Língua Estrangeira, Artes e Ed. Física</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </Label>
                          <Badge variant="outline" className="font-normal bg-purple-50">
                            Peso: {weights.linguagens}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Input
                            id="linguagens"
                            type="number"
                            value={linguagens}
                            onChange={(e) => setLinguagens(e.target.value ? Number(e.target.value) : "")}
                            placeholder="0"
                            min="0"
                            max="1000"
                            className="border-purple-200 focus:border-purple-500"
                          />
                          <div className="w-24">
                            <Slider
                              defaultValue={[1]}
                              max={5}
                              min={1}
                              step={1}
                              value={[weights.linguagens]}
                              onValueChange={(value) => handleWeightChange("linguagens", value)}
                              className="py-2"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="matematica" className="flex items-center gap-1 text-sm font-medium">
                            Matemática
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-3.5 w-3.5 text-gray-400" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Álgebra, Geometria, Estatística e Matemática Financeira</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </Label>
                          <Badge variant="outline" className="font-normal bg-orange-50">
                            Peso: {weights.matematica}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Input
                            id="matematica"
                            type="number"
                            value={matematica}
                            onChange={(e) => setMatematica(e.target.value ? Number(e.target.value) : "")}
                            placeholder="0"
                            min="0"
                            max="1000"
                            className="border-orange-200 focus:border-orange-500"
                          />
                          <div className="w-24">
                            <Slider
                              defaultValue={[1]}
                              max={5}
                              min={1}
                              step={1}
                              value={[weights.matematica]}
                              onValueChange={(value) => handleWeightChange("matematica", value)}
                              className="py-2"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="redacao" className="flex items-center gap-1 text-sm font-medium">
                            Redação
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-3.5 w-3.5 text-gray-400" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Texto dissertativo-argumentativo</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </Label>
                          <Badge variant="outline" className="font-normal bg-red-50">
                            Peso: {weights.redacao}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Input
                            id="redacao"
                            type="number"
                            value={redacao}
                            onChange={(e) => setRedacao(e.target.value ? Number(e.target.value) : "")}
                            placeholder="0"
                            min="0"
                            max="1000"
                            className="border-red-200 focus:border-red-500"
                          />
                          <div className="w-24">
                            <Slider
                              defaultValue={[1]}
                              max={5}
                              min={1}
                              step={1}
                              value={[weights.redacao]}
                              onValueChange={(value) => handleWeightChange("redacao", value)}
                              className="py-2"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200 text-sm text-yellow-800 mb-4">
                        <p className="flex items-center gap-1">
                          <Info className="h-4 w-4" />
                          Cada universidade aplica pesos diferentes para cada área do conhecimento. Ao calcular, o
                          sistema usará os pesos específicos de cada curso.
                        </p>
                      </div>

                      <Button
                        onClick={calcularMedia}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
                        size="lg"
                      >
                        Calcular Média
                      </Button>

                      {selectedUniversityCourse && media > 0 && (
                        <div className="mt-4 p-4 rounded-lg border">
                          <h4 className="font-medium text-lg mb-2">Análise de Chances</h4>

                          <div className="flex items-center gap-2 mb-3">
                            <div className="text-sm">Sua média ponderada para este curso:</div>
                            <div className="text-lg font-bold">
                              {formatNumber(calcularMediaPonderadaUniversidade(selectedUniversityCourse))}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="text-sm">Nota de corte:</div>
                            <div className="text-lg font-bold">
                              {safeFormatCutoff(selectedUniversityCourse.notaCorteAprox)}
                            </div>
                          </div>

                          {isApproved(selectedUniversityCourse) ? (
                            <div className="mt-3 bg-green-100 p-3 rounded-md border border-green-200 flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <div>
                                <div className="font-medium text-green-800">Aprovado!</div>
                                <div className="text-sm text-green-700">
                                  Sua nota está{" "}
                                  {(
                                    calcularMediaPonderadaUniversidade(selectedUniversityCourse) -
                                    selectedUniversityCourse.notaCorteAprox
                                  ).toFixed(1)}{" "}
                                  pontos acima da nota de corte.
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="mt-3 bg-red-100 p-3 rounded-md border border-red-200 flex items-center gap-2">
                              <XCircle className="h-5 w-5 text-red-600" />
                              <div>
                                <div className="font-medium text-red-800">Ainda não aprovado</div>
                                <div className="text-sm text-red-700">
                                  Você precisa de mais{" "}
                                  {(
                                    selectedUniversityCourse.notaCorteAprox -
                                    calcularMediaPonderadaUniversidade(selectedUniversityCourse)
                                  ).toFixed(1)}{" "}
                                  pontos para atingir a nota de corte.
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Resultados */}
                  <div className="p-6" ref={resultsRef}>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-500" />
                      Resultados
                    </h3>

                    {media > 0 ? (
                      <div className="space-y-6">
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                          <p className="text-sm text-blue-600 mb-1">Sua média ponderada no ENEM é:</p>
                          <div className="flex items-center justify-between">
                            <p className="text-3xl font-bold text-blue-800">{formatNumber(media)}</p>
                            <Badge className={`${getScoreRating().color} bg-white`}>{getScoreRating().text}</Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                            <p className="text-sm text-green-600 mb-1">Cursos acessíveis</p>
                            <p className="text-2xl font-bold text-green-800">
                              {universities.filter((uni) => isApproved(uni)).length}
                            </p>
                            <p className="text-xs text-green-600">{getApprovalPercentage()}% dos cursos disponíveis</p>
                          </div>

                          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                            <p className="text-sm text-purple-600 mb-1">Classificação</p>
                            <p className="text-2xl font-bold text-purple-800">{getScoreRating().text}</p>
                            <p className="text-xs text-purple-600">Baseado na média nacional</p>
                          </div>
                        </div>

                        {getMostAccessibleCourse() && (
                          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                            <p className="text-sm text-blue-600 mb-1">Melhor curso acessível:</p>
                            <p className="font-semibold text-blue-800">{getMostAccessibleCourse()?.curso}</p>
                            <div className="flex justify-between items-center mt-1">
                              <p className="text-xs text-blue-600">
                                {getMostAccessibleCourse()?.universidade} ({getMostAccessibleCourse()?.estado})
                              </p>
                              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                                {safeFormatCutoff(getMostAccessibleCourse()?.notaCorteAprox)}
                              </Badge>
                            </div>
                          </div>
                        )}

                        {getNextReachableCourse() && (
                          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                            <p className="text-sm text-amber-600 mb-1">Próximo objetivo:</p>
                            <p className="font-semibold text-amber-800">{getNextReachableCourse()?.curso}</p>
                            <div className="flex justify-between items-center mt-1">
                              <p className="text-xs text-amber-600">
                                {getNextReachableCourse()?.universidade} ({getNextReachableCourse()?.estado})
                              </p>
                              <div className="flex items-center gap-1">
                                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                                  {safeFormatCutoff(getNextReachableCourse()?.notaCorteAprox)}
                                </Badge>
                                <span className="text-xs text-amber-600">
                                  Faltam {calculatePointDifference(getNextReachableCourse()!)} pts
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        <Button
                          className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900"
                          onClick={() => {
                            setShowApproved(true)
                            document.getElementById("courses-section")?.scrollIntoView({ behavior: "smooth" })
                          }}
                        >
                          Ver cursos compatíveis
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                        <div className="bg-blue-100 p-4 rounded-full">
                          <Calculator className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">Calcule sua média</h3>
                          <p className="text-sm text-gray-600 max-w-xs">
                            Preencha suas notas no formulário ao lado e clique em "Calcular Média" para ver seus
                            resultados
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Cursos e Notas de Corte */}
                <div id="courses-section" className="border-t">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <BookText className="h-5 w-5 text-purple-500" />
                        Cursos e Notas de Corte
                      </h3>

                      {filteredUniversities.length > 0 && (
                        <Button variant="outline" size="sm" onClick={exportResults} className="flex items-center gap-1">
                          <Download className="h-4 w-4" />
                          Exportar CSV
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Pesquisar curso ou universidade..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-9"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <select
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                            className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="all">Todos os estados</option>
                            {states
                              .filter((s) => s !== "all")
                              .map((state) => (
                                <option key={state} value={state}>
                                  {getStateName(state)}
                                </option>
                              ))}
                          </select>
                        </div>

                        <div>
                          <select
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="all">Todos os cursos</option>
                            {availableCourses.map((course) => (
                              <option key={course} value={course}>
                                {course}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {media > 0 && (
                      <div className="mb-4">
                        <Button
                          variant={showApproved ? "default" : "outline"}
                          onClick={() => setShowApproved(!showApproved)}
                          className={`w-full ${showApproved ? "bg-green-600 hover:bg-green-700" : ""}`}
                        >
                          <Filter className="h-4 w-4 mr-2" />
                          {showApproved ? "Mostrar todos os cursos" : "Mostrar apenas cursos aprovados"}
                        </Button>
                      </div>
                    )}

                    <div className="border rounded-md overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => requestSort("curso")}
                              >
                                <div className="flex items-center gap-1">
                                  Curso
                                  {sortConfig.key === "curso" &&
                                    (sortConfig.direction === "ascending" ? (
                                      <ChevronUp className="h-4 w-4" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4" />
                                    ))}
                                </div>
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => requestSort("universidade")}
                              >
                                <div className="flex items-center gap-1">
                                  Universidade
                                  {sortConfig.key === "universidade" &&
                                    (sortConfig.direction === "ascending" ? (
                                      <ChevronUp className="h-4 w-4" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4" />
                                    ))}
                                </div>
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => requestSort("estado")}
                              >
                                <div className="flex items-center gap-1">
                                  Estado
                                  {sortConfig.key === "estado" &&
                                    (sortConfig.direction === "ascending" ? (
                                      <ChevronUp className="h-4 w-4" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4" />
                                    ))}
                                </div>
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => requestSort("notaCorteAprox")}
                              >
                                <div className="flex items-center gap-1">
                                  Nota de Corte
                                  {sortConfig.key === "notaCorteAprox" &&
                                    (sortConfig.direction === "ascending" ? (
                                      <ChevronUp className="h-4 w-4" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4" />
                                    ))}
                                </div>
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Pesos
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Ação
                              </th>
                              {media > 0 && (
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Status
                                </th>
                              )}
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUniversities.length > 0 ? (
                              filteredUniversities.map((uni, index) => (
                                <tr key={index} className={media > 0 && isApproved(uni) ? "bg-green-50" : ""}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {uni.curso}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {uni.universidade}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{uni.estado}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                    {safeFormatCutoff(uni.notaCorteAprox)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                    <div className="flex flex-wrap gap-1">
                                      <Badge variant="outline" className="bg-blue-50">
                                        N: {uni.pesoCienciasNatureza}
                                      </Badge>
                                      <Badge variant="outline" className="bg-green-50">
                                        H: {uni.pesoHumanas}
                                      </Badge>
                                      <Badge variant="outline" className="bg-purple-50">
                                        L: {uni.pesoLinguagens}
                                      </Badge>
                                      <Badge variant="outline" className="bg-orange-50">
                                        M: {uni.pesoMatematica}
                                      </Badge>
                                      <Badge variant="outline" className="bg-red-50">
                                        R: {uni.pesoRedacao}
                                      </Badge>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-xs"
                                      onClick={() => selectSpecificCourse(uni)}
                                    >
                                      Selecionar
                                    </Button>
                                  </td>
                                  {media > 0 && (
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      {isApproved(uni) ? (
                                        <div className="flex items-center gap-1">
                                          <CheckCircle className="h-4 w-4 text-green-500" />
                                          <span className="text-green-600 text-sm">
                                            Aprovado ({formatNumber(calcularMediaPonderadaUniversidade(uni))})
                                          </span>
                                        </div>
                                      ) : (
                                        <div className="flex items-center gap-1">
                                          <XCircle className="h-4 w-4 text-red-500" />
                                          <span className="text-red-600 text-sm">
                                            Faltam {calculatePointDifference(uni)} pts
                                          </span>
                                        </div>
                                      )}
                                    </td>
                                  )}
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={media > 0 ? 7 : 6} className="px-6 py-4 text-center text-sm text-gray-500">
                                  Nenhum resultado encontrado
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="mt-4 text-xs text-gray-500 space-y-1">
                      <p className="italic">* As notas de corte são aproximadas e baseadas em dados históricos</p>
                      <p>
                        <span className="font-medium">Legenda dos pesos:</span> N = Ciências da Natureza, H = Ciências
                        Humanas, L = Linguagens, M = Matemática, R = Redação
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Precisa de ajuda para melhorar suas notas? Confira nossos materiais de estudo e simulados!
            </p>
            <div className="flex justify-center mt-2">
              <Button variant="outline" className="mr-2">
                <BookOpen className="h-4 w-4 mr-2" />
                Materiais de Estudo
              </Button>
              <Button variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                Simulados
              </Button>
            </div>
          </div>
        </div>
      </main>

      <BottomNav active="calculator" />
    </div>
  )
}
