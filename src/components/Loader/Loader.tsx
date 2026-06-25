import styles from './Loader.module.scss'

/** Full-screen branded loading overlay. */
export function Loader({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.box}>
        <span className={styles.paw}>🐾</span>
        <span className={styles.ring} />
        <p className={styles.label}>{label}</p>
      </div>
    </div>
  )
}
