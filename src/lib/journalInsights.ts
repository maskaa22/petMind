import type { JournalEntry } from './db'

export interface Tip {
  text: string
  warn?: boolean
}

const HAPPY = '😊 Happy'
const CALM = '😌 Calm'
const ANXIOUS = '😟 Anxious'

function avg(nums: number[]): number {
  if (!nums.length) return 0
  return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10
}

/** Adaptive care tips from the last few days of entries. */
export function adaptiveTips(entries: JournalEntry[], petName: string): Tip[] {
  if (!entries.length) return []

  const energy = avg(entries.map(e => e.energy))
  const appetite = avg(entries.map(e => e.appetite))
  const sleep = avg(entries.map(e => e.sleep))
  const anxiousShare = entries.filter(e => e.mood === ANXIOUS).length / entries.length
  const happyCalmShare = entries.filter(e => e.mood === HAPPY || e.mood === CALM).length / entries.length

  const tips: Tip[] = []

  if (sleep < 4)
    tips.push({ text: `${petName} hasn't been resting well lately — keep a quiet spot and a steady sleep routine.`, warn: true })
  if (appetite < 4)
    tips.push({ text: `Appetite has been low — keep meals appealing and consistent; if it continues, check with a vet. 🩺`, warn: true })
  if (anxiousShare >= 0.3)
    tips.push({ text: `${petName} has seemed anxious often — prioritise calm, predictability and a safe place to retreat.`, warn: true })

  if (energy > 7)
    tips.push({ text: `Lots of energy lately — add active play or exploration so ${petName} doesn't get bored.` })
  else if (energy < 4)
    tips.push({ text: `Energy has dipped — keep activities gentle and don't overexert ${petName}.` })

  if (happyCalmShare >= 0.5 && !tips.some(t => t.warn))
    tips.push({ text: `${petName} has been happy and settled — great work! Keep the routine going. 💛` })

  // Warnings first, max 4.
  return tips.sort((a, b) => (b.warn ? 1 : 0) - (a.warn ? 1 : 0)).slice(0, 4)
}

/** A short weekly recap sentence. */
export function weeklySummary(entries: JournalEntry[], petName: string): string | null {
  if (!entries.length) return null

  const n = entries.length
  const counts = new Map<string, number>()
  for (const e of entries) counts.set(e.mood, (counts.get(e.mood) ?? 0) + 1)
  const topMood = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'

  const energy = avg(entries.map(e => e.energy))
  const appetite = avg(entries.map(e => e.appetite))
  const sleep = avg(entries.map(e => e.sleep))

  // Weight change across the window (first vs last logged weight).
  const weighed = entries
    .filter(e => e.weight != null)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
  let weightSentence = ''
  if (weighed.length >= 2) {
    const delta = Math.round((weighed[weighed.length - 1].weight! - weighed[0].weight!) * 10) / 10
    if (delta > 0) weightSentence = ` Weight is up ${delta} kg.`
    else if (delta < 0) weightSentence = ` Weight is down ${Math.abs(delta)} kg — worth keeping an eye on.`
    else weightSentence = ' Weight held steady.'
  }

  const concerning = energy < 4 || appetite < 4 || sleep < 4
  const verdict = concerning
    ? ' A few things to keep an eye on this week.'
    : ' Overall, a good week! 🐾'

  return `Over the last 7 days, ${petName} has ${n} ${n === 1 ? 'entry' : 'entries'}. Mood was mostly ${topMood}. Averages — energy ${energy}/10, appetite ${appetite}/10, sleep ${sleep}/10.${weightSentence}${verdict}`
}
