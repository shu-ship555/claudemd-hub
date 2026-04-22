import { cn } from '@/lib/utils'

const navLinkClass = 'text-xs leading-[120%] tracking-[0.04em] text-muted-foreground hover:text-foreground transition-colors duration-ui'

interface NavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
}

export function NavLink({ href, className, children, ...props }: NavLinkProps) {
  return (
    <a href={href} className={cn(navLinkClass, className)} {...props}>
      {children}
    </a>
  )
}
