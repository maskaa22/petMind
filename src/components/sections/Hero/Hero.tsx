import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import { Button } from '@/components/Button'
import { Icon } from '@/components/Icon'
import styles from './Hero.module.scss'

export function Hero() {
  const navigate = useNavigate()
  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.cornerOrange} />
      <div className={styles.cornerTeal} />
      {/* Wave that flows into the teal-pale HowItWorks section */}
      <div className={styles.waveBottom} aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,44 C360,80 1080,10 1440,44 L1440,80 L0,80 Z" fill="#e8f4f8" />
        </svg>
      </div>

      <div className={styles.inner}>
        <div className={styles.left}>
          <div className={styles.petBubble}>
            <img src="/dog1.webp" alt="" className={styles.petDog} />
            <img src="/cat.webp" alt="" className={styles.petCat} />
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
              Start Free Analysis
              <span className={styles.btnPaws}>
                <Icon name="paw" size={22} />
                <Icon name="paw" size={15} />
              </span>
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
            <img src="/ho.webp" alt="" className={styles.petCat2} />
            <img src="/rabbit.webp" alt="" className={styles.petRabbit} />
          </div>
        </div>
      </div>
    </section>
  )
}
