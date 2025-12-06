'use client'

import { useEffect, useState } from 'react'
import NetworkInstance from '@/components/NetworkInstance'
import { useAuth } from '@/components/AuthContext'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import { useRouter } from 'next/navigation'
export default function KlickList() {
  const api = NetworkInstance()
  const { token } = useAuth()

  const [klicks, setKlicks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const router = useRouter()
  // Fetch Klicks
  useEffect(() => {
    const fetchKlicks = async () => {
      try {
        const res = await api.get('/klicks', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setKlicks(res.data.data)
      } catch (err) {
        console.error('Error fetching klicks:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchKlicks()
  }, [token])

  // Copy Invite URL
  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  if (loading) {
    return (
      <div className='flex justify-center mt-10'>
        <CircularProgress />
      </div>
    )
  }

  return (
    <Card className='p-4 overflow-x-auto'>
      <div className='p-3 pe-14 flex items-center justify-between'>
        <p className='text-xl font-bold'>Klick List</p>

        <Button variant='contained' size='small' onClick={() => router.push('/dashboards/klicks')}>
          View All
        </Button>
      </div>

      <table className='w-full border-collapse'>
        <thead>
          <tr className='text-left border-b'>
            <th className='p-3'>Name</th>
            <th className='p-3'>WhatsApp Link</th>
            <th className='p-3'>Announcement</th>
            <th className='p-3'>Invite URL</th>
            <th className='p-3 text-center'>Actions</th>
          </tr>
        </thead>

        <tbody>
          {klicks.length === 0 ? (
            <tr>
              <td colSpan={5} className='text-center p-4'>
                No Klicks available
              </td>
            </tr>
          ) : (
            klicks.map(klick => (
              <tr key={klick.id} className='border-b hover:bg-gray-600'>
                <td className='p-3 font-medium'>{klick.name}</td>

                <td className='p-3'>
                  <a href={klick.whatsapp_group_link} target='_blank' className='text-primary underline'>
                    Open Link
                  </a>
                </td>

                <td className='p-3'>{klick.announcement}</td>

                <td className='p-3'>
                  <div className='flex items-center gap-2'>
                    <span className='font-mono text-sm'>{klick.invite_url}</span>

                    <Tooltip title='Copy invite URL'>
                      <IconButton size='small' onClick={() => copyToClipboard(klick.invite_url, klick.id)}>
                        <i className='ri-file-copy-line text-lg' />
                      </IconButton>
                    </Tooltip>

                    {copiedId === klick.id && <span className='text-green-600 text-xs'>Copied!</span>}
                  </div>
                </td>

                <td className='p-3 text-center'>
                  <Button
                    variant='outlined'
                    size='small'
                    onClick={() => (window.location.href = `/dashboards/view-klicks/${klick.id}`)}
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Card>
  )
}
