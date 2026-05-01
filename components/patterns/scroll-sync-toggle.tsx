'use client'

import { Switch } from '@/components/ui/switch'

interface ScrollSyncToggleProps {
  enabled: boolean
  onChange: (v: boolean) => void
}

export function ScrollSyncToggle({ enabled, onChange }: ScrollSyncToggleProps) {
  return (
    <div className="fixed bottom-6 right-6 flex items-center gap-2.5 bg-primary-surface rounded-full px-4 py-2 z-50">
      <Switch checked={enabled} onCheckedChange={onChange} />
      <span className="text-sm text-foreground select-none">スクロール同期</span>
    </div>
  )
}
