import type { BlogPost } from './types'
import { prisma, isDbConfigured } from './prisma'
import { contentSectionsSchema } from './schemas'

// ---------------------------------------------------------------------------
// SEED / FALLBACK DATA
// Seeds the database (see prisma/seed.ts) and used as a fallback when the DB
// is not configured or unreachable.
// ---------------------------------------------------------------------------

const AUTHOR = { name: 'Gouder Haithem', role: 'Software Engineer' }

export const mockPosts: BlogPost[] = [
  {
    slug: 'building-crm-clients-actually-use',
    title: 'Building a CRM clients actually use',
    excerpt:
      'Most CRMs fail not because of missing features, but because they model someone else’s workflow. Here is how I model the real one first.',
    category: 'Product',
    date: '2026-05-18',
    readingTime: '7 min read',
    image: '/blog/building-crm-clients-actually-use.svg',
    tags: ['CRM', 'Product', 'UX'],
    featured: true,
    author: AUTHOR,
    sections: [
      {
        paragraphs: [
          'A CRM is only as good as the day-to-day workflow it captures. The generic ones lose because they force a sales team to bend around a model that was designed for someone else.',
        ],
      },
      {
        heading: 'Start with the pipeline, not the schema',
        paragraphs: [
          'Before writing a single migration, I sit with the people who will live in the tool and watch them work. The pipeline stages they describe out loud are almost never the ones the off-the-shelf product assumes.',
          'Modeling that real pipeline first means the database mirrors how the business actually thinks — and adoption stops being a fight.',
        ],
      },
      {
        heading: 'Automate the boring, surface the important',
        paragraphs: [
          'The fastest win in any CRM is removing manual follow-up. A small rules engine — “if a deal sits 5 days in negotiation, nudge the owner” — saves hours a week and earns trust immediately.',
        ],
        bullets: [
          'Make every automation visible and editable by the user.',
          'Never hide why something happened — log it.',
          'Default to fewer, sharper notifications.',
        ],
      },
      {
        quote:
          'Software people enjoy using is software they keep using. Adoption is a design problem, not a training problem.',
      },
    ],
  },
  {
    slug: 'predicate-pushdown-explained',
    title: 'Predicate pushdown, explained simply',
    excerpt:
      'How moving filters closer to storage turned a 90-second query into an 8-second one — without buying a single extra server.',
    category: 'Engineering',
    date: '2026-04-02',
    readingTime: '9 min read',
    image: '/blog/predicate-pushdown-explained.svg',
    tags: ['Databases', 'Performance', 'Rust'],
    featured: true,
    author: AUTHOR,
    sections: [
      {
        paragraphs: [
          'The cheapest data to process is the data you never read. Predicate pushdown is the discipline of deciding what to skip as early as physically possible.',
        ],
      },
      {
        heading: 'Where the time actually goes',
        paragraphs: [
          'In a columnar warehouse, most query time is spent moving bytes off disk and across the network. If a filter can eliminate a row group before it is ever read, that is pure saved cost.',
          'Parquet stores min/max statistics per row group and page. A query for orders > $1,000 can skip any block whose maximum is below that threshold — often most of the file.',
        ],
      },
      {
        heading: 'Pushing the filter down the stack',
        paragraphs: [
          'The trick is teaching every layer — planner, scanner, storage — to honor the predicate instead of re-checking it at the top. Each layer that drops rows early shrinks the work for everything above it.',
        ],
        bullets: [
          'Planner: rewrite the query so filters bind to scans.',
          'Scanner: use statistics to skip row groups and pages.',
          'Execution: evaluate remaining filters vectorized, in batches.',
        ],
      },
      {
        heading: 'The payoff',
        paragraphs: [
          'On a 4 PB warehouse, pushdown took a representative dashboard query from 90 seconds to under 8 — with the exact same hardware.',
        ],
      },
    ],
  },
  {
    slug: 'webgl-without-killing-performance',
    title: 'WebGL without killing performance',
    excerpt:
      'You can ship a beautiful animated hero and still hit a 100 Lighthouse score. Here is the budget I work within.',
    category: 'Frontend',
    date: '2026-02-20',
    readingTime: '6 min read',
    image: '/blog/webgl-without-killing-performance.svg',
    tags: ['WebGL', 'Performance', 'Next.js'],
    author: AUTHOR,
    sections: [
      {
        paragraphs: [
          'Motion sells, but jank loses. The goal is a hero that feels alive without stealing the milliseconds that decide whether a visitor stays.',
        ],
      },
      {
        heading: 'Progressive enhancement, always',
        paragraphs: [
          'The content renders first as plain server-side HTML. The WebGL layer hydrates on top of it, so the page is readable and indexable long before a single shader compiles.',
        ],
      },
      {
        heading: 'Respect the device',
        paragraphs: [
          'Cap the pixel ratio, pause the render loop off-screen, and honor prefers-reduced-motion. A phone on battery should never run the same loop as a desktop GPU.',
        ],
        bullets: [
          'Clamp devicePixelRatio to 2.',
          'Stop rendering when the canvas leaves the viewport.',
          'Provide a static fallback for reduced-motion users.',
        ],
      },
      {
        quote:
          'Performance is a feature. A 100 score with motion intact is a design constraint, not a trade-off.',
      },
    ],
  },
  {
    slug: 'erp-modules-that-share-one-ledger',
    title: 'ERP modules that share one ledger',
    excerpt:
      'The difference between an ERP and four spreadsheets in a trench coat is a single shared ledger. Here is why that matters.',
    category: 'Engineering',
    date: '2026-01-09',
    readingTime: '8 min read',
    image: '/blog/erp-modules-that-share-one-ledger.svg',
    tags: ['ERP', 'Architecture', 'Accounting'],
    author: AUTHOR,
    sections: [
      {
        paragraphs: [
          'An ERP earns its name when its modules stop being islands. Inventory, purchasing, and payroll should post to the same ledger — or you have just rebuilt the spreadsheets you replaced.',
        ],
      },
      {
        heading: 'One source of financial truth',
        paragraphs: [
          'Every meaningful event — a stock movement, a received invoice, a payroll run — produces a journal entry against one double-entry ledger. Reconciliation becomes a query, not a ritual.',
        ],
      },
      {
        heading: 'Modules as bounded contexts',
        paragraphs: [
          'Each domain owns its own logic and UI but speaks to the rest of the system through shared, well-defined events. That keeps modules independent without letting their data drift apart.',
        ],
        bullets: [
          'Inventory movements auto-post to accounting.',
          'Purchasing flows into payables without re-keying.',
          'One employee record powers HR, payroll, and access.',
        ],
      },
      {
        heading: 'The result',
        paragraphs: [
          'Month-end close dropped from a week to an afternoon, because nothing had to be reconciled across systems — there was only one system.',
        ],
      },
    ],
  },
]

