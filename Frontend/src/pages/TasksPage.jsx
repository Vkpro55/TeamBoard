import { useCallback, useEffect, useState } from 'react'
import { Check, MoreHorizontal, Plus } from 'lucide-react'
import { taskApi } from '../api/tasks'
import Pagination from '../components/Pagination'

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
  const [currentPage, setCurrentPage] = useState(1)
  const [tasks, setTasks] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: pageSize, totalItems: 0, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadTasks = useCallback(async (signal, { page = currentPage } = {}) => {
    try {
      setLoading(true)
      setError('')

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

  const handlePageChange = (page) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages)

    if (nextPage !== safeCurrentPage) {
      setCurrentPage(nextPage)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[length:var(--text-h2)] font-semibold text-[var(--color-text)]">Tasks</p>
          <p className="text-[15px] text-[var(--color-text-muted)]">Manage and track your team's current work items.</p>
        </div>

        <button className="inline-flex items-center gap-2 self-start rounded-sm bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)]">
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
                      aria-label={task.status === 'Completed' ? 'Mark task incomplete' : 'Mark task complete'}
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
            Showing {pagination.totalItems ? startIndex + 1 : 0}–{endIndex} of {pagination.totalItems} tasks
          </p>

          <Pagination currentPage={safeCurrentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      </div>
    </div>
  )
}

export default TasksPage