'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { designTemplate, DesignConfig, FieldValue } from '@/lib/design-template'
import { generateDesignMarkdown } from '@/lib/generate-design'
import { createConfigFile } from './actions'
import { DashboardHeader } from '@/components/dashboard-header'

function buildInitialConfig(): DesignConfig {
  const initial: DesignConfig = {}
  for (const section of designTemplate) {
    initial[section.id] = { enabled: section.enabled }
    for (const field of section.fields) {
      if (field.type === 'multiselect') {
        initial[section.id][field.id] = field.default || []
      } else {
        initial[section.id][field.id] = field.default || ''
      }
    }
  }
  return initial
}

export default function DashboardPage() {
  const [config, setConfig] = useState<DesignConfig>(() => buildInitialConfig())
  const [preview, setPreview] = useState(() =>
    generateDesignMarkdown(buildInitialConfig()),
  )
  const [isSaving, setIsSaving] = useState(false)
  const [fileName, setFileName] = useState('DESIGN.md')
  const formScrollRef = useRef<HTMLDivElement>(null)
  const previewScrollRef = useRef<HTMLTextAreaElement>(null)
  const isSyncingRef = useRef(false)

  const handleToggleSection = (sectionId: string) => {
    const newConfig = {
      ...config,
      [sectionId]: {
        ...config[sectionId],
        enabled: !config[sectionId].enabled,
      },
    }
    setConfig(newConfig)
    setPreview(generateDesignMarkdown(newConfig))
  }

  const handleFieldChange = (
    sectionId: string,
    fieldId: string,
    value: FieldValue,
  ) => {
    const newConfig = {
      ...config,
      [sectionId]: {
        ...config[sectionId],
        [fieldId]: value,
      },
    }
    setConfig(newConfig)
    setPreview(generateDesignMarkdown(newConfig))
  }

  const handleDownload = () => {
    const element = document.createElement('a')
    const file = new Blob([preview], { type: 'text/markdown' })
    element.href = URL.createObjectURL(file)
    element.download = fileName
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
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

  const handleFormScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (isSyncingRef.current) return
    const target = e.currentTarget
    const scrollPercentage = target.scrollTop / (target.scrollHeight - target.clientHeight)

    if (previewScrollRef.current) {
      isSyncingRef.current = true
      previewScrollRef.current.scrollTop = scrollPercentage * (previewScrollRef.current.scrollHeight - previewScrollRef.current.clientHeight)
      isSyncingRef.current = false
    }
  }

  const handlePreviewScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (isSyncingRef.current) return
    const target = e.currentTarget
    const scrollPercentage = target.scrollTop / (target.scrollHeight - target.clientHeight)

    if (formScrollRef.current) {
      isSyncingRef.current = true
      formScrollRef.current.scrollTop = scrollPercentage * (formScrollRef.current.scrollHeight - formScrollRef.current.clientHeight)
      isSyncingRef.current = false
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
            onScroll={handleFormScroll}
          >
            <div className="space-y-6 pr-4">
              {designTemplate.map((section) => (
                <div
                  key={section.id}
                  className="space-y-4 p-4 border border-border rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">{section.label}</Label>
                    <Switch
                      checked={config[section.id]?.enabled || false}
                      onCheckedChange={() => handleToggleSection(section.id)}
                    />
                  </div>

                  {config[section.id]?.enabled && (
                    <div className="space-y-4 ml-2">
                      {section.fields.map((field) => {
                        // Check if this field should be displayed based on dependsOn
                        let shouldDisplay = true
                        if (field.dependsOn) {
                          const depValue = config[section.id][field.dependsOn.fieldId]
                          const depValues: FieldValue[] = Array.isArray(depValue)
                            ? depValue
                            : [depValue]
                          shouldDisplay = field.dependsOn.values.some((v) =>
                            depValues.includes(v),
                          )
                        }

                        if (!shouldDisplay) return null

                        return (
                        <div key={field.id} className="space-y-2">
                          <label className="text-sm font-medium">{field.label}</label>

                          {field.type === 'select' && (
                            <select
                              value={
                                (config[section.id][field.id] as string) ||
                                field.default ||
                                ''
                              }
                              onChange={(e) =>
                                handleFieldChange(section.id, field.id, e.target.value)
                              }
                              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                              {field.options.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          )}

                          {field.type === 'text' && (
                            <Input
                              placeholder={field.placeholder}
                              value={(config[section.id][field.id] as string) || ''}
                              onChange={(e) =>
                                handleFieldChange(section.id, field.id, e.target.value)
                              }
                            />
                          )}

                          {field.type === 'multiselect' && (
                            <div className="space-y-2">
                              {field.options.map((opt) => {
                                const current =
                                  (config[section.id][field.id] as string[]) || []
                                return (
                                  <div
                                    key={opt}
                                    className="flex items-center gap-2"
                                  >
                                    <Checkbox
                                      id={`${section.id}-${field.id}-${opt}`}
                                      checked={current.includes(opt)}
                                      onCheckedChange={(checked) => {
                                        const updated = checked
                                          ? [...current, opt]
                                          : current.filter((item) => item !== opt)
                                        handleFieldChange(section.id, field.id, updated)
                                      }}
                                    />
                                    <label
                                      htmlFor={`${section.id}-${field.id}-${opt}`}
                                      className="text-sm cursor-pointer"
                                    >
                                      {opt}
                                    </label>
                                  </div>
                                )
                              })}
                            </div>
                          )}

                          {field.type === 'number' && (
                            <Input
                              type="number"
                              min={field.min}
                              max={field.max}
                              step={field.step || 1}
                              value={(config[section.id][field.id] as number) || ''}
                              onChange={(e) =>
                                handleFieldChange(section.id, field.id, parseInt(e.target.value) || 0)
                              }
                            />
                          )}

                          {field.type === 'checkbox' && (
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id={`${section.id}-${field.id}`}
                                checked={
                                  (config[section.id][field.id] as boolean) || false
                                }
                                onCheckedChange={(checked) =>
                                  handleFieldChange(section.id, field.id, checked === true)
                                }
                              />
                              <label htmlFor={`${section.id}-${field.id}`} className="text-sm cursor-pointer">
                                {field.label}
                              </label>
                            </div>
                          )}
                        </div>
                        )
                      })}
                    </div>
                  )}
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
                  onScroll={handlePreviewScroll}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleDownload}
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
