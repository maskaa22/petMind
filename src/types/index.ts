export type PetType = 'cat' | 'dog' | 'rabbit' | 'bird' | 'hamster' | 'other'

export type PetAge = 'under1' | '1-3' | '4-7' | '8+'

export type PetMood = 'playful' | 'calm' | 'excited' | 'sleepy' | 'anxious'

export type PetActivity = 'sleeping' | 'playing' | 'eating' | 'exploring' | 'watchingMe'

export type StrangerReaction = 'friendly' | 'curious' | 'shy' | 'defensive'

export interface QuizAnswers {
  petType?: PetType
  petName?: string
  petAge?: PetAge
  petMood?: PetMood
  petActivity?: PetActivity
  attentionLevel?: number
  strangerReaction?: StrangerReaction
  personalityImage?: number
}

export type PersonalityType =
  | 'curious-explorer'
  | 'gentle-soul'
  | 'loyal-guardian'
  | 'playful-trickster'
  | 'social-butterfly'
  | 'independent-thinker'

export interface PetReport {
  personalityType: PersonalityType
  personalityLabel: string
  mood: string
  moodDescription: string
  hiddenNeeds: string[]
  communicationStyle: string
  emotionalProfile: {
    curiosity: number
    confidence: number
    energy: number
    sociability: number
    independence: number
  }
}

export interface Plan {
  id: 'monthly' | 'yearly' | 'lifetime'
  label: string
  price: string
  period: string
  badge?: string
}
