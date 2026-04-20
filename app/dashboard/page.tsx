'use client'

import { Sparkles, Palette, Type, LayoutGrid, Info } from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard-header'
import { useDesignConfig } from '@/lib/hooks/use-design-config'
import { useScrollSync } from '@/lib/hooks/use-scroll-sync'
import { useSaveConfigFile } from '@/lib/hooks/use-save-config-file'
import { LATIN_FONTS, JAPANESE_FONTS, SPACING_BASE_OPTIONS, SPACING_SCALES, LIGHT_COLORS, TEXT_STYLE_CATEGORIES, TEXT_STYLE_WEIGHTS, DEFAULT_TEXT_STYLES, CATEGORY_LABELS } from '@/lib/constants'
import { downloadTextFile } from '@/lib/download'
import { useAuth } from '@/lib/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FieldLabel } from '@/components/ui/field-label'
import { TabBar } from '@/components/ui/tab-bar'
import { SectionCard } from '@/components/ui/section-card'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { THEME_PRESETS } from '@/lib/theme-presets'
import { ThemePreview, type Colors } from '@/components/theme-preview'
import { useState } from 'react'

const THEME_OPTIONS = ['デフォルト', 'カスタム']

const PREVIEW_TABS = [
  { key: 'markdown' as const, label: 'マークダウン' },
  { key: 'component' as const, label: 'コンポーネント' },
]


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

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, Math.round(l * 100)]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

function hslToHex(h: number, s: number, l: number): string {
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1; if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }
  const sn = s / 100, ln = l / 100
  let r, g, b
  if (sn === 0) { r = g = b = ln } else {
    const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn
    const p = 2 * ln - q
    r = hue2rgb(p, q, h / 360 + 1 / 3)
    g = hue2rgb(p, q, h / 360)
    b = hue2rgb(p, q, h / 360 - 1 / 3)
  }
  const hex = (x: number) => Math.round(x * 255).toString(16).padStart(2, '0')
  return `#${hex(r)}${hex(g)}${hex(b)}`
}

function getLuminance(hex: string): number {
  const ch = [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)]
    .map((c) => parseInt(c, 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2]
}

function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = getLuminance(hex1), l2 = getLuminance(hex2)
  const [light, dark] = l1 > l2 ? [l1, l2] : [l2, l1]
  return Math.round(((light + 0.05) / (dark + 0.05)) * 10) / 10
}

type ContrastLevel = 'aa' | 'aa-ui' | 'fail'

function getContrastLevel(key: keyof Colors, ratio: number): ContrastLevel {
  if (key === 'primary') return ratio >= 4.5 ? 'aa' : 'fail'
  return ratio >= 4.5 ? 'aa' : ratio >= 3 ? 'aa-ui' : 'fail'
}

const SEMANTIC_COLOR_FIELDS: { key: keyof Colors; label: string }[] = [
  { key: 'success', label: 'サクセス' },
  { key: 'danger', label: 'エラー' },
  { key: 'warning', label: '警告' },
]

