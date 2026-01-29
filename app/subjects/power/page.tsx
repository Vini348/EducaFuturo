"use client"

import { TopNav } from "@/components/top-nav"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Book, Cpu, CloudLightningIcon as Lightning, Zap } from "lucide-react"

export default function PowerElectronicsPage() {
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
          <h1 className="text-2xl font-bold">Eletrônica de Potência</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Visão Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Estudo e aplicação de dispositivos eletrônicos para controle e conversão de energia elétrica.</p>
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
                <li>Dispositivos Semicondutores de Potência</li>
                <li>Retificadores AC/DC</li>
                <li>Conversores DC/DC</li>
                <li>Inversores</li>
                <li>Conversores AC/AC</li>
                <li>Fontes Chaveadas</li>
                <li>Acionamentos de Motores</li>
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
                <li>Sistemas de Energia Renovável</li>
                <li>Acionamentos Industriais</li>
                <li>Transmissão HVDC</li>
                <li>Carregadores de Bateria</li>
                <li>Iluminação LED de Alta Potência</li>
                <li>Veículos Elétricos e Híbridos</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightning className="h-5 w-5" />
              Ferramentas e Tecnologias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              <li>Simuladores de Circuitos de Potência</li>
              <li>Analisadores de Potência</li>
              <li>Osciloscópios de Alta Tensão</li>
              <li>Controladores Digitais de Sinal</li>
              <li>Software de Design Térmico</li>
            </ul>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Link href="/study">
            <Button className="gap-2">
              <Zap className="h-5 w-5" />
              Começar a Estudar Eletrônica de Potência
            </Button>
          </Link>
        </div>
      </main>

      <BottomNav active="home" />
    </div>
  )
}
