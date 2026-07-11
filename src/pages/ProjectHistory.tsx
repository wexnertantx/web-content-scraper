import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { deleteProject, listProjectsWithLatestRun } from '@/services/projects'
import type { ProjectWithLatestRun } from '@/types/types'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { Alert } from '@/components/ui/Alert'
import { Spinner } from '@/components/ui/Spinner'
import { buttonVariants } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

export function ProjectHistory() {
  const [projects, setProjects] = useState<ProjectWithLatestRun[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function loadProjects() {
    setIsLoading(true)
    setError(null)
    try {
      const result = await listProjectsWithLatestRun()
      setProjects(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load your projects. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadProjects()
  }, [])

  async function handleDelete(project: ProjectWithLatestRun) {
    const confirmed = window.confirm(`Delete project "${project.projectName}"? This cannot be undone.`)
    if (!confirmed) return

    setError(null)
    setDeletingId(project.id)
    try {
      await deleteProject(project.id)
      await loadProjects()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete the project. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">All of your scraping projects.</p>
        </div>
        <Link to="/scrape/new" className={buttonVariants({ variant: 'accent' })}>
          <Plus className="h-4 w-4" />
          New Scrape
        </Link>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Spinner className="h-8 w-8 text-muted-foreground" />
        </div>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <p className="text-muted-foreground">You haven't created any projects yet.</p>
            <Link to="/scrape/new" className={buttonVariants({ variant: 'accent' })}>
              <Plus className="h-4 w-4" />
              New Scrape
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className={cn('transition-opacity duration-200', deletingId === project.id && 'opacity-50')}
            >
              <ProjectCard project={project} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
