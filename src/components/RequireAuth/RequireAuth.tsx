import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { ROUTES } from '@/lib/constants'
import { Loader } from '@/components/Loader'

/** Gate for logged-in-only routes. Redirects to /auth when there's no session. */
export function RequireAuth() {
  const { session, loading } = useAuth()

  if (loading) return <Loader />

  if (!session) return <Navigate to={ROUTES.AUTH} replace />

  return <Outlet />
}
