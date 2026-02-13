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
            <Grid size={{ xs: 12, md: 4 }} key={klick.id}>
              <KlickCard klick={klick} illustration={getIllustration(klick.id)} />
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  )
}

const KlickCard = ({ klick, illustration }: { klick: KlickType; illustration: string }) => {
  const router = useRouter()
  const api = NetworkInstance()
  const { token } = useAuth()
  const [memberCount, setMemberCount] = useState<number | null>(null)

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await api.get(`/klicks/${klick.id}/members`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        // Based on user provided response: { pagination: { total: 4 } }
        setMemberCount(res.data.pagination?.total || res.data.data?.length || 0)
      } catch (err) {
        console.error(`Error fetching members for klick ${klick.id}:`, err)
        setMemberCount(0)
      }
    }

    if (token) {
      fetchMembers()
    }
  }, [klick.id, token, api])

  return (
    <Card
      onClick={() => router.push(`/dashboards/view-klicks/${klick.id}`)}
      className='relative overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-lg h-full'
      variant='outlined'
      sx={{
        borderColor: 'divider',
        minHeight: '200px',
        '&:hover': {
          borderColor: 'primary.main',
          transform: 'translateY(-4px)'
        }
      }}
    >
      <CardContent className='p-0 h-full'>
        <div className='flex h-full flex-col sm:flex-row'>
          {/* Left Content - Text */}
          <div className='flex-1 p-6 flex flex-col justify-between z-10 min-w-0'>
            <div className='space-y-2'>
              <Typography variant='h5' className='font-bold line-clamp-1 text-primary'>
                {klick.name}
              </Typography>
              <Typography variant='body2' color='text.secondary' className='line-clamp-2 mb-4'>
                {klick.description || 'No description available'}
              </Typography>

              {/* Stats - Member Count Only */}
              <div className='mt-auto pt-4'>
                <div className='flex items-center gap-2 text-textSecondary bg-actionHover w-fit px-3 py-1 rounded-full'>
                  <i className='ri-group-line text-lg text-primary' />
                  <Typography variant='body2' className='font-medium'>
                    {memberCount !== null ? memberCount : '...'} Members
                  </Typography>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Dominant Illustration */}
          <div
            className='w-full sm:w-[45%] relative overflow-hidden'
            style={{
              borderTopLeftRadius: '150px',
              backgroundColor: 'rgba(103, 58, 183, 0.08)' // Slightly darker base
            }}
          >
            {/* Organic Cloud Shapes */}
            <div
              className='absolute top-[-20%] -right-[20%] w-[100%] h-[100%] rounded-full pointer-events-none'
              style={{
                backgroundColor: 'rgba(103, 58, 183, 0.25)', // Darker purple
                filter: 'blur(50px)',
                borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%'
              }}
            />
            <div
              className='absolute bottom-[-10%] -left-[10%] w-[80%] h-[80%] rounded-full pointer-events-none'
              style={{
                backgroundColor: 'rgba(156, 39, 176, 0.2)', // Secondary purple
                filter: 'blur(40px)',
                borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%'
              }}
            />

            <div className='h-full w-full relative flex items-center justify-center p-4 z-10'>
              <img
                src={illustration}
                alt='Klick Illustration'
                className='w-full h-full object-contain max-h-[160px] drop-shadow-md transform group-hover:scale-105 transition-transform duration-300'
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
