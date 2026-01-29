import { TopNav } from "@/components/top-nav"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function OperationalAmplifiersPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <TopNav />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/performance">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Amplificadores Operacionais</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Amplificadores operacionais são dispositivos eletrônicos versáteis usados em uma variedade de aplicações
              de processamento de sinais analógicos. Eles são projetados para amplificar a diferença entre duas entradas
              de tensão e produzir uma saída proporcional a essa diferença.
            </p>
            {/* Add more content about operational amplifiers here */}
          </CardContent>
        </Card>

        {/* Add more sections, examples, or interactive elements as needed */}
      </main>

      <BottomNav active="study" />
    </div>
  )
}
