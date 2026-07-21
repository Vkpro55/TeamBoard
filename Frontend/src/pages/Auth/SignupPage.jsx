import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LayoutDashboard } from 'lucide-react'
import AuthCard from '../../components/Auth/AuthCard'
import TextInput from '../../components/Form/TextInput'
import PrimaryButton from '../../components/Form/PrimaryButton'
import { useAuth } from '../../hooks/useAuth'

const SignupPage = () => {
  const navigate = useNavigate()
  const { signup, loading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (password !== confirmPassword) {
      return
    }

    try {
      await signup({ email, password })
      navigate('/')
    } catch {
      // error is handled by context
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface)] px-4 py-12 sm:px-6">
      <div className="flex w-full max-w-[400px] flex-col items-center">
        <div className="flex flex-col items-center pb-8">
          <div className="flex flex-col items-center gap-1">
            <LayoutDashboard className="h-[40px] w-[40px] object-fill bg-[var(--color-primary)] text-white rounded-[var(--radius-xs)]" />
            <span className="text-[16px] font-bold text-[var(--color-text)]">TeamBoard</span>
          </div>
        </div>

        <AuthCard title="Create an account">
          <form className="flex w-full flex-col items-center gap-[16px]" onSubmit={handleSubmit}>

            <div className="flex w-full flex-col items-start gap-[6px]">
              <span className="text-[12px] text-[#45464C]">Email address</span>
              <TextInput
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@company.com"
                required
              />
            </div>

            <div className="flex w-full flex-col gap-[4px]">
              <div className="flex w-full items-center">
                <span className="text-[12px] text-[#45464C]">Password</span>
              </div>
              <TextInput
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex w-full flex-col gap-[4px]">
              <div className="flex w-full items-center">
                <span className="text-[12px] text-[#45464C]">Confirm Password</span>
              </div>
              <TextInput
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error ? <p className="w-full text-sm text-red-600">{error}</p> : null}
            <PrimaryButton type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </PrimaryButton>
          </form>
        </AuthCard>

        <div className="flex flex-col items-center mt-4">
          <span className="text-[13px] text-[#45464C]">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[var(--color-text)]">
              Log in
            </Link>
          </span>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
