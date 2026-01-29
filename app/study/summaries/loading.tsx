import { TopNav } from "@/components/top-nav"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Search, BookOpen } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function SummariesLoading() {
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <TopNav />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" disabled>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold">Resumos</h1>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input type="search" placeholder="Pesquisar resumos..." className="pl-10" disabled />
        </div>

        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all" disabled>
              Todos
            </TabsTrigger>
            <TabsTrigger value="digital" disabled>
              Digital
            </TabsTrigger>
            <TabsTrigger value="analog" disabled>
              Analógica
            </TabsTrigger>
            <TabsTrigger value="power" disabled>
              Potência
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-gray-300" />
                    <Skeleton className="h-6 w-48" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                  <Skeleton className="h-10 w-24 mt-4" />
                </CardContent>
              </Card>
            ))}
        </div>
      </main>

      <BottomNav active="study" />
    </div>
  )
}
