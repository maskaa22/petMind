import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ScrollToTop } from '@/components/ScrollToTop'
import { WaveDivider } from '@/components/WaveDivider'
import { Hero } from '@/components/sections/Hero'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { Benefits } from '@/components/sections/Benefits'
import { PersonalityTypes } from '@/components/sections/PersonalityTypes'
import { SocialProof } from '@/components/sections/SocialProof'
import { FAQ } from '@/components/sections/FAQ'
import { CtaBanner } from '@/components/sections/CtaBanner'
import { SneakPeek } from '@/components/sections/SneakPeek'
import styles from './LandingPage.module.scss'

// Hex values matching tokens.scss
const C = {
  white:       '#ffffff',
  tealPale:    '#e8f4f8',
  orangePale:  '#fff2ec',
  greenPale:   '#eef7e4',
  teal:        '#1a3a4a',
}

export function LandingPage() {
  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <Hero />
        {/* Hero already has its bottom wave baked in, flowing into teal-pale */}
        <HowItWorks />

        <WaveDivider from={C.tealPale}   to={C.orangePale} variant="C" />
        <Benefits />

        <WaveDivider from={C.orangePale} to={C.white}      variant="B" />
        <PersonalityTypes />

        <WaveDivider from={C.white}      to={C.tealPale}   variant="E" />
        <SocialProof />

        <WaveDivider from={C.tealPale}   to={C.greenPale}  variant="D" />
        <FAQ />

        <WaveDivider from={C.greenPale}  to={C.teal}       variant="A" />
        <SneakPeek />

        <WaveDivider from={C.teal}       to={C.white}      variant="C" />
        <CtaBanner />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
