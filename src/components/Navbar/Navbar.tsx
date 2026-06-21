import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES, SECTION_IDS } from '@/lib/constants'
import { Button } from '@/components/Button'
import { Icon } from '@/components/Icon'
import styles from './Navbar.module.scss'

const NAV_LINKS = [
  { label: 'How it works', href: `#${SECTION_IDS.HERO}` },
  { label: 'Benefits', href: `#${SECTION_IDS.BENEFITS}` },
  { label: 'Reviews', href: `#${SECTION_IDS.SOCIAL_PROOF}` },
  { label: 'FAQ', href: `#${SECTION_IDS.FAQ}` },
]

export function Navbar() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLink = (href: string) => {
    setOpen(false)
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <nav className={styles.nav}>
        {/* Logo */}
        <a className={styles.logo} href="/" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
          <span className={styles.logoIcon}>
            <Icon name="paw-print" size={22} />
          </span>
          <span className={styles.logoText}>pet<strong>Mind</strong></span>
        </a>

        {/* Desktop links */}
        <ul className={styles.links}>
          {NAV_LINKS.map(link => (
            <li key={link.label}>
              <button className={styles.link} onClick={() => handleLink(link.href)}>
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className={styles.actions}>
          <Button variant="primary" size="sm" onClick={() => navigate(ROUTES.QUIZ)}>
            Start Free Analysis
          </Button>
        </div>

        {/* Burger */}
        <button
          className={`${styles.burger} ${open ? styles.burgerOpen : ''}`}
          onClick={() => setOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className={styles.drawer}>
          <ul className={styles.drawerLinks}>
            {NAV_LINKS.map(link => (
              <li key={link.label}>
                <button className={styles.drawerLink} onClick={() => handleLink(link.href)}>
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
          <Button variant="primary" size="md" onClick={() => { setOpen(false); navigate(ROUTES.QUIZ) }}>
            Start Free Analysis 🐾
          </Button>
        </div>
      )}
    </header>
  )
}
