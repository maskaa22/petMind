import type { QuizAnswers, PetReport, PersonalityType } from '@/types'

export function generateReport(answers: QuizAnswers): PetReport {
  const personality = resolvePersonality(answers)

  return {
    personalityType: personality,
    personalityLabel: getPersonalityLabel(personality),
    mood: resolveMood(answers),
    moodDescription: getMoodDescription(answers),
    hiddenNeeds: resolveHiddenNeeds(answers),
    communicationStyle: getCommunicationStyle(answers),
    emotionalProfile: {
      curiosity: resolveScore(answers, 'curiosity'),
      confidence: resolveScore(answers, 'confidence'),
      energy: resolveScore(answers, 'energy'),
      sociability: resolveScore(answers, 'sociability'),
      independence: resolveScore(answers, 'independence'),
    },
  }
}

function resolvePersonality(answers: QuizAnswers): PersonalityType {
  if (answers.strangerReaction === 'friendly' && answers.attentionLevel && answers.attentionLevel > 60) return 'social-butterfly'
  if (answers.strangerReaction === 'shy' && answers.petMood === 'calm') return 'gentle-soul'
  if (answers.strangerReaction === 'defensive') return 'loyal-guardian'
  if (answers.petMood === 'playful' || answers.petActivity === 'playing') return 'playful-trickster'
  if (answers.attentionLevel && answers.attentionLevel < 30) return 'independent-thinker'
  return 'curious-explorer'
}

function getPersonalityLabel(type: PersonalityType): string {
  const labels: Record<PersonalityType, string> = {
    'curious-explorer': 'The Curious Explorer',
    'gentle-soul': 'The Gentle Soul',
    'loyal-guardian': 'The Loyal Guardian',
    'playful-trickster': 'The Playful Trickster',
    'social-butterfly': 'The Social Butterfly',
    'independent-thinker': 'The Independent Thinker',
  }
  return labels[type]
}

function resolveMood(answers: QuizAnswers): string {
  const map: Record<string, string> = {
    playful: 'Playful',
    calm: 'Relaxed',
    excited: 'Excited',
    sleepy: 'Tired',
    anxious: 'Attention Seeking',
  }
  return answers.petMood ? map[answers.petMood] : 'Happy'
}

function getMoodDescription(answers: QuizAnswers): string {
  const name = answers.petName || 'Your pet'
  const mood = resolveMood(answers)
  return `${name} is currently feeling ${mood.toLowerCase()}. This is a natural state that reflects their current emotional needs.`
}

function resolveHiddenNeeds(answers: QuizAnswers): string[] {
  const needs: string[] = []
  if (answers.petMood === 'anxious') needs.push('Social interaction')
  if (answers.petActivity === 'sleeping' || answers.petMood === 'sleepy') needs.push('Rest & recovery')
  if (answers.petActivity === 'exploring') needs.push('Environmental enrichment')
  if (answers.attentionLevel && answers.attentionLevel > 70) needs.push('More playtime')
  if (answers.petAge === 'under1') needs.push('Mental stimulation')
  if (needs.length === 0) needs.push('Balanced routine', 'Quality time')
  return needs.slice(0, 3)
}

function getCommunicationStyle(answers: QuizAnswers): string {
  if (answers.petType === 'cat') return 'Uses subtle body language and selective vocalizations to express needs.'
  if (answers.petType === 'dog') return 'Communicates enthusiastically through body language, vocalizations, and physical contact.'
  if (answers.petType === 'bird') return 'Expresses through vocalizations, feather position, and movement patterns.'
  return 'Uses a combination of body posture, movement, and behavioral cues to communicate.'
}

function resolveScore(answers: QuizAnswers, trait: string): number {
  const base = 50
  const adjustments: Record<string, number> = {
    curiosity: answers.petActivity === 'exploring' ? 20 : answers.strangerReaction === 'curious' ? 15 : 0,
    confidence: answers.strangerReaction === 'friendly' ? 20 : answers.strangerReaction === 'defensive' ? -10 : 0,
    energy: answers.petMood === 'excited' || answers.petMood === 'playful' ? 25 : answers.petMood === 'sleepy' ? -20 : 0,
    sociability: answers.attentionLevel ? (answers.attentionLevel - 50) / 2 : 0,
    independence: answers.attentionLevel ? (50 - answers.attentionLevel) / 2 : 0,
  }
  return Math.min(100, Math.max(5, base + (adjustments[trait] ?? 0)))
}
