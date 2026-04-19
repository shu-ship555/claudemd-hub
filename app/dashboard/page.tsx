'use client'

import { Sparkles } from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard-header'
import { useDesignConfig } from '@/lib/hooks/use-design-config'
import { useScrollSync } from '@/lib/hooks/use-scroll-sync'
import { downloadTextFile } from '@/lib/download'
import { useAuth } from '@/lib/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { createConfigFile } from './actions'
import { THEME_PRESETS } from '@/lib/theme-presets'
import { ThemePreview } from '@/components/theme-preview'
import { useState } from 'react'

const THEME_OPTIONS = ['デフォルト', 'カスタム']

export default function DashboardPage() {
  const { config, preview, updateField } = useDesignConfig()
  const { isLoggedIn, isLoading: isAuthLoading } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [fileName, setFileName] = useState('DESIGN.md')
  const [themeSelect, setThemeSelect] = useState('')
  const [presetPreview, setPresetPreview] = useState<string | null>(null)
  const { refA: formScrollRef, refB: previewScrollRef, handleAScroll, handleBScroll } =
    useScrollSync<HTMLDivElement, HTMLTextAreaElement>()

  const isCustom = themeSelect === 'カスタム'
  const displayPreview = presetPreview ?? preview
  const [previewMode, setPreviewMode] = useState<'markdown' | 'component'>('markdown')
  const section = 'visualTheme'
  const v = config[section] ?? {}

  const handleThemeChange = (val: string) => {
    setThemeSelect(val)
    if (val === 'カスタム') {
      setPresetPreview(null)
      updateField(section, 'themeName', '')
    } else if (THEME_PRESETS[val]) {
      setPresetPreview(THEME_PRESETS[val].content)
      updateField(section, 'themeName', val)
    } else {
      setPresetPreview(null)
      updateField(section, 'themeName', '')
    }
  }

  const handleSave = async () => {
    if (!fileName.trim()) {
      alert('ファイル名を入力してください')
      return
    }
    setIsSaving(true)
    try {
      await createConfigFile(fileName, displayPreview)
      alert('DESIGN.md を保存しました')
    } catch {
      alert('保存に失敗しました')
    } finally {
      setIsSaving(false)
    }
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
              <div className="flex items-center gap-1.5">
                <Label className="text-sm font-medium">テーマ名 / インスピレーション元</Label>
                <Badge variant="destructive">必須</Badge>
              </div>
              <select
                value={themeSelect}
                onChange={(e) => handleThemeChange(e.target.value)}
                className="w-full rounded-md border border-input bg-transparent dark:bg-input/30 px-3 py-2 text-sm"
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

            {/* ビジュアルテーマ section */}
            <fieldset disabled={!isCustom} className="group">
              <div className={cn(
                'rounded-xl border border-border bg-card overflow-hidden transition-opacity',
                !isCustom && 'opacity-50'
              )}>
                <div className="px-6 pt-3.5 pb-4 bg-blue-500/8 rounded-t-xl space-y-1">
                  <Label className="text-sm font-semibold flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    ビジュアルテーマ
                  </Label>
                  <p className="text-xs text-muted-foreground">ブランドの世界観・インスピレーション元・全体の雰囲気</p>
                </div>

                <div className="space-y-5 px-6 pt-5.5 pb-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <label className="text-sm font-medium">ビジュアル雰囲気の説明</label>
                      <Badge variant="destructive">必須</Badge>
                    </div>
                    <Textarea
                      placeholder="例: 白を基調としたキャンバスに深いネイビーのテキスト（#181d26）、Airtable Blue（#1b61c9）をアクセントとする、洗練されたシンプルさ。"
                      value={(v.atmosphere as string) ?? ''}
                      onChange={(e) => updateField(section, 'atmosphere', e.target.value)}
                      className="min-h-32"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <label className="text-sm font-medium">主要な特徴（1行1項目）</label>
                      <Badge variant="outline">任意</Badge>
                    </div>
                    <Textarea
                      placeholder={'例:\n白いキャンバスとディープネイビーのテキスト (#181d26)\nAirtable Blue (#1b61c9) を CTA とリンクに使用\nHaas + Haas Groot Disp のデュアルフォント\n12px のボタンラジウス、16px-32px のカード\nブルー調の多層シャドウ'}
                      value={(v.keyCharacteristics as string) ?? ''}
                      onChange={(e) => updateField(section, 'keyCharacteristics', e.target.value)}
                      className="min-h-40"
                    />
                  </div>
                </div>
              </div>
            </fieldset>
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

              {/* Tab switcher */}
              <div className="flex gap-1 p-1 rounded-lg bg-muted/40 border border-border">
                {(['markdown', 'component'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPreviewMode(mode)}
                    className={cn(
                      'flex-1 text-xs py-1.5 rounded-md font-medium transition-colors',
                      previewMode === mode
                        ? 'bg-card text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {mode === 'markdown' ? 'マークダウン' : 'コンポーネント'}
                  </button>
                ))}
              </div>

              {previewMode === 'markdown' ? (
                <div className="space-y-2">
                  <Textarea
                    ref={previewScrollRef}
                    value={displayPreview}
                    readOnly
                    className="h-[calc(100vh-480px)] min-h-64 font-mono text-xs"
                    onScroll={handleBScroll}
                  />
                </div>
              ) : (
                <ThemePreview theme={themeSelect} height="calc(100vh - 480px)" />
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
                    <Button onClick={handleSave} disabled={isSaving} className="flex-1">
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
