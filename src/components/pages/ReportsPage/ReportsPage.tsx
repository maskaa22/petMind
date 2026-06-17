import { generateReport } from '@/lib/quizLogic'
import { ProgressBar } from '@/components/ProgressBar'
import type { QuizAnswers } from '@/types'
import styles from './ReportsPage.module.scss'

export function ReportsPage() {
  const raw = localStorage.getItem('petmind_quiz')
  const answers: QuizAnswers = raw ? JSON.parse(raw) : {}
  const report = generateReport(answers)
  const petName = answers.petName || 'Your Pet'

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Full Report — {petName}</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Personality Type</h2>
        <div className={styles.personalityCard}>
          <div className={styles.personalityLabel}>{report.personalityLabel}</div>
          <p className={styles.personalityDesc}>
            {petName} has a rich inner life shaped by curiosity, sensitivity, and a unique way of experiencing the world. Their behavioral patterns reveal deep emotional intelligence and strong instinctual drives that guide their daily choices.
          </p>
          <div className={styles.traits}>
            {['Strengths', 'Behavior Patterns', 'Needs', 'Recommendations'].map(t => (
              <div key={t} className={styles.trait}>
                <div className={styles.traitLabel}>{t}</div>
                <p className={styles.traitText}>Based on {petName}'s profile, they show excellent adaptability and respond well to consistent routines and positive reinforcement.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Mood Analysis</h2>
        <div className={styles.card}>
          <div className={styles.moodBig}>{report.mood}</div>
          <p>{report.moodDescription}</p>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Hidden Needs</h2>
        <div className={styles.needsGrid}>
          {report.hiddenNeeds.map(n => (
            <div key={n} className={styles.needCard}>
              <span className={styles.needIcon}>💡</span>
              <span>{n}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Communication Style</h2>
        <div className={styles.card}>
          <p>{report.communicationStyle}</p>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Emotional Profile</h2>
        <div className={styles.card}>
          {Object.entries(report.emotionalProfile).map(([key, val]) => (
            <ProgressBar key={key} label={key} value={val} />
          ))}
        </div>
      </section>
    </div>
  )
}
