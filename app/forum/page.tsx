"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { TopNav } from "@/components/top-nav"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, ThumbsUp, Loader2, Send, CheckCircle, Edit2, X } from "lucide-react"
import { useAuth } from "@/lib/authContext"
import { supabase } from "@/lib/supabaseClient"
import {
  createForumPost,
  createForumComment,
  toggleForumPostLike,
  updateForumPost,
  type ForumPost as ForumPostType,
} from "@/lib/forum"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Label } from "@/components/ui/label"

const DEFAULT_AVATAR = "/default-avatar.png"

export default function ForumPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [posts, setPosts] = useState<ForumPostType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [commentContent, setCommentContent] = useState<{ [key: string]: string }>({})
  const [lastFetched, setLastFetched] = useState<Date | null>(null)
  const { toast } = useToast()
  const [error, setError] = useState<string | null>(null)
  const [likesCache, setLikesCache] = useState<Record<string, { likes: number; userHasLiked: boolean }>>({})
  const [likeInProgress, setLikeInProgress] = useState<string | null>(null)
  const [editingPostId, setEditingPostId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editContent, setEditContent] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)

  // New states for the create post form
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // New states for attachments
  const [postAttachments, setPostAttachments] = useState<File[]>([])
  const [commentAttachments, setCommentAttachments] = useState<{ [key: string]: File[] }>({})
  const [editAttachments, setEditAttachments] = useState<File[]>([])
  const [showAttachmentUpload, setShowAttachmentUpload] = useState<{ [key: string]: boolean }>({})

  const fetchPosts = async () => {
    setIsLoading(true)
    try {
      // Buscar posts
      const { data: postsData, error: postsError } = await supabase
        .from("forum_posts")
        .select("*")
        .eq("resolved", false)
        .order("created_at", { ascending: false })
        .limit(20)

      if (postsError) {
        console.error("Error fetching posts:", postsError)
        throw postsError
      }

      if (!postsData) {
        setPosts([])
        return
      }

      // Buscar usuários separadamente
      const userIds = [...new Set(postsData.map((post) => post.user_id))]
      const { data: usersData, error: usersError } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", userIds)

      if (usersError) {
        console.error("Error fetching users:", usersError)
        throw usersError
      }

      // Criar um mapa de usuários para fácil acesso
      const usersMap = new Map()
      usersData?.forEach((user) => {
        usersMap.set(user.id, user)
      })

      // Buscar comentários e anexos para cada post
      const postsWithCommentsAndAttachments = await Promise.all(
        postsData.map(async (post) => {
          // Buscar comentários
          const { data: commentsData, error: commentsError } = await supabase
            .from("forum_comments")
            .select("*")
            .eq("post_id", post.id)
            .order("created_at", { ascending: true })

          if (commentsError) {
            console.error(`Error fetching comments for post ${post.id}:`, commentsError)
            return {
              ...post,
              user: usersMap.get(post.user_id) || null,
              comments: [],
              attachments: [],
            }
          }

          // Buscar anexos do post (com verificação de existência da tabela)
          let postAttachmentsWithUrls = []
          try {
            const { data: postAttachments, error: postAttachmentsError } = await supabase
              .from("forum_attachments")
              .select("*")
              .eq("post_id", post.id)
              .order("created_at", { ascending: true })

            if (postAttachmentsError) {
              // Se a tabela não existir, apenas log o erro e continue
              if (postAttachmentsError.message.includes("does not exist")) {
                console.warn("Forum attachments table does not exist yet")
              } else {
                console.error(`Error fetching attachments for post ${post.id}:`, postAttachmentsError)
              }
            } else if (postAttachments) {
              // Gerar URLs para os anexos do post
              postAttachmentsWithUrls = await Promise.all(
                postAttachments.map(async (attachment) => {
                  try {
                    const { data: urlData } = await supabase.storage
                      .from("forum_attachments")
                      .createSignedUrl(attachment.file_path, 3600) // URL válida por 1 hora

                    return {
                      ...attachment,
                      url: urlData?.signedUrl || null,
                    }
                  } catch (error) {
                    console.warn("Error creating signed URL for attachment:", error)
                    return {
                      ...attachment,
                      url: null,
                    }
                  }
                }),
              )
            }
          } catch (error) {
            console.warn("Error accessing forum_attachments table:", error)
          }

          // Buscar informações dos usuários para cada comentário
          if (commentsData && commentsData.length > 0) {
            const commentUserIds = [...new Set(commentsData.map((comment) => comment.user_id))]
            const { data: commentUsersData, error: commentUsersError } = await supabase
              .from("profiles")
              .select("id, full_name, avatar_url")
              .in("id", commentUserIds)

            if (commentUsersError) {
              console.error(`Error fetching users for comments of post ${post.id}:`, commentUsersError)
              return {
                ...post,
                user: usersMap.get(post.user_id) || null,
                comments: commentsData.map((comment) => ({ ...comment, user: null, attachments: [] })),
                attachments: postAttachmentsWithUrls || [],
              }
            }

            // Criar um mapa de usuários para os comentários
            const commentUsersMap = new Map()
            commentUsersData?.forEach((user) => {
              commentUsersMap.set(user.id, user)
            })

            // Buscar anexos para cada comentário e adicionar informações de usuário
            const commentsWithUsersAndAttachments = await Promise.all(
              commentsData.map(async (comment) => {
                let commentAttachmentsWithUrls = []

                try {
                  // Buscar anexos para este comentário
                  const { data: commentAttachments, error: commentAttachmentsError } = await supabase
                    .from("forum_attachments")
                    .select("*")
                    .eq("comment_id", comment.id)
                    .order("created_at", { ascending: true })

                  if (commentAttachmentsError) {
                    if (!commentAttachmentsError.message.includes("does not exist")) {
                      console.error(`Error fetching attachments for comment ${comment.id}:`, commentAttachmentsError)
                    }
                  } else if (commentAttachments) {
                    // Gerar URLs para os anexos do comentário
                    commentAttachmentsWithUrls = await Promise.all(
                      commentAttachments.map(async (attachment) => {
                        try {
                          const { data: urlData } = await supabase.storage
                            .from("forum_attachments")
                            .createSignedUrl(attachment.file_path, 3600) // URL válida por 1 hora

                          return {
                            ...attachment,
                            url: urlData?.signedUrl || null,
                          }
                        } catch (error) {
                          console.warn("Error creating signed URL for comment attachment:", error)
                          return {
                            ...attachment,
                            url: null,
                          }
                        }
                      }),
                    )
                  }
                } catch (error) {
                  console.warn("Error accessing forum_attachments table for comments:", error)
                }

                return {
                  ...comment,
                  user: commentUsersMap.get(comment.user_id) || null,
                  attachments: commentAttachmentsWithUrls || [],
                }
              }),
            )

            return {
              ...post,
              user: usersMap.get(post.user_id) || null,
              comments: commentsWithUsersAndAttachments,
              attachments: postAttachmentsWithUrls || [],
            }
          }

          return {
            ...post,
            user: usersMap.get(post.user_id) || null,
            comments: commentsData || [],
            attachments: postAttachmentsWithUrls || [],
          }
        }),
      )

      // Verificar se o usuário atual curtiu cada post
      if (user) {
        const postsWithLikes = await Promise.all(
          postsWithCommentsAndAttachments.map(async (post) => {
            const { data: likesData, error: likesError } = await supabase
              .from("post_likes")
              .select("*")
              .eq("post_id", post.id)

            if (likesError) {
              console.error(`Error fetching likes for post ${post.id}:`, likesError)
              return {
                ...post,
                likes: 0,
                user_has_liked: false,
              }
            }

            const userLike = likesData?.find((like) => like.user_id === user.id)
            const likesCount = likesData?.length || 0

            // Atualizar o cache de curtidas
            setLikesCache((prev) => ({
              ...prev,
              [post.id]: {
                likes: likesCount,
                userHasLiked: !!userLike,
              },
            }))

            return {
              ...post,
              likes: likesCount,
              user_has_liked: !!userLike,
            }
          }),
        )

        setPosts(postsWithLikes)
      } else {
        setPosts(
          postsWithCommentsAndAttachments.map((post) => ({
            ...post,
            likes: 0,
            user_has_liked: false,
          })),
        )
      }

      setLastFetched(new Date())
    } catch (error) {
      console.error("Error in fetchPosts:", error)
      setError("Não foi possível carregar as discussões. Por favor, tente novamente.")
      toast({
        title: "Erro",
        description: "Não foi possível carregar as discussões. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!user || !autoRefresh) return

    // Inscrever-se para atualizações em tempo real
    const postsSubscription = supabase
      .channel("forum_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "forum_posts",
        },
        () => {
          fetchPosts()
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "forum_comments",
        },
        () => {
          fetchPosts()
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "post_likes",
        },
        () => {
          fetchPosts()
        },
      )
      .subscribe()

    return () => {
      postsSubscription.unsubscribe()
    }
  }, [user, autoRefresh])

  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else {
      fetchPosts()
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para criar uma discussão.",
        variant: "destructive",
      })
      return
    }

    if (!title.trim() || !content.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      // Por enquanto, criar posts sem anexos até a tabela ser criada
      const newPost = await createForumPost(user.id, title, content)

      // Adiciona o novo post ao estado local para feedback imediato
      setPosts((prevPosts) => [newPost, ...prevPosts])

      // Limpa os campos do formulário
      setTitle("")
      setContent("")
      setPostAttachments([])

      // Exibe mensagem de sucesso
      toast({
        title: "Sucesso",
        description: "Sua discussão foi publicada com sucesso!",
      })

      // Atualiza a lista completa de discussões para garantir sincronização
      fetchPosts()
    } catch (error) {
      console.error("Error creating post:", error)
      toast({
        title: "Erro",
        description:
          error instanceof Error ? error.message : "Não foi possível criar a discussão. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCreateComment = async (postId: string) => {
    if (!user) return
    const content = commentContent[postId]
    if (!content?.trim()) return

    try {
      // Por enquanto, criar comentários sem anexos até a tabela ser criada
      const newComment = await createForumComment(user.id, postId, content)

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: [
                  ...(post.comments || []),
                  {
                    ...newComment,
                    user: { id: user.id, full_name: user.user_metadata?.full_name },
                  },
                ],
              }
            : post,
        ),
      )

      // Reset comment state
      setCommentContent((prev) => ({ ...prev, [postId]: "" }))
      setCommentAttachments((prev) => ({ ...prev, [postId]: [] }))
      setShowAttachmentUpload((prev) => ({ ...prev, [postId]: false }))

      toast({
        title: "Sucesso",
        description: "Comentário adicionado com sucesso!",
      })

      // Atualiza a lista completa para garantir sincronização
      fetchPosts()
    } catch (error) {
      console.error("Error creating comment:", error)
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o comentário. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleToggleLike = async (postId: string) => {
    if (!user || likeInProgress === postId) return

    try {
      setLikeInProgress(postId)

      // Obter o estado atual de curtidas antes da atualização
      const currentLikes = likesCache[postId] || {
        likes: posts.find((p) => p.id === postId)?.likes || 0,
        userHasLiked: posts.find((p) => p.id === postId)?.user_has_liked || false,
      }

      // Atualize o estado localmente (atualização otimista)
      const newLikesCount = currentLikes.userHasLiked ? currentLikes.likes - 1 : currentLikes.likes + 1

      setLikesCache((prev) => ({
        ...prev,
        [postId]: {
          likes: newLikesCount,
          userHasLiked: !currentLikes.userHasLiked,
        },
      }))

      // Atualize a lista de posts para refletir a mudança em tempo real
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likes: newLikesCount,
                user_has_liked: !currentLikes.userHasLiked,
              }
            : post,
        ),
      )

      // Faça a chamada à API
      const { likes, userHasLiked } = await toggleForumPostLike(postId, user.id)

      // Atualize o cache com a resposta do servidor
      setLikesCache((prev) => ({
        ...prev,
        [postId]: {
          likes,
          userHasLiked,
        },
      }))

      // Atualize a lista de posts para refletir a resposta do servidor
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likes: likes,
                user_has_liked: userHasLiked,
              }
            : post,
        ),
      )
    } catch (error) {
      console.error("Error toggling like:", error)
      toast({
        title: "Erro",
        description: "Não foi possível curtir a postagem. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLikeInProgress(null)
    }
  }

  const handleMarkAsResolved = async (postId: string) => {
    try {
      // Primeiro, remova o post da lista local para feedback imediato
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId))

      // Em seguida, atualize o post no banco de dados para resolved = true
      const { error } = await supabase.from("forum_posts").update({ resolved: true }).eq("id", postId)

      if (error) throw error

      // Exibe mensagem de sucesso
      toast({
        title: "Sucesso",
        description: "Discussão marcada como resolvida!",
      })

      // Atualiza a lista completa para garantir sincronização
      fetchPosts()
    } catch (error) {
      console.error("Error marking post as resolved:", error)
      toast({
        title: "Erro",
        description: "Não foi possível marcar a discussão como resolvida. Por favor, tente novamente.",
        variant: "destructive",
      })
      // Se houver um erro, busque os posts novamente para restaurar o estado correto
      fetchPosts()
    }
  }

  const handleEditPost = (post: ForumPostType) => {
    setEditingPostId(post.id)
    setEditTitle(post.title)
    setEditContent(post.content)
  }

  const handleCancelEdit = () => {
    setEditingPostId(null)
    setEditTitle("")
    setEditContent("")
    setEditAttachments([])
  }

  const handleSaveEdit = async (postId: string) => {
    if (!editTitle.trim() || !editContent.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSaving(true)

      // Atualizar no banco de dados
      await updateForumPost(postId, editTitle, editContent)

      // Atualizar localmente para feedback imediato
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                title: editTitle,
                content: editContent,
                updated_at: new Date().toISOString(),
              }
            : post,
        ),
      )

      // Limpar o estado de edição
      setEditingPostId(null)
      setEditTitle("")
      setEditContent("")
      setEditAttachments([])

      // Exibir mensagem de sucesso
      toast({
        title: "Sucesso",
        description: "Discussão atualizada com sucesso!",
      })

      // Atualizar a lista completa para garantir sincronização
      fetchPosts()
    } catch (error) {
      console.error("Error updating post:", error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a discussão. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const toggleAttachmentUpload = (postId: string) => {
    setShowAttachmentUpload((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }))
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <TopNav />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Formulário de criação de post */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={user?.profileImage || DEFAULT_AVATAR} alt={user?.fullName || "User"} />
                <AvatarFallback>{user?.fullName?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">Criar nova discussão</h3>
                <p className="text-sm text-gray-500">Compartilhe suas dúvidas ou conhecimentos</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Digite o título da sua discussão"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Conteúdo</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Digite o conteúdo da sua discussão"
                  required
                  className="min-h-[100px]"
                />
              </div>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publicando...
                  </>
                ) : (
                  "Publicar discussão"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Discussões Recentes
              {lastFetched && (
                <span className="text-sm text-gray-500 font-normal">
                  Última atualização: {formatDistanceToNow(lastFetched, { addSuffix: true, locale: ptBR })}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                <p>Erro ao carregar discussões: {error}</p>
                <Button onClick={fetchPosts} className="mt-4">
                  Tentar novamente
                </Button>
              </div>
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <Card key={post.id} className="hover:bg-gray-50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage
                          src={post.user?.avatar_url || user?.profileImage || "/default-avatar.png"}
                          alt={post.user?.full_name || user?.user_metadata?.full_name || "Usuário"}
                        />
                        <AvatarFallback>{post.user?.full_name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        {editingPostId === post.id ? (
                          <div className="space-y-3 mb-4 border p-3 rounded-md bg-white">
                            <h3 className="font-semibold text-lg mb-2">Editar Discussão</h3>
                            <Input
                              placeholder="Título da discussão"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="mb-2"
                            />
                            <Textarea
                              placeholder="Conteúdo da discussão"
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              rows={4}
                              className="mb-2"
                            />

                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={handleCancelEdit} disabled={isSaving}>
                                <X className="h-4 w-4 mr-1" /> Cancelar
                              </Button>
                              <Button size="sm" onClick={() => handleSaveEdit(post.id)} disabled={isSaving}>
                                {isSaving ? (
                                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                )}
                                {isSaving ? "Salvando..." : "Salvar"}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <h3 className="font-semibold text-lg">{post.title}</h3>
                            <p className="text-sm text-gray-500 mb-2">
                              Postado por{" "}
                              {post.user?.full_name ||
                                post.user?.name ||
                                user?.user_metadata?.full_name ||
                                "Usuário sem nome"}{" "}
                              • {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ptBR })}
                              {post.updated_at && post.updated_at !== post.created_at && (
                                <span className="italic">
                                  {" "}
                                  • editado{" "}
                                  {formatDistanceToNow(new Date(post.updated_at), { addSuffix: true, locale: ptBR })}
                                </span>
                              )}
                            </p>
                            <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.content}</p>
                          </>
                        )}

                        {editingPostId !== post.id && (
                          <>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleLike(post.id)}
                                disabled={likeInProgress === post.id}
                                className={`transition-all ${
                                  likesCache[post.id]?.userHasLiked ? "text-gray-900" : "text-gray-500"
                                }`}
                              >
                                {likeInProgress === post.id ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <ThumbsUp
                                    className={`h-4 w-4 mr-2 transition-all ${
                                      likesCache[post.id]?.userHasLiked
                                        ? "fill-gray-900 text-gray-900"
                                        : "fill-none text-gray-500"
                                    }`}
                                  />
                                )}
                                <span className="transition-all">
                                  {likesCache[post.id]?.likes || post.likes || 0} Curtidas
                                </span>
                              </Button>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                <span>{post.comments?.length || 0} respostas</span>
                              </div>
                            </div>
                            <div className="mt-4 space-y-2">
                              {post.comments?.map((comment) => (
                                <div key={comment.id} className="bg-gray-100 p-3 rounded-lg">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Avatar className="h-6 w-6">
                                      <AvatarImage
                                        src={comment.user?.avatar_url || user?.profileImage || "/default-avatar.png"}
                                        alt={comment.user?.full_name || user?.user_metadata?.full_name || "Usuário"}
                                      />
                                      <AvatarFallback>
                                        {comment.user?.full_name?.[0]?.toUpperCase() || "U"}
                                      </AvatarFallback>
                                    </Avatar>
                                    <p className="text-sm font-semibold">
                                      {comment.user?.full_name || user?.user_metadata?.full_name || "Usuário sem nome"}
                                    </p>
                                    <span className="text-xs text-gray-500">•</span>
                                    <p className="text-xs text-gray-500">
                                      {formatDistanceToNow(new Date(comment.created_at), {
                                        addSuffix: true,
                                        locale: ptBR,
                                      })}
                                    </p>
                                  </div>
                                  <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                                </div>
                              ))}
                              <div className="flex items-center gap-2 mt-4">
                                <Input
                                  placeholder="Adicione um comentário..."
                                  value={commentContent[post.id] || ""}
                                  onChange={(e) =>
                                    setCommentContent((prev) => ({
                                      ...prev,
                                      [post.id]: e.target.value,
                                    }))
                                  }
                                />
                                <Button
                                  size="sm"
                                  onClick={() => handleCreateComment(post.id)}
                                  disabled={!commentContent[post.id]?.trim()}
                                >
                                  <Send className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      {user && user.id === post.user_id && editingPostId !== post.id && (
                        <div className="ml-auto flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-blue-600 border-blue-600 hover:bg-blue-50"
                            onClick={() => handleEditPost(post)}
                            title="Editar discussão"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-green-600 border-green-600 hover:bg-green-50"
                            onClick={() => handleMarkAsResolved(post.id)}
                            title="Marcar como resolvida"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="mx-auto h-12 w-12 mb-2 text-gray-400" />
                <p>Nenhuma discussão encontrada</p>
                <p className="text-sm">Seja o primeiro a iniciar uma discussão!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <BottomNav active="forum" />
    </div>
  )
}
