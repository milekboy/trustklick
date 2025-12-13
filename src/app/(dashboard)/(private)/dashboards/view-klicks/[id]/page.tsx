'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import type { SyntheticEvent } from 'react'
import NetworkInstance from '@/components/NetworkInstance'
import { useAuth } from '@/components/AuthContext'
import Toast from '@/components/Toast'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid2'
import InputAdornment from '@mui/material/InputAdornment'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import Box from '@mui/material/Box'

// Component Imports
import CustomTabList from '@core/components/mui/TabList'
import CustomAvatar from '@core/components/mui/Avatar'
import OptionMenu from '@core/components/option-menu'

// Util Imports
import { getInitials } from '@/utils/getInitials'

type MemberType = {
  id: number
  user: {
    id: number
    first_name: string
    last_name: string
    email: string
    image?: string
  }
  is_admin: boolean
}

type JoinRequestType = {
  id: number
  user: {
    id: number
    first_name: string
    last_name: string
    email: string
    image?: string
  }
  status: string
  created_at: string
}

type CycleType = {
  id: number
  cycle_number: number
  status: string
  amount_per_member?: number
  total_amount?: number
  start_date?: string
  end_date?: string
  created_at: string
}

// Dummy data for testing
const DUMMY_MEMBERS: MemberType[] = [
  {
    id: 1,
    user: {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com'
    },
    is_admin: true
  },
  {
    id: 2,
    user: {
      id: 2,
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane.smith@example.com'
    },
    is_admin: false
  },
  {
    id: 3,
    user: {
      id: 3,
      first_name: 'Michael',
      last_name: 'Johnson',
      email: 'michael.j@example.com'
    },
    is_admin: false
  },
  {
    id: 4,
    user: {
      id: 4,
      first_name: 'Sarah',
      last_name: 'Williams',
      email: 'sarah.w@example.com'
    },
    is_admin: false
  },
  {
    id: 5,
    user: {
      id: 5,
      first_name: 'David',
      last_name: 'Brown',
      email: 'david.brown@example.com'
    },
    is_admin: false
  }
]

const DUMMY_JOIN_REQUESTS: JoinRequestType[] = [
  {
    id: 1,
    user: {
      id: 6,
      first_name: 'Emily',
      last_name: 'Davis',
      email: 'emily.davis@example.com'
    },
    status: 'pending',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    user: {
      id: 7,
      first_name: 'Robert',
      last_name: 'Miller',
      email: 'robert.m@example.com'
    },
    status: 'pending',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    user: {
      id: 8,
      first_name: 'Lisa',
      last_name: 'Anderson',
      email: 'lisa.a@example.com'
    },
    status: 'pending',
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  }
]

