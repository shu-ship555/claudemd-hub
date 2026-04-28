'use client'

import { useState } from 'react'
import { AuthCard } from '@/components/auth/auth-card'
import { AuthField } from '@/components/auth/auth-field'
import { AuthError } from '@/components/auth/auth-error'
import { LoadingButton } from '@/components/custom/loading-button'
import { useFormState } from '@/lib/hooks/use-form-state'
import { useSupabaseAuth } from '@/lib/hooks/use-supabase-auth'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const { error, isLoading, setError, setIsLoading } = useFormState()
  const { resetPasswordForEmail } = useSupabaseAuth()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const redirectTo = `${window.location.origin}/auth/reset-password`
      const { error } = await resetPasswordForEmail(email, redirectTo)
      if (error) throw error
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'メールの送信に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  if (sent) {
    return (
      <AuthCard
        title="メールを送信しました"
        description={`${email} にパスワード再設定のリンクを送りました。メールをご確認ください。`}
        footerPrompt="リンクが届かない場合は迷惑メールフォルダをご確認ください。"
        footerLinkLabel="ログインに戻る"
        footerLinkHref="/auth/login"
      >
        <></>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title="パスワードの再設定"
      description="登録済みのメールアドレスを入力してください。再設定リンクをお送りします。"
      footerPrompt="パスワードを思い出した方は"
      footerLinkLabel="ログイン"
      footerLinkHref="/auth/login"
      cardClassName="px-8 pt-8 pb-10 gap-4"
      headerClassName="p-0"
      contentClassName="p-0"
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
        <LoadingButton type="submit" isLoading={isLoading} loadingText="送信中..." className="w-full">
          再設定リンクを送る
        </LoadingButton>
      </form>
    </AuthCard>
  )
}
