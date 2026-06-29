import { useState, useRef, useEffect } from 'react'
import { Navigate, useOutletContext } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { getCoachReply } from '@/lib/coach'
import { setPetSubspecies } from '@/lib/db'
import { categoryOf, isCategory, speciesLabel } from '@/lib/species'
import type { DashboardContext } from '@/lib/moods'
import { ROUTES } from '@/lib/constants'
import styles from './AIChatPage.module.scss'

interface Message {
  role: 'user' | 'ai'
  text: string
  time: string
}

function now() {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

const PET_IMAGE: Record<string, string> = {
  cat: '/cat.png',
  dog: '/dog1.png',
  rabbit: '/rabbit.png',
  bird: '/chiken.png',
  hamster: '/ho.png',
  other: '/chameleon.png',
}

function getQuiz(): { petName?: string; petType?: string } {
  try { return JSON.parse(localStorage.getItem('petmind_quiz') || '{}') }
  catch { return {} }
}

// Preset questions the coach answers instantly. {name}/{species} are filled in.
const QUICK_QA: { q: string; a: string }[] = [
  {
    q: 'Why does {name} ignore me sometimes?',
    a: "It's rarely personal! {name} often tunes out when focused on a scent, sound or task. Approach calmly rather than repeating their name — engagement works better than insistence.",
  },
  {
    q: 'How can I reduce {name}\'s anxiety?',
    a: 'Predictability is your best tool. Keep feeding and rest times consistent, give {name} a quiet safe space, and avoid sudden loud changes. Calm routines lower stress fast.',
  },
  {
    q: 'What does a {species} need to stay healthy?',
    a: 'A {species} thrives on the right diet, a clean and correctly set-up habitat, and daily interaction or enrichment. Keep an eye on appetite, energy and toileting — changes there are the earliest signs something is off with {name}.',
  },
  {
    q: 'What toys or enrichment suit a {species}?',
    a: 'For a {species}, rotate enrichment that matches their instincts — foraging, exploring, climbing or chewing as appropriate. Introduce one new thing at a time so {name} stays curious, not overwhelmed.',
  },
  {
    q: 'How do I build more trust with {name}?',
    a: 'Let {name} set the pace. Reward voluntary closeness, move slowly, and keep interactions calm and pressure-free. Trust grows from consistency and respect for their boundaries.',
  },
]

export function AIChatPage() {
  const { premium } = useAuth()
  const { dataLoading, pets, setPets, activePet } = useOutletContext<DashboardContext>()
  const quiz = getQuiz()

  const petName = activePet?.name || quiz.petName || 'your pet'
  // Category/subspecies come strictly from the active pet (never stale localStorage).
  const petType = activePet?.quiz?.petType
  const subspecies = activePet?.subspecies ?? null
  const category = categoryOf(petType)
  const needsSubspecies = !!activePet && isCategory(petType) && !subspecies
  const species = speciesLabel(petType, subspecies)
  const petImg = PET_IMAGE[petType ?? ''] ?? PET_IMAGE[quiz.petType ?? ''] ?? '/cat.png'

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [askedQuestions, setAskedQuestions] = useState<string[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)
  const initRef = useRef(false)

  // Drag-to-scroll for the quick-question row (mouse swipe).
  const dragRef = useRef<HTMLDivElement>(null)
  const drag = useRef({ down: false, startX: 0, scrollLeft: 0, moved: false })

  function onDragStart(e: React.PointerEvent) {
    const el = dragRef.current
    if (!el) return
    drag.current = { down: true, startX: e.clientX, scrollLeft: el.scrollLeft, moved: false }
  }
  function onDragMove(e: React.PointerEvent) {
    const el = dragRef.current
    if (!el || !drag.current.down) return
    const dx = e.clientX - drag.current.startX
    if (Math.abs(dx) > 4) drag.current.moved = true
    el.scrollLeft = drag.current.scrollLeft - dx
  }
  function onDragEnd() { drag.current.down = false }

  const fillText = (s: string) => s.split('{name}').join(petName).split('{species}').join(species.toLowerCase())
  const quickQuestions = QUICK_QA.filter(q => !askedQuestions.includes(q.q))

  // Greet once the pet data has loaded.
  useEffect(() => {
    if (initRef.current || dataLoading) return
    initRef.current = true
    const greeting = needsSubspecies
      ? `Hi! 🐾 Before we start — what kind of ${category?.label.toLowerCase()} is ${petName}? Pick one below.`
      : `Hi! I'm ${petName}'s AI coach. Ask me anything about your ${species.toLowerCase()}'s behaviour, mood or daily needs.`
    setMessages([{ role: 'ai', text: greeting, time: now() }])
  }, [dataLoading, needsSubspecies, category, petName, species])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  function send(text: string, answer?: string) {
    if (!text.trim()) return
    setMessages(m => [...m, { role: 'user', text, time: now() }])
    setInput('')
    setLoading(true)
    const reply = answer ?? getCoachReply(text, petName, petType, species)
    setTimeout(() => {
      setMessages(m => [...m, { role: 'ai', text: reply, time: now() }])
      setLoading(false)
    }, 1200)
  }

  function askPreset(qa: { q: string; a: string }) {
    if (drag.current.moved) return
    setAskedQuestions(prev => [...prev, qa.q])
    send(fillText(qa.q), fillText(qa.a))
  }

  async function pickSubspecies(sub: string) {
    if (drag.current.moved || !activePet) return
    setMessages(m => [...m, { role: 'user', text: sub, time: now() }])
    setLoading(true)
    await setPetSubspecies(activePet.id, sub)
    setPets(pets.map(p => (p.id === activePet.id ? { ...p, subspecies: sub } : p)))
    setTimeout(() => {
      setMessages(m => [...m, {
        role: 'ai',
        text: `A ${sub} — wonderful! 🐾 From now on I'll tailor everything to ${petName} as a ${sub.toLowerCase()}. Ask me anything.`,
        time: now(),
      }])
      setLoading(false)
    }, 900)
  }

  // Free users can't access the AI coach
  if (!premium) return <Navigate to={ROUTES.PAYWALL} replace />

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        {/* ── Chat header ── */}
        <div className={styles.chatHeader}>
          <div className={styles.chatAvatarWrap}>
            <img src={petImg} alt="AI Coach" className={styles.chatAvatarImg} />
          </div>
          <div className={styles.chatInfo}>
            <p className={styles.chatName}>{petName}'s AI Coach</p>
            <p className={styles.chatStatus}>
              <span className={styles.onlineDot} />
              Online
            </p>
          </div>
        </div>

        {/* ── Messages ── */}
        <div className={styles.messages}>
          {messages.map((m, i) => (
            <div key={i} className={[styles.msg, styles[m.role]].join(' ')}>
              {m.role === 'ai' && (
                <div className={styles.msgAvatar}>
                  <img src={petImg} alt="" className={styles.msgAvatarImg} />
                </div>
              )}
              <div className={styles.msgBody}>
                <div className={styles.bubble}>{m.text}</div>
                <p className={styles.time}>{m.time}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className={[styles.msg, styles.ai].join(' ')}>
              <div className={styles.msgAvatar}>
                <img src={petImg} alt="" className={styles.msgAvatarImg} />
              </div>
              <div className={styles.msgBody}>
                <div className={styles.bubble}>
                  <span className={styles.typing}><span /><span /><span /></span>
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* ── Subspecies picker (categories only) ── */}
        {needsSubspecies && !loading && category && (
          <div className={styles.suggestions} ref={dragRef}
            onPointerDown={onDragStart} onPointerMove={onDragMove} onPointerUp={onDragEnd} onPointerLeave={onDragEnd}>
            {category.subspecies.map(sub => (
              <button key={sub} className={styles.suggestion} onClick={() => pickSubspecies(sub)}>
                {sub}
              </button>
            ))}
          </div>
        )}

        {/* ── Quick questions ── */}
        {!needsSubspecies && quickQuestions.length > 0 && !loading && (
          <div className={styles.suggestions} ref={dragRef}
            onPointerDown={onDragStart} onPointerMove={onDragMove} onPointerUp={onDragEnd} onPointerLeave={onDragEnd}>
            {quickQuestions.map(qa => (
              <button key={qa.q} className={styles.suggestion} onClick={() => askPreset(qa)}>
                {fillText(qa.q)}
              </button>
            ))}
          </div>
        )}

        {/* ── Input ── */}
        <div className={styles.inputArea}>
          <input
            className={styles.input}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !needsSubspecies && send(input)}
            placeholder={needsSubspecies ? `First, pick what kind of ${category?.label.toLowerCase()} ${petName} is…` : `Ask about ${petName}...`}
            disabled={needsSubspecies}
          />
          <button
            className={styles.sendBtn}
            onClick={() => send(input)}
            disabled={!input.trim() || loading || needsSubspecies}
            aria-label="Send"
          >
            →
          </button>
        </div>

      </div>
    </div>
  )
}
