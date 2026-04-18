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
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle>Configuration Files</CardTitle>
              <CardDescription>
                Manage and sync your Claude Code configuration files
              </CardDescription>
            </div>
            <UploadDialog />
          </CardHeader>
          <CardContent>
            <ConfigList configs={configs} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
