import {useMemo, useState } from 'react'
import { LockKeyhole, Pencil, Upload } from 'lucide-react'
import Profile from '../assets/profile.png'
import PrimaryButton from '../components/Form/PrimaryButton'
import TextInput from '../components/Form/TextInput'
import { userApi } from '../api/user'
import { useAuth } from '../hooks/useAuth'

const initialPasswordForm = {
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
}

const ProfilePage = () => {
  const { user, updateCurrentUser, logout } = useAuth()
  const [username, setUsername] = useState(() => user?.username || '')
const [previewUrl, setPreviewUrl] = useState(() => user?.profilePic || Profile)
  const [profilePic, setProfilePic] = useState(null)
  const [profileMessage, setProfileMessage] = useState('')
  const [profileError, setProfileError] = useState('')
  const [isProfileSaving, setIsProfileSaving] = useState(false)
  const [passwordForm, setPasswordForm] = useState(initialPasswordForm)
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isPasswordSaving, setIsPasswordSaving] = useState(false)

  const displayName = user?.username || 'TeamBoard User'
  const displayEmail = user?.email || ''
  const imageSrc = previewUrl || user?.profilePic || Profile

  const selectedFileName = useMemo(() => profilePic?.name || 'Choose profile photo', [profilePic])

  const handleProfilePicChange = (event) => {
    const file = event.target.files?.[0]
    setProfileError('')
    setProfileMessage('')

    if (!file) {
      setProfilePic(null)
      setPreviewUrl(user?.profilePic || Profile)
      return
    }

    if (!file.type.startsWith('image/')) {
      setProfileError('Please select a valid image file.')
      event.target.value = ''
      return
    }

    setProfilePic(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleProfileSubmit = async (event) => {
    event.preventDefault()
    setProfileError('')
    setProfileMessage('')

    try {
      setIsProfileSaving(true)
      const data = await userApi.updateProfile({ username, profilePic })
      updateCurrentUser(data.user)
      setProfilePic(null)
      setProfileMessage(data.message || 'Profile updated successfully')
    } catch (err) {
      setProfileError(err.message)
    } finally {
      setIsProfileSaving(false)
    }
  }

  const handlePasswordChange = (event) => {
    const { name, value } = event.target
    setPasswordError('')
    setPasswordMessage('')
    setPasswordForm((current) => ({ ...current, [name]: value }))
  }

  const handlePasswordSubmit = async (event) => {
    event.preventDefault()
    setPasswordError('')
    setPasswordMessage('')

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordError('New password and confirm password do not match.')
      return
    }

    try {
      setIsPasswordSaving(true)
      const data = await userApi.updatePassword(passwordForm)
      setPasswordForm(initialPasswordForm)
      setPasswordMessage(data.message || 'Password updated successfully. Please log in again.')
      await logout()
    } catch (err) {
      setPasswordError(err.message)
    } finally {
      setIsPasswordSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[length:var(--text-h2)] font-semibold text-[var(--color-text)]">Profile</p>
        <p className="text-[15px] text-[var(--color-text-muted)]">Manage your account settings and preferences.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[316px_minmax(0,1fr)]">
        <section className="rounded-sm border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <form className="flex flex-col items-center text-center" onSubmit={handleProfileSubmit}>
            <div className="h-[124px] w-[124px] overflow-hidden rounded-lg border-4 border-white shadow-sm">
              <img src={imageSrc} alt={displayName} className="h-full w-full object-cover" />
            </div>

            <div className="mt-5">
              <p className="text-base font-semibold text-[var(--color-text)]">{displayName}</p>
              <p className="text-[15px] text-[var(--color-text-secondary)]">{displayEmail}</p>
            </div>

            <label className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text)]">
              <Upload className="h-4 w-4" />
              <span className="truncate">{selectedFileName}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleProfilePicChange} />
            </label>

            <label className="mt-4 block w-full text-left text-sm text-[var(--color-text-secondary)]">
              Name
              <TextInput
                id="username"
                name="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Your name"
                className="mt-2 h-10 bg-[var(--color-background)] text-[var(--color-text)] placeholder:not-italic focus:border-[var(--color-ring)]"
              />
            </label>

            {profileError ? <p className="mt-3 w-full text-left text-sm text-red-600">{profileError}</p> : null}
            {profileMessage ? <p className="mt-3 w-full text-left text-sm text-green-600">{profileMessage}</p> : null}

            <PrimaryButton
              type="submit"
              disabled={isProfileSaving}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] disabled:opacity-70"
            >
              <Pencil className="h-4 w-4" />
              {isProfileSaving ? 'Updating...' : 'Update Profile'}
            </PrimaryButton>
          </form>
        </section>

        <section className="rounded-sm border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <div className="flex items-center gap-2">
            <LockKeyhole className="h-5 w-5 text-[var(--color-text)]" />
            <p className="text-base font-semibold text-[var(--color-text)]">Change Password</p>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handlePasswordSubmit}>
            <label className="block text-sm text-[var(--color-text-secondary)]">
              Current Password
              <TextInput
                id="current-password"
                name="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                className="mt-2 h-10 bg-[var(--color-background)] text-[var(--color-text)] placeholder:not-italic focus:border-[var(--color-ring)]"
                required
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm text-[var(--color-text-secondary)]">
                New Password
                <TextInput
                  id="new-password"
                  name="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="mt-2 h-10 bg-[var(--color-background)] text-[var(--color-text)] placeholder:not-italic focus:border-[var(--color-ring)]"
                  required
                />
              </label>

              <label className="block text-sm text-[var(--color-text-secondary)]">
                Confirm New Password
                <TextInput
                  id="confirm-new-password"
                  name="confirmNewPassword"
                  type="password"
                  value={passwordForm.confirmNewPassword}
                  onChange={handlePasswordChange}
                  className="mt-2 h-10 bg-[var(--color-background)] text-[var(--color-text)] placeholder:not-italic focus:border-[var(--color-ring)]"
                  required
                />
              </label>
            </div>

            {passwordError ? <p className="text-sm text-red-600">{passwordError}</p> : null}
            {passwordMessage ? <p className="text-sm text-green-600">{passwordMessage}</p> : null}

            <PrimaryButton
              type="submit"
              disabled={isPasswordSaving}
              className="inline-flex rounded-sm bg-[var(--color-primary)] px-8 py-2.5 text-sm font-semibold text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] disabled:opacity-70"
            >
              {isPasswordSaving ? 'Updating...' : 'Update Password'}
            </PrimaryButton>
          </form>
        </section>
      </div>
    </div>
  )
}

export default ProfilePage