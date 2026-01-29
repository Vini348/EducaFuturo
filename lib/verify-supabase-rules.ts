import { supabase } from "./supabaseClient"

export async function verifySupabaseRules() {
  try {
    console.log("Verificando regras do Supabase...")

    // Verificar se o bucket de avatares existe
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

    if (bucketsError) {
      console.error("Erro ao listar buckets:", bucketsError)
      return false
    }

    const avatarsBucket = buckets.find((bucket) => bucket.name === "avatars")

    if (!avatarsBucket) {
      console.error("O bucket 'avatars' não existe. Por favor, crie-o no console do Supabase.")
      return false
    }

    console.log("Bucket 'avatars' encontrado.")

    // Verificar se podemos listar arquivos no bucket (teste de política SELECT)
    const { data: files, error: filesError } = await supabase.storage.from("avatars").list()

    if (filesError) {
      console.error("Erro ao listar arquivos no bucket 'avatars'. Verifique a política SELECT:", filesError)
      return false
    }

    console.log("Política SELECT para o bucket 'avatars' está funcionando.")

    // Verificar se a tabela profiles existe
    const { count, error: profilesError } = await supabase.from("profiles").select("*", { count: "exact", head: true })

    if (profilesError) {
      console.error("Erro ao verificar a tabela 'profiles':", profilesError)
      return false
    }

    console.log("Tabela 'profiles' encontrada.")

    console.log("Todas as regras do Supabase estão configuradas corretamente!")
    return true
  } catch (error) {
    console.error("Erro ao verificar regras do Supabase:", error)
    return false
  }
}

// Executar a verificação quando o arquivo for importado
verifySupabaseRules().then((success) => {
  if (success) {
    console.log("✅ Supabase configurado corretamente")
  } else {
    console.warn("⚠️ Problemas encontrados na configuração do Supabase")
  }
})
