import { useState } from 'react'
import styles from './FAQ.module.scss'

const FAQS = [
  { q: 'How does it work?', a: "You complete a short 8-question quiz about your pet's behavior, personality, and daily habits. Our AI analyzes the answers and generates a detailed personality report tailored to your specific pet." },
  { q: 'Is it accurate?', a: "Our analysis is based on established animal behavioral science combined with AI pattern recognition trained on thousands of pet profiles. While every pet is unique, our system provides highly relevant and personalized insights." },
  { q: 'What pets are supported?', a: "Currently we support cats, dogs, rabbits, birds, and hamsters. We're constantly expanding our database to cover more species and breeds." },
  { q: 'How do subscriptions work?', a: "You can take the basic quiz for free and receive a teaser of your results. To unlock the full report, AI Chat, Journal, and Photo Analysis features, you can subscribe to our Monthly, Yearly, or Lifetime plans. Cancel anytime." },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <div className={styles.ribbon}>🐾 FAQ</div>
          <h2 className={styles.title}>Frequently asked questions</h2>
        </div>
        <div className={styles.list}>
          {FAQS.map(({ q, a }, i) => (
            <div key={q} className={[styles.item, open === i ? styles.opened : ''].join(' ')}>
              <button className={styles.question} onClick={() => setOpen(open === i ? null : i)}>
                <span>{q}</span>
                <span className={styles.chevron}>{open === i ? '−' : '+'}</span>
              </button>
              {open === i && <p className={styles.answer}>{a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
