import { type LucideIcon } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface SectionCardProps {
  label: string
  description?: string
  icon?: LucideIcon
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function SectionCard({ label, description, icon: Icon, children, className, onClick }: SectionCardProps) {
  return (
    <div className={cn('rounded-xl border border-border bg-card overflow-hidden', { 'cursor-pointer hover:border-primary/40': onClick }, className)}>
      <div className="px-6 pt-4 pb-4 bg-primary/8 rounded-t-xl space-y-1" onClick={onClick}>
        <Label className="text-sm font-bold flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-primary" />}
          {label}
        </Label>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="space-y-5 px-6 pt-6 pb-6">
        {children}
      </div>
    </div>
  )
}
