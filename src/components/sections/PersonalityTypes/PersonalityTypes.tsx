import styles from './PersonalityTypes.module.scss'

const TYPES = [
  {
    emoji: '🦁',
    name: 'The Leader',
    color: '#f97316',
    bg: '#fff7ed',
    border: '#fed7aa',
    traits: ['Confident', 'Territorial', 'Protective'],
    desc: 'Natural born leaders who take charge and set the boundaries in their environment.',
  },
  {
    emoji: '🦋',
    name: 'The Explorer',
    color: '#7c3aed',
    bg: '#f5f3ff',
    border: '#ddd6fe',
    traits: ['Curious', 'Adventurous', 'Playful'],
    desc: 'Always investigating something new. Bored easily and thrives on stimulation.',
  },
  {
    emoji: '🌙',
    name: 'The Dreamer',
    color: '#2563eb',
    bg: '#eff6ff',
    border: '#bfdbfe',
    traits: ['Sensitive', 'Intuitive', 'Calm'],
    desc: 'Deeply emotional and observant. Builds trust slowly but bonds for life.',
  },
  {
    emoji: '🌟',
    name: 'The Socialite',
    color: '#16a34a',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    traits: ['Friendly', 'Attention-loving', 'Vocal'],
    desc: 'Thrives on interaction and attention. The heart of every room they enter.',
  },
]

export function PersonalityTypes() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <div className={styles.tag}>Personality types</div>
          <h2 className={styles.title}>Every pet has a unique personality profile</h2>
          <p className={styles.sub}>Our analysis identifies which of 8 core archetypes your pet belongs to — and what that means for their care.</p>
        </div>

        <div className={styles.grid}>
          {TYPES.map(({ emoji, name, color, bg, border, traits, desc }) => (
            <div key={name} className={styles.card} style={{ background: bg, borderColor: border }}>
              <div className={styles.cardTop}>
                <div className={styles.emojiWrap} style={{ background: color }}>
                  <span className={styles.emoji}>{emoji}</span>
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
          + 4 more personality types discovered in our full analysis
        </p>
      </div>
    </section>
  )
}
