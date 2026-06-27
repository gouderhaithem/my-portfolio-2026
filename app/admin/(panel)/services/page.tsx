import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { deleteService } from './actions'
import { DeleteForm } from '../../FormControls'
import StatusBadge from '../../StatusBadge'
import styles from '../../admin.module.css'

export default async function ServicesListPage() {
  const services = await prisma.service.findMany({ orderBy: { order: 'asc' } })

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Services</h1>
          <p className={styles.pageSub}>{services.length} total</p>
        </div>
        <Link href="/admin/services/new" className={styles.btn}>
          + New service
        </Link>
      </div>

      {services.length === 0 ? (
        <div className={styles.tableWrap}>
          <p className={styles.empty}>No services yet. Create your first one.</p>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          {services.map((s) => (
            <div key={s.id} className={styles.row}>
              <div>
                <div className={styles.rowTitle}>
                  {s.title} <em style={{ color: 'var(--ink-dim)', fontWeight: 400 }}>{s.titleAccent}</em>
                </div>
                <div className={styles.rowMeta}>
                  <StatusBadge status={s.status} />
                  <span className={styles.mono}>{s.num}</span>
                  <span>{s.icon}</span>
                  <span>order {s.order}</span>
                  {s.featured ? <span className={styles.badge}>Featured</span> : null}
                </div>
              </div>
              <div className={styles.rowActions}>
                <Link href={`/admin/services/${s.id}`} className={styles.actionBtn}>
                  Edit
                </Link>
                <DeleteForm action={deleteService} id={s.id} confirmText={`Delete “${s.title}”?`} />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
