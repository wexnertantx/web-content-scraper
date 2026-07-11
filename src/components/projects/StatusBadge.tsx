import { CheckCircle2, CircleDashed, Loader2, XCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import type { ScrapeRunStatus } from '@/types/types'

const STATUS_LABEL: Record<ScrapeRunStatus, string> = {
  pending: 'Pending',
  running: 'Running',
  crawling: 'Crawling',
  success: 'Success',
  failed: 'Failed',
}

const STATUS_VARIANT: Record<ScrapeRunStatus, 'default' | 'success' | 'error' | 'primary'> = {
  pending: 'default',
  running: 'primary',
  crawling: 'primary',
  success: 'success',
  failed: 'error',
}

const STATUS_ICON: Record<ScrapeRunStatus, LucideIcon> = {
  pending: CircleDashed,
  running: Loader2,
  crawling: Loader2,
  success: CheckCircle2,
  failed: XCircle,
}

export function StatusBadge({ status }: { status: ScrapeRunStatus }) {
  const Icon = STATUS_ICON[status]
  const spinning = status === 'running' || status === 'crawling'
  return (
    <Badge variant={STATUS_VARIANT[status]} className="gap-1">
      <Icon className={cn('h-3 w-3', spinning && 'animate-spin')} />
      {STATUS_LABEL[status]}
    </Badge>
  )
}
