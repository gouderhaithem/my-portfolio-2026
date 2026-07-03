'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import LocaleSwitcher from './LocaleSwitcher'
import styles from './subpages.module.css'

const NAV_ITEMS = [
  { href: '/services', key: 'services' },
  { href: '/projects', key: 'projects' },
  { href: '/blog', key: 'blog' },
  { href: '/contact', key: 'contact' },
] as const

/**
 * Page shell for the projects & blog sub-pages: background layers, the glass
 * navigation bar (with a working mobile burger), and a shared footer. The home
 * page renders its own chrome via PortfolioInit, so this is only used here.
 */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const t = useTranslations('nav')
  const tFooter = useTranslations('footer')

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
                {t(item.key)}
              </Link>
            </li>
          ))}
        </ul>
        <div className="right">
          <LocaleSwitcher />
          <span className="status">{t('status')}</span>
        </div>
        <button
          className={`burger${menuOpen ? ' on' : ''}`}
          aria-label={t('menu')}
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
          <span className="eyebrow">{tFooter('role')}</span>
          <Link href="/contact" className={styles.back} style={{ margin: 0 }}>
            <span>{tFooter('startProject')}</span>
            <span className="arr">&rarr;</span>
          </Link>
        </div>
      </footer>
    </div>
  )
}
