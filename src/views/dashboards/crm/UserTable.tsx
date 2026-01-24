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
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={klick.id}>
              <Card
                variant='outlined'
                sx={{
                  borderColor: 'primary.main',
                  borderWidth: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: 'primary.dark',
                    boxShadow: 4,
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <CardContent className='flex-1 p-5 space-y-3'>
                  {/* Header with Name and Admin Badge */}
                  <div className='flex items-start justify-between gap-2 mb-2'>
                    <Typography variant='h6' className='font-bold' color='primary.main' sx={{ lineHeight: 1.3 }}>
                      {klick.name}
                    </Typography>
                    {klick.is_admin && (
                      <Chip label='Admin' size='small' color='secondary' variant='filled' />
                    )}
                  </div>

                  <Divider />

                  {/* Announcement */}
                  {klick.announcement ? (
                    <Box sx={{ bgcolor: 'primary.lighter', p: 2, borderRadius: 2 }}>
                      <Typography variant='caption' sx={{ fontWeight: 600, color: 'primary.dark' }} className='flex items-center gap-1 mb-1'>
                        <i className='ri-megaphone-line' />
                        Announcement
                      </Typography>
                      <Typography variant='body2' sx={{ color: 'primary.dark' }} className='line-clamp-2'>
                        {klick.announcement}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant='body2' color='text.secondary' className='italic'>
                      No announcement
                    </Typography>
                  )}

                  {/* WhatsApp Link */}
                  <div className='flex items-center gap-2'>
                    <i className='ri-whatsapp-line text-xl text-success' />
                    <Button
                      variant='text'
                      size='small'
                      href={klick.whatsapp_group_link}
                      target='_blank'
                      sx={{ padding: 0, minWidth: 'auto', textTransform: 'none' }}
                    >
                      Open WhatsApp Group
                    </Button>
                  </div>

                  {/* Invite Link */}
                  <div className='bg-gray-50 p-3 rounded-lg'>
                    <Typography variant='caption' className='font-semibold text-gray-700 flex items-center gap-1 mb-1'>
                      <i className='ri-link' />
                      Invite Link
                    </Typography>
                    <div className='flex items-center gap-2'>
                      <Typography variant='caption' className='font-mono text-xs text-gray-600 truncate flex-1'>
                        {klick.invite_url}
                      </Typography>
                      <Tooltip title={copiedId === klick.id ? 'Copied!' : 'Copy link'}>
                        <IconButton
                          size='small'
                          onClick={() => copyToClipboard(klick.invite_url, klick.id)}
                          sx={{ padding: '4px' }}
                        >
                          <i className={copiedId === klick.id ? 'ri-check-line text-success' : 'ri-file-copy-line'} />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </div>

                  {/* Member Count if available */}
                  {klick.member_count !== undefined && (
                    <div className='flex items-center gap-2 text-gray-600'>
                      <i className='ri-user-3-line' />
                      <Typography variant='body2'>
                        {klick.member_count} member{klick.member_count !== 1 ? 's' : ''}
                      </Typography>
                    </div>
                  )}
                </CardContent>

                {/* View Button */}
                <Box className='p-4 pt-0'>
                  <Button
                    variant='contained'
                    fullWidth
                    color='primary'
                    onClick={() => router.push(`/dashboards/view-klicks/${klick.id}`)}
                  >
                    View Details
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  )
}
