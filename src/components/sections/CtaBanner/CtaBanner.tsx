import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import styles from './CtaBanner.module.scss'

const FREE_FEATURES = [
  { label: 'Personality type revealed', included: true },
  { label: 'Basic mood snapshot',       included: true },
  { label: 'Full emotional profile',    included: false },
  { label: 'AI Chat coach',             included: false },
  { label: 'Mood journal & tracking',   included: false },
]

const PREMIUM_FEATURES = [
  'Full emotional profile (5 dimensions)',
  'AI Chat with your pet\'s coach',
  'Mood journal & progress tracking',
  'Personalized care plan',
  'Monthly report updates',
]

export function CtaBanner() {
  const navigate = useNavigate()
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>Choose your plan</h2>
        <div className={styles.offerBadge}>⏳ Limited offer — 40% off, ends in 2 days</div>

        <div className={styles.plans}>
          {/* Free */}
          <div className={styles.card}>
            <p className={styles.planName}>Free</p>
            <p className={styles.price}><span className={styles.priceAmount}>$0</span></p>
            <p className={styles.planDesc}>A taste of what your pet is all about.</p>
            <ul className={styles.features}>
              {FREE_FEATURES.map(f => (
                <li key={f.label} className={f.included ? styles.feat : styles.featOff}>
                  <span className={styles.featIcon}>{f.included ? '✓' : '✕'}</span>
                  {f.label}
                </li>
              ))}
            </ul>
            <button className={styles.btnFree} onClick={() => navigate(ROUTES.QUIZ)}>
              Get started for free
            </button>
          </div>

          {/* Premium */}
          <div className={`${styles.card} ${styles.cardPremium}`}>
            <div className={styles.popularBadge}>MOST POPULAR</div>
            <p className={styles.planNamePremium}>Premium</p>
            <p className={styles.price}>
              <span className={styles.priceAmount}>$9</span>
              <span className={styles.priceOld}>$15</span>
              <span className={styles.pricePeriod}>/month</span>
            </p>
            <p className={styles.planDescLight}>The complete picture of your pet.</p>
            <ul className={styles.features}>
              {PREMIUM_FEATURES.map(f => (
                <li key={f} className={styles.featPremium}>
                  <span className={styles.featIconGreen}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <button className={styles.btnPremium} onClick={() => navigate(ROUTES.QUIZ)}>
              Get Premium — $9/mo
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
