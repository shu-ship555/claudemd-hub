/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Sparkles, Palette, Type, LayoutGrid, Info, Layers, ChevronDown, ChevronUp, Plus, Trash2, Eye, FileText, Shapes, Pencil, Check } from 'lucide-react'
import { useDesignConfig } from '@/lib/hooks/use-design-config'
import { useSaveConfigFile } from '@/lib/hooks/use-save-config-file'
import { LATIN_FONTS, JAPANESE_FONTS, SPACING_BASE_OPTIONS, SPACING_SCALES, LIGHT_COLORS, TEXT_STYLE_CATEGORIES, TEXT_STYLE_WEIGHTS, DEFAULT_TEXT_STYLES, CATEGORY_LABELS, ERGONOMICS_DEFAULT_TEXT, DEFAULT_COMPONENT_ITEMS } from '@/lib/constants'
import { downloadTextFile } from '@/lib/download'
import { useAuth } from '@/lib/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FieldLabel } from '@/components/custom/field-label'
import { SectionCard } from '@/components/custom/section-card'
import { Switch } from '@/components/ui/switch'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { THEME_PRESETS } from '@/lib/theme-presets'
import { hexToHsl, hslToHex, getContrastRatio } from '@/lib/color-utils'
import { useState, useRef, useEffect } from 'react'
import type { Colors } from '@/components/theme-preview'

type ComponentItem = {
  id: string
  name: string
  purpose: string
  variants: string
  sizes: string
  states: string
  anatomy: string
  accessibility: string
  dosDonts: string
}

const COMPONENT_FIELDS: { id: keyof Omit<ComponentItem, 'id' | 'name'>; label: string; placeholder: string }[] = [
  { id: 'purpose',       label: '① 目的と使い分け',        placeholder: '例: Primary Button は1画面に1つ\n破壊的操作には Destructive variant を使う' },
  { id: 'variants',      label: '② バリアント',            placeholder: '例: Primary / Secondary / Ghost / Destructive\nそれぞれの用途を記述' },
  { id: 'sizes',         label: '③ サイズ',               placeholder: '例: Small (h-6, px-2) / Medium (h-8, px-3) / Large (h-10, px-4)\n各文脈での使い分けも記述' },
  { id: 'states',        label: '④ 状態',                 placeholder: '例: Default / Hover / Active / Focus / Disabled / Loading\n各状態の色・境界線・透明度を明示' },
  { id: 'anatomy',       label: '⑤ 構造と寸法',            placeholder: '例: アイコン + ラベル、間隔8px\n左右パディング16px、高さ40px、border-radius 8px' },
  { id: 'accessibility', label: '⑥ アクセシビリティ要件',   placeholder: '例: aria-label, aria-disabled\nTab / Enter / Space / Escape の挙動\n最小タッチターゲット 44×44px' },
  { id: 'dosDonts',      label: '⑦ Do / Don\'t',          placeholder: 'Do: Primary Button は1画面に1つ\nDon\'t: Primary Button を並べない' },
]

const SHADCN_FIELDS: { id: string; label: string; placeholder: string }[] = [
  { id: 'shadcnTokenMapping',          label: '① デザイントークン CSS 変数マッピング', placeholder: '例: --primary → hsl(var(--blue-600))\n--radius → 0.5rem' },
  { id: 'shadcnComponentList',         label: '② 採用コンポーネント一覧',            placeholder: '例: Button, Dialog, Select, Toast, Form...' },
  { id: 'shadcnUsageGuide',            label: '③ 使い分けガイド',                  placeholder: '例:\n- オーバーレイ: Dialog（確認）/ Sheet（サイドパネル）\n- 通知: Toast（一時）/ Alert（常設）\n- 選択: Select（6項目以上）/ RadioGroup（5項目以下）\n- Button variant: default / destructive / outline / ghost / link' },
  { id: 'shadcnCustomizationPolicy',   label: '④ カスタマイズポリシー',              placeholder: '例:\n許可: CSS変数の上書き、className追加\n禁止: コンポーネント内部DOMの直接編集\nディレクトリ: components/ui/（自動生成）, components/custom/（独自）' },
  { id: 'shadcnStandardPatterns',      label: '⑤ 標準パターン',                    placeholder: '例:\nForm: react-hook-form + zod + FormField\n破壊的操作フロー: 操作ボタン → AlertDialog（確認）→ Toast（結果）' },
  { id: 'shadcnCustomComponents',      label: '⑥ 独自コンポーネント仕様',            placeholder: '例: shadcn/ui にない独自コンポーネントの仕様を記述' },
]

const THEME_OPTIONS = ['デフォルト', 'カスタム']

const WIZARD_STEPS = [
  { id: 'visualTheme',   label: 'ビジュアルテーマ', icon: Sparkles },
  { id: 'colorPalette',  label: 'カラーパレット',   icon: Palette },
  { id: 'typography',    label: 'タイポグラフィ',   icon: Type },
  { id: 'icons',         label: 'アイコン',         icon: Shapes },
  { id: 'layout',        label: 'レイアウト',       icon: LayoutGrid },
  { id: 'components',    label: 'コンポーネント',   icon: Layers },
  { id: 'accessibility', label: 'アクセシビリティ', icon: Eye },
  { id: 'other',         label: 'その他',           icon: FileText },
] as const

const DEFAULT_PREVIEW = `# Design System

## Overview
A focused, minimal dark interface for a developer productivity tool.
Clean lines, low visual noise, high information density.

## Colors
- **Primary** (#2665fd): CTAs, active states, key interactive elements
- **Secondary** (#475569): Supporting UI, chips, secondary actions
- **Surface** (#0b1326): Page backgrounds
- **On-surface** (#dae2fd): Primary text on dark backgrounds
- **Error** (#ffb4ab): Validation errors, destructive actions

## Typography
- **Headlines**: Inter, semi-bold
- **Body**: Inter, regular, 14–16px
- **Labels**: Inter, medium, 12px, uppercase for section headers

## Components
- **Buttons**: Rounded (8px), primary uses brand blue fill
- **Inputs**: 1px border, subtle surface-variant background
- **Cards**: No elevation, relies on border and background contrast

## Do's and Don'ts
- Do use the primary color sparingly, only for the most important action
- Don't mix rounded and sharp corners in the same view
- Do maintain 4:1 contrast ratio for all text
`


const KEY_COLOR_FIELDS: { key: keyof Colors; label: string }[] = [
  { key: 'primary', label: 'プライマリ' },
  { key: 'secondary', label: 'セカンダリ' },
  { key: 'tertiary', label: 'ターシャリ' },
  { key: 'bg', label: 'バックグラウンド' },
]

const COMMON_COLOR_FIELDS: { key: keyof Colors; label: string }[] = [
  { key: 'white', label: 'White' },
  { key: 'gray1', label: 'Gray 1' },
  { key: 'gray2', label: 'Gray 2' },
  { key: 'gray3', label: 'Gray 3' },
  { key: 'gray4', label: 'Gray 4' },
  { key: 'gray5', label: 'Gray 5' },
  { key: 'gray6', label: 'Gray 6' },
  { key: 'gray7', label: 'Gray 7' },
  { key: 'gray8', label: 'Gray 8' },
  { key: 'gray9', label: 'Gray 9' },
  { key: 'gray10', label: 'Gray 10' },
  { key: 'gray11', label: 'Gray 11' },
  { key: 'gray12', label: 'Gray 12' },
  { key: 'black', label: 'Black' },
]

const SEMANTIC_COLOR_FIELDS: { key: keyof Colors; label: string }[] = [
  { key: 'success', label: 'サクセス' },
  { key: 'danger', label: 'エラー' },
  { key: 'warning', label: '警告' },
]

function parseTextStyle(style: string): { fontSize: string; weight: string; lineHeight: string; letterSpacing: string } {
  const match = style.match(/^(\d+)(Th|N|B|Bk)-(\d+)-(-?\d+)$/)
  if (!match) return { fontSize: '', weight: '', lineHeight: '', letterSpacing: '' }
  const [, fontSize, weight, lineHeight, letterSpacingValue] = match
  const letterSpacingNum = parseInt(letterSpacingValue)
  const weightMap: Record<string, string> = { 'Th': 'Thin', 'N': 'Normal', 'B': 'Bold', 'Bk': 'Black' }
  return {
    fontSize: `${fontSize}px`,
    weight: weightMap[weight] || weight,
    lineHeight: `${lineHeight}%`,
    letterSpacing: `${(letterSpacingNum * 0.01).toFixed(2)}em`,
  }
}

function colorsToConfigPatch(colors: Colors, useSemanticColors: boolean = true) {
  return {
    colorPalette: {
      enabled: true,
      primaryCtaColor: colors.primary,
      secondaryCtaColor: colors.secondary,
      tertiaryCtaColor: colors.tertiary,
      white: colors.white, gray1: colors.gray1, gray2: colors.gray2,
      gray3: colors.gray3, gray4: colors.gray4, gray5: colors.gray5,
      gray6: colors.gray6, gray7: colors.gray7, gray8: colors.gray8,
      gray9: colors.gray9, gray10: colors.gray10, gray11: colors.gray11,
      gray12: colors.gray12, black: colors.black,
      primaryTextColor: colors.text,
      primarySurfaceColor: colors.bg,
      ...(useSemanticColors ? {
        successColor: colors.success,
        warningColor: colors.warning,
        errorColor: colors.danger,
      } : {}),
      semanticColor: colors.info,
    },
  }
}

