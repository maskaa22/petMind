import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES, ANALYSIS_MESSAGES } from '@/lib/constants'
import { Icon } from '@/components/Icon'
import styles from './AnalysisPage.module.scss'

export function AnalysisPage() {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)
  const [messageIdx, setMessageIdx] = useState(0)

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

    const navTimer = setTimeout(() => navigate(ROUTES.PAYWALL), duration + 500)

    return () => {
      clearInterval(progressTimer)
      clearInterval(messageTimer)
      clearTimeout(navTimer)
    }
  }, [navigate])

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.orbitWrap}>
          <div className={styles.orbit1}>
            <div className={styles.dot} />
          </div>
          <div className={styles.orbit2}>
            <div className={styles.dot} />
          </div>
          <div className={styles.orbit3}>
            <div className={styles.dot} />
          </div>
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
