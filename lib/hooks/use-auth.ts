'use client'

import { useState, useEffect } from 'react'

function readUserEmailFromCookie(): string | null {
  if (typeof document === 'undefined') return null
  const value = document.cookie
    .split('; ')
    .find((row) => row.startsWith('sb-user-email='))
    ?.split('=')[1]
  return value ? decodeURIComponent(value) : null
}

export function useAuth() {
  const [userEmail, setUserEmail] = useState<string | null | undefined>(undefined)

  useEffect(() => {
    setUserEmail(readUserEmailFromCookie())
  }, [])

  return {
    isLoggedIn: userEmail != null && userEmail !== '',
    isLoading: userEmail === undefined,
    userEmail: userEmail ?? null,
  }
}
