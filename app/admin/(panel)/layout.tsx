import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import AdminNav from '../AdminNav'
import { logout } from '../actions'
import styles from '../admin.module.css'

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
}

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  // Defense in depth: middleware already guards /admin, but never render the
  // panel without a verified session.
  if (!session) redirect('/admin/login')

  return (
    <div className={styles.root}>
      <div className={styles.shell}>
        <aside className={styles.sidebar}>
          <p className={styles.brand}>
            Gouder<span>.</span>
          </p>
          <AdminNav />
          <div className={styles.sidebarFoot}>
            <div>{session.email}</div>
            <form action={logout}>
              <button type="submit" className={styles.signout}>
                Sign out
              </button>
            </form>
          </div>
        </aside>
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  )
}
