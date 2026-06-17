import { Hero } from '@/components/sections/Hero'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { Benefits } from '@/components/sections/Benefits'
import { PersonalityTypes } from '@/components/sections/PersonalityTypes'
import { SocialProof } from '@/components/sections/SocialProof'
import { FAQ } from '@/components/sections/FAQ'
import { CtaBanner } from '@/components/sections/CtaBanner'
import styles from './LandingPage.module.scss'

export function LandingPage() {
  return (
    <main className={styles.page}>
      <Hero />
      <HowItWorks />
      <Benefits />
      <PersonalityTypes />
      <SocialProof />
      <FAQ />
      <CtaBanner />
    </main>
  )
}
