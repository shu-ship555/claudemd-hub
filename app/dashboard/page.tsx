'use client'

import { useState } from 'react'
import { type LucideIcon, Bot, ChevronUp, FileText, LayoutGrid, Layers, ListChecks, MonitorSmartphone, Palette, Puzzle, Sparkles, Type } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { designTemplate, FieldValue } from '@/lib/design-template'
import { createConfigFile } from './actions'
import { DashboardHeader } from '@/components/dashboard-header'
import { useDesignConfig } from '@/lib/hooks/use-design-config'
import { useScrollSync } from '@/lib/hooks/use-scroll-sync'
import { downloadTextFile } from '@/lib/download'
import { FieldRenderer } from '@/components/design-form/field-renderer'
import { COLOR_FORMATS, getColorFormat, getRawColor, assembleColor } from '@/lib/color-utils'
import { useAuth } from '@/lib/hooks/use-auth'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const HIDDEN_SECTIONS = new Set(['components', 'depth', 'agentGuide'])

const SECTION_ICONS: Record<string, LucideIcon> = {
  visualTheme: Sparkles,
  colorPalette: Palette,
  typography: Type,
  components: Puzzle,
  layout: LayoutGrid,
  depth: Layers,
  guidelines: ListChecks,
  responsive: MonitorSmartphone,
  agentGuide: Bot,
  misc: FileText,
}

