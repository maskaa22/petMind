import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { ROUTES } from '@/lib/constants'

/** Gate for logged-in-only routes. Redirects to /auth when there's no session. */
export function RequireAuth() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a3a3a3' }}>
        Loading…
      </div>
    )
  }

  if (!session) return <Navigate to={ROUTES.AUTH} replace />

  return <Outlet />
}
