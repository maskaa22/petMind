import { useNavigate, useOutletContext } from 'react-router-dom'
import { generateReport } from '@/lib/quizLogic'
import { useAuth } from '@/lib/auth'
import { findMood } from '@/lib/moods'
import type { DashboardContext } from '@/lib/moods'
import { usePrefs } from '@/lib/prefs'
import { ROUTES } from '@/lib/constants'
import { ProgressBar } from '@/components/ProgressBar'
import { Icon } from '@/components/Icon'
import type { QuizAnswers } from '@/types'
import styles from './DashboardPage.module.scss'

export function DashboardPage() {
  const navigate = useNavigate()
  const { premium } = useAuth()
  const { mood, pets, journal } = useOutletContext<DashboardContext>()
  const { dailyTip } = usePrefs()

  const raw = localStorage.getItem('petmind_quiz')
  const answers: QuizAnswers = raw ? JSON.parse(raw) : {}
  const report = generateReport(answers)
  const petName = answers.petName || 'Your Pet'

  // Which pets were logged today? (data comes from the layout — no refetch)
  const todayStr = new Date().toDateString()
  const loggedTodayIds = new Set(
    journal.filter(e => new Date(e.created_at).toDateString() === todayStr).map(e => e.pet_id),
  )
  const petsMissingToday = pets.filter(p => !loggedTodayIds.has(p.id))

  // Vaccinations due within 2 days (or overdue).
  const vaccineDue = pets.filter(p => {
    if (!p.next_vaccination) return false
    const days = Math.ceil((new Date(p.next_vaccination).getTime() - Date.now()) / 86_400_000)
    return days <= 2
  })

  const currentMood = findMood(mood)

  const MOOD_DESC: Record<string, string> = {
    playful: `${petName} is bursting with energy and ready to engage. A perfect window for games and bonding.`,
    calm:    `${petName} feels relaxed and content. Their body language signals comfort and security.`,
    excited: `${petName} is highly stimulated and alert. Channel this energy before it tips into restlessness.`,
    sleepy:  `${petName} is winding down and conserving energy. Rest now supports their mood tomorrow.`,
    anxious: `${petName} is showing signs of unease. Extra reassurance and a steady routine will help.`,
    curious: `${petName} is exploring and taking everything in. A great moment for new enrichment.`,
  }
  const moodDescription = MOOD_DESC[currentMood.value] ?? MOOD_DESC.calm

  const PERSONALITY_DESC: Record<string, string> = {
    'curious-explorer':   'Endlessly inquisitive and bold. Loves discovering new places, smells and toys.',
    'gentle-soul':        'Soft-natured and affectionate. Thrives on calm routines and gentle attention.',
    'loyal-guardian':     'Devoted and protective. Forms deep bonds and keeps a watchful eye on their family.',
    'playful-trickster':  'Energetic and mischievous. Always up for a game and a bit of clever fun.',
    'social-butterfly':   'Outgoing and people-loving. Lights up around company and new friends.',
    'independent-thinker':'Self-reliant and observant. Values personal space and does things their own way.',
  }
  const personalityDesc = PERSONALITY_DESC[report.personalityType] ?? ''

  const MOOD_TIP: Record<string, string> = {
    playful: 'Great time for an interactive play session — channel that energy into a game.',
    calm:    'A perfect moment for gentle bonding and some quiet cuddle time.',
    excited: 'Lots of energy right now — a short walk or new toy will help them settle.',
    sleepy:  'Let them rest undisturbed — recovery is just as important as play.',
    anxious: 'Keep the environment calm and predictable to help them feel safe.',
    curious: 'Curiosity is high — try a puzzle feeder or explore a new space together.',
  }
  const tip = MOOD_TIP[currentMood.value] ?? MOOD_TIP.calm

  // ── Recommended activities — built from mood + pet type ──
  const MOOD_ACTIVITIES: Record<string, string[]> = {
    playful: ['Interactive play session', 'Fetch & chase games'],
    calm:    ['Quiet bonding time', 'Gentle grooming'],
    excited: ['High-energy play', 'Introduce a new toy'],
    sleepy:  ['Cozy rest spot', 'Calm cuddle time'],
    anxious: ['Safe quiet space', 'Soothing daily routine'],
    curious: ['Exploration time', 'Puzzle feeder challenge'],
  }
  const PET_ACTIVITIES: Record<string, string[]> = {
    cat:     ['Wand toy hunting', 'Vertical climbing spots'],
    dog:     ['Outdoor walk', 'Scent training'],
    rabbit:  ['Tunnel exploration', 'Dig box play'],
    bird:    ['Foraging toys', 'Out-of-cage flight time'],
    hamster: ['Maze running', 'Wheel & tunnels'],
  }
  const GENERIC_ACTIVITIES = ['Enrichment toys', 'Exploration time', 'Quiet bonding time', 'Interactive play']

  const activities: string[] = []
  const seen = new Set<string>()
  for (const a of [
    ...(MOOD_ACTIVITIES[currentMood.value] ?? []),
    ...(PET_ACTIVITIES[answers.petType ?? ''] ?? []),
    ...GENERIC_ACTIVITIES,
  ]) {
    if (seen.has(a)) continue
    seen.add(a)
    activities.push(a)
    if (activities.length === 4) break
  }

  return (
    <div className={styles.page}>
      {dailyTip && (
        <div className={styles.topBar}>
          <div className={styles.tipBlock}>
            <span className={styles.tipLabel}>💡 Today's tip for {petName}</span>
            <p className={styles.tipText}>{tip}</p>
          </div>
          <div className={styles.moodBadge}>{currentMood.emoji} {currentMood.label}</div>
        </div>
      )}

      {/* Free upgrade banner */}
      {!premium && (
        <button className={styles.upgradeBanner} onClick={() => navigate(ROUTES.PAYWALL)}>
          <Icon name="sparkles" size={18} />
          <span>
            You're on the <strong>Free plan</strong> — unlock the full profile, AI Coach & trends
          </span>
          <span className={styles.upgradeCta}>Upgrade →</span>
        </button>
      )}

      {/* ── Reminders ── */}
      {petsMissingToday.length > 0 && (
        <button className={styles.reminderJournal} onClick={() => navigate(ROUTES.JOURNAL)}>
          <span className={styles.reminderIcon}>📖</span>
          <span className={styles.reminderText}>
            {petsMissingToday.length === 1
              ? <>You haven't logged <strong>{petsMissingToday[0].name}</strong>'s journal today.</>
              : <>You haven't journaled today for: <strong>{petsMissingToday.map(p => p.name).join(', ')}</strong>.</>}
          </span>
          <span className={styles.reminderCta}>Log now →</span>
        </button>
      )}

      {vaccineDue.map(p => {
        const days = Math.ceil((new Date(p.next_vaccination!).getTime() - Date.now()) / 86_400_000)
        return (
          <div key={p.id} className={styles.reminderVaccine}>
            <span className={styles.reminderIcon}>💉</span>
            <span className={styles.reminderText}>
              {days < 0
                ? <><strong>{p.name}</strong>'s vaccination is overdue (was {p.next_vaccination}).</>
                : days === 0
                  ? <><strong>{p.name}</strong>'s vaccination is due today!</>
                  : <><strong>{p.name}</strong>'s vaccination is due in {days} day{days > 1 ? 's' : ''} ({p.next_vaccination}).</>}
            </span>
          </div>
        )
      })}

      <div className={styles.grid}>
        {/* Always shown */}
        <div className={styles.card}>
          <div className={styles.cardLabel}>Personality Type</div>
          <div className={styles.cardValue}>{report.personalityLabel}</div>
          <p className={styles.cardDesc}>{personalityDesc}</p>
        </div>
        <div className={styles.card}>
          <div className={styles.cardLabel}>Current Mood</div>
          <div className={styles.cardValue}>{currentMood.emoji} {currentMood.label}</div>
          <p className={styles.cardDesc}>{moodDescription}</p>
        </div>

        {/* Premium-only cards */}
        {premium ? (
          <>
            <div className={styles.card}>
              <div className={styles.cardLabel}>Hidden Needs</div>
              <ul className={styles.needsList}>
                {report.hiddenNeeds.map(n => (
                  <li key={n} className={styles.needItem}>
                    <span className={styles.dot} />
                    {n}
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.card}>
              <div className={styles.cardLabel}>Communication Style</div>
              <p className={styles.cardDesc}>{report.communicationStyle}</p>
            </div>
          </>
        ) : (
          <>
            <LockedCard label="Hidden Needs" onClick={() => navigate(ROUTES.PAYWALL)} />
            <LockedCard label="Communication Style" onClick={() => navigate(ROUTES.PAYWALL)} />
          </>
        )}
      </div>

      {/* Emotional Profile — premium only */}
      <div className={styles.profileSection}>
        <h2 className={styles.sectionTitle}>Emotional Profile</h2>
        {premium ? (
          <div className={styles.profileBars}>
            {Object.entries(report.emotionalProfile).map(([key, val]) => (
              <ProgressBar key={key} label={key} value={val} />
            ))}
          </div>
        ) : (
          <LockedPanel
            text="See all 5 emotional dimensions scored in detail"
            onClick={() => navigate(ROUTES.PAYWALL)}
          />
        )}
      </div>

      {/* Recommended Activities — premium only */}
      <div className={styles.activitiesSection}>
        <h2 className={styles.sectionTitle}>Recommended Activities</h2>
        {premium ? (
          <div className={styles.activities}>
            {activities.map(a => (
              <div key={a} className={styles.activityCard}>{a}</div>
            ))}
          </div>
        ) : (
          <LockedPanel
            text="Get a personalized activity plan for your pet"
            onClick={() => navigate(ROUTES.PAYWALL)}
          />
        )}
      </div>
    </div>
  )
}

function LockedCard({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button className={styles.lockedCard} onClick={onClick}>
      <div className={styles.cardLabel}>{label}</div>
      <div className={styles.lockBody}>
        <Icon name="lock" size={22} />
        <span>Premium</span>
      </div>
    </button>
  )
}

function LockedPanel({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <button className={styles.lockedPanel} onClick={onClick}>
      <Icon name="lock" size={26} />
      <span className={styles.lockedPanelText}>{text}</span>
      <span className={styles.lockedPanelCta}>Unlock with Premium →</span>
    </button>
  )
}
