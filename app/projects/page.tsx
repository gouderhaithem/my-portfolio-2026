import type { Metadata } from 'next'
import SiteChrome from '@/components/SiteChrome'
import ProjectCard from '@/components/ProjectCard'
import { getProjects } from '@/lib/projects'
import styles from '@/components/subpages.module.css'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Selected software engineering work by Gouder Haithem — query engines, CRM platforms, ERP systems, and high-performance websites.',
  alternates: { canonical: 'https://gouderhaithem.com/projects' },
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <SiteChrome>
      <div className={styles.container}>
        <header className={styles.header}>
          <span className="eyebrow">Selected Work</span>
          <h1 className={`display ${styles.title}`}>
            Projects I <span className="italic">stand behind</span>.
          </h1>
          <p className={styles.intro}>
            Case studies across data platforms, CRM and ERP systems, and websites — the kind of
            considered software built on solid foundations.
          </p>
        </header>

        {projects.length === 0 ? (
          <p className={styles.empty}>No projects to show yet. Check back soon.</p>
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
