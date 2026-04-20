import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardHeader } from '@/components/dashboard-header'
import UploadDialog from '../upload-dialog'
import ConfigList from '../config-list'
import { getConfigFiles, type ConfigFile } from '../actions'
import { fetchSupabaseUser } from '@/lib/supabase-auth'

export default async function FilesPage() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('sb-access-token')?.value

  if (!accessToken) {
    redirect('/auth/login')
  }

  const user = await fetchSupabaseUser(accessToken)
  if (!user) {
    redirect('/auth/login')
  }

  let configs: ConfigFile[] = []
  try {
    configs = await getConfigFiles()
  } catch (error) {
    console.error('Failed to fetch configs:', error)
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="設定ファイル管理" subtitle="Claude Code の設定ファイルを管理・同期します" />
      <main className="max-w-7xl mx-auto px-4 pt-8 pb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle>設定ファイル一覧</CardTitle>
              <CardDescription>
                Claude Code の設定ファイルを管理・同期します
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <span className={`text-sm font-mono ${configs.length >= 10 ? 'text-destructive' : 'text-muted-foreground'}`}>
                {configs.length}&nbsp;/&nbsp;10
              </span>
              <UploadDialog />
            </div>
          </CardHeader>
          <CardContent>
            <ConfigList configs={configs} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
