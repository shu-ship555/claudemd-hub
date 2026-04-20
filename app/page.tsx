import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader className="bg-primary-surface border-b border-primary/15 rounded-t-xl pb-5">
          <CardTitle className="text-2xl text-primary">Claude Config Manager</CardTitle>
          <CardDescription>
            Claude Code の設定ファイルを管理・整理します
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 pt-5">
          <p className="text-sm text-muted-foreground">
            Claude Code の設定を保存・バージョン管理し、複数のマシン間で同期できます。
          </p>
          <div className="flex flex-col gap-4">
            <Link href="/dashboard">
              <Button className="w-full">
                DESIGN.md を生成する
              </Button>
            </Link>
            <div className="flex gap-4">
              <Link href="/auth/login" className="flex-1">
                <Button variant="outline" className="w-full">
                  ログイン
                </Button>
              </Link>
              <Link href="/auth/signup" className="flex-1">
                <Button variant="outline" className="w-full">
                  新規登録
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
