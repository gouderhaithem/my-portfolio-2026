import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import SiteChrome from '@/components/SiteChrome'
import ServiceIcon from '@/components/ServiceIcon'
import { Link } from '@/i18n/navigation'
import { getServices } from '@/lib/services'
import { localeAlternates, localeUrl } from '@/lib/seo'
import styles from '@/components/subpages.module.css'

const richTitle = {
  i: (chunks: React.ReactNode) => <span className="italic">{chunks}</span>,
}

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'servicesPage' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: localeUrl(locale, '/services'),
      languages: localeAlternates('/services'),
    },
  }
}

const PROCESS_KEYS = ['step1', 'step2', 'step3', 'step4'] as const

export default async function ServicesPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const services = await getServices()
  const t = await getTranslations('servicesPage')

  return (
    <SiteChrome>
      <div className={styles.container}>
        <header className={styles.header}>
          <span className="eyebrow">{t('eyebrow')}</span>
          <h1 className={`display ${styles.title}`}>{t.rich('title', richTitle)}</h1>
          <p className={styles.intro}>{t('intro')}</p>
        </header>

        <div className={styles.serviceGrid}>
          {services.map((service) => (
            <div className="service" key={service.slug}>
              <div className="top">
                <span className="num">{service.num}</span>
                <div className="icon" aria-hidden="true">
                  <ServiceIcon name={service.icon} />
                </div>
              </div>
              <h3>
                {service.title} <span className="it">{service.titleAccent}</span>
              </h3>
              <p>{service.summary}</p>
              <ul>
                {service.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <span className="eyebrow">{t('howItWorks')}</span>
        <div className={styles.process}>
          {PROCESS_KEYS.map((key, i) => (
            <div className={styles.processStep} key={key}>
              <span className={styles.processNum}>{String(i + 1).padStart(2, '0')}</span>
              <span className={styles.processTitle}>{t(`${key}Title`)}</span>
              <span className={styles.processBody}>{t(`${key}Body`)}</span>
            </div>
          ))}
        </div>

        <div className="hero-ctas" style={{ display: 'flex', gap: 14, paddingBottom: 90 }}>
          <Link href="/contact" className="btn-pill primary">
            <span>{t('ctaStart')}</span>
            <span className="arr">&rarr;</span>
          </Link>
          <Link href="/projects" className="btn-pill ghost">
            <span>{t('ctaWork')}</span>
          </Link>
        </div>
      </div>
    </SiteChrome>
  )
}
