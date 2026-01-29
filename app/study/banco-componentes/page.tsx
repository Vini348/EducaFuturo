"use client"

import { useState, useEffect } from "react"
import { TopNav } from "@/components/top-nav"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Search, Database, Heart, ExternalLink, ImageOff } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { curriculumComponents } from "@/data/components-curriculum"

// Definição simplificada dos tipos
interface ComponentModel {
  name: string
  characteristics: { [key: string]: string }
  applications: string[]
  datasheet?: string
  id: string
  image?: string
}

interface ComponentCategory {
  id: string
  name: string
  symbol: string
  description: string
  models: ComponentModel[]
  category: string
  characteristics: string[]
  image: string
  year?: number
  subject?: string
  theory?: string
}

// Componente para exibir imagens com fallback
function ComponentImage({
  src,
  alt,
  className = "",
  width = 64,
  height = 64,
}: {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
}) {
  const [error, setError] = useState(false)

  return error ? (
    <div className={`flex items-center justify-center bg-gray-100 ${className}`} style={{ width, height }}>
      <ImageOff className="h-6 w-6 text-gray-400" />
    </div>
  ) : (
    <img
      src={src || "/placeholder.svg"}
      alt={alt}
      className={className}
      width={width}
      height={height}
      onError={() => setError(true)}
      style={{ objectFit: "contain" }}
    />
  )
}

// Converter componentes do currículo para o formato esperado
const convertCurriculumComponents = (): ComponentCategory[] => {
  return curriculumComponents.map((comp) => ({
    id: comp.id,
    name: comp.name,
    symbol: comp.symbol,
    description: comp.description,
    category: comp.category,
    image: comp.image,
    year: comp.year,
    subject: comp.subject,
    theory: comp.theory,
    characteristics: comp.characteristics,
    models: [
      {
        id: comp.id + "-model",
        name: comp.name,
        image: comp.image,
        characteristics: comp.characteristics.reduce(
          (acc, char, index) => {
            acc[`Característica ${index + 1}`] = char
            return acc
          },
          {} as { [key: string]: string },
        ),
        applications: comp.applications,
      },
    ],
  }))
}

// Array completo de componentes (originais + currículo)
const components: ComponentCategory[] = [
  // Componentes originais existentes
  {
    id: "resistor",
    name: "Resistor",
    symbol: "R",
    description: "Componente que limita o fluxo de corrente elétrica em um circuito.",
    category: "passive",
    image:
      "https://images.tcdn.com.br/img/img_prod/650361/20_resistor_1k_ohms_1_4_w_5_de_tolerancia_3857_1_256066015c577b7e6ec6a0fd5c2949e6.jpg",
    characteristics: [
      "Medido em Ohms (Ω)",
      "Código de cores para identificação",
      "Diferentes tolerâncias disponíveis",
      "Tipos: filme metálico, carbono, wirewound, SMD",
    ],
    models: [
      {
        id: "metal-film",
        name: "Resistor de Filme Metálico",
        image: "https://blog.raisa.com.br/wp-content/uploads/2023/03/resistores.jpg",
        characteristics: {
          Tolerância: "±1%",
          Potência: "1/4W",
          Resistência: "100Ω - 1MΩ",
          "Coeficiente de temperatura": "±50ppm/°C",
        },
        applications: [
          "Divisores de tensão de precisão",
          "Filtros ativos",
          "Circuitos de instrumentação",
          "Circuitos de polarização de precisão",
        ],
        datasheet: "https://www.vishay.com/docs/28722/mfr.pdf",
      },
    ],
  },

  // Adicionar componentes do currículo
  ...convertCurriculumComponents(),
]

// Componente de card interativo
function ComponentCard({
  component,
  onClick,
  isFavorite,
  onToggleFavorite,
}: {
  component: ComponentCategory
  onClick: () => void
  isFavorite: boolean
  onToggleFavorite: () => void
}) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all cursor-pointer" onClick={onClick}>
      <CardHeader className="bg-blue-50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-500" />
            {component.name}
            {component.year && (
              <Badge variant="outline" className="ml-2">
                {component.year}º Ano
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="secondary">{component.symbol}</Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                onToggleFavorite()
              }}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "text-red-500 fill-red-500" : "text-gray-500"}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex gap-4 items-start">
          <div className="shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
            <ComponentImage
              src={component.image}
              alt={component.name}
              width={64}
              height={64}
              className="w-full h-full"
            />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{component.description}</p>
            {component.subject && (
              <Badge variant="outline" className="text-xs mb-2">
                {component.subject}
              </Badge>
            )}
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
                          : component.category === "optoelectronic"
                            ? "Optoeletrônico"
                            : component.category === "protection"
                              ? "Proteção"
                              : component.category === "controller"
                                ? "Controlador"
                                : component.category === "instrument"
                                  ? "Instrumento"
                                  : component.category === "sensor"
                                    ? "Sensor"
                                    : component.category === "network"
                                      ? "Rede"
                                      : component.category}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Componente de detalhes do componente
