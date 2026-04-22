import { type LucideIcon } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface SectionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  description?: string
  icon?: LucideIcon
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function SectionCard({ label, description, icon: Icon, children, className, onClick, ...rest }: SectionCardProps) {
  return (
    <div className={cn('rounded-xl border border-border bg-card overflow-hidden transition-colors duration-ui hover:border-primary', { 'cursor-pointer': onClick }, className)} {...rest}>
      <div className="px-6 pt-4 pb-4 bg-primary-surface rounded-t-xl space-y-1 border-b border-border" onClick={onClick}>
        <Label className="text-sm font-bold leading-[120%] tracking-[0.04em] flex items-center gap-2 text-primary">
          {Icon && <Icon className="h-4 w-4 text-primary" />}
          {label}
        </Label>
        {description && (
          <p className="text-xs leading-[170%] tracking-[0.06em] text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="space-y-5 px-6 pt-6 pb-6">
        {children}
      </div>
    </div>
  )
}
