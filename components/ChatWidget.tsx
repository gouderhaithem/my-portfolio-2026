'use client'

import { useEffect, useRef, useState, FormEvent } from 'react'

interface ChatMessage {
  id: string
  role: 'user' | 'model'
  content: string
}

const MAX_INPUT_LENGTH = 1000
const HISTORY_LIMIT = 12

const SUGGESTIONS = [
  'What services do you offer?',
  "What's your tech stack?",
  'How do engagements work?',
  'How can I start a project?',
]

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const bodyRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const el = bodyRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, loading])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  async function send(text: string) {
    const trimmed = text.trim().slice(0, MAX_INPUT_LENGTH)
    if (!trimmed || loading) return

    setError('')
    const next: ChatMessage[] = [
      ...messages,
      { id: crypto.randomUUID(), role: 'user', content: trimmed },
    ]
    setMessages(next)
    setInput('')
    setLoading(true)

    try {
      const history = next
        .slice(-HISTORY_LIMIT)
        .map(({ role, content }) => ({ role, content }))
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      })
      const data: { reply?: string; error?: string } = await res.json()
      if (!res.ok || !data.reply) {
        throw new Error(data.error || 'Something went wrong')
      }
      setMessages([
        ...next,
        { id: crypto.randomUUID(), role: 'model', content: data.reply },
      ])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    void send(input)
  }

  return (
    <div className="chatbot" data-open={open || undefined}>
      {open && (
        <div className="cb-panel" role="region" aria-label="Chat with Haithem's assistant">
          <div className="cb-head">
            <div className="cb-head-text">
              <span className="cb-eyebrow">AI &middot; Assistant</span>
              <span className="cb-title">
                Ask about <i>Haithem</i>
              </span>
            </div>
            <button
              className="cb-close"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              &#10005;
            </button>
          </div>

          <div className="cb-body" ref={bodyRef}>
            <div className="cb-msg model">
              Hi! I can answer questions about Haithem&apos;s work, skills, and
              services. What would you like to know?
            </div>

            {messages.length === 0 && (
              <div className="cb-suggestions">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => void send(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}

            {messages.map((m) => (
              <div key={m.id} className={`cb-msg ${m.role}`}>
                {m.content}
              </div>
            ))}

            {loading && (
              <div className="cb-msg model cb-typing" aria-label="Assistant is typing">
                <span />
                <span />
                <span />
              </div>
            )}

            {error && <div className="cb-error">{error}</div>}
          </div>

          <form className="cb-form" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              maxLength={MAX_INPUT_LENGTH}
              placeholder="Ask something…"
              onChange={(e) => setInput(e.target.value)}
              aria-label="Your question"
            />
            <button type="submit" disabled={loading || !input.trim()} aria-label="Send">
              &rarr;
            </button>
          </form>
        </div>
      )}

      <button
        className="cb-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close chat' : 'Open chat'}
        aria-expanded={open}
      >
        {open ? (
          <span className="cb-toggle-x">&#10005;</span>
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            aria-hidden="true"
          >
            <path d="M21 12c0 4.1-4 7.4-9 7.4-1 0-2-.13-2.9-.38L4 21l1.5-3.6C4 16 3 14.1 3 12c0-4.1 4-7.4 9-7.4s9 3.3 9 7.4Z" />
            <circle cx="8.5" cy="12" r="0.8" fill="currentColor" />
            <circle cx="12" cy="12" r="0.8" fill="currentColor" />
            <circle cx="15.5" cy="12" r="0.8" fill="currentColor" />
          </svg>
        )}
      </button>
    </div>
  )
}
