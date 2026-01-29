"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ThumbsUp, MessageCircle, Trash2 } from "lucide-react"
import type { ForumPost } from "@/lib/forum"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useAuth } from "@/lib/authContext"
import { supabase } from "@/lib/supabaseClient"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"

interface ForumPostProps {
  post: ForumPost
  onLike: (postId: string) => Promise<void>
  onReply: (postId: string) => void
  onDelete: (postId: string) => Promise<void>
}

export function ForumPost({ post, onLike, onReply, onDelete }: ForumPostProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [likes, setLikes] = useState(post.likes)
  const [userHasLiked, setUserHasLiked] = useState(post.user_has_liked)
  const [profileImage, setProfileImage] = useState<string | null>(post.user?.avatar_url || null)

  // Buscar a imagem de perfil mais recente do usuário
  useEffect(() => {
    const fetchProfileImage = async () => {
      if (post.user_id) {
        try {
          const { data, error } = await supabase.from("profiles").select("avatar_url").eq("id", post.user_id).single()

          if (error) {
            console.error("Error fetching profile image:", error)
            return
          }

          if (data?.avatar_url) {
            setProfileImage(data.avatar_url)
          }
        } catch (error) {
          console.error("Error fetching profile image:", error)
        }
      }
    }

    fetchProfileImage()
  }, [post.user_id])

  const handleLike = async () => {
    if (!user) return

    try {
      const { likes: newLikesCount, userHasLiked: newUserHasLiked } = await onLike(post.id)
      setLikes(newLikesCount)
      setUserHasLiked(newUserHasLiked)
    } catch (error) {
      console.error("Error liking post:", error)
      toast({
        title: "Erro",
        description: "Não foi possível curtir/descurtir a discussão. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteConfirmation = async () => {
    try {
      await onDelete(post.id)
    } catch (error) {
      console.error("Error deleting post:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir a discussão. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage
            src={profileImage || "/placeholder.svg"}
            alt={post.user?.full_name || "User"}
            onError={() => setProfileImage("/placeholder.svg")}
          />
          <AvatarFallback>{post.user?.full_name?.[0] || "U"}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">{post.title}</h3>
            {user && user.id === post.user_id && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir Discussão</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza de que deseja excluir esta discussão? Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteConfirmation}>Excluir</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
          <p className="text-sm text-gray-500">
            {post.user?.full_name} • {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ptBR })}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <p>{post.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" size="sm" onClick={handleLike}>
          <ThumbsUp
            className={`mr-2 h-4 w-4 ${userHasLiked ? "fill-gray-900 text-gray-900" : "fill-none text-gray-500"}`}
          />
          {likes} Curtidas
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onReply(post.id)}>
          <MessageCircle className="mr-2 h-4 w-4" />
          Responder
        </Button>
      </CardFooter>
    </Card>
  )
}
