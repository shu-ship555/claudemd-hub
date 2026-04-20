'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthCard } from '@/components/auth/auth-card'
import { AuthField } from '@/components/auth/auth-field'
import { AuthError } from '@/components/auth/auth-error'
import { LoadingButton } from '@/components/custom/loading-button'
import { useFormState } from '@/lib/hooks/use-form-state'
import { useSupabaseAuth } from '@/lib/hooks/use-supabase-auth'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const { error, isLoading, setError, setIsLoading } = useFormState()
  const { signUp } = useSupabaseAuth()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('パスワードが一致しません')
      return
    }

    setIsLoading(true)

    try {
      const { error } = await signUp(email, password)
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
        <LoadingButton type="submit" isLoading={isLoading} loadingText="作成中..." className="w-full">
          登録する
        </LoadingButton>
      </form>
    </AuthCard>
  )
}
