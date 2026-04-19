import { cn } from '@/lib/utils'

interface TabItem<T extends string> {
  key: T
  label: string
}

interface TabBarProps<T extends string> {
  items: TabItem<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
}

export function TabBar<T extends string>({ items, value, onChange, className }: TabBarProps<T>) {
  return (
    <div className={cn('flex gap-1 p-1 rounded-lg bg-muted/40 border border-border', className)}>
      {items.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={cn(
            'flex-1 text-xs py-1.5 rounded-md font-medium transition-colors',
            value === key
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
