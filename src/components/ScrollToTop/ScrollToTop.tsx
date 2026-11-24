import { useEffect, useState } from 'react'
import { Icon } from '@/components/Icon'
import styles from './ScrollToTop.module.scss'

const SHOW_AFTER = 500 // px scrolled before the button appears

/** Floating "back to top" button. */
export function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      type="button"
      className={`${styles.btn} ${visible ? styles.visible : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
      tabIndex={visible ? 0 : -1}
    >
      <Icon name="arrow-up" size={22} strokeWidth={2.5} />
    </button>
  )
}
