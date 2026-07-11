import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { analyzeWebsiteFlow, runScrape, startCrawlFlow } from '@/services/scraping'
import { createProject } from '@/services/projects'
import type { ExtractionField, ScrapeMode, WebsiteAnalysis } from '@/types/types'
import { BASIC_CONTENT_FIELDS } from '@/utils/constants'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'
import { Alert } from '@/components/ui/Alert'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { ModeSelector } from '@/components/scrape/ModeSelector'
import { FieldEditor } from '@/components/scrape/FieldEditor'

type WizardStep = 'url' | 'configure' | 'running'

const ANALYZE_MESSAGES = [
  'Analyzing website...',
  'Detecting page type...',
  'Looking for structured data...',
  'Wrapping up the analysis...',
]

const RUN_MESSAGES = ['Extracting data...', 'Talking to Firecrawl...', 'Saving results...']
const CRAWL_START_MESSAGES = ['Starting the site crawl...', 'Discovering pages via the sitemap...']

const DEFAULT_CRAWL_LIMIT = 25
const MAX_CRAWL_LIMIT = 100

function useRotatingMessage(messages: string[], active: boolean, intervalMs = 2200): string {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!active) {
      setIndex(0)
      return
    }
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length)
    }, intervalMs)
    return () => clearInterval(id)
  }, [active, messages, intervalMs])

  return messages[index]
}

function normalizeUrl(input: string): string | null {
  const trimmed = input.trim()
  if (!trimmed) return null
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  try {
    const parsed = new URL(withScheme)
    if (!parsed.hostname.includes('.')) return null
    return parsed.toString()
  } catch {
    return null
  }
}

function defaultProjectName(url: string, pageType: string): string {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, '')
    return pageType ? `${hostname} - ${pageType}` : hostname
  } catch {
    return 'New Project'
  }
}

