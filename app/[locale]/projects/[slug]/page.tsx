import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import SiteChrome from '@/components/SiteChrome'
import ContentSections from '@/components/ContentSections'
import ProjectCard from '@/components/ProjectCard'
import { Link } from '@/i18n/navigation'
import { getProjectBySlug, getProjectSlugs, getRelatedProjects } from '@/lib/projects'
import { localeAlternates, localeUrl } from '@/lib/seo'
import styles from '@/components/subpages.module.css'

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getProjectSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) {
    const t = await getTranslations({ locale, namespace: 'projectsPage' })
    return { title: t('notFound') }
  }

  return {
    title: project.title,
    description: project.tagline,
    alternates: {
      canonical: localeUrl(locale, `/projects/${project.slug}`),
      languages: localeAlternates(`/projects/${project.slug}`),
    },
    openGraph: {
      title: `${project.title} — ${project.category}`,
      description: project.tagline,
      type: 'article',
      // OG image is generated dynamically — see ./opengraph-image.tsx
    },
  }
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const project = await getProjectBySlug(slug)
  if (!project) notFound()

  const t = await getTranslations('projectsPage')
  const related = await getRelatedProjects(slug)

  return (
    <SiteChrome>
      <div className={`${styles.container} ${styles.containerNarrow}`}>
        <Link href="/projects" className={styles.back}>
          <span className="arr">&larr;</span>
          <span>{t('back')}</span>
        </Link>

        <header className={styles.detailHead}>
          <span className="eyebrow">{project.category}</span>
          <h1 className={`display ${styles.detailTitle}`}>{project.title}</h1>
          <p className={styles.detailSummary}>{project.summary}</p>
          <div className={styles.detailMetaRow}>
            <span>
              <strong>{t('roleLabel')}</strong> &nbsp;{project.role}
            </span>
            <span>
              <strong>{t('clientLabel')}</strong> &nbsp;{project.client}
            </span>
            <span>
              <strong>{t('timelineLabel')}</strong> &nbsp;{project.timeline}
            </span>
            <span>
              <strong>{t('yearLabel')}</strong> &nbsp;{project.year}
            </span>
          </div>
        </header>

        {project.image && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            className={styles.heroImage}
            src={project.image}
            alt={`${project.title} — ${project.category}`}
          />
        )}

        {project.results.length > 0 && (
          <div className={styles.facts}>
            {project.results.map((result) => (
              <div key={result.label} className={styles.fact}>
                <span className={styles.factLabel}>{result.label}</span>
                <span className={styles.factValue}>{result.value}</span>
              </div>
            ))}
          </div>
        )}

        <div className={styles.stackRow}>
          {project.stack.map((tech) => (
            <span key={tech} className={styles.tag}>
              {tech}
            </span>
          ))}
        </div>

        <ContentSections sections={project.sections} />

        {project.gallery && project.gallery.length > 0 && (
          <div className={styles.gallery}>
            {project.gallery.map((src, i) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={src}
                className={styles.galleryImg}
                src={src}
                alt={`${project.title} — view ${i + 1}`}
                loading="lazy"
              />
            ))}
          </div>
        )}

        {(project.liveUrl || project.repoUrl) && (
          <div className="hero-ctas" style={{ display: 'flex', gap: 14, paddingBottom: 80 }}>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pill primary"
              >
                <span>{t('visitLive')}</span>
                <span className="arr">&rarr;</span>
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pill ghost"
              >
                <span>{t('viewCode')}</span>
              </a>
            )}
          </div>
        )}

        {related.length > 0 && (
          <div className={styles.related}>
            <span className="eyebrow">{t('moreWork')}</span>
            <h2 className={styles.relatedTitle}>{t('relatedTitle')}</h2>
            <div className={styles.relatedGrid}>
              {related.map((item) => (
                <ProjectCard key={item.slug} project={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </SiteChrome>
  )
}
