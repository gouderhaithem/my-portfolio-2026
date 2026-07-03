'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

interface DropdownOption {
  value: string
  icon: string
  label: string
}

interface DropdownProps {
  id: string
  label: string
  placeholder: string
  options: DropdownOption[]
  value: string
  onChange: (value: string) => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

// label holds a contactForm.* message key, resolved at render time.
const TYPE_OPTIONS: DropdownOption[] = [
  { value: 'website', icon: '▢', label: 'typeWebsite' },
  { value: 'crm', icon: '△', label: 'typeCrm' },
  { value: 'erp', icon: '◇', label: 'typeErp' },
  { value: 'other', icon: '·', label: 'typeOther' },
]

const BUDGET_OPTIONS: DropdownOption[] = [
  { value: '<100k', icon: '·', label: 'budget1' },
  { value: '100-500k', icon: '··', label: 'budget2' },
  { value: '500k-1.5m', icon: '···', label: 'budget3' },
  { value: '1.5m+', icon: '····', label: 'budget4' },
]

/** Reuses the landing page's .dd styles with React-managed open/select state. */
function Dropdown({ id, label, placeholder, options, value, onChange, open, onOpenChange }: DropdownProps) {
  const [focusIdx, setFocusIdx] = useState(-1)
  const rootRef = useRef<HTMLDivElement>(null)
  const t = useTranslations('contactForm')

  useEffect(() => {
    if (!open) {
      setFocusIdx(-1)
      return
    }
    const close = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) onOpenChange(false)
    }
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [open, onOpenChange])

  const selected = options.find((o) => o.value === value)

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onOpenChange(false)
      return
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (!open) {
        onOpenChange(true)
        const start = options.findIndex((o) => o.value === value)
        setFocusIdx(start >= 0 ? start : 0)
        return
      }
      const dir = e.key === 'ArrowDown' ? 1 : -1
      setFocusIdx((i) => (i + dir + options.length) % options.length)
      return
    }
    if ((e.key === 'Enter' || e.key === ' ') && open && focusIdx >= 0) {
      e.preventDefault()
      onChange(options[focusIdx].value)
      onOpenChange(false)
    }
  }

  return (
    <div className="field">
      <label htmlFor={`${id}-trigger`}>{label}</label>
      <div ref={rootRef} className={`dd${open ? ' on' : ''}${value ? '' : ' empty'}`}>
        <button
          type="button"
          className="dd-trigger"
          id={`${id}-trigger`}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-activedescendant={open && focusIdx >= 0 ? `${id}-opt-${focusIdx}` : undefined}
          onClick={() => onOpenChange(!open)}
          onKeyDown={handleTriggerKeyDown}
        >
          <span className="dd-value">{selected ? t(selected.label) : placeholder}</span>
          <span className="dd-caret" aria-hidden="true">
            <svg viewBox="0 0 12 8" width="12" height="8">
              <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.4" fill="none" />
            </svg>
          </span>
        </button>
        <ul className="dd-menu" role="listbox">
          {options.map((option, i) => (
            <li
              key={option.value}
              id={`${id}-opt-${i}`}
              role="option"
              aria-selected={option.value === value}
              className={
                [option.value === value ? 'selected' : '', i === focusIdx ? 'kbd-focus' : '']
                  .filter(Boolean)
                  .join(' ') || undefined
              }
              onMouseEnter={() => setFocusIdx(i)}
              onClick={() => {
                onChange(option.value)
                onOpenChange(false)
              }}
            >
              <span className="dd-icon">{option.icon}</span>
              <span>{t(option.label)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

interface Toast {
  title: string
  sub: string
  isError: boolean
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Standalone contact form for the /contact page. Same markup and classes as
 * the landing page's #contact form, but self-contained: the landing version
 * is wired up by PortfolioInit, which doesn't run on sub-pages.
 */
export default function ContactForm() {
  const t = useTranslations('contactForm')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [type, setType] = useState('')
  const [budget, setBudget] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)
  const [openDd, setOpenDd] = useState<'type' | 'budget' | null>(null)

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 4500)
    return () => clearTimeout(timer)
  }, [toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const trimmedMessage = message.trim()
    if (!trimmedName || !EMAIL_RE.test(trimmedEmail) || !type || !trimmedMessage) {
      setError(!EMAIL_RE.test(trimmedEmail) ? t('errorEmail') : t('errorFields'))
      return
    }

    setSending(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          type,
          budget,
          message: trimmedMessage,
        }),
      })
      if (!res.ok) throw new Error('Request failed')
      setName('')
      setEmail('')
      setType('')
      setBudget('')
      setMessage('')
      setSent(true)
      setToast({ title: t('toastSentTitle'), sub: t('toastSentSub'), isError: false })
      setTimeout(() => setSent(false), 4000)
    } catch {
      setToast({ title: t('toastErrorTitle'), sub: t('toastErrorSub'), isError: true })
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <form className="contact-form" noValidate onSubmit={handleSubmit}>
        <div className="row">
          <div className="field">
            <label htmlFor="f-name">{t('nameLabel')}</label>
            <input
              id="f-name"
              name="name"
              type="text"
              placeholder={t('namePlaceholder')}
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="f-email">{t('emailLabel')}</label>
            <input
              id="f-email"
              name="email"
              type="email"
              placeholder={t('emailPlaceholder')}
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="row">
          <Dropdown
            id="f-type"
            label={t('typeLabel')}
            placeholder={t('typePlaceholder')}
            options={TYPE_OPTIONS}
            value={type}
            onChange={setType}
            open={openDd === 'type'}
            onOpenChange={(o) => setOpenDd(o ? 'type' : null)}
          />
          <Dropdown
            id="f-budget"
            label={t('budgetLabel')}
            placeholder={t('budgetPlaceholder')}
            options={BUDGET_OPTIONS}
            value={budget}
            onChange={setBudget}
            open={openDd === 'budget'}
            onOpenChange={(o) => setOpenDd(o ? 'budget' : null)}
          />
        </div>
        <div className="field">
          <label htmlFor="f-msg">{t('messageLabel')}</label>
          <textarea
            id="f-msg"
            name="message"
            rows={4}
            placeholder={t('messagePlaceholder')}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <div className={`form-status${error ? ' err' : ''}`} aria-live="polite">
          {error}
        </div>
        <div className="submit-row">
          <span className="form-note">{t('note')}</span>
          <button className="send-btn" type="submit" disabled={sending || sent}>
            {sent ? (
              <>
                <span>{t('sent')}</span>
                <span className="arr">&#10003;</span>
              </>
            ) : (
              <>
                <span>{sending ? t('sending') : t('send')}</span>
                {!sending && <span className="arr">&rarr;</span>}
              </>
            )}
          </button>
        </div>
      </form>

      {toast && (
        <div
          className="toast"
          role="status"
          style={toast.isError ? { borderLeftColor: '#ff8b6b' } : undefined}
          onClick={() => setToast(null)}
        >
          <div className="toast-icon">{toast.isError ? '✕' : '✓'}</div>
          <div className="toast-body">
            <span className="toast-title">{toast.title}</span>
            <span className="toast-sub">{toast.sub}</span>
          </div>
        </div>
      )}
    </>
  )
}
