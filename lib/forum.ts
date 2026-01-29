import { supabase } from "./supabaseClient"

export interface ForumPost {
  id: string
  user_id: string
  title: string
  content: string
  created_at: string
  updated_at: string
  likes: number
  user_has_liked: boolean
  resolved: boolean
  user?: {
    id: string
    full_name?: string
    avatar_url?: string
  }
  comments?: ForumComment[]
  attachments?: ForumAttachment[]
}

export interface ForumComment {
  id: string
  post_id: string
  user_id: string
  content: string
  created_at: string
  updated_at: string
  user?: {
    id: string
    full_name?: string
    avatar_url?: string
  }
  attachments?: ForumAttachment[]
}

export interface ForumAttachment {
  id: string
  post_id?: string
  comment_id?: string
  user_id: string
  file_name: string
  file_path: string
  file_type: string
  file_size: number
  created_at: string
  url?: string
}

export async function getForumPosts(): Promise<ForumPost[]> {
  try {
    const { data: session, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError

    const { data: posts, error: postsError } = await supabase
      .from("forum_posts")
      .select("*")
      .eq("resolved", false)
      .order("created_at", { ascending: false })

    if (postsError) throw postsError

    if (!posts) return []

    // Fetch user data separately
    const userIds = new Set(posts.map((post) => post.user_id))
    const { data: users, error: usersError } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .in("id", Array.from(userIds))

    if (usersError) throw usersError

    const userMap = new Map(users?.map((user) => [user.id, user]) || [])

    // Fetch comments and attachments for each post
    const postsWithCommentsAndAttachments = await Promise.all(
      posts.map(async (post) => {
        // Fetch comments
        const { data: comments, error: commentsError } = await supabase
          .from("forum_comments")
          .select("*")
          .eq("post_id", post.id)
          .order("created_at", { ascending: true })

        if (commentsError) {
          console.error(`Error fetching comments for post ${post.id}:`, commentsError)
          return {
            ...post,
            user: userMap.get(post.user_id),
            comments: [],
            attachments: [],
          }
        }

        // Fetch post attachments
        const { data: postAttachments, error: postAttachmentsError } = await supabase
          .from("forum_attachments")
          .select("*")
          .eq("post_id", post.id)
          .order("created_at", { ascending: true })

        if (postAttachmentsError) {
          console.error(`Error fetching attachments for post ${post.id}:`, postAttachmentsError)
        }

        // Generate URLs for post attachments
        const postAttachmentsWithUrls = await Promise.all(
          (postAttachments || []).map(async (attachment) => {
            const { data: urlData } = await supabase.storage
              .from("forum_attachments")
              .createSignedUrl(attachment.file_path, 3600) // URL valid for 1 hour

            return {
              ...attachment,
              url: urlData?.signedUrl || null,
            }
          }),
        )

        // Buscar informações dos usuários para cada comentário
        if (comments && comments.length > 0) {
          const commentUserIds = [...new Set(comments.map((comment) => comment.user_id))]
          const { data: commentUsers, error: commentUsersError } = await supabase
            .from("profiles")
            .select("id, full_name, avatar_url")
            .in("id", commentUserIds)

          if (commentUsersError) {
            console.error(`Error fetching users for comments of post ${post.id}:`, commentUsersError)
            return {
              ...post,
              user: userMap.get(post.user_id),
              comments: comments.map((comment) => ({ ...comment, user: null })),
              attachments: postAttachmentsWithUrls || [],
            }
          }

          // Criar um mapa de usuários para os comentários
          const commentUserMap = new Map(commentUsers?.map((user) => [user.id, user]) || [])

          // Fetch comment attachments and add user info to each comment
          const commentsWithUsersAndAttachments = await Promise.all(
            comments.map(async (comment) => {
              // Fetch attachments for this comment
              const { data: commentAttachments, error: commentAttachmentsError } = await supabase
                .from("forum_attachments")
                .select("*")
                .eq("comment_id", comment.id)
                .order("created_at", { ascending: true })

              if (commentAttachmentsError) {
                console.error(`Error fetching attachments for comment ${comment.id}:`, commentAttachmentsError)
                return {
                  ...comment,
                  user: commentUserMap.get(comment.user_id) || null,
                  attachments: [],
                }
              }

              // Generate URLs for comment attachments
              const commentAttachmentsWithUrls = await Promise.all(
                (commentAttachments || []).map(async (attachment) => {
                  const { data: urlData } = await supabase.storage
                    .from("forum_attachments")
                    .createSignedUrl(attachment.file_path, 3600) // URL valid for 1 hour

                  return {
                    ...attachment,
                    url: urlData?.signedUrl || null,
                  }
                }),
              )

              return {
                ...comment,
                user: commentUserMap.get(comment.user_id) || null,
                attachments: commentAttachmentsWithUrls || [],
              }
            }),
          )

          return {
            ...post,
            user: userMap.get(post.user_id),
            comments: commentsWithUsersAndAttachments,
            attachments: postAttachmentsWithUrls || [],
          }
        }

        return {
          ...post,
          user: userMap.get(post.user_id),
          comments: comments || [],
          attachments: postAttachmentsWithUrls || [],
        }
      }),
    )

    // Fetch likes for each post
    const postsWithLikes = await Promise.all(
      postsWithCommentsAndAttachments.map(async (post) => {
        const { data: likes, error: likesError } = await supabase.from("post_likes").select("*").eq("post_id", post.id)

        if (likesError) {
          console.error(`Error fetching likes for post ${post.id}:`, likesError)
          return {
            ...post,
            likes: 0,
            user_has_liked: false,
          }
        }

        const likesCount = likes?.length || 0
        const userHasLiked = session.session?.user?.id
          ? likes?.some((like) => like.user_id === session.session?.user?.id) || false
          : false

        return {
          ...post,
          likes: likesCount,
          user_has_liked: userHasLiked,
        }
      }),
    )

    return postsWithLikes
  } catch (error) {
    console.error("Error in getForumPosts:", error)
    throw error
  }
}

export async function createForumPost(
  userId: string,
  title: string,
  content: string,
  attachments?: File[],
): Promise<ForumPost> {
  try {
    // First, insert the post
    const { data: insertedPost, error: insertError } = await supabase
      .from("forum_posts")
      .insert([{ user_id: userId, title, content, resolved: false }])
      .select()

    if (insertError) throw insertError
    if (!insertedPost || insertedPost.length === 0) throw new Error("No data returned from post insertion")

    const newPost = insertedPost[0] // Get the first (and should be only) inserted post

    // Upload attachments if any
    const uploadedAttachments: ForumAttachment[] = []
    if (attachments && attachments.length > 0) {
      for (const file of attachments) {
        const fileExt = file.name.split(".").pop()
        const fileName = `${userId}/${newPost.id}/${Math.random().toString(36).substring(2)}.${fileExt}`

        // Upload file to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("forum_attachments")
          .upload(fileName, file)

        if (uploadError) {
          console.error("Error uploading attachment:", uploadError)
          continue // Skip this file if upload fails
        }

        // Insert attachment record in database
        const { data: attachmentData, error: attachmentError } = await supabase
          .from("forum_attachments")
          .insert([
            {
              post_id: newPost.id,
              user_id: userId,
              file_name: file.name,
              file_path: fileName,
              file_type: file.type,
              file_size: file.size,
            },
          ])
          .select()

        if (attachmentError) {
          console.error("Error inserting attachment record:", attachmentError)
          continue
        }

        if (attachmentData && attachmentData.length > 0) {
          // Get URL for the uploaded file
          const { data: urlData } = await supabase.storage.from("forum_attachments").createSignedUrl(fileName, 3600) // URL valid for 1 hour

          uploadedAttachments.push({
            ...attachmentData[0],
            url: urlData?.signedUrl || undefined,
          })
        }
      }
    }

    // Fetch user data
    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .eq("id", userId)
      .single()

    if (userError) throw userError

    // Return the formatted post
    return {
      ...newPost,
      user: userData,
      comments: [],
      attachments: uploadedAttachments,
      user_has_liked: false,
      likes: 0,
    }
  } catch (error) {
    console.error("Error in createForumPost:", error)
    throw error
  }
}

export async function createForumComment(
  userId: string,
  postId: string,
  content: string,
  attachments?: File[],
): Promise<ForumComment> {
  try {
    const { data: comment, error } = await supabase
      .from("forum_comments")
      .insert([{ user_id: userId, post_id: postId, content }])
      .select()
      .single()

    if (error) throw error
    if (!comment) throw new Error("Falha ao criar o comentário")

    // Upload attachments if any
    const uploadedAttachments: ForumAttachment[] = []
    if (attachments && attachments.length > 0) {
      for (const file of attachments) {
        const fileExt = file.name.split(".").pop()
        const fileName = `${userId}/${postId}/${comment.id}/${Math.random().toString(36).substring(2)}.${fileExt}`

        // Upload file to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("forum_attachments")
          .upload(fileName, file)

        if (uploadError) {
          console.error("Error uploading attachment:", uploadError)
          continue // Skip this file if upload fails
        }

        // Insert attachment record in database
        const { data: attachmentData, error: attachmentError } = await supabase
          .from("forum_attachments")
          .insert([
            {
              comment_id: comment.id,
              user_id: userId,
              file_name: file.name,
              file_path: fileName,
              file_type: file.type,
              file_size: file.size,
            },
          ])
          .select()

        if (attachmentError) {
          console.error("Error inserting attachment record:", attachmentError)
          continue
        }

        if (attachmentData && attachmentData.length > 0) {
          // Get URL for the uploaded file
          const { data: urlData } = await supabase.storage.from("forum_attachments").createSignedUrl(fileName, 3600) // URL valid for 1 hour

          uploadedAttachments.push({
            ...attachmentData[0],
            url: urlData?.signedUrl || undefined,
          })
        }
      }
    }

    // Fetch user data
    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .eq("id", userId)
      .single()

    if (userError) {
      console.error("Error fetching user data:", userError)
    }

    return {
      ...comment,
      user: userError ? undefined : userData,
      attachments: uploadedAttachments,
    }
  } catch (error) {
    console.error("Error in createForumComment:", error)
    throw error
  }
}

export async function toggleForumPostLike(
  postId: string,
  userId: string,
): Promise<{ likes: number; userHasLiked: boolean }> {
  try {
    // Verificar se o usuário já curtiu o post
    const { data: existingLike, error: checkError } = await supabase
      .from("post_likes")
      .select("*")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 é o código para "nenhum resultado encontrado", que é esperado se o usuário não curtiu o post
      throw checkError
    }

    // Se o usuário já curtiu, remover a curtida
    if (existingLike) {
      console.log(`Removendo curtida do post ${postId} pelo usuário ${userId}`)
      const { error: deleteError } = await supabase
        .from("post_likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", userId)

      if (deleteError) throw deleteError
    }
    // Se o usuário não curtiu, adicionar a curtida
    else {
      console.log(`Adicionando curtida ao post ${postId} pelo usuário ${userId}`)
      const { error: insertError } = await supabase.from("post_likes").insert([{ post_id: postId, user_id: userId }])

      if (insertError) throw insertError
    }

    // Contar o número total de curtidas após a operação
    const { data: likes, error: countError } = await supabase
      .from("post_likes")
      .select("*", { count: "exact" })
      .eq("post_id", postId)

    if (countError) throw countError

    // Verificar novamente se o usuário curtiu o post (para garantir consistência)
    const { data: userLike, error: userLikeError } = await supabase
      .from("post_likes")
      .select("*")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .single()

    if (userLikeError && userLikeError.code !== "PGRST116") throw userLikeError

    const likesCount = likes?.length || 0
    const userHasLiked = !!userLike

    console.log(`Resultado final: Post ${postId} tem ${likesCount} curtidas, usuário curtiu: ${userHasLiked}`)

    return {
      likes: likesCount,
      userHasLiked: userHasLiked,
    }
  } catch (error) {
    console.error("Error in toggleForumPostLike:", error)
    throw error
  }
}