export default function DashboardPage() {
  const { config, preview, updateField, batchUpdate } = useDesignConfig()
  const { isLoggedIn, isLoading: isAuthLoading } = useAuth()
  const { fileName, setFileName, isSaving, save, fileCount, maxFiles } = useSaveConfigFile('DESIGN.md')
  const [themeSelect, setThemeSelect] = useState('')
  const [customColors, setCustomColors] = useState<Colors>(LIGHT_COLORS)
  const [keyColorStandard, setKeyColorStandard] = useState<'A' | 'AA' | 'AAA' | 'none'>('AA')
  const [componentItems, setComponentItems] = useState<ComponentItem[]>(DEFAULT_COMPONENT_ITEMS)
  const [openComponentIds, setOpenComponentIds] = useState<Set<string>>(new Set())
  const [editingComponentIds, setEditingComponentIds] = useState<Set<string>>(new Set())
  const [activeSection, setActiveSection] = useState<string>('visualTheme')
  const formScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    batchUpdate((prev) => ({ ...prev, components: { ...prev.components, componentItems: DEFAULT_COMPONENT_ITEMS as any } }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const previewScrollRef = useRef<HTMLTextAreaElement>(null)

  const addComponentItem = () => {
    const id = Date.now().toString()
    const newItem: ComponentItem = { id, name: '', purpose: '', variants: '', sizes: '', states: '', anatomy: '', accessibility: '', dosDonts: '' }
    const next = [...componentItems, newItem]
    setComponentItems(next)
    setOpenComponentIds((prev) => new Set([...prev, id]))
    batchUpdate((prev) => ({ ...prev, components: { ...prev.components, componentItems: next as any } }))
  }

  const removeComponentItem = (id: string) => {
    const next = componentItems.filter((item) => item.id !== id)
    setComponentItems(next)
    batchUpdate((prev) => ({ ...prev, components: { ...prev.components, componentItems: next as any } }))
  }

  const updateComponentItem = (id: string, field: keyof ComponentItem, value: string) => {
    const next = componentItems.map((item) => item.id === id ? { ...item, [field]: value } : item)
    setComponentItems(next)
    batchUpdate((prev) => ({ ...prev, components: { ...prev.components, componentItems: next as any } }))
  }

  const toggleComponentOpen = (id: string) => {
    setOpenComponentIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return next
    })
  }

  const toggleComponentEditing = (id: string) => {
    setEditingComponentIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
        setOpenComponentIds((prev2) => new Set([...prev2, id]))
      }
      return next
    })
  }

  const isCustom = themeSelect === 'カスタム'

  const scrollToSection = (id: string) => {
    const formEl = formScrollRef.current
    const sectionEl = document.getElementById(id)
    if (!formEl || !sectionEl) return
    const top = sectionEl.getBoundingClientRect().top - formEl.getBoundingClientRect().top + formEl.scrollTop
    formEl.scrollTo({ top: top - 16, behavior: 'smooth' })
    setActiveSection(id)
  }

  useEffect(() => {
    const formEl = formScrollRef.current
    if (!formEl || !isCustom) return
    const sectionIds = WIZARD_STEPS.map((s) => s.id)
    const handleScroll = () => {
      const containerTop = formEl.getBoundingClientRect().top
      let found = sectionIds[0]
      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top - containerTop <= 60) found = id
      }
      setActiveSection(found)
    }
    formEl.addEventListener('scroll', handleScroll)
    return () => formEl.removeEventListener('scroll', handleScroll)
  }, [isCustom])

  const scrollPreviewToSection = (sectionName: string) => {
    if (!previewScrollRef.current) return
    const currentPreview = !themeSelect ? DEFAULT_PREVIEW : (themeSelect === 'デフォルト' ? DEFAULT_PREVIEW : preview)
    const lines = currentPreview.split('\n')
    let targetLineIndex = -1

    const sectionKeywords: Record<string, string> = {
      visualTheme: 'Visual Theme',
      colorPalette: 'Color Palette',
      typography: 'Typography',
      icons: 'Icons',
      layout: 'Layout',
      components: 'Components',
      accessibility: 'Accessibility',
      other: 'Other',
    }

    const keyword = sectionKeywords[sectionName]
    if (!keyword) return

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('## ') && lines[i].includes(keyword)) {
        targetLineIndex = i
        break
      }
    }

    if (targetLineIndex === -1) return

    const targetText = lines.slice(0, targetLineIndex).join('\n')
    const scrollPosition = targetText.length
    previewScrollRef.current.scrollTop = (scrollPosition / currentPreview.length) * (previewScrollRef.current.scrollHeight - previewScrollRef.current.clientHeight)
  }

  const handleSectionClick = (sectionName: string) => {
    scrollPreviewToSection(sectionName)
  }
  const section = 'visualTheme'
  const v = config[section] ?? {}
  const tc = config['typography'] ?? {}
  const lc = config['layout'] ?? {}
  const cc = config['colorPalette'] ?? {}
  const cmp = config['components'] ?? {}
  const ac = config['accessibility'] ?? {}
  const oc = config['other'] ?? {}
  const ic = config['icons'] ?? {}

  const handleThemeChange = (val: string) => {
    setThemeSelect(val)
    if (val === 'カスタム') {
      updateField(section, 'themeName', '')
      updateField(section, 'isCustomTheme', true)
      const useSemanticColors = (cc.useSemanticColors as boolean) ?? true
      batchUpdate((prev) => {
        const patch = colorsToConfigPatch(customColors, useSemanticColors)
        const prevPalette = prev.colorPalette ?? {}
        const prevTheme = prev.visualTheme ?? {}
        return {
          ...prev,
          visualTheme: {
            ...prevTheme,
            atmosphere: prevTheme.atmosphere || 'ライトなベースカラーにブルー系のアクセントを組み合わせた、クリーンでプロフェッショナルなビジュアル。余白を活かしたレイアウトで情報の見通しをよくする。',
            keyCharacteristics: prevTheme.keyCharacteristics || 'ライトな背景色とディープなテキストカラーによる高コントラスト\nブルー系プライマリカラーを CTA とリンクに使用\nグレースケールで情報の階層を表現\n十分な余白とスペーシングで読みやすさを確保',
          },
          colorPalette: {
            ...patch.colorPalette,
            keyColorNotes: prevPalette.keyColorNotes || 'ブランドのメインカラーとして CTA ボタン・リンク・強調に使用する\nセカンダリ・ターシャリは階調表現やホバー状態に活用する\nバックグラウンドはページ全体の基調色として使用する',
            commonColorNotes: prevPalette.commonColorNotes || 'White〜Gray 3 は背景・サーフェスに適する\nGray 4〜Gray 6 はサブテキスト・ミュートテキストに適する\nGray 7〜Black は見出し・本文テキストに適する',
            semanticColorNotes: prevPalette.semanticColorNotes || 'サクセス：完了・承認・正常状態のフィードバックに使用する\nエラー：失敗・削除・危険な操作のフィードバックに使用する\n警告：注意・期限・確認が必要な状態のフィードバックに使用する',
          },
          typography: {
            ...(prev.typography ?? {}),
            latinFont: (prev.typography?.latinFont as string) || 'Inter',
            japaneseFont: (prev.typography?.japaneseFont as string) || 'Noto Sans JP',
          },
        }
      })
    } else if (THEME_PRESETS[val]) {
      updateField(section, 'themeName', val)
    } else {
      updateField(section, 'themeName', '')
    }
  }

  const handleColorChange = (key: keyof Colors, value: string) => {
    const next = { ...customColors, [key]: value }
    setCustomColors(next)
    const useSemanticColors = (cc.useSemanticColors as boolean) ?? true
    batchUpdate((prev) => {
      const patch = colorsToConfigPatch(next, useSemanticColors)
      return {
        ...prev,
        colorPalette: { ...prev.colorPalette, ...patch.colorPalette },
      }
    })
  }

  return (
    <>
      <div className="lg:hidden fixed inset-0 z-50 flex flex-col items-center justify-center bg-background gap-3 px-8 text-center">
        <p className="text-sm leading-[120%] tracking-[0.06em] font-bold text-foreground">PC でご覧ください</p>
        <p className="text-xs leading-[170%] tracking-[0.06em] text-muted-foreground">このページはデスクトップ（1024px 以上）向けに最適化されています。</p>
      </div>

      <main className="w-full max-w-7xl mx-auto px-6 pt-10 pb-12">
        <div className={isCustom ? 'grid gap-6 lg:grid-cols-[160px_1fr_1fr]' : 'grid gap-12 lg:grid-cols-2'}>
          {/* Wizard TOC — カスタム時のみ表示 */}
          {isCustom && (
            <aside className="hidden lg:block">
              <nav className="sticky space-y-0.5" style={{ top: 'calc(3.5rem + 1.5rem)' }}>
                {WIZARD_STEPS.map((step, i) => {
                  const StepIcon = step.icon
                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => scrollToSection(step.id)}
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
          )}
          {/* Form Section */}
          <div
            ref={formScrollRef}
            className="space-y-6 max-h-[calc(100vh-160px)] overflow-y-auto pr-4"
          >
            {/* Standalone theme selector */}
            <div className="space-y-2">
              <FieldLabel requirement="required">DESIGN.mdの種類</FieldLabel>
              <select
                value={themeSelect}
                onChange={(e) => handleThemeChange(e.target.value)}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
              >
                <option value="">選択してください</option>
                {THEME_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {isCustom && (
              <>
                {/* ビジュアルテーマ section */}
                <SectionCard
                  id="visualTheme"
                  label="ビジュアルテーマ"
                  description="ブランドの世界観・インスピレーション元・全体の雰囲気"
                  icon={Sparkles}
                  onClick={() => handleSectionClick('visualTheme')}
                >
                  <div className="space-y-1.5">
                    <FieldLabel>デザインシステム名</FieldLabel>
                    <Input
                      placeholder="例: Airtable Design System Guidelines"
                      value={(v.themeName as string) ?? ''}
                      onChange={(e) => updateField(section, 'themeName', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <FieldLabel>ビジュアル雰囲気の説明</FieldLabel>
                    <Textarea
                      placeholder="例: 白を基調としたキャンバスに深いネイビーのテキスト（#181d26）、Airtable Blue（#1b61c9）をアクセントとする、洗練されたシンプルさ。"
                      value={(v.atmosphere as string) ?? ''}
                      onChange={(e) => updateField(section, 'atmosphere', e.target.value)}
                      className="min-h-32"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <FieldLabel>主要な特徴</FieldLabel>
                    <Textarea
                      placeholder={'例:\n白いキャンバスとディープネイビーのテキスト (#181d26)\nAirtable Blue (#1b61c9) を CTA とリンクに使用\nHaas + Haas Groot Disp のデュアルフォント\n12px のボタンラジウス、16px-32px のカード\nブルー調の多層シャドウ'}
                      value={(v.keyCharacteristics as string) ?? ''}
                      onChange={(e) => updateField(section, 'keyCharacteristics', e.target.value)}
                      className="min-h-40 mb-1"
                    />
                    <p className="text-2xs leading-[120%] tracking-[0.04em] text-muted-foreground">→ 改行すると箇条書きに出力されます</p>
                  </div>
                </SectionCard>

                {/* カラーパレット section */}
                <SectionCard
                  id="colorPalette"
                  label="カラーパレット"
                  description="コンポーネントプレビューとマークダウンの両方に反映されます"
                  onClick={() => handleSectionClick('colorPalette')}
                  icon={Palette}
                >
                  <div className="space-y-8">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <p className="text-xs leading-[120%] tracking-[0.04em] font-bold text-foreground">キーカラー</p>
                          <div className="relative group">
                            <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                            <div className="absolute top-full left-0 mt-1 z-50 invisible group-hover:visible bg-popover text-popover-foreground text-xs leading-[170%] tracking-[0.06em] rounded-md border border-border px-3 py-2 w-64 pointer-events-none">
                              プライマリ（CTA・リンク）、セカンダリ（副次的UI・同色相で明度高）、ターシャリ（セカンダリの逆明度）、背景色の4色。セカンダリ・ターシャリは背景色との対比3:1以上、テキスト使用時は4.5:1以上が必要。
                            </div>
                          </div>
                        </div>
                        <select
                          value={keyColorStandard}
                          onChange={(e) => setKeyColorStandard(e.target.value as 'A' | 'AA' | 'AAA' | 'none')}
                          className="ml-auto rounded border border-input bg-transparent px-2 py-0.5 text-2xs leading-[120%] tracking-[0.04em] text-muted-foreground"
                        >
                          <option value="A">WCAG A</option>
                          <option value="AA">WCAG AA</option>
                          <option value="AAA">WCAG AAA</option>
                          <option value="none">なし</option>
                        </select>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-2xs leading-[120%] tracking-[0.04em] text-muted-foreground">色相</span>
                            <span className="text-2xs leading-[150%] tracking-[0.04em] font-mono text-muted-foreground">{hexToHsl(customColors.primary)[0]}°</span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={359}
                            value={hexToHsl(customColors.primary)[0]}
                            onChange={(e) => {
                              const hue = Number(e.target.value)
                              const baseHue = hexToHsl(customColors.primary)[0]
                              const diff = hue - baseHue
                              const next = { ...customColors }
                              for (const { key } of KEY_COLOR_FIELDS) {
                                const [h, s, l] = hexToHsl(customColors[key])
                                next[key] = hslToHex((h + diff + 360) % 360, s, l)
                              }
                              setCustomColors(next)
                              const useSemanticColors = (cc.useSemanticColors as boolean) ?? true
                              batchUpdate((prev) => {
                                const patch = colorsToConfigPatch(next, useSemanticColors)
                                return {
                                  ...prev,
                                  colorPalette: { ...prev.colorPalette, ...patch.colorPalette },
                                }
                              })
                            }}
                            className="w-full h-2 rounded-full appearance-none cursor-pointer"
                            style={{ background: 'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)' }}
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-2xs leading-[120%] tracking-[0.04em] text-muted-foreground">彩度</span>
                            <span className="text-2xs leading-[150%] tracking-[0.04em] font-mono text-muted-foreground">{hexToHsl(customColors.primary)[1]}%</span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={hexToHsl(customColors.primary)[1]}
                            onChange={(e) => {
                              const sat = Number(e.target.value)
                              const baseSat = hexToHsl(customColors.primary)[1]
                              const diff = sat - baseSat
                              const next = { ...customColors }
                              for (const { key } of KEY_COLOR_FIELDS) {
                                const [h, s, l] = hexToHsl(customColors[key])
                                next[key] = hslToHex(h, Math.max(0, Math.min(100, s + diff)), l)
                              }
                              setCustomColors(next)
                              const useSemanticColors = (cc.useSemanticColors as boolean) ?? true
                              batchUpdate((prev) => {
                                const patch = colorsToConfigPatch(next, useSemanticColors)
                                return {
                                  ...prev,
                                  colorPalette: { ...prev.colorPalette, ...patch.colorPalette },
                                }
                              })
                            }}
                            className="w-full h-2 rounded-full appearance-none cursor-pointer"
                            style={{ background: `linear-gradient(to right, hsl(${hexToHsl(customColors.primary)[0]}, 0%, 50%), hsl(${hexToHsl(customColors.primary)[0]}, 100%, 50%))` }}
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-2xs leading-[120%] tracking-[0.04em] text-muted-foreground">明度</span>
                            <span className="text-2xs leading-[150%] tracking-[0.04em] font-mono text-muted-foreground">{hexToHsl(customColors.primary)[2]}%</span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={hexToHsl(customColors.primary)[2]}
                            onChange={(e) => {
                              const light = Number(e.target.value)
                              const baseLight = hexToHsl(customColors.primary)[2]
                              const diff = light - baseLight
                              const next = { ...customColors }
                              for (const { key } of KEY_COLOR_FIELDS) {
                                const [h, s, l] = hexToHsl(customColors[key])
                                next[key] = hslToHex(h, s, Math.max(0, Math.min(100, l + diff)))
                              }
                              setCustomColors(next)
                              const useSemanticColors = (cc.useSemanticColors as boolean) ?? true
                              batchUpdate((prev) => {
                                const patch = colorsToConfigPatch(next, useSemanticColors)
                                return {
                                  ...prev,
                                  colorPalette: { ...prev.colorPalette, ...patch.colorPalette },
                                }
                              })
                            }}
                            className="w-full h-2 rounded-full appearance-none cursor-pointer"
                            style={{ background: `linear-gradient(to right, #000, hsl(${hexToHsl(customColors.primary)[0]}, ${hexToHsl(customColors.primary)[1]}%, 50%), #fff)` }}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        {KEY_COLOR_FIELDS.map(({ key, label }) => {
                          const showContrast = key !== 'bg'
                          const ratio = showContrast ? getContrastRatio(customColors[key], customColors.bg) : null
                          const getBadgeClass = (r: number): string => {
                            if (keyColorStandard === 'A') return r >= 3.0 ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground'
                            if (keyColorStandard === 'AA') return r >= 4.5 ? 'bg-success text-success-foreground' : r >= 3.0 ? 'bg-warning text-warning-foreground' : 'bg-destructive text-destructive-foreground'
                            if (keyColorStandard === 'AAA') return r >= 7.0 ? 'bg-success text-success-foreground' : r >= 4.5 ? 'bg-warning text-warning-foreground' : 'bg-destructive text-destructive-foreground'
                            return ''
                          }
                          return (
                            <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
                              <input
                                type="color"
                                value={customColors[key]}
                                onChange={(e) => handleColorChange(key, e.target.value)}
                                className="h-8 w-10 cursor-pointer rounded border border-input bg-transparent p-0.5"
                              />
                              <span className="text-muted-foreground">{label}</span>
                              <span className="ml-auto font-mono text-xs text-muted-foreground">{customColors[key]}</span>
                              {ratio !== null && keyColorStandard !== 'none' && (
                                <span className={`font-mono text-2xs leading-[150%] tracking-[0.04em] px-1.5 py-0.5 rounded-full ${getBadgeClass(ratio)}`}>
                                  {ratio}:1
                                </span>
                              )}
                            </label>
                          )
                        })}
                      </div>
                      <p className="mt-3 text-xs leading-[120%] tracking-[0.04em] font-bold text-foreground">キーカラーの使い方</p>
                      <Textarea
                        value={(cc.keyColorNotes as string) ?? ''}
                        onChange={(e) => updateField('colorPalette', 'keyColorNotes', e.target.value)}
                        className="mt-1 min-h-20 text-xs mb-1.5"
                      />
                      <p className="text-2xs leading-[120%] tracking-[0.04em] text-muted-foreground">→ 改行すると箇条書きに出力されます</p>

                      {(((cc.additionalKeyColorSets as any) || []).map((set: any, idx: number) => (
                        <div key={idx} className="mt-6 pt-6 border-t space-y-4">
                          <div className="flex items-center justify-between">
                            <p className="text-xs leading-[120%] tracking-[0.04em] font-bold text-foreground">セット {idx + 2}</p>
                            <button
                              onClick={() => {
                                const next = ((cc.additionalKeyColorSets as any) || []).filter((_: any, i: number) => i !== idx)
                                updateField('colorPalette', 'additionalKeyColorSets', next)
                              }}
                              className="text-xs px-2 py-1 rounded border border-dashed border-muted-foreground text-muted-foreground hover:border-destructive hover:text-destructive transition-colors duration-ui"
                            >
                              削除
                            </button>
                          </div>
                          <div className="space-y-4">
                            <div className="space-y-4">
                              <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-2xs leading-[120%] tracking-[0.04em] text-muted-foreground">色相</span>
                                  <span className="text-2xs leading-[150%] tracking-[0.04em] font-mono text-muted-foreground">{hexToHsl(set.primaryColor)[0]}°</span>
                                </div>
                                <input
                                  type="range"
                                  min={0}
                                  max={359}
                                  value={hexToHsl(set.primaryColor)[0]}
                                  onChange={(e) => {
                                    const hue = Number(e.target.value)
                                    const baseHue = hexToHsl(set.primaryColor)[0]
                                    const diff = hue - baseHue
                                    const next = [...((cc.additionalKeyColorSets as any) || [])]
                                    next[idx] = {
                                      ...next[idx],
                                      primaryColor: hslToHex((hexToHsl(set.primaryColor)[0] + diff + 360) % 360, hexToHsl(set.primaryColor)[1], hexToHsl(set.primaryColor)[2]),
                                      secondaryColor: hslToHex((hexToHsl(set.secondaryColor)[0] + diff + 360) % 360, hexToHsl(set.secondaryColor)[1], hexToHsl(set.secondaryColor)[2]),
                                      tertiaryColor: hslToHex((hexToHsl(set.tertiaryColor)[0] + diff + 360) % 360, hexToHsl(set.tertiaryColor)[1], hexToHsl(set.tertiaryColor)[2]),
                                      bgColor: hslToHex((hexToHsl(set.bgColor)[0] + diff + 360) % 360, hexToHsl(set.bgColor)[1], hexToHsl(set.bgColor)[2]),
                                    }
                                    updateField('colorPalette', 'additionalKeyColorSets', next)
                                  }}
                                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                                  style={{ background: 'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)' }}
                                />
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-2xs leading-[120%] tracking-[0.04em] text-muted-foreground">彩度</span>
                                  <span className="text-2xs leading-[150%] tracking-[0.04em] font-mono text-muted-foreground">{hexToHsl(set.primaryColor)[1]}%</span>
                                </div>
                                <input
                                  type="range"
                                  min={0}
                                  max={100}
                                  value={hexToHsl(set.primaryColor)[1]}
                                  onChange={(e) => {
                                    const sat = Number(e.target.value)
                                    const baseSat = hexToHsl(set.primaryColor)[1]
                                    const diff = sat - baseSat
                                    const next = [...((cc.additionalKeyColorSets as any) || [])]
                                    next[idx] = {
                                      ...next[idx],
                                      primaryColor: hslToHex(hexToHsl(set.primaryColor)[0], Math.max(0, Math.min(100, hexToHsl(set.primaryColor)[1] + diff)), hexToHsl(set.primaryColor)[2]),
                                      secondaryColor: hslToHex(hexToHsl(set.secondaryColor)[0], Math.max(0, Math.min(100, hexToHsl(set.secondaryColor)[1] + diff)), hexToHsl(set.secondaryColor)[2]),
                                      tertiaryColor: hslToHex(hexToHsl(set.tertiaryColor)[0], Math.max(0, Math.min(100, hexToHsl(set.tertiaryColor)[1] + diff)), hexToHsl(set.tertiaryColor)[2]),
                                      bgColor: hslToHex(hexToHsl(set.bgColor)[0], Math.max(0, Math.min(100, hexToHsl(set.bgColor)[1] + diff)), hexToHsl(set.bgColor)[2]),
                                    }
                                    updateField('colorPalette', 'additionalKeyColorSets', next)
                                  }}
                                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                                  style={{ background: `linear-gradient(to right, hsl(${hexToHsl(set.primaryColor)[0]}, 0%, 50%), hsl(${hexToHsl(set.primaryColor)[0]}, 100%, 50%))` }}
                                />
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-2xs leading-[120%] tracking-[0.04em] text-muted-foreground">明度</span>
                                  <span className="text-2xs leading-[150%] tracking-[0.04em] font-mono text-muted-foreground">{hexToHsl(set.primaryColor)[2]}%</span>
                                </div>
                                <input
                                  type="range"
                                  min={0}
                                  max={100}
                                  value={hexToHsl(set.primaryColor)[2]}
                                  onChange={(e) => {
                                    const light = Number(e.target.value)
                                    const baseLight = hexToHsl(set.primaryColor)[2]
                                    const diff = light - baseLight
                                    const next = [...((cc.additionalKeyColorSets as any) || [])]
                                    next[idx] = {
                                      ...next[idx],
                                      primaryColor: hslToHex(hexToHsl(set.primaryColor)[0], hexToHsl(set.primaryColor)[1], Math.max(0, Math.min(100, hexToHsl(set.primaryColor)[2] + diff))),
                                      secondaryColor: hslToHex(hexToHsl(set.secondaryColor)[0], hexToHsl(set.secondaryColor)[1], Math.max(0, Math.min(100, hexToHsl(set.secondaryColor)[2] + diff))),
                                      tertiaryColor: hslToHex(hexToHsl(set.tertiaryColor)[0], hexToHsl(set.tertiaryColor)[1], Math.max(0, Math.min(100, hexToHsl(set.tertiaryColor)[2] + diff))),
                                      bgColor: hslToHex(hexToHsl(set.bgColor)[0], hexToHsl(set.bgColor)[1], Math.max(0, Math.min(100, hexToHsl(set.bgColor)[2] + diff))),
                                    }
                                    updateField('colorPalette', 'additionalKeyColorSets', next)
                                  }}
                                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                                  style={{ background: `linear-gradient(to right, #000, hsl(${hexToHsl(set.primaryColor)[0]}, ${hexToHsl(set.primaryColor)[1]}%, 50%), #fff)` }}
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              {(() => {
                                const primaryRatio = getContrastRatio(set.primaryColor, set.bgColor)
                                const getSetBadgeClass = (r: number): string => {
                                  if (keyColorStandard === 'A') return r >= 3.0 ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground'
                                  if (keyColorStandard === 'AA') return r >= 4.5 ? 'bg-success text-success-foreground' : r >= 3.0 ? 'bg-warning text-warning-foreground' : 'bg-destructive text-destructive-foreground'
                                  if (keyColorStandard === 'AAA') return r >= 7.0 ? 'bg-success text-success-foreground' : r >= 4.5 ? 'bg-warning text-warning-foreground' : 'bg-destructive text-destructive-foreground'
                                  return ''
                                }
                                return (
                                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input
                                      type="color"
                                      value={set.primaryColor}
                                      onChange={(e) => {
                                        const next = [...((cc.additionalKeyColorSets as any) || [])]
                                        next[idx] = { ...next[idx], primaryColor: e.target.value }
                                        updateField('colorPalette', 'additionalKeyColorSets', next)
                                      }}
                                      className="h-8 w-10 cursor-pointer rounded border border-input bg-transparent p-0.5"
                                    />
                                    <span className="text-muted-foreground">プライマリ</span>
                                    <span className="ml-auto font-mono text-xs text-muted-foreground">{set.primaryColor}</span>
                                    {keyColorStandard !== 'none' && (
                                      <span className={`font-mono text-2xs leading-[150%] tracking-[0.04em] px-1.5 py-0.5 rounded-full ${getSetBadgeClass(primaryRatio)}`}>
                                        {primaryRatio}:1
                                      </span>
                                    )}
                                  </label>
                                )
                              })()}
                              {(() => {
                                const secondaryRatio = getContrastRatio(set.secondaryColor, set.bgColor)
                                const getSetBadgeClass = (r: number): string => {
                                  if (keyColorStandard === 'A') return r >= 3.0 ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground'
                                  if (keyColorStandard === 'AA') return r >= 4.5 ? 'bg-success text-success-foreground' : r >= 3.0 ? 'bg-warning text-warning-foreground' : 'bg-destructive text-destructive-foreground'
                                  if (keyColorStandard === 'AAA') return r >= 7.0 ? 'bg-success text-success-foreground' : r >= 4.5 ? 'bg-warning text-warning-foreground' : 'bg-destructive text-destructive-foreground'
                                  return ''
                                }
                                return (
                                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input
                                      type="color"
                                      value={set.secondaryColor}
                                      onChange={(e) => {
                                        const next = [...((cc.additionalKeyColorSets as any) || [])]
                                        next[idx] = { ...next[idx], secondaryColor: e.target.value }
                                        updateField('colorPalette', 'additionalKeyColorSets', next)
                                      }}
                                      className="h-8 w-10 cursor-pointer rounded border border-input bg-transparent p-0.5"
                                    />
                                    <span className="text-muted-foreground">セカンダリ</span>
                                    <span className="ml-auto font-mono text-xs text-muted-foreground">{set.secondaryColor}</span>
                                    {keyColorStandard !== 'none' && (
                                      <span className={`font-mono text-2xs leading-[150%] tracking-[0.04em] px-1.5 py-0.5 rounded-full ${getSetBadgeClass(secondaryRatio)}`}>
                                        {secondaryRatio}:1
                                      </span>
                                    )}
                                  </label>
                                )
                              })()}
                              {(() => {
                                const tertiaryRatio = getContrastRatio(set.tertiaryColor, set.bgColor)
                                const getSetBadgeClass = (r: number): string => {
                                  if (keyColorStandard === 'A') return r >= 3.0 ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground'
                                  if (keyColorStandard === 'AA') return r >= 4.5 ? 'bg-success text-success-foreground' : r >= 3.0 ? 'bg-warning text-warning-foreground' : 'bg-destructive text-destructive-foreground'
                                  if (keyColorStandard === 'AAA') return r >= 7.0 ? 'bg-success text-success-foreground' : r >= 4.5 ? 'bg-warning text-warning-foreground' : 'bg-destructive text-destructive-foreground'
                                  return ''
                                }
                                return (
                                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input
                                      type="color"
                                      value={set.tertiaryColor}
                                      onChange={(e) => {
                                        const next = [...((cc.additionalKeyColorSets as any) || [])]
                                        next[idx] = { ...next[idx], tertiaryColor: e.target.value }
                                        updateField('colorPalette', 'additionalKeyColorSets', next)
                                      }}
                                      className="h-8 w-10 cursor-pointer rounded border border-input bg-transparent p-0.5"
                                    />
                                    <span className="text-muted-foreground">ターシャリ</span>
                                    <span className="ml-auto font-mono text-xs text-muted-foreground">{set.tertiaryColor}</span>
                                    {keyColorStandard !== 'none' && (
                                      <span className={`font-mono text-2xs leading-[150%] tracking-[0.04em] px-1.5 py-0.5 rounded-full ${getSetBadgeClass(tertiaryRatio)}`}>
                                        {tertiaryRatio}:1
                                      </span>
                                    )}
                                  </label>
                                )
                              })()}
                              <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input
                                  type="color"
                                  value={set.bgColor}
                                  onChange={(e) => {
                                    const next = [...((cc.additionalKeyColorSets as any) || [])]
                                    next[idx] = { ...next[idx], bgColor: e.target.value }
                                    updateField('colorPalette', 'additionalKeyColorSets', next)
                                  }}
                                  className="h-8 w-10 cursor-pointer rounded border border-input bg-transparent p-0.5"
                                />
                                <span className="text-muted-foreground">バックグラウンド</span>
                                <span className="ml-auto font-mono text-xs text-muted-foreground">{set.bgColor}</span>
                              </label>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs leading-[120%] tracking-[0.04em] font-bold text-foreground">この色セットの使い方</p>
                            <Textarea
                              value={set.notes ?? ''}
                              onChange={(e) => {
                                const next = [...((cc.additionalKeyColorSets as any) || [])]
                                next[idx] = { ...next[idx], notes: e.target.value }
                                updateField('colorPalette', 'additionalKeyColorSets', next)
                              }}
                              className="min-h-20 text-xs mb-1.5"
                            />
                            <p className="text-2xs leading-[120%] tracking-[0.04em] text-muted-foreground">→ 改行すると箇条書きに出力されます</p>
                          </div>
                        </div>
                      )))}

                      {(((cc.additionalKeyColorSets as any) || []).length < 3) && (
                        <button
                          onClick={() => {
                            const next = [...((cc.additionalKeyColorSets as any) || [])]
                            next.push({
                              primaryColor: customColors.primary,
                              secondaryColor: customColors.secondary,
                              tertiaryColor: customColors.tertiary,
                              bgColor: customColors.bg,
                              notes: '',
                            })
                            updateField('colorPalette', 'additionalKeyColorSets', next)
                          }}
                          className="mt-4 w-full py-2 rounded border border-dashed border-muted-foreground text-muted-foreground text-sm hover:border-foreground hover:text-foreground transition-colors duration-ui"
                        >
                          + セットを追加
                        </button>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-1">
                        <p className="text-xs leading-[120%] tracking-[0.04em] font-bold text-foreground">グレースケール</p>
                        <div className="relative group">
                          <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                          <div className="absolute top-full left-0 mt-1 z-50 invisible group-hover:visible bg-popover text-popover-foreground text-xs leading-[170%] tracking-[0.06em] rounded-md border border-border px-3 py-2 w-64 pointer-events-none">
                            白から黒の14段階グレースケール。背景・サーフェス・ボーダー・テキストなど、UI全体の情報階層と視覚的な重みを表現するために使用する。
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {COMMON_COLOR_FIELDS.map(({ key, label }) => (
                          <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                              type="color"
                              value={customColors[key]}
                              onChange={(e) => handleColorChange(key, e.target.value)}
                              className="h-8 w-10 cursor-pointer rounded border border-input bg-transparent p-0.5"
                            />
                            <span className="text-muted-foreground">{label}</span>
                            <span className="ml-auto font-mono text-xs text-muted-foreground">{customColors[key]}</span>
                          </label>
                        ))}
                      </div>
                      <p className="mt-3 text-xs leading-[120%] tracking-[0.04em] font-bold text-foreground">グレースケールの使い方</p>
                      <Textarea
                        value={(cc.commonColorNotes as string) ?? ''}
                        onChange={(e) => updateField('colorPalette', 'commonColorNotes', e.target.value)}
                        className="mt-1 min-h-20 text-xs mb-1.5"
                      />
                      <p className="text-2xs leading-[120%] tracking-[0.04em] text-muted-foreground">→ 改行すると箇条書きに出力されます</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={(cc.useSemanticColors as boolean) ?? true}
                            onChange={(e) => updateField('colorPalette', 'useSemanticColors', e.target.checked)}
                            className="h-4 w-4 rounded border-input accent-primary"
                          />
                          <p className="text-xs leading-[120%] tracking-[0.04em] font-bold text-foreground">セマンティックカラー</p>
                        </label>
                        <div className="relative group">
                          <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                          <div className="absolute top-full left-0 mt-1 z-50 invisible group-hover:visible bg-popover text-popover-foreground text-xs leading-[170%] tracking-[0.06em] rounded-md border border-border px-3 py-2 w-64 pointer-events-none">
                            成功・エラー・警告の状態を伝えるフィードバック色。操作結果や注意喚起など、意味を持つ状態表現に限定して使用し、装飾目的には使わない。
                          </div>
                        </div>
                      </div>
                      <div className={!((cc.useSemanticColors as boolean) ?? true) ? 'opacity-50 pointer-events-none' : ''}>
                        <div className="grid grid-cols-2 gap-3">
                          {SEMANTIC_COLOR_FIELDS.map(({ key, label }) => (
                            <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
                              <input
                                type="color"
                                value={customColors[key]}
                                onChange={(e) => handleColorChange(key, e.target.value)}
                                className="h-8 w-10 cursor-pointer rounded border border-input bg-transparent p-0.5"
                              />
                              <span className="text-muted-foreground">{label}</span>
                              <span className="ml-auto font-mono text-xs text-muted-foreground">{customColors[key]}</span>
                            </label>
                          ))}
                        </div>
                        <p className="mt-3 text-xs leading-[120%] tracking-[0.04em] font-bold text-foreground">セマンティックカラーの使い方</p>
                        <Textarea
                          value={(cc.semanticColorNotes as string) ?? ''}
                          onChange={(e) => updateField('colorPalette', 'semanticColorNotes', e.target.value)}
                          className="mt-1 min-h-20 text-xs mb-1.5"
                        />
                        <p className="text-2xs leading-[120%] tracking-[0.04em] text-muted-foreground">→ 改行すると箇条書きに出力されます</p>
                      </div>
                    </div>
                  </div>
                </SectionCard>

                {/* タイポグラフィ section */}
                <SectionCard
                  id="typography"
                  label="タイポグラフィ"
                  onClick={() => handleSectionClick('typography')}
                  description="欧文・和文フォントファミリー"
                  icon={Type}
                >
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <FieldLabel>欧文フォント</FieldLabel>
                      <select
                        value={(tc.latinFont as string) ?? ''}
                        onChange={(e) => updateField('typography', 'latinFont', e.target.value)}
                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                      >
                        <option value="">未指定</option>
                        {LATIN_FONTS.map((f) => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                        <option value="custom">カスタム</option>
                      </select>
                      {(tc.latinFont as string) === 'custom' && (
                        <Input
                          placeholder="フォント名を入力"
                          value={(tc.latinFontCustom as string) ?? ''}
                          onChange={(e) => updateField('typography', 'latinFontCustom', e.target.value)}
                        />
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <FieldLabel>和文フォント</FieldLabel>
                      <select
                        value={(tc.japaneseFont as string) ?? ''}
                        onChange={(e) => updateField('typography', 'japaneseFont', e.target.value)}
                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                      >
                        <option value="">未指定</option>
                        {JAPANESE_FONTS.map((f) => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                        <option value="custom">カスタム</option>
                      </select>
                      {(tc.japaneseFont as string) === 'custom' && (
                        <Input
                          placeholder="フォント名を入力"
                          value={(tc.japaneseFontCustom as string) ?? ''}
                          onChange={(e) => updateField('typography', 'japaneseFontCustom', e.target.value)}
                        />
                      )}
                    </div>

                    <div className="space-y-4 mt-6 pt-6 border-t">
                      <p className="text-xs leading-[120%] tracking-[0.04em] font-bold text-foreground">テキストスタイル</p>
                      <div className="space-y-8">
                        {TEXT_STYLE_CATEGORIES.map((category) => {
                          const notesFieldMap: Record<string, string> = {
                            dsp: 'dspNotes',
                            std: 'stdNotes',
                            dns: 'dnsNotes',
                            oln: 'olnNotes',
                            mono: 'monoNotes',
                          }
                          const notesField = notesFieldMap[category.toLowerCase()]
                          const categoryLabel = CATEGORY_LABELS[category]
                          const customEnabledField = `${category.toLowerCase()}CustomEnabled`
                          const customStylesField = `${category.toLowerCase()}CustomStyles`
                          const isCustom = (tc[customEnabledField as keyof typeof tc] as boolean) ?? false
                          return (
                            <div key={category} className="space-y-3 pb-6 border-b last:border-b-0">
                              <div className="flex items-center justify-between">
                                <p className="text-xs leading-[120%] tracking-[0.04em] font-bold text-foreground">{categoryLabel}</p>
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <span className="text-xs text-muted-foreground">自分で設定する</span>
                                  <Switch
                                    checked={isCustom}
                                    onCheckedChange={(checked) => updateField('typography', customEnabledField, checked)}
                                  />
                                </label>
                              </div>
                              {isCustom ? (
                                <div className="space-y-1.5">
                                  <Textarea
                                    value={(tc[customStylesField as keyof typeof tc] as string) ?? ''}
                                    onChange={(e) => updateField('typography', customStylesField, e.target.value)}
                                    placeholder={`例: 64px | Bold | 140% | -0.01em\n48px | Bold | 140% | -0.01em\n32px | Normal | 150% | 0em`}
                                    className="min-h-28 text-xs font-mono mb-1"
                                  />
                                  <p className="text-2xs leading-[120%] tracking-[0.04em] text-muted-foreground">→ 改行すると箇条書きに出力されます</p>
                                </div>
                              ) : null}
                              <div className={isCustom ? 'opacity-40 pointer-events-none' : ''}>
                              <div className="space-y-8">
                              {TEXT_STYLE_WEIGHTS.map((weight) => {
                                const selectedStylesField = `${category.toLowerCase()}SelectedStyles`
                                const selectedStylesStr = (tc[selectedStylesField as keyof typeof tc] as string)
                                const isUnset = selectedStylesStr === undefined || selectedStylesStr === null
                                const savedSelection = isUnset ? [] : selectedStylesStr.trim().split(',').map(s => s.trim()).filter(Boolean)
                                const weightStyles = DEFAULT_TEXT_STYLES[category][weight] || []
                                const allSelected = isUnset ? true : (weightStyles.length > 0 && weightStyles.every(s => savedSelection.includes(s)))
                                const someSelected = isUnset ? true : weightStyles.some(s => savedSelection.includes(s))
                                return (
                                <div key={`${category}-${weight}`} className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <p className="text-2xs leading-[120%] tracking-[0.04em] text-muted-foreground ml-2">{{ 'Th': 'Thin', 'N': 'Normal', 'B': 'Bold', 'Bk': 'Black' }[weight] || weight}</p>
                                    <input
                                      type="checkbox"
                                      checked={allSelected}
                                      ref={(el) => {
                                        if (el && someSelected && !allSelected) el.indeterminate = true
                                      }}
                                      onChange={(e) => {
                                        const current = savedSelection.filter((s: string) => s.trim())
                                        if (e.target.checked) {
                                          for (const style of weightStyles) {
                                            if (!current.includes(style)) {
                                              current.push(style)
                                            }
                                          }
                                        } else {
                                          for (const style of weightStyles) {
                                            const idx = current.indexOf(style)
                                            if (idx > -1) current.splice(idx, 1)
                                          }
                                        }
                                        updateField('typography', selectedStylesField, current.join(','))
                                      }}
                                      className="h-4 w-4 rounded border-input accent-primary mr-2 cursor-pointer"
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 ml-2">
                                    {DEFAULT_TEXT_STYLES[category][weight].map((style) => {
                                      const parsed = parseTextStyle(style)
                                      const selectedStylesField = `${category.toLowerCase()}SelectedStyles`
                                      const selectedStylesStr = (tc[selectedStylesField as keyof typeof tc] as string)
                                      const isUnset = selectedStylesStr === undefined || selectedStylesStr === null
                                      const savedSelection = isUnset ? [] : selectedStylesStr.trim().split(',').map(s => s.trim()).filter(Boolean)
                                      const isSelected = isUnset ? true : savedSelection.includes(style)
                                      return (
                                        <label key={style} className="flex items-center gap-2 text-sm cursor-pointer">
                                          <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={(e) => {
                                              const current = savedSelection.filter((s: string) => s.trim())
                                              if (e.target.checked) {
                                                if (!current.includes(style)) {
                                                  current.push(style)
                                                }
                                              } else {
                                                const idx = current.indexOf(style)
                                                if (idx > -1) current.splice(idx, 1)
                                              }
                                              updateField('typography', selectedStylesField, current.join(','))
                                            }}
                                            className="h-4 w-4 rounded border-input accent-primary"
                                          />
                                          <span className="text-muted-foreground font-mono text-xs">{parsed.fontSize}｜{parsed.weight}｜{parsed.lineHeight}｜{parsed.letterSpacing}</span>
                                        </label>
                                      )
                                    })}
                                  </div>
                                </div>
                                )
                              })}
                              </div>
                              <div className="space-y-1.5 mt-4">
                                <p className="text-xs leading-[120%] tracking-[0.04em] font-bold text-foreground">{categoryLabel}の使い方</p>
                                <Textarea
                                  value={(tc[notesField as keyof typeof tc] as string) ?? ''}
                                  onChange={(e) => updateField('typography', notesField, e.target.value)}
                                  className="min-h-16 text-xs mb-1"
                                  placeholder={`${categoryLabel}テキストスタイルの使用例や説明を入力してください`}
                                />
                                <p className="text-2xs leading-[120%] tracking-[0.04em] text-muted-foreground">→ 改行すると箇条書きに出力されます</p>
                              </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </SectionCard>

                {/* アイコン section */}
                <SectionCard
                  id="icons"
                  label="アイコン"
                  onClick={() => handleSectionClick('icons')}
                  description="アイコンライブラリの設定"
                  icon={Shapes}
                >
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <FieldLabel>アイコンライブラリ</FieldLabel>
                      <select
                        value={(ic.iconLibrary as string) ?? 'lucide-react'}
                        onChange={(e) => updateField('icons', 'iconLibrary', e.target.value)}
                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                      >
                        <option value="lucide-react">Lucide React</option>
                        <option value="カスタム">カスタム</option>
                      </select>
                    </div>

                    {(ic.iconLibrary as string) === 'カスタム' && (
                      <div className="space-y-1.5">
                        <FieldLabel>カスタムアイコンの詳細</FieldLabel>
                        <Textarea
                          value={(ic.iconCustomDetails as string) ?? ''}
                          onChange={(e) => updateField('icons', 'iconCustomDetails', e.target.value)}
                          placeholder={`例: SVGアイコンは public/icons/ 配下に格納\nコンポーネントは components/icons/ で管理\nサイズ: 16px / 20px / 24px の 3展開\nアイコン色は CSS 変数で制御`}
                          className="min-h-28 text-sm mb-1"
                        />
                        <p className="text-2xs leading-[120%] tracking-[0.04em] text-muted-foreground">→ 改行すると箇条書きに出力されます</p>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <FieldLabel>補足情報</FieldLabel>
                      <Textarea
                        value={(ic.iconNotes as string) ?? ''}
                        onChange={(e) => updateField('icons', 'iconNotes', e.target.value)}
                        placeholder={`例: アイコンは必ず aria-hidden="true" を付与する\nデフォルトサイズは 20px\nテキストと併用するときは gap-2 で配置`}
                        className="min-h-20 text-sm mb-1"
                      />
                      <p className="text-2xs leading-[120%] tracking-[0.04em] text-muted-foreground">→ 改行すると箇条書きに出力されます</p>
                    </div>
                  </div>
                </SectionCard>

                {/* レイアウト section */}
                <SectionCard
                  id="layout"
                  label="レイアウト"
                  onClick={() => handleSectionClick('layout')}
                  description="スペーシングと角丸の設定"
                  icon={LayoutGrid}
                >
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <FieldLabel>レイアウトタイプ</FieldLabel>
                      <select
                        value={(lc.layoutType as string) ?? 'liquid'}
                        onChange={(e) => updateField('layout', 'layoutType', e.target.value)}
                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                      >
                        <option value="liquid">リキッド（流動的）</option>
                        <option value="solid">ソリッド（固定幅）</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <FieldLabel>基準単位</FieldLabel>
                      <select
                        value={(lc.spacingBase as string) ?? ''}
                        onChange={(e) => updateField('layout', 'spacingBase', e.target.value)}
                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                      >
                        <option value="">未指定</option>
                        {SPACING_BASE_OPTIONS.map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                        <option value="custom">カスタム</option>
                      </select>
                      {(lc.spacingBase as string) === 'custom' && (
                        <Textarea
                          placeholder="カンマまたは改行で区切ってください"
                          defaultValue="1, 2, 4, 8, 10, 12, 16, 18, 20, 24, 32, 40, 48, 56, 64, 80, 128, 160, 240, 320, 480, 640, 960, 1920"
                          onChange={(e) => updateField('layout', 'spacingBaseCustom', e.target.value)}
                          className="min-h-24 text-xs"
                        />
                      )}
                    </div>

                    {(lc.spacingBase as string) && (lc.spacingBase as string) !== 'custom' && SPACING_SCALES[lc.spacingBase as string] && (
                      <div className="space-y-1.5">
                        <p className="text-xs text-muted-foreground">Spacing Scale</p>
                        <div className="rounded-md border border-input bg-muted p-3 space-y-1 max-h-48 overflow-y-auto">
                          {(() => {
                            let scale: number[] = []
                            if ((lc.spacingBase as string) === 'custom') {
                              const customStr = (lc.spacingBaseCustom as string) || ''
                              scale = customStr
                                .split(/[,\n]/)
                                .map(v => v.trim())
                                .filter(v => v && !isNaN(Number(v)))
                                .map(Number)
                                .sort((a, b) => a - b)
                            } else {
                              scale = SPACING_SCALES[lc.spacingBase as string] || []
                            }
                            return scale.map((val) => {
                              const barWidth = Math.max(1, Math.sqrt(val / 1920) * 85)
                              return (
                                <div key={val} className="flex items-center gap-1.5">
                                  <div className="bg-primary rounded-sm shrink-0" style={{ width: `${barWidth}%`, height: 5 }} />
                                  <span className="text-xs text-muted-foreground">{val}px</span>
                                </div>
                              )
                            })
                          })()}
                        </div>
                      </div>
                    )}

                    <div className="border-t pt-4">
                      <p className="text-xs leading-[120%] tracking-[0.04em] font-bold text-foreground mb-3">ブレイクポイント</p>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { key: 'sm' as const, label: 'sm' },
                          { key: 'md' as const, label: 'md' },
                          { key: 'lg' as const, label: 'lg' },
                          { key: 'xl' as const, label: 'xl' },
                          { key: '2xl' as const, label: '2xl' },
                        ].map(({ key, label }) => (
                          <div key={key} className="flex items-center gap-2 rounded-md border border-input bg-background p-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={(lc[`${key}BreakpointEnabled` as keyof typeof lc] as boolean) ?? true}
                                onChange={(e) => updateField('layout', `${key}BreakpointEnabled`, e.target.checked)}
                                className="h-4 w-4 rounded border-input accent-primary"
                              />
                              <span className="text-xs font-medium text-muted-foreground">{label}</span>
                            </label>
                            <div className="flex items-center gap-1 ml-auto">
                              <input
                                type="number"
                                min={1}
                                value={(lc[`${key}BreakpointValue` as keyof typeof lc] as number) ?? 0}
                                onChange={(e) => updateField('layout', `${key}BreakpointValue`, Number(e.target.value))}
                                disabled={!((lc[`${key}BreakpointEnabled` as keyof typeof lc] as boolean) ?? true)}
                                className="w-16 rounded-md border border-input bg-transparent px-2 py-1 text-xs text-right disabled:opacity-50"
                                placeholder="px"
                              />
                              <span className="text-xs text-muted-foreground w-5">px</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-4 space-y-3">
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked={(lc.ergonomicsGuidance as boolean) ?? false}
                          onChange={(e) => updateField('layout', 'ergonomicsGuidance', e.target.checked)}
                          className="h-4 w-4 rounded border-input accent-primary"
                        />
                        <span className="text-muted-foreground">人間工学に基づく指示を含める</span>
                      </label>
                      {(lc.ergonomicsGuidance as boolean) && (
                        <Textarea
                          value={(lc.ergonomicsContent as string) ?? ERGONOMICS_DEFAULT_TEXT}
                          onChange={(e) => updateField('layout', 'ergonomicsContent', e.target.value)}
                          className="min-h-48 font-mono text-xs"
                        />
                      )}
                    </div>
                  </div>
                </SectionCard>

                {/* コンポーネント section */}
                <SectionCard
                  id="components"
                  label="コンポーネント"
                  onClick={() => handleSectionClick('components')}
                  description="コンポーネント定義・エレベーション・共通指針"
                  icon={Layers}
                >
                  <div className="space-y-4">
                    {/* shadcn/ui スイッチ */}
                    <label className="flex items-center justify-end gap-2 cursor-pointer">
                      <span className="text-sm text-muted-foreground select-none">shadcn/ui を利用する</span>
                      <Switch
                        checked={(cmp.useShadcn as boolean) ?? false}
                        onCheckedChange={(checked) => updateField('components', 'useShadcn', checked)}
                      />
                    </label>

                    {(cmp.useShadcn as boolean) ? (
                      /* shadcn/ui モード */
                      <div className="space-y-4">
                        {SHADCN_FIELDS.map(({ id, label, placeholder }) => (
                          <div key={id} className="space-y-1.5">
                            <FieldLabel>{label}</FieldLabel>
                            <Textarea
                              value={(cmp[id] as string) ?? ''}
                              onChange={(e) => updateField('components', id, e.target.value)}
                              placeholder={placeholder}
                              className="min-h-24 text-sm mb-1"
                            />
                            <p className="text-2xs leading-[120%] tracking-[0.04em] text-muted-foreground">→ 改行すると箇条書きに出力されます</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* 独自コンポーネントモード */
                      <>
                        <div className="space-y-1.5">
                          <FieldLabel>ラウンドネス（丸み）</FieldLabel>
                          <select
                            value={(cmp.roundness as string) ?? 'md'}
                            onChange={(e) => updateField('components', 'roundness', e.target.value)}
                            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                          >
                            {['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', 'full'].map((v) => (
                              <option key={v} value={v}>{v}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <FieldLabel>エレベーション（シャドウ）</FieldLabel>
                          <select
                            value={(cmp.elevation as string) ?? 'md'}
                            onChange={(e) => updateField('components', 'elevation', e.target.value)}
                            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                          >
                            {['none', 'sm', 'md', 'lg'].map((v) => (
                              <option key={v} value={v}>{v}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <FieldLabel>コンポーネント共通指針</FieldLabel>
                          <Textarea
                            value={(cmp.componentNotes as string) ?? ''}
                            onChange={(e) => updateField('components', 'componentNotes', e.target.value)}
                            placeholder="例: ボタンはprimary colorで塗りつぶし、カードはborderのみでelevationなし"
                            className="min-h-16 text-sm mb-1"
                          />
                          <p className="text-2xs leading-[120%] tracking-[0.04em] text-muted-foreground">→ 改行すると箇条書きに出力されます</p>
                        </div>

                        <div className="border-t pt-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <p className="text-xs leading-[120%] tracking-[0.04em] font-bold text-foreground">コンポーネント定義</p>
                            <button
                              type="button"
                              onClick={addComponentItem}
                              className="flex items-center gap-1 text-xs px-2 py-1 rounded-md border border-dashed border-primary text-primary hover:bg-primary-surface transition-colors duration-ui"
                            >
                              <Plus className="size-3" />
                              追加
                            </button>
                          </div>

                          {componentItems.length === 0 && (
                            <p className="text-xs text-muted-foreground text-center py-4">
                              「追加」からコンポーネントを定義してください
                            </p>
                          )}

                          {componentItems.map((item) => {
                            const isOpen = openComponentIds.has(item.id)
                            const isEditing = editingComponentIds.has(item.id)
                            return (
                              <div key={item.id} className="rounded-md border border-input overflow-hidden">
                                <div
                                  className={`flex items-center gap-2 px-3 py-3 bg-background${!isEditing ? ' cursor-pointer' : ''}`}
                                  onClick={!isEditing ? () => toggleComponentOpen(item.id) : undefined}
                                >
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); toggleComponentOpen(item.id) }}
                                    className="shrink-0 text-muted-foreground"
                                  >
                                    {isOpen ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                                  </button>

                                  {isEditing ? (
                                    <Input
                                      value={item.name}
                                      onChange={(e) => updateComponentItem(item.id, 'name', e.target.value)}
                                      placeholder="コンポーネント名（例: Button）"
                                      autoFocus
                                      className="h-auto flex-1 text-xs md:text-xs border-none bg-transparent px-0 py-0 font-medium focus-visible:ring-0"
                                    />
                                  ) : (
                                    <span className="flex-1 text-xs font-medium text-foreground truncate">
                                      {item.name || <span className="text-muted-foreground">未設定</span>}
                                    </span>
                                  )}

                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); toggleComponentEditing(item.id) }}
                                    className="shrink-0 text-muted-foreground hover:text-foreground transition-colors duration-ui"
                                  >
                                    {isEditing ? <Check className="size-3.5" /> : <Pencil className="size-3.5" />}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); removeComponentItem(item.id) }}
                                    className="shrink-0 text-muted-foreground hover:text-destructive transition-colors duration-ui"
                                  >
                                    <Trash2 className="size-3.5" />
                                  </button>
                                </div>

                                {isOpen && (
                                  <div className="border-t border-input p-3 space-y-3">
                                    {COMPONENT_FIELDS.map(({ id, label, placeholder }) => (
                                      <div key={id} className="space-y-1.5">
                                        <p className="text-xs leading-[120%] tracking-[0.04em] font-bold text-foreground">{label}</p>
                                        <Textarea
                                          value={item[id]}
                                          onChange={(e) => updateComponentItem(item.id, id, e.target.value)}
                                          placeholder={placeholder}
                                          disabled={!isEditing}
                                          className="min-h-16 text-xs font-mono mb-1 disabled:opacity-70"
                                        />
                                      </div>
                                    ))}
                                    {isEditing && (
                                      <button
                                        type="button"
                                        onClick={() => toggleComponentEditing(item.id)}
                                        className="flex items-center gap-1.5 w-full justify-center rounded-md border border-input py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-ui"
                                      >
                                        <Check className="size-3" />
                                        編集を完了する
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </>
                    )}
                  </div>
                </SectionCard>

                {/* アクセシビリティ section */}
                <SectionCard
                  id="accessibility"
                  label="アクセシビリティ"
                  onClick={() => handleSectionClick('accessibility')}
                  description="WCAG 準拠レベルとコントラスト比の基準"
                  icon={Eye}
                >
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <FieldLabel>WCAG 準拠レベル</FieldLabel>
                      <select
                        value={(ac.contrastLevel as string) ?? 'AA'}
                        onChange={(e) => {
                          const val = e.target.value
                          if (val === 'A') {
                            batchUpdate((prev) => ({
                              ...prev,
                              accessibility: {
                                ...(prev.accessibility ?? {}),
                                contrastLevel: val,
                                textContrastMin: '3.0',
                                largeTextContrastMin: '3.0',
                                uiContrastMin: '3.0',
                              },
                            }))
                          } else if (val === 'AA') {
                            batchUpdate((prev) => ({
                              ...prev,
                              accessibility: {
                                ...(prev.accessibility ?? {}),
                                contrastLevel: val,
                                textContrastMin: '4.5',
                                largeTextContrastMin: '3.0',
                                uiContrastMin: '3.0',
                              },
                            }))
                          } else if (val === 'AAA') {
                            batchUpdate((prev) => ({
                              ...prev,
                              accessibility: {
                                ...(prev.accessibility ?? {}),
                                contrastLevel: val,
                                textContrastMin: '7.0',
                                largeTextContrastMin: '4.5',
                                uiContrastMin: '3.0',
                              },
                            }))
                          } else {
                            updateField('accessibility', 'contrastLevel', val)
                          }
                        }}
                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                      >
                        <option value="A">WCAG A（最低基準・3:1）</option>
                        <option value="AA">WCAG AA（推奨基準・4.5:1）</option>
                        <option value="AAA">WCAG AAA（最高基準・7:1）</option>
                        <option value="カスタム">カスタム</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs leading-[120%] tracking-[0.04em] font-bold text-foreground">コントラスト比の基準</p>

                      {((ac.contrastLevel as string) ?? 'AA') !== 'カスタム' ? (
                        <div className="rounded-md border border-input bg-muted p-3 space-y-2">
                          {([
                            { label: '通常テキスト（18pt未満 / 太字14pt未満）', a: '3.0', aa: '4.5', aaa: '7.0' },
                            { label: '大テキスト（18pt以上 / 太字14pt以上）', a: '3.0', aa: '3.0', aaa: '4.5' },
                            { label: 'UIコンポーネント・グラフィック', a: '3.0', aa: '3.0', aaa: '3.0' },
                          ] as const).map(({ label, a, aa, aaa }) => {
                            const level = (ac.contrastLevel as string) ?? 'AA'
                            const value = level === 'AAA' ? aaa : level === 'A' ? a : aa
                            return (
                              <div key={label} className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">{label}</span>
                                <span className="font-mono text-xs leading-[120%] tracking-[0.04em] font-bold text-muted-foreground">{value}:1</span>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {([
                            { field: 'textContrastMin', label: '通常テキスト（18pt未満 / 太字14pt未満）', placeholder: '4.5' },
                            { field: 'largeTextContrastMin', label: '大テキスト（18pt以上 / 太字14pt以上）', placeholder: '3.0' },
                            { field: 'uiContrastMin', label: 'UIコンポーネント・グラフィック', placeholder: '3.0' },
                          ] as const).map(({ field, label, placeholder }) => (
                            <div key={field} className="flex items-center gap-3">
                              <span className="text-xs text-muted-foreground flex-1">{label}</span>
                              <div className="flex items-center gap-1">
                                <Input
                                  type="number"
                                  min={1}
                                  max={21}
                                  step={0.1}
                                  placeholder={placeholder}
                                  value={(ac[field] as string) ?? ''}
                                  onChange={(e) => updateField('accessibility', field, e.target.value)}
                                  className="w-20 text-right text-xs"
                                />
                                <span className="text-xs text-muted-foreground">:1</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <FieldLabel>補足情報</FieldLabel>
                      <Textarea
                        value={(ac.accessibilityNotes as string) ?? ''}
                        onChange={(e) => updateField('accessibility', 'accessibilityNotes', e.target.value)}
                        placeholder={`例: ダークモード時は別途コントラスト検証を行う\nスクリーンリーダー対応（aria属性必須）\nprefers-reduced-motion を尊重する`}
                        className="min-h-24 text-sm mb-1"
                      />
                      <p className="text-2xs leading-[120%] tracking-[0.04em] text-muted-foreground">→ 改行すると箇条書きに出力されます</p>
                    </div>
                  </div>
                </SectionCard>

                {/* その他 section */}
                <SectionCard
                  id="other"
                  label="その他"
                  description="上記以外の任意の補足情報"
                  icon={FileText}
                  onClick={() => handleSectionClick('other')}
                >
                  <div className="space-y-1.5">
                    <Textarea
                      value={(oc.otherContent as string) ?? ''}
                      onChange={(e) => updateField('other', 'otherContent', e.target.value)}
                      placeholder="上記セクション以外に記載したい内容を自由に入力してください"
                      className="min-h-40 text-sm mb-1"
                    />
                    <p className="text-2xs leading-[120%] tracking-[0.04em] text-muted-foreground">→ 改行すると箇条書きに出力されます</p>
                  </div>
                </SectionCard>
              </>
            )}
          </div>

          {/* Preview & Save Section */}
          <div className="space-y-5">
            <div className="lg:sticky lg:top-20 space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="filename">ファイル名</Label>
                  {fileCount !== null && (
                    <span className={`text-xs font-mono ${
                      fileCount >= maxFiles ? 'text-destructive' : 'text-muted-foreground'
                    }`}>
                      {fileCount} / {maxFiles}
                    </span>
                  )}
                </div>
                <Input
                  id="filename"
                  placeholder="DESIGN.md"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  disabled={isSaving}
                />
              </div>

              <Textarea
                ref={previewScrollRef}
                value={(() => {
                  if (!themeSelect) return '# Design System Guidelines'
                  if (themeSelect === 'デフォルト') return DEFAULT_PREVIEW
                  return preview
                })()}
                readOnly
                className="h-[calc(100vh-400px)] min-h-64 font-mono text-xs"
              />

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => downloadTextFile(fileName, !themeSelect ? '# Design System Guidelines' : themeSelect === 'デフォルト' ? DEFAULT_PREVIEW : preview)}
                  disabled={isSaving || !themeSelect}
                  className="flex-1"
                >
                  ダウンロード
                </Button>
                {!isAuthLoading && (
                  isLoggedIn ? (
                    <Button
                      onClick={() => save(!themeSelect ? '# Design System Guidelines' : themeSelect === 'デフォルト' ? DEFAULT_PREVIEW : preview)}
                      disabled={isSaving || !themeSelect}
                      className="flex-1"
                    >
                      {isSaving ? '保存中...' : '保存'}
                    </Button>
                  ) : (
                    <a
                      href="/auth/login"
                      className={cn(buttonVariants({ variant: 'default' }), 'flex-1 justify-center', !themeSelect && 'pointer-events-none opacity-50')}
                    >
                      ログインして保存
                    </a>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
