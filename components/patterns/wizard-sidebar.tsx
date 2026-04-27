import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WizardStep {
  id: string
  label: string
  icon: LucideIcon
}

interface WizardSidebarProps {
  steps: readonly WizardStep[]
  activeSection: string
  onNavigate: (id: string) => void
}

export function WizardSidebar({ steps, activeSection, onNavigate }: WizardSidebarProps) {
  return (
    <aside className="hidden lg:block">
      <nav className="sticky space-y-0.5" style={{ top: 'calc(3.5rem + 1.5rem)' }}>
        {steps.map((step, i) => {
          const StepIcon = step.icon
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onNavigate(step.id)}
              className={cn(
                'flex items-center gap-2 w-full text-left px-2.5 py-2 rounded-md text-xs transition-colors duration-ui',
                activeSection === step.id
                  ? 'bg-primary-surface text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <span className="w-4 shrink-0 text-2xs font-mono tabular-nums opacity-40">{i + 1}</span>
              <StepIcon className="size-3 shrink-0" />
              <span className="leading-tight truncate">{step.label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
