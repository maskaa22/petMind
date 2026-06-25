import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { getPets } from '@/lib/db'
import { Icon } from '@/components/Icon'
import { Button } from '@/components/Button'
import styles from './AuthPage.module.scss'

type Mode = 'signin' | 'signup'

export function AuthPage() {
  const navigate = useNavigate()
  const { signIn, signUp } = useAuth()

  const [mode, setMode] = useState<Mode>('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isSignup = mode === 'signup'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setNotice(null)

    if (!/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }

    setLoading(true)
    const { error } = isSignup
      ? await signUp(email, password, name.trim() || undefined)
      : await signIn(email, password)
    setLoading(false)

    if (error) { setError(error); return }

    if (isSignup) {
      // If email confirmation is on, there's no session yet.
      setNotice('Account created! Check your email to confirm, then sign in.')
      setMode('signin')
      return
    }

    // Signed in → if they already have a pet, hydrate it and go to the dashboard.
    const { data } = await supabase.auth.getUser()
    const uid = data.user?.id
    if (uid) {
      const pets = await getPets(uid)
      const pet = pets[0]
      if (pet?.quiz) {
        localStorage.setItem('petmind_quiz', JSON.stringify(pet.quiz))
        localStorage.setItem('petmind_active_pet', pet.id)
        navigate(ROUTES.DASHBOARD)
        return
      }
    }
    navigate(ROUTES.QUIZ)
  }

  function switchMode(m: Mode) {
    setMode(m)
    setError(null)
    setNotice(null)
  }

  return (
    <div className={styles.page}>
      {/* decorative corners */}
      <div className={styles.cornerOrange} aria-hidden="true" />
      <div className={styles.cornerTeal} aria-hidden="true" />

      <div className={styles.card}>
        <Link to={ROUTES.HOME} className={styles.logo}>
          <span className={styles.logoIcon}><Icon name="paw-print" size={20} /></span>
          <span className={styles.logoText}>pet<strong>Mind</strong></span>
        </Link>

        <h1 className={styles.title}>
          {isSignup ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className={styles.subtitle}>
          {isSignup
            ? 'Start understanding your pet today 🐾'
            : 'Sign in to see your pet’s dashboard.'}
        </p>

        {/* Mode toggle */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${isSignup ? styles.tabActive : ''}`}
            onClick={() => switchMode('signup')}
            type="button"
          >
            Sign up
          </button>
          <button
            className={`${styles.tab} ${!isSignup ? styles.tabActive : ''}`}
            onClick={() => switchMode('signin')}
            type="button"
          >
            Sign in
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {isSignup && (
            <label className={styles.field}>
              <span className={styles.label}>Name</span>
              <input
                className={styles.input}
                placeholder="Jane"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </label>
          )}

          <label className={styles.field}>
            <span className={styles.label}>Email</span>
            <input
              className={styles.input}
              type="email"
              placeholder="jane@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Password</span>
            <input
              className={styles.input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete={isSignup ? 'new-password' : 'current-password'}
            />
          </label>

          {error && <div className={styles.error}>{error}</div>}
          {notice && <div className={styles.notice}>{notice}</div>}

          <Button type="submit" size="lg" fullWidth disabled={loading}>
            {loading ? 'Please wait…' : isSignup ? 'Create account 🐾' : 'Sign in'}
          </Button>
        </form>

        <p className={styles.switch}>
          {isSignup ? 'Already have an account?' : 'New to PetMind?'}{' '}
          <button
            type="button"
            className={styles.switchLink}
            onClick={() => switchMode(isSignup ? 'signin' : 'signup')}
          >
            {isSignup ? 'Sign in' : 'Create one'}
          </button>
        </p>
      </div>
    </div>
  )
}
