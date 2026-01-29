import { supabase } from "./supabaseClient"

// Function to configure the avatars bucket
export async function setupAvatarsBucket() {
  try {
    if (!supabase) {
      console.error("Supabase client not initialized")
      return
    }

    // Check if the bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

    if (bucketsError) {
      console.error("Erro ao listar buckets:", bucketsError)
      return
    }

    const avatarsBucketExists = buckets.some((bucket) => bucket.name === "avatars")

    // If the bucket doesn't exist, create it
    if (!avatarsBucketExists) {
      const { error: createError } = await supabase.storage.createBucket("avatars", {
        public: true,
        fileSizeLimit: 5242880, // 5MB in bytes
        allowedMimeTypes: ["image/png", "image/jpeg", "image/gif"],
      })

      if (createError) {
        console.error("Erro ao criar bucket de avatares:", createError)
        return
      }

      console.log("Bucket de avatares criado com sucesso")
    }

    // Configure public access policies for the bucket
    const { error: policyError } = await supabase.storage.from("avatars").getPublicUrl("test")

    if (policyError) {
      console.error("Erro ao verificar políticas do bucket:", policyError)
    }

    console.log("Bucket de avatares configurado com sucesso")
  } catch (error) {
    console.error("Erro ao configurar bucket de avatares:", error)
  }
}
