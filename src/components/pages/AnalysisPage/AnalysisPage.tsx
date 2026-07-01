import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES, ANALYSIS_MESSAGES } from '@/lib/constants'
import { useAuth } from '@/lib/auth'
import { getPets } from '@/lib/db'
import { Icon } from '@/components/Icon'
import styles from './AnalysisPage.module.scss'

export function AnalysisPage() {
  const navigate = useNavigate()
  const { premium, user, session } = useAuth()
  const [progress, setProgress] = useState(0)
  const [messageIdx, setMessageIdx] = useState(0)

  // How many pets the user already has — used to skip the paywall for returning users.
  const petCount = useRef(0)
  useEffect(() => {
    if (user) getPets(user.id).then(p => { petCount.current = p.length })
  }, [user])

  useEffect(() => {
    const duration = 10000
    const steps = 100
    const interval = duration / steps

    const progressTimer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(progressTimer); return 100 }
        return p + 1
      })
    }, interval)

    const messageTimer = setInterval(() => {
      setMessageIdx(i => (i + 1) % ANALYSIS_MESSAGES.length)
    }, 2000)

    const navTimer = setTimeout(() => {
      // Guest onboarding: no account yet → go register (pet is created after signup).
      if (!session) { navigate(ROUTES.AUTH); return }
      // Logged in: premium or a returning user (already has pets) → dashboard,
      // otherwise the paywall (first-pet onboarding).
      const onboarding = petCount.current <= 1
      navigate(premium || !onboarding ? ROUTES.DASHBOARD : ROUTES.PAYWALL)
    }, duration + 500)

    return () => {
      clearInterval(progressTimer)
      clearInterval(messageTimer)
      clearTimeout(navTimer)
    }
  }, [navigate, premium, session])

  return (
    <div className={styles.page}>
      <div className={styles.cornerOrange} />
      <div className={styles.cornerTeal} />
      <div className={styles.inner}>
        <div className={styles.pawWrap}>
          <span className={`${styles.toe} ${styles.toe1}`} />
          <span className={`${styles.toe} ${styles.toe2}`} />
          <span className={`${styles.toe} ${styles.toe3}`} />
          <span className={`${styles.toe} ${styles.toe4}`} />
          <div className={styles.core}>
            <Icon name="brain" size={32} />
          </div>
        </div>

        <div className={styles.textBlock}>
          <h2 className={styles.title}>Analyzing your pet</h2>
          <p className={styles.message}>{ANALYSIS_MESSAGES[messageIdx]}</p>
        </div>

        <div className={styles.barWrap}>
          <div className={styles.barTrack}>
            <div className={styles.barFill} style={{ width: `${progress}%` }} />
          </div>
          <span className={styles.pct}>{progress}%</span>
        </div>

        <div className={styles.chips}>
          {['Behavior patterns', 'Personality type', 'Emotional profile', 'Hidden needs'].map((chip, i) => (
            <div
              key={chip}
              className={[styles.chip, progress > i * 25 ? styles.chipDone : ''].filter(Boolean).join(' ')}
            >
              {progress > i * 25 && <Icon name="check" size={12} className={styles.chipCheck} />}
              {chip}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
