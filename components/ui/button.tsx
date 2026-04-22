import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg text-sm leading-[120%] tracking-[0.04em] font-bold whitespace-nowrap transition-all duration-ui outline-none select-none focus-visible:ring-3 focus-visible:ring-ring active:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-[#3b65ce] focus-visible:border focus-visible:border-ring",
        outline:
          "border border-border bg-muted text-foreground hover:bg-secondary focus-visible:border-ring",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-accent focus-visible:border-ring",
        ghost:
          "hover:bg-muted hover:text-foreground focus-visible:border focus-visible:border-ring",
        destructive:
          "bg-muted text-destructive hover:bg-secondary focus-visible:border-destructive focus-visible:ring-destructive",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-2 px-2.5 py-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 py-1 text-xs leading-[120%] tracking-[0.04em] [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 py-1 text-xs leading-[120%] tracking-[0.04em] [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-2 px-2.5 py-2",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)]",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
