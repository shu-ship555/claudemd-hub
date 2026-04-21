'use client'

import { ExternalLink } from 'lucide-react'
import DashboardClient from '@/app/dashboard/dashboard-client'
import { useAuth } from '@/lib/hooks/use-auth'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface DashboardHeaderProps {
  title: string
  subtitle?: string
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  const { isLoggedIn, isLoading, userEmail } = useAuth()

  return (
    <header className="sticky top-0 z-50 h-14 bg-card/95 backdrop-blur-xl backdrop-saturate-150 border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-full pb-px flex justify-between items-center">
        <div>
          <h1 className="flex items-center gap-2 text-sm font-bold leading-[120%] tracking-[0.04em]">
            {title}
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
          <a href="/dashboard" className="text-xs leading-[120%] tracking-[0.04em] text-muted-foreground hover:text-foreground transition-colors duration-ui">
            ジェネレーター
          </a>
          {isLoggedIn && (
            <a href="/dashboard/files" className="text-xs leading-[120%] tracking-[0.04em] text-muted-foreground hover:text-foreground transition-colors duration-ui">
              設定ファイル管理
            </a>
          )}
          <a
            href="https://shumiyata.com/contact/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs leading-[120%] tracking-[0.04em] text-muted-foreground hover:text-foreground transition-colors duration-ui"
          >
            お問い合わせ
            <ExternalLink className="size-3" />
          </a>
          {!isLoading && (
            isLoggedIn ? (
              <DashboardClient />
            ) : (
              <div className="flex items-center gap-2">
                <a href="/auth/login" className="text-xs leading-[120%] tracking-[0.04em] text-muted-foreground hover:text-foreground transition-colors duration-ui">
                  ログイン
                </a>
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
