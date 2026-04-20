import { Button, type buttonVariants } from '@/components/ui/button'
import { type VariantProps } from 'class-variance-authority'

interface LoadingButtonProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Button>, 'children'>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  loadingText?: string
  children: React.ReactNode
}

export function LoadingButton({
  isLoading = false,
  loadingText = '処理中...',
  children,
  disabled = false,
  ...props
}: LoadingButtonProps & { [key: string]: unknown }) {
  return (
    <Button disabled={isLoading || disabled} {...(props as React.ComponentPropsWithoutRef<typeof Button>)}>
      {isLoading ? loadingText : children}
    </Button>
  )
}
