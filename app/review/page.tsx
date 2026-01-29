import { TopNav } from "@/components/top-nav"
import { BottomNav } from "@/components/bottom-nav"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { BookOpenCheck, GamepadIcon, BrainCircuit, FlaskConical } from "lucide-react"

export default function ReviewPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <TopNav />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Revisão</h1>
          <p className="text-muted-foreground">Escolha um método de revisão para continuar seus estudos</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/flashcards" className="block">
            <Card className="group relative overflow-hidden border-2 hover:border-[#4F46E5] transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-[#4F46E5] to-[#818CF8] opacity-0 group-hover:opacity-10 transition-opacity" />
              <div className="p-6">
                <div className="mb-8 flex items-center justify-between">
                  <div className="rounded-lg bg-[#4F46E5]/10 p-3">
                    <BookOpenCheck className="h-8 w-8 text-[#4F46E5]" />
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <div className="ml-2 rounded-full bg-[#4F46E5]/10 px-3 py-1 text-[#4F46E5]">Recomendado</div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">FlashCards</h3>
                  <p className="mt-2 text-muted-foreground">
                    Revise conceitos importantes usando cartões de memória interativos
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/review/questionarios" className="block">
            <Card className="group relative overflow-hidden border-2 hover:border-[#9333EA] transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-[#9333EA] to-[#A855F7] opacity-0 group-hover:opacity-10 transition-opacity" />
              <div className="p-6">
                <div className="mb-8">
                  <div className="rounded-lg bg-[#9333EA]/10 p-3 w-fit">
                    <BrainCircuit className="h-8 w-8 text-[#9333EA]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Questionários</h3>
                  <p className="mt-2 text-muted-foreground">
                    Teste seus conhecimentos com questões específicas de cada tópico
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/review/games" className="block">
            <Card className="group relative overflow-hidden border-2 hover:border-[#22C55E] transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-[#22C55E] to-[#4ADE80] opacity-0 group-hover:opacity-10 transition-opacity" />
              <div className="p-6">
                <div className="mb-8">
                  <div className="rounded-lg bg-[#22C55E]/10 p-3 w-fit">
                    <GamepadIcon className="h-8 w-8 text-[#22C55E]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Jogos</h3>
                  <p className="mt-2 text-muted-foreground">
                    Aprenda enquanto se diverte com jogos educativos interativos
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/review/simuladores" className="block">
            <Card className="group relative overflow-hidden border-2 hover:border-[#F59E0B] transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-[#F59E0B] to-[#FBBF24] opacity-0 group-hover:opacity-10 transition-opacity" />
              <div className="p-6">
                <div className="mb-8">
                  <div className="rounded-lg bg-[#F59E0B]/10 p-3 w-fit">
                    <FlaskConical className="h-8 w-8 text-[#F59E0B]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Simuladores</h3>
                  <p className="mt-2 text-muted-foreground">
                    Pratique com simuladores de circuitos e experimentos virtuais
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </main>

      <BottomNav active="review" />
    </div>
  )
}
