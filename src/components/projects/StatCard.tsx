import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

export function StatCard({
  label,
  value,
  icon: Icon,
  accentClassName,
}: {
  label: string
  value: number
  icon: LucideIcon
  accentClassName?: string
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-3xl font-semibold">{value}</p>
        </div>
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-md bg-muted', accentClassName)}>
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  )
}
