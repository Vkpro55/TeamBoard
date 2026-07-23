import {
  CheckCircle2,
  Clock3,
  Folder,
  MoreHorizontal,
  Plus,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { projectApi } from '../api/projects'
import Pagination from '../components/Pagination'
import ProjectStatCard from '../components/Main/ProjectStatCard'

const statusClasses = {
  Active: 'bg-blue-100 text-blue-600 px-4 py-1 rounded-none',
  Completed: 'bg-green-100 text-green-600 px-4 py-1 rounded-none',
  Archived: 'bg-gray-100 text-gray-600 px-4 py-1 rounded-none',
}

const formatDate = (date) =>
  new Intl.DateTimeFormat('en', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(new Date(date))

const ProjectsPage = () => {
  const pageSize = 5
  const [currentPage, setCurrentPage] = useState(1)
  const [projects, setProjects] = useState([])
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadProjects = useCallback(async (signal) => {
    try {
      setLoading(true)
      setError('')
      const data = await projectApi.list()

      if (!signal?.aborted) {
        setProjects(data.projects || [])
        setStats(data.stats || { total: 0, active: 0, completed: 0 })
        setCurrentPage(1)
      }
    } catch (err) {
      if (!signal?.aborted) {
        setError(err.message || 'Failed to load projects')
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    queueMicrotask(() => {
      void loadProjects(controller.signal)
    })

    const handleFocus = () => {
      void loadProjects(controller.signal)
    }

    window.addEventListener('focus', handleFocus)

    return () => {
      controller.abort()
      window.removeEventListener('focus', handleFocus)
    }
  }, [loadProjects])

  const projectStats = useMemo(
    () => [
      { title: 'Total Projects', value: String(stats.total), icon: Folder, iconBg: 'bg-[#E8EBFF]' },
      { title: 'Active', value: String(stats.active), icon: Clock3, iconBg: 'bg-[#FEEDD7]' },
      { title: 'Completed', value: String(stats.completed), icon: CheckCircle2, iconBg: 'bg-[#E5E7EB]' },
    ],
    [stats],
  )

  const totalPages = Math.max(1, Math.ceil(projects.length / pageSize))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const startIndex = (safeCurrentPage - 1) * pageSize
  const paginatedProjects = projects.slice(startIndex, startIndex + pageSize)

  const handlePageChange = (page) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages)
    setCurrentPage(nextPage)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[length:var(--text-h2)] font-semibold text-[var(--color-text)]">Projects</p>
          <p className="text-[15px] text-[var(--color-text-muted)]">Manage and track all your project activities</p>
        </div>

        <button className="inline-flex items-center gap-2 self-start rounded-sm bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)]">
          <Plus className="h-4 w-4" />
          New Project
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projectStats.map((stat) => {
          return (
            <ProjectStatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              iconBg={stat.iconBg}
            />
          )
        })}
      </div>

      <div className="rounded-sm border border-[var(--color-border)] bg-[var(--color-surface)]">
        {error ? <p className="border-b border-[var(--color-border-light)] p-4 text-sm text-red-600">{error}</p> : null}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left">
            <thead>
              <tr className="border-b border-[var(--color-border-light)] bg-[var(--color-sidebar)] text-[12px] uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                <th className="px-4 py-3 font-normal">Project Name</th>
                <th className="px-4 py-3 font-normal">Description</th>
                <th className="px-4 py-3 font-normal">Status</th>
                <th className="px-4 py-3 font-normal">Created Date</th>
                <th className="px-4 py-3 text-right font-normal">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-[var(--color-text-muted)]">
                    Loading projects...
                  </td>
                </tr>
              ) : paginatedProjects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-[var(--color-text-muted)]">
                    No projects found.
                  </td>
                </tr>
              ) : paginatedProjects.map((project, index) => (
                <tr
                  key={project._id || project.name}
                  className={index !== paginatedProjects.length - 1 ? 'border-b border-[var(--color-border-light)]' : ''}
                >
                  <td className="px-4 py-4">
                    <p className="text-[var(--text-body-sm)] font-semibold text-[var(--color-text)]">{project.name}</p>
                  </td>
                  <td className="max-w-[360px] px-4 py-4 text-sm text-[var(--color-text-muted)]">{project.description}</td>
                  <td className="px-4 py-4">
                    <span className={`${statusClasses[project.status] || statusClasses.Active} font-semibold textrounded text-[10px] uppercase`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-[var(--color-text-muted)]">{formatDate(project.createdAt)}</td>
                  <td className="px-4 py-4 text-right">
                    <button className="inline-flex h-8 w-8 items-center justify-center rounded-sm text-[var(--color-text-muted)] hover:bg-[var(--color-muted)] hover:text-[var(--color-text)]">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-[var(--color-border-light)] p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[var(--color-text-muted)]">
            Showing {projects.length ? startIndex + 1 : 0}–{Math.min(startIndex + pageSize, projects.length)} of {projects.length} projects
          </p>

          <Pagination currentPage={safeCurrentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      </div>
    </div>
  )
}

export default ProjectsPage