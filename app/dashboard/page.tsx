import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import DashboardClient from './dashboard-client'
import UploadDialog from './upload-dialog'
import ConfigList from './config-list'
import { getConfigFiles } from './actions'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('sb-access-token')?.value

  if (!accessToken) {
    redirect('/auth/login')
  }

  // Verify token and get user
  let user: any = null
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        },
      }
    )

    if (response.ok) {
      user = await response.json()
    }
  } catch (error) {
    console.error('Failed to get user:', error)
  }

  if (!user) {
    redirect('/auth/login')
  }

  let configs: any[] = []
  try {
    configs = await getConfigFiles()
  } catch (error) {
    console.error('Failed to fetch configs:', error)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Config Manager</h1>
              <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
            </div>
            <DashboardClient userEmail={user.email || ''} />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid gap-6">
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

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground text-sm">
                No recent activity yet.
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
