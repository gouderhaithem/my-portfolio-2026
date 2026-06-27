import 'server-only'

// Shared Gemini text-generation helper used by the admin AI writing assistant.
// Mirrors the model/key failover strategy of app/api/chat/route.ts.

const GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-flash-latest',
] as const

const DEFAULT_TIMEOUT_MS = 20_000
const RETRYABLE_STATUSES = new Set([429, 500, 503])

function geminiUrl(model: string): string {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
}

/** Reads one or more API keys (GEMINI_API_KEYS=key1,key2 takes priority). */
export function getGeminiKeys(): string[] {
  const raw = process.env.GEMINI_API_KEYS ?? process.env.GEMINI_API_KEY ?? ''
  return raw
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean)
}

class UpstreamError extends Error {
  constructor(public readonly status: number) {
    super('Upstream AI error')
    this.name = 'UpstreamError'
  }
}

export interface GenerateOptions {
  prompt: string
  system?: string
  temperature?: number
  maxOutputTokens?: number
  /** When true, asks Gemini to return JSON (response_mime_type). */
  json?: boolean
  timeoutMs?: number
}

async function callModel(apiKey: string, model: string, opts: GenerateOptions): Promise<string> {
  const res = await fetch(geminiUrl(model), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
    body: JSON.stringify({
      ...(opts.system ? { system_instruction: { parts: [{ text: opts.system }] } } : {}),
      contents: [{ role: 'user', parts: [{ text: opts.prompt }] }],
      generationConfig: {
        temperature: opts.temperature ?? 0.7,
        maxOutputTokens: opts.maxOutputTokens ?? 1024,
        ...(opts.json ? { responseMimeType: 'application/json' } : {}),
      },
    }),
    signal: AbortSignal.timeout(opts.timeoutMs ?? DEFAULT_TIMEOUT_MS),
  })

  if (!res.ok) {
    const detail = await res.text()
    console.error(`Gemini ${model} error ${res.status}: ${detail.slice(0, 300)}`)
    throw new UpstreamError(res.status)
  }

  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[]
  }
  const text = data.candidates?.[0]?.content?.parts
    ?.map((p) => p.text ?? '')
    .join('')
    .trim()

  if (!text) throw new Error('Gemini returned an empty response')
  return text
}

/**
 * Generates text with model + key failover. Throws on total failure.
 */
export async function generateText(opts: GenerateOptions): Promise<string> {
  const keys = getGeminiKeys()
  if (keys.length === 0) throw new Error('GEMINI_API_KEY is not configured')

  let lastError: unknown = null
  for (const model of GEMINI_MODELS) {
    for (let i = 0; i < keys.length; i++) {
      try {
        return await callModel(keys[i], model, opts)
      } catch (error) {
        lastError = error
        const retryable =
          error instanceof UpstreamError && RETRYABLE_STATUSES.has(error.status)
        const timedOut = error instanceof Error && error.name === 'TimeoutError'
        if (!retryable && !timedOut) throw error
      }
    }
  }
  throw lastError instanceof Error ? lastError : new Error('All Gemini models failed')
}
