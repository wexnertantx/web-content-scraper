export interface AppUser {
  id: string
  email: string
  fullName: string
}

export type ScrapeMode = 'basic' | 'structured' | 'custom' | 'crawl'

export type ExtractionFieldType =
  | 'text'
  | 'email'
  | 'url'
  | 'number'
  | 'price'
  | 'image'
  | 'date'

export interface ExtractionField {
  name: string
  type: ExtractionFieldType
}

export interface WebsiteAnalysis {
  pageType: string
  category: string
  purpose: string
  targetAudience: string
  containsStructuredData: boolean
  entityType?: string
  summary: string
  suggestions: string[]
  markdown: string
}

export interface Project {
  id: string
  userId: string
  projectName: string
  websiteUrl: string
  createdAt: string
  updatedAt: string
}

export type ScrapeRunStatus = 'pending' | 'running' | 'crawling' | 'success' | 'failed'

export interface ScrapeRun {
  id: string
  projectId: string
  status: ScrapeRunStatus
  startedAt: string
  completedAt: string | null
  summary: string | null
  crawlJobId: string | null
}

export interface CrawlPage {
  url: string
  data: unknown
  markdown: string
  title: string
}

export interface CrawlStatusResult {
  status: 'scraping' | 'completed' | 'failed' | 'cancelled'
  total: number
  completed: number
  pages?: CrawlPage[]
}

export interface ScrapedResult {
  id: string
  runId: string
  jsonData: Record<string, unknown> | unknown[] | null
  markdownData: string | null
  title: string | null
  summary: string | null
  createdAt: string
}

export interface ProjectWithLatestRun extends Project {
  latestRun: ScrapeRun | null
}

export interface DashboardStats {
  totalProjects: number
  totalScrapes: number
  successfulScrapes: number
  failedScrapes: number
}

export type ExportFormat = 'csv' | 'json' | 'markdown'
