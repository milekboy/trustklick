'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import NetworkInstance from '@/components/NetworkInstance'
import { useAuth } from '@/components/AuthContext'
import Toast from '@/components/Toast'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import InputAdornment from '@mui/material/InputAdornment'
import Grid from '@mui/material/Grid2'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

type KlickType = {
  id: number
  name: string
  announcement: string
  description?: string
  whatsapp_group_link: string
  invite_url: string
  member_count?: number
  is_member?: boolean
  has_pending_request?: boolean
}

export default function JoinKlickPage() {
  const router = useRouter()
  const { token } = useAuth()
  const api = NetworkInstance()

  const [klicks, setKlicks] = useState<KlickType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [requestDialogOpen, setRequestDialogOpen] = useState(false)
  const [selectedKlick, setSelectedKlick] = useState<KlickType | null>(null)
  const [requesting, setRequesting] = useState(false)

  const [toast, setToast] = useState({
    message: '',
    type: ''
  })

  // Fetch all public Klicks
  useEffect(() => {
    const fetchKlicks = async () => {
      try {
        const res = await api.get('/klicks/public', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setKlicks(res.data.data || [])
      } catch (error: any) {
        console.error('Error fetching klicks:', error)
        setToast({
          message: error?.response?.data?.message || 'Failed to load Klicks',
          type: 'error'
        })
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchKlicks()
    }
  }, [token])

  // Filter Klicks based on search query
  const filteredKlicks = useMemo(() => {
    if (!searchQuery.trim()) return klicks

    const query = searchQuery.toLowerCase()
    return klicks.filter(
      klick =>
        klick.name.toLowerCase().includes(query) ||
        klick.announcement?.toLowerCase().includes(query) ||
        klick.description?.toLowerCase().includes(query)
    )
  }, [klicks, searchQuery])

  // Request to join a Klick
  const handleRequestJoin = async () => {
    if (!selectedKlick) return

    setRequesting(true)
    try {
      const res = await api.post(
        `/klicks/${selectedKlick.id}/join-request`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setToast({ message: res.data.message || 'Join request sent successfully!', type: 'success' })
      setRequestDialogOpen(false)
      setSelectedKlick(null)

      // Update the Klick status
      setKlicks(prevKlicks =>
        prevKlicks.map(k =>
          k.id === selectedKlick.id ? { ...k, has_pending_request: true } : k
        )
      )
    } catch (error: any) {
      setToast({
        message: error?.response?.data?.message || 'Failed to send join request',
        type: 'error'
      })
    } finally {
      setRequesting(false)
    }
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[400px]'>
        <CircularProgress />
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {toast.message && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />
      )}

      {/* Header */}
      <div className='flex flex-col gap-2'>
        <Typography variant='h4' className='font-bold'>
          Join a Klick
        </Typography>
        <Typography variant='body1' color='text.secondary' className='max-w-2xl'>
          Search for Klicks to join and start contributing with others. Browse available Klicks below or use the search
          to find specific ones.
        </Typography>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className='p-4'>
          <TextField
            fullWidth
            placeholder='Search Klicks by name, description, or announcement...'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position='start'>
                    <i className='ri-search-line text-xl' />
                  </InputAdornment>
                )
              }
            }}
          />
        </CardContent>
      </Card>

      {/* Klicks Grid */}
      {filteredKlicks.length === 0 ? (
        <Card>
          <CardContent className='p-8 text-center'>
            <Typography variant='h6' color='text.secondary' className='mb-2'>
              {searchQuery ? 'No Klicks found matching your search.' : 'No Klicks available to join.'}
            </Typography>
            {!searchQuery && (
              <Button variant='contained' onClick={() => router.push('/dashboards/create-klick')} className='mt-4'>
                Create Your First Klick
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={4}>
          {filteredKlicks.map(klick => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={klick.id}>
              <Card className='h-full hover:shadow-lg transition-shadow'>
                <CardHeader
                  title={
                    <div className='flex items-center justify-between'>
                      <Typography variant='h6' className='font-semibold'>
                        {klick.name}
                      </Typography>
                      {klick.member_count !== undefined && (
                        <Chip label={`${klick.member_count} members`} size='small' variant='outlined' />
                      )}
                    </div>
                  }
                />
                <CardContent>
                  <div className='space-y-4'>
                    {klick.announcement && (
                      <Typography variant='body2' color='text.secondary' className='line-clamp-2'>
                        {klick.announcement}
                      </Typography>
                    )}

                    {klick.description && (
                      <Typography variant='body2' color='text.secondary' className='line-clamp-3'>
                        {klick.description}
                      </Typography>
                    )}

                    <Divider />

                    <div className='flex flex-col gap-2'>
                      {klick.is_member ? (
                        <Button
                          variant='contained'
                          color='success'
                          fullWidth
                          onClick={() => router.push(`/dashboards/view-klicks/${klick.id}`)}
                          startIcon={<i className='ri-check-line' />}
                        >
                          View Klick
                        </Button>
                      ) : klick.has_pending_request ? (
                        <Button variant='outlined' fullWidth disabled startIcon={<i className='ri-time-line' />}>
                          Request Pending
                        </Button>
                      ) : (
                        <Button
                          variant='contained'
                          fullWidth
                          onClick={() => {
                            setSelectedKlick(klick)
                            setRequestDialogOpen(true)
                          }}
                          startIcon={<i className='ri-user-add-line' />}
                        >
                          Request to Join
                        </Button>
                      )}

                      <Button
                        variant='text'
                        size='small'
                        fullWidth
                        onClick={() => router.push(`/dashboards/view-klicks/${klick.id}`)}
                        startIcon={<i className='ri-eye-line' />}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Request to Join Dialog */}
      <Dialog open={requestDialogOpen} onClose={() => setRequestDialogOpen(false)} maxWidth='sm' fullWidth>
        <DialogTitle>Request to Join Klick</DialogTitle>
        <DialogContent>
          {selectedKlick && (
            <div className='space-y-4 mt-2'>
              <div className='flex items-center gap-3'>
                <CustomAvatar skin='light' color='primary' size={50}>
                  <i className='ri-group-line text-2xl' />
                </CustomAvatar>
                <div>
                  <Typography variant='h6' className='font-semibold'>
                    {selectedKlick.name}
                  </Typography>
                  {selectedKlick.member_count !== undefined && (
                    <Typography variant='body2' color='text.secondary'>
                      {selectedKlick.member_count} members
                    </Typography>
                  )}
                </div>
              </div>

              {selectedKlick.announcement && (
                <div>
                  <Typography variant='body2' color='text.secondary' className='mb-1'>
                    Announcement:
                  </Typography>
                  <Typography variant='body2'>{selectedKlick.announcement}</Typography>
                </div>
              )}

              {selectedKlick.description && (
                <div>
                  <Typography variant='body2' color='text.secondary' className='mb-1'>
                    Description:
                  </Typography>
                  <Typography variant='body2'>{selectedKlick.description}</Typography>
                </div>
              )}

              <Divider />

              <Typography variant='body2' color='text.secondary'>
                Your request will be sent to the Klick admin for approval. You'll be notified once they respond.
              </Typography>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRequestDialogOpen(false)} disabled={requesting}>
            Cancel
          </Button>
          <Button variant='contained' onClick={handleRequestJoin} disabled={requesting}>
            {requesting ? 'Sending...' : 'Send Request'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

