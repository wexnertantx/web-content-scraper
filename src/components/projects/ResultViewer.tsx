import { useState } from 'react'
import { Download } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { cn } from '@/lib/utils'
import { exportResult } from '@/utils/export'
import type { ExportFormat, ScrapedResult } from '@/types/types'

type ViewTab = 'json' | 'markdown'

export function ResultViewer({
  result,
  summary,
  fileBaseName,
}: {
  result: ScrapedResult
  summary: string | null
  fileBaseName: string
}) {
  const [tab, setTab] = useState<ViewTab>('json')
  const [exportError, setExportError] = useState<string | null>(null)

  function handleExport(format: ExportFormat) {
    setExportError(null)
    try {
      exportResult(format, {
        jsonData: result.jsonData,
        markdownData: result.markdownData,
        fileBaseName,
      })
    } catch (err) {
      setExportError(err instanceof Error ? err.message : 'Could not export the results.')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{result.title || 'Scrape Result'}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {result.summary && (
          <p className="-mt-2 text-sm text-muted-foreground">{result.summary}</p>
        )}

        {summary && (
          <div className="rounded-md border border-border bg-muted p-4 text-sm">
            <p className="mb-1 font-medium text-foreground">Summary</p>
            <p className="text-muted-foreground">{summary}</p>
          </div>
        )}

        {exportError && <Alert variant="error">{exportError}</Alert>}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-md border border-border p-1">
            <button
              type="button"
              onClick={() => setTab('json')}
              className={cn(
                'rounded-sm px-3 py-1.5 text-sm font-medium transition-colors',
                tab === 'json' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              JSON
            </button>
            <button
              type="button"
              onClick={() => setTab('markdown')}
              className={cn(
                'rounded-sm px-3 py-1.5 text-sm font-medium transition-colors',
                tab === 'markdown'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              Markdown
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
              <Download className="h-4 w-4" />
              CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('json')}>
              <Download className="h-4 w-4" />
              JSON
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('markdown')}>
              <Download className="h-4 w-4" />
              Markdown
            </Button>
          </div>
        </div>

        {tab === 'json' ? (
          <pre className="max-h-[28rem] overflow-auto rounded-md border border-border bg-muted p-4 text-xs">
            {JSON.stringify(result.jsonData ?? {}, null, 2)}
          </pre>
        ) : (
          <pre className="max-h-[28rem] overflow-auto whitespace-pre-wrap rounded-md border border-border bg-muted p-4 text-xs">
            {result.markdownData || 'No markdown content available.'}
          </pre>
        )}
      </CardContent>
    </Card>
  )
}
