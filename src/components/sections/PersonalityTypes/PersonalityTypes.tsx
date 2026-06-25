import { Icon } from '@/components/Icon'
import type { IconName } from '@/components/Icon'
import styles from './PersonalityTypes.module.scss'

const TYPES: { icon: IconName; name: string; color: string; bg: string; border: string; traits: string[]; desc: string }[] = [
  {
    icon: 'eye',
    name: 'The Curious Explorer',
    color: '#7c3aed',
    bg: '#f5f3ff',
    border: '#ddd6fe',
    traits: ['Curious', 'Adventurous', 'Bold'],
    desc: 'Always investigating something new — bored easily and thrives on fresh stimulation.',
  },
  {
    icon: 'heart',
    name: 'The Gentle Soul',
    color: '#2563eb',
    bg: '#eff6ff',
    border: '#bfdbfe',
    traits: ['Sensitive', 'Affectionate', 'Calm'],
    desc: 'Soft-natured and tender. Builds trust slowly but bonds deeply for life.',
  },
  {
    icon: 'shield',
    name: 'The Loyal Guardian',
    color: '#f97316',
    bg: '#fff7ed',
    border: '#fed7aa',
    traits: ['Devoted', 'Alert', 'Protective'],
    desc: 'Watchful and steadfast — fiercely devoted to their family and their space.',
  },
  {
    icon: 'zap',
    name: 'The Playful Trickster',
    color: '#db2777',
    bg: '#fdf2f8',
    border: '#fbcfe8',
    traits: ['Energetic', 'Clever', 'Mischievous'],
    desc: 'Turns life into a game. Smart, agile and always up for a bit of fun.',
  },
  {
    icon: 'users',
    name: 'The Social Butterfly',
    color: '#16a34a',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    traits: ['Friendly', 'Outgoing', 'Affectionate'],
    desc: 'Thrives on company and attention — the heart of every room they enter.',
  },
  {
    icon: 'brain',
    name: 'The Independent Thinker',
    color: '#0d9488',
    bg: '#f0fdfa',
    border: '#99f6e4',
    traits: ['Self-reliant', 'Observant', 'Composed'],
    desc: 'Confident and autonomous. Enjoys company very much on their own terms.',
  },
]

export function PersonalityTypes() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <div className={styles.tag}>Personality types</div>
          <h2 className={styles.title}>Every pet has a unique personality profile</h2>
          <p className={styles.sub}>Our analysis identifies which of 6 core archetypes your pet belongs to — and what that means for their care.</p>
        </div>

        <div className={styles.grid}>
          {TYPES.map(({ icon, name, color, bg, border, traits, desc }) => (
            <div key={name} className={styles.card} style={{ background: bg, borderColor: border }}>
              <div className={styles.cardTop}>
                <div className={styles.emojiWrap} style={{ background: color }}>
                  <Icon name={icon} size={24} />
                </div>
                <div>
                  <h3 className={styles.typeName} style={{ color }}>{name}</h3>
                  <div className={styles.traits}>
                    {traits.map(t => (
                      <span key={t} className={styles.trait} style={{ color, borderColor: border }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <p className={styles.desc}>{desc}</p>
            </div>
          ))}
        </div>

        <p className={styles.note}>
          Take the free quiz to discover which archetype fits your pet.
        </p>
      </div>
    </section>
  )
}
