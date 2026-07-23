import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/Auth/LoginPage'
import SignupPage from './pages/Auth/SignupPage'
import AppLayout from './components/Layout/AppLayout'
import DashboardPage from './pages/DashboardPage'
import ProjectsPage from './pages/ProjectsPage'
import TasksPage from './pages/TasksPage'
import ProfilePage from './pages/ProfilePage'
import { useAuth } from './hooks/useAuth'

const ProtectedRoute = ({ children }) => {
  const { loading, isAuthenticated } = useAuth()

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />
}

const PublicOnlyRoute = ({ children }) => {
  const { loading, isAuthenticated } = useAuth()

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children
}

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
        <Route path="/signup" element={<PublicOnlyRoute><SignupPage /></PublicOnlyRoute>} />

        <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
