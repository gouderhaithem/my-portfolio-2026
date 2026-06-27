import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import styles from '../admin.module.css'

export default async function DashboardPage() {
  const [projects, posts, services] = await Promise.all([
    prisma.project.count(),
    prisma.post.count(),
    prisma.service.count(),
  ])

  const cards = [
    { href: '/admin/projects', label: 'Projects', count: projects },
    { href: '/admin/blog', label: 'Blog posts', count: posts },
    { href: '/admin/services', label: 'Services', count: services },
  ]

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSub}>Manage the content shown on your portfolio.</p>
        </div>
      </div>
      <div className={styles.cards}>
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className={styles.card}>
            <div className={styles.cardNum}>{c.count}</div>
            <div className={styles.cardLabel}>{c.label}</div>
          </Link>
        ))}
      </div>
    </>
  )
}
