import type { Project } from './types'
import { prisma, isDbConfigured } from './prisma'
import { contentSectionsSchema, resultsSchema } from './schemas'

// ---------------------------------------------------------------------------
// SEED / FALLBACK DATA
// This array seeds the database (see prisma/seed.ts) and is used as a fallback
// when DATABASE_URL is not configured or the database is unreachable, so the
// site keeps building/running during the migration.
// ---------------------------------------------------------------------------

export const mockProjects: Project[] = [
  {
    slug: 'halcyon-query-engine',
    title: 'Halcyon',
    tagline: 'Distributed analytical query engine for a 4 PB warehouse.',
    category: 'Data Platform',
    year: '2025',
    cover: ['#7c5cff', '#3a2a8c'],
    image: '/projects/halcyon-query-engine.svg',
    tags: ['Rust', 'Distributed Systems', 'Parquet', 'Query Planning'],
    featured: true,
    client: 'Confidential (fintech)',
    role: 'Lead Engineer',
    timeline: '8 months',
    stack: ['Rust', 'Apache Arrow', 'Parquet', 'gRPC', 'Kubernetes'],
    liveUrl: undefined,
    repoUrl: undefined,
    summary:
      'A predicate-pushdown query engine that rewrites execution plans across a 64-node cluster, reading Parquet at the SSD level to cut latency by an order of magnitude.',
    sections: [
      {
        heading: 'The problem',
        paragraphs: [
          'Analysts were waiting minutes for dashboards that should have rendered in seconds. The existing engine scanned far more data than each query needed, and the planner had no awareness of the physical layout on disk.',
          'With a 4 PB warehouse and 600+ daily users, every wasted scan multiplied into real cost and real frustration.',
        ],
      },
      {
        heading: 'The approach',
        paragraphs: [
          'I rebuilt the execution layer around predicate pushdown — filters are evaluated as close to the storage as possible, skipping entire row groups before they ever leave the SSD.',
          'A cost-based planner rewrites queries across the cluster, balancing shuffle cost against parallelism so the 64 nodes stay saturated without thrashing the network.',
        ],
        bullets: [
          'Row-group and page-level skipping driven by Parquet statistics.',
          'Vectorized execution on Apache Arrow record batches.',
          'Adaptive plan rewriting based on live cardinality estimates.',
        ],
      },
      {
        quote:
          'Queries that took 90 seconds now return in under 8. The team stopped pre-aggregating data just to make dashboards usable.',
      },
      {
        heading: 'The outcome',
        paragraphs: [
          'P99 latency dropped 12×, and the engine now serves the entire analytics org from a single cluster. The cost-based planner removed an entire class of hand-tuned materialized views.',
        ],
      },
    ],
    results: [
      { label: 'Latency', value: '12× faster' },
      { label: 'Daily users', value: '600+' },
      { label: 'Cluster', value: '64 nodes' },
      { label: 'Warehouse', value: '4 PB' },
    ],
  },
  {
    slug: 'meridian-crm',
    title: 'Meridian CRM',
    tagline: 'A custom CRM with pipelines, automations, and reporting.',
    category: 'CRM Platform',
    year: '2025',
    cover: ['#5cc8ff', '#1a4a8c'],
    image: '/projects/meridian-crm.svg',
    tags: ['Next.js', 'NestJS', 'PostgreSQL', 'Automations'],
    featured: true,
    client: 'B2B services company',
    role: 'Full-stack Engineer',
    timeline: '5 months',
    stack: ['Next.js', 'NestJS', 'PostgreSQL', 'Redis', 'BullMQ'],
    liveUrl: undefined,
    repoUrl: undefined,
    summary:
      'A bespoke customer-relationship platform replacing three disconnected tools — deals, automations, and reporting in one fast surface the sales team actually enjoys using.',
    sections: [
      {
        heading: 'The problem',
        paragraphs: [
          'The sales team juggled a spreadsheet, an email tool, and a generic SaaS CRM that fit none of their workflow. Data lived in three places and agreed in none.',
        ],
      },
      {
        heading: 'The approach',
        paragraphs: [
          'I modeled their real pipeline first, then built around it: a drag-and-drop deal board, a rules engine for follow-up automations, and a reporting layer that answers the questions leadership actually asks.',
          'A background worker handles scheduled emails, SLA timers, and webhook fan-out without blocking the UI.',
        ],
        bullets: [
          'Configurable pipeline stages with per-stage automations.',
          'Reporting with cohort, conversion, and forecast views.',
          'Role-based access with a full audit trail.',
        ],
      },
      {
        heading: 'The outcome',
        paragraphs: [
          'Three tools became one. Manual follow-up work dropped sharply, and leadership finally trusts a single source of truth for the pipeline.',
        ],
      },
    ],
    results: [
      { label: 'Tools replaced', value: '3 → 1' },
      { label: 'Manual follow-ups', value: '−70%' },
      { label: 'Adoption', value: '100% of team' },
    ],
  },
  {
    slug: 'atlas-erp',
    title: 'Atlas ERP',
    tagline: 'End-to-end operations: inventory, accounting, and HR.',
    category: 'ERP System',
    year: '2024',
    cover: ['#ff8c5c', '#8c3a1a'],
    image: '/projects/atlas-erp.svg',
    tags: ['Laravel', 'Vue', 'MySQL', 'Inventory'],
    featured: true,
    client: 'Manufacturing SME',
    role: 'Lead Engineer',
    timeline: '11 months',
    stack: ['Laravel', 'Vue', 'MySQL', 'Docker'],
    summary:
      'A modular ERP covering inventory, purchasing, accounting, and HR for a manufacturer that had outgrown its patchwork of spreadsheets.',
    sections: [
      {
        heading: 'The problem',
        paragraphs: [
          'Stock counts, invoices, and payroll lived in separate spreadsheets maintained by different people. Month-end close took a week and reconciliation errors were routine.',
        ],
      },
      {
        heading: 'The approach',
        paragraphs: [
          'Each domain became a module sharing one ledger and one identity model. Inventory movements post to accounting automatically; purchasing flows into payables without re-keying.',
        ],
        bullets: [
          'Real-time inventory with batch and serial tracking.',
          'Double-entry accounting with automated journal posting.',
          'Payroll and leave management tied to the same employee records.',
        ],
      },
      {
        quote:
          'Month-end close went from a week of spreadsheet archaeology to a single afternoon.',
      },
    ],
    results: [
      { label: 'Month-end close', value: '7 days → 1' },
      { label: 'Modules', value: '4 integrated' },
      { label: 'Data sources', value: 'Unified' },
    ],
  },
  {
    slug: 'lumen-marketing-site',
    title: 'Lumen',
    tagline: 'A high-performance marketing site with motion design.',
    category: 'Website',
    year: '2024',
    cover: ['#4ade80', '#1a6c3a'],
    image: '/projects/lumen-marketing-site.svg',
    tags: ['Next.js', 'GSAP', 'Three.js', 'SEO'],
    client: 'SaaS startup',
    role: 'Frontend Engineer',
    timeline: '6 weeks',
    stack: ['Next.js', 'GSAP', 'Three.js', 'Vercel'],
    summary:
      'A marketing site that loads fast and moves beautifully — WebGL hero, scroll-driven storytelling, and a perfect Lighthouse score.',
    sections: [
      {
        heading: 'The brief',
        paragraphs: [
          'The startup wanted a site that felt as premium as their product, without sacrificing the speed that keeps visitors from bouncing.',
        ],
      },
      {
        heading: 'The build',
        paragraphs: [
          'A WebGL hero sets the tone, then scroll-driven sections reveal the story with restraint. Everything is progressively enhanced, so the content reads instantly even before the animation layer hydrates.',
        ],
        bullets: [
          'WebGL hero with a lightweight, battery-aware render loop.',
          'Scroll-linked reveals tuned for 60fps on mid-range phones.',
          'Server-rendered content for instant first paint and SEO.',
        ],
      },
      {
        heading: 'The outcome',
        paragraphs: [
          'A 100 Lighthouse performance score with full motion intact, and a measurable lift in demo sign-ups after launch.',
        ],
      },
    ],
    results: [
      { label: 'Lighthouse', value: '100' },
      { label: 'Sign-ups', value: '+34%' },
      { label: 'Time to build', value: '6 weeks' },
    ],
  },
]

