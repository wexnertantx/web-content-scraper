import { scrapeWebsite, extractStructuredData } from '@/services/firecrawl'
import { analyzeWebsite, convertPromptToFields } from '@/services/openai'
import {
  completeScrapeRun,
  createScrapeRun,
  saveScrapedResult,
} from '@/services/projects'
import type { ExtractionField, ScrapeMode, ScrapedResult, WebsiteAnalysis } from '@/types/types'

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

    const result = await saveScrapedResult(run.id, jsonData, page.markdown)
    await completeScrapeRun(run.id, 'success', `Extracted ${fields.length} field(s) from ${input.url}.`)
    return result
  } catch (err) {
    await completeScrapeRun(run.id, 'failed', err instanceof Error ? err.message : 'Scrape failed.')
    throw err
  }
}
