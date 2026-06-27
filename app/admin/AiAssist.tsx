'use client'

import { useState } from 'react'
import { aiAssist, type AiMode, type AiFormat } from './ai-actions'
import styles from './admin.module.css'

interface ContextField {
  label: string
  id: string
}

interface AiAssistProps {
  /** id of the input/textarea this assistant writes into. */
  targetId: string
  contentType: 'blog post' | 'project' | 'service'
  /** Human label of the field, e.g. "excerpt". */
  field: string
  format?: AiFormat
  /** Which actions to show. Defaults depend on format. */
  modes?: AiMode[]
  /** Other fields to read for grounding the prompt. */
  context?: ContextField[]
}

function readValue(id: string): string {
  const el = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | null
  return el?.value ?? ''
}

function writeValue(id: string, value: string): void {
  const el = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | null
  if (!el) return
  el.value = value
  // Notify any listeners (and keep uncontrolled fields in sync).
  el.dispatchEvent(new Event('input', { bubbles: true }))
  el.focus()
}

export default function AiAssist({
  targetId,
  contentType,
  field,
  format = 'text',
  modes,
  context,
}: AiAssistProps) {
  const [open, setOpen] = useState(false)
  const [instruction, setInstruction] = useState('')
  const [busy, setBusy] = useState<AiMode | null>(null)
  const [error, setError] = useState<string | null>(null)

  const availableModes: AiMode[] =
    modes ?? (format === 'sections' ? ['generate'] : ['generate', 'reformulate'])

  async function run(mode: AiMode) {
    setBusy(mode)
    setError(null)
    try {
      const ctx: Record<string, string> = {}
      for (const c of context ?? []) {
        const v = readValue(c.id)
        if (v.trim()) ctx[c.label] = v
      }
      const result = await aiAssist({
        contentType,
        field,
        mode,
        format,
        current: readValue(targetId),
        instruction: instruction.trim() || undefined,
        context: Object.keys(ctx).length ? ctx : undefined,
      })
      if (result.error) {
        setError(result.error)
        return
      }
      if (result.text) {
        writeValue(targetId, result.text)
        setOpen(false)
        setInstruction('')
      }
    } catch {
      setError('Something went wrong — please try again.')
    } finally {
      setBusy(null)
    }
  }

  const labels: Record<AiMode, string> = {
    generate: format === 'sections' ? 'Generate draft' : 'Generate',
    reformulate: 'Reformulate',
  }

  return (
    <div className={styles.ai}>
      <button
        type="button"
        className={styles.aiToggle}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span aria-hidden="true">✦</span> AI
      </button>

      {open && (
        <div className={styles.aiPanel}>
          <input
            type="text"
            className={styles.aiInput}
            placeholder="Optional: tell the AI what you want…"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                run(availableModes[0])
              }
            }}
          />
          <div className={styles.aiActions}>
            {availableModes.map((mode) => (
              <button
                key={mode}
                type="button"
                className={styles.aiBtn}
                disabled={busy !== null}
                onClick={() => run(mode)}
              >
                {busy === mode ? 'Working…' : labels[mode]}
              </button>
            ))}
          </div>
          {error && <p className={styles.aiError}>{error}</p>}
        </div>
      )}
    </div>
  )
}
