"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Settings, LogOut, User } from "lucide-react"
import { useAuth } from "@/lib/authContext"
import Link from "next/link"
import Image from "next/image"
import { UserLevelBadge } from "@/components/user-level-badge"
import { getUserLevel, getLevelNameClass, type UserLevel } from "@/lib/user-level-system"

export function TopNav() {
  const { user, logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [userLevel, setUserLevel] = useState<UserLevel>("iniciante")
  const [userRole, setUserRole] = useState<string>("user")

  useEffect(() => {
    if (user) {
      loadUserLevel()
    }
  }, [user])

  const loadUserLevel = async () => {
    if (!user) return
    const level = await getUserLevel(user.id)
    setUserLevel(level)

    const { supabase } = await import("@/lib/supabase")
    const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single()
    if (data?.role) {
      setUserRole(data.role)
    }
  }

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await logout()
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const getAvatarUrl = () => {
    const avatarUrl = user?.user_metadata?.avatar_url
    if (!avatarUrl || avatarUrl.includes("blob:") || avatarUrl.includes("undefined")) {
      return null
    }
    return avatarUrl
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative">
              <Image
                src="/images/1000000202-c7314e270483522676c6ce0ca8720786-03-03-2024-12-19-24-removebg-preview.png"
                alt="EducaFuturo Logo"
                width={32}
                height={32}
                className="h-8 w-8"
              />
            </div>
            <span className="text-xl font-bold text-blue-600">EducaFuturo</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={getAvatarUrl() || "/placeholder.svg"} alt={user.email || "User"} />
                    <AvatarFallback>{user.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-2">
                    <p className={`text-sm font-bold leading-none ${getLevelNameClass(userLevel)}`}>
                      {user.user_metadata?.full_name || "Usuário"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    <UserLevelBadge level={userLevel} role={userRole} size="sm" />
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account">
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{isLoggingOut ? "Saindo..." : "Sair"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Entrar
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Cadastrar</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