export function NewScrape() {
  const navigate = useNavigate()

  const [step, setStep] = useState<WizardStep>('url')

  // Step 1 state
  const [url, setUrl] = useState('')
  const [urlError, setUrlError] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzeError, setAnalyzeError] = useState<string | null>(null)

  // Analysis result + derived config
  const [normalizedUrl, setNormalizedUrl] = useState('')
  const [analysis, setAnalysis] = useState<WebsiteAnalysis | null>(null)
  const [mode, setMode] = useState<ScrapeMode>('basic')
  const [structuredFields, setStructuredFields] = useState<ExtractionField[]>([])
  const [entityType, setEntityType] = useState('')
  const [customPrompt, setCustomPrompt] = useState('')
  const [crawlLimit, setCrawlLimit] = useState(DEFAULT_CRAWL_LIMIT)
  const [projectName, setProjectName] = useState('')
  const [configError, setConfigError] = useState<string | null>(null)

  // Step 3 state
  const [projectId, setProjectId] = useState<string | null>(null)
  const [running, setRunning] = useState(false)
  const [runError, setRunError] = useState<string | null>(null)

  const analyzeMessage = useRotatingMessage(ANALYZE_MESSAGES, analyzing)
  const runMessage = useRotatingMessage(mode === 'crawl' ? CRAWL_START_MESSAGES : RUN_MESSAGES, running)

  async function handleAnalyze(e: FormEvent) {
    e.preventDefault()
    const normalized = normalizeUrl(url)
    if (!normalized) {
      setUrlError('Enter a valid website URL, e.g. example.com')
      return
    }

    setUrlError(null)
    setAnalyzeError(null)
    setAnalyzing(true)
    try {
      const result = await analyzeWebsiteFlow(normalized)
      setAnalysis(result)
      setNormalizedUrl(normalized)
      setMode(result.containsStructuredData ? 'structured' : 'basic')
      setStructuredFields(
        result.suggestions.length > 0
          ? result.suggestions.map((suggestion) => ({ name: suggestion, type: 'text' as const }))
          : [{ name: '', type: 'text' as const }],
      )
      setEntityType(result.entityType ?? '')
      setProjectName(defaultProjectName(normalized, result.pageType))
      setStep('configure')
    } catch (err) {
      setAnalyzeError(
        err instanceof Error ? err.message : 'Could not analyze this website. Please try again.',
      )
    } finally {
      setAnalyzing(false)
    }
  }

  function handleModeChange(nextMode: ScrapeMode) {
    setMode(nextMode)
    setConfigError(null)
  }

  async function executeRun(currentProjectId?: string) {
    setRunning(true)
    setRunError(null)
    try {
      let pid = currentProjectId ?? projectId
      if (!pid) {
        const project = await createProject(projectName.trim(), normalizedUrl)
        pid = project.id
        setProjectId(pid)
      }

      if (mode === 'crawl') {
        await startCrawlFlow({
          projectId: pid,
          url: normalizedUrl,
          limit: crawlLimit,
          entityType: entityType.trim() || undefined,
          fields: structuredFields.filter((field) => field.name.trim().length > 0),
        })
        // The crawl runs in the background; ProjectDetails polls it to completion.
        navigate(`/projects/${pid}`)
        return
      }

      const fieldsToSubmit: ExtractionField[] =
        mode === 'basic'
          ? BASIC_CONTENT_FIELDS
          : mode === 'structured'
            ? structuredFields.filter((field) => field.name.trim().length > 0)
            : []

      await runScrape({
        projectId: pid,
        url: normalizedUrl,
        mode,
        entityType: entityType.trim() || undefined,
        fields: fieldsToSubmit,
        customPrompt: mode === 'custom' ? customPrompt.trim() : undefined,
      })

      navigate(`/projects/${pid}`)
    } catch (err) {
      setRunError(err instanceof Error ? err.message : 'The scrape failed. Please try again.')
    } finally {
      setRunning(false)
    }
  }

  async function handleConfirm(e: FormEvent) {
    e.preventDefault()
    if (!projectName.trim()) {
      setConfigError('Give your project a name.')
      return
    }
    if (
      (mode === 'structured' || mode === 'crawl') &&
      structuredFields.filter((f) => f.name.trim()).length === 0
    ) {
      setConfigError('Add at least one field to extract.')
      return
    }
    if (mode === 'custom' && !customPrompt.trim()) {
      setConfigError('Describe what you want to extract.')
      return
    }
    if (mode === 'crawl' && (crawlLimit < 1 || crawlLimit > MAX_CRAWL_LIMIT)) {
      setConfigError(`Max pages must be between 1 and ${MAX_CRAWL_LIMIT}.`)
      return
    }

    setConfigError(null)
    setStep('running')
    await executeRun()
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">New Scrape</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Paste a URL, let AI analyze the page, then choose what to extract.
        </p>
      </div>

      {step === 'url' && (
        <Card>
          <form onSubmit={handleAnalyze}>
            <CardHeader>
              <CardTitle>Step 1 · Enter a URL</CardTitle>
              <CardDescription>Paste the link to the website you want to scrape.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {analyzeError && <Alert variant="error">{analyzeError}</Alert>}

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="url">Website URL</Label>
                <Input
                  id="url"
                  type="text"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={analyzing}
                  autoFocus
                />
                {urlError && <p className="text-sm text-error">{urlError}</p>}
              </div>

              {analyzing && (
                <div className="flex items-center gap-3 rounded-[var(--radius-md)] border border-border bg-muted px-4 py-3 text-sm text-muted-foreground">
                  <Spinner className="h-4 w-4 text-primary" />
                  <span>{analyzeMessage}</span>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" isLoading={analyzing} className="w-full sm:w-auto">
                Analyze Website
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {step === 'configure' && analysis && (
        <form onSubmit={handleConfirm} className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Step 2 · Review analysis</CardTitle>
              <CardDescription>{normalizedUrl}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                <Badge variant="primary">{analysis.pageType}</Badge>
                <Badge variant="default">{analysis.category}</Badge>
                {analysis.containsStructuredData && <Badge variant="success">Structured data detected</Badge>}
              </div>
              <p className="text-sm text-foreground">{analysis.summary}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Choose what to extract</CardTitle>
              <CardDescription>Pick a mode that fits what you need from this page.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <ModeSelector
                value={mode}
                onChange={handleModeChange}
                recommended={analysis.containsStructuredData ? 'structured' : undefined}
              />

              {mode === 'basic' && (
                <p className="text-sm text-muted-foreground">
                  Extracts title, meta description, headings, paragraphs, links, and images. No further
                  setup needed.
                </p>
              )}

              {(mode === 'structured' || mode === 'crawl') && (
                <div className="flex flex-col gap-4 rounded-[var(--radius-md)] border border-border bg-muted/30 p-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="entityType">Entity type</Label>
                    <Input
                      id="entityType"
                      value={entityType}
                      onChange={(e) => setEntityType(e.target.value)}
                      placeholder="e.g. product, article, listing"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label>Fields to extract</Label>
                    <FieldEditor fields={structuredFields} onChange={setStructuredFields} />
                  </div>
                  {mode === 'crawl' && (
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="crawlLimit">Max pages</Label>
                      <Input
                        id="crawlLimit"
                        type="number"
                        min={1}
                        max={MAX_CRAWL_LIMIT}
                        value={crawlLimit}
                        onChange={(e) => setCrawlLimit(Number(e.target.value))}
                        className="w-32"
                      />
                      <p className="text-xs text-muted-foreground">
                        Firecrawl will follow this site's sitemap and extract the same fields from up
                        to this many pages. Larger sites take longer and use more Firecrawl credits.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {mode === 'custom' && (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="customPrompt">Describe what to extract</Label>
                  <Textarea
                    id="customPrompt"
                    rows={4}
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="e.g. Extract all product prices and their names"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project name</CardTitle>
              <CardDescription>You can rename this later.</CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="My scrape project"
              />
            </CardContent>
          </Card>

          {configError && <Alert variant="error">{configError}</Alert>}

          <div className="flex items-center justify-between">
            <Button type="button" variant="ghost" onClick={() => setStep('url')}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button type="submit" variant="accent">
              {mode === 'crawl' ? 'Start Crawl' : 'Run Scrape'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </form>
      )}

      {step === 'running' && (
        <Card>
          <CardHeader>
            <CardTitle>Step 3 · Running your scrape</CardTitle>
            <CardDescription>{normalizedUrl}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {running && (
              <div className="flex items-center gap-3 rounded-[var(--radius-md)] border border-border bg-muted px-4 py-3 text-sm text-muted-foreground">
                <Spinner className="h-4 w-4 text-primary" />
                <span>{runMessage}</span>
              </div>
            )}
            {runError && <Alert variant="error">{runError}</Alert>}
          </CardContent>
          {runError && (
            <CardFooter className="flex items-center justify-between">
              <Button type="button" variant="ghost" onClick={() => setStep('configure')}>
                <ArrowLeft className="h-4 w-4" />
                Back to review
              </Button>
              <Button type="button" onClick={() => executeRun()} isLoading={running}>
                Retry
              </Button>
            </CardFooter>
          )}
        </Card>
      )}
    </div>
  )
}
