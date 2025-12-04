// Next Imports
import { headers } from 'next/headers'

// MUI Imports
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Type Imports
import type { ChildrenType } from '@core/types'
import type { Locale } from '@configs/i18n'

// HOC Imports
import TranslationWrapper from '@/hocs/TranslationWrapper'

// Config Imports
import { i18n } from '@configs/i18n'

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'
import { AuthProvider } from '@/components/AuthContext'

export const metadata = {
  title: 'TrustKlick',
  description: 'Money contribution made modern & simple.'
}

const RootLayout = async (
  props: ChildrenType & { params: Promise<{ lang?: Locale }> } // 👈 allow lang to be optional
) => {
  const params = await props.params
  const { children } = props

  // Vars
  const headersList = await headers()
  const systemMode = await getSystemMode()

  // 👇 safely handle missing `lang` (default to English)
  const lang = params?.lang || 'en'
  const direction = i18n.langDirection[lang] || 'ltr'

  return (
    <html id='__next' lang={lang} dir={direction} suppressHydrationWarning>
      <body className='flex is-full min-bs-full flex-auto flex-col'>
        <AuthProvider>
          <InitColorSchemeScript attribute='data' defaultMode={systemMode} />
          <TranslationWrapper headersList={headersList} lang={lang}>
            {children}
          </TranslationWrapper>
        </AuthProvider>
      </body>
    </html>
  )
}

export default RootLayout
