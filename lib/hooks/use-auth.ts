'use client'

import { useSyncExternalStore } from 'react'

function subscribe() {
  return () => {}
}

function getSnapshot(): string | null {
  const value = document.cookie
    .split('; ')
    .find((row) => row.startsWith('sb-user-email='))
    ?.split('=')[1]
  return value ? decodeURIComponent(value) : null
}

function getServerSnapshot(): null {
  return null
}

export function useAuth() {
  const userEmail = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  return {
    isLoggedIn: userEmail != null && userEmail !== '',
    isLoading: false,
    userEmail,
  }
}
