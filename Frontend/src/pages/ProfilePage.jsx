import { Building2, CalendarDays, LockKeyhole, MapPin, Pencil } from 'lucide-react'
import Profile from '../assets/profile.png'
import PrimaryButton from '../components/Form/PrimaryButton'
import TextInput from '../components/Form/TextInput'

const profileDetails = [
  { icon: Building2, label: 'Engineering Lead at TeamBoard' },
  { icon: MapPin, label: 'San Francisco, CA' },
  { icon: CalendarDays, label: 'Joined October 2023' },
]

const ProfilePage = () => {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-[length:var(--text-h2)] font-semibold text-[var(--color-text)]">Profile</p>
        <p className="text-[15px] text-[var(--color-text-muted)]">Manage your account settings and preferences.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[316px_minmax(0,1fr)]">
        <section className="rounded-sm border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <div className="flex flex-col items-center text-center">
            <div className="h-[124px] w-[124px] overflow-hidden rounded-lg border-4 border-white shadow-sm">
              <img src={Profile} alt="Alex Rivera" className="h-full w-full object-cover" />
            </div>

            <div className="mt-5">
              <p className="text-base font-semibold text-[var(--color-text)]">Alex Rivera</p>
              <p className="text-[15px] text-[var(--color-text-secondary)]">alex.rivera@teamboard.io</p>
            </div>

            <PrimaryButton className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)]">
              <Pencil className="h-4 w-4" />
              Edit Profile
            </PrimaryButton>
          </div>

          <div className="mt-6 space-y-4 border-t border-[var(--color-border-light)] pt-6">
            {profileDetails.map((detail) => {
              const Icon = detail.icon

              return (
                <div key={detail.label} className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                  <Icon className="h-4 w-4 shrink-0 text-[var(--color-text-muted)]" />
                  <span>{detail.label}</span>
                </div>
              )
            })}
          </div>
        </section>

        <section className="rounded-sm border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <div className="flex items-center gap-2">
            <LockKeyhole className="h-5 w-5 text-[var(--color-text)]" />
            <p className="text-base font-semibold text-[var(--color-text)]">Change Password</p>
          </div>

          <form className="mt-6 space-y-4">
            <label className="block text-sm text-[var(--color-text-secondary)]">
              Current Password
              <TextInput
                id="current-password"
                name="currentPassword"
                type="password"
                value={''}
                onChange={''}
                className="mt-2 h-10 bg-[var(--color-background)] text-[var(--color-text)] placeholder:not-italic focus:border-[var(--color-ring)]"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm text-[var(--color-text-secondary)]">
                New Password
                <TextInput
                  id="new-password"
                  name="newPassword"
                  type="password"
                  value={''}
                  onChange={''}
                  className="mt-2 h-10 bg-[var(--color-background)] text-[var(--color-text)] placeholder:not-italic focus:border-[var(--color-ring)]"
                />
              </label>

              <label className="block text-sm text-[var(--color-text-secondary)]">
                Confirm New Password
                <TextInput
                  id="confirm-new-password"
                  name="confirmNewPassword"
                  type="password"
                  value={''}
                  onChange={''}
                  className="mt-2 h-10 bg-[var(--color-background)] text-[var(--color-text)] placeholder:not-italic focus:border-[var(--color-ring)]"
                />
              </label>
            </div>

            <PrimaryButton
              type="button"
              className="inline-flex rounded-sm bg-[var(--color-primary)] px-8 py-2.5 text-sm font-semibold text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)]"
            >
              Update Password
            </PrimaryButton>
          </form>
        </section>
      </div>
    </div>
  )
}

export default ProfilePage