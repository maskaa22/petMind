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

export function DashboardLayout() {
  return (
    <div className={styles.shell}>
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

      <main className={styles.main}>
        <Outlet />
      </main>

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
