'use client'

import { ThemeProvider } from 'next-themes'
import { ReactNode, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') && !session) {
        // リフレッシュトークンが無効になった場合にクッキーをクリア
        document.cookie = 'sb-user-email=; Max-Age=0; path=/'
        document.cookie = 'sb-access-token=; Max-Age=0; path=/'
        document.cookie = 'sb-refresh-token=; Max-Age=0; path=/'
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      {children}
    </ThemeProvider>
  )
}
