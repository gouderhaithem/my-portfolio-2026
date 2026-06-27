import 'server-only'

// Small helpers for reading typed values out of a FormData payload in admin
// Server Actions. Arrays are entered as one-item-per-line textareas.

export function str(fd: FormData, key: string): string {
  const v = fd.get(key)
  return typeof v === 'string' ? v.trim() : ''
}

/** Splits a textarea value into a trimmed, non-empty string array (by line). */
export function lines(fd: FormData, key: string): string[] {
  return str(fd, key)
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
}

export function bool(fd: FormData, key: string): boolean {
  const v = fd.get(key)
  return v === 'on' || v === 'true'
}

export function int(fd: FormData, key: string, fallback = 0): number {
  const n = Number.parseInt(str(fd, key), 10)
  return Number.isFinite(n) ? n : fallback
}

/** Parses a JSON textarea, returning [value, null] or [null, errorMessage]. */
export function json<T>(raw: string, label: string): [T, null] | [null, string] {
  const trimmed = raw.trim()
  if (!trimmed) return [[] as unknown as T, null]
  try {
    return [JSON.parse(trimmed) as T, null]
  } catch {
    return [null, `${label} must be valid JSON.`]
  }
}

/** A URL-safe slug from arbitrary text. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
