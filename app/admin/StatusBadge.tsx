import styles from './admin.module.css'

/** A small pill showing whether a content item is published or a draft. */
export default function StatusBadge({ status }: { status: string }) {
  const published = status === 'published'
  return (
    <span className={`${styles.statusBadge} ${published ? styles.statusPublished : styles.statusDraft}`}>
      {published ? 'Published' : 'Draft'}
    </span>
  )
}
