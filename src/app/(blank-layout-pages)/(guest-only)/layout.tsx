import type { ReactNode } from 'react'

// HOC Imports
import GuestOnlyRoute from '@/hocs/GuestOnlyRoute'

type LayoutProps = {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return <GuestOnlyRoute>{children}</GuestOnlyRoute>
}
