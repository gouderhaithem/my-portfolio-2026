import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { deleteProject } from './actions'
import { DeleteForm } from '../../FormControls'
import StatusBadge from '../../StatusBadge'
import styles from '../../admin.module.css'

export default async function ProjectsListPage() {
  const projects = await prisma.project.findMany({ orderBy: { year: 'desc' } })

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Projects</h1>
          <p className={styles.pageSub}>{projects.length} total</p>
        </div>
        <Link href="/admin/projects/new" className={styles.btn}>
          + New project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className={styles.tableWrap}>
          <p className={styles.empty}>No projects yet. Create your first one.</p>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          {projects.map((p) => (
            <div key={p.id} className={styles.row}>
              <div>
                <div className={styles.rowTitle}>{p.title}</div>
                <div className={styles.rowMeta}>
                  <StatusBadge status={p.status} />
                  <span>{p.category}</span>
                  <span className={styles.mono}>{p.year}</span>
                  {p.featured ? <span className={styles.badge}>Featured</span> : null}
                </div>
              </div>
              <div className={styles.rowActions}>
                <Link href={`/admin/projects/${p.id}`} className={styles.actionBtn}>
                  Edit
                </Link>
                <DeleteForm action={deleteProject} id={p.id} confirmText={`Delete “${p.title}”?`} />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
