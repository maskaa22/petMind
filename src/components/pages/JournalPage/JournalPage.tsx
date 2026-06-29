import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Button } from '@/components/Button'
import { Icon } from '@/components/Icon'
import { DatePicker } from '@/components/DatePicker'
import { useAuth } from '@/lib/auth'
import { addJournalEntry, deleteJournalEntry, updatePet } from '@/lib/db'
import type { DashboardContext } from '@/lib/moods'
import styles from './JournalPage.module.scss'

const MOODS = ['😊 Happy', '😌 Calm', '😄 Excited', '😴 Tired', '😟 Anxious']

// Map a journal mood to the app-wide mood value (used by the topbar / dashboard).
const JOURNAL_TO_MOOD: Record<string, string> = {
  '😊 Happy': 'playful',
  '😌 Calm': 'calm',
  '😄 Excited': 'excited',
  '😴 Tired': 'sleepy',
  '😟 Anxious': 'anxious',
}

const EMPTY_FORM = { mood: '', energy: 5, appetite: 5, sleep: 5, notes: '', weight: '' }

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function JournalPage() {
  const { setMood, journal, setJournal, pets, setPets, activePet, dataLoading } = useOutletContext<DashboardContext>()
  const { user } = useAuth()
  const [form, setForm] = useState(EMPTY_FORM)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  // Vaccination modal
  const [vaccOpen, setVaccOpen] = useState(false)
  const [lastVacc, setLastVacc] = useState('')
  const [nextVacc, setNextVacc] = useState('')
  const [savingVacc, setSavingVacc] = useState(false)

  // Only this pet's entries.
  const petJournal = journal.filter(e => e.pet_id === activePet?.id)

  function openForm() {
    // Prefill weight from the active pet's current value.
    setForm({ ...EMPTY_FORM, weight: activePet?.weight != null ? String(activePet.weight) : '' })
    setShowForm(true)
  }

  function openVacc() {
    setLastVacc(activePet?.last_vaccination ?? '')
    setNextVacc(activePet?.next_vaccination ?? '')
    setVaccOpen(true)
  }

  async function saveVacc() {
    if (!activePet || savingVacc) return
    setSavingVacc(true)
    const { error } = await updatePet(activePet.id, {
      last_vaccination: lastVacc || null,
      next_vaccination: nextVacc || null,
    })
    setSavingVacc(false)
    if (error) {
      // Most likely the last_vaccination column is missing — run migration_07.sql.
      alert(`Could not save vaccination: ${error}`)
      return
    }
    setPets(pets.map(p => p.id === activePet.id
      ? { ...p, last_vaccination: lastVacc || null, next_vaccination: nextVacc || null }
      : p))
    setVaccOpen(false)
  }

  async function save() {
    if (!user || saving) return
    setSaving(true)
    const petId = localStorage.getItem('petmind_active_pet')
    const created = await addJournalEntry(user.id, {
      petId, mood: form.mood, energy: form.energy, appetite: form.appetite, sleep: form.sleep,
      weight: form.weight ? Number(form.weight) : null, notes: form.notes,
    })
    // Also update the pet's current weight from this entry.
    if (petId) {
      await updatePet(petId, { weight: form.weight ? Number(form.weight) : null })
      setPets(pets.map(p => p.id === petId
        ? { ...p, weight: form.weight ? Number(form.weight) : null }
        : p))
    }
    setSaving(false)
    if (created) setJournal([created, ...journal])
    // Saving an entry updates the pet's current mood app-wide.
    const mapped = JOURNAL_TO_MOOD[form.mood]
    if (mapped) setMood(mapped)
    setForm(EMPTY_FORM)
    setShowForm(false)
  }

  async function remove(id: string) {
    setJournal(journal.filter(e => e.id !== id))
    await deleteJournalEntry(id)
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{activePet ? `${activePet.name}'s Journal` : 'Pet Journal'}</h1>
          <p className={styles.sub}>Track your pet's daily wellbeing</p>
        </div>
        <div className={styles.headerActions}>
          <Button variant="secondary" onClick={openVacc}>💉 Vaccination</Button>
          <Button onClick={() => (showForm ? setShowForm(false) : openForm())}>+ New Entry</Button>
        </div>
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
              <label className={styles.label}>Weight (kg)</label>
              <input
                className={styles.numInput}
                type="number" min="0" step="0.1" placeholder="e.g. 4.2"
                value={form.weight}
                onChange={e => setForm(f => ({ ...f, weight: e.target.value }))}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Notes</label>
              <textarea className={styles.textarea} rows={3} placeholder="How was your pet today?" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            </div>
          </div>
          <div className={styles.formActions}>
            <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={save} disabled={!form.mood || saving}>{saving ? 'Saving…' : 'Save Entry'}</Button>
          </div>
        </div>
      )}

      {dataLoading ? (
        <div className={styles.loadingBox}>
          <span className={styles.spinner} />
        </div>
      ) : petJournal.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}><Icon name="book-open" size={80} /></span>
          <p>No entries yet. Start tracking {activePet ? `${activePet.name}'s` : "your pet's"} daily mood!</p>
        </div>
      ) : (
        <div className={styles.entries}>
          {petJournal.map(e => (
            <div key={e.id} className={styles.entry}>
              <button className={styles.entryDelete} onClick={() => remove(e.id)} aria-label="Delete entry">✕</button>
              <div className={styles.entryDate}>{fmtDate(e.created_at)}</div>
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

      {/* ── Vaccination modal ── */}
      {vaccOpen && (
        <div className={styles.modalOverlay} onClick={() => setVaccOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>💉 Vaccination</h3>
            <p className={styles.modalSub}>Track {activePet?.name ?? 'your pet'}'s vaccination dates.</p>
            <div className={styles.field}>
              <span className={styles.label}>Last vaccination (done)</span>
              <DatePicker value={lastVacc} onChange={setLastVacc} placeholder="Pick a date" />
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Next vaccination (planned)</span>
              <DatePicker value={nextVacc} onChange={setNextVacc} placeholder="Pick a date" />
            </div>
            <div className={styles.modalActions}>
              <Button variant="ghost" onClick={() => setVaccOpen(false)}>Cancel</Button>
              <Button onClick={saveVacc} disabled={savingVacc}>{savingVacc ? 'Saving…' : 'Save'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
