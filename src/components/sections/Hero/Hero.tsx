import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import { Button } from '@/components/Button'
import { Icon } from '@/components/Icon'
import styles from './Hero.module.scss'

const TRUST_AVATARS = ['S', 'J', 'A', 'M', 'R']

export function Hero() {
  const navigate = useNavigate()
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            AI-Powered Pet Behavioral Analysis
          </div>

          <h1 className={styles.headline}>
            What is your pet
            <br />
            <span className={styles.highlight}>trying to tell you?</span>
          </h1>

          <p className={styles.sub}>
            Uncover your pet's personality type, hidden emotional needs, and communication patterns — in under 2 minutes.
          </p>

          <div className={styles.actions}>
            <Button variant="accent" size="lg" onClick={() => navigate(ROUTES.QUIZ)}>
              Start Free Analysis
              <Icon name="arrow-right" size={18} />
            </Button>
            <button className={styles.demoBtn} onClick={() => navigate(ROUTES.QUIZ)}>
              See example report
            </button>
          </div>

          <div className={styles.social}>
            <div className={styles.avatars}>
              {TRUST_AVATARS.map((l) => (
                <div key={l} className={styles.avatar}>{l}</div>
              ))}
            </div>
            <div className={styles.socialText}>
              <span className={styles.rating}>
                {[1,2,3,4,5].map(i => (
                  <Icon key={i} name="star" size={13} className={styles.starIcon} />
                ))}
              </span>
              <span>Trusted by <strong>50,000+</strong> pet owners</span>
            </div>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.blob1} />
          <div className={styles.blob2} />

          <div className={styles.phone}>
            <div className={styles.phoneNotch} />
            <div className={styles.phoneContent}>
              <div className={styles.appHeader}>
                <span className={styles.appHeaderTitle}>Luna's Report</span>
                <span className={styles.appHeaderBadge}>New</span>
              </div>

              <div className={styles.petCard}>
                <div className={styles.petAvatar}>
                  <span className={styles.petAvatarEmoji}>🐱</span>
                </div>
                <div>
                  <div className={styles.petName}>Luna</div>
                  <div className={styles.petType}>The Dreamer</div>
                </div>
                <div className={styles.petScore}>98<span>%</span></div>
              </div>

              <div className={styles.bars}>
                {[
                  { label: 'Empathy', val: 88 },
                  { label: 'Curiosity', val: 74 },
                  { label: 'Sociability', val: 52 },
                ].map(({ label, val }) => (
                  <div key={label} className={styles.barRow}>
                    <span className={styles.barLabel}>{label}</span>
                    <div className={styles.barTrack}>
                      <div className={styles.barFill} style={{ width: `${val}%` }} />
                    </div>
                    <span className={styles.barVal}>{val}</span>
                  </div>
                ))}
              </div>

              <div className={styles.insightCard}>
                <Icon name="sparkles" size={14} className={styles.insightIcon} />
                <span>Luna seeks deep emotional bonds before trust</span>
              </div>
            </div>
          </div>

          <div className={styles.floatBadge}>
            <Icon name="check-circle" size={16} className={styles.floatBadgeIcon} />
            Analysis complete
          </div>
        </div>
      </div>
    </section>
  )
}
