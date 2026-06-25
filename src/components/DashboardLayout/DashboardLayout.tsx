import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import { useAuth } from '@/lib/auth'
import { getPets } from '@/lib/db'
import type { Pet } from '@/lib/db'
import { MOODS, findMood } from '@/lib/moods'
import { Icon } from '@/components/Icon'
import type { IconName } from '@/components/Icon'
import { Loader } from '@/components/Loader'
import styles from './DashboardLayout.module.scss'

const NAV_ITEMS: { to: string; label: string; icon: IconName; end?: boolean; premium?: boolean }[] = [
  { to: ROUTES.DASHBOARD, label: 'Dashboard', icon: 'home', end: true },
  { to: ROUTES.REPORTS, label: 'Reports', icon: 'bar-chart', premium: true },
  { to: ROUTES.AI_CHAT, label: 'AI Chat', icon: 'message-circle', premium: true },
  { to: ROUTES.JOURNAL, label: 'Journal', icon: 'book-open', premium: true },
  { to: ROUTES.TRENDS, label: 'Trends', icon: 'trending-up', premium: true },
  { to: ROUTES.SETTINGS, label: 'Settings', icon: 'settings' },
]

const PET_IMAGE: Record<string, string> = {
  cat: '/cat.png',
  dog: '/dog1.png',
  rabbit: '/rabbit.png',
  bird: '/chiken.png',
  hamster: '/ho.png',
}

function getQuiz(): { petName?: string; petType?: string; petMood?: string } {
  try { return JSON.parse(localStorage.getItem('petmind_quiz') || '{}') }
  catch { return {} }
}

function getToday() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric', year: 'numeric',
  })
}

