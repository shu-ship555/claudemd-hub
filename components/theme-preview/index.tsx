'use client'

import { Moon, Sun } from 'lucide-react'
import { useState, useEffect } from 'react'
import { TabBar } from '@/components/patterns/tab-bar'
import { LIGHT_COLORS } from '@/lib/constants'

const GOOGLE_FONTS_FAMILIES: Record<string, string> = {
  'Roboto': 'Roboto',
  'Inter': 'Inter',
  'Noto Sans JP': 'Noto+Sans+JP',
}

// macOS/Windows でフォント名が異なるシステムフォントのフォールバックスタック
const SYSTEM_FONT_STACK: Record<string, string> = {
  'Yu Gothic': '"Yu Gothic", YuGothic, sans-serif',
  'Meiryo': 'Meiryo, "Meiryo UI", sans-serif',
  'Helvetica': 'Helvetica, "Helvetica Neue", Arial, sans-serif',
  'Arial': 'Arial, sans-serif',
  'San Francisco': '-apple-system, BlinkMacSystemFont, sans-serif',
}

function resolveFontFamily(latin?: string, japanese?: string): string {
  const resolve = (name?: string) => name ? (SYSTEM_FONT_STACK[name] ?? `"${name}"`) : null
  return [resolve(latin), resolve(japanese), 'sans-serif'].filter(Boolean).join(', ')
}

function useGoogleFonts(fonts: { latin?: string; japanese?: string } | undefined) {
  useEffect(() => {
    const families = [fonts?.latin, fonts?.japanese]
      .filter((f): f is string => !!f && f in GOOGLE_FONTS_FAMILIES)
      .map((f) => GOOGLE_FONTS_FAMILIES[f])
    if (families.length === 0) return

    const url = `https://fonts.googleapis.com/css2?${families.map((f) => `family=${f}:wght@400;500;700`).join('&')}&display=swap`
    const existing = document.querySelector(`link[data-gf="${families.join(',')}"]`)
    if (existing) return

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = url
    link.dataset.gf = families.join(',')
    document.head.appendChild(link)
  }, [fonts?.latin, fonts?.japanese])
}

export type Granularity = 'atom' | 'module' | 'component' | 'template'

const GRANULARITIES: { key: Granularity; label: string }[] = [
  { key: 'atom', label: 'Atom' },
  { key: 'module', label: 'Module' },
  { key: 'component', label: 'Component' },
  { key: 'template', label: 'Template' },
]

// ── カラーセット ──────────────────────────────────────────────────────────────

export type Colors = {
  bg: string; surface: string; border: string; primary: string
  secondary: string; tertiary: string
  text: string; muted: string; success: string; warning: string
  danger: string; orange: string; info: string
  white: string; gray1: string; gray2: string; gray3: string; gray4: string
  gray5: string; gray6: string; gray7: string; gray8: string; gray9: string
  gray10: string; gray11: string; gray12: string; black: string
}

const DARK: Colors = {
  bg: '#0b1326', surface: '#111c35', border: '#1e2d50', primary: '#2665fd',
  secondary: '#3b65ce', tertiary: '#0d38a5',
  text: '#dae2fd', muted: '#7a90c4', success: '#4ade80', warning: '#fbbf24',
  danger: '#ffb4ab', orange: '#fb923c', info: '#38bdf8',
  white: '#ffffff', gray1: '#f0f0f0', gray2: '#e0e0e0', gray3: '#d0d0d0', gray4: '#c0c0c0',
  gray5: '#b0b0b0', gray6: '#808080', gray7: '#606060', gray8: '#404040', gray9: '#202020',
  gray10: '#101010', gray11: '#050505', gray12: '#010101', black: '#000000',
}

const LIGHT: Colors = LIGHT_COLORS

// ── デフォルトテーマ コンポーネント ──────────────────────────────────────────

type PreviewProps = { c: Colors; sp: number }

