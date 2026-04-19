'use client'

import { Sparkles, Palette, Type, LayoutGrid } from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard-header'
import { useDesignConfig } from '@/lib/hooks/use-design-config'
import { useScrollSync } from '@/lib/hooks/use-scroll-sync'
import { useSaveConfigFile } from '@/lib/hooks/use-save-config-file'
import { LATIN_FONTS, JAPANESE_FONTS, SPACING_BASE_OPTIONS, LIGHT_COLORS } from '@/lib/constants'
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


const COLOR_FIELDS: { key: keyof Colors; label: string }[] = [
  { key: 'bg', label: '背景色' },
  { key: 'surface', label: 'サーフェス色' },
  { key: 'border', label: 'ボーダー色' },
  { key: 'primary', label: 'プライマリ色' },
  { key: 'info', label: 'インフォメーション色' },
  { key: 'text', label: 'テキスト色' },
  { key: 'muted', label: 'ミュート色' },
  { key: 'success', label: '成功色' },
  { key: 'warning', label: '警告色' },
  { key: 'danger', label: '危険色' },
  { key: 'orange', label: 'ハイライト色' },
]

function colorsToConfigPatch(colors: Colors) {
  return {
    colorPalette: {
      enabled: true,
      primaryCtaColor: colors.primary,
      primaryTextColor: colors.text,
      primarySurfaceColor: colors.bg,
      weakTextColor: colors.muted,
      subtleSurfaceColor: colors.surface,
      borderColor: colors.border,
      successColor: colors.success,
      warningColor: colors.warning,
      errorColor: colors.danger,
      semanticColor: colors.info,
    },
    agentGuide: {
      enabled: true,
      agentCtaColor: colors.primary,
      agentTextColor: colors.text,
      agentBgColor: colors.bg,
      agentBorderColor: colors.border,
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

  const handleThemeChange = (val: string) => {
    setThemeSelect(val)
    if (val === 'カスタム') {
      setPresetPreview(null)
      updateField(section, 'themeName', '')
      batchUpdate((prev) => ({ ...prev, ...colorsToConfigPatch(customColors) }))
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
    batchUpdate((prev) => ({ ...prev, ...colorsToConfigPatch(next) }))
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
                  <div className="grid grid-cols-2 gap-3">
                    {COLOR_FIELDS.map(({ key, label }) => (
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
                      </select>
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
                      </select>
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
                      </select>
                    </div>

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
                  customColors={customColors}
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
