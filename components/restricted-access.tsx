"use client"

import { motion } from "framer-motion"
import { LogIn } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { TopNav } from "@/components/top-nav"
import { BottomNav } from "@/components/bottom-nav"

interface RestrictedAccessProps {
  activeNavItem?: string
}

export function RestrictedAccess({ activeNavItem = "home" }: RestrictedAccessProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopNav />
      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md"
        >
          <div className="bg-primary/5 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <LogIn className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Acesso Restrito</h2>
          <p className="text-gray-500 mb-8">
            Faça login ou crie uma conta para acessar todos os recursos de estudo e acompanhar seu progresso
          </p>
          <div className="space-x-4">
            <Button onClick={() => router.push("/login")} size="lg">
              Fazer Login
            </Button>
            <Button variant="outline" onClick={() => router.push("/register")} size="lg">
              Criar Conta
            </Button>
          </div>
        </motion.div>
      </main>
      <BottomNav active={activeNavItem} />
    </div>
  )
}
