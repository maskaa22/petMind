// Pet type categories. "Rodents" and "Reptiles" are umbrella categories whose
// exact subspecies is chosen later (in the AI chat) and stored on the pet.
export interface Category {
  label: string
  subspecies: string[]
}

export const PET_CATEGORIES: Record<string, Category> = {
  hamster: {
    label: 'Rodents',
    subspecies: ['Hamster', 'Guinea pig', 'Rat', 'Mouse', 'Gerbil', 'Chinchilla'],
  },
  other: {
    label: 'Reptiles',
    subspecies: ['Chameleon', 'Snake', 'Turtle', 'Lizard', 'Gecko', 'Bearded dragon'],
  },
  bird: {
    label: 'Birds',
    subspecies: ['Parrot', 'Canary', 'Budgie', 'Cockatiel', 'Finch', 'Lovebird'],
  },
}

const TYPE_LABEL: Record<string, string> = {
  cat: 'Cat', dog: 'Dog', rabbit: 'Rabbit',
}

/** Returns the category for an umbrella type, or null for a concrete type. */
export function categoryOf(petType?: string): Category | null {
  return petType && PET_CATEGORIES[petType] ? PET_CATEGORIES[petType] : null
}

/** True if this type needs a subspecies chosen (Rodents / Reptiles). */
export function isCategory(petType?: string): boolean {
  return !!categoryOf(petType)
}

/** Human label to use in conversation: the subspecies if known, else the type/category. */
export function speciesLabel(petType?: string, subspecies?: string | null): string {
  if (subspecies) return subspecies
  const cat = categoryOf(petType)
  if (cat) return cat.label
  return TYPE_LABEL[petType ?? ''] ?? 'pet'
}