export function DashboardLayout() {
  const navigate = useNavigate()
  const { premium, user } = useAuth()
  const quiz = getQuiz()
  const petName = quiz.petName || 'Your pet'
  const today = getToday()
  const petImg = PET_IMAGE[quiz.petType ?? '']

  const [mood, setMoodState] = useState<string>(quiz.petMood || 'calm')
  const [moodOpen, setMoodOpen] = useState(false)
  const currentMood = findMood(mood)

  // ── Pets (switch between, add new) ──
  const [pets, setPets] = useState<Pet[]>([])
  const [petsOpen, setPetsOpen] = useState(false)
  const [switching, setSwitching] = useState(false)
  const activePetId = localStorage.getItem('petmind_active_pet')

  useEffect(() => {
    if (user) getPets(user.id).then(setPets)
  }, [user])

  function switchPet(pet: Pet) {
    if (!pet.quiz) return
    setPetsOpen(false)
    setSwitching(true) // show the loader before the hard reload
    localStorage.setItem('petmind_active_pet', pet.id)
    localStorage.setItem('petmind_quiz', JSON.stringify(pet.quiz))
    // Let the loader paint, then reload so every page re-reads the active pet.
    setTimeout(() => { window.location.href = ROUTES.DASHBOARD }, 60)
  }

  function addPet() {
    setPetsOpen(false)
    localStorage.removeItem('petmind_active_pet')
    navigate(ROUTES.QUIZ)
  }

  function setMood(value: string) {
    setMoodState(value)
    setMoodOpen(false)
    // persist back into the quiz answers so it survives reloads
    try {
      const data = getQuiz()
      data.petMood = value
      localStorage.setItem('petmind_quiz', JSON.stringify(data))
    } catch { /* ignore */ }
  }

  return (
    <div className={styles.shell}>
      {switching && <Loader label="Switching pet…" />}

      {/* ── Sidebar (desktop) ── */}
      <nav className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>
            <Icon name="paw-print" size={18} />
          </div>
          <span className={styles.brandName}>PetMind</span>
        </div>
        <ul className={styles.nav}>
          {NAV_ITEMS.map(({ to, label, icon, end, premium: isPremiumItem }) => {
            const locked = isPremiumItem && !premium
            if (locked) {
              return (
                <li key={to}>
                  <button
                    className={`${styles.link} ${styles.linkLocked}`}
                    onClick={() => navigate(ROUTES.PAYWALL)}
                  >
                    <span className={styles.iconWrap}>
                      <Icon name={icon} size={18} />
                    </span>
                    <span className={styles.linkLabel}>{label}</span>
                    <Icon name="lock" size={14} className={styles.lockIcon} />
                  </button>
                </li>
              )
            }
            return (
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
            )
          })}
        </ul>
        <div className={styles.sidebarFooter}>
          {premium ? (
            <div className={styles.plan}>
              <Icon name="sparkles" size={14} />
              <span>Premium Plan</span>
            </div>
          ) : (
            <button className={styles.planFree} onClick={() => navigate(ROUTES.PAYWALL)}>
              <Icon name="lock" size={14} />
              <span>Free Plan — Upgrade</span>
            </button>
          )}
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
            <div className={styles.moodPicker}>
              <button
                className={styles.contentBtn}
                onClick={() => setMoodOpen(o => !o)}
                aria-expanded={moodOpen}
              >
                <span>{currentMood.emoji}</span>
                <span>{currentMood.label}</span>
                <span className={`${styles.chevron} ${moodOpen ? styles.chevronOpen : ''}`}>▾</span>
              </button>
              {moodOpen && (
                <>
                  <div className={styles.moodBackdrop} onClick={() => setMoodOpen(false)} />
                  <ul className={styles.moodMenu}>
                    {MOODS.map(m => (
                      <li key={m.value}>
                        <button
                          className={`${styles.moodOption} ${m.value === mood ? styles.moodOptionActive : ''}`}
                          onClick={() => setMood(m.value)}
                        >
                          <span>{m.emoji}</span>
                          <span>{m.label}</span>
                          {m.value === mood && <Icon name="check" size={14} className={styles.moodCheck} />}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {/* Pet switcher */}
            <div className={styles.petPicker}>
              <button
                className={styles.userAvatar}
                onClick={() => setPetsOpen(o => !o)}
                aria-label="Switch pet"
                aria-expanded={petsOpen}
              >
                {petImg
                  ? <img src={petImg} alt={petName} className={styles.userAvatarImg} />
                  : '🐾'}
              </button>

              {petsOpen && (
                <>
                  <div className={styles.moodBackdrop} onClick={() => setPetsOpen(false)} />
                  <ul className={styles.petMenu}>
                    <li className={styles.petMenuTitle}>Your pets</li>
                    {pets.map(p => {
                      const img = PET_IMAGE[p.quiz?.petType ?? '']
                      const isActive = p.id === activePetId || (!activePetId && p.quiz?.petName === quiz.petName)
                      return (
                        <li key={p.id}>
                          <button
                            className={`${styles.petOption} ${isActive ? styles.petOptionActive : ''}`}
                            onClick={() => switchPet(p)}
                          >
                            <span className={styles.petOptionImg}>
                              {img ? <img src={img} alt="" /> : '🐾'}
                            </span>
                            <span className={styles.petOptionName}>{p.name}</span>
                            {isActive && <Icon name="check" size={14} className={styles.moodCheck} />}
                          </button>
                        </li>
                      )
                    })}
                    <li>
                      <button className={styles.petAdd} onClick={addPet}>
                        <span className={styles.petAddIcon}>+</span>
                        Add a pet
                      </button>
                    </li>
                  </ul>
                </>
              )}
            </div>

            {/* Quick add-pet button */}
            <button className={styles.addPetBtn} onClick={addPet} aria-label="Add a pet">
              +
            </button>
          </div>
        </div>

        {/* Page content */}
        <div className={styles.mainContent}>
          <Outlet context={{ mood, setMood }} />
        </div>
      </main>

      {/* ── Bottom nav (mobile) ── */}
      <nav className={styles.bottomNav}>
        {NAV_ITEMS.map(({ to, label, icon, end, premium: isPremiumItem }) => {
          const locked = isPremiumItem && !premium
          if (locked) {
            return (
              <button
                key={to}
                className={`${styles.bottomLink} ${styles.bottomLocked}`}
                onClick={() => navigate(ROUTES.PAYWALL)}
              >
                <span className={styles.bottomIconWrap}>
                  <Icon name="lock" size={18} />
                </span>
                <span className={styles.bottomLabel}>{label}</span>
              </button>
            )
          }
          return (
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
          )
        })}
      </nav>
    </div>
  )
}
