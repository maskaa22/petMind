import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Button } from '@/components/Button'
import { Icon } from '@/components/Icon'
import type { DashboardContext } from '@/lib/moods'
import styles from './JournalPage.module.scss'

interface Entry {
  id: number
  date: string
  mood: string
  energy: number
  appetite: number
  sleep: number
  notes: string
}

const MOODS = ['😊 Happy', '😌 Calm', '😄 Excited', '😴 Tired', '😟 Anxious']
const STORAGE_KEY = 'petmind_journal'

// Map a journal mood to the app-wide mood value (used by the topbar / dashboard).
const JOURNAL_TO_MOOD: Record<string, string> = {
  '😊 Happy': 'playful',
  '😌 Calm': 'calm',
  '😄 Excited': 'excited',
  '😴 Tired': 'sleepy',
  '😟 Anxious': 'anxious',
}

function loadEntries(): Entry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function JournalPage() {
  const { setMood } = useOutletContext<DashboardContext>()
  const [entries, setEntries] = useState<Entry[]>(loadEntries)
  const [form, setForm] = useState({ mood: '', energy: 5, appetite: 5, sleep: 5, notes: '' })
  const [showForm, setShowForm] = useState(false)

  // Persist entries whenever they change.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  }, [entries])

  function save() {
    setEntries(prev => [{
      id: Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      ...form,
    }, ...prev])
    // Saving an entry updates the pet's current mood app-wide.
    const mapped = JOURNAL_TO_MOOD[form.mood]
    if (mapped) setMood(mapped)
    setForm({ mood: '', energy: 5, appetite: 5, sleep: 5, notes: '' })
    setShowForm(false)
  }

  function remove(id: number) {
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Pet Journal</h1>
          <p className={styles.sub}>Track your pet's daily wellbeing</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>+ New Entry</Button>
      </div>

      {showForm && (
        <div className={styles.formCard}>
          <h3 className={styles.formTitle}>Today's Entry</h3>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label className={styles.label}>Mood</label>
              <div className={styles.moodRow}>
                {MOODS.map(m => (
                  <button
                    key={m}
                    className={[styles.moodBtn, form.mood === m ? styles.selectedMood : ''].join(' ')}
                    onClick={() => setForm(f => ({ ...f, mood: m }))}
                  >{m}</button>
                ))}
              </div>
            </div>
            {(['energy', 'appetite', 'sleep'] as const).map(key => (
              <div key={key} className={styles.field}>
                <label className={styles.label}>{key.charAt(0).toUpperCase() + key.slice(1)} <span className={styles.sliderVal}>{form[key]}/10</span></label>
                <input type="range" min={1} max={10} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: Number(e.target.value) }))} className={styles.slider} />
              </div>
            ))}
            <div className={styles.field}>
              <label className={styles.label}>Notes</label>
              <textarea className={styles.textarea} rows={3} placeholder="How was your pet today?" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            </div>
          </div>
          <div className={styles.formActions}>
            <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={save} disabled={!form.mood}>Save Entry</Button>
          </div>
        </div>
      )}

      {entries.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}><Icon name="book-open" size={80} /></span>
          <p>No entries yet. Start tracking your pet's daily mood!</p>
        </div>
      ) : (
        <div className={styles.entries}>
          {entries.map(e => (
            <div key={e.id} className={styles.entry}>
              <button className={styles.entryDelete} onClick={() => remove(e.id)} aria-label="Delete entry">✕</button>
              <div className={styles.entryDate}>{e.date}</div>
              <div className={styles.entryMood}>{e.mood}</div>
              <div className={styles.entryStats}>
                <span>⚡ {e.energy}/10</span>
                <span>🍽️ {e.appetite}/10</span>
                <span>💤 {e.sleep}/10</span>
              </div>
              {e.notes && <p className={styles.entryNotes}>{e.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
