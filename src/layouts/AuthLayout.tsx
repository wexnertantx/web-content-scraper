import type { ReactNode } from 'react'
import { FileSearch } from 'lucide-react'

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-primary text-primary-foreground">
            <FileSearch className="h-5 w-5" />
          </span>
          <span className="text-xl font-bold tracking-tight text-foreground">UrlIntelligence</span>
        </div>
        <div className="rounded-[var(--radius-lg)] border border-border bg-card p-6 shadow-[var(--shadow-md)] sm:p-8">
          {children}
        </div>
      </div>
    </div>
  )
}
