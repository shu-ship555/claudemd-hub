import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface FieldLabelProps {
  children: React.ReactNode
  requirement?: 'required' | 'optional'
  className?: string
}

export function FieldLabel({ children, requirement, className }: FieldLabelProps) {
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <label className="text-sm font-medium">{children}</label>
      {requirement === 'required' && <Badge variant="destructive">必須</Badge>}
      {requirement === 'optional' && <Badge variant="outline">任意</Badge>}
    </div>
  )
}
