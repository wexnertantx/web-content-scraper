import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ExternalLink, RefreshCw, Trash2 } from 'lucide-react'
import { deleteProject, getProject, getScrapedResult, listScrapeRuns } from '@/services/projects'
import { pollCrawl, runScrape } from '@/services/scraping'
import { BASIC_CONTENT_FIELDS } from '@/utils/constants'
import type { CrawlStatusResult, Project, ScrapeRun, ScrapedResult } from '@/types/types'
import { StatusBadge } from '@/components/projects/StatusBadge'
import { ResultViewer } from '@/components/projects/ResultViewer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { Spinner } from '@/components/ui/Spinner'
import { cn } from '@/lib/utils'

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function ProjectDetails() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()

  const [project, setProject] = useState<Project | null>(null)
  const [runs, setRuns] = useState<ScrapeRun[]>([])
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null)
  const [result, setResult] = useState<ScrapedResult | null>(null)
  const [crawlStatus, setCrawlStatus] = useState<CrawlStatusResult | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingResult, setIsLoadingResult] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [isRerunning, setIsRerunning] = useState(false)
  const [rerunError, setRerunError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const loadProjectAndRuns = useCallback(async () => {
    if (!projectId) return
    setIsLoading(true)
    setError(null)
    try {
      const foundProject = await getProject(projectId)
      if (!foundProject) {
        navigate('/projects', { replace: true })
        return
      }
      setProject(foundProject)
      const runList = await listScrapeRuns(projectId)
      setRuns(runList)
      setSelectedRunId((current) => current ?? runList[0]?.id ?? null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load this project. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [projectId, navigate])

  useEffect(() => {
    void loadProjectAndRuns()
  }, [loadProjectAndRuns])

  useEffect(() => {
    if (!selectedRunId) {
      setResult(null)
      return
    }
    let cancelled = false
    async function loadResult(runId: string) {
      setIsLoadingResult(true)
      setError(null)
      try {
        const foundResult = await getScrapedResult(runId)
        if (!cancelled) setResult(foundResult)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Could not load the scrape result.')
      } finally {
        if (!cancelled) setIsLoadingResult(false)
      }
    }
    void loadResult(selectedRunId)
    return () => {
      cancelled = true
    }
  }, [selectedRunId])

  // While the selected run is an in-progress site crawl, poll Firecrawl for
  // progress and finalize (save + mark success/failed) once it terminates.
  useEffect(() => {
    const run = runs.find((r) => r.id === selectedRunId)
    if (!run || run.status !== 'crawling') {
      setCrawlStatus(null)
      return
    }

    let cancelled = false

    async function poll() {
      try {
        const status = await pollCrawl(run!)
        if (cancelled) return
        setCrawlStatus(status)
        if (status.status === 'completed' || status.status === 'failed' || status.status === 'cancelled') {
          // Refresh just the run list + result in place, without the
          // full-page loading spinner loadProjectAndRuns() would trigger.
          const [runList, refreshedResult] = await Promise.all([
            listScrapeRuns(run!.projectId),
            getScrapedResult(run!.id),
          ])
          if (cancelled) return
          setRuns(runList)
          setResult(refreshedResult)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Could not check crawl status.')
        }
      }
    }

    void poll()
    const interval = setInterval(poll, 4000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [selectedRunId, runs, loadProjectAndRuns])

  async function handleRerun() {
    if (!project) return
    setIsRerunning(true)
    setRerunError(null)
    try {
      await runScrape({
        projectId: project.id,
        url: project.websiteUrl,
        mode: 'basic',
        fields: BASIC_CONTENT_FIELDS,
      })
      const runList = await listScrapeRuns(project.id)
      setRuns(runList)
      setSelectedRunId(runList[0]?.id ?? null)
    } catch (err) {
      setRerunError(err instanceof Error ? err.message : 'The scrape failed. Please try again.')
    } finally {
      setIsRerunning(false)
    }
  }

  async function handleDelete() {
    if (!project) return
    const confirmed = window.confirm(`Delete project "${project.projectName}"? This cannot be undone.`)
    if (!confirmed) return

    setDeleteError(null)
    setIsDeleting(true)
    try {
      await deleteProject(project.id)
      navigate('/projects')
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Could not delete the project. Please try again.')
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner className="h-8 w-8 text-muted-foreground" />
      </div>
    )
  }

  if (!project) {
    return <Alert variant="error">{error ?? 'This project could not be found.'}</Alert>
  }

  const selectedRun = runs.find((run) => run.id === selectedRunId)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold">{project.projectName}</h1>
          <a
            href={project.websiteUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-1 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            {project.websiteUrl}
          </a>
          <p className="mt-1 text-xs text-muted-foreground">Created {formatDateTime(project.createdAt)}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" onClick={handleRerun} isLoading={isRerunning}>
            <RefreshCw className="h-4 w-4" />
            Re-run Scrape
          </Button>
          <Button variant="destructive" onClick={handleDelete} isLoading={isDeleting}>
            <Trash2 className="h-4 w-4" />
            Delete Project
          </Button>
        </div>
      </div>

      {error && <Alert variant="error">{error}</Alert>}
      {rerunError && <Alert variant="error">{rerunError}</Alert>}
      {deleteError && <Alert variant="error">{deleteError}</Alert>}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">Run History</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 p-3 pt-0">
            {runs.length === 0 ? (
              <p className="px-2 py-4 text-sm text-muted-foreground">No scrape runs yet.</p>
            ) : (
              runs.map((run) => (
                <button
                  key={run.id}
                  type="button"
                  onClick={() => setSelectedRunId(run.id)}
                  className={cn(
                    'flex flex-col gap-1 rounded-md border px-3 py-2 text-left text-sm transition-colors',
                    run.id === selectedRunId
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted',
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">{formatDateTime(run.startedAt)}</span>
                    <StatusBadge status={run.status} />
                  </div>
                  {run.summary && <span className="truncate text-xs text-muted-foreground">{run.summary}</span>}
                </button>
              ))
            )}
          </CardContent>
        </Card>

        <div>
          {isLoadingResult ? (
            <div className="flex items-center justify-center py-24">
              <Spinner className="h-8 w-8 text-muted-foreground" />
            </div>
          ) : !selectedRunId ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Run a scrape to see results here.
              </CardContent>
            </Card>
          ) : selectedRun?.status === 'crawling' ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                <Spinner className="h-6 w-6 text-primary" />
                <p className="text-muted-foreground">
                  {crawlStatus
                    ? `Crawled ${crawlStatus.completed} of ${crawlStatus.total || '?'} page(s)...`
                    : 'Starting the crawl...'}
                </p>
                <p className="text-xs text-muted-foreground">
                  This runs in the background — feel free to leave this page and come back later.
                </p>
              </CardContent>
            </Card>
          ) : !result ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No results are available for this run yet.
              </CardContent>
            </Card>
          ) : (
            <ResultViewer
              result={result}
              summary={selectedRun?.summary ?? null}
              fileBaseName={project.projectName.trim().replace(/\s+/g, '-').toLowerCase() || 'scrape-result'}
            />
          )}
        </div>
      </div>
    </div>
  )
}
