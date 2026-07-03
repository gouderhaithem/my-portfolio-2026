export const BASE_URL = 'https://gouderhaithem.com'

/** Absolute URL for a path in a given locale ('/' → site root or /fr). */
export function localeUrl(locale: string, path: string): string {
  const suffix = path === '/' ? '' : path
  return locale === 'en' ? `${BASE_URL}${suffix}` || BASE_URL : `${BASE_URL}/${locale}${suffix}`
}

/** hreflang alternates map for a public route, e.g. localeAlternates('/services'). */
export function localeAlternates(path: string): Record<string, string> {
  return {
    en: localeUrl('en', path),
    fr: localeUrl('fr', path),
    'x-default': localeUrl('en', path),
  }
}
