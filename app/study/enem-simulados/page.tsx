"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TopNav } from "@/components/top-nav"
import { BottomNav } from "@/components/bottom-nav"
import { enemQuestions } from "@/data/enem-questions"
import { BookOpen, Clock, Target, TrendingUp, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ENEMSimuladosPage() {
  const router = useRouter()
  const [selectedArea, setSelectedArea] = useState<string>("all")

  const areas = ["Linguagens", "Ciências Humanas", "Matemática", "Ciências da Natureza"] as const

  const simulados = [
    {
      id: 1,
      name: "Simulado Completo ENEM 2023",
      description: "Teste completo com 8 questões das principais áreas",
      year: 2023,
      questionCount: 8,
      duration: 120,
      difficulty: "Misto",
      color: "bg-blue-500",
    },
    {
      id: 2,
      name: "Simulado Linguagens 2023",
      description: "Foco em Português, Literatura e Interpretação",
      year: 2023,
      questionCount: 3,
      duration: 45,
      difficulty: "Variado",
      color: "bg-purple-500",
    },
    {
      id: 3,
      name: "Simulado Matemática 2023",
      description: "Questões de Funções, Probabilidade e Proporções",
      year: 2023,
      questionCount: 2,
      duration: 30,
      difficulty: "Médio",
      color: "bg-green-500",
    },
    {
      id: 4,
      name: "Simulado Ciências 2023",
      description: "Questões de Física, Química e Biologia",
      year: 2023,
      questionCount: 2,
      duration: 30,
      difficulty: "Médio",
      color: "bg-orange-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <TopNav />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Simulados ENEM</h1>
          <p className="text-gray-600">
            Prepare-se para o ENEM com simulados baseados em questões de provas anteriores
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Questões</p>
                  <p className="text-2xl font-bold">{enemQuestions.length}+</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-500">Duração</p>
                  <p className="text-2xl font-bold">2-3h</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm text-gray-500">Simulados</p>
                  <p className="text-2xl font-bold">{simulados.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-500">Análise</p>
                  <p className="text-2xl font-bold">TRI</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Simulados Disponíveis</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {simulados.map((simulado) => (
              <Card key={simulado.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{simulado.name}</CardTitle>
                      <CardDescription>{simulado.description}</CardDescription>
                    </div>
                    <Badge variant="outline">{simulado.year}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Questões</p>
                      <p className="font-bold">{simulado.questionCount}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Duração</p>
                      <p className="font-bold">{simulado.duration} min</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Nível</p>
                      <p className="font-bold">{simulado.difficulty}</p>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => router.push(`/study/simula-pro/simulado?area=${simulado.id}`)}
                  >
                    Começar Simulado
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Questões por Área</CardTitle>
            <CardDescription>Treine tópicos específicos com questões selecionadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {areas.map((area) => {
                const count = enemQuestions.filter((q) => q.area === area).length
                return (
                  <Button
                    key={area}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start gap-2 bg-transparent"
                    onClick={() => setSelectedArea(area)}
                  >
                    <span className="font-bold text-lg">{area}</span>
                    <span className="text-sm text-gray-500">{count} questões</span>
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNav active="study" />
    </div>
  )
}
