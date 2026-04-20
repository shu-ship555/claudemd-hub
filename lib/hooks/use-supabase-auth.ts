import { useCallback } from 'react'
import { createClient } from '@/lib/supabase'

export function useSupabaseAuth() {
  const supabase = useCallback(() => createClient(), [])

  const signInWithPassword = useCallback(
    async (email: string, password: string) => {
      const client = supabase()
      return client.auth.signInWithPassword({ email, password })
    },
    [supabase]
  )

  const signUp = useCallback(
    async (email: string, password: string) => {
      const client = supabase()
      return client.auth.signUp({ email, password })
    },
    [supabase]
  )

  const signOut = useCallback(async () => {
    const client = supabase()
    return client.auth.signOut()
  }, [supabase])

  return {
    supabase,
    signInWithPassword,
    signUp,
    signOut,
  }
}