function DefaultAtom({ c, sp }: PreviewProps) {
  const gap = sp
  const pad = sp * 1.5
  const brad = `${sp}px`
  return (
    <div className="space-y-6 rounded-xl" style={{ background: c.bg, color: c.text, padding: pad }}>
      <section className="space-y-2">
        <p className="text-xs leading-[120%] tracking-[0.04em] font-bold uppercase" style={{ color: c.muted }}>Colors</p>
        <div className="flex flex-wrap" style={{ gap }}>
          {[
            { name: 'Primary', color: c.primary },
            { name: 'Secondary', color: c.secondary },
            { name: 'Tertiary', color: c.tertiary },
            { name: 'Success', color: c.success },
            { name: 'Warning', color: c.warning },
            { name: 'Danger', color: c.danger },
            { name: 'Text', color: c.text },
            { name: 'BG', color: c.bg },
          ].map(({ name, color }) => (
            <div key={name} className="flex flex-col items-center gap-1">
              <div className="w-9 h-9" style={{ background: color, borderRadius: brad }} />
              <span className="text-[10px] leading-[120%] tracking-[0.04em]" style={{ color: c.muted }}>{name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-1">
        <p className="text-xs leading-[120%] tracking-[0.04em] font-bold uppercase" style={{ color: c.muted }}>Typography</p>
        <p className="font-bold" style={{ fontSize: 18, color: c.text }}>Design System デザインシステム</p>
        <p className="font-bold font-mono" style={{ fontSize: 20, color: c.text }}>1,234.56</p>
        <p style={{ fontSize: 14, color: c.text }}>Body text — 本文テキスト 14px</p>
        <p style={{ fontSize: 12, color: c.muted }}>Supplemental — 補足テキスト 12px</p>
        <p style={{ fontSize: 10, color: c.muted }}>Minimum — 最小サイズ 10px</p>
      </section>

      <section className="space-y-2">
        <p className="text-xs leading-[120%] tracking-[0.04em] font-bold uppercase" style={{ color: c.muted }}>Buttons</p>
        <div className="flex flex-wrap" style={{ gap }}>
          <button className="text-sm font-bold" style={{ background: c.primary, color: '#fff', padding: `${sp * 0.75}px ${sp * 2}px`, borderRadius: sp }}>Primary</button>
          <button className="text-sm font-bold" style={{ background: 'transparent', border: `1px solid ${c.border}`, color: c.text, padding: `${sp * 0.75}px ${sp * 2}px`, borderRadius: sp }}>Secondary</button>
          <button className="text-sm font-bold opacity-40 cursor-not-allowed" style={{ background: c.primary, color: '#fff', padding: `${sp * 0.75}px ${sp * 2}px`, borderRadius: sp }}>Disabled</button>
        </div>
      </section>

      <section className="space-y-2">
        <p className="text-xs leading-[120%] tracking-[0.04em] font-bold uppercase" style={{ color: c.muted }}>Badges</p>
        <div className="flex flex-wrap" style={{ gap }}>
          {[
            { label: 'Success', bg: `${c.success}22`, color: c.success },
            { label: 'Warning', bg: `${c.warning}22`, color: c.warning },
            { label: 'Danger', bg: `${c.danger}22`, color: c.danger },
          ].map(({ label, bg, color }) => (
            <span key={label} className="text-xs font-bold" style={{ background: bg, color, padding: `${sp * 0.25}px ${sp}px`, borderRadius: sp }}>
              {label}
            </span>
          ))}
        </div>
      </section>
    </div>
  )
}

function DefaultModule({ c, sp }: PreviewProps) {
  const pad = sp * 1.5
  const brad = sp
  return (
    <div className="space-y-4 rounded-xl" style={{ background: c.bg, color: c.text, padding: pad }}>
      <section className="space-y-1.5">
        <p className="text-xs leading-[120%] tracking-[0.04em] font-bold uppercase" style={{ color: c.muted }}>Form Field</p>
        <div className="space-y-1">
          <label className="text-sm font-bold" style={{ color: c.text }}>Email</label>
          <input readOnly defaultValue="user@example.com" className="w-full text-sm outline-none"
            style={{ background: c.surface, border: `1px solid ${c.border}`, color: c.text, padding: `${sp}px ${sp * 1.5}px`, borderRadius: sp }} />
        </div>
      </section>

      <section className="space-y-1.5">
        <p className="text-xs leading-[120%] tracking-[0.04em] font-bold uppercase" style={{ color: c.muted }}>Stat Cards</p>
        <div className="grid grid-cols-3" style={{ gap: sp }}>
          {[
            { label: 'Sets', value: '12', color: c.primary },
            { label: 'Reps', value: '84', color: c.success },
            { label: 'kcal', value: '320', color: c.orange },
          ].map(({ label, value, color }) => (
            <div key={label} className="text-center" style={{ background: c.surface, border: `1px solid ${c.border}`, padding: sp * 1.25, borderRadius: sp }}>
              <p className="font-bold font-mono text-xl" style={{ color }}>{value}</p>
              <p className="text-xs" style={{ color: c.muted }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-1.5">
        <p className="text-xs leading-[120%] tracking-[0.04em] font-bold uppercase" style={{ color: c.muted }}>Alert</p>
        <div className="flex items-start" style={{ gap: sp, background: `${c.primary}22`, border: `1px solid ${c.primary}44`, padding: `${sp}px ${sp * 1.5}px`, borderRadius: sp }}>
          <span style={{ color: c.primary, fontSize: 14 }}>ℹ</span>
          <p className="text-sm" style={{ color: c.text }}>Synced 3 minutes ago</p>
        </div>
      </section>

      {/* circle prop used for badge-style chip */}
      <section className="space-y-1.5">
        <p className="text-xs leading-[120%] tracking-[0.04em] font-bold uppercase" style={{ color: c.muted }}>Tags</p>
        <div className="flex flex-wrap" style={{ gap: sp * 0.5 }}>
          {['Design', 'System', 'UI/UX'].map((t) => (
            <span key={t} className="text-xs font-bold" style={{ background: `${c.primary}18`, color: c.primary, padding: `${sp * 0.25}px ${sp}px`, borderRadius: brad }}>{t}</span>
          ))}
        </div>
      </section>
    </div>
  )
}

function DefaultComponent({ c, sp }: PreviewProps) {
  const pad = sp * 1.5
  return (
    <div className="space-y-4 rounded-xl" style={{ background: c.bg, color: c.text, padding: pad }}>
      <section className="space-y-1.5">
        <p className="text-xs leading-[120%] tracking-[0.04em] font-bold uppercase" style={{ color: c.muted }}>Data Card</p>
        <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${c.border}`, borderRadius: sp }}>
          <div className="flex items-center justify-between" style={{ background: c.surface, borderBottom: `1px solid ${c.border}`, padding: `${sp}px ${sp * 2}px` }}>
            <span className="text-sm font-bold" style={{ color: c.text }}>Workout Log</span>
            <button className="text-xs" style={{ background: c.primary, color: '#fff', padding: `${sp * 0.5}px ${sp * 1.25}px`, borderRadius: sp * 0.75 }}>+ Add</button>
          </div>
          {[
            { name: 'Bench Press', sets: 4, reps: 8, status: 'success' },
            { name: 'Squat', sets: 3, reps: 10, status: 'warning' },
            { name: 'Deadlift', sets: 2, reps: 5, status: 'danger' },
          ].map(({ name, sets, reps, status }) => {
            const color = status === 'success' ? c.success : status === 'warning' ? c.warning : c.danger
            return (
              <div key={name} className="flex items-center justify-between" style={{ borderBottom: `1px solid ${c.border}`, padding: `${sp * 0.75}px ${sp * 2}px` }}>
                <span className="text-sm" style={{ color: c.text }}>{name}</span>
                <div className="flex items-center" style={{ gap: sp * 1.5 }}>
                  <span className="font-mono text-sm" style={{ color: c.muted }}>{sets}×{reps}</span>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="space-y-1.5">
        <p className="text-xs leading-[120%] tracking-[0.04em] font-bold uppercase" style={{ color: c.muted }}>Navigation</p>
        <div className="flex" style={{ gap: sp * 0.5, padding: sp * 0.5, background: c.surface, border: `1px solid ${c.border}`, borderRadius: sp }}>
          {['Dashboard', 'History', 'Profile'].map((item, i) => (
            <button key={item} className="flex-1 text-xs font-bold" style={{ ...(i === 0 ? { background: c.primary, color: '#fff' } : { color: c.muted }), padding: `${sp * 0.5}px 0`, borderRadius: sp * 0.75 }}>
              {item}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

function DefaultTemplate({ c, sp }: PreviewProps) {
  const avatarRadius = `${sp}px`
  return (
    <div className="overflow-hidden" style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text, borderRadius: sp * 1.5 }}>
      <div className="flex items-center justify-between" style={{ background: c.surface, borderBottom: `1px solid ${c.border}`, padding: `${sp * 0.75}px ${sp * 2}px` }}>
        <span className="text-sm font-bold" style={{ color: c.text }}>MyApp</span>
        <div className="flex" style={{ gap: sp * 1.5 }}>
          {['Home', 'Log', 'Stats'].map((item, i) => (
            <span key={item} className="text-xs" style={{ color: i === 1 ? c.primary : c.muted }}>{item}</span>
          ))}
        </div>
        <div style={{ width: sp * 3, height: sp * 3, background: c.primary, borderRadius: avatarRadius }} />
      </div>

      <div style={{ padding: sp * 2, display: 'flex', flexDirection: 'column', gap: sp * 1.5 }}>
        <div className="grid grid-cols-3" style={{ gap: sp }}>
          {[
            { label: 'Workouts', value: '24', color: c.primary },
            { label: 'Total Sets', value: '312', color: c.success },
            { label: 'kcal', value: '8.4k', color: c.orange },
          ].map(({ label, value, color }) => (
            <div key={label} className="text-center" style={{ background: c.surface, border: `1px solid ${c.border}`, padding: sp, borderRadius: sp }}>
              <p className="font-bold font-mono" style={{ fontSize: 16, color }}>{value}</p>
              <p style={{ fontSize: 10, color: c.muted }}>{label}</p>
            </div>
          ))}
        </div>

        <div className="overflow-hidden" style={{ border: `1px solid ${c.border}`, borderRadius: sp }}>
          <div style={{ background: c.surface, borderBottom: `1px solid ${c.border}`, padding: `${sp * 0.75}px ${sp * 1.5}px` }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: c.muted, textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1.2 }}>Recent</span>
          </div>
          {['Bench Press — 4×8', 'Squat — 3×10', 'Pull-up — 3×6'].map((item) => (
            <div key={item} className="flex items-center justify-between" style={{ borderBottom: `1px solid ${c.border}`, padding: `${sp * 0.75}px ${sp * 1.5}px` }}>
              <span style={{ fontSize: 12, color: c.text }}>{item}</span>
              <span style={{ fontSize: 10, color: c.muted }}>Today</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const DEFAULT_VIEWS: Record<Granularity, React.FC<PreviewProps>> = {
  atom: DefaultAtom,
  module: DefaultModule,
  component: DefaultComponent,
  template: DefaultTemplate,
}

// ── ThemePreview ─────────────────────────────────────────────────────────────

interface ThemePreviewProps {
  theme: string
  height?: string
  customColors?: Colors
  fonts?: { latin?: string; japanese?: string }
  layout?: { spacingBase?: string }
}

export function ThemePreview({ theme, height = '400px', customColors, fonts, layout }: ThemePreviewProps) {
  const [granularity, setGranularity] = useState<Granularity>('atom')
  const [isDark, setIsDark] = useState(false)
  useGoogleFonts(fonts)

  const sp = parseInt(layout?.spacingBase ?? '8', 10) || 8

  if (!theme || theme === '') {
    return (
      <div className="flex items-center justify-center h-48 rounded-xl border border-dashed border-border text-muted-foreground text-sm">
        テーマを選択するとプレビューが表示されます
      </div>
    )
  }

  const isCustom = theme === 'カスタム'
  const colors = isCustom ? customColors ?? LIGHT : isDark ? DARK : LIGHT
  const PreviewComponent = DEFAULT_VIEWS[granularity]

  return (
    <div className="flex flex-col gap-3" style={{ height }}>
      {/* Controls — スクロール対象外 */}
      <div className="flex items-center gap-2 shrink-0">
        <TabBar
          items={GRANULARITIES}
          value={granularity}
          onChange={setGranularity}
          className="flex-1"
        />
        {!isCustom && (
          <button
            type="button"
            onClick={() => setIsDark((d) => !d)}
            className="p-1.5 rounded-lg border border-border bg-card hover:bg-muted transition-colors duration-ui shrink-0"
            title={isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
          >
            {isDark ? <Sun className="h-3.5 w-3.5 text-muted-foreground" /> : <Moon className="h-3.5 w-3.5 text-muted-foreground" />}
          </button>
        )}
      </div>

      {/* Disclaimer — スクロール対象外・固定 */}
      <p className="shrink-0 text-xs text-muted-foreground leading-[170%] tracking-[0.06em]">
        ※ このプレビューはイメージです。実際に生成されるコンポーネントと異なる場合があります。
      </p>

      {/* Preview — ここだけスクロール */}
      <div
        className="overflow-y-auto min-h-0"
        style={{ fontFamily: resolveFontFamily(fonts?.latin, fonts?.japanese) }}
      >
        <PreviewComponent c={colors} sp={sp} />
      </div>
    </div>
  )
}