// Maps a Prisma `Project` row to the domain `Project` type, validating the
// JSONB columns at the boundary.
type ProjectRow = Awaited<ReturnType<typeof prisma.project.findFirst>>

function toProject(row: NonNullable<ProjectRow>): Project {
  return {
    slug: row.slug,
    title: row.title,
    tagline: row.tagline,
    category: row.category,
    year: row.year,
    cover: [row.cover[0] ?? '#7c5cff', row.cover[1] ?? '#3a2a8c'],
    image: row.image ?? undefined,
    tags: row.tags,
    featured: row.featured,
    client: row.client,
    role: row.role,
    timeline: row.timeline,
    stack: row.stack,
    liveUrl: row.liveUrl ?? undefined,
    repoUrl: row.repoUrl ?? undefined,
    summary: row.summary,
    sections: contentSectionsSchema.parse(row.sections),
    results: resultsSchema.parse(row.results),
    gallery: row.gallery,
  }
}

const sortedMock = () => [...mockProjects].sort((a, b) => b.year.localeCompare(a.year))

/** Returns all projects, newest first. */
export async function getProjects(): Promise<Project[]> {
  if (!isDbConfigured) return sortedMock()
  try {
    const rows = await prisma.project.findMany({
      where: { status: 'published' },
      orderBy: { year: 'desc' },
    })
    return rows.map(toProject)
  } catch (err) {
    console.error('[projects] DB read failed, falling back to mock data:', err)
    return sortedMock()
  }
}

/** Returns a single project by slug, or null if not found. */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!isDbConfigured) return mockProjects.find((p) => p.slug === slug) ?? null
  try {
    const row = await prisma.project.findFirst({ where: { slug, status: 'published' } })
    return row ? toProject(row) : null
  } catch (err) {
    console.error('[projects] DB read failed, falling back to mock data:', err)
    return mockProjects.find((p) => p.slug === slug) ?? null
  }
}

/** All slugs — used for static generation. */
export async function getProjectSlugs(): Promise<string[]> {
  if (!isDbConfigured) return mockProjects.map((p) => p.slug)
  try {
    const rows = await prisma.project.findMany({
      where: { status: 'published' },
      select: { slug: true },
    })
    return rows.map((r) => r.slug)
  } catch (err) {
    console.error('[projects] DB read failed, falling back to mock data:', err)
    return mockProjects.map((p) => p.slug)
  }
}

/**
 * Returns up to `limit` projects related to `slug` — same category first, then
 * the most recent others, never the project itself.
 */
export async function getRelatedProjects(slug: string, limit = 3): Promise<Project[]> {
  const all = await getProjects()
  const current = all.find((p) => p.slug === slug)
  const rest = all.filter((p) => p.slug !== slug)
  if (!current) return rest.slice(0, limit)
  const sameCategory = rest.filter((p) => p.category === current.category)
  const others = rest.filter((p) => p.category !== current.category)
  return [...sameCategory, ...others].slice(0, limit)
}
