import { supabase } from '@/services/supabase'
import type {
  DashboardStats,
  Project,
  ProjectWithLatestRun,
  ScrapeRun,
  ScrapeRunStatus,
  ScrapedResult,
} from '@/types/types'

interface ProjectRow {
  id: string
  user_id: string
  project_name: string
  website_url: string
  created_at: string
  updated_at: string
}

interface ScrapeRunRow {
  id: string
  project_id: string
  status: ScrapeRunStatus
  started_at: string
  completed_at: string | null
  summary: string | null
  crawl_job_id: string | null
}

interface ScrapedResultRow {
  id: string
  run_id: string
  json_data: unknown
  markdown_data: string | null
  created_at: string
}

function mapProject(row: ProjectRow): Project {
  return {
    id: row.id,
    userId: row.user_id,
    projectName: row.project_name,
    websiteUrl: row.website_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapRun(row: ScrapeRunRow): ScrapeRun {
  return {
    id: row.id,
    projectId: row.project_id,
    status: row.status,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    summary: row.summary,
    crawlJobId: row.crawl_job_id,
  }
}

function mapResult(row: ScrapedResultRow): ScrapedResult {
  return {
    id: row.id,
    runId: row.run_id,
    jsonData: row.json_data as ScrapedResult['jsonData'],
    markdownData: row.markdown_data,
    createdAt: row.created_at,
  }
}

async function requireUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) throw new Error('You must be signed in.')
  return data.user.id
}

export async function createProject(projectName: string, websiteUrl: string): Promise<Project> {
  const userId = await requireUserId()

  const { data, error } = await supabase
    .from('projects')
    .insert({ project_name: projectName, website_url: websiteUrl, user_id: userId })
    .select()
    .single()

  if (error || !data) throw new Error('Could not create the project. Please try again.')
  return mapProject(data as ProjectRow)
}

export async function listProjectsWithLatestRun(): Promise<ProjectWithLatestRun[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*, scrape_runs(*)')
    .order('updated_at', { ascending: false })

  if (error) throw new Error('Could not load your projects. Please try again.')

  return ((data ?? []) as (ProjectRow & { scrape_runs: ScrapeRunRow[] })[]).map((row) => {
    const runs = [...(row.scrape_runs ?? [])].sort(
      (a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime(),
    )
    return { ...mapProject(row), latestRun: runs[0] ? mapRun(runs[0]) : null }
  })
}

export async function getProject(projectId: string): Promise<Project | null> {
  const { data, error } = await supabase.from('projects').select('*').eq('id', projectId).maybeSingle()
  if (error) throw new Error('Could not load this project. Please try again.')
  return data ? mapProject(data as ProjectRow) : null
}

export async function deleteProject(projectId: string): Promise<void> {
  const { error } = await supabase.from('projects').delete().eq('id', projectId)
  if (error) throw new Error('Could not delete the project. Please try again.')
}

export async function listScrapeRuns(projectId: string): Promise<ScrapeRun[]> {
  const { data, error } = await supabase
    .from('scrape_runs')
    .select('*')
    .eq('project_id', projectId)
    .order('started_at', { ascending: false })

  if (error) throw new Error('Could not load scrape history. Please try again.')
  return ((data ?? []) as ScrapeRunRow[]).map(mapRun)
}

export async function createScrapeRun(projectId: string): Promise<ScrapeRun> {
  const { data, error } = await supabase
    .from('scrape_runs')
    .insert({ project_id: projectId, status: 'running' satisfies ScrapeRunStatus })
    .select()
    .single()

  if (error || !data) throw new Error('Could not start the scrape. Please try again.')
  return mapRun(data as ScrapeRunRow)
}

export async function createCrawlRun(projectId: string, crawlJobId: string): Promise<ScrapeRun> {
  const { data, error } = await supabase
    .from('scrape_runs')
    .insert({ project_id: projectId, status: 'crawling' satisfies ScrapeRunStatus, crawl_job_id: crawlJobId })
    .select()
    .single()

  if (error || !data) throw new Error('Could not start the site crawl. Please try again.')
  return mapRun(data as ScrapeRunRow)
}

export async function completeScrapeRun(
  runId: string,
  status: Extract<ScrapeRunStatus, 'success' | 'failed'>,
  summary: string | null,
): Promise<void> {
  const { error } = await supabase
    .from('scrape_runs')
    .update({ status, summary, completed_at: new Date().toISOString() })
    .eq('id', runId)

  if (error) throw new Error('Could not update the scrape status.')
}

export async function saveScrapedResult(
  runId: string,
  jsonData: unknown,
  markdownData: string,
): Promise<ScrapedResult> {
  const { data, error } = await supabase
    .from('scraped_results')
    .insert({ run_id: runId, json_data: jsonData, markdown_data: markdownData })
    .select()
    .single()

  if (error || !data) throw new Error('Could not save the scraped results.')
  return mapResult(data as ScrapedResultRow)
}

export async function getScrapedResult(runId: string): Promise<ScrapedResult | null> {
  const { data, error } = await supabase
    .from('scraped_results')
    .select('*')
    .eq('run_id', runId)
    .maybeSingle()

  if (error) throw new Error('Could not load the scraped results.')
  return data ? mapResult(data as ScrapedResultRow) : null
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [{ count: totalProjects }, { count: totalScrapes }, { count: successfulScrapes }, { count: failedScrapes }] =
    await Promise.all([
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase.from('scrape_runs').select('*', { count: 'exact', head: true }),
      supabase.from('scrape_runs').select('*', { count: 'exact', head: true }).eq('status', 'success'),
      supabase.from('scrape_runs').select('*', { count: 'exact', head: true }).eq('status', 'failed'),
    ])

  return {
    totalProjects: totalProjects ?? 0,
    totalScrapes: totalScrapes ?? 0,
    successfulScrapes: successfulScrapes ?? 0,
    failedScrapes: failedScrapes ?? 0,
  }
}
