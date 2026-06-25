import { useOutletContext } from 'react-router-dom'
import { generateReport } from '@/lib/quizLogic'
import { PERSONALITY_PROFILES, fill } from '@/lib/personalities'
import { findMood, MOOD_GUIDE, toyIcon } from '@/lib/moods'
import type { DashboardContext } from '@/lib/moods'
import { needInfo, commSignals } from '@/lib/insights'
import type { QuizAnswers } from '@/types'
import styles from './ReportsPage.module.scss'

export function ReportsPage() {
  const { mood } = useOutletContext<DashboardContext>()

  const raw = localStorage.getItem('petmind_quiz')
  const answers: QuizAnswers = raw ? JSON.parse(raw) : {}
  const report = generateReport(answers)
  const petName = answers.petName || 'Your Pet'

  const currentMood = findMood(mood)
  const moodGuide = MOOD_GUIDE[currentMood.value] ?? MOOD_GUIDE.calm

  const profile = PERSONALITY_PROFILES[report.personalityType]
  const traits = [
    { label: 'Strengths', text: profile.strengths },
    { label: 'Behavior Patterns', text: profile.behavior },
    { label: 'Needs', text: profile.needs },
    { label: 'Recommendations', text: profile.recommendations },
  ]

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Full Report — {petName}</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Personality Type</h2>
        <div className={styles.personalityCard}>
          <div className={styles.personalityLabel}>{report.personalityLabel}</div>
          <p className={styles.personalityDesc}>{fill(profile.intro, petName)}</p>
          <div className={styles.traits}>
            {traits.map(t => (
              <div key={t.label} className={styles.trait}>
                <div className={styles.traitLabel}>{t.label}</div>
                <p className={styles.traitText}>{fill(t.text, petName)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Care Tips for {petName}</h2>
        <div className={styles.tipsCard}>
          <ul className={styles.tipsList}>
            {profile.tips.map(tip => (
              <li key={tip} className={styles.tipItem}>
                <span className={styles.tipCheck}>✓</span>
                <span>{fill(tip, petName)}</span>
              </li>
            ))}
          </ul>
          <div className={styles.funFact}>
            <span className={styles.funFactLabel}>💡 Did you know?</span>
            <p>{fill(profile.funFact, petName)}</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Mood Analysis</h2>
        <div className={styles.card}>
          <div className={styles.moodBig}>{currentMood.emoji} {currentMood.label}</div>
          <p>{fill(moodGuide.summary, petName)}</p>

          <div className={styles.moodCols}>
            <div className={styles.moodCol}>
              <h4 className={styles.moodColTitle}>What helps right now</h4>
              <ul className={styles.tipsList}>
                {moodGuide.doNow.map(d => (
                  <li key={d} className={styles.tipItem}>
                    <span className={styles.tipCheck}>✓</span>
                    <span>{fill(d, petName)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.moodCol}>
              <h4 className={styles.moodColTitle}>Recommended toys</h4>
              <div className={styles.toyChips}>
                {moodGuide.toys.map(t => (
                  <span key={t} className={styles.toyChip}>{toyIcon(t)} {t}</span>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.watchNote}>
            <span className={styles.watchLabel}>👀 Keep an eye on</span>
            <span>{fill(moodGuide.watch, petName)}</span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Hidden Needs</h2>
        <div className={styles.needsGrid}>
          {report.hiddenNeeds.map(n => (
            <div key={n} className={styles.needCard}>
              <span className={styles.needIcon}>💡</span>
              <div className={styles.needBody}>
                <span className={styles.needName}>{n}</span>
                <p className={styles.needWhy}>{needInfo(n)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Communication Style</h2>
        <div className={styles.card}>
          <p>{report.communicationStyle}</p>
          <div className={styles.signalsHeader}>Signals to watch for</div>
          <div className={styles.signalsGrid}>
            {commSignals(answers.petType).map(s => (
              <div key={s.signal} className={styles.signalCard}>
                <span className={styles.signalName}>{s.signal}</span>
                <span className={styles.signalMeaning}>{s.meaning}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
