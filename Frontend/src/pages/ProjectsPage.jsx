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
import { useToast } from '../hooks/useToast'

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

const initialProjectForm = {
  name: '',
  description: '',
}

const getInitialEditState = () => ({
  projectId: null,
  name: '',
  description: '',
})

const ProjectsPage = () => {
  const toast = useToast()
  const pageSize = 5
  const [currentPage, setCurrentPage] = useState(1)
  const [projects, setProjects] = useState([])
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [createForm, setCreateForm] = useState(initialProjectForm)
  const [createError, setCreateError] = useState('')
  const [creating, setCreating] = useState(false)
  const [openActionProjectId, setOpenActionProjectId] = useState(null)
  const [updatingProjectId, setUpdatingProjectId] = useState(null)
  const [editForm, setEditForm] = useState(getInitialEditState)
  const [deleteProjectId, setDeleteProjectId] = useState(null)

  const loadProjects = useCallback(async (signal, { resetPage = false } = {}) => {
    try {
      setLoading(true)
      setError('')
      const data = await projectApi.list()

      if (!signal?.aborted) {
        setProjects(data.projects || [])
        setStats(data.stats || { total: 0, active: 0, completed: 0 })
        if (resetPage) {
          setCurrentPage(1)
        }
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
      void loadProjects(controller.signal, { resetPage: true })
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

  const openCreateProject = () => {
    setCreateError('')
    setCreateForm(initialProjectForm)
    setEditForm(getInitialEditState())
    setIsCreateOpen(true)
  }

  const openEditProject = (project) => {
    setCreateError('')
    setCreateForm({
      name: project.name || '',
      description: project.description || '',
    })
    setEditForm({
      projectId: project._id,
      name: project.name || '',
      description: project.description || '',
    })
    setIsCreateOpen(true)
    setOpenActionProjectId(null)
  }

  const closeCreateProject = () => {
    if (creating) {
      return
    }

    setIsCreateOpen(false)
    setCreateError('')
    setCreateForm(initialProjectForm)
    setEditForm(getInitialEditState())
  }

  const handleCreateSubmit = async (event) => {
    event.preventDefault()

    if (!createForm.name.trim()) {
      setCreateError('Project name is required')
      return
    }

    try {
      setCreating(true)
      setCreateError('')
      if (editForm.projectId) {
        await projectApi.update(editForm.projectId, {
          name: createForm.name.trim(),
          description: createForm.description.trim(),
        })
        toast.success('Project updated successfully')
      } else {
        await projectApi.create({
          name: createForm.name.trim(),
          description: createForm.description.trim(),
          status: 'Active',
        })
        toast.success('Project created successfully')
      }
      setIsCreateOpen(false)
      setCreateForm(initialProjectForm)
      setEditForm(getInitialEditState())
      await loadProjects(undefined, { resetPage: true })
    } catch (err) {
      setCreateError(err.message || 'Failed to save project')
      toast.error(err.message || 'Failed to save project')
    } finally {
      setCreating(false)
    }
  }

  const handleProjectStatusChange = async (project, status) => {
    if (!project?._id || updatingProjectId) {
      return
    }

    try {
      setUpdatingProjectId(project._id)
      setOpenActionProjectId(null)
      setError('')

      if (status === 'Archived') {
        await projectApi.archive(project._id)
      } else {
        await projectApi.update(project._id, { status })
      }

      toast.success(`Project marked as ${status.toLowerCase()}`)
      await loadProjects()
    } catch (err) {
      setError(err.message || 'Failed to update project')
      toast.error(err.message || 'Failed to update project')
    } finally {
      setUpdatingProjectId(null)
    }
  }

  const handleDeleteProject = async (project) => {
    if (!project?._id || deleteProjectId) {
      return
    }

    const confirmed = window.confirm(`Delete project "${project.name}"? This cannot be undone.`)
    if (!confirmed) {
      setOpenActionProjectId(null)
      return
    }

    try {
      setDeleteProjectId(project._id)
      setOpenActionProjectId(null)
      setError('')
      await projectApi.delete(project._id)
      toast.success('Project deleted successfully')
      await loadProjects()
    } catch (err) {
      setError(err.message || 'Failed to delete project')
      toast.error(err.message || 'Failed to delete project')
    } finally {
      setDeleteProjectId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[length:var(--text-h2)] font-semibold text-[var(--color-text)]">Projects</p>
          <p className="text-[15px] text-[var(--color-text-muted)]">Manage and track all your project activities</p>
        </div>

        <button
          type="button"
          onClick={openCreateProject}
          className="inline-flex items-center gap-2 self-start rounded-sm bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)]"
        >
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
                  <td className="relative px-4 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => setOpenActionProjectId((current) => (current === project._id ? null : project._id))}
                      disabled={updatingProjectId === project._id}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-sm text-[var(--color-text-muted)] hover:bg-[var(--color-muted)] hover:text-[var(--color-text)] disabled:opacity-50"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>

                    {openActionProjectId === project._id ? (
                      <div className="absolute right-4 top-12 z-20 w-44 rounded-sm border border-[var(--color-border)] bg-[var(--color-surface)] p-1 text-left shadow-lg">
                        <button
                          type="button"
                          onClick={() => openEditProject(project)}
                          className="w-full rounded-sm px-3 py-2 text-left text-sm text-[var(--color-text)] hover:bg-[var(--color-muted)]"
                        >
                          Update Project
                        </button>
                        <button
                          type="button"
                          onClick={() => handleProjectStatusChange(project, 'Completed')}
                          disabled={project.status === 'Completed'}
                          className="w-full rounded-sm px-3 py-2 text-left text-sm text-[var(--color-text)] hover:bg-[var(--color-muted)] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Mark as Completed
                        </button>
                        <button
                          type="button"
                          onClick={() => handleProjectStatusChange(project, 'Archived')}
                          disabled={project.status === 'Archived'}
                          className="w-full rounded-sm px-3 py-2 text-left text-sm text-[var(--color-text)] hover:bg-[var(--color-muted)] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Mark as Archived
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(project)}
                          disabled={deleteProjectId === project._id}
                          className="w-full rounded-sm px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Delete Project
                        </button>
                      </div>
                    ) : null}
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

      {isCreateOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-sm border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-[var(--color-text)]">
                  {editForm.projectId ? 'Update Project' : 'Create New Project'}
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {editForm.projectId ? 'Edit the selected project details.' : 'Add a project to your workspace.'}
                </p>
              </div>
              <button
                type="button"
                onClick={closeCreateProject}
                className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              >
                ✕
              </button>
            </div>

            {createError ? <p className="mb-4 text-sm text-red-600">{createError}</p> : null}

            <form className="space-y-4" onSubmit={handleCreateSubmit}>
              <label className="block space-y-2 text-sm text-[var(--color-text-secondary)]">
                <span>Project Name</span>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(event) => setCreateForm((prev) => ({ ...prev, name: event.target.value }))}
                  className="w-full rounded-sm border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-ring)]"
                  placeholder="Enter project name"
                />
              </label>

              <label className="block space-y-2 text-sm text-[var(--color-text-secondary)]">
                <span>Description</span>
                <textarea
                  value={createForm.description}
                  onChange={(event) => setCreateForm((prev) => ({ ...prev, description: event.target.value }))}
                  className="min-h-[100px] w-full rounded-sm border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-ring)]"
                  placeholder="Enter project description"
                />
              </label>

              <p className="rounded-sm bg-[var(--color-muted)] px-3 py-2 text-sm text-[var(--color-text-muted)]">
                New projects are created with <span className="font-semibold text-[var(--color-text)]">Active</span> status.
              </p>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeCreateProject}
                  className="rounded-sm border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-sm bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] disabled:opacity-60"
                >
                  {creating ? (editForm.projectId ? 'Updating...' : 'Creating...') : (editForm.projectId ? 'Update Project' : 'Create Project')}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default ProjectsPage