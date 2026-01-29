import { TopNav } from "@/components/top-nav"
import { BottomNav } from "@/components/bottom-nav"
import { MindMapCard } from "@/components/mind-map-card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { mindmaps } from "@/data/mindmaps"

export default function MindMapsPage() {
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
          <h1 className="text-2xl font-bold">Mapas Mentais e Infográficos</h1>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mindmaps.map((mindmap) => (
            <MindMapCard key={mindmap.id} {...mindmap} />
          ))}
        </div>
      </main>

      <BottomNav active="study" />
    </div>
  )
}
