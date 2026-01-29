import Link from "next/link"
import { Home, BookOpen, GraduationCap, MessageSquare, Calculator, LineChart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BottomNavProps {
  active: "home" | "review" | "study" | "forum" | "calculator" | "performance"
}

export function BottomNav({ active }: BottomNavProps) {
  const activeClass = "text-primary bg-primary/10"

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t dark:border-gray-800 p-2 flex justify-around items-center">
      <Link href="/" passHref>
        <Button
          variant="ghost"
          size="sm"
          className={`flex flex-col items-center ${active === "home" ? activeClass : ""}`}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs">Início</span>
        </Button>
      </Link>
      <Link href="/review" passHref>
        <Button
          variant="ghost"
          size="sm"
          className={`flex flex-col items-center ${active === "review" ? activeClass : ""}`}
        >
          <BookOpen className="h-5 w-5" />
          <span className="text-xs">Revisão</span>
        </Button>
      </Link>
      <Link href="/study" passHref>
        <Button
          variant="ghost"
          size="sm"
          className={`flex flex-col items-center ${active === "study" ? activeClass : ""}`}
        >
          <GraduationCap className="h-5 w-5" />
          <span className="text-xs">Estudo</span>
        </Button>
      </Link>
      <Link href="/forum" passHref>
        <Button
          variant="ghost"
          size="sm"
          className={`flex flex-col items-center ${active === "forum" ? activeClass : ""}`}
        >
          <MessageSquare className="h-5 w-5" />
          <span className="text-xs">Fórum</span>
        </Button>
      </Link>
      <Link href="/calculator" passHref>
        <Button
          variant="ghost"
          size="sm"
          className={`flex flex-col items-center ${active === "calculator" ? activeClass : ""}`}
        >
          <Calculator className="h-5 w-5" />
          <span className="text-xs">Calculadora</span>
        </Button>
      </Link>
      <Link href="/performance" passHref>
        <Button
          variant="ghost"
          size="sm"
          className={`flex flex-col items-center ${active === "performance" ? activeClass : ""}`}
        >
          <LineChart className="h-5 w-5" />
          <span className="text-xs">Desempenho</span>
        </Button>
      </Link>
    </nav>
  )
}
