import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import SiteChrome from '@/components/SiteChrome'
import ContactForm from '@/components/ContactForm'
import SocialLinks from '@/components/SocialLinks'
import { localeAlternates, localeUrl } from '@/lib/seo'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contactPage' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: localeUrl(locale, '/contact'),
      languages: localeAlternates('/contact'),
    },
  }
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('contactPage')
  const tHome = await getTranslations('home.contact')

  return (
    <SiteChrome>
      {/* id="contact" so this page reuses the landing section's scoped styles */}
      <section id="contact" style={{ flex: '1 0 auto' }}>
        <span className="eyebrow" style={{ justifyContent: 'center' }}>
          {t('eyebrow')}
        </span>
        <h2 className="lets">
          {tHome('lets')} <span className="talk">{tHome('talk')}</span>
        </h2>
        <p className="sub">{tHome('sub')}</p>

        <ContactForm />

        <div className="divider-or">
          <span>{t('divider')}</span>
        </div>

        <div className="cta">
          <a className="mail" href="mailto:gouderhaithem@gmail.com">
            gouderhaithem@gmail.com
          </a>
          <SocialLinks />
        </div>
      </section>
    </SiteChrome>
  )
}
