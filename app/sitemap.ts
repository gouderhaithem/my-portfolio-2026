import type { MetadataRoute } from 'next'
import { getProjectSlugs } from '@/lib/projects'
import { getPostSlugs } from '@/lib/blog'
import { localeAlternates, localeUrl } from '@/lib/seo'
import { routing } from '@/i18n/routing'

type Entry = MetadataRoute.Sitemap[number]

function localizedEntries(
  path: string,
  lastModified: Date,
  changeFrequency: Entry['changeFrequency'],
  priority: number,
): MetadataRoute.Sitemap {
  const languages = localeAlternates(path)
  return routing.locales.map((locale) => ({
    url: localeUrl(locale, path),
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages },
  }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projectSlugs, postSlugs] = await Promise.all([getProjectSlugs(), getPostSlugs()])
  const now = new Date()

  return [
    ...localizedEntries('/', now, 'monthly', 1),
    ...localizedEntries('/services', now, 'monthly', 0.8),
    ...localizedEntries('/projects', now, 'weekly', 0.8),
    ...localizedEntries('/blog', now, 'weekly', 0.8),
    ...localizedEntries('/contact', now, 'yearly', 0.7),
    ...projectSlugs.flatMap((slug) => localizedEntries(`/projects/${slug}`, now, 'monthly', 0.6)),
    ...postSlugs.flatMap((slug) => localizedEntries(`/blog/${slug}`, now, 'monthly', 0.6)),
  ]
}
