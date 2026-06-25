export interface Mood {
  value: string
  emoji: string
  label: string
}

export const MOODS: Mood[] = [
  { value: 'playful', emoji: '🎾', label: 'Playful' },
  { value: 'calm',    emoji: '😌', label: 'Calm' },
  { value: 'excited', emoji: '⚡', label: 'Excited' },
  { value: 'sleepy',  emoji: '😴', label: 'Sleepy' },
  { value: 'anxious', emoji: '😟', label: 'Anxious' },
  { value: 'curious', emoji: '🤔', label: 'Curious' },
]

export function findMood(value?: string): Mood {
  return MOODS.find(m => m.value === value) ?? MOODS[1] // default: Calm
}

// Rich, actionable guidance per mood (use {name} placeholder).
export interface MoodGuide {
  summary: string
  doNow: string[]
  toys: string[]
  watch: string
}

// Pick an emoji for a toy based on keywords in its name.
export function toyIcon(name: string): string {
  const n = name.toLowerCase()
  if (n.includes('puzzle') || n.includes('feeder')) return '🧩'
  if (n.includes('snuffle')) return '🌿'
  if (n.includes('lick')) return '🍶'
  if (n.includes('wand') || n.includes('teaser') || n.includes('flirt')) return '🎣'
  if (n.includes('fetch') || n.includes('ball')) return '🎾'
  if (n.includes('tug') || n.includes('rope')) return '🪢'
  if (n.includes('chase') || n.includes('rolling')) return '🔴'
  if (n.includes('treat')) return '🍖'
  if (n.includes('chew')) return '🦴'
  if (n.includes('bedding')) return '🛏️'
  if (n.includes('plush') || n.includes('comfort') || n.includes('snuggle')) return '🧸'
  if (n.includes('texture') || n.includes('novel')) return '✨'
  return '🧸'
}

export const MOOD_GUIDE: Record<string, MoodGuide> = {
  playful: {
    summary: '{name} is energetic and eager to engage — a prime window for active fun and bonding.',
    doNow: ['Start a short, active play session', 'Teach or practise a new trick', 'Reward calm settling afterwards'],
    toys: ['Wand / teaser toys', 'Fetch balls', 'Tug ropes'],
    watch: 'Over-arousal — if play turns nippy or frantic, pause and let {name} cool down.',
  },
  calm: {
    summary: '{name} is relaxed and content — a great moment for quiet connection.',
    doNow: ['Offer gentle petting or grooming', 'Sit nearby and let them rest', 'Keep the environment quiet'],
    toys: ['Soft comfort toys', 'Lick mats', 'Snuffle mats'],
    watch: 'All-day lethargy differs from calm — keep an eye on appetite and energy.',
  },
  excited: {
    summary: '{name} is highly stimulated — channel that energy before it spills over.',
    doNow: ['Give a vigorous exercise burst', 'Use a flirt pole or chase game', 'Then guide into a wind-down routine'],
    toys: ['Flirt poles', 'Chase / rolling toys', 'Treat-dispensing balls'],
    watch: 'If excitement turns to pacing or whining, lower stimulation and offer a quiet space.',
  },
  sleepy: {
    summary: '{name} is winding down and conserving energy — rest is the priority right now.',
    doNow: ['Provide a quiet, cosy resting spot', 'Avoid initiating active play', 'Keep noise and foot-traffic low'],
    toys: ['Soft plush toys', 'Warm bedding', 'Calming chew'],
    watch: 'Excessive sleep plus low appetite over several days is worth a vet check.',
  },
  anxious: {
    summary: '{name} is showing unease — focus on safety, calm and predictability.',
    doNow: ['Reduce noise and commotion', 'Offer a safe retreat space', 'Use a slow, calm voice and steady routine'],
    toys: ['Snuffle mats', 'Long-lasting chews', 'Comfort / snuggle toys'],
    watch: 'Hiding, trembling or appetite loss that persists — consider professional advice.',
  },
  curious: {
    summary: '{name} is exploring and taking everything in — a perfect time for enrichment.',
    doNow: ['Introduce a new safe scent or space', 'Set up a foraging or puzzle activity', 'Rotate in a fresh toy'],
    toys: ['Puzzle feeders', 'Snuffle mats', 'Novel-texture toys'],
    watch: 'Curiosity can lead to chewing or swallowing things — keep hazards out of reach.',
  },
}

/** Shape passed from DashboardLayout to pages via <Outlet context>. */
export interface DashboardContext {
  mood: string
  setMood: (value: string) => void
}
