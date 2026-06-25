import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { getProfile, setPremium as dbSetPremium } from './db'
import type { Profile } from './db'

interface AuthContextValue {
  session: Session | null
  user: User | null
  profile: Profile | null
  premium: boolean
  loading: boolean
  signUp: (email: string, password: string, name?: string) => Promise<{ error: string | null }>
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  setPremium: (prem: boolean) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const userId = session?.user?.id ?? null

  const loadProfile = useCallback(async (id: string | null) => {
    if (!id) { setProfile(null); return }
    const p = await getProfile(id)
    setProfile(p)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session)
      await loadProfile(data.session?.user?.id ?? null)
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      loadProfile(session?.user?.id ?? null)
    })

    return () => sub.subscription.unsubscribe()
  }, [loadProfile])

  async function signUp(email: string, password: string, name?: string) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: name ? { name } : undefined,
        // After confirming via email, land on the login page.
        emailRedirectTo: `${window.location.origin}/auth`,
      },
    })
    return { error: error?.message ?? null }
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message ?? null }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setProfile(null)
  }

  async function refreshProfile() {
    await loadProfile(userId)
  }

  async function setPremium(prem: boolean) {
    if (!userId) return
    await dbSetPremium(userId, prem)
    setProfile(prev => (prev ? { ...prev, prem } : prev))
  }

  const value: AuthContextValue = {
    session,
    user: session?.user ?? null,
    profile,
    premium: profile?.prem ?? false,
    loading,
    signUp,
    signIn,
    signOut,
    refreshProfile,
    setPremium,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
