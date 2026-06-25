import { useState, useRef, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { getCoachReply } from '@/lib/coach'
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
  other: '/cub.png',
}

function getQuiz(): { petName?: string; petType?: string } {
  try { return JSON.parse(localStorage.getItem('petmind_quiz') || '{}') }
  catch { return {} }
}

// Preset questions the coach can answer instantly. Use {name} for the pet's name.
const QUICK_QA: { q: string; a: string }[] = [
  {
    q: 'Why does {name} ignore me sometimes?',
    a: "It's rarely personal! {name} often tunes out when focused on a scent, sound or task. Instead of repeating their name, approach calmly with a toy or treat — engagement works better than insistence.",
  },
  {
    q: 'How can I reduce {name}\'s anxiety?',
    a: 'Predictability is your best tool. Keep feeding, play and rest times consistent, give {name} a quiet safe space to retreat to, and avoid sudden loud changes. Calm routines lower stress fast.',
  },
  {
    q: 'What toys are best for {name}?',
    a: 'Match toys to energy: puzzle feeders and snuffle mats for curious minds, wand or chase toys for active bursts, and soft comfort toys for winding down. Rotate 2–3 at a time to keep novelty high.',
  },
  {
    q: 'Why is {name} more active at night?',
    a: 'Many pets are naturally crepuscular — most active at dawn and dusk. A good play session and a small meal in the evening helps {name} burn energy and settle for the night.',
  },
  {
    q: 'How do I build more trust with {name}?',
    a: 'Let {name} set the pace. Reward voluntary closeness, use a calm voice, and keep interactions positive and pressure-free. Trust grows from consistency and respect for their boundaries.',
  },
]

export function AIChatPage() {
  const { premium } = useAuth()
  const quiz = getQuiz()
  const petName = quiz.petName || 'your pet'
  const petImg = PET_IMAGE[quiz.petType ?? ''] ?? '/cat.png'

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      text: `Hi! I'm ${petName}'s AI coach. Ask me anything about their behavior, mood or daily needs.`,
      time: now(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [askedQuestions, setAskedQuestions] = useState<string[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)

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
  function onDragEnd() {
    drag.current.down = false
  }

  const fillName = (s: string) => s.split('{name}').join(petName)
  const quickQuestions = QUICK_QA.filter(q => !askedQuestions.includes(q.q))

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  function send(text: string, answer?: string) {
    if (!text.trim()) return
    setMessages(m => [...m, { role: 'user', text, time: now() }])
    setInput('')
    setLoading(true)
    const reply = answer ?? getCoachReply(text, petName, quiz.petType)
    setTimeout(() => {
      setMessages(m => [...m, { role: 'ai', text: reply, time: now() }])
      setLoading(false)
    }, 1200)
  }

  function askPreset(qa: { q: string; a: string }) {
    if (drag.current.moved) return // ignore click that ended a drag
    setAskedQuestions(prev => [...prev, qa.q])
    send(fillName(qa.q), fillName(qa.a))
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

        {/* ── Quick questions ── */}
        {quickQuestions.length > 0 && !loading && (
          <div
            className={styles.suggestions}
            ref={dragRef}
            onPointerDown={onDragStart}
            onPointerMove={onDragMove}
            onPointerUp={onDragEnd}
            onPointerLeave={onDragEnd}
          >
            {quickQuestions.map(qa => (
              <button
                key={qa.q}
                className={styles.suggestion}
                onClick={() => askPreset(qa)}
              >
                {fillName(qa.q)}
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
            onKeyDown={e => e.key === 'Enter' && send(input)}
            placeholder={`Ask about ${petName}'s behavior...`}
          />
          <button
            className={styles.sendBtn}
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            aria-label="Send"
          >
            →
          </button>
        </div>

      </div>
    </div>
  )
}
