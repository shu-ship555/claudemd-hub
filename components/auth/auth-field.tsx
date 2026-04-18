import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface AuthFieldProps {
  id: string
  label: string
  type: 'email' | 'password'
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  placeholder?: string
}

export function AuthField({
  id,
  label,
  type,
  value,
  onChange,
  disabled,
  placeholder,
}: AuthFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder ?? (type === 'email' ? 'your@email.com' : '••••••••')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required
      />
    </div>
  )
}
