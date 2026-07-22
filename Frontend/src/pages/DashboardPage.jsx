import {
  CheckCircle2,
  LayoutDashboard,
  MessageSquare,
  Plus,
  ShieldAlert,
} from 'lucide-react'
import StatCard from '../components/Main/StatCard'

const statCards = [
  { title: 'Total Projects', value: '12' },
  { title: 'Total Tasks', value: '48' },
  { title: 'Completed Tasks', value: '31' },
  { title: 'Pending Tasks', value: '17' },
]

const activityItems = [
  {
    icon: LayoutDashboard,
    title: 'Alex updated Apollo Landing Page',
    description: 'Changed hero section typography and updated primary call-to-action button.',
    time: '2m ago',
    iconBg: 'bg-[#E8EBFF]',
  },
  {
    icon: CheckCircle2,
    title: 'Sarah M. completed task "Database Migration"',
    badge: 'DEV OPS',
    time: '45m ago',
    iconBg: 'bg-[#E5E7EB]',
  },
  {
    icon: ShieldAlert,
    title: 'System flagged a Critical Delay',
    description: 'Q3 Marketing assets are 3 days behind schedule.',
    time: '2h ago',
    iconBg: 'bg-[#FEE2E2]',
    highlight: 'Critical Delay',
  },
  {
    icon: Plus,
    title: 'Alex added Marcus Chen to Mobile App Refactor',
    time: '5h ago',
    iconBg: 'bg-[#FEEDD7]',
  },
  {
    icon: MessageSquare,
    title: 'Jordan created 5 new tasks in User Feedback Loop',
    time: 'Yesterday',
    iconBg: 'bg-[#E8EBFF]',
  },
]

const projectItems = [
  { label: 'Apollo Landing', progress: 75 },
  { label: 'Mobile Refactor', progress: 20 },
  { label: 'CRM Integration', progress: 92 },
]

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div>
          <p className="text-[length:var(--text-h2)] font-semibold text-[var(--color-text)]">Welcome back, Alex.</p>
          <p className="text-[15px] text-[var(--color-text-muted)]">Here&apos;s what&apos;s happening with your projects today.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <StatCard card={card} />
        ))}
      </div>

      <div className="grid gap-15 xl:grid-cols-[1.6fr_1fr]">

        {/* Recent Activity */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[length:var(--text-h4)] font-semibold text-[var(--color-text)]">
              Recent Activity
            </h2>

            <button className="text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]">
              View All
            </button>
          </div>

          <div className="rounded-sm border border-[var(--color-border)] bg-[var(--color-surface)]">
            {activityItems.map((item, index) => {
              const Icon = item.icon

              return (
                <div
                  key={item.title}
                  className={`flex items-start gap-4 p-4 ${index !== activityItems.length - 1
                    ? 'border-b border-[var(--color-border-light)]'
                    : ''
                    }`}
                >
                  <div
                    className={`${item.iconBg} flex h-9 w-9 shrink-0 items-center justify-center rounded-sm`}
                  >
                    <Icon className="h-4.5 w-4.5 text-[var(--color-text)]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[15px] font-semibold text-[var(--color-text)]">
                        {item.title}
                      </p>

                      {item.badge && (
                        <span className="rounded bg-[var(--color-muted)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    {item.description && (
                      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <span className="shrink-0 text-xs text-[var(--color-text-muted)]">
                    {item.time}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div>
          {/* Heading */}
          <h2 className="mb-4 text-[18px] font-semibold text-[var(--color-text)]">
            Active Projects
          </h2>

          <div className="space-y-4">
            {projectItems.map((project) => (
              <div
                key={project.label}
                className="rounded-sm border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[15px] font-semibold text-[var(--color-text)]">
                    {project.label}
                  </p>

                  <span className="text-[14px] text-[var(--color-text-muted)]">
                    {project.progress}%
                  </span>
                </div>

                <div className="mt-3 h-1 overflow-hidden rounded-full bg-[var(--color-border-light)]">
                  <div
                    className="h-full rounded-full bg-[var(--color-text)]"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default DashboardPage