export default function SingleKlickPage() {
  const params = useParams()
  const router = useRouter()
  const { id } = params
  const { token } = useAuth()
  const api = NetworkInstance()

  const [klick, setKlick] = useState<any>(null)
  const [members, setMembers] = useState<MemberType[]>([])
  const [joinRequests, setJoinRequests] = useState<JoinRequestType[]>([])
  const [cycles, setCycles] = useState<CycleType[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [copied, setCopied] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [useDummyData, setUseDummyData] = useState(true) // Toggle for dummy data

  // Dialog states
  const [createCycleOpen, setCreateCycleOpen] = useState(false)
  const [kickMemberOpen, setKickMemberOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<MemberType | null>(null)
  const [makeAdminOpen, setMakeAdminOpen] = useState(false)

  // Form states
  const [cycleForm, setCycleForm] = useState({
    amount_per_member: '',
    start_date: '',
    end_date: ''
  })

  const [toast, setToast] = useState({
    message: '',
    type: ''
  })

  // Fetch Klick data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/klicks/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setKlick(res.data.data)
        setIsAdmin(res.data.data.is_admin || true)
      } catch (error) {
        console.error(error)
        setToast({ message: 'Failed to load Klick details', type: 'error' })
      } finally {
        setLoading(false)
      }
    }

    if (token && id) {
      fetchData()
    }
  }, [id, token])

  // Fetch Members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        if (useDummyData) {
          setMembers(DUMMY_MEMBERS)
          return
        }
        const res = await api.get(`/klicks/${id}/members`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setMembers(res.data.data || [])
      } catch (error) {
        console.error('Error fetching members:', error)
        if (useDummyData) {
          setMembers(DUMMY_MEMBERS)
        }
      }
    }

    if (token && id) {
      fetchMembers()
    }
  }, [id, token, useDummyData])

  // Fetch Join Requests
  useEffect(() => {
    const fetchJoinRequests = async () => {
      if (!isAdmin) return

      try {
        if (useDummyData) {
          setJoinRequests(DUMMY_JOIN_REQUESTS)
          return
        }
        const res = await api.get(`/klicks/${id}/join-requests`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setJoinRequests(res.data.data || [])
      } catch (error) {
        console.error('Error fetching join requests:', error)
        if (useDummyData) {
          setJoinRequests(DUMMY_JOIN_REQUESTS)
        }
      }
    }

    if (token && id && isAdmin) {
      fetchJoinRequests()
    }
  }, [id, token, isAdmin, useDummyData])

  // Fetch Cycles
  useEffect(() => {
    const fetchCycles = async () => {
      try {
        const res = await api.get(`/klicks/${id}/cycles`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setCycles(res.data.data || [])
      } catch (error) {
        console.error('Error fetching cycles:', error)
      }
    }

    if (token && id) {
      fetchCycles()
    }
  }, [id, token])

  const copyInvite = () => {
    if (klick?.invite_url) {
      navigator.clipboard.writeText(klick.invite_url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  const handleTabChange = (event: SyntheticEvent, newValue: string) => {
    setActiveTab(newValue)
  }

  // Create Cycle
  const handleCreateCycle = async () => {
    try {
      const res = await api.post(
        `/klicks/${id}/cycles`,
        {
          amount_per_member: parseFloat(cycleForm.amount_per_member),
          start_date: cycleForm.start_date,
          end_date: cycleForm.end_date
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setToast({ message: res.data.message || 'Cycle created successfully!', type: 'success' })
      setCreateCycleOpen(false)
      setCycleForm({ amount_per_member: '', start_date: '', end_date: '' })

      // Refresh cycles
      const cyclesRes = await api.get(`/klicks/${id}/cycles`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setCycles(cyclesRes.data.data || [])
    } catch (error: any) {
      setToast({
        message: error?.response?.data?.message || 'Failed to create cycle',
        type: 'error'
      })
    }
  }

  // Kick Member
  const handleKickMember = async () => {
    if (!selectedMember) return

    try {
      if (useDummyData) {
        setMembers(prev => prev.filter(m => m.id !== selectedMember.id))
        setToast({ message: 'Member removed successfully', type: 'success' })
        setKickMemberOpen(false)
        setSelectedMember(null)
        return
      }

      const res = await api.delete(`/klicks/${id}/members/${selectedMember.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setToast({ message: res.data.message || 'Member removed successfully', type: 'success' })
      setKickMemberOpen(false)
      setSelectedMember(null)

      // Refresh members
      const membersRes = await api.get(`/klicks/${id}/members`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setMembers(membersRes.data.data || [])
    } catch (error: any) {
      setToast({
        message: error?.response?.data?.message || 'Failed to remove member',
        type: 'error'
      })
    }
  }

  // Make Admin
  const handleMakeAdmin = async () => {
    if (!selectedMember) return

    try {
      if (useDummyData) {
        setMembers(prev => prev.map(m => (m.id === selectedMember.id ? { ...m, is_admin: true } : m)))
        setToast({ message: 'Member promoted to admin', type: 'success' })
        setMakeAdminOpen(false)
        setSelectedMember(null)
        return
      }

      const res = await api.patch(
        `/klicks/${id}/members/${selectedMember.id}/make-admin`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setToast({ message: res.data.message || 'Member promoted to admin', type: 'success' })
      setMakeAdminOpen(false)
      setSelectedMember(null)

      // Refresh members
      const membersRes = await api.get(`/klicks/${id}/members`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setMembers(membersRes.data.data || [])
    } catch (error: any) {
      setToast({
        message: error?.response?.data?.message || 'Failed to promote member',
        type: 'error'
      })
    }
  }

  // Approve Join Request
  const handleApproveRequest = async (requestId: number) => {
    try {
      if (useDummyData) {
        const request = joinRequests.find(r => r.id === requestId)
        if (request) {
          setMembers(prev => [
            ...prev,
            {
              id: request.user.id,
              user: request.user,
              is_admin: false
            }
          ])
          setJoinRequests(prev => prev.filter(r => r.id !== requestId))
          setToast({ message: 'Join request approved', type: 'success' })
        }
        return
      }

      const res = await api.patch(
        `/klicks/${id}/join-requests/${requestId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setToast({ message: res.data.message || 'Join request approved', type: 'success' })

      // Refresh data
      const [membersRes, requestsRes] = await Promise.all([
        api.get(`/klicks/${id}/members`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        api.get(`/klicks/${id}/join-requests`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])

      setMembers(membersRes.data.data || [])
      setJoinRequests(requestsRes.data.data || [])
    } catch (error: any) {
      setToast({
        message: error?.response?.data?.message || 'Failed to approve request',
        type: 'error'
      })
    }
  }

  // Decline Join Request
  const handleDeclineRequest = async (requestId: number) => {
    try {
      if (useDummyData) {
        setJoinRequests(prev => prev.filter(r => r.id !== requestId))
        setToast({ message: 'Join request declined', type: 'success' })
        return
      }

      const res = await api.patch(
        `/klicks/${id}/join-requests/${requestId}/decline`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setToast({ message: res.data.message || 'Join request declined', type: 'success' })

      // Refresh requests
      const requestsRes = await api.get(`/klicks/${id}/join-requests`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setJoinRequests(requestsRes.data.data || [])
    } catch (error: any) {
      setToast({
        message: error?.response?.data?.message || 'Failed to decline request',
        type: 'error'
      })
    }
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[400px]'>
        <CircularProgress />
      </div>
    )
  }

  if (!klick) {
    return (
      <div className='text-center mt-10'>
        <Typography variant='h6' color='text.secondary'>
          Klick not found
        </Typography>
        <Button variant='contained' onClick={() => router.push('/dashboards/klicks')} className='mt-4'>
          Back to Klicks
        </Button>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {toast.message && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />
      )}

      {/* Header Card with Announcement */}
      <Card>
        <CardContent className='p-6'>
          <div className='flex items-center justify-between flex-wrap gap-4 mb-4'>
            <div className='flex-1 min-w-[200px]'>
              <div className='flex items-center gap-3 mb-2'>
                <Typography variant='h4' className='font-bold'>
                  {klick.name}
                </Typography>
                {isAdmin && <Chip label='Admin' color='primary' size='small' />}
              </div>
            </div>

            <div className='flex gap-2'>
              <Tooltip title={copied ? 'Copied!' : 'Copy invite URL'}>
                <IconButton onClick={copyInvite}>
                  <i className='ri-file-copy-line text-xl' />
                </IconButton>
              </Tooltip>

              <Button
                variant='contained'
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ url: klick.invite_url, title: `Join ${klick.name}` })
                  } else {
                    copyInvite()
                  }
                }}
                startIcon={<i className='ri-share-line' />}
              >
                Share
              </Button>
            </div>
          </div>

          {/* Announcement Alert */}
          {klick.announcement ? (
            <Alert severity='info' icon={<i className='ri-megaphone-line' />} className='mt-4'>
              <AlertTitle className='font-semibold'>Announcement</AlertTitle>
              {klick.announcement}
            </Alert>
          ) : (
            <Alert severity='info' icon={<i className='ri-information-line' />} className='mt-4'>
              <AlertTitle className='font-semibold'>No Announcement</AlertTitle>
              There are no announcements for this Klick at the moment.
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Main Content with Tabs */}
      <Card>
        <TabContext value={activeTab}>
          <div className='border-b'>
            <CustomTabList onChange={handleTabChange} variant='scrollable' scrollButtons='auto'>
              <Tab value='overview' label='Overview' icon={<i className='ri-dashboard-line' />} iconPosition='start' />
              <Tab
                value='members'
                label={`Members (${members.length})`}
                icon={<i className='ri-group-line' />}
                iconPosition='start'
              />
              <Tab
                value='join-requests'
                label={`Join Requests (${joinRequests.length})`}
                icon={<i className='ri-user-add-line' />}
                iconPosition='start'
              />
              <Tab
                value='cycles'
                label={`Cycles (${cycles.length})`}
                icon={<i className='ri-refresh-line' />}
                iconPosition='start'
              />
              {isAdmin && (
                <Tab
                  value='settings'
                  label='Settings'
                  icon={<i className='ri-settings-3-line' />}
                  iconPosition='start'
                />
              )}
            </CustomTabList>
          </div>

          <CardContent>
            {/* Overview Tab */}
            <TabPanel value='overview' className='space-y-6'>
              <div>
                <Typography variant='h6' className='font-semibold mb-4'>
                  Klick Information
                </Typography>
                <Grid container spacing={4}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Card variant='outlined' className='p-4 h-full'>
                      <div className='flex items-center gap-2 mb-2'>
                        <i className='ri-file-text-line text-xl text-primary' />
                        <Typography variant='body2' color='text.secondary' className='font-medium'>
                          Description
                        </Typography>
                      </div>
                      <Typography>{klick.description || 'No description provided.'}</Typography>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Card variant='outlined' className='p-4 h-full'>
                      <div className='flex items-center gap-2 mb-2'>
                        <i className='ri-whatsapp-line text-xl text-success' />
                        <Typography variant='body2' color='text.secondary' className='font-medium'>
                          WhatsApp Group
                        </Typography>
                      </div>
                      <Button
                        variant='outlined'
                        color='success'
                        href={klick.whatsapp_group_link}
                        target='_blank'
                        startIcon={<i className='ri-external-link-line' />}
                        className='mt-2'
                      >
                        Open Group
                      </Button>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Card variant='outlined' className='p-4 h-full'>
                      <div className='flex items-center gap-2 mb-2'>
                        <i className='ri-link text-xl text-info' />
                        <Typography variant='body2' color='text.secondary' className='font-medium'>
                          Invite Link
                        </Typography>
                      </div>
                      <div className='flex items-center gap-2 mt-2'>
                        <Typography variant='body2' className='font-mono text-xs flex-1 truncate'>
                          {klick.invite_url}
                        </Typography>
                        <IconButton size='small' onClick={copyInvite}>
                          <i className='ri-file-copy-line' />
                        </IconButton>
                      </div>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Card variant='outlined' className='p-4 h-full'>
                      <div className='flex items-center gap-2 mb-2'>
                        <i className='ri-group-line text-xl text-primary' />
                        <Typography variant='body2' color='text.secondary' className='font-medium'>
                          Total Members
                        </Typography>
                      </div>
                      <Typography variant='h4' className='font-bold text-primary'>
                        {members.length}
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>
              </div>

              <Divider />

              <div>
                <Typography variant='h6' className='font-semibold mb-4'>
                  Quick Stats
                </Typography>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card variant='outlined' className='p-4'>
                      <div className='text-center mb-3'>
                        <i className='ri-refresh-line text-3xl text-primary mb-2' />
                        <Typography variant='h5' className='font-bold'>
                          {cycles.length}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          Total Cycles
                        </Typography>
                      </div>
                      <Button
                        variant='outlined'
                        fullWidth
                        size='small'
                        onClick={() => setActiveTab('cycles')}
                        startIcon={<i className='ri-eye-line' />}
                      >
                        View Cycles
                      </Button>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card variant='outlined' className='p-4'>
                      <div className='text-center mb-3'>
                        <i className='ri-user-add-line text-3xl text-warning mb-2' />
                        <Typography variant='h5' className='font-bold'>
                          {joinRequests.length}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          Pending Requests
                        </Typography>
                      </div>
                      <Button
                        variant='outlined'
                        fullWidth
                        size='small'
                        onClick={() => setActiveTab('join-requests')}
                        startIcon={<i className='ri-eye-line' />}
                      >
                        View Requests
                      </Button>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card variant='outlined' className='p-4'>
                      <div className='text-center mb-3'>
                        <i className='ri-group-line text-3xl text-primary mb-2' />
                        <Typography variant='h5' className='font-bold'>
                          {members.length}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          Total Members
                        </Typography>
                      </div>
                      <Button
                        variant='outlined'
                        fullWidth
                        size='small'
                        onClick={() => setActiveTab('members')}
                        startIcon={<i className='ri-eye-line' />}
                      >
                        View Members
                      </Button>
                    </Card>
                  </Grid>
                </Grid>
              </div>
            </TabPanel>

            {/* Members Tab - List View */}
            <TabPanel value='members' className='space-y-4'>
              <div className='flex items-center justify-between mb-4'>
                <Typography variant='h6' className='font-semibold'>
                  Members ({members.length})
                </Typography>
                {isAdmin && (
                  <Button variant='outlined' size='small' startIcon={<i className='ri-user-add-line' />}>
                    Invite Member
                  </Button>
                )}
              </div>

              {members.length === 0 ? (
                <Card variant='outlined' className='p-8 text-center'>
                  <i className='ri-group-line text-5xl text-textSecondary mb-4' />
                  <Typography variant='h6' color='text.secondary' className='mb-2'>
                    No members yet
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Start inviting people to join your Klick!
                  </Typography>
                </Card>
              ) : (
                <Card variant='outlined'>
                  <List className='p-0'>
                    {members.map((member, index) => (
                      <div key={member.id}>
                        <ListItem className='py-3'>
                          <ListItemAvatar>
                            <CustomAvatar skin='light' color={member.is_admin ? 'primary' : 'secondary'} size={42}>
                              {getInitials(`${member.user.first_name} ${member.user.last_name}`)}
                            </CustomAvatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <div className='flex items-center gap-2'>
                                <Typography className='font-medium'>
                                  {member.user.first_name} {member.user.last_name}
                                </Typography>
                                {member.is_admin && <Chip label='Admin' size='small' color='primary' variant='tonal' />}
                              </div>
                            }
                            secondary={member.user.email}
                          />
                          <ListItemSecondaryAction>
                            <div className='flex items-center gap-1'>
                              {isAdmin && !member.is_admin && (
                                <>
                                  <Tooltip title='Make Admin'>
                                    <IconButton
                                      size='small'
                                      onClick={() => {
                                        setSelectedMember(member)
                                        setMakeAdminOpen(true)
                                      }}
                                    >
                                      <i className='ri-vip-crown-line text-lg text-primary' />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title='Remove Member'>
                                    <IconButton
                                      size='small'
                                      onClick={() => {
                                        setSelectedMember(member)
                                        setKickMemberOpen(true)
                                      }}
                                    >
                                      <i className='ri-user-unfollow-line text-lg text-error' />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              )}
                              <OptionMenu
                                iconButtonProps={{ size: 'small' }}
                                iconClassName='text-textSecondary'
                                options={[
                                  {
                                    text: 'View Profile',
                                    icon: 'ri-user-line',
                                    menuItemProps: {
                                      onClick: () => {
                                        // Navigate to user profile
                                      }
                                    }
                                  },
                                  {
                                    text: 'Send Message',
                                    icon: 'ri-message-line',
                                    menuItemProps: {
                                      onClick: () => {
                                        // Open message dialog
                                      }
                                    }
                                  },
                                  ...(isAdmin && !member.is_admin
                                    ? [
                                        {
                                          text: 'Remove Member',
                                          icon: 'ri-user-unfollow-line',
                                          menuItemProps: {
                                            onClick: () => {
                                              setSelectedMember(member)
                                              setKickMemberOpen(true)
                                            }
                                          }
                                        },
                                        {
                                          text: 'Make Admin',
                                          icon: 'ri-vip-crown-line',
                                          menuItemProps: {
                                            onClick: () => {
                                              setSelectedMember(member)
                                              setMakeAdminOpen(true)
                                            }
                                          }
                                        }
                                      ]
                                    : [])
                                ]}
                              />
                            </div>
                          </ListItemSecondaryAction>
                        </ListItem>
                        {index < members.length - 1 && <Divider />}
                      </div>
                    ))}
                  </List>
                </Card>
              )}
            </TabPanel>

            {/* Join Requests Tab - List View */}
            <TabPanel value='join-requests' className='space-y-4'>
              <div className='flex items-center justify-between mb-4'>
                <Typography variant='h6' className='font-semibold'>
                  Join Requests ({joinRequests.length})
                </Typography>
                {!isAdmin && <Chip label='Admin Only' size='small' color='warning' variant='outlined' />}
              </div>

              {joinRequests.length === 0 ? (
                <Card variant='outlined' className='p-8 text-center'>
                  <i className='ri-inbox-line text-5xl text-textSecondary mb-4' />
                  <Typography variant='h6' color='text.secondary' className='mb-2'>
                    No pending requests
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    All join requests have been processed.
                  </Typography>
                </Card>
              ) : (
                <Card variant='outlined'>
                  <List className='p-0'>
                    {joinRequests.map((request, index) => (
                      <div key={request.id}>
                        <ListItem className='py-3'>
                          <ListItemAvatar>
                            <CustomAvatar skin='light' color='info' size={42}>
                              {getInitials(`${request.user.first_name} ${request.user.last_name}`)}
                            </CustomAvatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <div className='flex items-center gap-2'>
                                <Typography className='font-medium'>
                                  {request.user.first_name} {request.user.last_name}
                                </Typography>
                                <Chip label='Pending' size='small' color='warning' variant='tonal' />
                              </div>
                            }
                            secondary={
                              <div>
                                <Typography variant='body2' color='text.secondary'>
                                  {request.user.email}
                                </Typography>
                                <Typography variant='caption' color='text.secondary'>
                                  {(() => {
                                    const now = new Date()
                                    const requested = new Date(request.created_at)
                                    const diffMs = now.getTime() - requested.getTime()
                                    const diffMins = Math.floor(diffMs / 60000)
                                    const diffHours = Math.floor(diffMs / 3600000)
                                    const diffDays = Math.floor(diffMs / 86400000)

                                    if (diffMins < 1) return 'Requested just now'
                                    if (diffMins < 60)
                                      return `Requested ${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
                                    if (diffHours < 24)
                                      return `Requested ${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
                                    if (diffDays < 7) return `Requested ${diffDays} day${diffDays > 1 ? 's' : ''} ago`
                                    return `Requested on ${requested.toLocaleDateString()}`
                                  })()}
                                </Typography>
                              </div>
                            }
                          />
                          {isAdmin && (
                            <ListItemSecondaryAction>
                              <div className='flex items-center gap-2'>
                                <Button
                                  size='small'
                                  variant='contained'
                                  color='success'
                                  onClick={() => handleApproveRequest(request.id)}
                                  startIcon={<i className='ri-check-line' />}
                                >
                                  Accept
                                </Button>
                                <Button
                                  size='small'
                                  variant='outlined'
                                  color='error'
                                  onClick={() => handleDeclineRequest(request.id)}
                                  startIcon={<i className='ri-close-line' />}
                                >
                                  Deny
                                </Button>
                              </div>
                            </ListItemSecondaryAction>
                          )}
                        </ListItem>
                        {index < joinRequests.length - 1 && <Divider />}
                      </div>
                    ))}
                  </List>
                </Card>
              )}
            </TabPanel>

            {/* Cycles Tab */}
            <TabPanel value='cycles' className='space-y-4'>
              <div className='flex items-center justify-between mb-4'>
                <Typography variant='h6' className='font-semibold'>
                  Cycles ({cycles.length})
                </Typography>
                {isAdmin && (
                  <Button
                    variant='contained'
                    onClick={() => {
                      // Placeholder for now - will open dialog later
                      setCreateCycleOpen(true)
                    }}
                    startIcon={<i className='ri-add-line' />}
                  >
                    Create New Cycle
                  </Button>
                )}
              </div>

              {cycles.length === 0 ? (
                <Card variant='outlined' className='p-8'>
                  <Box className='text-center'>
                    <i className='ri-refresh-line text-6xl text-textSecondary mb-4' />
                    <Typography variant='h6' color='text.secondary' className='mb-2'>
                      No cycles started yet
                    </Typography>
                    <Typography variant='body2' color='text.secondary' className='mb-6 max-w-md mx-auto'>
                      Start your first contribution cycle to begin collecting funds from members. Each cycle helps
                      organize and track contributions effectively.
                    </Typography>
                    {isAdmin && (
                      <Button
                        variant='contained'
                        size='large'
                        onClick={() => setCreateCycleOpen(true)}
                        startIcon={<i className='ri-play-circle-line' />}
                      >
                        Start Your First Cycle
                      </Button>
                    )}
                  </Box>
                </Card>
              ) : (
                <Grid container spacing={3}>
                  {cycles.map(cycle => (
                    <Grid size={{ xs: 12, md: 6 }} key={cycle.id}>
                      <Card variant='outlined' className='p-4 hover:shadow-md transition-shadow'>
                        <div className='flex items-center justify-between mb-3'>
                          <Typography variant='h6' className='font-semibold'>
                            Cycle #{cycle.cycle_number}
                          </Typography>
                          <Chip
                            label={cycle.status}
                            size='small'
                            color={
                              cycle.status === 'active'
                                ? 'success'
                                : cycle.status === 'completed'
                                  ? 'primary'
                                  : 'default'
                            }
                            variant='tonal'
                          />
                        </div>
                        <div className='space-y-2'>
                          {cycle.amount_per_member && (
                            <div className='flex justify-between items-center'>
                              <Typography variant='body2' color='text.secondary'>
                                Amount per Member:
                              </Typography>
                              <Typography className='font-medium text-lg'>
                                ₦{cycle.amount_per_member.toLocaleString()}
                              </Typography>
                            </div>
                          )}
                          {cycle.total_amount && (
                            <div className='flex justify-between items-center'>
                              <Typography variant='body2' color='text.secondary'>
                                Total Amount:
                              </Typography>
                              <Typography className='font-medium text-lg text-primary'>
                                ₦{cycle.total_amount.toLocaleString()}
                              </Typography>
                            </div>
                          )}
                          <Divider className='my-2' />
                          {cycle.start_date && (
                            <div className='flex justify-between'>
                              <Typography variant='body2' color='text.secondary'>
                                Start Date:
                              </Typography>
                              <Typography variant='body2'>{new Date(cycle.start_date).toLocaleDateString()}</Typography>
                            </div>
                          )}
                          {cycle.end_date && (
                            <div className='flex justify-between'>
                              <Typography variant='body2' color='text.secondary'>
                                End Date:
                              </Typography>
                              <Typography variant='body2'>{new Date(cycle.end_date).toLocaleDateString()}</Typography>
                            </div>
                          )}
                        </div>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </TabPanel>

            {/* Settings Tab */}
            <TabPanel value='settings' className='space-y-4'>
              <Typography variant='h6' className='font-semibold mb-4'>
                Klick Settings
              </Typography>
              <Card variant='outlined' className='p-4'>
                <Typography color='text.secondary'>Settings coming soon...</Typography>
              </Card>
            </TabPanel>
          </CardContent>
        </TabContext>
      </Card>

      {/* Create Cycle Dialog */}
      <Dialog open={createCycleOpen} onClose={() => setCreateCycleOpen(false)} maxWidth='sm' fullWidth>
        <DialogTitle>Create New Cycle</DialogTitle>
        <DialogContent>
          <Grid container spacing={4} className='mt-2'>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                type='number'
                label='Amount per Member'
                placeholder='Enter amount'
                value={cycleForm.amount_per_member}
                onChange={e => setCycleForm({ ...cycleForm, amount_per_member: e.target.value })}
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position='start'>₦</InputAdornment>
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type='date'
                label='Start Date'
                value={cycleForm.start_date}
                onChange={e => setCycleForm({ ...cycleForm, start_date: e.target.value })}
                slotProps={{
                  inputLabel: {
                    shrink: true
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type='date'
                label='End Date'
                value={cycleForm.end_date}
                onChange={e => setCycleForm({ ...cycleForm, end_date: e.target.value })}
                slotProps={{
                  inputLabel: {
                    shrink: true
                  }
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateCycleOpen(false)}>Cancel</Button>
          <Button variant='contained' onClick={handleCreateCycle}>
            Create Cycle
          </Button>
        </DialogActions>
      </Dialog>

      {/* Kick Member Dialog */}
      <Dialog open={kickMemberOpen} onClose={() => setKickMemberOpen(false)}>
        <DialogTitle>Remove Member</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove{' '}
            <strong>
              {selectedMember?.user.first_name} {selectedMember?.user.last_name}
            </strong>{' '}
            from this Klick?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setKickMemberOpen(false)}>Cancel</Button>
          <Button variant='contained' color='error' onClick={handleKickMember}>
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      {/* Make Admin Dialog */}
      <Dialog open={makeAdminOpen} onClose={() => setMakeAdminOpen(false)}>
        <DialogTitle>Make Admin</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to make{' '}
            <strong>
              {selectedMember?.user.first_name} {selectedMember?.user.last_name}
            </strong>{' '}
            an admin of this Klick?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMakeAdminOpen(false)}>Cancel</Button>
          <Button variant='contained' onClick={handleMakeAdmin}>
            Make Admin
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