function parseTextStyle(style: string): { fontSize: string; weight: string; lineHeight: string } {
  const match = style.match(/^(\d+)([BN])-(\d+)$/)
  if (!match) return { fontSize: '', weight: '', lineHeight: '' }
  const [, fontSize, weight, lineHeight] = match
  return {
    fontSize: `${fontSize}px`,
    weight: weight === 'B' ? 'Bold' : 'Normal',
    lineHeight: lineHeight,
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
  const { fileName, setFileName, isSaving, save } = useSaveConfigFile('DESIGN.md')
  const [themeSelect, setThemeSelect] = useState('')
  const [presetPreview, setPresetPreview] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState<'markdown' | 'component'>('markdown')
  const [customColors, setCustomColors] = useState<Colors>(LIGHT_COLORS)
  const { refA: formScrollRef, refB: previewScrollRef, handleAScroll, handleBScroll } =
    useScrollSync<HTMLDivElement, HTMLTextAreaElement>()

  const isCustom = themeSelect === 'カスタム'
  const displayPreview = presetPreview ?? preview
  const section = 'visualTheme'
  const v = config[section] ?? {}
  const tc = config['typography'] ?? {}
  const lc = config['layout'] ?? {}
  const cc = config['colorPalette'] ?? {}

  const handleThemeChange = (val: string) => {
    setThemeSelect(val)
    if (val === 'カスタム') {
      setPresetPreview(null)
      updateField(section, 'themeName', '')
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
      setPresetPreview(THEME_PRESETS[val].content)
      updateField(section, 'themeName', val)
    } else {
      setPresetPreview(null)
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
    <div className="min-h-screen bg-background">
      <DashboardHeader title="DESIGN.md Generator" subtitle="カスタム設計ガイドラインを生成して保存します" />

      <main className="max-w-7xl mx-auto px-6 pt-11 pb-12">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Form Section */}
          <div
            ref={formScrollRef}
            className="space-y-6 max-h-[calc(100vh-160px)] overflow-y-auto pr-4"
            onScroll={handleAScroll}
          >
            {/* Standalone theme selector */}
            <div className="space-y-2">
              <FieldLabel requirement="required">テーマ名 / インスピレーション元</FieldLabel>
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
              {isCustom && (
                <Input
                  placeholder="ブランド名を入力"
                  value={(v.themeName as string) ?? ''}
                  onChange={(e) => updateField(section, 'themeName', e.target.value)}
                />
              )}
            </div>

            {isCustom && (
              <>
                {/* ビジュアルテーマ section */}
                <SectionCard
                  label="ビジュアルテーマ"
                  description="ブランドの世界観・インスピレーション元・全体の雰囲気"
                  icon={Sparkles}
                >
                  <div className="space-y-2">
                    <FieldLabel requirement="optional">ビジュアル雰囲気の説明</FieldLabel>
                    <Textarea
                      placeholder="例: 白を基調としたキャンバスに深いネイビーのテキスト（#181d26）、Airtable Blue（#1b61c9）をアクセントとする、洗練されたシンプルさ。"
                      value={(v.atmosphere as string) ?? ''}
                      onChange={(e) => updateField(section, 'atmosphere', e.target.value)}
                      className="min-h-32"
                    />
                  </div>

                  <div className="space-y-2">
                    <FieldLabel requirement="optional">主要な特徴（1行1項目）</FieldLabel>
                    <Textarea
                      placeholder={'例:\n白いキャンバスとディープネイビーのテキスト (#181d26)\nAirtable Blue (#1b61c9) を CTA とリンクに使用\nHaas + Haas Groot Disp のデュアルフォント\n12px のボタンラジウス、16px-32px のカード\nブルー調の多層シャドウ'}
                      value={(v.keyCharacteristics as string) ?? ''}
                      onChange={(e) => updateField(section, 'keyCharacteristics', e.target.value)}
                      className="min-h-40"
                    />
                  </div>
                </SectionCard>

                {/* カラーパレット section */}
                <SectionCard
                  label="カラーパレット"
                  description="コンポーネントプレビューとマークダウンの両方に反映されます"
                  icon={Palette}
                >
                  <div className="space-y-8">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <p className="text-xs font-medium text-muted-foreground">キーカラー</p>
                        <div className="relative group">
                          <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                          <div className="absolute top-full left-0 mt-1 z-50 invisible group-hover:visible bg-popover text-popover-foreground text-xs rounded-md px-3 py-2 shadow-md w-64 pointer-events-none">
                            プライマリ（CTA・リンク）、セカンダリ（副次的UI・同色相で明度高）、ターシャリ（セカンダリの逆明度）、背景色の4色。セカンダリ・ターシャリは背景色との対比3:1以上、テキスト使用時は4.5:1以上が必要。
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-muted-foreground">色相</span>
                            <span className="text-[10px] font-mono text-muted-foreground">{hexToHsl(customColors.primary)[0]}°</span>
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
                            <span className="text-[10px] text-muted-foreground">彩度</span>
                            <span className="text-[10px] font-mono text-muted-foreground">{hexToHsl(customColors.primary)[1]}%</span>
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
                            <span className="text-[10px] text-muted-foreground">明度</span>
                            <span className="text-[10px] font-mono text-muted-foreground">{hexToHsl(customColors.primary)[2]}%</span>
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
                          const level = ratio !== null ? getContrastLevel(key, ratio) : null
                          const badgeClass = level === 'aa' ? 'bg-success/15 text-success' : level === 'aa-ui' ? 'bg-warning/15 text-warning' : level === 'fail' ? 'bg-danger/15 text-danger' : ''
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
                              {ratio !== null && (
                                <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${badgeClass}`}>
                                  {ratio}:1
                                </span>
                              )}
                            </label>
                          )
                        })}
                      </div>
                      <p className="mt-3 text-xs font-medium text-foreground">キーカラーの使い方</p>
                      <Textarea
                        value={(cc.keyColorNotes as string) ?? ''}
                        onChange={(e) => updateField('colorPalette', 'keyColorNotes', e.target.value)}
                        className="mt-1 min-h-20 text-xs"
                      />

                      {(((cc.additionalKeyColorSets as any) || []).map((set: any, idx: number) => (
                        <div key={idx} className="mt-6 pt-6 border-t space-y-4">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-foreground">セット {idx + 2}</p>
                            <button
                              onClick={() => {
                                const next = ((cc.additionalKeyColorSets as any) || []).filter((_: any, i: number) => i !== idx)
                                updateField('colorPalette', 'additionalKeyColorSets', next)
                              }}
                              className="text-xs px-2 py-1 rounded border border-dashed border-muted-foreground text-muted-foreground hover:border-danger hover:text-danger"
                            >
                              削除
                            </button>
                          </div>
                          <div className="space-y-4">
                            <div className="space-y-4">
                              <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] text-muted-foreground">色相</span>
                                  <span className="text-[10px] font-mono text-muted-foreground">{hexToHsl(set.primaryColor)[0]}°</span>
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
                                  <span className="text-[10px] text-muted-foreground">彩度</span>
                                  <span className="text-[10px] font-mono text-muted-foreground">{hexToHsl(set.primaryColor)[1]}%</span>
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
                                  <span className="text-[10px] text-muted-foreground">明度</span>
                                  <span className="text-[10px] font-mono text-muted-foreground">{hexToHsl(set.primaryColor)[2]}%</span>
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
                                const primaryLevel = getContrastLevel('primary', primaryRatio)
                                const primaryBadgeClass = primaryLevel === 'aa' ? 'bg-success/15 text-success' : primaryLevel === 'aa-ui' ? 'bg-warning/15 text-warning' : 'bg-danger/15 text-danger'
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
                                    <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${primaryBadgeClass}`}>
                                      {primaryRatio}:1
                                    </span>
                                  </label>
                                )
                              })()}
                              {(() => {
                                const secondaryRatio = getContrastRatio(set.secondaryColor, set.bgColor)
                                const secondaryLevel = getContrastLevel('secondary', secondaryRatio)
                                const secondaryBadgeClass = secondaryLevel === 'aa' ? 'bg-success/15 text-success' : secondaryLevel === 'aa-ui' ? 'bg-warning/15 text-warning' : 'bg-danger/15 text-danger'
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
                                    <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${secondaryBadgeClass}`}>
                                      {secondaryRatio}:1
                                    </span>
                                  </label>
                                )
                              })()}
                              {(() => {
                                const tertiaryRatio = getContrastRatio(set.tertiaryColor, set.bgColor)
                                const tertiaryLevel = getContrastLevel('tertiary', tertiaryRatio)
                                const tertiaryBadgeClass = tertiaryLevel === 'aa' ? 'bg-success/15 text-success' : tertiaryLevel === 'aa-ui' ? 'bg-warning/15 text-warning' : 'bg-danger/15 text-danger'
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
                                    <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${tertiaryBadgeClass}`}>
                                      {tertiaryRatio}:1
                                    </span>
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
                            <p className="text-xs font-medium text-foreground">この色セットの使い方</p>
                            <Textarea
                              value={set.notes ?? ''}
                              onChange={(e) => {
                                const next = [...((cc.additionalKeyColorSets as any) || [])]
                                next[idx] = { ...next[idx], notes: e.target.value }
                                updateField('colorPalette', 'additionalKeyColorSets', next)
                              }}
                              className="min-h-20 text-xs"
                            />
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
                          className="mt-4 w-full py-2 rounded border border-dashed border-muted-foreground text-muted-foreground text-sm hover:border-foreground hover:text-foreground"
                        >
                          + セットを追加
                        </button>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-1">
                        <p className="text-xs font-medium text-muted-foreground">共通カラー</p>
                        <div className="relative group">
                          <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                          <div className="absolute top-full left-0 mt-1 z-50 invisible group-hover:visible bg-popover text-popover-foreground text-xs rounded-md px-3 py-2 shadow-md w-64 pointer-events-none">
                            白から黒の10段階グレースケール。背景・サーフェス・ボーダー・テキストなど、UI全体の情報階層と視覚的な重みを表現するために使用する。
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
                      <p className="mt-3 text-xs font-medium text-foreground">グレースケールの使い方</p>
                      <Textarea
                        value={(cc.commonColorNotes as string) ?? ''}
                        onChange={(e) => updateField('colorPalette', 'commonColorNotes', e.target.value)}
                        className="mt-1 min-h-20 text-xs"
                      />
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
                          <p className="text-xs font-medium text-muted-foreground">セマンティックカラー</p>
                        </label>
                        <div className="relative group">
                          <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                          <div className="absolute top-full left-0 mt-1 z-50 invisible group-hover:visible bg-popover text-popover-foreground text-xs rounded-md px-3 py-2 shadow-md w-64 pointer-events-none">
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
                        <p className="mt-3 text-xs font-medium text-foreground">セマンティックカラーの使い方</p>
                        <Textarea
                          value={(cc.semanticColorNotes as string) ?? ''}
                          onChange={(e) => updateField('colorPalette', 'semanticColorNotes', e.target.value)}
                          className="mt-1 min-h-20 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </SectionCard>

                {/* タイポグラフィ section */}
                <SectionCard
                  label="タイポグラフィ"
                  description="欧文・和文フォントファミリー"
                  icon={Type}
                >
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <FieldLabel requirement="optional">欧文フォント</FieldLabel>
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
                      <FieldLabel requirement="optional">和文フォント</FieldLabel>
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
                      <p className="text-xs font-medium text-foreground">テキストスタイル</p>
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
                          return (
                            <div key={category} className="space-y-3 pb-6 border-b last:border-b-0">
                              <p className="text-xs font-medium text-foreground">{categoryLabel}</p>
                              {TEXT_STYLE_WEIGHTS.map((weight) => (
                                <div key={`${category}-${weight}`} className="space-y-2">
                                  <p className="text-[10px] text-muted-foreground ml-2">{weight === 'B' ? 'Bold' : 'Normal'}</p>
                                  <div className="grid grid-cols-2 gap-2 ml-2">
                                    {DEFAULT_TEXT_STYLES[category][weight].map((style) => {
                                      const parsed = parseTextStyle(style)
                                      return (
                                        <label key={style} className="flex items-center gap-2 text-sm cursor-pointer">
                                          <input
                                            type="checkbox"
                                            defaultChecked
                                            className="h-4 w-4 rounded border-input accent-primary"
                                          />
                                          <span className="text-muted-foreground font-mono text-xs">{parsed.fontSize}｜{parsed.weight}｜{parsed.lineHeight}</span>
                                        </label>
                                      )
                                    })}
                                  </div>
                                </div>
                              ))}
                              <div className="space-y-2 mt-4">
                                <p className="text-xs font-medium text-foreground">{categoryLabel}の使い方</p>
                                <Textarea
                                  value={(tc[notesField as keyof typeof tc] as string) ?? ''}
                                  onChange={(e) => updateField('typography', notesField, e.target.value)}
                                  className="min-h-16 text-xs"
                                  placeholder={`${categoryLabel}テキストスタイルの使用例や説明を入力してください`}
                                />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </SectionCard>

                {/* レイアウト section */}
                <SectionCard
                  label="レイアウト"
                  description="スペーシングと角丸の設定"
                  icon={LayoutGrid}
                >
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <FieldLabel requirement="optional">基準単位</FieldLabel>
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
                          defaultValue="1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 32, 40, 48, 56, 64, 80, 128, 160, 240, 320, 480, 640, 960, 1920"
                          onChange={(e) => updateField('layout', 'spacingBaseCustom', e.target.value)}
                          className="min-h-24 text-xs"
                        />
                      )}
                    </div>

                    {(lc.spacingBase as string) && (lc.spacingBase as string) !== 'custom' && SPACING_SCALES[lc.spacingBase as string] && (
                      <div className="space-y-1.5">
                        <p className="text-xs text-muted-foreground">Spacing Scale</p>
                        <div className="rounded-md border border-input bg-muted/40 p-3 space-y-1 max-h-48 overflow-y-auto">
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
                              const barWidth = val <= 24
                                ? Math.round((val / 24) * 20)
                                : Math.round(20 + ((val - 24) / 1896) * 80)
                              return (
                                <div key={val} className="flex items-center gap-2">
                                  <div className="bg-primary/70 rounded-sm shrink-0" style={{ width: `${barWidth}%`, height: 5 }} />
                                  <span className="text-xs text-muted-foreground">{val}px</span>
                                </div>
                              )
                            })
                          })()}
                        </div>
                      </div>
                    )}

                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(lc.useCircleRadius as boolean) ?? false}
                        onChange={(e) => updateField('layout', 'useCircleRadius', e.target.checked)}
                        className="h-4 w-4 rounded border-input accent-primary"
                      />
                      <span className="text-muted-foreground">円形要素（50%）を使用する</span>
                    </label>
                  </div>
                </SectionCard>
              </>
            )}
          </div>

          {/* Preview & Save Section */}
          <div className="space-y-5">
            <div className="lg:sticky lg:top-20 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="filename">ファイル名</Label>
                <Input
                  id="filename"
                  placeholder="DESIGN.md"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  disabled={isSaving}
                />
              </div>

              <TabBar
                items={PREVIEW_TABS}
                value={previewMode}
                onChange={setPreviewMode}
              />

              {previewMode === 'markdown' ? (
                <Textarea
                  ref={previewScrollRef}
                  value={displayPreview}
                  readOnly
                  className="h-[calc(100vh-480px)] min-h-64 font-mono text-xs"
                  onScroll={handleBScroll}
                />
              ) : (
                <ThemePreview
                  theme={themeSelect}
                  height="calc(100vh - 480px)"
                  customColors={(cc.useSemanticColors as boolean) ?? true
                    ? customColors
                    : { ...customColors, success: LIGHT_COLORS.success, danger: LIGHT_COLORS.danger, warning: LIGHT_COLORS.warning }
                  }
                  fonts={{ latin: tc.latinFont as string, japanese: tc.japaneseFont as string }}
                  layout={{ spacingBase: lc.spacingBase as string, useCircleRadius: lc.useCircleRadius as boolean }}
                />
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => downloadTextFile(fileName, displayPreview)}
                  disabled={isSaving}
                  className="flex-1"
                >
                  ダウンロード
                </Button>
                {!isAuthLoading && (
                  isLoggedIn ? (
                    <Button
                      onClick={() => save(displayPreview)}
                      disabled={isSaving}
                      className="flex-1"
                    >
                      {isSaving ? '保存中...' : '保存'}
                    </Button>
                  ) : (
                    <a
                      href="/auth/login"
                      className={cn(buttonVariants({ variant: 'outline' }), 'flex-1 justify-center')}
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
    </div>
  )
}
