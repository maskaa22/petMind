import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import { Button } from '@/components/Button'
import styles from './CtaBanner.module.scss'

export function CtaBanner() {
  const navigate = useNavigate()
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.content}>
          <div className={styles.tag}>🐾 Free to start</div>
          <h2 className={styles.title}>
            Ready to finally understand<br />what your pet is telling you?
          </h2>
          <p className={styles.sub}>
            Join 50,000+ pet owners who have discovered their pet's personality type, hidden needs, and emotional patterns.
          </p>
          <div className={styles.actions}>
            <Button variant="primary" size="lg" onClick={() => navigate(ROUTES.QUIZ)}>
              Start Free Analysis 🐾
            </Button>
            <span className={styles.hint}>No credit card · 2 minutes</span>
          </div>
        </div>
      </div>
    </section>
  )
}
