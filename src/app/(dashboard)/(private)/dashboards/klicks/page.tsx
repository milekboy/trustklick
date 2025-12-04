'use client'

import KlickList from '@/views/dashboards/crm/UserTable'
import Button from '@mui/material/Button'

import { useRouter } from 'next/navigation'

export default function Klicks() {
  const router = useRouter()

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-textPrimary'>Klicks Dashboard</h1>
          <p className='text-textSecondary mt-1'>Manage your Klicks, share invite links, and monitor group activity.</p>
        </div>

        <div className='flex gap-3'>
          <Button variant='outlined' onClick={() => router.refresh()}>
            Refresh
          </Button>

          <Button variant='contained' onClick={() => router.push('/dashboards/create-klick')}>
            + Create Klick
          </Button>
        </div>
      </div>

      {/* Table Wrapper */}

      <KlickList />
    </div>
  )
}
