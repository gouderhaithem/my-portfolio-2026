'use client'

import Link from 'next/link'
import { useState } from 'react'
import styles from './subpages.module.css'

interface NavItem {
  href: string
  label: string
}

const NAV_ITEMS: NavItem[] = [
  { href: '/services', label: 'Services' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/#contact', label: 'Contact' },
]

/**
 * Page shell for the projects & blog sub-pages: background layers, the glass
 * navigation bar (with a working mobile burger), and a shared footer. The home
 * page renders its own chrome via PortfolioInit, so this is only used here.
 */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className={styles.page}>
      {/* Background layers (CSS-driven, no JS needed) */}
      <div id="bg" />
      <div id="grain" />

      <nav className="top">
        <Link href="/" className="brand" onClick={() => setMenuOpen(false)}>
          G.H. &middot; &apos;26
        </Link>
        <ul className={menuOpen ? 'on' : undefined}>
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="right">
          <span className="status">Available &middot; Q3 2026</span>
        </div>
        <button
          className={`burger${menuOpen ? ' on' : ''}`}
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {children}

      <footer className={styles.detailFooter}>
        <div
          className={styles.container}
          style={{ paddingTop: 0, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}
        >
          <span className="eyebrow">Gouder Haithem &middot; Software Engineer</span>
          <Link href="/#contact" className={styles.back} style={{ margin: 0 }}>
            <span>Start a project</span>
            <span className="arr">&rarr;</span>
          </Link>
        </div>
      </footer>
    </div>
  )
}
