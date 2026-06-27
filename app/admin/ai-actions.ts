'use server'

import { getSession } from '@/lib/auth'
import { generateText } from '@/lib/gemini'
import { contentSectionsSchema } from '@/lib/schemas'

// AI writing assistant for the admin forms. Generates or reformulates copy for
// projects, blog posts, and services. Auth-gated — only a signed-in admin can
// spend Gemini quota.

export type AiMode = 'generate' | 'reformulate'
export type AiFormat = 'text' | 'sections' | 'lines'

export interface AiAssistInput {
  contentType: 'blog post' | 'project' | 'service'
  /** Human label of the field, e.g. "excerpt", "summary", "tagline". */
  field: string
  mode: AiMode
  format?: AiFormat
  /** Current value of the field (used for reformulate / as a starting point). */
  current?: string
  /** Optional free-text brief from the admin. */
  instruction?: string
  /** Other field values for grounding, e.g. { title, category }. */
  context?: Record<string, string>
}

export interface AiAssistResult {
  text?: string
  error?: string
}

const MAX_INPUT = 8000

const SYSTEM = `You are a writing assistant embedded in the admin CMS of Gouder Haithem,
a software engineer in Algiers who builds websites, CRMs, and ERP systems.
You write and refine portfolio content: projects, blog posts, and services.

Voice:
- Confident, precise, concrete. Plain, considered English.
- Favor specifics over adjectives. Active voice.
- No marketing clichés (avoid "cutting-edge", "seamless", "leverage",
  "game-changing", "robust", "synergy"), no hype, no emojis.
- Sound like a senior engineer writing about real work.

Output rules:
- Return ONLY the requested content. No preamble, no explanation, no labels.
- Do not wrap the answer in quotes or markdown code fences (unless JSON is asked).
- When reformulating, keep the original language and meaning.`

function buildContext(context?: Record<string, string>): string {
  if (!context) return ''
  const lines = Object.entries(context)
    .filter(([, v]) => v && v.trim())
    .map(([k, v]) => `- ${k}: ${v.trim().slice(0, 1000)}`)
  return lines.length ? `\n\nContext:\n${lines.join('\n')}` : ''
}

function buildPrompt(input: AiAssistInput): string {
  const { contentType, field, mode, format = 'text', current, instruction } = input
  const ctx = buildContext(input.context)
  const brief = instruction?.trim() ? `\n\nAdditional instruction: ${instruction.trim()}` : ''

  if (format === 'sections') {
    return `Write the body of this ${contentType} as a JSON array of content blocks.
Each block is an object with optional keys:
- "heading": string (a short section heading)
- "paragraphs": string[] (one or more paragraphs)
- "bullets": string[] (optional bullet points)
- "quote": string (an optional pull-quote)
Use 3 to 5 blocks. Do not include any other keys.${ctx}${brief}${
      current?.trim() ? `\n\nExisting draft to build on:\n${current.trim().slice(0, MAX_INPUT)}` : ''
    }`
  }

  if (format === 'lines') {
    const base =
      mode === 'reformulate' && current?.trim()
        ? `Improve and tighten this list for the ${field} of a ${contentType}. Return one item per line, no numbering or bullets.\n\n${current.trim().slice(0, MAX_INPUT)}`
        : `Write a short list for the ${field} of a ${contentType}. Return one item per line, no numbering or bullets.`
    return `${base}${ctx}${brief}`
  }

  if (mode === 'reformulate') {
    return `Rewrite and improve the ${field} of this ${contentType}. Keep it roughly the same length and the same language. Return only the rewritten text.${ctx}${brief}\n\nText to rewrite:\n${(current ?? '').trim().slice(0, MAX_INPUT)}`
  }

  // generate
  return `Write the ${field} for this ${contentType}.${ctx}${brief}${
    current?.trim() ? `\n\nRough notes to work from:\n${current.trim().slice(0, MAX_INPUT)}` : ''
  }`
}

function cleanText(text: string): string {
  // Strip accidental surrounding quotes or code fences.
  let t = text.trim()
  if (t.startsWith('```')) t = t.replace(/^```[a-z]*\n?/i, '').replace(/```$/, '').trim()
  if (
    (t.startsWith('"') && t.endsWith('"')) ||
    (t.startsWith('“') && t.endsWith('”'))
  ) {
    t = t.slice(1, -1).trim()
  }
  return t
}

export async function aiAssist(input: AiAssistInput): Promise<AiAssistResult> {
  const session = await getSession()
  if (!session) return { error: 'Not authorized' }

  if (!input.field || (input.mode === 'reformulate' && !input.current?.trim() && input.format !== 'sections')) {
    return { error: 'Nothing to work with — add some text first.' }
  }

  try {
    const format = input.format ?? 'text'
    const raw = await generateText({
      system: SYSTEM,
      prompt: buildPrompt(input),
      temperature: input.mode === 'reformulate' ? 0.5 : 0.8,
      maxOutputTokens: format === 'sections' ? 2048 : 1024,
      json: format === 'sections',
    })

    if (format === 'sections') {
      const parsed = contentSectionsSchema.safeParse(JSON.parse(raw))
      if (!parsed.success) return { error: 'The AI returned invalid sections — try again.' }
      return { text: JSON.stringify(parsed.data, null, 2) }
    }

    return { text: cleanText(raw) }
  } catch (error) {
    console.error('[ai-assist] generation failed:', error)
    if (error instanceof Error && error.message.includes('not configured')) {
      return { error: 'AI is not configured (missing GEMINI_API_KEY).' }
    }
    return { error: 'The AI is busy right now — please try again.' }
  }
}
