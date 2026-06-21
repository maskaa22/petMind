import { useState, useRef, useEffect } from 'react'
import styles from './AIChatPage.module.scss'

interface Message {
  role: 'user' | 'ai'
  text: string
  time: string
}

function now() {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

function getPetName() {
  try { return JSON.parse(localStorage.getItem('petmind_quiz') || '{}').petName || 'your pet' }
  catch { return 'your pet' }
}

const AI_RESPONSE = `That's actually very typical for The Curious Explorer type! Your pet isn't ignoring you — they're likely in the middle of a sensory focus moment. Try engaging them with a small toy or treat when you arrive, rather than calling their name directly.`

export function AIChatPage() {
  const petName = getPetName()

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      text: `Hi! I'm ${petName}'s AI coach. Ask me anything about their behavior, mood or daily needs.`,
      time: now(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  function send(text: string) {
    if (!text.trim()) return
    setMessages(m => [...m, { role: 'user', text, time: now() }])
    setInput('')
    setLoading(true)
    setTimeout(() => {
      setMessages(m => [...m, { role: 'ai', text: AI_RESPONSE, time: now() }])
      setLoading(false)
    }, 1200)
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        {/* ── Chat header ── */}
        <div className={styles.chatHeader}>
          <div className={styles.chatAvatarWrap}>
            <img src="/cat.png" alt="AI Coach" className={styles.chatAvatarImg} />
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
                  <img src="/cat.png" alt="" className={styles.msgAvatarImg} />
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
                <img src="/cat.png" alt="" className={styles.msgAvatarImg} />
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