export async function getPostLikes(postId: string, userId: string): Promise<{ likes: number; userHasLiked: boolean }> {
  try {
    const { data, error } = await supabase.from("post_likes").select("*", { count: "exact" }).eq("post_id", postId)

    if (error) throw error

    const { data: userLike, error: userLikeError } = await supabase
      .from("post_likes")
      .select()
      .eq("post_id", postId)
      .eq("user_id", userId)
      .single()

    if (userLikeError && userLikeError.code !== "PGRST116") throw userLikeError

    console.log("Get post likes response:", { likes: data?.length ?? 0, userHasLiked: !!userLike })

    return {
      likes: data?.length ?? 0,
      userHasLiked: !!userLike,
    }
  } catch (error) {
    console.error("Error in getPostLikes:", error)
    throw error
  }
}

export async function deleteForumPost(postId: string): Promise<void> {
  try {
    // First, delete all attachments from storage
    const { data: attachments, error: fetchError } = await supabase
      .from("forum_attachments")
      .select("file_path")
      .eq("post_id", postId)

    if (fetchError) {
      console.error("Error fetching attachments for deletion:", fetchError)
    } else if (attachments && attachments.length > 0) {
      // Delete files from storage
      const filePaths = attachments.map((a) => a.file_path)
      const { error: storageError } = await supabase.storage.from("forum_attachments").remove(filePaths)

      if (storageError) {
        console.error("Error deleting attachment files from storage:", storageError)
      }
    }

    // Then delete the post (this will cascade delete attachments records due to foreign key)
    const { error } = await supabase.from("forum_posts").delete().eq("id", postId)
    if (error) {
      console.error("Error deleting forum post:", error)
      throw error
    }
  } catch (error) {
    console.error("Error in deleteForumPost:", error)
    throw error
  }
}

