import { Check, ChevronLeft, ChevronRight, MoreHorizontal, Plus } from 'lucide-react'

const tasks = [
  {
    title: 'Implement User Authentication',
    priority: 'High',
    status: 'In Progress',
    dueDate: 'Oct 24, 2023',
    project: 'Auth Engine',
    completed: false,
  },
  {
    title: 'Update API Documentation',
    priority: 'Medium',
    status: 'To Do',
    dueDate: 'Oct 28, 2023',
    project: 'Platform Core',
    completed: false,
  },
  {
    title: 'Design System Audit',
    priority: 'Low',
    status: 'Done',
    dueDate: 'Oct 20, 2023',
    project: 'Branding',
    completed: true,
  },
  {
    title: 'Mobile App Crash Investigation',
    priority: 'High',
    status: 'Review',
    dueDate: 'Oct 25, 2023',
    project: 'Mobile Dev',
    completed: false,
  },
]

const priorityClasses = {
  High: 'bg-red-100 text-red-600',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-gray-100 text-gray-600',
}

const statusClasses = {
  'In Progress': 'bg-blue-100 text-blue-700',
  'To Do': 'bg-gray-100 text-gray-600',
  Done: 'bg-green-100 text-green-700',
  Review: 'bg-indigo-100 text-indigo-700',
}

function Pagination({ currentPage, totalPages }) {
  const pages = []

  if (totalPages <= 3) {
    for (let i = 1; i <= totalPages; i += 1) {
      pages.push(i)
    }
  } else {
    pages.push(1)

    if (currentPage > 2) {
      pages.push('...')
    }

    if (currentPage !== 1 && currentPage !== totalPages) {
      pages.push(currentPage)
    }

    if (currentPage < totalPages - 1) {
      pages.push('...')
    }

    pages.push(totalPages)
  }

  return (
    <div className="flex items-center gap-2">
      <button
        disabled={currentPage === 1}
        className="rounded-sm border border-[var(--color-border)] px-2 py-1.5 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] disabled:opacity-50"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((page, idx) =>
        page === '...' ? (
          <span key={idx} className="px-2 text-sm text-[var(--color-text-muted)]">
            ...
          </span>
        ) : (
          <button
            key={page}
            className={`rounded-sm px-3 py-1.5 text-sm font-medium ${
              currentPage === page
                ? 'bg-[var(--color-text)] text-white'
                : 'border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            {page}
          </button>
        ),
      )}

      <button
        disabled={currentPage === totalPages}
        className="rounded-sm border border-[var(--color-border)] px-2 py-1.5 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] disabled:opacity-50"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}

const TasksPage = () => {
  const currentPage = 1
  const totalPages = 3

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
              {tasks.map((task, index) => (
                <tr key={task.title} className={index !== tasks.length - 1 ? 'border-b border-[var(--color-border-light)]' : ''}>
                  <td className="px-4 py-4">
                    <button
                      aria-label={task.completed ? 'Mark task incomplete' : 'Mark task complete'}
                      className={`inline-flex h-4 w-4 items-center justify-center rounded-sm border ${
                        task.completed
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
                    <span className={`${statusClasses[task.status]} rounded-sm px-3 py-1 text-[12px] font-medium`}>{task.status}</span>
                  </td>
                  <td className="px-4 py-4 text-sm text-[var(--color-text-muted)]">{task.dueDate}</td>
                  <td className="px-4 py-4 text-sm text-[var(--color-text-muted)]">{task.project}</td>
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
          <p className="text-sm text-[var(--color-text-muted)]">Showing 4 of 24 tasks</p>

          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      </div>
    </div>
  )
}

export default TasksPage