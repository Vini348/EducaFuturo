"use client"

import { useState } from "react"
import { TopNav } from "@/components/top-nav"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Search, BookOpen } from "lucide-react"
import Link from "next/link"
import { useStudyTracker } from "@/hooks/use-study-tracker"

const summaries = [
  {
    id: "digital-basics",
    title: "Fundamentos de Eletrônica Digital",
    category: "digital",
    content:
      "A eletrônica digital é baseada em sinais discretos, geralmente representados por 0s e 1s. Os principais componentes incluem portas lógicas, flip-flops e circuitos integrados...",
    pdfUrl:
      "https://gykxdwpducdjeejfagmx.supabase.co/storage/v1/object/sign/summary-pdfs/1.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzdW1tYXJ5LXBkZnMvMS5wZGYiLCJpYXQiOjE3Mzg0MzU0MzIsImV4cCI6MTc2OTk3MTQzMn0.12oNDssvGYwNBDr4C6NM8ydhZQZu4tb2FrImeuIkqIw",
  },
  {
    id: "analog-circuits",
    title: "Circuitos Analógicos Básicos",
    category: "analog",
    content:
      "Circuitos analógicos trabalham com sinais contínuos. Componentes fundamentais incluem resistores, capacitores, indutores e amplificadores operacionais...",
    pdfUrl:
      "https://gykxdwpducdjeejfagmx.supabase.co/storage/v1/object/sign/summary-pdfs/2.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzdW1tYXJ5LXBkZnMvMi5wZGYiLCJpYXQiOjE3Mzg0MzU0NDgsImV4cCI6MTc2OTk3MTQ0OH0.aCeqwAgXSiy4fRdfG1O5JquoLZVF4owMKeV-TVZ8d6g",
  },
  {
    id: "power-electronics",
    title: "Introdução à Eletrônica de Potência",
    category: "power",
    content:
      "A eletrônica de potência lida com o controle e conversão de energia elétrica. Dispositivos comuns incluem tiristores, MOSFETs de potência e IGBTs...",
    pdfUrl:
      "https://gykxdwpducdjeejfagmx.supabase.co/storage/v1/object/sign/summary-pdfs/3.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzdW1tYXJ5LXBkZnMvMy5wZGYiLCJpYXQiOjE3Mzg0MzU0NjEsImV4cCI6MTc2OTk3MTQ2MX0.pORTIabFzjfYmGEj2bL6A4ArhL5fXGuGRgKG0uTKtHk",
  },
  // Adicione mais resumos conforme necessário
]

export default function SummariesPage() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const studyTracker = useStudyTracker("summaries")

  const filteredSummaries = summaries.filter(
    (summary) =>
      (activeCategory === "all" || summary.category === activeCategory) &&
      summary.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
          <h1 className="text-2xl font-bold">Resumos</h1>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Pesquisar resumos..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="all" onValueChange={setActiveCategory}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="digital">Digital</TabsTrigger>
            <TabsTrigger value="analog">Analógica</TabsTrigger>
            <TabsTrigger value="power">Potência</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSummaries.map((summary) => (
            <Card key={summary.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {summary.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 line-clamp-3">{summary.content}</p>
                <Button asChild className="mt-4">
                  <a href={summary.pdfUrl} target="_blank" rel="noopener noreferrer">
                    Ler Mais
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <BottomNav active="study" />
    </div>
  )
}
