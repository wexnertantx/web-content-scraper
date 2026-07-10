import { Link, NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, FolderClock, Plus, LogOut } from 'lucide-react'
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
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <span className="text-lg font-semibold text-primary">Website Content Scraper</span>
            <nav className="flex items-center gap-1">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground',
                      isActive && 'bg-muted text-foreground',
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
            <Link to="/scrape/new" className={buttonVariants({ variant: 'accent', size: 'sm' })}>
              <Plus className="h-4 w-4" />
              New Scrape
            </Link>
            <span className="text-sm text-muted-foreground">{user?.fullName || user?.email}</span>
            <Button size="sm" variant="ghost" onClick={() => logout()}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
