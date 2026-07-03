import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import SiteChrome from '@/components/SiteChrome'
import ProjectCard from '@/components/ProjectCard'
import { getProjects } from '@/lib/projects'
import { localeAlternates, localeUrl } from '@/lib/seo'
import styles from '@/components/subpages.module.css'

const richTitle = {
  i: (chunks: React.ReactNode) => <span className="italic">{chunks}</span>,
}

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'projectsPage' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: localeUrl(locale, '/projects'),
      languages: localeAlternates('/projects'),
    },
  }
}

export default async function ProjectsPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const projects = await getProjects()
  const t = await getTranslations('projectsPage')

  return (
    <SiteChrome>
      <div className={styles.container}>
        <header className={styles.header}>
          <span className="eyebrow">{t('eyebrow')}</span>
          <h1 className={`display ${styles.title}`}>{t.rich('title', richTitle)}</h1>
          <p className={styles.intro}>{t('intro')}</p>
        </header>

        {projects.length === 0 ? (
          <p className={styles.empty}>{t('empty')}</p>
        ) : (
          <div className={styles.projectGrid}>
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        )}
      </div>
    </SiteChrome>
  )
}
