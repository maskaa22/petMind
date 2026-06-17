import { Icon } from '@/components/Icon'
import type { IconName } from '@/components/Icon'
import styles from './Benefits.module.scss'

const BENEFITS: { icon: IconName; title: string; desc: string }[] = [
  {
    icon: 'brain',
    title: 'Behavioral AI Analysis',
    desc: 'Deep pattern recognition trained on millions of behavioral data points to give you accurate insights.',
  },
  {
    icon: 'target',
    title: 'Personality Profiling',
    desc: 'Discover which of 8 core archetypes best describes your pet and what drives their actions.',
  },
  {
    icon: 'message-circle',
    title: 'Communication Decoder',
    desc: 'Learn to read the signals your pet sends every day — from body language to vocal cues.',
  },
  {
    icon: 'heart',
    title: 'Emotional Needs Report',
    desc: "Understand your pet's hidden emotional needs to build a stronger, happier relationship.",
  },
  {
    icon: 'sparkles',
    title: 'Personalized Recommendations',
    desc: 'Actionable care tips tailored to your pet\'s unique profile, age, and behavior patterns.',
  },
  {
    icon: 'trending-up',
    title: 'Progress Tracking',
    desc: 'Log daily moods and activities to track how your pet evolves over time.',
  },
]

export function Benefits() {
  return (
    <section id="benefits" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <div className={styles.tag}>Features</div>
          <h2 className={styles.title}>Everything you need to understand your pet</h2>
          <p className={styles.sub}>Science-backed behavioral analysis, delivered in a simple and beautiful report.</p>
        </div>
        <div className={styles.grid}>
          {BENEFITS.map(({ icon, title, desc }) => (
            <div key={title} className={styles.card}>
              <div className={styles.iconWrap}>
                <Icon name={icon} size={22} />
              </div>
              <h3 className={styles.cardTitle}>{title}</h3>
              <p className={styles.cardDesc}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
