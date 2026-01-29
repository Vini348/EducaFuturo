import { TopNav } from "@/components/top-nav"
import { BottomNav } from "@/components/bottom-nav"
import { ErrorCard } from "@/components/error-card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, ArrowLeft } from "lucide-react"
import Link from "next/link"

const errors = [
  {
    title: "Polaridade Incorreta de Componentes",
    description: "Conectar componentes como capacitores eletrolíticos ou diodos com a polaridade invertida",
    consequences: [
      "Dano permanente ao componente",
      "Risco de explosão em capacitores",
      "Circuito não funciona como esperado",
    ],
    preventions: [
      "Sempre verificar a polaridade antes da montagem",
      "Usar marcações claras no PCB",
      "Consultar o datasheet do componente",
    ],
  },
  {
    title: "Sobrecarga em Transistores",
    description: "Exceder os limites de corrente ou tensão do transistor",
    consequences: ["Queima do transistor", "Aquecimento excessivo", "Comportamento instável"],
    preventions: [
      "Calcular margens de segurança",
      "Usar dissipadores quando necessário",
      "Escolher transistores adequados à aplicação",
    ],
  },
  {
    title: "Curto-Circuito em Fontes de Alimentação",
    description: "Conexões incorretas causando curto-circuito na fonte de alimentação",
    consequences: ["Dano à fonte de alimentação", "Risco de incêndio", "Destruição de outros componentes do circuito"],
    preventions: [
      "Verificar todas as conexões antes de energizar",
      "Usar fusíveis de proteção",
      "Implementar proteção contra curto-circuito",
    ],
  },
  {
    title: "Soldagem Inadequada",
    description: "Problemas na qualidade da solda ou técnica incorreta de soldagem",
    consequences: ["Conexões intermitentes", "Juntas frias", "Falhas intermitentes no circuito"],
    preventions: [
      "Usar temperatura adequada do ferro de solda",
      "Limpar as superfícies antes da soldagem",
      "Praticar técnicas corretas de soldagem",
    ],
  },
  {
    title: "Interferência Eletromagnética",
    description: "Problemas causados por interferência entre componentes ou circuitos",
    consequences: ["Funcionamento errático", "Ruído em sinais analógicos", "Comunicação digital corrompida"],
    preventions: [
      "Usar blindagem adequada",
      "Separar circuitos analógicos e digitais",
      "Implementar filtragem adequada",
    ],
  },
  {
    title: "Dimensionamento Incorreto de Componentes",
    description: "Escolha de componentes com especificações inadequadas para a aplicação",
    consequences: ["Falha prematura dos componentes", "Desempenho abaixo do esperado", "Desperdício de recursos"],
    preventions: [
      "Calcular corretamente os requisitos do circuito",
      "Considerar margens de segurança",
      "Consultar notas de aplicação",
    ],
  },
]

export default function ErrorsPage() {
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
          <h1 className="text-2xl font-bold">Análise de Erros Comuns</h1>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Aprenda com os erros mais comuns em projetos eletrônicos e como evitá-los.
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-2 gap-6">
          {errors.map((error, index) => (
            <ErrorCard
              key={index}
              title={error.title}
              description={error.description}
              consequences={error.consequences}
              preventions={error.preventions}
            />
          ))}
        </div>
      </main>

      <BottomNav active="study" />
    </div>
  )
}
