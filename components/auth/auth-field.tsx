import { FormField } from '@/components/custom/form-field'

interface AuthFieldProps {
  id: string
  label: string
  type: 'email' | 'password'
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  placeholder?: string
}

export function AuthField({ type, placeholder, ...props }: AuthFieldProps) {
  return (
    <FormField
      {...props}
      type={type}
      placeholder={placeholder ?? (type === 'email' ? 'your@email.com' : '••••••••')}
      required
    />
  )
}
