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
    <header className="sticky top-0 z-50 h-12 bg-black/80 backdrop-blur-[20px] backdrop-saturate-180">
      <div className="max-w-7xl mx-auto px-4 h-full flex justify-between items-center">
        <div>
          <h1 className="text-sm font-semibold text-white leading-tight">{title}</h1>
          {subtitle && (
            <p className="text-xs text-white/60">{subtitle}</p>
          )}
          {!subtitle && userEmail && (
            <p className="text-xs text-white/60">{userEmail}</p>
          )}
        </div>
        <nav className="flex items-center gap-4">
          <a href="/dashboard" className="text-xs text-white/80 hover:text-white transition-colors">
            ジェネレーター
          </a>
          <a href="/dashboard/files" className="text-xs text-white/80 hover:text-white transition-colors">
            設定ファイル管理
          </a>
          <DashboardClient />
        </nav>
      </div>
    </header>
  )
}
