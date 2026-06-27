import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { deletePost } from './actions'
import { DeleteForm } from '../../FormControls'
import StatusBadge from '../../StatusBadge'
import styles from '../../admin.module.css'

export default async function PostsListPage() {
  const posts = await prisma.post.findMany({ orderBy: { date: 'desc' } })

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Blog posts</h1>
          <p className={styles.pageSub}>{posts.length} total</p>
        </div>
        <Link href="/admin/blog/new" className={styles.btn}>
          + New post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className={styles.tableWrap}>
          <p className={styles.empty}>No posts yet. Write your first one.</p>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          {posts.map((p) => (
            <div key={p.id} className={styles.row}>
              <div>
                <div className={styles.rowTitle}>{p.title}</div>
                <div className={styles.rowMeta}>
                  <StatusBadge status={p.status} />
                  <span>{p.category}</span>
                  <span className={styles.mono}>{p.date}</span>
                  <span>{p.readingTime}</span>
                  {p.featured ? <span className={styles.badge}>Featured</span> : null}
                </div>
              </div>
              <div className={styles.rowActions}>
                <Link href={`/admin/blog/${p.id}`} className={styles.actionBtn}>
                  Edit
                </Link>
                <DeleteForm action={deletePost} id={p.id} confirmText={`Delete “${p.title}”?`} />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
