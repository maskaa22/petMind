import { supabase } from './supabase'
import type { QuizAnswers } from '@/types'

// ── Profile ───────────────────────────────────────────
export interface Profile {
  id: string
  name: string | null
  prem: boolean
  created_at: string
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()
  if (error) { console.error('[db] getProfile', error); return null }
  return data as Profile | null
}

export async function setPremium(userId: string, prem: boolean): Promise<void> {
  const { error } = await supabase.from('profiles').update({ prem }).eq('id', userId)
  if (error) console.error('[db] setPremium', error)
}

export async function updateProfileName(userId: string, name: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('profiles').update({ name }).eq('id', userId)
  return { error: error?.message ?? null }
}

// ── Pets ──────────────────────────────────────────────
export interface Pet {
  id: string
  user_id: string
  name: string
  age: number | null
  weight: number | null
  next_vaccination: string | null
  quiz: QuizAnswers | null
  created_at: string
}

export async function getPets(userId: string): Promise<Pet[]> {
  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) { console.error('[db] getPets', error); return [] }
  return (data ?? []) as Pet[]
}

export async function createPet(
  userId: string,
  pet: { name: string; age?: number | null; weight?: number | null; quiz?: QuizAnswers },
): Promise<Pet | null> {
  const { data, error } = await supabase
    .from('pets')
    .insert({
      user_id: userId,
      name: pet.name,
      age: pet.age ?? null,
      weight: pet.weight ?? null,
      quiz: pet.quiz ?? null,
    })
    .select()
    .single()
  if (error) { console.error('[db] createPet', error); return null }
  return data as Pet
}

export async function updatePetQuiz(petId: string, quiz: QuizAnswers): Promise<void> {
  const { error } = await supabase.from('pets').update({ quiz }).eq('id', petId)
  if (error) console.error('[db] updatePetQuiz', error)
}

export async function updatePet(
  petId: string,
  fields: { weight?: number | null; next_vaccination?: string | null },
): Promise<void> {
  const { error } = await supabase.from('pets').update(fields).eq('id', petId)
  if (error) console.error('[db] updatePet', error)
}

export async function deletePet(petId: string): Promise<void> {
  const { error } = await supabase.from('pets').delete().eq('id', petId)
  if (error) console.error('[db] deletePet', error)
}

// ── Journal ───────────────────────────────────────────
export interface JournalEntry {
  id: string
  user_id: string
  pet_id: string | null
  mood: string
  energy: number
  appetite: number
  sleep: number
  weight: number | null
  notes: string
  created_at: string
}

export async function getJournalEntries(userId: string): Promise<JournalEntry[]> {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) { console.error('[db] getJournalEntries', error); return [] }
  return (data ?? []) as JournalEntry[]
}

export async function addJournalEntry(
  userId: string,
  entry: { petId?: string | null; mood: string; energy: number; appetite: number; sleep: number; weight?: number | null; notes: string },
): Promise<JournalEntry | null> {
  const { data, error } = await supabase
    .from('journal_entries')
    .insert({
      user_id: userId,
      pet_id: entry.petId ?? null,
      mood: entry.mood,
      energy: entry.energy,
      appetite: entry.appetite,
      sleep: entry.sleep,
      weight: entry.weight ?? null,
      notes: entry.notes,
    })
    .select()
    .single()
  if (error) { console.error('[db] addJournalEntry', error); return null }
  return data as JournalEntry
}

export async function deleteJournalEntry(id: string): Promise<void> {
  const { error } = await supabase.from('journal_entries').delete().eq('id', id)
  if (error) console.error('[db] deleteJournalEntry', error)
}

// ── Account ───────────────────────────────────────────
/** Deletes the current user + all their data (pets, journal, profile) via DB function. */
export async function deleteAccount(): Promise<{ error: string | null }> {
  const { error } = await supabase.rpc('delete_account')
  return { error: error?.message ?? null }
}
