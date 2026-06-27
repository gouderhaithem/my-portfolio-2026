// Shared domain types for projects and blog content.
// These shapes are intentionally API-friendly: when the mock data layer in
// `lib/projects.ts` and `lib/blog.ts` is replaced with real `fetch` calls,
// the response payloads should match these interfaces 1:1.

/** A rich-text section used by both project case studies and blog posts. */
export interface ContentSection {
  heading?: string
  /** Paragraphs of body copy. */
  paragraphs?: string[]
  /** Optional bullet list rendered after the paragraphs. */
  bullets?: string[]
  /** Optional pull-quote rendered as a highlighted block. */
  quote?: string
}

/** Lightweight project shape used in lists/cards. */
export interface ProjectSummary {
  slug: string
  title: string
  tagline: string
  category: string
  year: string
  /** Two CSS colors used to render the card's gradient cover (image fallback). */
  cover: [string, string]
  /** Cover/hero image URL (e.g. "/projects/slug.svg"). */
  image?: string
  tags: string[]
  featured?: boolean
}

/** Full project case study used on the detail page. */
export interface Project extends ProjectSummary {
  client: string
  role: string
  timeline: string
  stack: string[]
  liveUrl?: string
  repoUrl?: string
  summary: string
  sections: ContentSection[]
  results: { label: string; value: string }[]
  /** Optional additional images shown in the case-study gallery. */
  gallery?: string[]
}

/** Lightweight blog post shape used in lists/cards. */
export interface BlogPostSummary {
  slug: string
  title: string
  excerpt: string
  category: string
  /** ISO date string, e.g. "2026-05-12". */
  date: string
  readingTime: string
  tags: string[]
  /** Optional hero/thumbnail image URL (e.g. "/blog/slug.svg"). */
  image?: string
  featured?: boolean
}

/** Full blog post used on the detail page. */
export interface BlogPost extends BlogPostSummary {
  author: { name: string; role: string }
  sections: ContentSection[]
}

/** Standard API envelope, mirrored by the mock layer for an easy swap. */
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  meta?: { total: number; page: number; limit: number }
}
