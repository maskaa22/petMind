import { NavLink, Outlet } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import { Icon } from '@/components/Icon'
import type { IconName } from '@/components/Icon'
import styles from './DashboardLayout.module.scss'

const NAV_ITEMS: { to: string; label: string; icon: IconName; end?: boolean }[] = [
  { to: ROUTES.DASHBOARD, label: 'Dashboard', icon: 'home', end: true },
  { to: ROUTES.REPORTS, label: 'Reports', icon: 'bar-chart' },
  { to: ROUTES.AI_CHAT, label: 'AI Chat', icon: 'message-circle' },
  { to: ROUTES.JOURNAL, label: 'Journal', icon: 'book-open' },
  { to: ROUTES.SETTINGS, label: 'Settings', icon: 'settings' },
]

function getPetName() {
  try { return JSON.parse(localStorage.getItem('petmind_quiz') || '{}').petName || 'Your pet' }
  catch { return 'Your pet' }
}

function getToday() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric', year: 'numeric',
  })
}

export function DashboardLayout() {
  const petName = getPetName()
  const today = getToday()

  return (
    <div className={styles.shell}>
      {/* ── Sidebar (desktop) ── */}
      <nav className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>
            <Icon name="paw-print" size={18} />
          </div>
          <span className={styles.brandName}>PetMind</span>
        </div>
        <ul className={styles.nav}>
          {NAV_ITEMS.map(({ to, label, icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  [styles.link, isActive ? styles.active : ''].filter(Boolean).join(' ')
                }
              >
                <span className={styles.iconWrap}>
                  <Icon name={icon} size={18} />
                </span>
                <span className={styles.linkLabel}>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        <div className={styles.sidebarFooter}>
          <div className={styles.plan}>
            <Icon name="sparkles" size={14} />
            <span>Premium Plan</span>
          </div>
        </div>
      </nav>

      {/* ── Wavy divider ── */}
      <div className={styles.sidebarWave} aria-hidden="true">
        <svg viewBox="0 0 36 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="sw" x="0" y="0" width="36" height="400" patternUnits="userSpaceOnUse">
              <path d="M0,0 L26,0 C26,100 10,100 10,200 C10,300 26,300 26,400 L0,400 Z" fill="#1a3a4a" />
              <path d="M26,0 C26,100 10,100 10,200 C10,300 26,300 26,400 L36,400 L36,0 Z" fill="#fff9f5" />
            </pattern>
          </defs>
          <rect width="36" height="100%" fill="url(#sw)" />
        </svg>
      </div>

      {/* ── Main area ── */}
      <main className={styles.main}>
        {/* Top bar */}
        <div className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <h1 className={styles.topBarTitle}>
              Hello! 👋 <span className={styles.topBarPet}>{petName}'s dashboard</span>
            </h1>
            <p className={styles.topBarDate}>{today}</p>
          </div>
          <div className={styles.topBarRight}>
            <button className={styles.contentBtn}>
              <span>😊</span>
              <span>Content</span>
              <span className={styles.chevron}>▾</span>
            </button>
            <div className={styles.userAvatar}>AL</div>
          </div>
        </div>

        {/* Page content */}
        <div className={styles.mainContent}>
          <Outlet />
        </div>
      </main>

      {/* ── Bottom nav (mobile) ── */}
      <nav className={styles.bottomNav}>
        {NAV_ITEMS.map(({ to, label, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              [styles.bottomLink, isActive ? styles.bottomActive : ''].filter(Boolean).join(' ')
            }
          >
            <span className={styles.bottomIconWrap}>
              <Icon name={icon} size={20} />
            </span>
            <span className={styles.bottomLabel}>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
