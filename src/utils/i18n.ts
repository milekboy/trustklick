// Config Imports
import { i18n } from '@configs/i18n'

// Util Imports
import { ensurePrefix } from '@/utils/string'

// Check if the url is missing the locale
export const isUrlMissingLocale = (url: string) => {
  return i18n.locales.every(locale => !(url.startsWith(`/${locale}/`) || url === `/${locale}`))
}

// ✅ Fixed version – fallback to English and allow no lang prefix
export const getLocalizedUrl = (url: string, languageCode?: string): string => {
  if (!url) throw new Error("URL can't be empty")

  // default to English or no prefix if you’ve removed /en/, /fr/, etc.
  const safeLang = languageCode || 'en'

  // if you no longer use locale-based URLs (e.g. no `/en/` in path)
  return ensurePrefix(url, '/')

  // ⬆️ If you still want to keep locale prefixes, comment out the above and use this instead:
  // return isUrlMissingLocale(url) ? `/${safeLang}${ensurePrefix(url, '/')}` : url
}
