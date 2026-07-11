import { checkCrawlStatus, extractStructuredData, scrapeWebsite, startCrawl } from '@/services/firecrawl'
import { analyzeWebsite, convertPromptToFields } from '@/services/openai'
import {
  completeScrapeRun,
  createCrawlRun,
  createScrapeRun,
  getScrapedResult,
  saveScrapedResult,
} from '@/services/projects'
import type {
  CrawlStatusResult,
  ExtractionField,
  ScrapeMode,
  ScrapeRun,
  ScrapedResult,
  WebsiteAnalysis,
} from '@/types/types'

export async function analyzeWebsiteFlow(url: string): Promise<WebsiteAnalysis> {
  const page = await scrapeWebsite(url)
  return analyzeWebsite(url, page.markdown)
}

export interface RunScrapeInput {
  projectId: string
  url: string
  mode: ScrapeMode
  entityType?: string
  fields: ExtractionField[]
  customPrompt?: string
}

export async function runScrape(input: RunScrapeInput): Promise<ScrapedResult> {
  const run = await createScrapeRun(input.projectId)

  try {
    const fields =
      input.mode === 'custom' && input.customPrompt
        ? await convertPromptToFields(input.customPrompt)
        : input.fields

    const [page, jsonData] = await Promise.all([
      scrapeWebsite(input.url),
      extractStructuredData({ url: input.url, entityType: input.entityType, fields }),
    ])

    const result = await saveScrapedResult(run.id, jsonData, page.markdown, {
      title: page.title,
      summary: page.description,
    })
    await completeScrapeRun(run.id, 'success', `Extracted ${fields.length} field(s) from ${input.url}.`)
    return result
  } catch (err) {
    await completeScrapeRun(run.id, 'failed', err instanceof Error ? err.message : 'Scrape failed.')
    throw err
  }
}

export interface StartCrawlFlowInput {
  projectId: string
  url: string
  limit: number
  entityType?: string
  fields: ExtractionField[]
}

// Kicks off an async Firecrawl crawl job and records it as a 'crawling' run.
// The caller (ProjectDetails) polls pollCrawl() until it reaches a terminal state.
export async function startCrawlFlow(input: StartCrawlFlowInput): Promise<ScrapeRun> {
  const jobId = await startCrawl({
    url: input.url,
    limit: input.limit,
    entityType: input.entityType,
    fields: input.fields,
  })
  return createCrawlRun(input.projectId, jobId)
}

function flattenCrawlPages(pages: CrawlStatusResult['pages']): Record<string, unknown>[] {
  return (pages ?? []).map((page) => ({
    sourceUrl: page.url,
    ...(page.data && typeof page.data === 'object' ? (page.data as Record<string, unknown>) : {}),
  }))
}

function combineCrawlMarkdown(pages: CrawlStatusResult['pages']): string {
  return (pages ?? []).map((page) => `## ${page.url}\n\n${page.markdown}`).join('\n\n---\n\n')
}

// Checks an in-progress crawl job and, once it reaches a terminal state, saves
// the result and marks the run success/failed. Safe to call repeatedly while polling.
export async function pollCrawl(run: ScrapeRun): Promise<CrawlStatusResult> {
  if (!run.crawlJobId) throw new Error('This run has no crawl job to check.')
  const status = await checkCrawlStatus(run.crawlJobId)

  if (run.status !== 'crawling') return status

  if (status.status === 'completed') {
    const existing = await getScrapedResult(run.id)
    if (!existing) {
      const rows = flattenCrawlPages(status.pages)
      await saveScrapedResult(run.id, rows, combineCrawlMarkdown(status.pages), {
        title: status.pages?.[0]?.title,
      })
      await completeScrapeRun(run.id, 'success', `Crawled ${rows.length} page(s) from this site.`)
    }
  } else if (status.status === 'failed' || status.status === 'cancelled') {
    await completeScrapeRun(run.id, 'failed', 'The site crawl failed or was cancelled.')
  }

  return status
}
