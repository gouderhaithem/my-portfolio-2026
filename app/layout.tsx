import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Instrument_Serif } from 'next/font/google'
import './globals.css'

const instrumentSerif = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-instrument-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://gouderhaithem.com'),
  title: {
    default: 'Gouder Haithem — Software Engineer in Algeria',
    template: '%s · Gouder Haithem',
  },
  description:
    'Gouder Haithem is a software engineer in Algiers, Algeria building high-performance websites, custom CRM, and ERP systems. Available for remote and local projects.',
  keywords: [
    'software engineer Algeria',
    'developer Algeria',
    'développeur Algérie',
    'web developer Algiers',
    'CRM developer Algeria',
    'ERP developer Algeria',
    'Next.js developer Algeria',
    'freelance developer Algiers',
    'مطور برمجيات الجزائر',
    'Gouder Haithem',
  ],
  authors: [{ name: 'Gouder Haithem', url: 'https://gouderhaithem.com' }],
  creator: 'Gouder Haithem',
  alternates: {
    canonical: 'https://gouderhaithem.com',
  },
  openGraph: {
    type: 'website',
    locale: 'en_DZ',
    url: 'https://gouderhaithem.com',
    siteName: 'Gouder Haithem — Software Engineer',
    title: 'Gouder Haithem — Software Engineer in Algeria',
    description:
      'Gouder Haithem is a software engineer in Algiers, Algeria building high-performance websites, custom CRM, and ERP systems.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Gouder Haithem — Software Engineer in Algeria',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gouder Haithem — Software Engineer in Algeria',
    description: 'Software engineer in Algiers building websites, CRM, and ERP systems.',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${instrumentSerif.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
