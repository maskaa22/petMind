import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { getPets, createPet } from '@/lib/db'
import { isCategory } from '@/lib/species'
import { Icon } from '@/components/Icon'
import { Button } from '@/components/Button'
import styles from './AuthPage.module.scss'

type Mode = 'signin' | 'signup'

const AGE_YEARS: Record<string, number> = { under1: 0.5, '1-3': 2, '4-7': 5, '8+': 9 }

export function AuthPage() {
  const navigate = useNavigate()
  const { signIn, signUp } = useAuth()

  // Coming straight from the quiz (guest) → default to Sign up; otherwise Sign in.
  const [mode, setMode] = useState<Mode>(() =>
    localStorage.getItem('petmind_quiz') && !localStorage.getItem('petmind_active_pet') ? 'signup' : 'signin')
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

    const { data } = await supabase.auth.getUser()
    const uid = data.user?.id

    // Sign-up with email confirmation ON → no session yet.
    if (!uid) {
      setNotice('Account created! Check your email to confirm, then sign in.')
      setMode('signin')
      return
    }

    await routeAfterAuth(uid)
  }

  // Where to go once we have a session.
  async function routeAfterAuth(uid: string) {
    const pets = await getPets(uid)

    // Returning user with pets → open their dashboard.
    if (pets.length) {
      const pet = pets[0]
      if (pet.quiz) localStorage.setItem('petmind_quiz', JSON.stringify(pet.quiz))
      localStorage.setItem('petmind_active_pet', pet.id)
      navigate(ROUTES.DASHBOARD)
      return
    }

    // No pets yet — if they just took the quiz as a guest, create the pet now
    // and continue onboarding to the paywall.
    const raw = localStorage.getItem('petmind_quiz')
    if (raw) {
      const answers = JSON.parse(raw)
      const pet = await createPet(uid, {
        name: answers.petName?.trim() || 'My pet',
        age: answers.petAge ? AGE_YEARS[answers.petAge] ?? null : null,
        subspecies: isCategory(answers.petType) ? null : (answers.petType ?? null),
        quiz: answers,
      })
      if (pet) localStorage.setItem('petmind_active_pet', pet.id)
      navigate(ROUTES.PAYWALL)
      return
    }

    // Nothing yet → take the quiz.
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
