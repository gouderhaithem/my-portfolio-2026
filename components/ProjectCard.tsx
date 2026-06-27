import Link from 'next/link'
import type { ProjectSummary } from '@/lib/types'
import styles from './subpages.module.css'

/** Reusable project card used on the projects list and in "related" sections. */
export default function ProjectCard({ project }: { project: ProjectSummary }) {
  return (
    <Link href={`/projects/${project.slug}`} className={styles.projectCard}>
      <div
        className={styles.cover}
        style={{
          background: `linear-gradient(135deg, ${project.cover[0]}, ${project.cover[1]})`,
        }}
      >
        {project.image && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            className={styles.coverImg}
            src={project.image}
            alt={`${project.title} — ${project.category}`}
            loading="lazy"
          />
        )}
        <span className={styles.coverLabel}>{project.category}</span>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardTitleRow}>
          <span className={styles.cardTitle}>{project.title}</span>
          <span className={styles.cardYear}>{project.year}</span>
        </div>
        <p className={styles.cardTagline}>{project.tagline}</p>
        <div className={styles.tagRow}>
          {project.tags.slice(0, 3).map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}
