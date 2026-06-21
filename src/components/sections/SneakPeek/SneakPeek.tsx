import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import { Button } from '@/components/Button'
import styles from './SneakPeek.module.scss'

const TRAITS = [
  { label: 'Curiosity',   value: 88 },
  { label: 'Social need', value: 62 },
  { label: 'Anxiety',     value: 34 },
  { label: 'Playfulness', value: 91 },
  { label: 'Independence',value: 75 },
]

const PERKS = [
  'Personality type + detailed description',
  'Top emotional needs ranked',
  'Communication style guide',
  'Daily routine recommendations',
  'Red-flag behaviour alerts',
]

export function SneakPeek() {
  const navigate = useNavigate()
  return (
    <section id="sneak-peek" className={styles.section}>
      <div className={styles.inner}>

        {/* ── Left: copy ── */}
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Preview your report</p>
          <h2 className={styles.headline}>
            See exactly<br />
            <span className={styles.highlight}>what you'll get</span>
          </h2>
          <ul className={styles.perks}>
            {PERKS.map(p => (
              <li key={p} className={styles.perk}>
                <span className={styles.check} aria-hidden="true">✓</span>
                {p}
              </li>
            ))}
          </ul>
          <Button variant="primary" size="lg" onClick={() => navigate(ROUTES.QUIZ)}>
            Get My Free Report 🐾
          </Button>
          <p className={styles.hint}>2-minute quiz · No sign-up needed</p>
        </div>

        {/* ── Right: preview card ── */}
        <div className={styles.cardWrap} aria-hidden="true">
          <div className={styles.card}>
            {/* Card header */}
            <div className={styles.cardHeader}>
              <img src="/cat.png" alt="cat" className={styles.catIllu} />
              <div>
                <p className={styles.petName}>Luna</p>
                <span className={styles.typeBadge}>The Explorer</span>
              </div>
            </div>

            {/* Mood tags */}
            <div className={styles.badges}>
              <span className={styles.badge}>😺 Playful</span>
              <span className={styles.badge}>🌙 Night owl</span>
              <span className={styles.badge}>🧠 Curious</span>
            </div>

            {/* Traits — first two visible, rest blurred */}
            <div className={styles.traits}>
              {TRAITS.map((t, i) => (
                <div key={t.label} className={`${styles.trait} ${i >= 2 ? styles.blurred : ''}`}>
                  <div className={styles.traitRow}>
                    <span className={styles.traitLabel}>{t.label}</span>
                    <span className={styles.traitPct}>{t.value}%</span>
                  </div>
                  <div className={styles.bar}>
                    <div className={styles.barFill} style={{ width: `${t.value}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Lock overlay */}
            <div className={styles.lockOverlay}>
              <span className={styles.lockIcon}>🔒</span>
              <p className={styles.lockText}>Unlock full report</p>
            </div>
          </div>

          {/* Decorative glow */}
          <div className={styles.glow} />
        </div>
      </div>
    </section>
  )
}
