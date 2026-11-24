import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES, SECTION_IDS } from '@/lib/constants'
import { useAuth } from '@/lib/auth'
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
  const { session, signOut } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  async function logout() {
    setOpen(false)
    await signOut()
    navigate(ROUTES.HOME)
  }

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
            <Icon name="paw" size={22} />
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
          {session ? (
            <>
              <Button variant="ghost" size="sm" onClick={logout}>
                Log out
              </Button>
              <Button variant="primary" size="sm" onClick={() => navigate(ROUTES.DASHBOARD)}>
                Dashboard
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.AUTH)}>
                Log in
              </Button>
              <Button variant="primary" size="sm" onClick={() => navigate(ROUTES.QUIZ)}>
                Start Free Analysis
              </Button>
            </>
          )}
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
          {session ? (
            <>
              <Button variant="secondary" size="md" onClick={logout}>
                Log out
              </Button>
              <Button variant="primary" size="md" onClick={() => { setOpen(false); navigate(ROUTES.DASHBOARD) }}>
                Dashboard 🐾
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" size="md" onClick={() => { setOpen(false); navigate(ROUTES.AUTH) }}>
                Log in
              </Button>
              <Button variant="primary" size="md" onClick={() => { setOpen(false); navigate(ROUTES.QUIZ) }}>
                Start Free Analysis
                <span className={styles.btnPaws}>
                  <Icon name="paw" size={20} />
                  <Icon name="paw" size={14} />
                </span>
              </Button>
            </>
          )}
        </div>
      )}
    </header>
  )
}
