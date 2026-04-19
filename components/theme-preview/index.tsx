'use client'

import { Moon, Sun } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export type Granularity = 'atom' | 'module' | 'component' | 'template'

const GRANULARITIES: { key: Granularity; label: string }[] = [
  { key: 'atom', label: 'Atom' },
  { key: 'module', label: 'Module' },
  { key: 'component', label: 'Component' },
  { key: 'template', label: 'Template' },
]

// ── カラーセット ──────────────────────────────────────────────────────────────

type Colors = {
  bg: string; surface: string; border: string; primary: string
  text: string; muted: string; success: string; warning: string
  danger: string; orange: string
}

const DARK: Colors = {
  bg: '#0b1326', surface: '#111c35', border: '#1e2d50', primary: '#2665fd',
  text: '#dae2fd', muted: '#7a90c4', success: '#4ade80', warning: '#fbbf24',
  danger: '#ffb4ab', orange: '#fb923c',
}

const LIGHT: Colors = {
  bg: '#f8faff', surface: '#ffffff', border: '#d1daf5', primary: '#2665fd',
  text: '#0f1e3d', muted: '#5a6a9a', success: '#16a34a', warning: '#d97706',
  danger: '#dc2626', orange: '#ea580c',
}

// ── デフォルトテーマ コンポーネント ──────────────────────────────────────────

