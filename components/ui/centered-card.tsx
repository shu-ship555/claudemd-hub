import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface CenteredCardProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  cardClassName?: string
}

export function CenteredCard({
  title,
  description,
  children,
  className,
  cardClassName,
}: CenteredCardProps) {
  return (
    <main className={cn('flex min-h-screen flex-col items-center justify-center bg-background p-4', className)}>
      <Card className={cn('w-full max-w-md', cardClassName)}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </main>
  )
}
