// Lightweight offline "coach" — matches a question against topic keywords
// and returns the best-fitting answer. No backend / API key required.
// Use {name} as a placeholder for the pet's name.

interface Topic {
  keywords: string[]
  answer: string
}

const TOPICS: Topic[] = [
  {
    keywords: ['night', 'nocturnal', 'midnight', 'wake', 'awake', 'sleep at night', '3am', 'evening'],
    answer: "Many pets are most active at dawn and dusk by instinct. Give {name} a solid play session and a small meal in the evening — burning that energy helps them settle and sleep through the night.",
  },
  {
    keywords: ['not eating', 'won\'t eat', 'wont eat', 'refuse food', 'refusing', 'lost appetite', 'no appetite', 'skipping meals', 'off food'],
    answer: "A drop in appetite can come from stress, routine changes or being unwell. Keep feeding times steady and meals appealing, and remove competition or noise at mealtime. If {name} won't eat for more than 24 hours, or it comes with lethargy or vomiting, see a vet. 🩺",
  },
  {
    keywords: ['eat', 'eating', 'food', 'appetite', 'hungry', 'feeding', 'meal', 'diet', 'how much', 'portion', 'feed', 'nutrition'],
    answer: "Feed {name} a complete, age-appropriate food in consistent portions split across the day, and always keep fresh water available. Sudden diet changes upset digestion — switch foods gradually over about a week. Your vet can confirm the right amount for {name}'s size and age.",
  },
  {
    keywords: ['treat', 'treats', 'human food', 'table scraps', 'can he eat', 'can she eat', 'can my', 'chocolate', 'toxic', 'poison', 'grapes', 'onion', 'safe to eat', 'bones'],
    answer: "Treats are great for training but should stay under ~10% of {name}'s daily calories. Avoid common toxics like chocolate, grapes/raisins, onion, garlic and xylitol. When unsure whether a human food is safe, skip it and check with your vet first. ⚠️",
  },
  {
    keywords: ['water', 'drink', 'drinking', 'thirsty', 'not drinking', 'dehydrat', 'hydration'],
    answer: "Fresh, clean water should always be available. Some pets prefer a wide bowl or a pet fountain. Watch for big changes: drinking far more or far less than usual can signal a health issue worth a vet check for {name}.",
  },
  {
    keywords: ['too fast', 'gulps', 'gulping', 'eats fast', 'scarf', 'wolf', 'overweight', 'weight', 'fat', 'chubby', 'lose weight', 'begging'],
    answer: "If {name} eats too quickly, try a slow-feeder bowl or a puzzle feeder to pace them and add mental work. For weight, measure portions, limit treats and keep up daily activity — and ask your vet for a target weight if you're unsure.",
  },
  {
    keywords: ['bite', 'biting', 'aggress', 'nip', 'attack', 'growl', 'hiss', 'scratch me', 'lunge'],
    answer: "Biting or growling is usually communication, not malice — often fear, overstimulation or pain. Watch what happens right before it, give {name} space, and avoid punishment (it raises fear). Reward calm behaviour instead.",
  },
  {
    keywords: ['bark', 'barking', 'meow', 'meowing', 'vocal', 'noisy', 'loud', 'whine', 'crying', 'noise'],
    answer: "Vocalising is how {name} asks for something — attention, food, play or reassurance. Note when it happens, meet the underlying need, and reward quiet moments rather than reacting to every sound.",
  },
  {
    keywords: ['anxious', 'anxiety', 'stress', 'scared', 'afraid', 'fear', 'nervous', 'trembl', 'shaking', 'panic'],
    answer: "For anxiety, predictability is everything. Keep routines steady, give {name} a quiet safe space to retreat to, introduce changes slowly and use a calm voice. Persistent fear or trembling is worth discussing with a vet.",
  },
  {
    keywords: ['toy', 'toys', 'play', 'bored', 'boredom', 'entertain', 'enrichment', 'fun'],
    answer: "Match activities to energy: puzzle feeders and snuffle mats for the mind, wand or chase toys for active bursts, and soft toys for downtime. Rotate 2–3 toys at a time so {name} stays interested.",
  },
  {
    keywords: ['ignore', 'ignoring', 'attention', 'aloof', 'distant', 'not listening'],
    answer: "It's rarely personal! {name} often tunes out when focused on something. Instead of repeating their name, approach with a toy or treat — engagement beats insistence, and trust grows from positive interactions.",
  },
  {
    keywords: ['hide', 'hiding', 'withdraw', 'avoid', 'under the bed', 'retreat'],
    answer: "Hiding is a normal way to self-soothe, but a sudden increase can signal stress or illness. Make sure {name} has a cosy safe spot, keep the environment calm, and watch for changes in eating or energy.",
  },
  {
    keywords: ['toilet', 'litter', 'pee', 'poop', 'accident', 'potty', 'house train', 'marking'],
    answer: "Toileting issues often trace back to cleanliness, location or stress. Keep the area clean and accessible, avoid sudden changes, and rule out health causes with a vet if accidents are new or frequent.",
  },
  {
    keywords: ['walk', 'exercise', 'energy', 'hyper', 'restless', 'zoomies', 'active'],
    answer: "A tired pet is a calm pet. Build in daily structured activity suited to {name}'s energy — a couple of shorter sessions usually beat one long one for keeping mood balanced.",
  },
  {
    keywords: ['trust', 'bond', 'bonding', 'closer', 'relationship', 'affection', 'love'],
    answer: "Let {name} set the pace. Reward moments they choose to come close, keep interactions calm and pressure-free, and stay consistent. Trust is built from many small positive experiences over time.",
  },
  {
    keywords: ['bath', 'bathe', 'bathing', 'wash', 'washing', 'shampoo', 'dirty', 'smell', 'smelly', 'odor', 'odour'],
    answer: "Bathe {name} only when needed — over-washing strips natural oils. Use lukewarm water and a pet-specific shampoo (never human products), rinse thoroughly, and dry gently afterwards. Keep it calm and reward generously so baths stay stress-free.",
  },
  {
    keywords: ['groom', 'grooming', 'brush', 'brushing', 'fur', 'shed', 'shedding', 'coat', 'mat', 'matted', 'tangle', 'dematt', 'hair'],
    answer: "Brushing keeps {name}'s coat healthy, cuts shedding and is great bonding time. Long or double coats need brushing several times a week; short coats once a week is plenty. Work gently in the direction of growth, ease out tangles slowly, and pair it with treats so it stays a positive ritual.",
  },
  {
    keywords: ['nail', 'nails', 'claw', 'claws', 'trim', 'clip', 'teeth', 'tooth', 'dental', 'brush teeth', 'ear', 'ears', 'ear cleaning'],
    answer: "Routine care matters: trim {name}'s nails every few weeks (avoid the pink quick), brush teeth with pet-safe toothpaste a few times a week, and wipe the outer ears when dirty — never poke deep inside. Introduce each slowly with rewards, and ask your vet or groomer to demonstrate the first time.",
  },
  {
    keywords: [
      'neuter', 'neutered', 'spay', 'spayed', 'castrate', 'castrated', 'fixed',
      'desex', 'desexed', 'sterilis', 'sterilize', 'sterilized', 'snip',
    ],
    answer: "After being neutered, {name} often becomes calmer, with less roaming, marking and mating-driven behaviour — though core personality stays the same. Recovery takes a few quiet days: limit jumping, keep the incision clean and watch for swelling. Neutered pets also gain weight more easily, so adjust portions and keep them active. For anything unusual post-op, check with your vet. 🩺",
  },
  {
    keywords: [
      'lies down', 'lying down', 'lay down', 'laying down', "won't get up", 'wont get up',
      "doesn't get up", 'does not get up', 'not getting up', "can't get up", "won't move",
      'not moving', 'barely moves', 'sluggish', 'weak', 'no energy', 'low energy',
      'listless', 'limp body', 'collapse', 'sleeping all day', 'tired all the time',
    ],
    answer: "If {name} is lying down and not getting up, barely moving or seems unusually weak, treat it as a warning sign — that can point to pain, illness or exhaustion. Note any other changes (eating, breathing, toileting) and please contact a vet promptly to be safe. 🩺",
  },
  {
    keywords: [
      'sick', 'ill', 'vet', 'health', 'pain', 'hurt', 'limp', 'limping', 'vomit', 'throwing up',
      'diarrhea', 'lethargic', 'lethargy', 'unwell', 'shaking', 'seizure', 'bleeding', 'injured', 'wound',
    ],
    answer: "I can't diagnose health issues, but trust your instincts: if {name} shows pain, lethargy, vomiting or any sudden change, please contact a licensed vet. Early checks are always the safest choice. 🩺",
  },
]

