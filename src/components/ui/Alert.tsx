import { type HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const alertVariants = cva('rounded-[var(--radius-md)] border px-4 py-3 text-sm', {
  variants: {
    variant: {
      error: 'border-error/20 bg-error/5 text-error',
      success: 'border-success/20 bg-success/5 text-success',
      info: 'border-border bg-muted text-muted-foreground',
    },
  },
  defaultVariants: {
    variant: 'info',
  },
})

export interface AlertProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

export function Alert({ className, variant, ...props }: AlertProps) {
  return <div role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
}
