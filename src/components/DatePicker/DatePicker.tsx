import { useState } from 'react'
import { Icon } from '@/components/Icon'
import styles from './DatePicker.module.scss'

interface DatePickerProps {
  value: string                 // 'YYYY-MM-DD' or ''
  onChange: (value: string) => void
  placeholder?: string
}

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

const pad = (n: number) => String(n).padStart(2, '0')
const toISO = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`

export function DatePicker({ value, onChange, placeholder = 'Pick a date' }: DatePickerProps) {
  const selected = value ? new Date(`${value}T00:00:00`) : null
  const today = new Date()
  const [open, setOpen] = useState(false)
  const [view, setView] = useState(selected ?? today)

  const year = view.getFullYear()
  const month = view.getMonth()
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7 // Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: (number | null)[] = []
  for (let i = 0; i < firstWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const display = selected
    ? selected.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    : placeholder

  function isSelected(d: number) {
    return selected && selected.getFullYear() === year && selected.getMonth() === month && selected.getDate() === d
  }
  function isToday(d: number) {
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === d
  }
  function pick(d: number) {
    onChange(toISO(year, month, d))
    setOpen(false)
  }
  function shiftMonth(delta: number) {
    setView(new Date(year, month + delta, 1))
  }

  return (
    <div className={styles.wrap}>
      <button type="button" className={styles.field} onClick={() => setOpen(o => !o)}>
        <span className={selected ? styles.value : styles.placeholder}>{display}</span>
        <Icon name="calendar" size={18} className={styles.icon} />
      </button>

      {open && (
        <>
          <div className={styles.backdrop} onClick={() => setOpen(false)} />
          <div className={styles.cal}>
            <div className={styles.calHead}>
              <button type="button" className={styles.navBtn} onClick={() => shiftMonth(-1)} aria-label="Previous month">‹</button>
              <span className={styles.monthLabel}>{MONTHS[month]} {year}</span>
              <button type="button" className={styles.navBtn} onClick={() => shiftMonth(1)} aria-label="Next month">›</button>
            </div>

            <div className={styles.weekRow}>
              {WEEKDAYS.map(w => <span key={w} className={styles.weekday}>{w}</span>)}
            </div>

            <div className={styles.grid}>
              {cells.map((d, i) => d === null
                ? <span key={`e${i}`} />
                : (
                  <button
                    type="button"
                    key={d}
                    className={[styles.day, isSelected(d) ? styles.daySelected : '', isToday(d) && !isSelected(d) ? styles.dayToday : ''].filter(Boolean).join(' ')}
                    onClick={() => pick(d)}
                  >
                    {d}
                  </button>
                ))}
            </div>

            <div className={styles.calFoot}>
              <button type="button" className={styles.footBtn} onClick={() => { onChange(''); setOpen(false) }}>Clear</button>
              <button type="button" className={styles.footBtn} onClick={() => { onChange(toISO(today.getFullYear(), today.getMonth(), today.getDate())); setOpen(false) }}>Today</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
