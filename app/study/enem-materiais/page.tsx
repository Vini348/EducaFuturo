"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TopNav } from "@/components/top-nav"
import { BottomNav } from "@/components/bottom-nav"
import { BookOpen, Download, FileText, Video, Lightbulb, Search } from "lucide-react"

const materials = [
  {
    id: 1,
    title: "Guia Completo de Linguagens e Códigos",
    category: "Linguagens",
    type: "PDF",
    description: "Resumo abrangente com exercícios de português, literatura e interpretação",
    pages: 45,
    icon: <BookOpen className="h-8 w-8" />,
  },
  {
    id: 2,
    title: "Mapas Mentais - Ciências Humanas",
    category: "Ciências Humanas",
    type: "Diagrama",
    description: "Diagramas visuais de História, Geografia e Sociologia",
    pages: 12,
    icon: <Lightbulb className="h-8 w-8" />,
  },
  {
    id: 3,
    title: "Fórmulas e Conceitos de Matemática",
    category: "Matemática",
    type: "PDF",
    description: "Todas as fórmulas essenciais com exemplos práticos de ENEM",
    pages: 38,
    icon: <FileText className="h-8 w-8" />,
  },
  {
    id: 4,
    title: "Videoaulas - Física",
    category: "Ciências da Natureza",
    type: "Vídeo",
    description: "Aulas em vídeo sobre Mecânica, Termodinâmica e Óptica",
    pages: 8,
    icon: <Video className="h-8 w-8" />,
  },
  {
    id: 5,
    title: "Exercícios Resolvidos de Química",
    category: "Ciências da Natureza",
    type: "PDF",
    description: "50+ exercícios com resoluções passo a passo",
    pages: 52,
    icon: <BookOpen className="h-8 w-8" />,
  },
  {
    id: 6,
    title: "Provas Anteriores - ENEM 2022",
    category: "Completo",
    type: "PDF",
    description: "Prova completa do ENEM 2022 com gabarito comentado",
    pages: 64,
    icon: <FileText className="h-8 w-8" />,
  },
]

export default function ENEMMaterialsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = ["all", "Linguagens", "Ciências Humanas", "Matemática", "Ciências da Natureza", "Completo"]

  const filteredMaterials = materials.filter(
    (m) =>
      (selectedCategory === "all" || m.category === selectedCategory) &&
      m.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <TopNav />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Materiais de Estudo ENEM</h1>
          <p className="text-gray-600">Acesse PDFs, videoaulas e materiais para preparação</p>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Buscar materiais..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="all" onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat}>
                {cat === "all" ? "Todos" : cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <Card key={material.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="text-blue-500">{material.icon}</div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{material.type}</span>
                </div>
                <CardTitle className="text-lg">{material.title}</CardTitle>
                <CardDescription>{material.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-500">{material.pages} páginas/arquivos</div>
                <Button className="w-full bg-transparent" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMaterials.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-gray-500">Nenhum material encontrado. Tente outra busca.</p>
          </Card>
        )}
      </main>

      <BottomNav active="study" />
    </div>
  )
}
