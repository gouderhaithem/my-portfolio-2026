import type { ContentSection } from '@/lib/types'
import styles from './subpages.module.css'

/**
 * Renders an array of {@link ContentSection} blocks (headings, paragraphs,
 * bullet lists, and pull-quotes) used by both project case studies and blog
 * posts. Pure presentation — no client interactivity.
 */
export default function ContentSections({ sections }: { sections: ContentSection[] }) {
  return (
    <div className={styles.prose}>
      {sections.map((section, i) => (
        <div key={i} className={styles.proseSection}>
          {section.heading && <h2 className={styles.proseHeading}>{section.heading}</h2>}
          {section.paragraphs?.map((paragraph, j) => (
            <p key={j}>{paragraph}</p>
          ))}
          {section.bullets && section.bullets.length > 0 && (
            <ul className={styles.proseList}>
              {section.bullets.map((bullet, j) => (
                <li key={j}>{bullet}</li>
              ))}
            </ul>
          )}
          {section.quote && <blockquote className={styles.quote}>{section.quote}</blockquote>}
        </div>
      ))}
    </div>
  )
}
