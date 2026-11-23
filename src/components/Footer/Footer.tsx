import { Icon } from '@/components/Icon'
import styles from './Footer.module.scss'

const SOCIALS = [
  { icon: 'heart' as const, label: 'Instagram', href: '#' },
  { icon: 'message-circle' as const, label: 'TikTok', href: '#' },
  { icon: 'users' as const, label: 'Facebook', href: '#' },
]

export function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Wave top decoration */}
      <div className={styles.wave}>
        <svg viewBox="0 0 1440 56" fill="none" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 56V28C240 0 480 56 720 28C960 0 1200 56 1440 28V56H0Z" fill="currentColor" />
        </svg>
      </div>

      <div className={styles.inner}>
        {/* Brand column */}
        <div className={styles.brand}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>
              <Icon name="paw-print" size={20} />
            </span>
            <span className={styles.logoText}>pet<strong>Mind</strong></span>
          </div>
          <p className={styles.tagline}>
            AI-powered insights to truly understand your pet's personality, needs, and emotions.
          </p>
        </div>

        {/* Badge — centered */}
        <div className={styles.colCenter}>
          <div className={styles.badge}>
            <Icon name="shield" size={14} />
            <span>100% secure & private</span>
          </div>
        </div>

        {/* Socials — rightmost column */}
        <div className={styles.colRight}>
          <div className={styles.socials}>
            {SOCIALS.map(s => (
              <span key={s.label} className={styles.socialBtn} aria-label={s.label}>
                <Icon name={s.icon} size={16} />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={styles.bottom}>
        <div className={styles.bottomInner}>
          <span className={styles.copyright}>
            © 2025 petMind · Made with <Icon name="heart" size={12} /> for pet lovers
          </span>
        </div>
      </div>
    </footer>
  )
}
