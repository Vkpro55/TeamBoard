import {
  CheckCircle2,
  Clock3,
  Folder,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { dashboardApi } from '../api/dashboard'
import StatCard from '../components/Main/StatCard'
import { useAuth } from '../hooks/useAuth'

const formatRelativeTime = (date) => {
  const diffMs = new Date(date).getTime() - Date.now()
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  const diffMinutes = Math.round(diffMs / 60000)
  if (Math.abs(diffMinutes) < 60) return rtf.format(diffMinutes, 'minute')
  const diffHours = Math.round(diffMinutes / 60)
  if (Math.abs(diffHours) < 24) return rtf.format(diffHours, 'hour')
  return rtf.format(Math.round(diffHours / 24), 'day')
}

const activityIcon = (activity) => {
  if (activity.type === 'project') return { Icon: Folder, iconBg: 'bg-[#E8EBFF]' }
  if (activity.status === 'Completed') return { Icon: CheckCircle2, iconBg: 'bg-[#E5E7EB]' }
  return { Icon: Clock3, iconBg: 'bg-[#FEEDD7]' }
}

const activityLabel = (activity) => {
  if (activity.type === 'project') return `Project "${activity.title}" is ${activity.status}`
  return activity.project ? `Task "${activity.title}" in ${activity.project}` : `Task "${activity.title}"`
}

const DashboardPage = () => {
  const { user } = useAuth()
  const [totals, setTotals] = useState({ projects: 0, tasks: 0, completedTasks: 0, pendingTasks: 0 })
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    const load = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await dashboardApi.get()
        if (!controller.signal.aborted) {
          setTotals(data.totals || { projects: 0, tasks: 0, completedTasks: 0, pendingTasks: 0 })
          setRecentActivity(data.recentActivity || [])
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message || 'Failed to load dashboard')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    void load()

    return () => controller.abort()
  }, [])

  const statCards = [
    { title: 'Total Projects', value: String(totals.projects) },
    { title: 'Total Tasks', value: String(totals.tasks) },
    { title: 'Completed Tasks', value: String(totals.completedTasks) },
    { title: 'Pending Tasks', value: String(totals.pendingTasks) },
  ]

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[length:var(--text-h2)] font-semibold text-[var(--color-text)]">
          Welcome back{user?.username ? `, ${user.username}` : ''}.
        </p>
        <p className="mt-1 text-[15px] text-[var(--color-text-muted)]">Here&apos;s what&apos;s happening with your projects today.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <StatCard key={card.title} card={card} />
        ))}
      </div>

      <div>
        <h2 className="mb-3 text-[length:var(--text-h4)] font-semibold text-[var(--color-text)]">
          Recent Activity
        </h2>

        {loading && (
          <p className="text-sm text-[var(--color-text-muted)]">Loading recent activity...</p>
        )}

        {!loading && error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        {!loading && !error && recentActivity.length === 0 && (
          <p className="text-sm text-[var(--color-text-muted)]">No activity yet. Create a project or task to get started.</p>
        )}

        {!loading && !error && recentActivity.length > 0 && (
          <div className="rounded-sm border border-[var(--color-border)] bg-[var(--color-surface)]">
            {recentActivity.map((activity, index) => {
              const { Icon, iconBg } = activityIcon(activity)

              return (
                <div
                  key={`${activity.type}-${activity.id}`}
                  className={`flex items-start gap-4 p-4 ${index !== recentActivity.length - 1
                    ? 'border-b border-[var(--color-border-light)]'
                    : ''
                    }`}
                >
                  <div className={`${iconBg} flex h-9 w-9 shrink-0 items-center justify-center rounded-sm`}>
                    <Icon className="h-4.5 w-4.5 text-[var(--color-text)]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-semibold text-[var(--color-text)]">
                      {activityLabel(activity)}
                    </p>
                  </div>

                  <span className="shrink-0 text-xs text-[var(--color-text-muted)]">
                    {formatRelativeTime(activity.timestamp)}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage
