"use client"

import { CardFooter } from "@/components/ui/card"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ImageUploadDialog } from "@/components/image-upload-dialog"
import { useToast } from "@/components/ui/use-toast"
import {
  Loader2,
  Camera,
  UserIcon,
  Shield,
  LogOut,
  Save,
  Key,
  Bell,
  HelpCircle,
  Home,
  ArrowLeft,
  History,
  Trophy,
  Award,
} from "lucide-react"
import ChangePasswordDialog from "@/components/change-password-dialog"
import { useAuth } from "@/lib/authContext"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { AdminBadge, ModeratorBadge } from "@/components/admin-badge"
// Adicionar o import das funções de preferências no topo do arquivo
import {
  saveProfilePreferences,
  saveStudyPreferences,
  saveNotificationPreferences,
  getUserPreferencesHistory,
  type PreferenceHistoryItem,
} from "@/lib/user-preferences"
import { supabase } from "@/lib/supabaseClient"
// Adicionando import para o Badge de Conquista
import { AchievementBadge } from "@/components/achievement-badge"

type UserRole = "user" | "admin" | "moderator"

export default function AccountPage() {
  // Adicione esta função no início do componente, após as declarações de estado
  const getSupabaseClient = () => {
    return supabase
  }
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("")
  const [saving, setSaving] = useState(false)
  const [savingNotifications, setSavingNotifications] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [notificationPreferences, setNotificationPreferences] = useLocalStorage("notification-preferences", {
    studyReminders: true,
    contentUpdates: true,
    forumResponses: true,
  })
  const router = useRouter()
  const { toast } = useToast()
  const [error, setError] = useState<string | null>(null)
  const { user: authUser, loading: authLoading, refreshUser } = useAuth()
  const [joinDate, setJoinDate] = useState<string | null>(null)
  const [lastActive, setLastActive] = useState<string | null>(null)
  const [studyGoal, setStudyGoal] = useState<number>(60)
  const [pomodoroDuration, setPomodoroDuration] = useState<number>(25)

  // Adicionar estado para o histórico de preferências
  const [preferencesHistory, setPreferencesHistory] = useState<PreferenceHistoryItem[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [userRole, setUserRole] = useState<UserRole>("user")

  const [userAchievements, setUserAchievements] = useState<any[]>([])
  const [loadingAchievements, setLoadingAchievements] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Se já temos o usuário do contexto de autenticação, use-o
        if (authUser) {
          setUser(authUser)
          setName(authUser.fullName || authUser.user_metadata?.full_name || "")
          setProfileImage(authUser.profileImage || authUser.user_metadata?.avatar_url || null)

          const { data: profile } = await supabase.from("profiles").select("role").eq("id", authUser.id).single()

          if (profile?.role) {
            setUserRole(profile.role as UserRole)
          }

          // Carregar preferências de estudo e notificação dos metadados do usuário
          if (authUser.user_metadata?.studyPreferences) {
            setStudyGoal(authUser.user_metadata.studyPreferences.studyGoal || 60)
            setPomodoroDuration(authUser.user_metadata.studyPreferences.pomodoroDuration || 25)
          }

          if (authUser.user_metadata?.notificationPreferences) {
            setEmailNotifications(authUser.user_metadata.notificationPreferences.email || true)
            setPushNotifications(authUser.user_metadata.notificationPreferences.push || true)
            setNotificationPreferences({
              studyReminders: authUser.user_metadata.notificationPreferences.studyReminders ?? true,
              contentUpdates: authUser.user_metadata.notificationPreferences.contentUpdates ?? true,
              forumResponses: authUser.user_metadata.notificationPreferences.forumResponses ?? true,
            })
          }

          // Definir data de ingresso baseada nos metadados ou na data de criação
          if (authUser.created_at) {
            const joinDate = new Date(authUser.created_at)
            setJoinDate(
              joinDate.toLocaleDateString("pt-BR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
            )
          }

          // Simular última atividade (em um sistema real, isso viria do banco de dados)
          setLastActive("Hoje")

          setLoading(false)
          return
        }

        // Caso contrário, tente obter a sessão diretamente
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("Erro ao obter sessão:", sessionError)
          throw new Error("Não foi possível verificar sua sessão. Por favor, faça login novamente.")
        }

        if (!session) {
          // Tentar obter o usuário atual como último recurso
          const { data: userData, error: userError } = await supabase.auth.getUser()

          if (userError || !userData.user) {
            setLoading(false)
            return
          }

          setUser(userData.user)
        } else {
          setUser(session.user)
        }

        // Buscar o nome do usuário do perfil e outras informações
        if (user) {
          const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

          if (profile) {
            // Verificar quais campos existem no perfil
            console.log("Campos disponíveis no perfil:", Object.keys(profile))

            // Usar o campo correto para o nome (full_name ou name)
            setName(profile.full_name || profile.name || "")

            if (profile.role) {
              setUserRole(profile.role as UserRole)
            }

            if (profile.avatar_url) {
              setProfileImage(profile.avatar_url)
            }

            // Carregar preferências de estudo se existirem
            if (profile.study_preferences) {
              setStudyGoal(profile.study_preferences.studyGoal || 60)
              setPomodoroDuration(profile.study_preferences.pomodoroDuration || 25)
            }

            // Carregar preferências de notificação se existirem
            if (profile.notification_preferences) {
              setEmailNotifications(profile.notification_preferences.email || true)
              setPushNotifications(profile.notification_preferences.push || true)
              setNotificationPreferences({
                studyReminders: profile.notification_preferences.studyReminders ?? true,
                contentUpdates: profile.notification_preferences.contentUpdates ?? true,
                forumResponses: profile.notification_preferences.forumResponses ?? true,
              })
            }
          } else if (error) {
            console.error("Erro ao buscar perfil:", error)
          }

          // Carregar preferências dos metadados do usuário como fallback
          if (user.user_metadata?.studyPreferences) {
            setStudyGoal(user.user_metadata.studyPreferences.studyGoal || studyGoal)
            setPomodoroDuration(user.user_metadata.studyPreferences.pomodoroDuration || pomodoroDuration)
          }

          if (user.user_metadata?.notificationPreferences) {
            setEmailNotifications(user.user_metadata.notificationPreferences.email || emailNotifications)
            setPushNotifications(user.user_metadata.notificationPreferences.push || pushNotifications)
            setNotificationPreferences((prev) => ({
              studyReminders: user.user_metadata.notificationPreferences.studyReminders ?? prev.studyReminders,
              contentUpdates: user.user_metadata.notificationPreferences.contentUpdates ?? prev.contentUpdates,
              forumResponses: user.user_metadata.notificationPreferences.forumResponses ?? prev.forumResponses,
            }))
          }

          // Definir data de ingresso
          if (user.created_at) {
            const joinDate = new Date(user.created_at)
            setJoinDate(
              joinDate.toLocaleDateString("pt-BR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
            )
          }

          // Simular última atividade
          setLastActive("Hoje")
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router, supabase, authUser, authLoading, user, refreshUser])

  // Só redirecione se não estiver carregando e não houver usuário
  useEffect(() => {
    if (!loading && !authLoading && !user && !authUser) {
      console.log("Redirecionando para login porque não há usuário autenticado")
      router.push("/login")
    }
  }, [loading, authLoading, user, authUser, router])

  const checkProfileExists = async (userId: string): Promise<boolean> => {
    const { data, error } = await supabase.from("profiles").select("id").eq("id", userId).maybeSingle()

    if (error) {
      console.error("Erro ao verificar se o perfil existe:", error)
      return false
    }

    return !!data
  }

  // Função para verificar se o usuário está autenticado
  const ensureAuthenticated = async () => {
    // Primeiro, verificar se temos o usuário no estado
    if (user || authUser) {
      return true
    }

    // Se não, tentar obter o usuário atual
    try {
      const { data, error } = await supabase.auth.getUser()
      if (error || !data.user) {
        return false
      }

      // Atualizar o estado do usuário se encontrado
      setUser(data.user)
      return true
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error)
      return false
    }
  }

  // Adicionar esta função dentro do componente AccountPage, após as outras funções
  const fetchPreferencesHistory = async () => {
    if (!user && !authUser) return

    const userId = (user || authUser)?.id
    if (!userId) return

    setLoadingHistory(true)
    try {
      const { data, error } = await getUserPreferencesHistory(userId)
      if (error) {
        console.error("Erro ao buscar histórico de preferências:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar o histórico de preferências.",
          variant: "destructive",
        })
      } else if (data) {
        setPreferencesHistory(data)
      }
    } catch (error) {
      console.error("Erro ao buscar histórico de preferências:", error)
    } finally {
      setLoadingHistory(false)
    }
  }

  const fetchUserAchievements = async () => {
    const currentUser = user || authUser
    if (!currentUser) return

    setLoadingAchievements(true)
    try {
      const { data, error } = await supabase
        .from("user_achievements")
        .select(`
          *,
          achievement:achievements(*)
        `)
        .eq("user_id", currentUser.id)
        .order("unlocked_at", { ascending: false })

      if (error) {
        console.error("Erro ao buscar conquistas:", error)
      } else if (data) {
        setUserAchievements(data)
      }
    } catch (error) {
      console.error("Erro ao buscar conquistas:", error)
    } finally {
      setLoadingAchievements(false)
    }
  }

  // Modificar a função handleUpdateProfile para usar as novas funções
  const handleUpdateProfile = async () => {
    // Verificar se o usuário está autenticado
    const isAuthenticated = await ensureAuthenticated()

    if (!isAuthenticated) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para atualizar seu perfil. Por favor, faça login novamente.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    const currentUser = user || authUser
    if (!currentUser) {
      toast({
        title: "Erro",
        description: "Não foi possível identificar o usuário atual. Por favor, faça login novamente.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    setSaving(true)

    try {
      // Salvar informações do perfil
      const profileResult = await saveProfilePreferences(currentUser.id, {
        full_name: name,
      })

      if (profileResult.error) {
        throw new Error("Erro ao atualizar informações do perfil")
      }

      // Salvar preferências de estudo
      const studyResult = await saveStudyPreferences(currentUser.id, {
        studyGoal,
        pomodoroDuration,
      })

      if (studyResult.error) {
        throw new Error("Erro ao atualizar preferências de estudo")
      }

      // Atualizar também os metadados do usuário para consistência
      try {
        const { error: userError } = await supabase.auth.updateUser({
          data: {
            full_name: name,
            studyPreferences: {
              studyGoal,
              pomodoroDuration,
            },
          },
        })

        if (userError) {
          console.log("Aviso: Não foi possível atualizar metadados do usuário:", userError)
        }
      } catch (metadataError) {
        console.log("Aviso: Erro ao atualizar metadados do usuário:", metadataError)
      }

      toast({
        title: "Perfil atualizado",
        description: "Suas informações e preferências de estudo foram atualizadas com sucesso.",
      })

      // Após o toast de sucesso em handleUpdateProfile
      await forceRefreshUserData()

      // Atualizar o estado local para refletir as mudanças
      if (authUser) {
        // Se estiver usando o contexto de autenticação, atualizar via refreshUser
        try {
          await refreshUser()
        } catch (refreshError) {
          console.log("Aviso: Não foi possível atualizar o contexto de autenticação:", refreshError)
        }
      }

      // Atualizar o histórico de preferências
      fetchPreferencesHistory()
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error)
      toast({
        title: "Erro ao atualizar perfil",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao atualizar suas informações.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  // Modificar a função handleSaveNotificationPreferences para usar as novas funções
  const handleSaveNotificationPreferences = async () => {
    // Verificar se o usuário está autenticado
    const isAuthenticated = await ensureAuthenticated()

    if (!isAuthenticated) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para salvar suas preferências. Por favor, faça login novamente.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    const currentUser = user || authUser
    if (!currentUser) {
      toast({
        title: "Erro",
        description: "Não foi possível identificar o usuário atual. Por favor, faça login novamente.",
        variant: "destructive",
      })
      return
    }

    setSavingNotifications(true)

    try {
      // Capturar os valores atuais antes de salvar
      const currentEmailNotifications = emailNotifications
      const currentPushNotifications = pushNotifications
      const currentNotificationPreferences = { ...notificationPreferences }

      // Salvar preferências de notificação
      const notificationResult = await saveNotificationPreferences(currentUser.id, {
        email: currentEmailNotifications,
        push: currentPushNotifications,
        studyReminders: currentNotificationPreferences.studyReminders,
        contentUpdates: currentNotificationPreferences.contentUpdates,
        forumResponses: currentNotificationPreferences.forumResponses,
      })

      if (notificationResult.error) {
        throw new Error("Erro ao atualizar preferências de notificação")
      }

      // Atualizar também os metadados do usuário para consistência
      try {
        const { error: userError } = await supabase.auth.updateUser({
          data: {
            notificationPreferences: {
              email: currentEmailNotifications,
              push: currentPushNotifications,
              studyReminders: currentNotificationPreferences.studyReminders,
              contentUpdates: currentNotificationPreferences.contentUpdates,
              forumResponses: currentNotificationPreferences.forumResponses,
            },
          },
        })

        if (userError) {
          console.log("Aviso: Não foi possível atualizar metadados do usuário:", userError)
        }
      } catch (metadataError) {
        console.log("Aviso: Erro ao atualizar metadados do usuário:", metadataError)
      }

      toast({
        title: "Preferências salvas",
        description: "Suas preferências de notificação foram atualizadas com sucesso.",
      })

      // Garantir que os estados locais permaneçam com os valores que o usuário escolheu
      setEmailNotifications(currentEmailNotifications)
      setPushNotifications(currentPushNotifications)
      setNotificationPreferences(currentNotificationPreferences)

      // Após o toast de sucesso em handleSaveNotificationPreferences
      await forceRefreshUserData()

      // Atualizar o estado local para refletir as mudanças
      if (authUser) {
        // Se estiver usando o contexto de autenticação, atualizar via refreshUser
        try {
          await refreshUser()
        } catch (refreshError) {
          console.log("Aviso: Não foi possível atualizar o contexto de autenticação:", refreshError)
        }
      }

      // Atualizar o histórico de preferências
      fetchPreferencesHistory()
    } catch (error) {
      console.error("Erro ao salvar preferências de notificação:", error)
      toast({
        title: "Erro ao salvar preferências",
        description:
          error instanceof Error ? error.message : "Ocorreu um erro ao atualizar suas preferências de notificação.",
        variant: "destructive",
      })
    } finally {
      setSavingNotifications(false)
    }
  }

  // Adicionar useEffect para carregar o histórico de preferências quando o componente montar
  useEffect(() => {
    if ((user || authUser) && !loading && !authLoading) {
      fetchPreferencesHistory()
      fetchUserAchievements()
    }
  }, [user, authUser, loading, authLoading])

  // Adicionar esta função para formatar a data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Adicionar esta função para obter uma descrição amigável do tipo de alteração
  const getChangeTypeDescription = (changeType: string) => {
    switch (changeType) {
      case "profile":
        return "Informações do perfil"
      case "study":
        return "Preferências de estudo"
      case "notification":
        return "Preferências de notificação"
      default:
        return changeType
    }
  }

  const handleImageUpload = async (imageUrl: string) => {
    // Verificar se o usuário está autenticado
    const isAuthenticated = await ensureAuthenticated()

    if (!isAuthenticated) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para atualizar sua imagem. Por favor, faça login novamente.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    const currentUser = user || authUser
    if (!currentUser) {
      toast({
        title: "Erro",
        description: "Não foi possível identificar o usuário atual. Por favor, faça login novamente.",
        variant: "destructive",
      })
      return
    }

    try {
      // Atualizar o estado local imediatamente para feedback visual
      setProfileImage(imageUrl)

      // Verificar se o perfil existe
      const profileExists = await checkProfileExists(currentUser.id)

      // Atualizar o perfil no Supabase (usando upsert para criar ou atualizar)
      const { error: profileError } = await supabase.from("profiles").upsert(
        {
          id: currentUser.id,
          avatar_url: imageUrl,
          updated_at: new Date().toISOString(),
          full_name: name || "",
        },
        {
          onConflict: "id",
        },
      )

      if (profileError) {
        console.error("Error updating profile in Supabase:", profileError)
        throw new Error("Falha ao atualizar o perfil no banco de dados")
      }

      // Tentar atualizar os metadados do usuário, mas não falhar se não conseguir
      try {
        const { error: userError } = await supabase.auth.updateUser({
          data: {
            avatar_url: imageUrl,
          },
        })

        if (userError) {
          console.log("Aviso: Não foi possível atualizar metadados do usuário:", userError)
          // Não interromper o fluxo por causa deste erro
        }
      } catch (metadataError) {
        console.log("Aviso: Erro ao atualizar metadados do usuário:", metadataError)
        // Não interromper o fluxo por causa deste erro
      }

      // Mostrar mensagem de sucesso
      toast({
        title: "Sucesso",
        description: "Imagem de perfil atualizada com sucesso!",
        variant: "default",
      })

      console.log("Profile image updated successfully")

      // Atualizar o estado local para refletir as mudanças
      if (authUser) {
        // Se estiver usando o contexto de autenticação, atualizar via refreshUser
        try {
          await refreshUser()
        } catch (refreshError) {
          console.log("Aviso: Não foi possível atualizar o contexto de autenticação:", refreshError)
        }
      }
    } catch (error) {
      console.error("Error in handleImageUpload:", error)
      setError(error instanceof Error ? error.message : "Falha ao atualizar a imagem de perfil")

      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Falha ao atualizar a imagem de perfil",
        variant: "destructive",
      })
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  // Mostrar o loader enquanto verifica a autenticação
  if (loading || authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Se não houver usuário após a verificação, retornar null ou redirecionar
  if (!user && !authUser) {
    // Redirecionar para a página de login se nenhum usuário estiver autenticado
    router.push("/login")
    return null // Ou um componente de carregamento/redirecionamento
  }

  // Usar o usuário do contexto de autenticação ou o usuário obtido diretamente
  const displayUser = user || authUser
  const userEmail = displayUser?.email || ""
  const userName = name || displayUser?.user_metadata?.full_name || "Usuário"
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  // Adicionar esta função após a função fetchPreferencesHistory
  const forceRefreshUserData = async () => {
    try {
      // Verificar se o usuário está autenticado
      const currentUserId = (user || authUser)?.id
      if (!currentUserId) {
        console.log("Não é possível atualizar dados: usuário não autenticado")
        return
      }

      // Buscar dados atualizados do perfil
      const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", currentUserId).single()

      if (error) {
        console.error("Erro ao buscar perfil atualizado:", error)
        return
      }

      // Atualizar o estado com os dados mais recentes
      if (profile) {
        setName(profile.full_name || profile.name || "")
        setProfileImage(profile.avatar_url || null)

        // Atualizar preferências de estudo
        if (profile.study_preferences) {
          setStudyGoal(profile.study_preferences.studyGoal || 60)
          setPomodoroDuration(profile.study_preferences.pomodoroDuration || 25)
        }

        // Não sobrescrever as preferências de notificação que acabaram de ser salvas
        // Isso evita que o Switch volte para a posição anterior
        // Apenas atualize se não estiver no processo de salvar notificações
        if (!savingNotifications && profile.notification_preferences) {
          setEmailNotifications(profile.notification_preferences.email || true)
          setPushNotifications(profile.notification_preferences.push || true)
          setNotificationPreferences({
            studyReminders: profile.notification_preferences.studyReminders ?? true,
            contentUpdates: profile.notification_preferences.contentUpdates ?? true,
            forumResponses: profile.notification_preferences.forumResponses ?? true,
          })
        }

        // Atualizar role se o perfil tiver sido atualizado
        if (profile.role) {
          setUserRole(profile.role as UserRole)
        }
      }

      // Tentar atualizar via refreshUser também
      if (refreshUser) {
        await refreshUser()
      }
    } catch (error) {
      console.error("Erro ao forçar atualização dos dados:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Botão para voltar à página principal */}
      <div className="mb-6 flex items-center justify-between px-4 pt-6 md:container md:mx-auto md:px-0">
        <Button
          variant="ghost"
          className="flex items-center gap-2 hover:bg-secondary/80 transition-colors"
          onClick={() => router.push("/")}
          aria-label="Voltar para a página principal"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar para a página principal</span>
        </Button>

        <h1 className="text-2xl font-bold tracking-tight md:hidden">Minha Conta</h1>
      </div>

      <div className="container mx-auto grid grid-cols-1 gap-6 px-4 pb-6 md:grid-cols-[280px_1fr] md:px-0">
        {/* Sidebar com informações do usuário */}
        <div className="md:order-1 order-2">
          <Card className="h-full">
            <CardHeader className="hidden md:flex md:flex-col">
              <CardTitle>Minha Conta</CardTitle>
              <CardDescription>Gerencie suas informações pessoais</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative group">
                  <Avatar className="h-24 w-24 border-4 border-background">
                    <AvatarImage src={profileImage || ""} alt={name || "Perfil do usuário"} />
                    <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                      {name?.charAt(0) || displayUser.email?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full shadow-md opacity-90 group-hover:opacity-100 transition-opacity"
                    onClick={() => setShowImageUpload(true)}
                    aria-label="Alterar foto de perfil"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>

                <div className="text-center space-y-1">
                  <h2 className="text-xl font-semibold">{name || "Usuário"}</h2>
                  <p className="text-sm text-muted-foreground">{displayUser.email}</p>

                  {/* Badge de Role do Usuário */}
                  {userRole === "admin" && <AdminBadge size="md" />}
                  {userRole === "moderator" && <ModeratorBadge size="md" />}
                </div>

                <Separator className="my-2" />

                <div className="w-full space-y-3 text-sm">
                  {joinDate && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Membro desde</span>
                      <span>{joinDate}</span>
                    </div>
                  )}

                  {lastActive && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Última atividade</span>
                      <span>{lastActive}</span>
                    </div>
                  )}
                </div>

                <div className="w-full space-y-2">
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={() => router.push("/")}
                    aria-label="Ir para página inicial"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Página Inicial
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={handleLogout}
                    aria-label="Sair da conta"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conteúdo principal */}
        <div className="md:order-2 order-1">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="profile" className="flex items-center">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center">
                <Shield className="mr-2 h-4 w-4" />
                <span>Segurança</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center">
                <Bell className="mr-2 h-4 w-4" />
                <span>Notificações</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center">
                <History className="mr-2 h-4 w-4" />
                <span>Histórico</span>
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex items-center">
                <Trophy className="mr-2 h-4 w-4" />
                <span>Conquistas</span>
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[calc(100vh-250px)] md:h-auto">
              <TabsContent value="profile" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações Pessoais</CardTitle>
                    <CardDescription>
                      Atualize suas informações pessoais e como você aparece na plataforma.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                          Nome completo
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Seu nome completo"
                          className="w-full"
                          aria-describedby="name-description"
                        />
                        <p id="name-description" className="text-xs text-muted-foreground">
                          Este é o nome que será exibido no seu perfil e em suas interações.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={displayUser.email || ""}
                          disabled
                          className="w-full bg-muted"
                          aria-describedby="email-description"
                        />
                        <p id="email-description" className="text-xs text-muted-foreground">
                          Seu email é usado para login e comunicações importantes.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button
                      onClick={handleUpdateProfile}
                      disabled={saving}
                      aria-label={saving ? "Salvando alterações" : "Salvar alterações"}
                    >
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Salvar alterações
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Preferências de Estudo</CardTitle>
                    <CardDescription>
                      Configure suas preferências para uma experiência de estudo personalizada.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="study-goal" className="text-sm font-medium">
                          Meta diária de estudo (minutos)
                        </Label>
                        <Input
                          id="study-goal"
                          type="number"
                          value={studyGoal}
                          onChange={(e) => setStudyGoal(Number(e.target.value))}
                          min="5"
                          max="480"
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pomodoro-duration" className="text-sm font-medium">
                          Duração do Pomodoro (minutos)
                        </Label>
                        <Input
                          id="pomodoro-duration"
                          type="number"
                          value={pomodoroDuration}
                          onChange={(e) => setPomodoroDuration(Number(e.target.value))}
                          min="5"
                          max="60"
                          className="w-full"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button
                      onClick={handleUpdateProfile}
                      disabled={saving}
                      aria-label={saving ? "Salvando preferências" : "Salvar preferências"}
                    >
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Salvar preferências
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Segurança da Conta</CardTitle>
                    <CardDescription>Gerencie sua senha e configurações de segurança.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-sm font-medium">Senha</h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            Altere sua senha periodicamente para maior segurança.
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => setShowPasswordDialog(true)}
                          className="flex items-center"
                          aria-label="Alterar senha"
                        >
                          <Key className="mr-2 h-4 w-4" />
                          Alterar senha
                        </Button>
                      </div>

                      <Separator />

                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-sm font-medium">Verificação em duas etapas</h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            Adicione uma camada extra de segurança à sua conta.
                          </p>
                        </div>
                        <Button variant="outline" disabled>
                          Em breve
                        </Button>
                      </div>

                      <Separator />

                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-sm font-medium">Sessões ativas</h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            Gerencie os dispositivos onde sua conta está conectada.
                          </p>
                        </div>
                        <Button variant="outline" disabled>
                          Ver sessões
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Privacidade</CardTitle>
                    <CardDescription>Gerencie quem pode ver suas informações e atividades.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="profile-visibility">Visibilidade do perfil</Label>
                        <p className="text-xs text-muted-foreground">Quem pode ver seu perfil e progresso</p>
                      </div>
                      <select
                        id="profile-visibility"
                        className="w-24 rounded-md border border-input bg-background px-3 py-1 text-sm"
                        defaultValue="private"
                      >
                        <option value="public">Público</option>
                        <option value="friends">Amigos</option>
                        <option value="private">Privado</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Preferências de Notificação</CardTitle>
                    <CardDescription>Escolha como e quando deseja receber notificações.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-notifications" className="text-base">
                            Notificações por email
                          </Label>
                          <p className="text-xs text-muted-foreground">Receba atualizações importantes por email</p>
                        </div>
                        <Switch
                          id="email-notifications"
                          checked={emailNotifications}
                          onCheckedChange={setEmailNotifications}
                          aria-label="Ativar notificações por email"
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="push-notifications" className="text-base">
                            Notificações push
                          </Label>
                          <p className="text-xs text-muted-foreground">Receba alertas no navegador</p>
                        </div>
                        <Switch
                          id="push-notifications"
                          checked={pushNotifications}
                          onCheckedChange={setPushNotifications}
                          aria-label="Ativar notificações push"
                        />
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <h3 className="text-sm font-medium">Tipos de notificação</h3>

                        <div className="ml-6 space-y-2">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="notify-reminders"
                              checked={notificationPreferences.studyReminders}
                              onChange={(e) =>
                                setNotificationPreferences({
                                  ...notificationPreferences,
                                  studyReminders: e.target.checked,
                                })
                              }
                              className="rounded"
                            />
                            <Label htmlFor="notify-reminders" className="text-sm">
                              Lembretes de estudo
                            </Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="notify-updates"
                              checked={notificationPreferences.contentUpdates}
                              onChange={(e) =>
                                setNotificationPreferences({
                                  ...notificationPreferences,
                                  contentUpdates: e.target.checked,
                                })
                              }
                              className="rounded"
                            />
                            <Label htmlFor="notify-updates" className="text-sm">
                              Atualizações de conteúdo
                            </Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="notify-forum"
                              checked={notificationPreferences.forumResponses}
                              onChange={(e) =>
                                setNotificationPreferences({
                                  ...notificationPreferences,
                                  forumResponses: e.target.checked,
                                })
                              }
                              className="rounded"
                            />
                            <Label htmlFor="notify-forum" className="text-sm">
                              Respostas no fórum
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="ml-auto"
                      onClick={handleSaveNotificationPreferences}
                      disabled={savingNotifications}
                    >
                      {savingNotifications ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        "Salvar preferências"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="history" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Histórico de Alterações</CardTitle>
                    <CardDescription>
                      Veja o histórico de alterações feitas nas suas preferências e configurações.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loadingHistory ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : preferencesHistory.length > 0 ? (
                      <div className="space-y-4">
                        {preferencesHistory.map((item) => (
                          <div key={item.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-medium">{getChangeTypeDescription(item.change_type)}</h3>
                                <p className="text-sm text-muted-foreground">{formatDate(item.changed_at)}</p>
                              </div>
                              <Badge variant="outline">
                                {item.change_type === "profile"
                                  ? "Perfil"
                                  : item.change_type === "study"
                                    ? "Estudo"
                                    : "Notificações"}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-4">
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium text-muted-foreground">Valor anterior</h4>
                                <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-32">
                                  {JSON.stringify(item.previous_value, null, 2)}
                                </pre>
                              </div>
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium text-muted-foreground">Novo valor</h4>
                                <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-32">
                                  {JSON.stringify(item.new_value, null, 2)}
                                </pre>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">Nenhuma alteração registrada ainda.</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      onClick={fetchPreferencesHistory}
                      disabled={loadingHistory}
                      className="ml-auto bg-transparent"
                    >
                      {loadingHistory ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Atualizando...
                        </>
                      ) : (
                        <>Atualizar histórico</>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="achievements">
                <Card className="border-gray-700 bg-gray-800/50 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-6 h-6 text-yellow-500" />
                      <CardTitle>Minhas Conquistas</CardTitle>
                    </div>
                    <CardDescription>Badges desbloqueados e progresso</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {loadingAchievements ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                      </div>
                    ) : userAchievements.length > 0 ? (
                      <>
                        <div className="grid gap-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Award className="w-5 h-5 text-purple-500" />
                                Conquistas Desbloqueadas
                              </h3>
                              <p className="text-sm text-gray-400">
                                {userAchievements.filter((a) => a.unlocked).length} de {userAchievements.length} badges
                                conquistados
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-yellow-500">
                                {userAchievements
                                  .filter((a) => a.unlocked)
                                  .reduce((sum, a) => sum + (a.achievement?.points_reward || 0), 0)}
                              </p>
                              <p className="text-xs text-gray-400">Pontos de Conquistas</p>
                            </div>
                          </div>
                        </div>

                        <Separator className="bg-gray-700" />

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                          {userAchievements.map((userAch) => (
                            <AchievementBadge
                              key={userAch.id}
                              name={userAch.achievement?.name || "Conquista"}
                              description={userAch.achievement?.description || ""}
                              icon={userAch.achievement?.icon || "🏆"}
                              tier={userAch.achievement?.tier || "bronze"}
                              progress={userAch.progress || 0}
                              unlocked={userAch.unlocked}
                              size="md"
                              showProgress={true}
                            />
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <Trophy className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                        <p className="text-gray-400 mb-2">Você ainda não tem conquistas</p>
                        <p className="text-sm text-gray-500">
                          Complete desafios e atividades para desbloquear seus primeiros badges!
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </div>

      {/* Diálogos */}
      {showImageUpload && (
        <ImageUploadDialog
          open={showImageUpload}
          onOpenChange={setShowImageUpload}
          onUpload={handleImageUpload}
          user={displayUser}
        />
      )}

      {showPasswordDialog && <ChangePasswordDialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog} />}

      {/* Botão de ajuda flutuante */}
      <Button
        variant="secondary"
        size="icon"
        className="fixed bottom-6 right-6 rounded-full shadow-lg"
        aria-label="Obter ajuda"
      >
        <HelpCircle className="h-5 w-5" />
      </Button>
    </div>
  )
}
