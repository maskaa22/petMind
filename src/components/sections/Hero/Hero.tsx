import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import { Button } from '@/components/Button'
import styles from './Hero.module.scss'

export function Hero() {
  const navigate = useNavigate()
  return (
    <section className={styles.hero}>
      <div className={styles.cornerOrange} />
      <div className={styles.cornerTeal} />

      <div className={styles.inner}>
        <div className={styles.left}>
          <div className={styles.petBubble}>
            <span className={styles.petDog}>🐶</span>
            <span className={styles.petCat}>🐱</span>
          </div>
        </div>

        <div className={styles.center}>
          <div className={styles.eyebrow}>
            <span>🐾</span> AI-Powered Pet Insights
          </div>

          <h1 className={styles.headline}>
            What is your pet<br />
            <span className={styles.highlight}>trying to tell you?</span>
          </h1>

          <p className={styles.sub}>
            Discover your pet's personality type, hidden emotional needs, and communication patterns — in under 2 minutes.
          </p>

          <div className={styles.actions}>
            <Button variant="primary" size="lg" onClick={() => navigate(ROUTES.QUIZ)}>
              Start Free Analysis 🐾
            </Button>
            <span className={styles.hint}>No credit card · Takes 2 minutes</span>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>50K+</span>
              <span className={styles.statLabel}>Reports</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statValue}>4.9★</span>
              <span className={styles.statLabel}>Rating</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statValue}>120+</span>
              <span className={styles.statLabel}>Countries</span>
            </div>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.petBubbleRight}>
            <span className={styles.petCat2}>🐈</span>
            <span className={styles.petRabbit}>🐰</span>
          </div>
        </div>
      </div>
    </section>
  )
}
