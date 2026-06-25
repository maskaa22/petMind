import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/Button'
import { generateReport } from '@/lib/quizLogic'
import type { QuizAnswers } from '@/types'
import styles from './PaywallPage.module.scss'

const PET_IMAGE: Record<string, string> = {
  cat: '/cat.png',
  dog: '/dog1.png',
  rabbit: '/rabbit.png',
  bird: '/chiken.png',
  hamster: '/ho.png',
  other: '/cub.png',
}

type PlanId = 'free' | 'premium'

const PLAN_FEATURES: Record<PlanId, { label: string; included: boolean }[]> = {
  free: [
    { label: 'Personality type revealed', included: true },
    { label: 'Basic mood snapshot', included: true },
    { label: 'Full emotional profile', included: false },
    { label: 'AI Chat coach', included: false },
    { label: 'Mood journal & tracking', included: false },
  ],
  premium: [
    { label: 'Full emotional profile (5 dimensions)', included: true },
    { label: "AI Chat with your pet's coach", included: true },
    { label: 'Mood journal & progress tracking', included: true },
    { label: 'Personalized care plan', included: true },
    { label: 'Monthly report updates', included: true },
  ],
}

export function PaywallPage() {
  const navigate = useNavigate()
  const { setPremium } = useAuth()
  const [plan, setPlan] = useState<PlanId>('premium')

  const raw = localStorage.getItem('petmind_quiz')
  const answers: QuizAnswers = raw ? JSON.parse(raw) : {}
  const report = generateReport(answers)
  const petImg = PET_IMAGE[answers.petType ?? ''] ?? '/cat.png'

  async function handleContinue() {
    // TEST mode: skip checkout. Premium → set prem in DB; then go to dashboard.
    if (plan === 'premium') await setPremium(true)
    navigate(ROUTES.DASHBOARD)
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        {/* ── Left: result preview ── */}
        <div className={styles.preview}>
          <div className={styles.previewLabel}>Your Results Are Ready</div>
          <div className={styles.personalityCard}>
            <div className={styles.personalityType}>{report.personalityLabel}</div>

            <img src={petImg} alt={answers.petType ?? 'pet'} className={styles.petImage} />

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

        {/* ── Right: plan choice ── */}
        <div className={styles.plans}>
          <h2 className={styles.plansTitle}>Choose your plan</h2>

          <div className={styles.planList}>
            {/* Free */}
            <button
              className={[styles.planCard, plan === 'free' ? styles.selectedPlan : ''].join(' ')}
              onClick={() => setPlan('free')}
            >
              <span className={styles.planLabel}>Free</span>
              <span className={styles.planPrice}>$0</span>
              <span className={styles.planPeriod}>forever</span>
            </button>

            {/* Premium */}
            <button
              className={[styles.planCard, plan === 'premium' ? styles.selectedPlan : ''].join(' ')}
              onClick={() => setPlan('premium')}
            >
              <span className={styles.badge}>Recommended</span>
              <span className={styles.planLabel}>Premium</span>
              <span className={styles.planPrice}>$9</span>
              <span className={styles.planPeriod}>/month</span>
            </button>
          </div>

          <Button size="lg" fullWidth onClick={handleContinue}>
            {plan === 'free' ? 'Get started for free' : 'Get Premium — $9/mo'}
          </Button>

          <p className={styles.disclaimer}>Cancel anytime · Secure checkout · Instant access</p>

          <div className={styles.featureList}>
            {PLAN_FEATURES[plan].map(f => (
              <div key={f.label} className={f.included ? styles.feature : styles.featureOff}>
                <span className={f.included ? styles.check : styles.checkOff}>
                  {f.included ? '✓' : '✕'}
                </span>
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
