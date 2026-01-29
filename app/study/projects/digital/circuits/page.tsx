import { TopNav } from "@/components/top-nav"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function DigitalCircuitsPage() {
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
          <h1 className="text-2xl font-bold">Prática de Circuitos Digitais</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Introdução</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Nesta seção, você terá a oportunidade de praticar a construção e análise de circuitos digitais.
              Começaremos com conceitos básicos e progrediremos para circuitos mais complexos.
            </p>
            {/* Add more introductory content here */}
          </CardContent>
        </Card>

        {/* Add interactive circuit building components or exercises here */}
      </main>

      <BottomNav active="study" />
    </div>
  )
}
