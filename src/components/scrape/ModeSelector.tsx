import { FileText, Globe, Sparkles, Table } from 'lucide-react'
import type { ScrapeMode } from '@/types/types'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

const MODE_OPTIONS: {
  mode: ScrapeMode
  title: string
  description: string
  icon: typeof FileText
}[] = [
  {
    mode: 'basic',
    title: 'Basic Content',
    description: 'Title, meta description, headings, paragraphs, links, and images.',
    icon: FileText,
  },
  {
    mode: 'structured',
    title: 'Structured Data',
    description: 'Pick named fields to extract, like product name, price, or SKU.',
    icon: Table,
  },
  {
    mode: 'custom',
    title: 'Custom Prompt',
    description: 'Describe what to extract in plain English.',
    icon: Sparkles,
  },
  {
    mode: 'crawl',
    title: 'Site Crawl (sitemap)',
    description: 'Follow the sitemap and extract the same fields from every page found. Runs in the background.',
    icon: Globe,
  },
]

interface ModeSelectorProps {
  value: ScrapeMode
  onChange: (mode: ScrapeMode) => void
  recommended?: ScrapeMode
}

export function ModeSelector({ value, onChange, recommended }: ModeSelectorProps) {
  return (
    <div role="radiogroup" aria-label="Extraction mode" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {MODE_OPTIONS.map(({ mode, title, description, icon: Icon }) => {
        const selected = value === mode
        return (
          <Card
            key={mode}
            role="radio"
            aria-checked={selected}
            tabIndex={0}
            onClick={() => onChange(mode)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onChange(mode)
              }
            }}
            className={cn(
              'cursor-pointer transition-colors hover:border-primary/50',
              selected && 'border-primary ring-2 ring-primary/20',
            )}
          >
            <CardContent className="flex flex-col gap-2 p-4">
              <div className="flex items-center justify-between">
                <Icon className="h-5 w-5 text-primary" />
                {mode === recommended && <Badge variant="accent">Recommended</Badge>}
              </div>
              <p className="font-medium text-foreground">{title}</p>
              <p className="text-sm text-muted-foreground">{description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
