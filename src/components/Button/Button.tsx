import { playClick } from '@/lib/sound'
import styles from './Button.module.scss'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

export function Button({ variant = 'primary', size = 'md', fullWidth, className, children, onClick, ...props }: ButtonProps) {
  return (
    <button
      className={[styles.button, styles[variant], styles[size], fullWidth ? styles.fullWidth : '', className ?? ''].join(' ')}
      onClick={e => { playClick(); onClick?.(e) }}
      {...props}
    >
      {children}
    </button>
  )
}
