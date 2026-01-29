"use client"

import { useState, useEffect } from "react"
import { TopNav } from "@/components/top-nav"
import { BottomNav } from "@/components/bottom-nav"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CircuitBoardIcon, ExternalLink, AlertTriangle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useStudyTracker } from "@/hooks/use-study-tracker"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

const simulators = [
  {
    id: "falstad",
    name: "Falstad Circuit Simulator",
    description: "Simulador interativo de circuitos elétricos e eletrônicos",
    advantage: (
      <ul className="list-disc pl-5 space-y-1">
        <li>Simulação em tempo real com visualização dinâmica de correntes e tensões</li>
        <li>Interface intuitiva ideal para iniciantes e estudantes</li>
        <li>Ampla variedade de componentes e circuitos pré-construídos</li>
        <li>Gratuito e acessível diretamente pelo navegador</li>
      </ul>
    ),
    url: "https://falstad.com/circuit/",
    embedUrl: "https://falstad.com/circuit/circuitjs.html",
  },
  {
    id: "circuitlab",
    name: "CircuitLab",
    description: "Simulador e editor de esquemáticos baseado na web",
    advantage: (
      <ul className="list-disc pl-5 space-y-1">
        <li>Interface intuitiva e fácil de usar, ideal para estudantes e hobbyistas</li>
        <li>Simulações de DC, AC, e transiente com análise gráfica</li>
        <li>Compartilhamento fácil de circuitos através de links ou incorporação</li>
        <li>Recursos educacionais integrados e exemplos de circuitos</li>
      </ul>
    ),
    url: "https://www.circuitlab.com/",
    embedUrl: "https://www.circuitlab.com/editor/",
  },
  {
    id: "everycircuit",
    name: "EveryCircuit",
    description: "Simulador de circuitos interativo e visualmente atraente",
    advantage: (
      <ul className="list-disc pl-5 space-y-1">
        <li>Visualização animada do fluxo de corrente e tensões</li>
        <li>Biblioteca extensa de circuitos e componentes</li>
        <li>Versão gratuita com recursos básicos disponível online</li>
        <li>Excelente para aprendizagem e experimentação rápida</li>
      </ul>
    ),
    url: "https://everycircuit.com/",
    embedUrl: "https://everycircuit.com/app",
  },
  {
    id: "circuitverse",
    name: "CircuitVerse",
    description: "Plataforma de simulação de circuitos digitais",
    advantage: (
      <ul className="list-disc pl-5 space-y-1">
        <li>Focado em circuitos lógicos e digitais, ideal para estudantes de computação</li>
        <li>Ferramentas para criação de circuitos sequenciais e combinacionais</li>
        <li>Recursos educacionais integrados e tutoriais interativos</li>
        <li>Suporte para colaboração e compartilhamento de projetos</li>
      </ul>
    ),
    url: "https://circuitverse.org/",
    embedUrl: "https://circuitverse.org/simulator",
  },
  {
    id: "tinkercad",
    name: "Tinkercad Circuits",
    description: "Simulador de circuitos e plataforma de design da Autodesk",
    advantage: (
      <ul className="list-disc pl-5 space-y-1">
        <li>Interface amigável e intuitiva, ótima para iniciantes</li>
        <li>Integração com projetos 3D e programação Arduino</li>
        <li>Ampla biblioteca de componentes e projetos prontos</li>
        <li>Totalmente gratuito e baseado na web</li>
      </ul>
    ),
    url: "https://www.tinkercad.com/circuits",
    embedUrl: "https://www.tinkercad.com/things/create?type=circuits&collection=designs",
  },
]

export default function SimuladoresPage() {
  const [activeSimulator, setActiveSimulator] = useState("falstad")
  const [iframeLoading, setIframeLoading] = useState(true)
  const [iframeError, setIframeError] = useState(false)
  const studyTracker = useStudyTracker("simulators")

  useEffect(() => {
    setIframeLoading(true)
    setIframeError(false)
  }, [activeSimulator])

  const handleIframeLoad = () => {
    setIframeLoading(false)
  }

  const handleIframeError = () => {
    setIframeLoading(false)
    setIframeError(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <TopNav />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <h1 className="text-2xl font-bold">Simuladores de Circuitos</h1>
        <div className="mb-4">
          <Link href="/review">
            <Button variant="ghost" size="sm" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Revisão
            </Button>
          </Link>
        </div>

        <Card className="border-0 shadow-none sticky top-0 bg-gray-50 z-10">
          <CardContent className="p-0">
            <Tabs value={activeSimulator} onValueChange={setActiveSimulator}>
              <TabsList className="w-full justify-start h-auto flex-wrap gap-2 bg-transparent p-0">
                {simulators.map((simulator) => (
                  <TabsTrigger
                    key={simulator.id}
                    value={simulator.id}
                    className={`data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2 ${
                      simulator.id === "circuitverse" || simulator.id === "tinkercad"
                        ? "bg-yellow-100 text-yellow-800"
                        : ""
                    }`}
                  >
                    {simulator.id === "circuitverse" || simulator.id === "tinkercad" ? (
                      <AlertTriangle className="h-4 w-4 text-yellow-800" />
                    ) : (
                      <CircuitBoardIcon className="h-4 w-4" />
                    )}
                    {simulator.name}
                    {(simulator.id === "circuitverse" || simulator.id === "tinkercad") && (
                      <span className="text-xs bg-yellow-200 px-1 rounded">Em manutenção</span>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {simulators.map((simulator) => (
          <Card key={simulator.id} className={`border shadow-sm ${activeSimulator === simulator.id ? "" : "hidden"}`}>
            <CardHeader>
              <CardTitle className="text-xl">{simulator.name}</CardTitle>
              <CardDescription>
                {simulator.description}
                {(simulator.id === "circuitverse" || simulator.id === "tinkercad") && (
                  <span className="mt-2 text-yellow-600 block">
                    <AlertTriangle className="inline-block h-4 w-4 mr-1" />
                    Este simulador está temporariamente em manutenção ou pode apresentar problemas.
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <strong>Vantagens:</strong>
                {simulator.advantage}
              </div>
              <div className="flex justify-end">
                <Button className="bg-[#4F46E5] hover:bg-[#4F46E5]/90" asChild>
                  <a href={simulator.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Abrir em Nova Aba
                  </a>
                </Button>
              </div>
              {simulator.embedUrl ? (
                <div className="aspect-video w-full relative">
                  {iframeLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                    </div>
                  )}
                  <iframe
                    src={simulator.embedUrl}
                    className={`w-full h-full border-0 ${iframeLoading ? "invisible" : "visible"}`}
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                    allowFullScreen
                  />
                  {iframeError && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Erro ao carregar o simulador</AlertTitle>
                      <AlertDescription>
                        Não foi possível carregar o simulador. Por favor, tente abrir em uma nova aba ou verifique sua
                        conexão.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ) : (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Simulador não disponível para incorporação</AlertTitle>
                  <AlertDescription>
                    Este simulador não pode ser incorporado diretamente. Por favor, use o botão "Abrir em Nova Aba" para
                    acessá-lo.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        ))}
      </main>

      <BottomNav active="review" />
    </div>
  )
}
