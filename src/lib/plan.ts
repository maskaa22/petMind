export type PlanId = 'free' | 'premium'

/** Reads the selected plan from localStorage. Only an explicit 'premium' unlocks; everything else is treated as free. */
export function getPlan(): PlanId {
  return localStorage.getItem('petmind_plan') === 'premium' ? 'premium' : 'free'
}

export function isPremium(): boolean {
  return getPlan() === 'premium'
}

export function setPlan(plan: PlanId): void {
  localStorage.setItem('petmind_plan', plan)
}

/** True only if the user has explicitly chosen a plan (free or premium). */
export function hasPlan(): boolean {
  const v = localStorage.getItem('petmind_plan')
  return v === 'free' || v === 'premium'
}

/** True if the quiz has been completed (answers saved with a pet type). */
export function hasQuiz(): boolean {
  try {
    const data = JSON.parse(localStorage.getItem('petmind_quiz') || '{}')
    return !!data.petType
  } catch {
    return false
  }
}
