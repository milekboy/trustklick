'use client'

import { useEffect, useState } from 'react'
import NetworkInstance from '@/components/NetworkInstance'
import { useAuth } from '@/components/AuthContext'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import InputAdornment from '@mui/material/InputAdornment'
import Grid from '@mui/material/Grid2'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import { useRouter } from 'next/navigation'

type KlickType = {
  id: number
  name: string
  whatsapp_group_link: string
  announcement: string
  invite_url: string
  is_admin?: boolean
  member_count?: number
  description?: string
}

export default function KlickList() {
  const api = NetworkInstance()
  const { token } = useAuth()
  const router = useRouter()

  const [klicks, setKlicks] = useState<KlickType[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch Klicks
  useEffect(() => {
    const fetchKlicks = async () => {
      try {
        const res = await api.get('/klicks', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setKlicks(res.data.data || [])
      } catch (err) {
        console.error('Error fetching klicks:', err)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchKlicks()
    }
  }, [token])

  // Copy Invite URL
  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  const illustrations = [
    '/images/illustrations/characters-with-objects/1.png',
    '/images/illustrations/characters-with-objects/2.png',
    '/images/illustrations/objects/pricing-basic.png',
    '/images/illustrations/objects/pricing-enterprise.png',
    '/images/illustrations/objects/pricing-standard.png'
  ]

  const getIllustration = (id: number) => {
    return illustrations[id % illustrations.length]
  }

  // Filter klicks based on search
  const filteredKlicks = klicks.filter(klick =>
    klick.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    klick.announcement?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[400px]'>
        <CircularProgress />
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Search Bar */}
      <Card>
        <CardContent className='p-4'>
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
            <div>
              <Typography variant='h5' className='font-bold mb-1'>
                All Klicks
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {filteredKlicks.length} Klick{filteredKlicks.length !== 1 ? 's' : ''} found
              </Typography>
            </div>
            <TextField
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder='Search Klicks...'
              size='small'
              sx={{ minWidth: { xs: '100%', sm: '300px' } }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='ri-search-line' />
                    </InputAdornment>
                  )
                }
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Klicks Grid */}
      {filteredKlicks.length === 0 ? (
        <Card>
          <CardContent className='p-8 text-center'>
            <i className='ri-group-line text-5xl text-textSecondary mb-4' />
            <Typography variant='h6' color='text.secondary' className='mb-2'>
              {searchQuery ? 'No Klicks found matching your search' : 'No Klicks available'}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {!searchQuery && 'Create your first Klick to get started!'}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {filteredKlicks.map(klick => (
            <Grid size={{ xs: 12, md: 6 }} key={klick.id}>
              <Card
                onClick={() => router.push(`/dashboards/view-klicks/${klick.id}`)}
                className='relative overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-lg'
                variant='outlined'
                sx={{
                  borderColor: 'divider',
                  '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <CardContent className='p-0 h-full'>
                  <div className='flex h-full'>
                    {/* Left Content */}
                    <div className='flex-1 p-5 flex flex-col justify-between z-10'>
                      <div>
                        {klick.is_admin && (
                          <Chip
                            label='Admin'
                            size='small'
                            color='primary'
                            variant='tonal'
                            className='mb-2'
                            sx={{ height: 20, fontSize: '0.75rem' }}
                          />
                        )}
                        <Typography variant='h6' className='font-bold mb-1 line-clamp-1'>
                          {klick.name}
                        </Typography>
                        <Typography variant='body2' color='text.secondary' className='mb-3 line-clamp-2'>
                          {klick.description || 'No description available'}
                        </Typography>
                      </div>

                      <div className='mt-auto'>
                        <div className='flex items-center gap-2 text-primary font-medium group-hover:underline'>
                          <Typography variant='body2' color='inherit' className='font-bold'>
                            View Klick
                          </Typography>
                          <i className='ri-arrow-right-line transition-transform group-hover:translate-x-1' />
                        </div>
                      </div>
                    </div>

                    {/* Right Content - Illustration */}
                    <div className='w-1/3 min-w-[120px] relative flex items-center justify-center bg-gray-50/50 p-2'>
                      {/* Decorative Background Circle */}
                      <div className='absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 w-32 h-32 rounded-full bg-primary/5' />

                      <img
                        src={getIllustration(klick.id)}
                        alt='Klick Illustration'
                        className='relative z-10 w-full h-auto object-contain max-h-[140px] drop-shadow-sm transition-transform duration-300 group-hover:scale-110'
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  )
}