export default function DashboardPage() {
  const { config, preview, toggleSection, updateField, batchUpdate } = useDesignConfig()
  const { isLoggedIn, isLoading: isAuthLoading } = useAuth()
  const [detailedSections, setDetailedSections] = useState<Set<string>>(new Set())
  const [colorFormat, setColorFormat] = useState('HEX')
  const [customModes, setCustomModes] = useState<Set<string>>(new Set())
  const [isSaving, setIsSaving] = useState(false)
  const [fileName, setFileName] = useState('DESIGN.md')
  const { refA: formScrollRef, refB: previewScrollRef, handleAScroll, handleBScroll } =
    useScrollSync<HTMLDivElement, HTMLTextAreaElement>()

  const visibleMixedSections = designTemplate
    .filter((s) => !HIDDEN_SECTIONS.has(s.id))
    .filter((s) => s.fields.some((f) => f.requirement === 'required') && s.fields.some((f) => f.requirement === 'optional'))

  const isAllDetailed =
    visibleMixedSections.length > 0 && visibleMixedSections.every((s) => detailedSections.has(s.id))

  const handleGlobalModeChange = (checked: boolean) => {
    setDetailedSections(checked ? new Set(visibleMixedSections.map((s) => s.id)) : new Set())
  }

  const handleSectionDetailToggle = (sectionId: string) => {
    setDetailedSections((prev) => {
      const next = new Set(prev)
      if (next.has(sectionId)) next.delete(sectionId)
      else next.add(sectionId)
      return next
    })
  }

  const handleColorFormatChange = (newFormat: string) => {
    setColorFormat(newFormat)
    batchUpdate((prev) => {
      const next = { ...prev }
      for (const section of designTemplate) {
        for (const field of section.fields) {
          if (field.type !== 'color') continue
          const fullValue = (prev[section.id]?.[field.id] as string) || ''
          if (!fullValue) continue
          const raw = getRawColor(fullValue, getColorFormat(fullValue))
          if (!raw) continue
          next[section.id] = { ...next[section.id], [field.id]: assembleColor(newFormat, raw) }
        }
      }
      return next
    })
  }

  const handleSave = async () => {
    if (!fileName.trim()) {
      alert('ファイル名を入力してください')
      return
    }
    setIsSaving(true)
    try {
      await createConfigFile(fileName, preview)
      alert('DESIGN.md を保存しました')
      setFileName('DESIGN.md')
    } catch (error) {
      console.error('Save error:', error)
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
            className="space-y-8 max-h-[calc(100vh-160px)] overflow-y-auto"
            onScroll={handleAScroll}
          >
            <div className="flex items-center justify-between pr-4 pb-5">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">全セクション</span>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${!isAllDetailed ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>簡易</span>
                  <Switch
                    checked={isAllDetailed}
                    onCheckedChange={handleGlobalModeChange}
                  />
                  <span className={`text-sm ${isAllDetailed ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>詳細</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">カラー形式</span>
                <select
                  value={colorFormat}
                  onChange={(e) => handleColorFormatChange(e.target.value)}
                  className="rounded-md border border-input bg-transparent dark:bg-input/30 px-2 py-1.5 text-sm"
                >
                  {COLOR_FORMATS.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-8 pr-4">
              {designTemplate.filter((s) => !HIDDEN_SECTIONS.has(s.id)).map((section) => {
                const sectionHasRequired = section.fields.some((f) => f.requirement === 'required')
                const sectionHasOptional = section.fields.some((f) => f.requirement === 'optional')
                const isDetailed = detailedSections.has(section.id)
                return (
                  <div
                    key={section.id}
                    className="rounded-xl border border-border bg-card overflow-hidden"
                  >
                    <div className="px-6 pt-3.5 pb-4 bg-blue-500/8 rounded-t-xl space-y-1">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm font-semibold flex items-center gap-1.5 shrink-0">
                          {(() => { const Icon = SECTION_ICONS[section.id]; return Icon ? <Icon className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" /> : null })()}
                          {section.label}
                        </Label>
                        {sectionHasRequired && sectionHasOptional && (
                          <div className="inline-flex text-[10px] rounded overflow-hidden bg-foreground/5 shrink-0">
                            <button
                              type="button"
                              onClick={() => isDetailed && handleSectionDetailToggle(section.id)}
                              className={`px-1.5 py-0.5 transition-colors ${!isDetailed ? 'bg-foreground/10 text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                              簡易
                            </button>
                            <button
                              type="button"
                              onClick={() => !isDetailed && handleSectionDetailToggle(section.id)}
                              className={`px-1.5 py-0.5 transition-colors ${isDetailed ? 'bg-foreground/10 text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                              詳細
                            </button>
                          </div>
                        )}
                        <Switch
                          checked={config[section.id]?.enabled || false}
                          onCheckedChange={() => toggleSection(section.id)}
                          className="ml-auto"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">{section.description}</p>
                    </div>

                    {config[section.id]?.enabled && (
                      <div className="space-y-5 px-6 pt-5.5 pb-6">
                        {(() => {
                          const visibleFields = section.fields.filter((field) => {
                            if (!isDetailed && field.requirement === 'optional' && sectionHasRequired) return false
                            if (field.dependsOn) {
                              const depValue = config[section.id][field.dependsOn.fieldId]
                              const depValues: FieldValue[] = Array.isArray(depValue) ? depValue : [depValue]
                              if (!field.dependsOn.values.some((v) => depValues.includes(v))) return false
                            }
                            return true
                          })

                          const toggleFields = visibleFields.filter(
                            (f) => f.type === 'number' && f.toggle
                          )
                          const normalFields = visibleFields.filter(
                            (f) => !(f.type === 'number' && f.toggle)
                          )

                          return (
                            <>
                              {toggleFields.length > 0 && (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-1.5">
                                    <label className="text-sm font-medium">ブレークポイント</label>
                                    <Badge variant="outline">任意</Badge>
                                  </div>
                                  <div className="flex flex-wrap gap-x-5 gap-y-2">
                                    {toggleFields.map((field) => (
                                      <FieldRenderer
                                        key={field.id}
                                        sectionId={section.id}
                                        field={field}
                                        value={config[section.id][field.id] as FieldValue}
                                        onChange={(val) => updateField(section.id, field.id, val)}
                                        colorFormat={colorFormat}
                                        isCustomMode={false}
                                        onCustomModeChange={() => {}}
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}
                              {normalFields.map((field) => {
                                const customKey = `${section.id}:${field.id}`
                                return (
                                  <div key={field.id} className="space-y-2">
                                    <div className="flex items-center gap-1.5">
                                      <label className="text-sm font-medium">{field.label}</label>
                                      {field.requirement === 'required' && (
                                        <Badge variant="destructive">必須</Badge>
                                      )}
                                      {field.requirement === 'optional' && (
                                        <Badge variant="outline">任意</Badge>
                                      )}
                                    </div>
                                    <FieldRenderer
                                      sectionId={section.id}
                                      field={field}
                                      value={config[section.id][field.id] as FieldValue}
                                      onChange={(val) => updateField(section.id, field.id, val)}
                                      colorFormat={colorFormat}
                                      isCustomMode={customModes.has(customKey)}
                                      onCustomModeChange={(isCustom) => {
                                        setCustomModes((prev) => {
                                          const next = new Set(prev)
                                          if (isCustom) next.add(customKey)
                                          else next.delete(customKey)
                                          return next
                                        })
                                        if (isCustom) updateField(section.id, field.id, '')
                                      }}
                                    />
                                  </div>
                                )
                              })}
                            </>
                          )
                        })()}
                        {isDetailed && (
                          <button
                            type="button"
                            onClick={() => handleSectionDetailToggle(section.id)}
                            className="w-full flex items-center justify-center gap-1 pt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <ChevronUp className="h-3 w-3" />
                            閉じる
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
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

              <div className="space-y-2">
                <Label>プレビュー</Label>
                <Textarea
                  ref={previewScrollRef}
                  value={preview}
                  readOnly
                  className="h-[calc(100vh-440px)] min-h-64 font-mono text-xs"
                  onScroll={handleBScroll}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => downloadTextFile(fileName, preview)}
                  disabled={isSaving}
                  className="flex-1"
                >
                  ダウンロード
                </Button>
                {!isAuthLoading && (
                  isLoggedIn ? (
                    <Button
                      onClick={handleSave}
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
