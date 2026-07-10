import { Badge } from '@/components/ui/Badge'
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

export function StatusBadge({ status }: { status: ScrapeRunStatus }) {
  return <Badge variant={STATUS_VARIANT[status]}>{STATUS_LABEL[status]}</Badge>
}
