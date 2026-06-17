import { Button } from '@/components/Button'
import styles from './SettingsPage.module.scss'

export function SettingsPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Settings</h1>

      <div className={styles.sections}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Account</h2>
          <div className={styles.fieldGroup}>
            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <input className={styles.input} type="email" defaultValue="user@example.com" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Name</label>
              <input className={styles.input} type="text" defaultValue="" placeholder="Your name" />
            </div>
            <Button>Save Changes</Button>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Subscription</h2>
          <div className={styles.planInfo}>
            <div className={styles.planBadge}>Premium — Yearly</div>
            <p className={styles.planDesc}>Your subscription renews annually. Cancel anytime from here.</p>
            <Button variant="secondary">Manage Subscription</Button>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Notifications</h2>
          <div className={styles.toggleList}>
            {['Weekly insights email', 'Mood reminders', 'New feature announcements'].map(n => (
              <div key={n} className={styles.toggle}>
                <span className={styles.toggleLabel}>{n}</span>
                <div className={styles.toggleSwitch} />
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Data</h2>
          <div className={styles.dangerZone}>
            <p className={styles.dangerDesc}>Permanently delete all your data and close your account.</p>
            <Button variant="secondary">Delete Account</Button>
          </div>
        </section>
      </div>
    </div>
  )
}
