import { Link, NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, FolderClock, Plus, LogOut, FileSearch } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button, buttonVariants } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderClock },
]

export function AppLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2 text-foreground">
              <span className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] bg-primary text-primary-foreground">
                <FileSearch className="h-4 w-4" />
              </span>
              <span className="hidden text-base font-bold tracking-tight sm:inline">UrlIntelligence</span>
            </Link>
            <nav className="hidden items-center gap-1 md:flex">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground',
                      isActive && 'bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary',
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/scrape/new" className={cn(buttonVariants({ variant: 'accent', size: 'sm' }), 'hidden sm:inline-flex')}>
              <Plus className="h-4 w-4" />
              New Scrape
            </Link>
            <Link to="/scrape/new" className={cn(buttonVariants({ variant: 'accent', size: 'sm' }), 'sm:hidden')} aria-label="New Scrape">
              <Plus className="h-4 w-4" />
            </Link>
            <span className="hidden text-sm text-muted-foreground md:inline">{user?.fullName || user?.email}</span>
            <Button size="sm" variant="ghost" onClick={() => logout()} aria-label="Log out">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <nav className="flex items-center gap-1 overflow-x-auto border-t border-border px-4 py-2 md:hidden">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 whitespace-nowrap rounded-[var(--radius-sm)] px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground',
                  isActive && 'bg-primary/10 text-primary',
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <Outlet />
      </main>
    </div>
  )
}
