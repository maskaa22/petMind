import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/Button'
import { ConfirmModal } from '@/components/ConfirmModal'
import { usePrefs, setPref } from '@/lib/prefs'
import type { PrefKey } from '@/lib/prefs'
import { useAuth } from '@/lib/auth'
import { deleteAccount as dbDeleteAccount, updateProfileName } from '@/lib/db'
import { ROUTES } from '@/lib/constants'
import { playClick } from '@/lib/sound'
import styles from './SettingsPage.module.scss'

// In-app preferences — stored locally in the browser (no backend / email).
const PREFS: { key: PrefKey; label: string; hint: string }[] = [
  { key: 'dailyTip',     label: 'Show daily tip on dashboard', hint: 'Display the tip banner on your dashboard' },
  { key: 'soundEffects', label: 'Interface sound effects',     hint: 'Play subtle sounds on actions' },
  { key: 'reduceMotion', label: 'Reduce animations',           hint: 'Minimise motion across the app' },
]

export function SettingsPage() {
  const navigate = useNavigate()
  const prefs = usePrefs()
  const { user, profile, premium, setPremium, signOut, refreshProfile } = useAuth()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [name, setName] = useState('')
  const [savingName, setSavingName] = useState(false)
  const [nameSaved, setNameSaved] = useState(false)

  // Sync the editable name when the profile loads.
  useEffect(() => {
    setName(profile?.name ?? '')
  }, [profile?.name])

  async function saveName() {
    if (!user || savingName) return
    setSavingName(true)
    setNameSaved(false)
    const { error } = await updateProfileName(user.id, name.trim())
    setSavingName(false)
    if (!error) {
      await refreshProfile()
      setNameSaved(true)
      setTimeout(() => setNameSaved(false), 2000)
    }
  }

  function toggle(key: PrefKey) {
    setPref(key, !prefs[key])
    // Audible feedback (only sounds if the sound pref is currently on).
    playClick()
  }

  async function cancelPlan() {
    await setPremium(false)
  }

  async function deleteAccount() {
    // Remove the user + all their data (pets, journal, profile) from the DB.
    const { error } = await dbDeleteAccount()
    if (error) console.error('Delete account failed:', error)
    localStorage.clear()
    await signOut()
    navigate(ROUTES.HOME)
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Settings</h1>

      <div className={styles.sections}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Account</h2>
          <div className={styles.fieldGroup}>
            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <input className={styles.input} type="email" value={user?.email ?? ''} readOnly />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Name</label>
              <input
                className={styles.input}
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <Button
              className={styles.actionBtn}
              onClick={saveName}
              disabled={savingName || name.trim() === (profile?.name ?? '')}
            >
              {savingName ? 'Saving…' : nameSaved ? 'Saved ✓' : 'Save Changes'}
            </Button>
            <Button variant="secondary" className={styles.actionBtn} onClick={async () => { await signOut(); navigate(ROUTES.HOME) }}>
              Sign out
            </Button>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Subscription</h2>
          <div className={styles.planInfo}>
            {premium ? (
              <>
                <div className={`${styles.planBadge} ${styles.planBadgePremium}`}>✨ Premium — Active</div>
                <p className={styles.planDesc}>Your Premium subscription is active. You can cancel anytime — you'll keep access until the end of the period.</p>
                <Button variant="secondary" className={styles.actionBtn} onClick={cancelPlan}>
                  Cancel Subscription
                </Button>
              </>
            ) : (
              <>
                <div className={`${styles.planBadge} ${styles.planBadgeFree}`}>Free Plan</div>
                <p className={styles.planDesc}>You're on the Free plan with limited access. Upgrade to unlock the full profile, AI Coach and journal.</p>
                <Button className={styles.actionBtn} onClick={() => navigate(ROUTES.PAYWALL)}>
                  Upgrade to Premium
                </Button>
              </>
            )}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Preferences</h2>
          <div className={styles.toggleList}>
            {PREFS.map(p => (
              <div key={p.key} className={styles.toggle}>
                <div className={styles.toggleText}>
                  <span className={styles.toggleLabel}>{p.label}</span>
                  <span className={styles.toggleHint}>{p.hint}</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={prefs[p.key]}
                  aria-label={p.label}
                  className={`${styles.toggleSwitch} ${prefs[p.key] ? styles.toggleOn : ''}`}
                  onClick={() => toggle(p.key)}
                />
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Data</h2>
          <div className={styles.dangerZone}>
            <p className={styles.dangerDesc}>Permanently delete all your data and close your account.</p>
            <Button variant="secondary" className={styles.actionBtn} onClick={() => setDeleteOpen(true)}>Delete Account</Button>
          </div>
        </section>
      </div>

      <ConfirmModal
        open={deleteOpen}
        emoji="🗑️"
        danger
        title="Delete account?"
        message="This permanently erases all your data — quiz results, mood history and preferences. This can't be undone."
        confirmLabel="Yes, delete everything"
        cancelLabel="Keep my account"
        onConfirm={deleteAccount}
        onClose={() => setDeleteOpen(false)}
      />
    </div>
  )
}
