import { Link } from '@/i18n/navigation'
import type { BlogPostSummary } from '@/lib/types'
import { formatDate } from '@/lib/format'
import styles from './subpages.module.css'

/** Reusable blog row used on the blog list and in "related" sections. */
export default function PostListRow({ post }: { post: BlogPostSummary }) {
  return (
    <Link href={`/blog/${post.slug}`} className={styles.postRow}>
      {post.image && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img className={styles.postThumb} src={post.image} alt={post.title} loading="lazy" />
      )}
      <div className={styles.postMain}>
        <span className="eyebrow">
          {post.category} &middot; <time dateTime={post.date}>{formatDate(post.date)}</time>
        </span>
        <h2 className={styles.postTitle}>{post.title}</h2>
        <p className={styles.postExcerpt}>{post.excerpt}</p>
      </div>
      <span className={styles.postReadMore}>{post.readingTime}</span>
    </Link>
  )
}
