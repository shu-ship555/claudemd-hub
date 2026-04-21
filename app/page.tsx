import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Claude Config Manager</CardTitle>
          <CardDescription>
            Claude Code の設定ファイルを管理・整理します
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Link href="/dashboard">
            <Button className="w-full">
              DESIGN.md を生成する
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground">
            アカウントをお持ちの方は{' '}
            <Link href="/auth/login" className="font-medium text-primary hover:underline">
              ログイン
            </Link>
            {' '}または{' '}
            <Link href="/auth/signup" className="font-medium text-primary hover:underline">
              新規登録
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
