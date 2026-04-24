'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const base = 'text-xs leading-[120%] tracking-[0.04em] transition-colors duration-ui'
const inactive = 'text-muted-foreground hover:text-foreground'
const active = 'text-primary font-medium border-b border-primary pb-px'

interface NavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  noActive?: boolean
}

export function NavLink({ href, className, children, noActive, ...props }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = !noActive && pathname === href
  const isExternal = href.startsWith('http')

  if (isExternal) {
    return (
      <a href={href} className={cn(base, inactive, className)} {...props}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={cn(base, isActive ? active : inactive, className)} {...props}>
      {children}
    </Link>
  )
}
