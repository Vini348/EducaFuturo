"use client"

import { useEffect, useState } from "react"
import { Trophy, Medal, Award } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/authContext"
import { LEARNING_STYLES } from "@/lib/learning-style-adapter"
import { UserLevelBadge } from "@/components/user-level-badge"
import { getLevelNameClass, type UserLevel } from "@/lib/user-level-system"

interface RankingStudent {
  id: string
  name: string
  points: number
  position: number
  avatar?: string
  learningStyle?: string
  userLevel?: UserLevel
  role?: string
}

export default function SchoolRanking() {
  const { user } = useAuth()
  const [ranking, setRanking] = useState<RankingStudent[]>([])
  const [filteredRanking, setFilteredRanking] = useState<RankingStudent[]>([])
  const [loading, setLoading] = useState(true)
  const [userSchoolId, setUserSchoolId] = useState<string | null>(null)
  const [selectedStyle, setSelectedStyle] = useState<string>("all")

  useEffect(() => {
    loadRanking()
  }, [user])

  useEffect(() => {
    if (selectedStyle === "all") {
      setFilteredRanking(ranking)
    } else {
      setFilteredRanking(ranking.filter((s) => s.learningStyle === selectedStyle))
    }
  }, [selectedStyle, ranking])

  const loadRanking = async () => {
    if (!user) return

    try {
      setLoading(true)

      const { data: profileData } = await supabase.from("profiles").select("school_id").eq("id", user.id).single()

      if (!profileData?.school_id) {
        setLoading(false)
        return
      }

      setUserSchoolId(profileData.school_id)

      const { data: rankingData, error } = await supabase
        .from("profiles")
        .select("id, full_name, total_points, avatar_url, learning_style, user_level, role")
        .eq("school_id", profileData.school_id)
        .order("total_points", { ascending: false })
        .limit(10)

      if (error) throw error

      const formattedRanking: RankingStudent[] = (rankingData || []).map((student, index) => ({
        id: student.id,
        name: student.full_name || "Usuário",
        points: student.total_points || 0,
        position: index + 1,
        avatar: student.avatar_url || undefined,
        learningStyle: student.learning_style,
        userLevel: (student.user_level as UserLevel) || "iniciante",
        role: student.role || "user",
      }))

      setRanking(formattedRanking)
      setFilteredRanking(formattedRanking)
    } catch (error) {
      console.error("Erro ao carregar ranking:", error)
    } finally {
      setLoading(false)
    }
  }

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-semibold">
            {position}
          </div>
        )
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getStyleBadge = (style: string) => {
    const styleInfo = LEARNING_STYLES[style]
    if (!styleInfo) return null
    return styleInfo.style.charAt(0).toUpperCase() + styleInfo.style.slice(1)
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3 animate-pulse">
            <div className="h-5 w-5 bg-muted rounded-full" />
            <div className="h-10 w-10 bg-muted rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (ranking.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <Trophy className="h-10 w-10 text-muted-foreground/50 mb-2" />
        <p className="text-sm text-muted-foreground">Nenhum estudante no ranking ainda</p>
        <p className="text-xs text-muted-foreground mt-1">Complete desafios para aparecer aqui!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Tabs value={selectedStyle} onValueChange={setSelectedStyle} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all" className="text-xs">
            Todos
          </TabsTrigger>
          {Object.entries(LEARNING_STYLES).map(([key, style]) => (
            <TabsTrigger key={key} value={key} className="text-xs">
              {style.style.charAt(0).toUpperCase()}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedStyle} className="space-y-3 mt-4">
          {filteredRanking.length > 0 ? (
            filteredRanking.map((student) => (
              <div
                key={student.id}
                className={`flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-muted/50 ${
                  student.position <= 3 ? "bg-muted/30" : ""
                } ${student.id === user?.id ? "ring-2 ring-primary/50" : ""}`}
              >
                <div className="flex-shrink-0">{getPositionIcon(student.position)}</div>

                <Avatar className="h-10 w-10">
                  {student.avatar && <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />}
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {getInitials(student.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-semibold truncate ${getLevelNameClass(student.userLevel || "iniciante")}`}
                  >
                    {student.name}
                    {student.id === user?.id && <span className="text-xs text-primary ml-1">(Você)</span>}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs text-muted-foreground">{student.points.toLocaleString()} pontos</p>
                    <UserLevelBadge level={student.userLevel || "iniciante"} role={student.role} size="sm" />
                    {student.learningStyle && (
                      <Badge variant="secondary" className="text-xs px-1.5 py-0">
                        {getStyleBadge(student.learningStyle)}
                      </Badge>
                    )}
                    {student.position === 1 && (
                      <Badge variant="default" className="text-xs px-1.5 py-0">
                        Líder
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-muted-foreground py-4">
              Nenhum estudante com este estilo de aprendizado ainda
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
