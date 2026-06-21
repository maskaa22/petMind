import { useNavigate } from 'react-router-dom'
import { ROUTES, SECTION_IDS } from '@/lib/constants'
import { Icon } from '@/components/Icon'
import styles from './Footer.module.scss'

const FOOTER_LINKS = {
  Product: [
    { label: 'How it works', href: `#${SECTION_IDS.HERO}` },
    { label: 'Benefits', href: `#${SECTION_IDS.BENEFITS}` },
    { label: 'Personality Types', href: '#' },
    { label: 'Reviews', href: `#${SECTION_IDS.SOCIAL_PROOF}` },
    { label: 'FAQ', href: `#${SECTION_IDS.FAQ}` },
  ],
  Dashboard: [
    { label: 'My Reports', href: ROUTES.REPORTS, internal: true },
    { label: 'AI Chat', href: ROUTES.AI_CHAT, internal: true },
    { label: 'Journal', href: ROUTES.JOURNAL, internal: true },
    { label: 'Settings', href: ROUTES.SETTINGS, internal: true },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
    { label: 'Contact Us', href: '#' },
  ],
}

const SOCIALS = [
  { icon: 'heart' as const, label: 'Instagram', href: '#' },
  { icon: 'message-circle' as const, label: 'TikTok', href: '#' },
  { icon: 'users' as const, label: 'Facebook', href: '#' },
]

export function Footer() {
  const navigate = useNavigate()

  const handleLink = (href: string, internal?: boolean) => {
    if (internal) { navigate(href); return }
    if (href.startsWith('#')) {
      const id = href.replace('#', '')
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

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
          <div className={styles.socials}>
            {SOCIALS.map(s => (
              <a key={s.label} href={s.href} className={styles.socialBtn} aria-label={s.label}>
                <Icon name={s.icon} size={16} />
              </a>
            ))}
          </div>
          <div className={styles.badge}>
            <Icon name="shield" size={14} />
            <span>100% secure & private</span>
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(FOOTER_LINKS).map(([title, links]) => (
          <div key={title} className={styles.col}>
            <h4 className={styles.colTitle}>{title}</h4>
            <ul className={styles.colList}>
              {links.map(link => (
                <li key={link.label}>
                  <button
                    className={styles.colLink}
                    onClick={() => handleLink(link.href, (link as { internal?: boolean }).internal)}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className={styles.bottom}>
        <div className={styles.bottomInner}>
          <span className={styles.copyright}>
            © 2025 petMind · Made with <Icon name="heart" size={12} /> for pet lovers
          </span>
          <div className={styles.pawRow} aria-hidden="true">
            <Icon name="paw-print" size={14} />
            <Icon name="paw-print" size={10} />
            <Icon name="paw-print" size={14} />
          </div>
        </div>
      </div>
    </footer>
  )
}
