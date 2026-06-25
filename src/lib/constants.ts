export const SECTION_IDS = {
  HERO: 'hero',
  BENEFITS: 'benefits',
  SOCIAL_PROOF: 'social-proof',
  FAQ: 'faq',
} as const

export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  QUIZ: '/quiz',
  ANALYSIS: '/analysis',
  PAYWALL: '/paywall',
  CHECKOUT: '/checkout',
  DASHBOARD: '/dashboard',
  REPORTS: '/dashboard/reports',
  AI_CHAT: '/dashboard/chat',
  JOURNAL: '/dashboard/journal',
  TRENDS: '/dashboard/trends',
  SETTINGS: '/dashboard/settings',
} as const

export const PLANS = [
  { id: 'monthly', label: 'Monthly', price: '$9.99', period: '/month' },
  { id: 'yearly', label: 'Yearly', price: '$4.99', period: '/month', badge: 'Recommended' },
  { id: 'lifetime', label: 'Lifetime', price: '$49.99', period: 'one-time' },
] as const

export const PERSONALITY_TYPES = {
  'curious-explorer': { label: 'The Curious Explorer', emoji: '🔍' },
  'gentle-soul': { label: 'The Gentle Soul', emoji: '💛' },
  'loyal-guardian': { label: 'The Loyal Guardian', emoji: '🛡️' },
  'playful-trickster': { label: 'The Playful Trickster', emoji: '🎭' },
  'social-butterfly': { label: 'The Social Butterfly', emoji: '🦋' },
  'independent-thinker': { label: 'The Independent Thinker', emoji: '🌙' },
} as const

export const ANALYSIS_MESSAGES = [
  'Analyzing behavior patterns...',
  'Building personality profile...',
  'Reading emotional signals...',
  'Comparing behavior traits...',
  'Generating insights...',
]

export const QUIZ_TOTAL_STEPS = 8
