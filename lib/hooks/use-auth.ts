'use client'

import { useEffect, useState } from 'react'
import { fetchSupabaseUser } from '@/lib/supabase-auth'

function readAccessTokenFromCookie(): string | undefined {
  if (typeof document === 'undefined') return undefined
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith('sb-access-token='))
    ?.split('=')[1]
}

export function useAuth() {
  const [userEmail, setUserEmail] = useState<string | null | undefined>(undefined)

  useEffect(() => {
    ;(async () => {
      const token = readAccessTokenFromCookie()
      const user = token ? await fetchSupabaseUser(token) : null
      setUserEmail(user?.email ?? null)
    })()
  }, [])

  return {
    isLoggedIn: userEmail != null,
    isLoading: userEmail === undefined,
    userEmail: userEmail ?? null,
  }
}
