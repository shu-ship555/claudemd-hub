'use client'

import { useEffect, useState } from 'react'
import DashboardClient from '@/app/dashboard/dashboard-client'
import { fetchSupabaseUser } from '@/lib/supabase-auth'

interface DashboardHeaderProps {
  title: string
  subtitle?: string
}

function readAccessTokenFromCookie(): string | undefined {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith('sb-access-token='))
    ?.split('=')[1]
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const token = readAccessTokenFromCookie()
    if (!token) return
    fetchSupabaseUser(token).then((user) => {
      if (user?.email) setUserEmail(user.email)
    })
  }, [])

  return (
    <header className="sticky top-0 z-50 h-14 bg-card/90 backdrop-blur-xl backdrop-saturate-150">
      <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
        <div>
          <h1 className="text-sm font-semibold leading-tight">{title}</h1>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {!subtitle && userEmail && (
            <p className="text-xs text-muted-foreground">{userEmail}</p>
          )}
        </div>
        <nav className="flex items-center gap-5">
          <a href="/dashboard" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            ジェネレーター
          </a>
          <a href="/dashboard/files" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            設定ファイル管理
          </a>
          <DashboardClient />
        </nav>
      </div>
    </header>
  )
}
