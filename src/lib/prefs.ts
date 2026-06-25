import { useSyncExternalStore } from 'react'

export type PrefKey = 'dailyTip' | 'soundEffects' | 'reduceMotion'

const STORAGE_KEY = 'petmind_prefs'
const DEFAULTS: Record<PrefKey, boolean> = {
  dailyTip: true,
  soundEffects: false,
  reduceMotion: false,
}

function read(): Record<PrefKey, boolean> {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }
  } catch {
    return { ...DEFAULTS }
  }
}

// Cached snapshot so getSnapshot returns a stable reference for useSyncExternalStore.
let current = read()
const listeners = new Set<() => void>()

export function getPrefs(): Record<PrefKey, boolean> {
  return current
}

export function setPref(key: PrefKey, value: boolean): void {
  current = { ...current, [key]: value }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current))
  applyGlobalPrefs()
  listeners.forEach(l => l())
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb)
  return () => { listeners.delete(cb) }
}

/** React hook — re-renders the component whenever any preference changes. */
export function usePrefs(): Record<PrefKey, boolean> {
  return useSyncExternalStore(subscribe, getPrefs, getPrefs)
}

/** Applies preferences that affect the whole document (call once at startup and on change). */
export function applyGlobalPrefs(): void {
  document.documentElement.classList.toggle('reduce-motion', current.reduceMotion)
}
