import { Icon } from '@/components/Icon'
import styles from './HowItWorks.module.scss'

const STEPS = [
  {
    num: '01',
    icon: 'activity' as const,
    title: 'Answer 8 quick questions',
    desc: "Tell us about your pet's behavior, mood patterns, and daily habits. Takes under 2 minutes.",
  },
  {
    num: '02',
    icon: 'brain' as const,
    title: 'AI analyzes your pet',
    desc: 'Our model cross-references 50,000+ behavioral profiles to identify your pet\'s unique personality type.',
  },
  {
    num: '03',
    icon: 'sparkles' as const,
    title: 'Get your full report',
    desc: 'Receive a detailed breakdown of personality traits, hidden needs, and personalized care recommendations.',
  },
]

export function HowItWorks() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <div className={styles.tag}>How it works</div>
          <h2 className={styles.title}>Three steps to understand your pet</h2>
          <p className={styles.sub}>No guessing. No vague advice. Just precise behavioral insights based on your pet's unique answers.</p>
        </div>

        <div className={styles.steps}>
          {STEPS.map(({ num, icon, title, desc }, i) => (
            <div key={num} className={styles.step}>
              <div className={styles.stepNum}>{num}</div>
              <div className={styles.iconWrap}>
                <Icon name={icon} size={24} />
              </div>
              <h3 className={styles.stepTitle}>{title}</h3>
              <p className={styles.stepDesc}>{desc}</p>
              {i < STEPS.length - 1 && <div className={styles.connector} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
