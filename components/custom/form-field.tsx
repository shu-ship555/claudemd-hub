import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface FormFieldProps {
  id: string
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  placeholder?: string
  required?: boolean
}

export function FormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  disabled = false,
  placeholder,
  required = false,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        required={required}
      />
    </div>
  )
}
