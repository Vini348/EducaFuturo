"use client"
import { Database } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Definição simplificada dos tipos
interface ComponentModel {
  name: string
  characteristics: { [key: string]: string }
  applications: string[]
}

interface ComponentCategory {
  id: string
  name: string
  symbol: string
  description: string
  models: ComponentModel[]
  category: string
  characteristics: string[]
}

// Dados dos componentes
const components: ComponentCategory[] = [
  {
    id: "resistor",
    name: "Resistor",
    symbol: "R",
    description: "Componente que limita o fluxo de corrente elétrica em um circuito.",
    category: "passive",
    characteristics: ["Medido em Ohms (Ω)", "Código de cores", "Tolerância"],
    models: [
      {
        name: "Resistor de Filme Metálico",
        characteristics: {
          Tolerância: "±1%",
          Potência: "1/4W",
          Resistência: "100Ω - 1MΩ",
        },
        applications: ["Divisores de tensão", "Filtros", "Circuitos de polarização"],
      },
      {
        name: "Resistor de Filme de Carbono",
        characteristics: {
          Tolerância: "±5%",
          Potência: "1/8W - 1W",
          Resistência: "1Ω - 10MΩ",
        },
        applications: ["Circuitos de uso geral", "Projetos de baixo custo"],
      },
    ],
  },
  {
    id: "capacitor",
    name: "Capacitor",
    symbol: "C",
    description: "Armazena carga elétrica e é usado para filtrar sinais ou armazenar energia temporariamente.",
    category: "passive",
    characteristics: ["Capacitância", "Tensão de trabalho", "Tolerância"],
    models: [
      {
        name: "Capacitor Cerâmico",
        characteristics: {
          Capacitância: "1pF - 1µF",
          Tensão: "6.3V - 50V",
          Tolerância: "±5% - ±20%",
        },
        applications: ["Filtros", "Osciladores", "Acoplamento AC"],
      },
      {
        name: "Capacitor Eletrolítico",
        characteristics: {
          Capacitância: "1µF - 10000µF",
          Tensão: "6.3V - 450V",
          Tolerância: "±20%",
        },
        applications: ["Filtros de fonte", "Armazenamento de energia", "Circuitos de temporização"],
      },
    ],
  },
  {
    id: "inductor",
    name: "Indutor",
    symbol: "L",
    description: "Armazena energia em um campo magnético e resiste a mudanças na corrente.",
    characteristics: ["Indutância (H)", "Corrente nominal", "Frequência de ressonância"],
    category: "passive",
    models: [],
  },
  {
    id: "diode",
    name: "Diodo",
    symbol: "D",
    description: "Permite o fluxo de corrente em apenas uma direção.",
    characteristics: ["Tensão direta", "Corrente reversa máxima", "Tipo de diodo"],
    category: "semiconductor",
    models: [],
  },
  {
    id: "transistor",
    name: "Transistor",
    symbol: "Q",
    description: "Usado para amplificar ou chavear sinais eletrônicos.",
    characteristics: ["Tipo de transistor (BJT, MOSFET, etc.)", "Ganho de corrente", "Tensão de ruptura"],
    category: "semiconductor",
    models: [],
  },
]

// Componente de card simplificado
function SimpleComponentCard({ component }: { component: ComponentCategory }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all">
      <CardHeader className="bg-blue-50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-500" />
            {component.name}
          </CardTitle>
          <Badge variant="secondary">{component.symbol}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-sm text-gray-600 mb-4">{component.description}</p>
        <h4 className="font-semibold mb-2">Características:</h4>
        <ul className="list-disc list-inside text-sm text-gray-600">
          {component.characteristics.slice(0, 3).map((characteristic, index) => (
            <li key={index}>{characteristic}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export default function ComponentsPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Banco de Componentes</h1>
      <p>Esta é uma página de teste simples para verificar o roteamento.</p>
    </div>
  )
}
