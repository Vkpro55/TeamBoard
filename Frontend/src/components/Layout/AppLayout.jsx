import Profile from '../../assets/profile.png'
import { LogOut, LayoutDashboard, Folder, ListChecks, User, Menu, X } from 'lucide-react'
import { useState } from 'react'
import SidebarItem from './SidebarItem'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const AppLayout = () => {
  const navigate = useNavigate()
  const { user, logout, loading } = useAuth()
  const profileImage = user?.profilePic || Profile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login', { replace: true })
    } catch {
      // AuthContext stores the error; keep the user on the current page if logout fails.
    }
  }

  return (
    <div className="relative min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      {/* Header */}
      <header className="fixed left-0 right-0 top-0 z-30 flex justify-between border border-2 border-b-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 sm:px-8">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsSidebarOpen((open) => !open)}
            aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
            className="mr-1 inline-flex h-8 w-8 items-center justify-center rounded-sm text-[var(--color-text)] hover:bg-[var(--color-muted)] md:hidden"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link to="/dashboard" className="flex items-center gap-2">
            <LayoutDashboard className="h-8 w-8 rounded-[var(--radius-xs)] bg-[var(--color-primary)] p-1.5 text-white" />
            <div className="leading-tight">
              <p className="text-[16px] font-bold text-[var(--color-text)]">TeamBoard</p>
            </div>
          </Link>
        </div>

        <Link
          to="/profile"
          aria-label="Open profile page"
          className="h-[40px] w-[40px] overflow-hidden rounded-full border border-[var(--color-border)] transition hover:ring-2 hover:ring-[var(--color-primary)]"
        >
          <img src={profileImage} alt="Profile Pic" className="h-full w-full object-cover" />
        </Link>
      </header>

      {/* Main Section */}
      <div className="flex pt-[64px]">
        {isSidebarOpen ? (
          <button
            type="button"
            aria-label="Close menu overlay"
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 top-[64px] z-30 bg-black/40 md:hidden"
          />
        ) : null}

        <aside
          className={`fixed bottom-0 left-0 top-[64px] z-40 flex w-[240px] -translate-x-full flex-col justify-between border-r border-[var(--color-border)] bg-[var(--color-sidebar)] px-2 py-10 transition-transform duration-200 md:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : ''
          }`}
        >
          <div className="space-y-2" onClick={() => setIsSidebarOpen(false)}>
            <SidebarItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
            <SidebarItem to="/projects" icon={Folder} label="Projects" />
            <SidebarItem to="/tasks" icon={ListChecks} label="Tasks" />
            <SidebarItem to="/profile" icon={User} label="Profile" />
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            className="flex items-center gap-2 rounded-sm px-4 py-3 text-left text-sm font-medium text-[var(--color-text-muted)] transition-all duration-200 hover:bg-blue-100 hover:text-[var(--color-text)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut className="h-4 w-4" />
            {loading ? 'Logging out...' : 'Logout'}
          </button>
        </aside>

        <main className="flex-1 p-4 sm:p-6 md:ml-[240px]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
