import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import { generateReport } from '@/lib/quizLogic'
import { Icon } from '@/components/Icon'
import type { IconName } from '@/components/Icon'
import type { QuizAnswers } from '@/types'
import styles from './PaywallPage.module.scss'

const PET_IMAGE: Record<string, string> = {
  cat: '/cat.webp', dog: '/dog1.webp', rabbit: '/rabbit.webp',
  bird: '/chiken.webp', hamster: '/ho.webp', other: '/chameleon.webp',
}

const STATS = [
  { value: '60%', label: 'of owners misread their pet’s everyday signals' },
  { value: '7 in 10', label: 'pets show stress from needs that go unnoticed' },
  { value: '2 min', label: 'is all it takes to get a full, personalised care plan' },
]

const BENEFITS: { icon: IconName; title: string; text: string }[] = [
  { icon: 'message-circle', title: 'Decode their behavior', text: 'Understand what every sound, posture and mood really means — no more guessing.' },
  { icon: 'target', title: 'Train the right way', text: 'Step-by-step guidance tailored to your pet’s exact species and personality.' },
  { icon: 'bowl', title: 'Feeding & care plan', text: 'A personalised routine for food, rest, grooming and enrichment.' },
  { icon: 'message-circle', title: 'AI Coach, 24/7', text: 'Ask anything, anytime — instant answers about your pet’s wellbeing.' },
  { icon: 'trending-up', title: 'Track & improve', text: 'Journal moods and see beautiful trends so you catch changes early.' },
  { icon: 'shield', title: 'Spot problems early', text: 'Get gentle warnings when patterns hint that something’s off.' },
]

const FREE_FEATURES = [
  { label: 'Personality type revealed', included: true },
  { label: 'Basic mood snapshot', included: true },
  { label: 'Full emotional profile', included: false },
  { label: 'AI Chat coach', included: false },
  { label: 'Personalized care & training plan', included: false },
]

const PREMIUM_FEATURES = [
  'Full emotional profile (5 dimensions)',
  "AI Chat with your pet's coach",
  'Personalized care & training plan',
  'Behaviour decoder & early warnings',
  'Weekly insights & trends',
]

export function PaywallPage() {
  const navigate = useNavigate()

  const raw = localStorage.getItem('petmind_quiz')
  const answers: QuizAnswers = raw ? JSON.parse(raw) : {}
  const report = generateReport(answers)
  const petName = answers.petName || 'your pet'
  const petImg = PET_IMAGE[answers.petType ?? ''] ?? '/cat.webp'

  function chooseFree() {
    navigate(ROUTES.DASHBOARD)
  }
  // Premium is only activated on the checkout page, after payment details are filled in.
  function choosePremium() {
    navigate(ROUTES.CHECKOUT)
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>

        {/* ── Hero: result + hook ── */}
        <section className={styles.hero}>
          <img src={petImg} alt="" className={styles.heroPet} />
          <p className={styles.eyebrow}>{petName}'s results are ready 🎉</p>
          <h1 className={styles.heroTitle}>
            You know <span className={styles.hl}>{report.personalityLabel}</span>.<br />
            Now truly understand them.
          </h1>
          <p className={styles.heroSub}>
            The free quiz revealed the type. Premium turns that into a day-to-day plan —
            so {petName} gets exactly the care, training and attention they need.
          </p>
        </section>

        {/* ── Stats ── */}
        <section className={styles.stats}>
          {STATS.map(s => (
            <div key={s.label} className={styles.statCard}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </section>

        {/* ── Why premium ── */}
        <section className={styles.why}>
          <h2 className={styles.sectionTitle}>Everything {petName} needs — in one plan</h2>
          <p className={styles.sectionSub}>
            Most pets aren't difficult — they're misunderstood. Premium gives you the full picture.
          </p>
          <div className={styles.benefitGrid}>
            {BENEFITS.map(b => (
              <div key={b.title} className={styles.benefitCard}>
                <span className={styles.benefitIcon}><Icon name={b.icon} size={22} /></span>
                <h3 className={styles.benefitTitle}>{b.title}</h3>
                <p className={styles.benefitText}>{b.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Plans ── */}
        <section className={styles.plansSection}>
          <div className={styles.lockInBanner}>
            <span className={styles.lockInIcon}>🔥</span>
            <div>
              <p className={styles.lockInTitle}>This month only — lock in $9/month forever</p>
              <p className={styles.lockInSub}>Everyone who joins in {new Date().toLocaleDateString('en-US', { month: 'long' })} keeps this price for life. It goes back to $15 after.</p>
            </div>
          </div>
          <div className={styles.offerBadge}>⏳ Limited offer — 40% off, ends in 2 days</div>
          <h2 className={styles.sectionTitle}>Choose your plan</h2>

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
              <button className={styles.btnFree} onClick={chooseFree}>Get started for free</button>
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
              <p className={styles.planDescLight}>The complete picture of {petName}.</p>
              <ul className={styles.features}>
                {PREMIUM_FEATURES.map(f => (
                  <li key={f} className={styles.featPremium}>
                    <span className={styles.featIconGreen}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button className={styles.btnPremium} onClick={choosePremium}>Get Premium — $9/mo</button>
            </div>
          </div>

          <p className={styles.disclaimer}>💛 Cancel anytime · 7-day money-back guarantee</p>
        </section>
      </div>
    </div>
  )
}
