'use client'

import { useState } from 'react'
import { LoadingButton } from '@/components/custom/loading-button'
import { createClient } from '@/lib/supabase'

export default function DashboardClient() {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      document.cookie = 'sb-user-email=; Max-Age=0; path=/'
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <LoadingButton size="xs" onClick={handleLogout} isLoading={isLoading} loadingText="ログアウト中...">
      ログアウト
    </LoadingButton>
  )
}