type PostRow = Awaited<ReturnType<typeof prisma.post.findFirst>>

function toPost(row: NonNullable<PostRow>): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    date: row.date,
    readingTime: row.readingTime,
    image: row.image ?? undefined,
    tags: row.tags,
    featured: row.featured,
    author: { name: row.authorName, role: row.authorRole },
    sections: contentSectionsSchema.parse(row.sections),
  }
}

const sortedMock = () => [...mockPosts].sort((a, b) => b.date.localeCompare(a.date))

/** Returns all posts, newest first. */
export async function getPosts(): Promise<BlogPost[]> {
  if (!isDbConfigured) return sortedMock()
  try {
    const rows = await prisma.post.findMany({
      where: { status: 'published' },
      orderBy: { date: 'desc' },
    })
    return rows.map(toPost)
  } catch (err) {
    console.error('[blog] DB read failed, falling back to mock data:', err)
    return sortedMock()
  }
}

/** Returns a single post by slug, or null if not found. */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isDbConfigured) return mockPosts.find((p) => p.slug === slug) ?? null
  try {
    const row = await prisma.post.findFirst({ where: { slug, status: 'published' } })
    return row ? toPost(row) : null
  } catch (err) {
    console.error('[blog] DB read failed, falling back to mock data:', err)
    return mockPosts.find((p) => p.slug === slug) ?? null
  }
}

/** All slugs — used for static generation. */
export async function getPostSlugs(): Promise<string[]> {
  if (!isDbConfigured) return mockPosts.map((p) => p.slug)
  try {
    const rows = await prisma.post.findMany({
      where: { status: 'published' },
      select: { slug: true },
    })
    return rows.map((r) => r.slug)
  } catch (err) {
    console.error('[blog] DB read failed, falling back to mock data:', err)
    return mockPosts.map((p) => p.slug)
  }
}

/**
 * Returns up to `limit` posts related to `slug` — same category first, then the
 * most recent others, never the post itself.
 */
export async function getRelatedPosts(slug: string, limit = 3): Promise<BlogPost[]> {
  const all = await getPosts()
  const current = all.find((p) => p.slug === slug)
  const rest = all.filter((p) => p.slug !== slug)
  if (!current) return rest.slice(0, limit)
  const sameCategory = rest.filter((p) => p.category === current.category)
  const others = rest.filter((p) => p.category !== current.category)
  return [...sameCategory, ...others].slice(0, limit)
}
