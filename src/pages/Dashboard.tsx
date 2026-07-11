import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FolderKanban, Globe, CheckCircle2, XCircle, Plus } from 'lucide-react'
import { getDashboardStats, listProjectsWithLatestRun } from '@/services/projects'
import type { DashboardStats, ProjectWithLatestRun } from '@/types/types'
import { StatCard } from '@/components/projects/StatCard'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { Alert } from '@/components/ui/Alert'
import { Spinner } from '@/components/ui/Spinner'
import { buttonVariants } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

const RECENT_PROJECTS_LIMIT = 5

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentProjects, setRecentProjects] = useState<ProjectWithLatestRun[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)
      try {
        const [statsResult, projects] = await Promise.all([getDashboardStats(), listProjectsWithLatestRun()])
        if (cancelled) return
        setStats(statsResult)
        setRecentProjects(projects.slice(0, RECENT_PROJECTS_LIMIT))
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Could not load the dashboard. Please try again.')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner className="h-8 w-8 text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return <Alert variant="error">{error}</Alert>
  }

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">An overview of your scraping activity.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Projects" value={stats?.totalProjects ?? 0} icon={FolderKanban} />
        <StatCard label="Total Scrapes" value={stats?.totalScrapes ?? 0} icon={Globe} />
        <StatCard
          label="Successful Scrapes"
          value={stats?.successfulScrapes ?? 0}
          icon={CheckCircle2}
          accentClassName="bg-success/10 text-success"
        />
        <StatCard
          label="Failed Scrapes"
          value={stats?.failedScrapes ?? 0}
          icon={XCircle}
          accentClassName="bg-error/10 text-error"
        />
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-foreground">Recent Projects</h2>
        {recentProjects.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-muted text-muted-foreground">
                <FolderKanban className="h-6 w-6" />
              </div>
              <p className="font-medium text-foreground">You haven't created any projects yet.</p>
              <p className="max-w-xs text-sm text-muted-foreground">
                Start your first scrape to see projects and runs appear here.
              </p>
              <Link to="/scrape/new" className={cn(buttonVariants({ variant: 'accent' }), 'mt-2')}>
                <Plus className="h-4 w-4" />
                New Scrape
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {recentProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
