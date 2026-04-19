'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { AuthCard } from '@/components/auth/auth-card'
import { AuthField } from '@/components/auth/auth-field'
import { AuthError } from '@/components/auth/auth-error'
import { createClient } from '@/lib/supabase'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('パスワードが一致しません')
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      router.push('/auth/verify')
    } catch (err) {
      setError(err instanceof Error ? err.message : '登録に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthCard
      title="アカウント作成"
      description="設定ファイルの管理を始めるには登録してください"
      footerPrompt="すでにアカウントをお持ちの方は"
      footerLinkLabel="ログイン"
      footerLinkHref="/auth/login"
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
        <AuthField
          id="confirm-password"
          label="パスワード確認"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? '作成中...' : '登録する'}
        </Button>
      </form>
    </AuthCard>
  )
}
