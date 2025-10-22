'use client'

import { usePathname } from 'next/navigation'
import { i18n } from '@configs/i18n'

const LangRedirect = () => {
  const pathname = usePathname()

  //  Temporarily disable locale redirection
  return null
}

export default LangRedirect
