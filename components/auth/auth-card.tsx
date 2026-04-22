import Link from 'next/link'
import { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface AuthCardProps {
  title: string
  description: string
  children: ReactNode
  footerPrompt: string
  footerLinkLabel: string
  footerLinkHref: string
}

export function AuthCard({
  title,
  description,
  children,
  footerPrompt,
  footerLinkLabel,
  footerLinkHref,
}: AuthCardProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md pt-5.5 px-6 pb-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          {children}
          <p className="mt-4 text-sm text-muted-foreground">
            {footerPrompt}{' '}
            <Link href={footerLinkHref} className="font-medium text-primary hover:underline">
              {footerLinkLabel}
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