export async function updateForumPost(
  postId: string,
  title: string,
  content: string,
  newAttachments?: File[],
): Promise<void> {
  try {
    console.log("Atualizando post:", { postId, title, content })

    const { data, error } = await supabase
      .from("forum_posts")
      .update({
        title,
        content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", postId)
      .select()

    if (error) {
      console.error("Error updating forum post:", error)
      throw error
    }

    // Upload new attachments if any
    if (newAttachments && newAttachments.length > 0) {
      // Get user ID
      const { data: post, error: postError } = await supabase
        .from("forum_posts")
        .select("user_id")
        .eq("id", postId)
        .single()

      if (postError) {
        console.error("Error fetching post user_id:", postError)
        throw postError
      }

      const userId = post.user_id

      for (const file of newAttachments) {
        const fileExt = file.name.split(".").pop()
        const fileName = `${userId}/${postId}/${Math.random().toString(36).substring(2)}.${fileExt}`

        // Upload file to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("forum_attachments")
          .upload(fileName, file)

        if (uploadError) {
          console.error("Error uploading attachment:", uploadError)
          continue // Skip this file if upload fails
        }

        // Insert attachment record in database
        const { error: attachmentError } = await supabase.from("forum_attachments").insert([
          {
            post_id: postId,
            user_id: userId,
            file_name: file.name,
            file_path: fileName,
            file_type: file.type,
            file_size: file.size,
          },
        ])

        if (attachmentError) {
          console.error("Error inserting attachment record:", attachmentError)
        }
      }
    }

    console.log("Post atualizado com sucesso:", data)
  } catch (error) {
    console.error("Error in updateForumPost:", error)
    throw error
  }
}

export async function deleteAttachment(attachmentId: string): Promise<void> {
  try {
    // First get the file path
    const { data: attachment, error: fetchError } = await supabase
      .from("forum_attachments")
      .select("file_path")
      .eq("id", attachmentId)
      .single()

    if (fetchError) {
      console.error("Error fetching attachment for deletion:", fetchError)
      throw fetchError
    }

    // Delete the file from storage
    const { error: storageError } = await supabase.storage.from("forum_attachments").remove([attachment.file_path])

    if (storageError) {
      console.error("Error deleting file from storage:", storageError)
    }

    // Delete the attachment record
    const { error: deleteError } = await supabase.from("forum_attachments").delete().eq("id", attachmentId)

    if (deleteError) {
      console.error("Error deleting attachment record:", deleteError)
      throw deleteError
    }
  } catch (error) {
    console.error("Error in deleteAttachment:", error)
    throw error
  }
}
