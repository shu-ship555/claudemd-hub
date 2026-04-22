import Link from 'next/link'
import { ReactNode } from 'react'
import { CenteredCard } from '@/components/custom/centered-card'

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
    <CenteredCard
      title={title}
      description={description}
      cardClassName="pt-5.5 px-6 pb-6"
      headerClassName="px-0 pt-0"
      contentClassName="px-0"
      footer={
        <p className="mt-4 text-sm text-muted-foreground">
          {footerPrompt}{' '}
          <Link href={footerLinkHref} className="font-medium text-primary hover:underline">
            {footerLinkLabel}
          </Link>
        </p>
      }
    >
      {children}
    </CenteredCard>
  )
}
