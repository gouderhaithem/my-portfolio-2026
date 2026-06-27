export type ServiceIconName = 'web' | 'crm' | 'erp' | 'api' | 'audit' | 'support'

export interface Service {
  slug: string
  /** Display index, e.g. "S · 01". */
  num: string
  /** Main title, e.g. "Websites". */
  title: string
  /** Italic accent appended to the title, e.g. "& web apps". */
  titleAccent: string
  icon: ServiceIconName
  summary: string
  /** Short bullet capabilities shown on the card. */
  features: string[]
  /** Whether this service is featured on the home page (first three). */
  featured?: boolean
}

import { prisma, isDbConfigured } from './prisma'

// ---------------------------------------------------------------------------
// SEED / FALLBACK DATA — seeds the database (prisma/seed.ts) and used as a
// fallback when the DB is not configured or unreachable.
// ---------------------------------------------------------------------------

export const mockServices: Service[] = [
  {
    slug: 'websites-web-apps',
    num: 'S · 01',
    title: 'Websites',
    titleAccent: '& web apps',
    icon: 'web',
    summary:
      'Marketing sites, product surfaces, and dashboards that load fast and look considered. Built on a modern stack with motion, type, and content that earn their place.',
    features: [
      'Next.js · Astro · React',
      'Headless CMS · i18n',
      'SEO · Core Web Vitals',
      'Hosting & CI/CD setup',
    ],
    featured: true,
  },
  {
    slug: 'crm-platforms',
    num: 'S · 02',
    title: 'CRM',
    titleAccent: 'platforms',
    icon: 'crm',
    summary:
      'Custom customer-relationship systems built around your actual sales motion — pipelines, automations, and reporting that beat the off-the-shelf compromise.',
    features: [
      'Lead pipelines & deal stages',
      'Email & WhatsApp automations',
      'Role-based access · audit log',
      'Integrations: Stripe, Slack, Gmail',
    ],
    featured: true,
  },
  {
    slug: 'erp-systems',
    num: 'S · 03',
    title: 'ERP',
    titleAccent: 'systems',
    icon: 'erp',
    summary:
      'End-to-end operations software — inventory, accounting, HR, and manufacturing modules that share one source of truth instead of fighting six spreadsheets.',
    features: [
      'Inventory · Procurement · Sales',
      'Accounting · Invoicing · Payroll',
      'Multi-warehouse · Multi-currency',
      'Reports, KPIs & forecasting',
    ],
    featured: true,
  },
  {
    slug: 'api-integrations',
    num: 'S · 04',
    title: 'APIs',
    titleAccent: '& integrations',
    icon: 'api',
    summary:
      'Typed, documented backends and the glue between your tools — REST and GraphQL services, webhooks, and third-party integrations that stay reliable under load.',
    features: [
      'REST & GraphQL APIs',
      'Auth · rate limiting · webhooks',
      'Payment & messaging integrations',
      'OpenAPI docs & versioning',
    ],
  },
  {
    slug: 'performance-seo-audits',
    num: 'S · 05',
    title: 'Performance',
    titleAccent: '& SEO audits',
    icon: 'audit',
    summary:
      'A forensic pass over an existing product — find what is slow, what search engines miss, and what to fix first, with a prioritized plan and measurable targets.',
    features: [
      'Core Web Vitals & profiling',
      'Bundle & render optimization',
      'Technical SEO & schema',
      'Prioritized fix roadmap',
    ],
  },
  {
    slug: 'maintenance-support',
    num: 'S · 06',
    title: 'Maintenance',
    titleAccent: '& support',
    icon: 'support',
    summary:
      'Ongoing care for software that matters — proactive monitoring, dependency upkeep, and a dependable hand for new features and the occasional fire.',
    features: [
      'Monitoring & alerting',
      'Dependency & security updates',
      'Bug fixes & small features',
      'Defined response SLAs',
    ],
  },
]

type ServiceRow = Awaited<ReturnType<typeof prisma.service.findFirst>>

function toService(row: NonNullable<ServiceRow>): Service {
  return {
    slug: row.slug,
    num: row.num,
    title: row.title,
    titleAccent: row.titleAccent,
    icon: row.icon as Service['icon'],
    summary: row.summary,
    features: row.features,
    featured: row.featured,
  }
}

/** Returns all services, in display order. */
export async function getServices(): Promise<Service[]> {
  if (!isDbConfigured) return mockServices
  try {
    const rows = await prisma.service.findMany({
      where: { status: 'published' },
      orderBy: { order: 'asc' },
    })
    return rows.map(toService)
  } catch (err) {
    console.error('[services] DB read failed, falling back to mock data:', err)
    return mockServices
  }
}

/** Returns only the services featured on the home page. */
export async function getFeaturedServices(): Promise<Service[]> {
  const all = await getServices()
  return all.filter((service) => service.featured)
}
