import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TopNav } from "@/components/top-nav"
import { BottomNav } from "@/components/bottom-nav"
import { FileQuestion } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />

      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center space-y-8">
          <div className="bg-[#4F46E5] rounded-full p-6">
            <FileQuestion className="w-16 h-16 text-white" />
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tighter">Página não encontrada</h1>
            <p className="text-gray-500 max-w-[600px] mx-auto">
              Desculpe, não conseguimos encontrar a página que você está procurando. Ela pode ter sido movida ou não
              existe mais.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild>
              <Link href="/">Voltar ao Início</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/study">Ir para Estudos</Link>
            </Button>
          </div>
        </div>
      </main>

      <BottomNav active="home" />
    </div>
  )
}
