"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/authContext"
import { TopNav } from "@/components/top-nav"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { AchievementBadge } from "@/components/achievement-badge"
import { getUserAchievements, getAchievementStats, type Achievement } from "@/lib/achievements-system"
import { Loader2, Trophy, Target, Award, Crown, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export default function AchievementsPage() {
  const { user } = useAuth()
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    unlocked: 0,
    bronze: 0,
    prata: 0,
    ouro: 0,
    platina: 0,
    diamante: 0,
  })

  useEffect(() => {
    if (user?.id) {
      loadAchievements()
    }
  }, [user])

  const loadAchievements = async () => {
    if (!user?.id) return

    setLoading(true)
    try {
      const { data } = await getUserAchievements(user.id, true)
      if (data) {
        setAchievements(data)
      }

      const achievementStats = await getAchievementStats(user.id)
      setStats(achievementStats)
    } catch (error) {
      console.error("Erro ao carregar conquistas:", error)
    } finally {
      setLoading(false)
    }
  }

  const groupedAchievements = {
    iniciante: achievements.filter((a) => a.category === "iniciante"),
    intermediario: achievements.filter((a) => a.category === "intermediario"),
    avancado: achievements.filter((a) => a.category === "avancado"),
    mestre: achievements.filter((a) => a.category === "mestre"),
  }

  const completionPercentage = stats.total > 0 ? (stats.unlocked / stats.total) * 100 : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <TopNav />
        <div className="flex items-center justify-center h-[calc(100vh-140px)]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />

      <main className="container mx-auto px-4 py-6 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold">Conquistas</h1>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Seu Progresso
              </CardTitle>
              <CardDescription>Acompanhe suas conquistas e badges desbloqueados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">
                    {stats.unlocked} de {stats.total} conquistas
                  </span>
                  <span className="text-sm text-muted-foreground">{Math.round(completionPercentage)}%</span>
                </div>
                <Progress value={completionPercentage} className="h-3" />
              </div>

              <div className="grid grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">{stats.bronze}</div>
                  <div className="text-xs text-muted-foreground">Bronze</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-500">{stats.prata}</div>
                  <div className="text-xs text-muted-foreground">Prata</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-500">{stats.ouro}</div>
                  <div className="text-xs text-muted-foreground">Ouro</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-500">{stats.platina}</div>
                  <div className="text-xs text-muted-foreground">Platina</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">{stats.diamante}</div>
                  <div className="text-xs text-muted-foreground">Diamante</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="iniciante" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="iniciante">
                <Award className="w-4 h-4 mr-2" />
                Iniciante
              </TabsTrigger>
              <TabsTrigger value="intermediario">
                <Trophy className="w-4 h-4 mr-2" />
                Intermediário
              </TabsTrigger>
              <TabsTrigger value="avancado">
                <Sparkles className="w-4 h-4 mr-2" />
                Avançado
              </TabsTrigger>
              <TabsTrigger value="mestre">
                <Crown className="w-4 h-4 mr-2" />
                Mestre
              </TabsTrigger>
            </TabsList>

            {Object.entries(groupedAchievements).map(([category, categoryAchievements]) => (
              <TabsContent key={category} value={category}>
                <Card>
                  <CardHeader>
                    <CardTitle className="capitalize">{category}</CardTitle>
                    <CardDescription>
                      {categoryAchievements.filter((a) => a.unlocked).length} de {categoryAchievements.length}{" "}
                      conquistas desbloqueadas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {categoryAchievements.map((achievement) => (
                        <AchievementBadge
                          key={achievement.achievement_id}
                          name={achievement.name}
                          description={achievement.description}
                          icon={achievement.icon}
                          tier={achievement.tier}
                          progress={achievement.progress}
                          unlocked={achievement.unlocked}
                          size="md"
                          showProgress={true}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  )
}
