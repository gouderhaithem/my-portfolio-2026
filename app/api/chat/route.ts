import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import path from 'path'

// Tried in order — if a model is overloaded (503) or out of quota (429),
// the next one is attempted immediately.
const GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-flash-latest',
] as const

function geminiUrl(model: string): string {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
}

// Multiple keys (GEMINI_API_KEYS=key1,key2,key3) act as quota failover —
// falls back to the single GEMINI_API_KEY if not set.
function getApiKeys(): string[] {
  const raw = process.env.GEMINI_API_KEYS ?? process.env.GEMINI_API_KEY ?? ''
  return raw
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean)
}

const MAX_MESSAGES = 12
const MAX_MESSAGE_LENGTH = 1000
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 10
const RATE_MAP_MAX_ENTRIES = 5000
const GEMINI_TIMEOUT_MS = 15_000

interface ChatMessage {
  role: 'user' | 'model'
  content: string
}

// --- Knowledge base (loaded once per server instance) ---

let cachedProfile: string | null = null

function getProfile(): string {
  if (cachedProfile === null) {
    cachedProfile = readFileSync(
      path.join(process.cwd(), 'data', 'profile.md'),
      'utf-8'
    )
  }
  return cachedProfile
}

function buildSystemPrompt(): string {
  return `You are the friendly AI assistant on Gouder Haithem's portfolio website.
Your job is to answer visitors' questions about Haithem — his skills, services,
work, experience, and how to hire him.

Rules:
- Answer ONLY using the profile below. If the answer isn't there, say you don't
  have that detail and suggest contacting Haithem directly via the contact form
  or gouderhaithem@gmail.com.
- Keep answers short and conversational (2-4 sentences, plain text, no markdown
  headings). Use a warm, professional tone.
- ALWAYS reply in the same language the visitor writes in: English, French,
  Arabic, or Algerian Darja. The profile is written in English — translate the
  facts naturally into the visitor's language.
- If someone wants to hire him or discuss a project, point them to the contact
  form on this page or his email.
- Never invent projects, clients, prices, or dates.
- Politely decline questions unrelated to Haithem or his work.

--- PROFILE ---
${getProfile()}
--- END PROFILE ---`
}

// --- Simple in-memory rate limiting (per IP, per server instance) ---

const rateMap = new Map<string, { count: number; windowStart: number }>()

function pruneRateMap(now: number): void {
  if (rateMap.size < RATE_MAP_MAX_ENTRIES) return
  for (const [key, entry] of rateMap) {
    if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) rateMap.delete(key)
  }
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  pruneRateMap(now)
  const entry = rateMap.get(ip)
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateMap.set(ip, { count: 1, windowStart: now })
    return false
  }
  const next = { ...entry, count: entry.count + 1 }
  rateMap.set(ip, next)
  return next.count > RATE_LIMIT_MAX_REQUESTS
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip')?.trim() ||
    'unknown'
  )
}

// --- Input validation ---

function parseMessages(body: unknown): ChatMessage[] | null {
  if (
    typeof body !== 'object' ||
    body === null ||
    !Array.isArray((body as { messages?: unknown }).messages)
  ) {
    return null
  }
  const raw = (body as { messages: unknown[] }).messages
  if (raw.length === 0 || raw.length > MAX_MESSAGES) return null

  const messages: ChatMessage[] = []
  for (const item of raw) {
    const msg = item as { role?: unknown; content?: unknown }
    if (
      (msg.role !== 'user' && msg.role !== 'model') ||
      typeof msg.content !== 'string' ||
      msg.content.trim().length === 0 ||
      msg.content.length > MAX_MESSAGE_LENGTH
    ) {
      return null
    }
    messages.push({ role: msg.role, content: msg.content })
  }

  if (messages[messages.length - 1].role !== 'user') return null
  return messages
}

// --- Gemini call ---

class UpstreamError extends Error {
  constructor(public readonly status: number) {
    super('Upstream AI error')
    this.name = 'UpstreamError'
  }
}

// Statuses worth retrying on the next model: overloaded, out of quota,
// or a transient server error.
const RETRYABLE_STATUSES = new Set([429, 500, 503])

async function askModel(
  apiKey: string,
  model: string,
  messages: ChatMessage[]
): Promise<string> {
  const res = await fetch(geminiUrl(model), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: buildSystemPrompt() }] },
      contents: messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.content }],
      })),
      generationConfig: { maxOutputTokens: 512, temperature: 0.7 },
    }),
    signal: AbortSignal.timeout(GEMINI_TIMEOUT_MS),
  })

  if (!res.ok) {
    const detail = await res.text()
    console.error(`Gemini ${model} error ${res.status}: ${detail.slice(0, 300)}`)
    throw new UpstreamError(res.status)
  }

  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[]
  }
  const reply = data.candidates?.[0]?.content?.parts
    ?.map((p) => p.text ?? '')
    .join('')
    .trim()

  if (!reply) throw new Error('Gemini returned an empty response')
  return reply
}

async function askGemini(apiKeys: string[], messages: ChatMessage[]): Promise<string> {
  let lastError: unknown = null
  // Model-major order: best model is tried on every key before degrading.
  for (const model of GEMINI_MODELS) {
    for (let i = 0; i < apiKeys.length; i++) {
      try {
        return await askModel(apiKeys[i], model, messages)
      } catch (error) {
        lastError = error
        const retryable =
          error instanceof UpstreamError && RETRYABLE_STATUSES.has(error.status)
        const timedOut = error instanceof Error && error.name === 'TimeoutError'
        if (!retryable && !timedOut) throw error
        console.error(`${model} on key #${i + 1} unavailable, trying next fallback`)
      }
    }
  }
  throw lastError instanceof Error ? lastError : new Error('All models failed')
}

// --- Route handler ---

export async function POST(request: NextRequest) {
  try {
    const apiKeys = getApiKeys()
    if (apiKeys.length === 0) {
      console.error('GEMINI_API_KEYS / GEMINI_API_KEY is not configured')
      return NextResponse.json(
        { error: 'Chat is not available right now' },
        { status: 503 }
      )
    }

    if (isRateLimited(getClientIp(request))) {
      return NextResponse.json(
        { error: 'Too many messages — please wait a minute' },
        { status: 429 }
      )
    }

    const messages = parseMessages(await request.json())
    if (!messages) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const reply = await askGemini(apiKeys, messages)
    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Chat error:', error)
    if (error instanceof Error && error.name === 'TimeoutError') {
      return NextResponse.json(
        { error: 'The assistant took too long — please try again' },
        { status: 504 }
      )
    }
    if (error instanceof UpstreamError) {
      return NextResponse.json(
        { error: 'The assistant is busy right now — try again in a moment' },
        { status: 503 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to get a response' },
      { status: 500 }
    )
  }
}
