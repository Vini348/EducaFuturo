"use client"

import { TopNav } from "@/components/top-nav"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Book, Cpu, AudioWaveformIcon as Waveform, Zap } from "lucide-react"

export default function AnalogElectronicsPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <TopNav />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Eletrônica Analógica</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Visão Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Estudo de circuitos e sistemas que trabalham com sinais contínuos no tempo.</p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                Tópicos Principais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                <li>Teoria de Circuitos</li>
                <li>Semicondutores</li>
                <li>Diodos e Aplicações</li>
                <li>Transistores</li>
                <li>Amplificadores Operacionais</li>
                <li>Filtros Analógicos</li>
                <li>Osciladores</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5" />
                Aplicações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                <li>Sistemas de Áudio</li>
                <li>Instrumentação e Medição</li>
                <li>Controle de Processos Industriais</li>
                <li>Comunicações Analógicas</li>
                <li>Sensores e Transdutores</li>
                <li>Fontes de Alimentação Lineares</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Waveform className="h-5 w-5" />
              Ferramentas e Tecnologias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              <li>Osciloscópios</li>
              <li>Geradores de Função</li>
              <li>Multímetros</li>
              <li>Software de Simulação SPICE</li>
              <li>Analisadores de Espectro</li>
            </ul>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Link href="/study">
            <Button className="gap-2">
              <Zap className="h-5 w-5" />
              Começar a Estudar Eletrônica Analógica
            </Button>
          </Link>
        </div>
      </main>

      <BottomNav active="home" />
    </div>
  )
}
