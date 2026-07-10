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
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">An overview of your scraping activity.</p>
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
        <h2 className="mb-4 text-lg font-semibold">Recent Projects</h2>
        {recentProjects.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
              <p className="text-muted-foreground">You haven't created any projects yet.</p>
              <Link to="/scrape/new" className={buttonVariants({ variant: 'accent' })}>
                <Plus className="h-4 w-4" />
                New Scrape
              </Link>
              <p className="text-xs text-muted-foreground">
                Use the "New Scrape" button in the navigation bar to get started.
              </p>
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
