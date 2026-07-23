import TextInput from '../Form/TextInput'
import Profile from '../../assets/profile.png'
import { LogOut, Search, LayoutDashboard, Folder, ListChecks, User } from 'lucide-react'
import SidebarItem from './SidebarItem'
import { Link, Outlet, useLocation } from 'react-router-dom'

const AppLayout = () => {
  const location = useLocation()
  const searchConfig = {
    '/dashboard': 'Search projects...',
    '/projects': 'Search projects...',
    '/tasks': 'Search tasks...',
  }

  const showSearch = location.pathname !== '/profile'
  const searchPlaceholder = searchConfig[location.pathname] ?? 'Search...'

  return (
    <div className="relative min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      {/* Header */}
      <header className="fixed left-0 right-0 top-0 z-30 flex justify-between border border-2 border-b-[var(--color-border)] bg-[var(--color-background)] px-8 py-3">
        <div className="flex items-center gap-20">
          <Link to="/dashboard" className="flex items-center gap-2">
            <LayoutDashboard className="h-8 w-8 rounded-[var(--radius-xs)] bg-[var(--color-primary)] p-1.5 text-white" />
            <div className="leading-tight">
              <p className="text-[16px] font-bold text-[var(--color-text)]">TeamBoard</p>
            </div>
          </Link>

          {showSearch ? (
            <div className="relative w-[256px]">
              <Search className="absolute left-4 top-2 h-4 w-4 text-[var(--color-text-muted)]" />
              <TextInput
                id="search"
                name="search"
                type="text"
                value={''}
                onChange={''}
                placeholder={searchPlaceholder}
                required
                className="pl-[38px]"
              />
            </div>
          ) : null}
        </div>

        <div className="h-[40px] w-[40px] rounded-full">
          <img src={Profile} alt="Profile Pic" className="h-full w-full object-cover" />
        </div>
      </header>

      {/* Main Section */}
      <div className="flex pt-[64px]">
        <aside className="fixed bottom-0 left-0 top-[64px] flex w-[240px] flex-col justify-between border-r border-[var(--color-border)] bg-[var(--color-sidebar)] px-2 py-10">
          <div className="space-y-2">
            <SidebarItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
            <SidebarItem to="/projects" icon={Folder} label="Projects" />
            <SidebarItem to="/tasks" icon={ListChecks} label="Tasks" />
            <SidebarItem to="/profile" icon={User} label="Profile" />
          </div>

          <div className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-black">
            <LogOut className="h-4 w-4" />
            Logout
          </div>
        </aside>

        <main className="ml-[240px] flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
