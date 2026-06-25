import { getPrefs } from './prefs'

// Tiny click sound generated via Web Audio (no asset / network needed).
let ctx: AudioContext | null = null

export function playClick(): void {
  if (!getPrefs().soundEffects) return
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    ctx = ctx || new AudioCtx()
    if (ctx.state === 'suspended') void ctx.resume()

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.type = 'sine'
    osc.frequency.setValueAtTime(620, ctx.currentTime)
    gain.gain.setValueAtTime(0.05, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.11)

    osc.start()
    osc.stop(ctx.currentTime + 0.12)
  } catch {
    /* audio not available — ignore */
  }
}
