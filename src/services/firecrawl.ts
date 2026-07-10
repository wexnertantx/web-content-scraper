import { supabase } from '@/services/supabase'
import type { ExtractionField } from '@/types/types'

export interface ScrapedPage {
  markdown: string
  title: string
  description: string
}

export async function scrapeWebsite(url: string): Promise<ScrapedPage> {
  const { data, error } = await supabase.functions.invoke('firecrawl-scrape', {
    body: { url },
  })

  if (error) {
    throw new Error('Could not load this website. Please check the URL and try again.')
  }

  return data as ScrapedPage
}

export interface ExtractInput {
  url: string
  entityType?: string
  fields: ExtractionField[]
}

export async function extractStructuredData(input: ExtractInput): Promise<unknown> {
  const { data, error } = await supabase.functions.invoke('firecrawl-extract', {
    body: input,
  })

  if (error) {
    throw new Error('Extraction failed. The website may be unavailable or blocking access.')
  }

  return (data as { jsonData: unknown }).jsonData
}
