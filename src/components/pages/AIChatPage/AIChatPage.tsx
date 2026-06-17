import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/Button'
import styles from './AIChatPage.module.scss'

interface Message {
  role: 'user' | 'ai'
  text: string
}

const SUGGESTIONS = [
  'Why does my cat wake me up at night?',
  'Why is my dog barking more lately?',
  'Why is my rabbit hiding?',
  'How can I reduce my pet\'s anxiety?',
]

const AI_RESPONSES: Record<string, string> = {
  default: 'That\'s a great question! Based on your pet\'s profile, this behavior often relates to their emotional state and environment. I recommend observing patterns around the time it happens and ensuring their basic needs (food, rest, stimulation) are consistently met.\n\n⚠️ Note: If you notice this alongside other symptoms, please consult a licensed veterinarian.',
}

export function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Hi! I\'m your AI Pet Coach. Ask me anything about your pet\'s behavior, mood, or needs. I\'m here to help! 🐾' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function send(text: string) {
    if (!text.trim()) return
    setMessages(m => [...m, { role: 'user', text }])
    setInput('')
    setLoading(true)
    setTimeout(() => {
      setMessages(m => [...m, { role: 'ai', text: AI_RESPONSES.default }])
      setLoading(false)
    }, 1200)
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>AI Pet Coach</h1>
        <p className={styles.sub}>Ask anything about your pet's behavior</p>
      </div>

      <div className={styles.chatWrap}>
        <div className={styles.messages}>
          {messages.map((m, i) => (
            <div key={i} className={[styles.msg, styles[m.role]].join(' ')}>
              {m.role === 'ai' && <span className={styles.avatar}>🤖</span>}
              <div className={styles.bubble}>{m.text}</div>
            </div>
          ))}
          {loading && (
            <div className={[styles.msg, styles.ai].join(' ')}>
              <span className={styles.avatar}>🤖</span>
              <div className={styles.bubble}>
                <span className={styles.typing}>···</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className={styles.suggestions}>
          {SUGGESTIONS.map(s => (
            <button key={s} className={styles.suggestion} onClick={() => send(s)}>{s}</button>
          ))}
        </div>

        <div className={styles.inputRow}>
          <input
            className={styles.input}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send(input)}
            placeholder="Ask about your pet..."
          />
          <Button onClick={() => send(input)} disabled={!input.trim() || loading}>Send</Button>
        </div>
      </div>
    </div>
  )
}
