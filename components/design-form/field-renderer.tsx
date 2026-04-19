'use client'

import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { DesignField, FieldValue } from '@/lib/design-template'
import { assembleColor, COLOR_PLACEHOLDERS, getRawColor } from '@/lib/color-utils'

interface FieldRendererProps {
  sectionId: string
  field: DesignField
  value: FieldValue
  onChange: (value: FieldValue) => void
  colorFormat?: string
  isCustomMode?: boolean
  onCustomModeChange?: (isCustom: boolean) => void
}

const SELECT_CLASS = 'w-full rounded-md border border-input bg-transparent dark:bg-input/30 px-3 py-2 text-sm'

export function FieldRenderer({
  sectionId,
  field,
  value,
  onChange,
  colorFormat = 'HEX',
  isCustomMode = false,
  onCustomModeChange,
}: FieldRendererProps) {
  if (field.type === 'select') {
    if (!field.allowCustom) {
      return (
        <select
          value={(value as string) || field.default || ''}
          onChange={(e) => onChange(e.target.value)}
          className={SELECT_CLASS}
        >
          {field.options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )
    }

    const currentValue = (value as string) || ''
    const selectValue = isCustomMode ? 'カスタム入力' : (currentValue || field.default || '')

    return (
      <div className="space-y-2">
        <select
          value={selectValue}
          onChange={(e) => {
            if (e.target.value === 'カスタム入力') {
              onCustomModeChange?.(true)
              onChange('')
            } else {
              onCustomModeChange?.(false)
              onChange(e.target.value)
            }
          }}
          className={SELECT_CLASS}
        >
          <option value="">選択してください</option>
          {field.options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
          <option value="カスタム入力">カスタム入力</option>
        </select>
        {isCustomMode && (
          <Input
            placeholder={field.customPlaceholder || ''}
            value={currentValue}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
      </div>
    )
  }

  if (field.type === 'text') {
    return (
      <Input
        placeholder={field.placeholder}
        value={(value as string) || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    )
  }

  if (field.type === 'number') {
    if (field.toggle) {
      const isEnabled = value !== '' && value !== undefined
      return (
        <div className="flex items-center gap-1.5">
          <Checkbox
            id={`${sectionId}-${field.id}-toggle`}
            checked={isEnabled}
            onCheckedChange={(checked) => onChange(checked ? field.default : '')}
          />
          <label htmlFor={`${sectionId}-${field.id}-toggle`} className="text-sm cursor-pointer select-none w-7">
            {field.label}
          </label>
          <Input
            type="number"
            min={field.min}
            max={field.max}
            step={field.step || 1}
            disabled={!isEnabled}
            value={isEnabled ? (value as number) : field.default}
            onChange={(e) => onChange(e.target.value === '' ? field.default : parseInt(e.target.value))}
            className="w-20 h-7 text-xs"
          />
        </div>
      )
    }

    return (
      <Input
        type="number"
        min={field.min}
        max={field.max}
        step={field.step || 1}
        placeholder={String(field.default)}
        value={value === '' || value === undefined ? '' : (value as number)}
        onChange={(e) => onChange(e.target.value === '' ? '' : parseInt(e.target.value))}
      />
    )
  }

  if (field.type === 'textarea') {
    return (
      <Textarea
        placeholder={field.placeholder}
        value={(value as string) || ''}
        rows={field.rows}
        onChange={(e) => onChange(e.target.value)}
      />
    )
  }

  if (field.type === 'checkbox') {
    return (
      <div className="flex items-center gap-2">
        <Checkbox
          id={`${sectionId}-${field.id}`}
          checked={(value as boolean) || false}
          onCheckedChange={(checked) => onChange(checked === true)}
        />
        <label htmlFor={`${sectionId}-${field.id}`} className="text-sm cursor-pointer">
          {field.label}
        </label>
      </div>
    )
  }

  if (field.type === 'multiselect') {
    const current = (value as string[]) || []
    return (
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {field.options.map((opt) => (
          <div key={opt} className="flex items-center gap-2">
            <Checkbox
              id={`${sectionId}-${field.id}-${opt}`}
              checked={current.includes(opt)}
              onCheckedChange={(checked) => {
                const updated = checked
                  ? [...current, opt]
                  : current.filter((item) => item !== opt)
                onChange(updated)
              }}
            />
            <label htmlFor={`${sectionId}-${field.id}-${opt}`} className="text-sm cursor-pointer">
              {opt}
            </label>
          </div>
        ))}
      </div>
    )
  }

  if (field.type === 'color') {
    const rawVal = getRawColor((value as string) || '', colorFormat)
    return (
      <Input
        placeholder={COLOR_PLACEHOLDERS[colorFormat] || ''}
        value={rawVal}
        onChange={(e) => onChange(assembleColor(colorFormat, e.target.value))}
        className="font-mono"
      />
    )
  }

  return null
}