function DefaultAtom({ c }: { c: Colors }) {
  return (
    <div className="space-y-6 p-5 rounded-xl" style={{ background: c.bg, color: c.text }}>
      <section className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider" style={{ color: c.muted }}>Colors</p>
        <div className="flex gap-2 flex-wrap">
          {[
            { name: 'Primary', color: c.primary },
            { name: 'Success', color: c.success },
            { name: 'Warning', color: c.warning },
            { name: 'Danger', color: c.danger },
            { name: 'Highlight', color: c.orange },
            { name: 'Muted', color: c.muted },
          ].map(({ name, color }) => (
            <div key={name} className="flex flex-col items-center gap-1">
              <div className="w-9 h-9 rounded-lg" style={{ background: color }} />
              <span className="text-[10px]" style={{ color: c.muted }}>{name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wider" style={{ color: c.muted }}>Typography</p>
        <p className="font-bold" style={{ fontSize: 18, color: c.text }}>Page Title</p>
        <p className="font-bold font-mono" style={{ fontSize: 20, color: c.text }}>1,234.56</p>
        <p style={{ fontSize: 14, color: c.text }}>Body text — 14px regular</p>
        <p style={{ fontSize: 12, color: c.muted }}>Supplemental — 12px muted</p>
        <p style={{ fontSize: 10, color: c.muted }}>Minimum — 10px</p>
      </section>

      <section className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider" style={{ color: c.muted }}>Buttons</p>
        <div className="flex gap-2 flex-wrap">
          <button className="px-3 py-1.5 rounded-lg text-sm font-medium" style={{ background: c.primary, color: '#fff' }}>Primary</button>
          <button className="px-3 py-1.5 rounded-lg text-sm font-medium" style={{ background: 'transparent', border: `1px solid ${c.border}`, color: c.text }}>Secondary</button>
          <button className="px-3 py-1.5 rounded-lg text-sm font-medium opacity-40 cursor-not-allowed" style={{ background: c.primary, color: '#fff' }}>Disabled</button>
        </div>
      </section>

      <section className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider" style={{ color: c.muted }}>Badges</p>
        <div className="flex gap-2 flex-wrap">
          {[
            { label: 'Info', bg: `${c.primary}22`, color: c.primary },
            { label: 'Success', bg: `${c.success}22`, color: c.success },
            { label: 'Warning', bg: `${c.warning}22`, color: c.warning },
            { label: 'Danger', bg: `${c.danger}22`, color: c.danger },
          ].map(({ label, bg, color }) => (
            <span key={label} className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: bg, color }}>{label}</span>
          ))}
        </div>
      </section>
    </div>
  )
}

function DefaultModule({ c }: { c: Colors }) {
  return (
    <div className="space-y-4 p-5 rounded-xl" style={{ background: c.bg, color: c.text }}>
      <section className="space-y-1.5">
        <p className="text-xs font-medium uppercase tracking-wider" style={{ color: c.muted }}>Form Field</p>
        <div className="space-y-1">
          <label className="text-sm font-medium" style={{ color: c.text }}>Email</label>
          <input readOnly defaultValue="user@example.com" className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: c.surface, border: `1px solid ${c.border}`, color: c.text }} />
        </div>
      </section>

      <section className="space-y-1.5">
        <p className="text-xs font-medium uppercase tracking-wider" style={{ color: c.muted }}>Stat Cards</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Sets', value: '12', color: c.primary },
            { label: 'Reps', value: '84', color: c.success },
            { label: 'kcal', value: '320', color: c.orange },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg p-2.5 text-center" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
              <p className="font-bold font-mono text-xl" style={{ color }}>{value}</p>
              <p className="text-xs" style={{ color: c.muted }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-1.5">
        <p className="text-xs font-medium uppercase tracking-wider" style={{ color: c.muted }}>Alert</p>
        <div className="flex gap-2 items-start rounded-lg px-3 py-2.5" style={{ background: `${c.primary}22`, border: `1px solid ${c.primary}44` }}>
          <span style={{ color: c.primary, fontSize: 14 }}>ℹ</span>
          <p className="text-sm" style={{ color: c.text }}>Synced 3 minutes ago</p>
        </div>
      </section>
    </div>
  )
}

function DefaultComponent({ c }: { c: Colors }) {
  return (
    <div className="space-y-4 p-5 rounded-xl" style={{ background: c.bg, color: c.text }}>
      <section className="space-y-1.5">
        <p className="text-xs font-medium uppercase tracking-wider" style={{ color: c.muted }}>Data Card</p>
        <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${c.border}` }}>
          <div className="flex items-center justify-between px-4 py-3" style={{ background: c.surface, borderBottom: `1px solid ${c.border}` }}>
            <span className="text-sm font-semibold" style={{ color: c.text }}>Workout Log</span>
            <button className="text-xs px-2.5 py-1 rounded-lg" style={{ background: c.primary, color: '#fff' }}>+ Add</button>
          </div>
          {[
            { name: 'Bench Press', sets: 4, reps: 8, status: 'success' },
            { name: 'Squat', sets: 3, reps: 10, status: 'warning' },
            { name: 'Deadlift', sets: 2, reps: 5, status: 'danger' },
          ].map(({ name, sets, reps, status }) => {
            const color = status === 'success' ? c.success : status === 'warning' ? c.warning : c.danger
            return (
              <div key={name} className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: `1px solid ${c.border}` }}>
                <span className="text-sm" style={{ color: c.text }}>{name}</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm" style={{ color: c.muted }}>{sets}×{reps}</span>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="space-y-1.5">
        <p className="text-xs font-medium uppercase tracking-wider" style={{ color: c.muted }}>Navigation</p>
        <div className="flex gap-1 p-1 rounded-lg" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
          {['Dashboard', 'History', 'Profile'].map((item, i) => (
            <button key={item} className="flex-1 text-xs py-1.5 rounded-md font-medium"
              style={i === 0 ? { background: c.primary, color: '#fff' } : { color: c.muted }}>
              {item}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

function DefaultTemplate({ c }: { c: Colors }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}>
      <div className="flex items-center justify-between px-4 py-2.5" style={{ background: c.surface, borderBottom: `1px solid ${c.border}` }}>
        <span className="text-sm font-bold" style={{ color: c.text }}>MyApp</span>
        <div className="flex gap-3">
          {['Home', 'Log', 'Stats'].map((item, i) => (
            <span key={item} className="text-xs" style={{ color: i === 1 ? c.primary : c.muted }}>{item}</span>
          ))}
        </div>
        <div className="w-6 h-6 rounded-full" style={{ background: c.primary }} />
      </div>

      <div className="p-4 space-y-3">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Workouts', value: '24', color: c.primary },
            { label: 'Total Sets', value: '312', color: c.success },
            { label: 'kcal', value: '8.4k', color: c.orange },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg p-2 text-center" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
              <p className="font-bold font-mono" style={{ fontSize: 16, color }}>{value}</p>
              <p style={{ fontSize: 10, color: c.muted }}>{label}</p>
            </div>
          ))}
        </div>

        <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${c.border}` }}>
          <div className="px-3 py-2" style={{ background: c.surface, borderBottom: `1px solid ${c.border}` }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: c.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recent</span>
          </div>
          {['Bench Press — 4×8', 'Squat — 3×10', 'Pull-up — 3×6'].map((item) => (
            <div key={item} className="flex items-center justify-between px-3 py-2" style={{ borderBottom: `1px solid ${c.border}` }}>
              <span style={{ fontSize: 12, color: c.text }}>{item}</span>
              <span style={{ fontSize: 10, color: c.muted }}>Today</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const DEFAULT_VIEWS: Record<Granularity, React.FC<{ c: Colors }>> = {
  atom: DefaultAtom,
  module: DefaultModule,
  component: DefaultComponent,
  template: DefaultTemplate,
}

// ── ThemePreview ─────────────────────────────────────────────────────────────

interface ThemePreviewProps {
  theme: string
  height?: string
}

export function ThemePreview({ theme, height = '400px' }: ThemePreviewProps) {
  const [granularity, setGranularity] = useState<Granularity>('atom')
  const [isDark, setIsDark] = useState(false)

  if (!theme || theme === '') {
    return (
      <div className="flex items-center justify-center h-48 rounded-xl border border-dashed border-border text-muted-foreground text-sm">
        テーマを選択するとプレビューが表示されます
      </div>
    )
  }

  if (theme === 'カスタム') {
    return (
      <div className="flex items-center justify-center h-48 rounded-xl border border-dashed border-destructive/50 text-destructive text-sm">
        カスタムテーマのコンポーネントプレビューは未対応です
      </div>
    )
  }

  const colors = isDark ? DARK : LIGHT
  const PreviewComponent = DEFAULT_VIEWS[granularity]

  return (
    <div className="flex flex-col gap-3" style={{ height }}>
      {/* Controls — スクロール対象外 */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex gap-1 p-1 rounded-lg bg-muted/40 border border-border flex-1">
          {GRANULARITIES.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setGranularity(key)}
              className={cn(
                'flex-1 text-xs py-1.5 rounded-md font-medium transition-colors',
                granularity === key
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setIsDark((d) => !d)}
          className="p-1.5 rounded-md border border-border bg-card hover:bg-muted transition-colors shrink-0"
          title={isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
        >
          {isDark ? <Sun className="h-3.5 w-3.5 text-muted-foreground" /> : <Moon className="h-3.5 w-3.5 text-muted-foreground" />}
        </button>
      </div>

      {/* Disclaimer — スクロール対象外・固定 */}
      <p className="shrink-0 text-[11px] text-muted-foreground leading-relaxed">
        ※ このプレビューはイメージです。実際に生成されるコンポーネントと異なる場合があります。
      </p>

      {/* Preview — ここだけスクロール */}
      <div className="overflow-y-auto min-h-0">
        <PreviewComponent c={colors} />
      </div>
    </div>
  )
}
