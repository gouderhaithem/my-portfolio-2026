import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  // English stays at the root (/, /services, …); French lives under /fr.
  localePrefix: 'as-needed',
})

export type Locale = (typeof routing.locales)[number]
