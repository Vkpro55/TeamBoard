import { useCallback, useEffect, useState } from 'react'
import { Check, MoreHorizontal, Plus, X } from 'lucide-react'
import { projectApi } from '../api/projects'
import { taskApi } from '../api/tasks'
import Pagination from '../components/Pagination'
import { useToast } from '../hooks/useToast'

const pageSize = 5

const priorityClasses = {
  High: 'bg-red-100 text-red-600',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-gray-100 text-gray-600',
}

const statusClasses = {
  'In Progress': 'bg-blue-100 text-blue-700',
  Todo: 'bg-gray-100 text-gray-600',
  Completed: 'bg-green-100 text-green-700',
}

const taskStatuses = ['Todo', 'In Progress', 'Completed']
const taskPriorities = ['Low', 'Medium', 'High']
const initialCreateForm = {
  projectId: '',
  title: '',
  description: '',
  priority: 'Medium',
  dueDate: '',
}

const getProjectId = (task) => (typeof task.project === 'string' ? task.project : task.project?._id)

const formatDate = (value) => {
  if (!value) {
    return 'No due date'
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

const TasksPage = () => {
  const toast = useToast()
  const [currentPage, setCurrentPage] = useState(1)
  const [tasks, setTasks] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: pageSize, totalItems: 0, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [busyTaskId, setBusyTaskId] = useState('')
  const [editingTaskId, setEditingTaskId] = useState('')
  const [editForm, setEditForm] = useState({ title: '', description: '', status: 'Todo' })
  const [openActionTaskId, setOpenActionTaskId] = useState(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [createForm, setCreateForm] = useState(initialCreateForm)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [projects, setProjects] = useState([])
  const [projectsLoading, setProjectsLoading] = useState(false)

  const loadTasks = useCallback(async (signal, { page = currentPage } = {}) => {
    try {
      setLoading(true)
      setError('')
      setActionError('')

      const data = await taskApi.list({ page, limit: pageSize })

      if (!signal?.aborted) {
        const nextPagination = data.pagination || { page, limit: pageSize, totalItems: data.tasks?.length || 0, totalPages: 1 }
        setTasks(data.tasks || [])
        setPagination(nextPagination)
        setCurrentPage(Math.min(nextPagination.page, nextPagination.totalPages))
      }
    } catch (err) {
      if (!signal?.aborted) {
        setError(err.message || 'Failed to load tasks')
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false)
      }
    }
  }, [currentPage])

  useEffect(() => {
    const controller = new AbortController()

    queueMicrotask(() => {
      void loadTasks(controller.signal)
    })

    return () => controller.abort()
  }, [loadTasks])

  const totalPages = pagination.totalPages
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const startIndex = (safeCurrentPage - 1) * pageSize
  const endIndex = startIndex + tasks.length
  const editingTask = tasks.find((task) => task._id === editingTaskId)

  const handlePageChange = (page) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages)

    if (nextPage !== safeCurrentPage) {
      setCurrentPage(nextPage)
    }
  }

  const refreshCurrentPage = async () => {
    const pageAfterDelete = tasks.length === 1 && safeCurrentPage > 1 ? safeCurrentPage - 1 : safeCurrentPage
    await loadTasks(undefined, { page: pageAfterDelete })
  }

  const openCreateTask = async () => {
    setIsCreateOpen(true)
    setCreateError('')
    setActionError('')

    if (projects.length > 0) {
      setCreateForm((current) => ({ ...current, projectId: current.projectId || projects[0]?._id || '' }))
      return
    }

    try {
      setProjectsLoading(true)
      const data = await projectApi.list({ page: 1, limit: 100 })
      const loadedProjects = data.projects || []
      setProjects(loadedProjects)
      setCreateForm((current) => ({ ...current, projectId: current.projectId || loadedProjects[0]?._id || '' }))
    } catch (err) {
      setCreateError(err.message || 'Failed to load projects')
    } finally {
      setProjectsLoading(false)
    }
  }

  const closeCreateTask = () => {
    setIsCreateOpen(false)
    setCreateError('')
    setCreateForm(initialCreateForm)
  }

  const handleCreateTask = async (event) => {
    event.preventDefault()

    const title = createForm.title.trim()
    const description = createForm.description.trim()

    if (!createForm.projectId) {
      setCreateError('Project is required')
      return
    }

    if (!title) {
      setCreateError('Task title is required')
      return
    }

    try {
      setCreating(true)
      setCreateError('')
      await taskApi.create(createForm.projectId, {
        title,
        description,
        priority: createForm.priority,
        dueDate: createForm.dueDate || null,
      })
      toast.success('Task created successfully')
      closeCreateTask()
      await loadTasks(undefined, { page: 1 })
    } catch (err) {
      setCreateError(err.message || 'Failed to create task')
      toast.error(err.message || 'Failed to create task')
    } finally {
      setCreating(false)
    }
  }

  const handleCompleteTask = async (task) => {
    const projectId = getProjectId(task)

    if (!projectId || task.status === 'Completed') {
      return
    }

    try {
      setBusyTaskId(task._id)
      setActionError('')
      await taskApi.complete(projectId, task._id)
      toast.success('Task marked as completed')
      await loadTasks(undefined, { page: safeCurrentPage })
    } catch (err) {
      setActionError(err.message || 'Failed to mark task complete')
      toast.error(err.message || 'Failed to mark task complete')
    } finally {
      setBusyTaskId('')
    }
  }

  const startEditingTask = (task) => {
    setActionError('')
    setEditingTaskId(task._id)
    setEditForm({
      title: task.title || '',
      description: task.description || '',
      status: task.status || 'Todo',
    })
    setOpenActionTaskId(null)
  }

  const cancelEditingTask = () => {
    setEditingTaskId('')
    setEditForm({ title: '', description: '', status: 'Todo' })
  }

  const handleUpdateTask = async (task) => {
    const projectId = getProjectId(task)
    const title = editForm.title.trim()
    const description = editForm.description.trim()

    if (!projectId || !title) {
      setActionError('Task title is required')
      return
    }

    try {
      setBusyTaskId(task._id)
      setActionError('')
      await taskApi.update(projectId, task._id, { title, description, status: editForm.status })
      toast.success('Task updated successfully')
      cancelEditingTask()
      await loadTasks(undefined, { page: safeCurrentPage })
    } catch (err) {
      setActionError(err.message || 'Failed to update task')
      toast.error(err.message || 'Failed to update task')
    } finally {
      setBusyTaskId('')
    }
  }

  const handleDeleteTask = async (task) => {
    const projectId = getProjectId(task)

    if (!projectId) {
      setOpenActionTaskId(null)
      return
    }

    try {
      setBusyTaskId(task._id)
      setOpenActionTaskId(null)
      setActionError('')
      await taskApi.delete(projectId, task._id)
      toast.success('Task deleted successfully')
      await refreshCurrentPage()
    } catch (err) {
      setActionError(err.message || 'Failed to delete task')
      toast.error(err.message || 'Failed to delete task')
    } finally {
      setBusyTaskId('')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[length:var(--text-h2)] font-semibold text-[var(--color-text)]">Tasks</p>
          <p className="text-[15px] text-[var(--color-text-muted)]">Manage and track your team's current work items.</p>
        </div>

        <button
          type="button"
          onClick={openCreateTask}
          className="inline-flex items-center gap-2 self-start rounded-sm bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)]"
        >
          <Plus className="h-4 w-4" />
          Create Task
        </button>
      </div>

      <div className="flex flex-col gap-4 rounded-sm border border-[var(--color-border)] bg-[var(--color-surface)] p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            Status:
            <select className="rounded-sm border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-ring)]">
              <option>All Statuses</option>
              <option>To Do</option>
              <option>In Progress</option>
              <option>Review</option>
              <option>Done</option>
            </select>
          </label>

          <label className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            Priority:
            <select className="rounded-sm border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-ring)]">
              <option>All Priorities</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </label>
        </div>

        <label className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
          Sort by:
          <select className="rounded-sm border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-ring)]">
            <option>Due Date (Soonest)</option>
            <option>Priority</option>
            <option>Status</option>
            <option>Project</option>
          </select>
        </label>
      </div>

      <div className="rounded-sm border border-[var(--color-border)] bg-[var(--color-surface)]">
        {actionError && (
          <div className="border-b border-[var(--color-border-light)] px-4 py-3 text-sm text-[var(--color-error)]">
            {actionError}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left">
            <thead>
              <tr className="border-b border-[var(--color-border-light)] bg-[var(--color-sidebar)] text-[12px] uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                <th className="w-[46px] px-4 py-3 font-normal" aria-label="Complete task" />
                <th className="px-4 py-3 font-normal">Title</th>
                <th className="px-4 py-3 font-normal">Priority</th>
                <th className="px-4 py-3 font-normal">Status</th>
                <th className="px-4 py-3 font-normal">Due Date</th>
                <th className="px-4 py-3 font-normal">Project</th>
                <th className="px-4 py-3 text-right font-normal">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-[var(--color-text-muted)]">
                    Loading tasks...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-[var(--color-error)]">
                    {error}
                  </td>
                </tr>
              ) : tasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-[var(--color-text-muted)]">
                    No tasks found.
                  </td>
                </tr>
              ) : tasks.map((task, index) => (
                <tr key={task._id || task.title} className={index !== tasks.length - 1 ? 'border-b border-[var(--color-border-light)]' : ''}>
                  <td className="px-4 py-4">
                    <button
                      type="button"
                      aria-label={task.status === 'Completed' ? 'Mark task incomplete' : 'Mark task complete'}
                      disabled={busyTaskId === task._id || task.status === 'Completed'}
                      onClick={() => handleCompleteTask(task)}
                      className={`inline-flex h-4 w-4 items-center justify-center rounded-sm border ${
                        task.status === 'Completed'
                          ? 'border-[var(--color-success)] bg-[var(--color-success-bg)] text-[var(--color-success)]'
                          : 'border-[var(--color-border)] bg-[var(--color-surface)] text-transparent hover:border-[var(--color-text-muted)] hover:text-[var(--color-text-muted)]'
                      }`}
                    >
                      <Check className="h-3 w-3" />
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-[var(--text-body-sm)] font-semibold text-[var(--color-text)]">{task.title}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`${priorityClasses[task.priority]} rounded-sm px-3 py-1 text-[12px] font-medium`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`${statusClasses[task.status] || 'bg-gray-100 text-gray-600'} rounded-sm px-3 py-1 text-[12px] font-medium`}>{task.status}</span>
                  </td>
                  <td className="px-4 py-4 text-sm text-[var(--color-text-muted)]">{formatDate(task.dueDate)}</td>
                  <td className="px-4 py-4 text-sm text-[var(--color-text-muted)]">{task.project?.name || 'Unknown project'}</td>
                  <td className="relative px-4 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => setOpenActionTaskId((current) => (current === task._id ? null : task._id))}
                      disabled={busyTaskId === task._id}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-sm text-[var(--color-text-muted)] hover:bg-[var(--color-muted)] hover:text-[var(--color-text)] disabled:opacity-50"
                      aria-label="Task actions"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>

                    {openActionTaskId === task._id ? (
                      <div className="absolute right-4 top-12 z-20 w-44 rounded-sm border border-[var(--color-border)] bg-[var(--color-surface)] p-1 text-left shadow-lg">
                        {task.status !== 'Completed' ? (
                          <button
                            type="button"
                            onClick={() => startEditingTask(task)}
                            className="w-full rounded-sm px-3 py-2 text-left text-sm text-[var(--color-text)] hover:bg-[var(--color-muted)]"
                          >
                            Update Task
                          </button>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => handleDeleteTask(task)}
                          disabled={busyTaskId === task._id}
                          className="w-full rounded-sm px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Delete Task
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
            Showing {pagination.totalItems ? startIndex + 1 : 0}–{endIndex} of {pagination.totalItems} tasks
          </p>

          <Pagination currentPage={safeCurrentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      </div>

      {isCreateOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-sm border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-[var(--color-text)]">Create New Task</p>
                <p className="text-sm text-[var(--color-text-muted)]">Add a task to one of your projects.</p>
              </div>
              <button
                type="button"
                onClick={closeCreateTask}
                disabled={creating}
                className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] disabled:opacity-50"
                aria-label="Close create task"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {createError ? <p className="mb-4 text-sm text-red-600">{createError}</p> : null}

            <form className="space-y-4" onSubmit={handleCreateTask}>
              <label className="block space-y-2 text-sm text-[var(--color-text-secondary)]">
                <span>Project</span>
                <select
                  value={createForm.projectId}
                  onChange={(event) => setCreateForm((current) => ({ ...current, projectId: event.target.value }))}
                  disabled={projectsLoading || creating || projects.length === 0}
                  className="w-full rounded-sm border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-ring)] disabled:opacity-60"
                >
                  {projectsLoading ? <option value="">Loading projects...</option> : null}
                  {!projectsLoading && projects.length === 0 ? <option value="">No projects available</option> : null}
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>{project.name}</option>
                  ))}
                </select>
              </label>

              <label className="block space-y-2 text-sm text-[var(--color-text-secondary)]">
                <span>Task Title</span>
                <input
                  type="text"
                  value={createForm.title}
                  onChange={(event) => setCreateForm((current) => ({ ...current, title: event.target.value }))}
                  className="w-full rounded-sm border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-ring)]"
                  placeholder="Enter task title"
                />
              </label>

              <label className="block space-y-2 text-sm text-[var(--color-text-secondary)]">
                <span>Description</span>
                <textarea
                  value={createForm.description}
                  onChange={(event) => setCreateForm((current) => ({ ...current, description: event.target.value }))}
                  className="min-h-[100px] w-full rounded-sm border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-ring)]"
                  placeholder="Enter task description"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2 text-sm text-[var(--color-text-secondary)]">
                  <span>Priority</span>
                  <select
                    value={createForm.priority}
                    onChange={(event) => setCreateForm((current) => ({ ...current, priority: event.target.value }))}
                    className="w-full rounded-sm border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-ring)]"
                  >
                    {taskPriorities.map((priority) => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </select>
                </label>

                <label className="block space-y-2 text-sm text-[var(--color-text-secondary)]">
                  <span>Due Date</span>
                  <input
                    type="date"
                    value={createForm.dueDate}
                    onChange={(event) => setCreateForm((current) => ({ ...current, dueDate: event.target.value }))}
                    className="w-full rounded-sm border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-ring)]"
                  />
                </label>
              </div>

              <p className="rounded-sm bg-[var(--color-muted)] px-3 py-2 text-sm text-[var(--color-text-muted)]">
                New tasks are created with <span className="font-semibold text-[var(--color-text)]">Todo</span> status.
              </p>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeCreateTask}
                  disabled={creating}
                  className="rounded-sm border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || projectsLoading || projects.length === 0}
                  className="rounded-sm bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] disabled:opacity-60"
                >
                  {creating ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {editingTask ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-sm border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-[var(--color-text)]">Update Task</p>
                <p className="text-sm text-[var(--color-text-muted)]">Edit the selected task details.</p>
              </div>
              <button
                type="button"
                onClick={cancelEditingTask}
                disabled={busyTaskId === editingTask._id}
                className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] disabled:opacity-50"
                aria-label="Close update task"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault()
                void handleUpdateTask(editingTask)
              }}
            >
              <label className="block space-y-2 text-sm text-[var(--color-text-secondary)]">
                <span>Task Title</span>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(event) => setEditForm((current) => ({ ...current, title: event.target.value }))}
                  className="w-full rounded-sm border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-ring)]"
                  placeholder="Enter task title"
                />
              </label>

              <label className="block space-y-2 text-sm text-[var(--color-text-secondary)]">
                <span>Description</span>
                <textarea
                  value={editForm.description || ''}
                  onChange={(event) => setEditForm((current) => ({ ...current, description: event.target.value }))}
                  className="min-h-[100px] w-full rounded-sm border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-ring)]"
                  placeholder="Enter task description"
                />
              </label>

              <label className="block space-y-2 text-sm text-[var(--color-text-secondary)]">
                <span>Status</span>
                <select
                  value={editForm.status}
                  onChange={(event) => setEditForm((current) => ({ ...current, status: event.target.value }))}
                  className="w-full rounded-sm border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-ring)]"
                >
                  {taskStatuses.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={cancelEditingTask}
                  disabled={busyTaskId === editingTask._id}
                  className="rounded-sm border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busyTaskId === editingTask._id}
                  className="rounded-sm bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] disabled:opacity-60"
                >
                  {busyTaskId === editingTask._id ? 'Updating...' : 'Update Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default TasksPage