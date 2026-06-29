import { useNavigate, useOutletContext } from 'react-router-dom'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { generateReport } from '@/lib/quizLogic'
import { updatePet } from '@/lib/db'
import type { Pet } from '@/lib/db'
import { useAuth } from '@/lib/auth'
import { findMood } from '@/lib/moods'
import type { DashboardContext } from '@/lib/moods'
import { usePrefs } from '@/lib/prefs'
import { ROUTES } from '@/lib/constants'
import { ProgressBar } from '@/components/ProgressBar'
import { Icon } from '@/components/Icon'
import type { QuizAnswers } from '@/types'
import styles from './DashboardPage.module.scss'

// Journal moods → colour (light = top of the 3-D gradient, color = bottom).
const MOOD_BARS = [
  { key: '😊 Happy',   color: '#7eba5a', light: '#a3d182' },
  { key: '😌 Calm',    color: '#4e8fa8', light: '#79b3c9' },
  { key: '😄 Excited', color: '#f0a830', light: '#f7c46b' },
  { key: '😴 Tired',   color: '#9b6dd6', light: '#bf9ee6' },
  { key: '😟 Anxious', color: '#e26d8a', light: '#ef9bb0' },
]

const PET_IMAGE: Record<string, string> = {
  cat: '/cat.png', dog: '/dog1.png', rabbit: '/rabbit.png',
  bird: '/chiken.png', hamster: '/ho.png', other: '/chameleon.png',
}

// Custom X-axis tick that renders the pet's image instead of its name.
function PetTick({ x, y, payload, imgByName }: {
  x?: number; y?: number; payload?: { value: string }; imgByName?: Record<string, string>
}) {
  const name = payload?.value ?? ''
  const img = imgByName?.[name]
  const size = 38
  if (x == null || y == null) return null
  return img
    ? <image href={img} x={x - size / 2} y={y + 6} width={size} height={size} />
    : <text x={x} y={y + 20} textAnchor="middle" fontSize={12} fill="#525252">{name}</text>
}

export function DashboardPage() {
  const navigate = useNavigate()
  const { premium } = useAuth()
  const { mood, pets, journal, activePet, setPets } = useOutletContext<DashboardContext>()
  const { dailyTip } = usePrefs()

  async function markVaccineDone(pet: Pet) {
    const d = new Date()
    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    setPets(pets.map(p => p.id === pet.id ? { ...p, last_vaccination: today, next_vaccination: null } : p))
    await updatePet(pet.id, { last_vaccination: today, next_vaccination: null })
  }

  const raw = localStorage.getItem('petmind_quiz')
  const localAnswers: QuizAnswers = raw ? JSON.parse(raw) : {}
  // Personality / needs / communication come from the saved quiz (stable — the
  // mood switcher never changes them). Fall back to localStorage before pets load.
  const answers: QuizAnswers = activePet?.quiz ?? localAnswers
  const report = generateReport(answers)
  const petName = activePet?.name || answers.petName || 'Your Pet'

  // ── Mood breakdown per pet (one stacked bar per pet) ──
  const moodOverview = pets
    .map(p => {
      const row: Record<string, string | number> = { name: p.name }
      for (const m of MOOD_BARS) row[m.key] = 0
      for (const e of journal) {
        if (e.pet_id === p.id && row[e.mood] !== undefined) {
          row[e.mood] = (row[e.mood] as number) + 1
        }
      }
      const total = MOOD_BARS.reduce((n, m) => n + (row[m.key] as number), 0)
      return { row, total }
    })
    .filter(x => x.total > 0)
    .map(x => x.row)

  // Map each pet name to its image for the chart axis.
  const petImgByName: Record<string, string> = {}
  for (const p of pets) {
    const img = PET_IMAGE[p.quiz?.petType ?? '']
    if (img) petImgByName[p.name] = img
  }

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
        const overdue = days < 0
        return (
          <div key={p.id} className={`${styles.reminderVaccine} ${overdue ? styles.reminderOverdue : ''}`}>
            <button
              className={styles.vaccCheck}
              onClick={() => markVaccineDone(p)}
              aria-label={`Mark ${p.name}'s vaccination done`}
              title="Mark as done"
            >
              ✓
            </button>
            <span className={styles.reminderIcon}>💉</span>
            <span className={styles.reminderText}>
              {overdue
                ? <><strong>{p.name}</strong>'s vaccination is overdue (was {p.next_vaccination}). Tick when done.</>
                : days === 0
                  ? <><strong>{p.name}</strong>'s vaccination is due today! Tick when done.</>
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

      {/* Mood breakdown per pet */}
      {moodOverview.length > 0 && (
        <div className={styles.moodOverviewSection}>
          <h2 className={styles.sectionTitle}>Mood overview — all pets</h2>
          <div className={styles.moodOverviewCard}>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={moodOverview} margin={{ top: 10, right: 16, left: -16, bottom: 8 }}>
                <defs>
                  {MOOD_BARS.map(m => (
                    <linearGradient key={m.key} id={`bar-${m.color}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={m.light} />
                      <stop offset="100%" stopColor={m.color} />
                    </linearGradient>
                  ))}
                  <filter id="barShadow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#1a3a4a" floodOpacity="0.22" />
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#eee" vertical={false} />
                <XAxis
                  dataKey="name"
                  height={52}
                  interval={0}
                  axisLine={false}
                  tickLine={false}
                  tick={props => <PetTick {...props} imgByName={petImgByName} />}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#a3a3a3' }} axisLine={false} tickLine={false} width={32} />
                <Tooltip contentStyle={{ borderRadius: 16, border: '2px dashed #f5a07a', fontFamily: 'inherit' }} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 13, fontWeight: 600 }} />
                {MOOD_BARS.map((m, i) => (
                  <Bar
                    key={m.key}
                    dataKey={m.key}
                    stackId="mood"
                    fill={`url(#bar-${m.color})`}
                    radius={i === MOOD_BARS.length - 1 ? [8, 8, 0, 0] : undefined}
                    maxBarSize={70}
                    style={{ filter: 'url(#barShadow)' }}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

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
