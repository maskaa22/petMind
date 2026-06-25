import type { PersonalityType } from '@/types'

export interface PersonalityProfile {
  intro: string
  strengths: string
  behavior: string
  needs: string
  recommendations: string
  tips: string[]
  funFact: string
}

// Use {name} as a placeholder — replaced with the pet's name at render time.
export const PERSONALITY_PROFILES: Record<PersonalityType, PersonalityProfile> = {
  'curious-explorer': {
    intro: '{name} is driven by an endless need to investigate. New sounds, smells and spaces aren\'t threats — they\'re invitations. This curiosity is a sign of confidence and sharp cognition.',
    strengths: 'Fearless problem-solver. {name} learns fast, adapts to change easily, and rarely gets bored when given something new to figure out.',
    behavior: 'Investigates first, reacts later. Expect nose-led wandering, opening or testing things, and intense focus on anything unfamiliar in the environment.',
    needs: 'Mental stimulation above all. Without new challenges {name} can grow restless and may invent their own "projects" — often the kind you\'d rather they didn\'t.',
    recommendations: 'Rotate toys weekly, hide treats to forage, and introduce one small new experience every few days to keep that bright mind satisfied.',
    tips: [
      'Use puzzle feeders to turn mealtime into a brain game.',
      'Rotate 2–3 toys at a time instead of leaving them all out — novelty keeps interest high.',
      'Let {name} safely explore a new room or scent each week.',
    ],
    funFact: 'Curious pets like {name} often show higher stress resilience — exploration trains their brain to treat the unknown as exciting rather than scary.',
  },
  'gentle-soul': {
    intro: '{name} experiences the world softly and deeply. Sensitive to tone, routine and atmosphere, they thrive where things feel calm, safe and predictable.',
    strengths: 'Deeply affectionate and emotionally attuned. {name} reads your mood, offers quiet comfort, and forms tender, trusting bonds.',
    behavior: 'Seeks closeness on their own terms. Gentle approaches, soft vocalisations, and a strong preference for familiar people and quiet corners.',
    needs: 'Stability and reassurance. Loud environments, abrupt change or tension can overwhelm {name} and show up as withdrawal.',
    recommendations: 'Keep routines consistent, introduce changes slowly, and reward calm behaviour with gentle praise rather than high-energy excitement.',
    tips: [
      'Keep feeding and rest times consistent — predictability lowers anxiety.',
      'Create one cosy "safe zone" {name} can always retreat to.',
      'Approach calmly and let {name} initiate contact rather than reaching over them.',
    ],
    funFact: 'Gentle, sensitive pets often bond most strongly with one person — that quiet loyalty is a hallmark of {name}\'s temperament.',
  },
  'loyal-guardian': {
    intro: '{name} is devoted to their family and keenly aware of their surroundings. Protective instincts run deep, paired with a strong sense of "their" people and space.',
    strengths: 'Steadfast, alert and dependable. {name} is attentive to the household, quick to notice change, and unwavering once trust is earned.',
    behavior: 'Watches and patrols. Expect monitoring of doors and windows, alertness to new arrivals, and a calm confidence around trusted people.',
    needs: 'Clear structure and a sense of purpose. Without it, {name}\'s watchfulness can tip into over-guarding or unnecessary alarm.',
    recommendations: 'Offer consistent boundaries, positive socialisation with new people, and "jobs" or training that channel that protective drive constructively.',
    tips: [
      'Introduce new guests calmly and reward relaxed behaviour.',
      'Give {name} a predictable daily structure — it eases the urge to stay "on duty".',
      'Channel guarding energy into training games or scent work.',
    ],
    funFact: 'Guardian-type pets read body language exceptionally well — {name} likely senses visitors\' moods before you do.',
  },
  'playful-trickster': {
    intro: '{name} turns life into a game. Energetic, clever and a little mischievous, they\'re happiest when there\'s movement, fun and an audience to entertain.',
    strengths: 'Smart, agile and endlessly entertaining. {name} learns tricks quickly and uses play to bond, communicate and burn energy.',
    behavior: 'Initiates games and tests limits. Expect playful "stealing", attention-seeking antics, and bursts of zoomies when energy peaks.',
    needs: 'Daily active play and outlets for that energy. A bored trickster will create their own entertainment — sometimes at your expense.',
    recommendations: 'Schedule short, vigorous play sessions, teach trick-based games, and reward cleverness so mischief turns into cooperation.',
    tips: [
      'Two short play bursts a day beat one long session for energy balance.',
      'Teach a "trade" cue so playful grabbing becomes a fun game, not a chase.',
      'Reward problem-solving toys — a clever pet needs to *win* sometimes.',
    ],
    funFact: 'Play isn\'t just fun for {name} — it\'s how trickster types practise social skills and self-regulation well into adulthood.',
  },
  'social-butterfly': {
    intro: '{name} comes alive around others. Outgoing, warm and people-oriented, they treat company — human or animal — as the best part of any day.',
    strengths: 'Friendly, adaptable and confident in social settings. {name} welcomes new faces and rarely shies away from interaction.',
    behavior: 'Seeks contact and engagement. Expect greeting rituals, following you room to room, and visible delight when guests arrive.',
    needs: 'Regular companionship and interaction. Long stretches alone can leave {name} lonely and under-stimulated.',
    recommendations: 'Build in daily social time, arrange friendly meetups where possible, and use enrichment to ease any time spent solo.',
    tips: [
      'Avoid long isolation — leave interactive toys or background sound when out.',
      'Arrange calm, positive meetups with other pets or people.',
      'Greet {name} warmly on return; reconnection matters to social types.',
    ],
    funFact: 'Social butterflies like {name} often mirror household energy — a calm, happy home tends to produce a calm, happy pet.',
  },
  'independent-thinker': {
    intro: '{name} values autonomy. Observant and self-assured, they enjoy company on their own terms and are perfectly content doing their own thing.',
    strengths: 'Self-reliant, composed and low-maintenance emotionally. {name} handles alone-time well and makes confident, deliberate choices.',
    behavior: 'Chooses when to engage. Expect watchful distance, selective affection, and a clear preference for personal space over constant attention.',
    needs: 'Respect for their boundaries. Forced interaction or crowding can make {name} retreat further and erode trust.',
    recommendations: 'Let {name} initiate contact, provide elevated or private resting spots, and reward voluntary closeness instead of demanding it.',
    tips: [
      'Let {name} come to you — invitation beats insistence with independent types.',
      'Provide a private, elevated spot that\'s theirs alone.',
      'Reward the moments {name} *chooses* to engage to build trust over time.',
    ],
    funFact: 'Independence isn\'t aloofness — {name} simply shows affection through proximity and calm presence rather than constant contact.',
  },
}

export function fill(text: string, name: string): string {
  return text.split('{name}').join(name)
}
