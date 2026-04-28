'use client'

import { useState } from 'react'
import { AuthCard } from '@/components/auth/auth-card'
import { AuthField } from '@/components/auth/auth-field'
import { AuthError } from '@/components/auth/auth-error'
import { LoadingButton } from '@/components/custom/loading-button'
import { useFormState } from '@/lib/hooks/use-form-state'
import { useSupabaseAuth } from '@/lib/hooks/use-supabase-auth'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [done, setDone] = useState(false)
  const { error, isLoading, setError, setIsLoading } = useFormState()
  const { updateUser } = useSupabaseAuth()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('パスワードが一致しません')
      return
    }

    setIsLoading(true)

    try {
      const { error } = await updateUser(password)
      if (error) throw error
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'パスワードの更新に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  if (done) {
    return (
      <AuthCard
        title="パスワードを更新しました"
        description="新しいパスワードでログインしてください。"
        footerPrompt=""
        footerLinkLabel="ログインへ"
        footerLinkHref="/auth/login"
      >
        <></>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title="新しいパスワードの設定"
      description="新しいパスワードを入力してください。"
      footerPrompt=""
      footerLinkLabel="ログインに戻る"
      footerLinkHref="/auth/login"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AuthError message={error} />
        <AuthField
          id="password"
          label="新しいパスワード"
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
        <LoadingButton type="submit" isLoading={isLoading} loadingText="更新中..." className="w-full">
          パスワードを更新する
        </LoadingButton>
      </form>
    </AuthCard>
  )
}
