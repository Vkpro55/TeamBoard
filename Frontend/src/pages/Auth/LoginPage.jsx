import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LayoutDashboard } from 'lucide-react';
import AuthCard from '../../components/Auth/AuthCard'
import TextInput from '../../components/Form/TextInput'
import PrimaryButton from '../../components/Form/PrimaryButton'
import { useAuth } from '../../hooks/useAuth'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login, loading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await login({ email, password })
      navigate('/')
    } catch {
      // error is handled by context
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-muted)] px-4 py-12 sm:px-6">
      <div className="flex w-full max-w-[400px] flex-col items-center">
        <div className="flex flex-col items-center pb-8">
          <div className="flex flex-col items-center gap-1">
            <LayoutDashboard className="h-[40px] w-[40px] object-fill bg-[var(--color-primary)] text-white rounded-[var(--radius-xs)]" />
            <span className="text-[16px] font-bold text-[var(--color-text)]">TeamBoard</span>
          </div>
        </div>

        <AuthCard title="Sign in">
          <form className="flex w-full flex-col items-center gap-[16px]" onSubmit={handleSubmit}>
            <div className="flex w-full flex-col items-start gap-[6px] pt-[5px]">
              <span className="text-[12px] text-[#45464C]">Email</span>
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
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center w-full">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                  className="sr-only"
                />
                <div className="mr-2 h-4 w-4 rounded-[2px] border border-[#E5E7EB] bg-[var(--color-surface)] flex items-center justify-center">
                  <svg
                    className={`${remember ? 'block' : 'hidden'} h-3 w-3 text-[#FF4DA1]`}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-[13px] text-[#45464C]">Remember Me</span>
              </label>
            </div>

            {error ? <p className="w-full text-sm text-red-600">{error}</p> : null}
            <PrimaryButton type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </PrimaryButton>
          </form>
        </AuthCard>

        <div className="flex flex-col items-center mt-4">
          <span className="text-[13px] text-[#45464C]">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="font-semibold text-[var(--color-text)]">
              Sign up
            </Link>
          </span>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
