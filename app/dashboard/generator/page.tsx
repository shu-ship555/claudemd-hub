'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { designTemplate, DesignConfig, DesignField, FieldValue, MultiSelectField } from '@/lib/design-template'
import { generateDesignMarkdown } from '@/lib/generate-design'
import { createConfigFile } from '../actions'

function shouldShowField(field: DesignField, config: DesignConfig, sectionId: string): boolean {
  if (!field.dependsOn) return true

  const { fieldId, values } = field.dependsOn
  const dependsOnValue = config[sectionId]?.[fieldId]

  return values.some((v) => v === dependsOnValue)
}

function getFieldOptions(
  field: DesignField,
  config: DesignConfig,
  sectionId: string,
): string[] {
  if (field.type !== 'select' && field.type !== 'multiselect') return []
  const base = field.options
  if (!field.optionsIf) return base

  const parentSectionId = field.optionsIf.sectionId ?? sectionId
  const parentValue = config[parentSectionId]?.[field.optionsIf.fieldId]
  const allowed = field.optionsIf.map[parentValue as string]
  if (!allowed || allowed.length === 0) return base
  return base.filter((opt) => allowed.includes(opt))
}

function normalizeConfig(config: DesignConfig): DesignConfig {
  const hydrated: DesignConfig = {}
  for (const section of designTemplate) {
    const existing = config[section.id] || {}
    hydrated[section.id] = { ...existing }
    if (hydrated[section.id].enabled === undefined) {
      hydrated[section.id].enabled = section.enabled
    }
    for (const field of section.fields) {
      if (hydrated[section.id][field.id] === undefined) {
        if (field.type === 'multiselect') {
          hydrated[section.id][field.id] = (field as MultiSelectField).default ?? []
        } else {
          hydrated[section.id][field.id] = field.default ?? ''
        }
      }
    }
  }
  let outer = hydrated
  let changed = true
  let safety = 10
  while (changed && safety-- > 0) {
    changed = false
    const next: DesignConfig = { ...outer }
    for (const section of designTemplate) {
      const sectionCfg = next[section.id]
      if (!sectionCfg) continue
      let sectionChanged = false
      const updatedSection = { ...sectionCfg }
      for (const field of section.fields) {
        if (field.type !== 'select' && field.type !== 'multiselect') continue
        if (!field.optionsIf) continue
        const parentSectionId = field.optionsIf.sectionId ?? section.id
        const parentValue =
          parentSectionId === section.id
            ? updatedSection[field.optionsIf.fieldId]
            : next[parentSectionId]?.[field.optionsIf.fieldId]
        const allowed = field.optionsIf.map[parentValue as string]
        if (!allowed) continue
        const current = updatedSection[field.id]
        if (field.type === 'select') {
          if (typeof current !== 'string' || !allowed.includes(current)) {
            updatedSection[field.id] = allowed[0]
            sectionChanged = true
          }
        } else {
          const arr: string[] = Array.isArray(current) ? current : []
          const filtered = arr.filter((v) => allowed.includes(v))
          if (filtered.length !== arr.length) {
            updatedSection[field.id] = filtered
            sectionChanged = true
          }
        }
      }
      if (sectionChanged) {
        next[section.id] = updatedSection
        changed = true
      }
    }
    if (changed) outer = next
  }
  return outer
}

export default function GeneratorPage() {
  const [config, setConfig] = useState<DesignConfig>(() => {
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
    return normalizeConfig(initial)
  })

  const [preview, setPreview] = useState(generateDesignMarkdown(config))
  const [isSaving, setIsSaving] = useState(false)
  const [fileName, setFileName] = useState('DESIGN.md')

  const handleToggleSection = (sectionId: string) => {
    const draft = {
      ...config,
      [sectionId]: {
        ...config[sectionId],
        enabled: !config[sectionId]?.enabled,
      },
    }
    const newConfig = normalizeConfig(draft)
    setConfig(newConfig)
    setPreview(generateDesignMarkdown(newConfig))
  }

  const handleFieldChange = (
    sectionId: string,
    fieldId: string,
    value: FieldValue,
  ) => {
    const draft = {
      ...config,
      [sectionId]: {
        ...config[sectionId],
        [fieldId]: value,
      },
    }
    const newConfig = normalizeConfig(draft)
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">DESIGN.md ジェネレーター</h1>
          <p className="text-sm text-muted-foreground mt-1">
            カスタム設計ガイドラインを生成します
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Form Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>セクション設定</CardTitle>
                <CardDescription>
                  有効にしたいセクションを選択し、値を設定してください
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {designTemplate.map((section) => (
                  <div key={section.id} className="space-y-4 pb-6 border-b last:border-0 last:pb-0">
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
                          if (!shouldShowField(field, config, section.id)) return null

                          return (
                            <div key={field.id} className="space-y-2">
                              <label className="text-sm font-medium">
                                {field.label}
                                {field.requirement === 'required' && (
                                  <span className="text-red-500 ml-1">*</span>
                                )}
                              </label>

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
                                  {getFieldOptions(field, config, section.id).map((opt) => (
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

                              {field.type === 'number' && (
                                <Input
                                  type="number"
                                  min={field.min}
                                  max={field.max}
                                  step={field.step}
                                  value={
                                    (config[section.id][field.id] as number) ??
                                    field.default
                                  }
                                  onChange={(e) =>
                                    handleFieldChange(section.id, field.id, Number(e.target.value))
                                  }
                                />
                              )}

                              {field.type === 'checkbox' && (
                                <div className="flex items-center gap-2">
                                  <Checkbox
                                    id={`${section.id}-${field.id}`}
                                    checked={
                                      (config[section.id][field.id] as boolean) ??
                                      field.default
                                    }
                                    onCheckedChange={(checked) =>
                                      handleFieldChange(section.id, field.id, checked === true)
                                    }
                                  />
                                  <label
                                    htmlFor={`${section.id}-${field.id}`}
                                    className="text-sm cursor-pointer"
                                  >
                                    チェックして有効化
                                  </label>
                                </div>
                              )}

                              {field.type === 'textarea' && (
                                <Textarea
                                  placeholder={field.placeholder}
                                  value={(config[section.id][field.id] as string) ?? ''}
                                  onChange={(e) =>
                                    handleFieldChange(section.id, field.id, e.target.value)
                                  }
                                  className="font-mono text-xs min-h-64"
                                />
                              )}

                              {field.type === 'multiselect' && (
                                <div className="space-y-2">
                                  {getFieldOptions(field, config, section.id).map((opt) => {
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
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Preview & Save Section */}
          <div className="space-y-6">
            <Card className="lg:sticky lg:top-6">
              <CardHeader>
                <CardTitle>プレビュー</CardTitle>
                <CardDescription>生成される DESIGN.md</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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

                <Textarea
                  value={preview}
                  readOnly
                  className="h-96 font-mono text-xs"
                />

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
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
