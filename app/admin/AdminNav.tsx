'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './admin.module.css'

const LINKS = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/projects', label: 'Projects' },
  { href: '/admin/blog', label: 'Blog posts' },
  { href: '/admin/services', label: 'Services' },
]

export default function AdminNav() {
  const pathname = usePathname()
  return (
    <nav>
      {LINKS.map((link) => {
        const active = link.exact ? pathname === link.href : pathname.startsWith(link.href)
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`${styles.navLink} ${active ? styles.navLinkActive : ''}`}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
