import {
  CheckCircle2,
  Clock3,
  Folder,
  MoreHorizontal,
  Plus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import ProjectStatCard from '../components/Main/ProjectStatCard'

const projects = [
  {
    name: 'Website Redesign',
    description: 'Complete overhaul of company website with modern design',
    status: 'Active',
    createdDate: 'Dec 15, 2024',
  },
  {
    name: 'Mobile App Development',
    description: 'Native mobile application for iOS and Android platforms',
    status: 'Active',
    createdDate: 'Dec 10, 2024',
  },
  {
    name: 'API Integration',
    description: 'Third-party API integration for payment processing',
    status: 'Completed',
    createdDate: 'Dec 05, 2024',
  },
  {
    name: 'Database Migration',
    description: 'Migration from legacy database to new cloud infrastructure',
    status: 'On Hold',
    createdDate: 'Nov 28, 2024',
  },
]

const projectStats = [
  { title: 'Total Projects', value: '12', icon: Folder, iconBg: 'bg-[#E8EBFF]' },
  { title: 'Active', value: '8', icon: Clock3, iconBg: 'bg-[#FEEDD7]' },
  { title: 'Completed', value: '3', icon: CheckCircle2, iconBg: 'bg-[#E5E7EB]' },
]

const statusClasses = {
  Active: 'bg-blue-100 text-blue-600 px-4 py-1 rounded-none',
  Completed: 'bg-green-100 text-green-600 px-4 py-1 rounded-none',
  'On Hold': 'bg-red-100 text-red-600 px-4 py-1 rounded-none',
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

const ProjectsPage = () => {
  const currentPage = 1
  const totalPages = 3

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
              {projects.map((project, index) => (
                <tr
                  key={project.name}
                  className={index !== projects.length - 1 ? 'border-b border-[var(--color-border-light)]' : ''}
                >
                  <td className="px-4 py-4">
                    <p className="text-[var(--text-body-sm)] font-semibold text-[var(--color-text)]">{project.name}</p>
                  </td>
                  <td className="max-w-[360px] px-4 py-4 text-sm text-[var(--color-text-muted)]">{project.description}</td>
                  <td className="px-4 py-4">
                    <span className={`${statusClasses[project.status]} font-semibold textrounded text-[10px] uppercase`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-[var(--color-text-muted)]">{project.createdDate}</td>
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
            Showing {(currentPage - 1) * 5 + 1}–{Math.min(currentPage * 5, totalPages * 5)} of {totalPages * 5} projects
          </p>

          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      </div>
    </div>
  )
}

export default ProjectsPage