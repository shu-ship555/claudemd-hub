import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase-server'
import DashboardClient from './dashboard-client'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
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
            <CardHeader>
              <CardTitle>Configuration Files</CardTitle>
              <CardDescription>
                Manage and sync your Claude Code configuration files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground">
                No configuration files yet. Create or upload your first config file.
              </div>
              <div className="mt-6 flex gap-3">
                <Button>Upload Config</Button>
                <Button variant="outline">Create New</Button>
              </div>
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
