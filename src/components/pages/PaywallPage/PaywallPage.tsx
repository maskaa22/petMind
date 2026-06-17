import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES, PLANS } from '@/lib/constants'
import { Button } from '@/components/Button'
import { generateReport } from '@/lib/quizLogic'
import type { QuizAnswers } from '@/types'
import styles from './PaywallPage.module.scss'

const PREMIUM_FEATURES = [
  'Full personality breakdown',
  'AI Pet Coach (unlimited chats)',
  'Daily journal & mood tracking',
  'Photo mood analysis',
  'Weekly behavior insights',
  'Trend reports over time',
]

export function PaywallPage() {
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState<string>('yearly')

  const raw = localStorage.getItem('petmind_quiz')
  const answers: QuizAnswers = raw ? JSON.parse(raw) : {}
  const report = generateReport(answers)

  function handleUnlock() {
    localStorage.setItem('petmind_plan', selectedPlan)
    navigate(ROUTES.DASHBOARD)
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.preview}>
          <div className={styles.previewLabel}>Your Results Are Ready</div>
          <div className={styles.personalityCard}>
            <div className={styles.personalityType}>{report.personalityLabel}</div>
            <p className={styles.teaser}>
              {answers.petName || 'Your pet'} demonstrates strong curiosity and independence.
              Their unique behavioral patterns reveal a rich inner world…
            </p>
            <div className={styles.lockedContent}>
              <div className="blurred">
                <p>Full mood analysis, hidden needs, communication style, emotional profile scores, and personalized AI recommendations are waiting for you.</p>
                <p>Your pet's detailed breakdown includes 6 personality dimensions, daily mood patterns, and actionable insights.</p>
              </div>
              <div className={styles.lockOverlay}>
                <span className={styles.lockIcon}>🔒</span>
                <span>Unlock Full Report</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.plans}>
          <h2 className={styles.plansTitle}>Choose your plan</h2>
          <div className={styles.planList}>
            {PLANS.map(plan => (
              <button
                key={plan.id}
                className={[styles.planCard, selectedPlan === plan.id ? styles.selectedPlan : ''].join(' ')}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {'badge' in plan && plan.badge && <span className={styles.badge}>{plan.badge}</span>}
                <span className={styles.planLabel}>{plan.label}</span>
                <span className={styles.planPrice}>{plan.price}</span>
                <span className={styles.planPeriod}>{plan.period}</span>
              </button>
            ))}
          </div>

          <Button size="lg" fullWidth onClick={handleUnlock}>
            Unlock Full Report
          </Button>

          <p className={styles.disclaimer}>Cancel anytime · Secure checkout · Instant access</p>

          <div className={styles.featureList}>
            {PREMIUM_FEATURES.map(f => (
              <div key={f} className={styles.feature}>
                <span className={styles.check}>✓</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