function ComponentDetails({
  component,
  selectedModel,
  onSelectModel,
  onClose,
}: {
  component: ComponentCategory
  selectedModel: ComponentModel | null
  onSelectModel: (model: ComponentModel) => void
  onClose: () => void
}) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%] xl:max-w-[50%]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-500" />
            {component.name} - Detalhes
            {component.year && (
              <Badge variant="outline">
                {component.year}º Ano - {component.subject}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>Explore os detalhes e modelos disponíveis para este componente.</DialogDescription>
        </DialogHeader>

        <div className="md:flex gap-4">
          <div className="md:w-1/3">
            <div className="mb-4 flex justify-center">
              <div className="w-32 h-32 bg-gray-100 rounded-md overflow-hidden">
                <ComponentImage
                  src={component.image}
                  alt={component.name}
                  width={128}
                  height={128}
                  className="w-full h-full"
                />
              </div>
            </div>

            {component.theory && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Teoria:</h3>
                <p className="text-sm text-gray-600">{component.theory}</p>
              </div>
            )}

            <h3 className="text-xl font-semibold mb-2">Modelos:</h3>
            <ul className="space-y-2">
              {component.models.map((model) => (
                <li
                  key={model.id}
                  className={`border rounded-md p-2 hover:bg-gray-100 cursor-pointer ${selectedModel?.id === model.id ? "bg-blue-50 border-blue-200" : ""}`}
                  onClick={() => onSelectModel(model)}
                >
                  <h4 className="font-semibold">{model.name}</h4>
                  <p className="text-sm text-gray-500">Ver detalhes</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:w-2/3">
            {selectedModel ? (
              <>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                    <ComponentImage
                      src={selectedModel.image || component.image}
                      alt={selectedModel.name}
                      width={96}
                      height={96}
                      className="w-full h-full"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedModel.name}</h3>
                    <p className="text-sm text-gray-600">Detalhes do modelo selecionado</p>
                  </div>
                </div>

                <h4 className="font-semibold mb-2">Características:</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 mb-4">
                  {Object.entries(selectedModel.characteristics).map(([key, value]) => (
                    <li key={key}>
                      <strong>{key}:</strong> {value}
                    </li>
                  ))}
                </ul>
                <h4 className="font-semibold mt-4 mb-2">Aplicações:</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 mb-4">
                  {selectedModel.applications.map((application, index) => (
                    <li key={index}>{application}</li>
                  ))}
                </ul>
                {selectedModel.datasheet && (
                  <div className="mt-4">
                    <Button asChild>
                      <Link href={selectedModel.datasheet} target="_blank">
                        Ver Datasheet <ExternalLink className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-gray-500 mb-4">Selecione um modelo para ver os detalhes.</p>
                <div className="space-y-2">
                  <h4 className="font-semibold mb-2 text-center">Características gerais:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {component.characteristics.map((characteristic, index) => (
                      <li key={index}>{characteristic}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function ComponentsPage() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [selectedYear, setSelectedYear] = useState<number | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedComponent, setSelectedComponent] = useState<ComponentCategory | null>(null)
  const [selectedModel, setSelectedModel] = useState<ComponentModel | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])

  // Carregar favoritos do localStorage
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favoriteComponents")
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites))
    }
  }, [])

  // Salvar favoritos no localStorage
  const toggleFavorite = (componentId: string) => {
    const newFavorites = favorites.includes(componentId)
      ? favorites.filter((id) => id !== componentId)
      : [...favorites, componentId]

    setFavorites(newFavorites)
    localStorage.setItem("favoriteComponents", JSON.stringify(newFavorites))
  }

  // Filtragem de componentes
  const filteredComponents = components.filter((component) => {
    const categoryMatch = activeCategory === "all" || component.category === activeCategory
    const yearMatch = selectedYear === "all" || component.year === selectedYear
    const searchMatch =
      component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      component.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      component.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (component.subject && component.subject.toLowerCase().includes(searchQuery.toLowerCase()))
    return categoryMatch && yearMatch && searchMatch
  })

  const handleComponentClick = (component: ComponentCategory) => {
    setSelectedComponent(component)
    if (component.models.length > 0) {
      setSelectedModel(component.models[0])
    } else {
      setSelectedModel(null)
    }
  }

  const handleCloseDetails = () => {
    setSelectedComponent(null)
    setSelectedModel(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <TopNav />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/study">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Banco de Componentes</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Pesquisar componentes..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
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
        </div>

        <Tabs defaultValue="all" onValueChange={setActiveCategory}>
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-9">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="passive">Passivos</TabsTrigger>
            <TabsTrigger value="semiconductor">Semicondutores</TabsTrigger>
            <TabsTrigger value="integrated">Integrados</TabsTrigger>
            <TabsTrigger value="electromechanical">Eletromecânicos</TabsTrigger>
            <TabsTrigger value="protection">Proteção</TabsTrigger>
            <TabsTrigger value="controller">Controladores</TabsTrigger>
            <TabsTrigger value="instrument">Instrumentos</TabsTrigger>
            <TabsTrigger value="sensor">Sensores</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComponents.map((component) => (
            <ComponentCard
              key={component.id}
              component={component}
              onClick={() => handleComponentClick(component)}
              isFavorite={favorites.includes(component.id)}
              onToggleFavorite={() => toggleFavorite(component.id)}
            />
          ))}
        </div>

        {filteredComponents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum componente encontrado com os critérios de busca atuais.</p>
          </div>
        )}
      </main>

      {selectedComponent && (
        <ComponentDetails
          component={selectedComponent}
          selectedModel={selectedModel}
          onSelectModel={setSelectedModel}
          onClose={handleCloseDetails}
        />
      )}

      <BottomNav active="study" />
    </div>
  )
}
