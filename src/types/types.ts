export interface AppUser {
  id: string
  email: string
  fullName: string
}

export type ScrapeMode = 'basic' | 'structured' | 'custom'

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

export type ScrapeRunStatus = 'pending' | 'running' | 'success' | 'failed'

export interface ScrapeRun {
  id: string
  projectId: string
  status: ScrapeRunStatus
  startedAt: string
  completedAt: string | null
  summary: string | null
}

export interface ScrapedResult {
  id: string
  runId: string
  jsonData: Record<string, unknown> | unknown[] | null
  markdownData: string | null
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
