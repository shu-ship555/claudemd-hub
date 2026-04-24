'use client'

import { ExternalLink } from 'lucide-react'
import DashboardClient from '@/app/dashboard/dashboard-client'
import { useAuth } from '@/lib/hooks/use-auth'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { NavLink } from '@/components/custom/nav-link'
import { AppIcon } from '@/components/ui/app-icon'
import { cn } from '@/lib/utils'

interface DashboardHeaderProps {
  title: string
  subtitle?: string
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  const { isLoggedIn, isLoading, userEmail } = useAuth()

  return (
    <header className="sticky top-0 z-50 h-14 bg-card/95 backdrop-blur-xl backdrop-saturate-150 border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-full pt-1 pb-2 flex justify-between items-center">
        <div>
          <h1 className="flex items-center gap-3 mb-0.5">
            <NavLink href="/" noActive className="flex items-center gap-1 font-bold text-foreground hover:text-muted-foreground text-base tracking-normal">
                <AppIcon />
                {title}
              </NavLink>
            <Badge variant="outline">Beta</Badge>
          </h1>
          {subtitle && (
            <p className="text-xs leading-[120%] tracking-[0.04em] text-muted-foreground">{subtitle}</p>
          )}
          {!subtitle && userEmail && (
            <p className="text-xs leading-[120%] tracking-[0.04em] text-muted-foreground">{userEmail}</p>
          )}
        </div>
        <nav className="flex items-center gap-5">
          <NavLink href="/dashboard">DESIGN.md</NavLink>
          <NavLink href="/dashboard/agent">AGENT.md</NavLink>
          {isLoggedIn && (
            <NavLink href="/dashboard/files">設定ファイル管理</NavLink>
          )}
          <NavLink
            href="https://shumiyata.com/contact/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1"
          >
            お問い合わせ
            <ExternalLink className="size-3" />
          </NavLink>
          {!isLoading && (
            isLoggedIn ? (
              <DashboardClient />
            ) : (
              <div className="flex items-center gap-2">
                <NavLink href="/auth/login">ログイン</NavLink>
                <a href="/auth/signup" className={cn(buttonVariants({ size: 'xs' }))}>
                  新規登録
                </a>
              </div>
            )
          )}
        </nav>
      </div>
    </header>
  )
}
