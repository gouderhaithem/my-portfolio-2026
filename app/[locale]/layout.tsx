import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Instrument_Serif } from 'next/font/google'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { BASE_URL, localeAlternates, localeUrl } from '@/lib/seo'
import '../globals.css'

const instrumentSerif = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-instrument-serif',
  display: 'swap',
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  const canonical = localeUrl(locale, '/')

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: t('title'),
      template: t('titleTemplate'),
    },
    description: t('description'),
    keywords: [
      'software engineer Algeria',
      'developer Algeria',
      'développeur Algérie',
      'développeur web Alger',
      'création site web Algérie',
      'web developer Algiers',
      'CRM developer Algeria',
      'ERP developer Algeria',
      'Next.js developer Algeria',
      'freelance developer Algiers',
      'مطور برمجيات الجزائر',
      'Gouder Haithem',
    ],
    authors: [{ name: 'Gouder Haithem', url: BASE_URL }],
    creator: 'Gouder Haithem',
    alternates: {
      canonical,
      languages: localeAlternates('/'),
    },
    openGraph: {
      type: 'website',
      locale: t('ogLocale'),
      url: canonical,
      siteName: t('title'),
      title: t('title'),
      description: t('ogDescription'),
      images: [
        {
          url: '/opengraph-image',
          width: 1200,
          height: 630,
          alt: t('title'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('twitterDescription'),
      images: ['/opengraph-image'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
      },
    },
  }
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      name: 'Gouder Haithem',
      alternateName: ['Haithem Gouder', 'Gouder Haithem'],
      givenName: 'Haithem',
      familyName: 'Gouder',
      jobTitle: 'Software Engineer',
      url: 'https://gouderhaithem.com',
      email: 'gouderhaithem@gmail.com',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Algiers',
        addressCountry: 'DZ',
      },
      sameAs: [
        'https://github.com/gouderhaithem',
        'https://dz.linkedin.com/in/gouder-h-689164244',
      ],
      knowsAbout: [
        'Web development',
        'CRM systems',
        'ERP systems',
        'TypeScript',
        'Next.js',
        'React',
        'Node.js',
        'NestJS',
        'Laravel',
        'Django',
        'Python',
        '.NET',
      ],
    },
    {
      '@type': 'ProfessionalService',
      name: 'Gouder Haithem — Software Engineering',
      description:
        'Custom software engineering services: websites, CRM, and ERP systems in Algeria and remotely.',
      url: 'https://gouderhaithem.com',
      areaServed: ['Algeria', 'Europe', 'Middle East'],
      founder: { '@type': 'Person', name: 'Gouder Haithem' },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Software Engineering Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Websites & Web Apps',
              description:
                'Marketing sites, product surfaces, and dashboards built on Next.js, Astro, and React.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'CRM Platforms',
              description:
                'Custom customer-relationship systems with pipelines, automations, and reporting.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'ERP Systems',
              description:
                'End-to-end operations software covering inventory, accounting, HR, and manufacturing.',
            },
          },
        ],
      },
    },
    {
      '@type': 'WebSite',
      name: 'Gouder Haithem — Software Engineer',
      url: 'https://gouderhaithem.com',
    },
  ],
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  return (
    <html
      lang={locale}
      className={`${GeistSans.variable} ${GeistMono.variable} ${instrumentSerif.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}
