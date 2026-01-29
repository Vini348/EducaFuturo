"use client"

import { TopNav } from "@/components/top-nav"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Book, Code, Cpu, Zap } from "lucide-react"

export default function DigitalElectronicsPage() {
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
          <h1 className="text-2xl font-bold">Eletrônica Digital</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Visão Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Fundamentos e aplicações de sistemas digitais, desde portas lógicas até microprocessadores.</p>
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
                <li>Sistemas de Numeração</li>
                <li>Álgebra Booleana</li>
                <li>Portas Lógicas</li>
                <li>Circuitos Combinacionais</li>
                <li>Circuitos Sequenciais</li>
                <li>Contadores e Registradores</li>
                <li>Conversores A/D</li>
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
                <li>Computadores e Microprocessadores</li>
                <li>Sistemas de Controle Digital</li>
                <li>Comunicações Digitais</li>
                <li>Processamento Digital de Sinais</li>
                <li>Sistemas Embarcados</li>
                <li>Internet das Coisas</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Ferramentas e Tecnologias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              <li>Linguagens de Descrição de Hardware</li>
              <li>FPGAs e CPLDs</li>
              <li>Simuladores de Circuitos Digitais</li>
              <li>Analisadores Lógicos</li>
              <li>Ferramentas de Síntese e Implementação</li>
            </ul>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Link href="/study">
            <Button className="gap-2">
              <Zap className="h-5 w-5" />
              Começar a Estudar Eletrônica Digital
            </Button>
          </Link>
        </div>
      </main>

      <BottomNav active="home" />
    </div>
  )
}
