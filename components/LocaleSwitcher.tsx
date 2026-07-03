'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

/** EN / FR toggle shown in the site navigation. Keeps the current path. */
export default function LocaleSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const t = useTranslations('localeSwitcher')

  return (
    <div className="lang-switch" aria-label={t('label')}>
      {routing.locales.map((l) => (
        <Link
          key={l}
          href={pathname}
          locale={l}
          className={l === locale ? 'on' : undefined}
          aria-current={l === locale ? 'true' : undefined}
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  )
}
