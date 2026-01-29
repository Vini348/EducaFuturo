import { createClient } from "@supabase/supabase-js"

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://gykxdwpducdjeejfagmx.supabase.co"
export const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5a3hkd3BkdWNkamVlamZhZ214Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3NDA5MzksImV4cCI6MjA1MzMxNjkzOX0.B1TDZtn2jIrdMkHJvnfi8uWccCWadDi4juvqBIZlMvo"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: "educafuturo-auth",
  },
})

export async function testSupabaseConnection() {
  try {
    const { error } = await supabase.from("profiles").select("count", { count: "exact", head: true })

    if (error) {
      console.error("Erro na conexão Supabase:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (e) {
    console.error("Erro ao testar conexão:", e)
    return { success: false, error: e instanceof Error ? e.message : "Erro desconhecido" }
  }
}
