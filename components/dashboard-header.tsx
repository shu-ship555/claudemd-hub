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
    <header className="border-b border-border sticky top-0 z-50 bg-background">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle || userEmail}</p>
          )}
          {!subtitle && userEmail && (
            <p className="text-sm text-muted-foreground">{userEmail}</p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <a href="/dashboard" className="text-sm hover:text-foreground transition-colors">
            ジェネレーター
          </a>
          <a href="/dashboard/files" className="text-sm hover:text-foreground transition-colors">
            設定ファイル管理
          </a>
          <DashboardClient />
        </div>
      </div>
    </header>
  )
}
