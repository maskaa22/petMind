// Why each hidden need matters — keyed by the need labels from quizLogic.
export const NEED_INFO: Record<string, string> = {
  'Social interaction':       'Regular companionship prevents loneliness and the stress-driven behaviours that come with it.',
  'Rest & recovery':          'Quality sleep restores energy and supports a stable, balanced mood the next day.',
  'Environmental enrichment': 'Fresh textures, scents and layouts keep the mind sharp and ward off boredom.',
  'More playtime':            'Active play burns excess energy, eases tension and strengthens your bond.',
  'Mental stimulation':       'Problem-solving tasks channel intelligence and curb destructive habits.',
  'Balanced routine':         'Predictable daily rhythms create a sense of safety and lower everyday anxiety.',
  'Quality time':             'Focused one-on-one attention deepens trust and emotional security.',
}

export function needInfo(need: string): string {
  return NEED_INFO[need] ?? 'A core part of keeping your pet healthy, balanced and happy.'
}

// Concrete body-language signals to watch, by pet type.
export interface CommSignal {
  signal: string
  meaning: string
}

export const COMM_SIGNALS: Record<string, CommSignal[]> = {
  cat: [
    { signal: 'Slow blink', meaning: 'Trust and affection — try slowly blinking back.' },
    { signal: 'Tail held high', meaning: 'Confident, content and approachable.' },
    { signal: 'Exposed belly', meaning: 'Deep relaxation — though not always an invite to touch.' },
    { signal: 'Flattened ears', meaning: 'Fear or irritation — give them space.' },
  ],
  dog: [
    { signal: 'Loose, wagging tail', meaning: 'Happy and relaxed.' },
    { signal: 'Play bow (front down, rear up)', meaning: 'A clear invitation to play.' },
    { signal: 'Yawning or lip-licking', meaning: 'Stress or discomfort — not tiredness.' },
    { signal: 'Ears pinned back', meaning: 'Anxiety or appeasement.' },
  ],
  bird: [
    { signal: 'Gently fluffed feathers', meaning: 'Relaxed — but if prolonged, may signal illness.' },
    { signal: 'Soft beak grinding', meaning: 'Contentment, often just before sleep.' },
    { signal: 'Pinning eyes (rapid pupil change)', meaning: 'Excitement or overstimulation.' },
    { signal: 'Tail fanning', meaning: 'Heightened interest or a display.' },
  ],
  rabbit: [
    { signal: 'Binky (mid-air twist)', meaning: 'Pure joy and excitement.' },
    { signal: 'Soft tooth purring', meaning: 'Content and comfortable.' },
    { signal: 'Thumping a hind leg', meaning: 'Alarm or displeasure.' },
    { signal: 'Flopping onto their side', meaning: 'Total relaxation and trust.' },
  ],
  hamster: [
    { signal: 'Stuffing cheek pouches', meaning: 'Gathering food — perfectly normal and healthy.' },
    { signal: 'Stretching and yawning', meaning: 'Relaxed and comfortable.' },
    { signal: 'Freezing in place', meaning: 'Listening for danger — keep things quiet.' },
    { signal: 'Bar biting', meaning: 'Boredom or a need for more space and enrichment.' },
  ],
  other: [
    { signal: 'Relaxed, loose posture', meaning: 'Comfort and a feeling of safety.' },
    { signal: 'Tense, low body', meaning: 'Fear or uncertainty.' },
    { signal: 'Approaching you', meaning: 'Curiosity or seeking interaction.' },
    { signal: 'Withdrawing or hiding', meaning: 'A clear need for space.' },
  ],
}

export function commSignals(petType?: string): CommSignal[] {
  return COMM_SIGNALS[petType ?? ''] ?? COMM_SIGNALS.other
}
