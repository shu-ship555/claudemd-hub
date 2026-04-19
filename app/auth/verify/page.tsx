'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function VerifyPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>メールを確認してください</CardTitle>
          <CardDescription>
            確認用リンクをメールで送信しました
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
            <p>
              メールに記載されているリンクをクリックして、アカウントを有効化してください。
            </p>
          </div>

          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              メールが届かない場合は、迷惑メールフォルダをご確認いただくか、再度登録をお試しください。
            </p>
          </div>

          <Link href="/auth/login">
            <Button variant="outline" className="w-full">
              ログインに戻る
            </Button>
          </Link>
        </CardContent>
      </Card>
    </main>
  )
}
