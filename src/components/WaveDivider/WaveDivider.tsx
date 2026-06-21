import styles from './WaveDivider.module.scss'

type Variant = 'A' | 'B' | 'C' | 'D' | 'E'

interface WaveDividerProps {
  from: string
  to: string
  variant?: Variant
}

// Each path fills from the wavy edge DOWN to the SVG bottom (y=72).
// The area ABOVE the wave is transparent — shows the `from` container background.
const PATHS: Record<Variant, string> = {
  // Gentle single swell, leans right
  A: 'M0,44 C360,72 1080,10 1440,44 L1440,72 L0,72 Z',
  // Double hump, one deep one shallow
  B: 'M0,52 C240,16 480,72 720,40 C960,8 1200,64 1440,36 L1440,72 L0,72 Z',
  // Asymmetric long wave
  C: 'M0,28 C520,72 960,8 1440,52 L1440,72 L0,72 Z',
  // Three-bump rhythm
  D: 'M0,60 C200,20 420,72 640,40 C860,8 1080,60 1300,28 C1360,18 1400,40 1440,44 L1440,72 L0,72 Z',
  // Inverse — wave rises left and falls right
  E: 'M0,20 C280,60 720,16 1080,56 C1260,72 1380,44 1440,52 L1440,72 L0,72 Z',
}

export function WaveDivider({ from, to, variant = 'A' }: WaveDividerProps) {
  return (
    <div className={styles.divider} style={{ background: from }}>
      <svg
        viewBox="0 0 1440 72"
        fill="none"
        preserveAspectRatio="none"
        className={styles.svg}
        aria-hidden="true"
      >
        <path d={PATHS[variant]} fill={to} />
      </svg>
    </div>
  )
}
