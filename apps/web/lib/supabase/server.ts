import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Singleton server client instance
let serverClientInstance: ReturnType<typeof createServerClient> | null = null

async function getServerClient() {
  if (!serverClientInstance) {
    const cookieStore = await cookies()
    
    serverClientInstance = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )
  }
  
  return serverClientInstance
}

// Export singleton client
export const supabase = getServerClient

// Export the client instance directly for convenience
export const supabaseServerClient = getServerClient

// Helper function to get current user
export async function getUser() {
  const client = await getServerClient()
  return await client.auth.getUser()
}