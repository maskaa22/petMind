import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import { hasQuiz } from '@/lib/plan'
import { useAuth } from '@/lib/auth'
import { Icon } from '@/components/Icon'
import { Button } from '@/components/Button'
import styles from './CheckoutPage.module.scss'

const INCLUDED = [
  'Full emotional profile (5 dimensions)',
  "AI Chat with your pet's coach",
  'Mood journal & progress tracking',
  'Personalized care plan',
  'Monthly report updates',
]

function formatCard(v: string) {
  return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}
function formatExpiry(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 4)
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const { setPremium } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [card, setCard] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [processing, setProcessing] = useState(false)

  const valid =
    name.trim() &&
    /\S+@\S+\.\S+/.test(email) &&
    card.replace(/\s/g, '').length === 16 &&
    expiry.length === 5 &&
    cvc.length >= 3

  function handlePay() {
    if (!valid || processing) return
    setProcessing(true)
    setTimeout(async () => {
      await setPremium(true) // persist premium to the user's profile in the DB
      // No quiz yet → take the quiz first; it'll lead to the dashboard afterwards.
      navigate(hasQuiz() ? ROUTES.DASHBOARD : ROUTES.QUIZ)
    }, 1800)
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        {/* ── Header ── */}
        <header className={styles.header}>
          <button className={styles.back} onClick={() => navigate(ROUTES.HOME)}>
            ← Back
          </button>
          <h1 className={styles.title}>Complete your purchase</h1>
          <p className={styles.subtitle}>
            You're one step away from understanding your pet 🐾
          </p>
        </header>

        {/* ── Two columns ── */}
        <div className={styles.grid}>
        {/* ── Left: payment form ── */}
        <div className={styles.formCol}>
          <div className={styles.formCard}>
            <label className={styles.field}>
              <span className={styles.label}>Full name</span>
              <input
                className={styles.input}
                placeholder="Jane Doe"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Email</span>
              <input
                className={styles.input}
                type="email"
                placeholder="jane@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Card number</span>
              <div className={styles.cardInputWrap}>
                <input
                  className={styles.input}
                  inputMode="numeric"
                  placeholder="1234 5678 9012 3456"
                  value={card}
                  onChange={e => setCard(formatCard(e.target.value))}
                />
                <span className={styles.cardIcon}>💳</span>
              </div>
            </label>

            <div className={styles.row}>
              <label className={styles.field}>
                <span className={styles.label}>Expiry</span>
                <input
                  className={styles.input}
                  inputMode="numeric"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={e => setExpiry(formatExpiry(e.target.value))}
                />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>CVC</span>
                <input
                  className={styles.input}
                  inputMode="numeric"
                  placeholder="123"
                  value={cvc}
                  onChange={e => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                />
              </label>
            </div>

            <Button size="lg" fullWidth onClick={handlePay} disabled={!valid || processing}>
              {processing
                ? <span className={styles.processing}><span className={styles.spinner} />Processing payment…</span>
                : 'Pay $9.00 & Unlock 🐾'}
            </Button>

            <p className={styles.secureNote}>
              <Icon name="shield" size={14} /> Secured payment · Cancel anytime
            </p>
          </div>
        </div>

        {/* ── Right: order summary ── */}
        <aside className={styles.summaryCol}>
          <div className={styles.summaryCard}>
            <div className={styles.offerBadge}>⏳ 40% off — ends in 2 days</div>

            <p className={styles.planName}>Premium Plan</p>

            <div className={styles.priceRow}>
              <span className={styles.price}>$9</span>
              <span className={styles.priceOld}>$15</span>
              <span className={styles.pricePeriod}>/month</span>
            </div>
            <p className={styles.planDesc}>The complete picture of your pet.</p>

            <ul className={styles.features}>
              {INCLUDED.map(f => (
                <li key={f} className={styles.feature}>
                  <span className={styles.check}>✓</span>
                  {f}
                </li>
              ))}
            </ul>

            <div className={styles.totalRow}>
              <span>Total today</span>
              <span className={styles.totalAmount}>$9.00</span>
            </div>
          </div>

          <div className={styles.guarantee}>
            <span>💛</span> 7-day money-back guarantee
          </div>
        </aside>
        </div>
      </div>
    </div>
  )
}
