'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { AuthCard } from '@/components/auth/auth-card'
import { AuthField } from '@/components/auth/auth-field'
import { AuthError } from '@/components/auth/auth-error'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      if (!data.session) throw new Error('No session returned')

      const syncResponse = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken: data.session.access_token,
          refreshToken: data.session.refresh_token,
        }),
      })

      if (!syncResponse.ok) {
        throw new Error('Failed to sync session')
      }

      router.refresh()
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthCard
      title="ログイン"
      description="メールアドレスとパスワードを入力してください"
      footerPrompt="アカウントをお持ちでない方は"
      footerLinkLabel="新規登録"
      footerLinkHref="/auth/signup"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AuthError message={error} />
        <AuthField
          id="email"
          label="メールアドレス"
          type="email"
          value={email}
          onChange={setEmail}
          disabled={isLoading}
        />
        <AuthField
          id="password"
          label="パスワード"
          type="password"
          value={password}
          onChange={setPassword}
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'ログイン中...' : 'ログイン'}
        </Button>
      </form>
    </AuthCard>
  )
}
