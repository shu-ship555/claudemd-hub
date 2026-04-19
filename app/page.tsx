import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Claude Config Manager</CardTitle>
          <CardDescription>
            Manage and organize your Claude Code configuration files
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Store, version, and sync your Claude Code settings across multiple machines.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/dashboard">
              <Button className="w-full">
                DESIGN.md を生成する
              </Button>
            </Link>
            <div className="flex gap-3">
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
