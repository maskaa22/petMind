import { generateReport } from '@/lib/quizLogic'
import { ProgressBar } from '@/components/ProgressBar'
import type { QuizAnswers } from '@/types'
import styles from './DashboardPage.module.scss'

export function DashboardPage() {
  const raw = localStorage.getItem('petmind_quiz')
  const answers: QuizAnswers = raw ? JSON.parse(raw) : {}
  const report = generateReport(answers)
  const petName = answers.petName || 'Your Pet'

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div>
          <h1 className={styles.greeting}>Hello! 👋</h1>
          <p className={styles.petName}>{petName}'s Dashboard</p>
        </div>
        <div className={styles.moodBadge}>{report.mood}</div>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardLabel}>Personality Type</div>
          <div className={styles.cardValue}>{report.personalityLabel}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardLabel}>Current Mood</div>
          <div className={styles.cardValue}>{report.mood}</div>
          <p className={styles.cardDesc}>{report.moodDescription}</p>
        </div>
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
      </div>

      <div className={styles.profileSection}>
        <h2 className={styles.sectionTitle}>Emotional Profile</h2>
        <div className={styles.profileBars}>
          {Object.entries(report.emotionalProfile).map(([key, val]) => (
            <ProgressBar key={key} label={key} value={val} />
          ))}
        </div>
      </div>

      <div className={styles.activitiesSection}>
        <h2 className={styles.sectionTitle}>Recommended Activities</h2>
        <div className={styles.activities}>
          {['Interactive play session', 'Enrichment toys', 'Quiet bonding time', 'Exploration time'].map(a => (
            <div key={a} className={styles.activityCard}>{a}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
