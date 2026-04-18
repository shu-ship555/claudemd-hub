'use client'

import { useState } from 'react'
import { ChevronUp } from 'lucide-react'
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

const HIDDEN_SECTIONS = new Set(['components', 'depth', 'agentGuide'])

export default function DashboardPage() {
  const { config, preview, toggleSection, updateField, batchUpdate } = useDesignConfig()
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

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Form Section */}
          <div
            ref={formScrollRef}
            className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto"
            onScroll={handleAScroll}
          >
            <div className="flex items-center justify-between pr-4 pb-2">
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
                  className="rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                >
                  {COLOR_FORMATS.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-6 pr-4">
              {designTemplate.filter((s) => !HIDDEN_SECTIONS.has(s.id)).map((section) => (
                <div
                  key={section.id}
                  className="space-y-4 p-4 border border-border rounded-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-0.5">
                      <Label className="text-base font-semibold">{section.label}</Label>
                      <p className="text-xs text-muted-foreground">{section.description}</p>
                    </div>
                    <Switch
                      checked={config[section.id]?.enabled || false}
                      onCheckedChange={() => toggleSection(section.id)}
                    />
                  </div>

                  {config[section.id]?.enabled && (() => {
                    const sectionHasRequired = section.fields.some((f) => f.requirement === 'required')
                    const sectionHasOptional = section.fields.some((f) => f.requirement === 'optional')
                    const isDetailed = detailedSections.has(section.id)
                    return (
                      <div className="space-y-4 ml-2 pt-2 border-t border-border">
                        {sectionHasRequired && sectionHasOptional && (
                          <div className="flex justify-end">
                            <div className="inline-flex text-xs border border-border rounded-md overflow-hidden">
                              <button
                                type="button"
                                onClick={() => isDetailed && handleSectionDetailToggle(section.id)}
                                className={`px-2.5 py-1 transition-colors ${!isDetailed ? 'bg-muted text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                              >
                                簡易
                              </button>
                              <button
                                type="button"
                                onClick={() => !isDetailed && handleSectionDetailToggle(section.id)}
                                className={`px-2.5 py-1 transition-colors ${isDetailed ? 'bg-muted text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                              >
                                詳細
                              </button>
                            </div>
                          </div>
                        )}
                        {section.fields.map((field) => {
                          if (!isDetailed && field.requirement === 'optional' && sectionHasRequired) return null

                          if (field.dependsOn) {
                            const depValue = config[section.id][field.dependsOn.fieldId]
                            const depValues: FieldValue[] = Array.isArray(depValue) ? depValue : [depValue]
                            if (!field.dependsOn.values.some((v) => depValues.includes(v))) return null
                          }

                          const customKey = `${section.id}:${field.id}`
                          return (
                            <div key={field.id} className="space-y-1.5">
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
                        {isDetailed && (
                          <button
                            type="button"
                            onClick={() => handleSectionDetailToggle(section.id)}
                            className="w-full flex items-center justify-center gap-1 pt-2 text-xs text-muted-foreground hover:text-foreground transition-colors border-t border-border"
                          >
                            <ChevronUp className="h-3 w-3" />
                            閉じる
                          </button>
                        )}
                      </div>
                    )
                  })()}
                </div>
              ))}
            </div>
          </div>

          {/* Preview & Save Section */}
          <div className="space-y-4">
            <div className="lg:sticky lg:top-20 space-y-4">
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
                  className="h-96 font-mono text-xs"
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
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1"
                >
                  {isSaving ? '保存中...' : '保存'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
