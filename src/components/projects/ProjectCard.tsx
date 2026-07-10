import { Link } from 'react-router-dom'
import { ExternalLink, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/projects/StatusBadge'
import type { ProjectWithLatestRun } from '@/types/types'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function ProjectCard({
  project,
  onDelete,
}: {
  project: ProjectWithLatestRun
  onDelete?: (project: ProjectWithLatestRun) => void
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link to={`/projects/${project.id}`} className="truncate text-base font-semibold hover:underline">
              {project.projectName}
            </Link>
            {project.latestRun && <StatusBadge status={project.latestRun.status} />}
          </div>
          <a
            href={project.websiteUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="mt-1 flex items-center gap-1 truncate text-sm text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{project.websiteUrl}</span>
          </a>
          <p className="mt-1 text-xs text-muted-foreground">Created {formatDate(project.createdAt)}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link to={`/projects/${project.id}`} className="shrink-0">
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </Link>
          {onDelete && (
            <Button variant="ghost" size="sm" onClick={() => onDelete(project)} aria-label="Delete project">
              <Trash2 className="h-4 w-4 text-error" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
