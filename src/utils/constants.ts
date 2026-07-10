import type { ExtractionField } from '@/types/types'

// Mode 1 (Basic Content) always extracts this fixed set of fields. Used both
// for the New Scrape "Basic Content" mode and for one-click re-runs, since
// re-runs don't currently persist the original field selection (see IDEAS.md).
export const BASIC_CONTENT_FIELDS: ExtractionField[] = [
  { name: 'Title', type: 'text' },
  { name: 'Meta Description', type: 'text' },
  { name: 'Headings', type: 'text' },
  { name: 'Paragraphs', type: 'text' },
  { name: 'Links', type: 'url' },
  { name: 'Images', type: 'image' },
]