const FALLBACKS = [
  "Great question about {name}! Behaviour usually traces back to a need — comfort, stimulation, safety or attention. Try noticing the pattern around when it happens, and adjust the routine to meet that need.",
  "Every behaviour is {name} communicating something. Look at what happens just before it, keep routines predictable, and reward the calm, desired moments. If it's sudden or worrying, a vet check is wise.",
  "With {name}, consistency and patience go a long way. Meet their core needs — rest, play, nutrition and connection — and most everyday quirks ease over time. Tell me a bit more and I'll get specific!",
]

// Training advice tailored to each species (use {name}).
const TRAINING_KEYWORDS = [
  'train', 'training', 'teach', 'trick', 'tricks', 'command', 'commands',
  'obey', 'listen', 'learn', 'recall', 'sit', 'stay', 'come when called', 'clicker',
]

const TRAINING_BY_TYPE: Record<string, string> = {
  dog: "Dogs are highly trainable and food-motivated. Start with 'sit', 'stay', 'come' and loose-leash walking. Use a marker word or clicker, reward instantly, and keep sessions to 5 minutes. {name} thrives on praise — be consistent with cues and never punish mistakes.",
  cat: "Cats learn well with patience — just don't expect dog-style obedience. Use a clicker and treats to teach 'come', 'sit', 'high-five' or targeting a stick. Keep sessions under 3 minutes and always end before {name} loses interest. Litter habits reinforce themselves with a clean, quiet box.",
  rabbit: "Rabbits are smart and clicker-trainable! Litter training comes first, then 'come', 'spin' or 'stand' using their favourite veg as a reward. Train at floor level so {name} feels safe, keep it calm, and never chase or grab — fear undoes progress fast.",
  bird: "A {species} is an exceptional learner. Begin with 'step-up' onto your hand, then target training, recall and even words through repetition. Reward with a favourite treat the instant {name} responds. Short, daily, positive sessions build both skills and trust.",
  hamster: "Small rodents like a {species} learn through gentle hand-taming rather than commands. Let {name} take treats from your palm, then teach 'come' to a sound and simple maze tasks. Go slow, work during their awake hours, and never wake them to train.",
  other: "Reptiles like a {species} don't train like cats or dogs, but they do learn routines. Use target training with a stick, hand-feed to build tameness, and keep handling short and consistent. A calm, warm environment matters most for {name}.",
}

function trainingReply(question: string, petType?: string): string | null {
  const q = question.toLowerCase()
  const hit = TRAINING_KEYWORDS.some(kw => q.includes(kw))
  if (!hit) return null
  return TRAINING_BY_TYPE[petType ?? ''] ?? TRAINING_BY_TYPE.other
}

export function getCoachReply(question: string, petName: string, petType?: string, species?: string): string {
  const q = question.toLowerCase()

  // Training is answered with species-specific guidance.
  const training = trainingReply(question, petType)
  if (training) return fill(training, petName, species)

  let best: Topic | null = null
  let bestScore = 0
  for (const topic of TOPICS) {
    const score = topic.keywords.reduce((n, kw) => (q.includes(kw) ? n + 1 : n), 0)
    if (score > bestScore) {
      bestScore = score
      best = topic
    }
  }

  // Vary the fallback by question length so repeats feel less canned.
  const fallback = FALLBACKS[question.trim().length % FALLBACKS.length]
  return fill(best ? best.answer : fallback, petName, species)
}

function fill(text: string, petName: string, species?: string): string {
  return text.split('{name}').join(petName).split('{species}').join(species ?? 'pet')
}
