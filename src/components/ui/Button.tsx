import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/ui/Spinner'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-200 cursor-pointer disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground shadow-[var(--shadow-sm)] hover:bg-primary/90',
        accent: 'bg-accent text-accent-foreground shadow-[var(--shadow-sm)] hover:bg-accent/90',
        outline: 'border border-border bg-background hover:bg-muted hover:border-primary/30',
        ghost: 'hover:bg-muted',
        destructive: 'bg-error text-error-foreground shadow-[var(--shadow-sm)] hover:bg-error/90',
      },
      size: {
        sm: 'h-8 px-3 rounded-[var(--radius-sm)]',
        md: 'h-10 px-4',
        lg: 'h-11 px-6 text-base rounded-[var(--radius-lg)]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Spinner className="h-4 w-4" />}
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
