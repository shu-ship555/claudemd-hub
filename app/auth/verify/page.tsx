'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function VerifyPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Check Your Email</CardTitle>
          <CardDescription>
            We've sent you a confirmation link
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
            <p>
              Click the link in your email to confirm your account and get started.
            </p>
          </div>

          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              Didn't receive the email? Check your spam folder or try signing up again.
            </p>
          </div>

          <Link href="/auth/login">
            <Button variant="outline" className="w-full">
              Back to Login
            </Button>
          </Link>
        </CardContent>
      </Card>
    </main>
  )
}
