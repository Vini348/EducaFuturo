import { TopNav } from "@/components/top-nav"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Play } from "lucide-react"
import Link from "next/link"

export default function DCDCConvertersPage() {
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
          <h1 className="text-2xl font-bold">Conversores CC-CC</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Aula em Vídeo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-gray-200 flex items-center justify-center">
              {/* Replace this with an actual video player component */}
              <Button>
                <Play className="mr-2 h-4 w-4" />
                Assistir Aula
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Conversores CC-CC são circuitos eletrônicos de potência que convertem uma tensão CC de entrada em uma
              tensão CC de saída com um nível diferente. Eles são amplamente utilizados em fontes de alimentação
              chaveadas e em sistemas de energia renovável.
            </p>
            {/* Add more content about DC-DC converters here */}
          </CardContent>
        </Card>

        {/* Add more sections, quizzes, or interactive elements as needed */}
      </main>

      <BottomNav active="study" />
    </div>
  )
}
