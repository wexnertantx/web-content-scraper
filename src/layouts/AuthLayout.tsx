import type { ReactNode } from 'react'

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="text-xl font-semibold text-primary">Website Content Scraper</span>
        </div>
        <div className="rounded-lg border border-border bg-background p-6 shadow-sm">{children}</div>
      </div>
    </div>
  )
}
