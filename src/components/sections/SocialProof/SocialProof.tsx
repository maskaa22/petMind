import { Icon } from '@/components/Icon'
import styles from './SocialProof.module.scss'

const METRICS = [
  { value: '50,000+', label: 'Reports Generated', icon: '📊' },
  { value: '4.9 / 5', label: 'Average Rating', icon: '⭐' },
  { value: '120+', label: 'Countries', icon: '🌍' },
  { value: '98%', label: 'Accuracy Score', icon: '🎯' },
]

const TESTIMONIALS = [
  {
    quote: "I finally understand why my cat ignores me at night. The personality report was scarily accurate!",
    author: 'Sarah M.',
    role: 'Cat owner, 3 years',
    initials: 'SM',
    color: '#e8622a',
  },
  {
    quote: "My golden retriever's report nailed every single trait. Now I know why he acts out when guests come over.",
    author: 'James K.',
    role: 'Dog owner, 5 years',
    initials: 'JK',
    color: '#1a3a4a',
  },
  {
    quote: "The AI Coach answered questions my vet couldn't. It even caught an anxiety pattern I had been dismissing.",
    author: 'Priya L.',
    role: 'Rabbit owner, 2 years',
    initials: 'PL',
    color: '#5a9e3a',
  },
]

export function SocialProof() {
  return (
    <section id="social-proof" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.metrics}>
          {METRICS.map(({ value, label, icon }) => (
            <div key={label} className={styles.metric}>
              <span className={styles.metricIcon}>{icon}</span>
              <span className={styles.metricValue}>{value}</span>
              <span className={styles.metricLabel}>{label}</span>
            </div>
          ))}
        </div>

        <div className={styles.header}>
          <div className={styles.ribbon}>🐾 Testimonials</div>
          <h2 className={styles.title}>Trusted by pet owners worldwide</h2>
          <p className={styles.sub}>Real stories from real pet owners who finally understand their animals.</p>
        </div>

        <div className={styles.testimonials}>
          {TESTIMONIALS.map(({ quote, author, role, initials, color }) => (
            <div key={author} className={styles.card}>
              <div className={styles.stars}>
                {[1,2,3,4,5].map(i => (
                  <Icon key={i} name="star" size={14} className={styles.starIcon} />
                ))}
              </div>
              <p className={styles.quote}>"{quote}"</p>
              <div className={styles.author}>
                <div className={styles.avatar} style={{ background: color }}>
                  {initials}
                </div>
                <div>
                  <span className={styles.authorName}>{author}</span>
                  <span className={styles.authorRole}>{role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
