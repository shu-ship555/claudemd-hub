'use client'

import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { DesignField } from '@/lib/design-template'

interface FieldRendererProps {
  sectionId: string
  field: DesignField
  value: unknown
  onChange: (value: unknown) => void
}

export function FieldRenderer({ sectionId, field, value, onChange }: FieldRendererProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{field.label}</label>

      {field.type === 'select' && (
        <select
          value={(value as string) || field.default || ''}
          onChange={(e) => onChange(e.target.value)}
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
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {field.type === 'number' && (
        <Input
          type="number"
          min={field.min}
          max={field.max}
          step={field.step || 1}
          value={(value as number) || ''}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        />
      )}

      {field.type === 'checkbox' && (
        <div className="flex items-center gap-2">
          <Checkbox
            id={`${sectionId}-${field.id}`}
            checked={(value as boolean) || false}
            onCheckedChange={(checked) => onChange(checked)}
          />
          <label htmlFor={`${sectionId}-${field.id}`} className="text-sm cursor-pointer">
            {field.label}
          </label>
        </div>
      )}

      {field.type === 'textarea' && (
        <Textarea
          placeholder={field.placeholder}
          value={(value as string) || ''}
          rows={field.rows}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {field.type === 'multiselect' && (
        <div className="space-y-2">
          {field.options.map((opt) => {
            const current = (value as string[]) || []
            const checked = current.includes(opt)
            return (
              <div key={opt} className="flex items-center gap-2">
                <Checkbox
                  id={`${sectionId}-${field.id}-${opt}`}
                  checked={checked}
                  onCheckedChange={(isChecked) => {
                    const updated = isChecked
                      ? [...current, opt]
                      : current.filter((item) => item !== opt)
                    onChange(updated)
                  }}
                />
                <label
                  htmlFor={`${sectionId}-${field.id}-${opt}`}
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
}
