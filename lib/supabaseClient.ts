import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://gykxdwpducdjeejfagmx.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5a3hkd3BkdWNkamVlamZhZ214Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3NDA5MzksImV4cCI6MjA1MzMxNjkzOX0.B1TDZtn2jIrdMkHJvnfi8uWccCWadDi4juvqBIZlMvo"

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false, // Disable auto-detection to prevent OAuth errors
    storageKey: "educafuturo-auth",
  },
})

function createMockSupabaseClient() {
  return {
    auth: {
      signUp: async () => ({ data: null, error: null }),
      signInWithPassword: async () => ({ data: null, error: null }),
      signOut: async () => ({ error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: null } }),
    },
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: null }),
      update: () => ({ data: null, error: null }),
      delete: () => ({ data: null, error: null }),
    }),
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error: null }),
        download: async () => ({ data: null, error: null }),
      }),
    },
  }
}

export { supabase, supabaseUrl, supabaseAnonKey }
