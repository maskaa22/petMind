import { useEffect } from 'react'
import { Button } from '@/components/Button'
import styles from './ConfirmModal.module.scss'

interface ConfirmModalProps {
  open: boolean
  title: string
  message: string
  emoji?: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
  onConfirm: () => void
  onClose: () => void
}

export function ConfirmModal({
  open,
  title,
  message,
  emoji = '🐾',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  // Close on Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
        <div className={`${styles.iconWrap} ${danger ? styles.iconDanger : ''}`}>
          <span>{emoji}</span>
        </div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <Button variant="secondary" className={styles.btn} onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button
            variant="primary"
            className={`${styles.btn} ${danger ? styles.dangerBtn : ''}`}
            onClick={() => { onConfirm(); onClose() }}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
