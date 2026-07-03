import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Instrument_Serif } from 'next/font/google'
import '../globals.css'

const instrumentSerif = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-instrument-serif',
  display: 'swap',
})

// Root layout for the /admin branch. The public site lives under
// app/[locale]/ with its own root layout; the admin panel is not localized.
export const metadata: Metadata = {
  title: 'Admin · Gouder Haithem',
  robots: { index: false, follow: false },
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${instrumentSerif.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
