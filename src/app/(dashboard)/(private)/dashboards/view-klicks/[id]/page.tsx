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
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'

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
  klick_id: number
  cycle_name: string
  payment_frequency: string
  currency: string
  min_amount: string
  saving_amount: string
  total_slot: number
  product_type: string
  payment_type: string
  invite_ref: string
  expected_start_date: string
  actual_start_date: string | null
  status: string
  preffered_payment_period: string
  account_id: number | null
  announcement: string
  created_at: string
  updated_at: string
  disbursement_structure: string
  fee_type: string
  fee_amount: string
  require_invite: boolean
  expected_end_date: string | null
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
    cycle_name: '',
    product_type: '',
    payment_frequency: 'monthly',
    currency: 'NGN',
    min_amount: '',
    saving_amount: '',
    total_slot: '',
    payment_type: 'fixed',
    expected_start_date: '',
    preffered_payment_period: '',
    invite_ref: '',
    announcement: '',
    disbursement_structure: 'individual'
  })

  // Participant selection state
  type ParticipantSlot = {
    slotNumber: number
    member: MemberType | null
    amount: string
  }
  const [participantSlots, setParticipantSlots] = useState<ParticipantSlot[]>([])
  const [memberSearch, setMemberSearch] = useState('')

  const [inviteEmail, setInviteEmail] = useState('')

  const [toast, setToast] = useState({
    message: '',
    type: ''
  })

  // Initialize slots when total_slot changes
  useEffect(() => {
    const totalSlots = parseInt(cycleForm.total_slot) || 0
    if (totalSlots > 0) {
      const newSlots: ParticipantSlot[] = []
      for (let i = 1; i <= totalSlots; i++) {
        const existingSlot = participantSlots.find(s => s.slotNumber === i)
        newSlots.push(
          existingSlot || {
            slotNumber: i,
            member: null,
            amount: ''
          }
        )
      }
      setParticipantSlots(newSlots)
    } else {
      setParticipantSlots([])
    }
  }, [cycleForm.total_slot])

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

  // Participant slot helpers
  const handleAddParticipantToSlot = (member: MemberType, slotNumber: number) => {
    setParticipantSlots(prev =>
      prev.map(slot =>
        slot.slotNumber === slotNumber
          ? { ...slot, member, amount: cycleForm.saving_amount || '' }
          : slot
      )
    )
  }

  const handleRemoveParticipantFromSlot = (slotNumber: number) => {
    setParticipantSlots(prev =>
      prev.map(slot => (slot.slotNumber === slotNumber ? { ...slot, member: null, amount: '' } : slot))
    )
  }

  const handleUpdateSlotAmount = (slotNumber: number, amount: string) => {
    setParticipantSlots(prev =>
      prev.map(slot => (slot.slotNumber === slotNumber ? { ...slot, amount } : slot))
    )
  }

  const handleSelectMember = (member: MemberType) => {
    // Find first empty slot
    const emptySlot = participantSlots.find(s => !s.member)
    if (emptySlot) {
      handleAddParticipantToSlot(member, emptySlot.slotNumber)
    }
  }

  const isMemberSelected = (memberId: number) => {
    return participantSlots.some(s => s.member?.user.id === memberId)
  }

  // Create Cycle
  const handleCreateCycle = async () => {
    try {
      // Build participants array
      const participants = participantSlots
        .filter(slot => slot.member && slot.amount)
        .map((slot, index) => ({
          user_id: slot.member!.user.id,
          amount: parseFloat(slot.amount),
          slot: 1 // 1 slot per participant as per user requirement
        }))

      // Validate required fields
      if (!cycleForm.cycle_name) {
        setToast({ message: 'Cycle name is required', type: 'error' })
        return
      }
      if (participants.length === 0) {
        setToast({ message: 'Please add at least one participant', type: 'error' })
        return
      }

      const payload = {
        cycle_name: cycleForm.cycle_name,
        payment_frequency: cycleForm.payment_frequency,
        currency: cycleForm.currency,
        min_amount: parseFloat(cycleForm.min_amount) || 0,
        saving_amount: parseFloat(cycleForm.saving_amount) || 0,
        total_slot: parseInt(cycleForm.total_slot),
        product_type: cycleForm.product_type,
        payment_type: cycleForm.payment_type,
        expected_start_date: cycleForm.expected_start_date,
        preffered_payment_period: cycleForm.preffered_payment_period,
        invite_ref: cycleForm.invite_ref,
        announcement: cycleForm.announcement,
        disbursement_structure: cycleForm.disbursement_structure,
        participants
      }

      const res = await api.post(`/klicks/${id}/cycles`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
console.log(res.data)
      setToast({ message: res.data.message || 'Cycle created successfully!', type: 'success' })
      setCreateCycleOpen(false)
      // Reset form
      setCycleForm({
        cycle_name: '',
        product_type: '',
        payment_frequency: 'monthly',
        currency: 'NGN',
        min_amount: '',
        saving_amount: '',
        total_slot: '',
        payment_type: 'fixed',
        expected_start_date: '',
        preffered_payment_period: '',
        invite_ref: '',
        announcement: '',
        disbursement_structure: 'individual'
      })
      setParticipantSlots([])
      setMemberSearch('')

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

  const handleInviteMember = () => {
    if (!inviteEmail) return
    // Mock invite API call
    console.log('Inviting:', inviteEmail)
    setToast({ message: `Invite sent to ${inviteEmail}`, type: 'success' })
    setInviteEmail('')
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
                  value='invite'
                  label='Invite new member'
                  icon={<i className='ri-mail-send-line' />}
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

              {/* Active Cycles Section */}
              {cycles.length > 0 && (
                <div>
                  <div className='flex items-center justify-between mb-4'>
                    <Typography variant='h6' className='font-semibold'>
                      Active Cycles
                    </Typography>
                    <Button
                      variant='text'
                      size='small'
                      onClick={() => setActiveTab('cycles')}
                      endIcon={<i className='ri-arrow-right-line' />}
                    >
                      View All
                    </Button>
                  </div>
                  <Grid container spacing={3} className='mb-6'>
                    {cycles.slice(0, 3).map(cycle => (
                      <Grid size={{ xs: 12, md: 6, lg: 4 }} key={cycle.id}>
                        <Card variant='outlined' className='p-4 hover:shadow-lg transition-shadow'>
                          <div className='flex items-start justify-between mb-3'>
                            <div className='flex-1'>
                              <Typography variant='h6' className='font-bold mb-1'>
                                {cycle.cycle_name}
                              </Typography>
                              <Typography variant='caption' color='text.secondary'>
                                {cycle.product_type}
                              </Typography>
                            </div>
                            <Chip
                              label={cycle.status.replace('_', ' ')}
                              size='small'
                              color={
                                cycle.status === 'active'
                                  ? 'success'
                                  : cycle.status === 'completed'
                                    ? 'primary'
                                    : cycle.status === 'not_started'
                                      ? 'warning'
                                      : 'default'
                              }
                              variant='tonal'
                            />
                          </div>

                          <Divider className='my-3' />

                          <div className='space-y-2 mb-4'>
                            <div className='flex justify-between items-center'>
                              <Typography variant='body2' color='text.secondary'>
                                Saving Amount:
                              </Typography>
                              <Typography className='font-semibold'>
                                {cycle.currency} {parseFloat(cycle.saving_amount).toLocaleString()}
                              </Typography>
                            </div>
                            <div className='flex justify-between items-center'>
                              <Typography variant='body2' color='text.secondary'>
                                Total Slots:
                              </Typography>
                              <Typography className='font-medium'>{cycle.total_slot}</Typography>
                            </div>
                            <div className='flex justify-between items-center'>
                              <Typography variant='body2' color='text.secondary'>
                                Payment:
                              </Typography>
                              <Typography className='font-medium capitalize'>
                                {cycle.payment_frequency}
                              </Typography>
                            </div>
                            {cycle.expected_start_date && (
                              <div className='flex justify-between items-center'>
                                <Typography variant='body2' color='text.secondary'>
                                  Start Date:
                                </Typography>
                                <Typography variant='body2'>
                                  {new Date(cycle.expected_start_date).toLocaleDateString()}
                                </Typography>
                              </div>
                            )}
                          </div>

                          {cycle.announcement && (
                            <Alert severity='info' icon={<i className='ri-information-line' />} className='mb-3'>
                              <Typography variant='caption' className='line-clamp-2'>
                                {cycle.announcement}
                              </Typography>
                            </Alert>
                          )}

                          <Button
                            variant='outlined'
                            fullWidth
                            onClick={() => {
                              router.push(`/dashboards/view-klicks/${id}/cycles/${cycle.id}`)
                            }}
                            endIcon={<i className='ri-arrow-right-line' />}
                          >
                            View Details
                          </Button>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </div>
              )}

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
                    <Grid size={{ xs: 12, md: 6, lg: 4 }} key={cycle.id}>
                      <Card variant='outlined' className='p-4 hover:shadow-lg transition-shadow'>
                        <div className='flex items-start justify-between mb-3'>
                          <div className='flex-1'>
                            <Typography variant='h6' className='font-bold mb-1'>
                              {cycle.cycle_name}
                            </Typography>
                            <Typography variant='caption' color='text.secondary'>
                              {cycle.product_type}
                            </Typography>
                          </div>
                          <Chip
                            label={cycle.status.replace('_', ' ')}
                            size='small'
                            color={
                              cycle.status === 'active'
                                ? 'success'
                                : cycle.status === 'completed'
                                  ? 'primary'
                                  : cycle.status === 'not_started'
                                    ? 'warning'
                                    : 'default'
                            }
                            variant='tonal'
                          />
                        </div>

                        <Divider className='my-3' />

                        <div className='space-y-2 mb-4'>
                          <div className='flex justify-between items-center'>
                            <Typography variant='body2' color='text.secondary'>
                              Saving Amount:
                            </Typography>
                            <Typography className='font-semibold'>
                              {cycle.currency} {parseFloat(cycle.saving_amount).toLocaleString()}
                            </Typography>
                          </div>
                          <div className='flex justify-between items-center'>
                            <Typography variant='body2' color='text.secondary'>
                              Total Slots:
                            </Typography>
                            <Typography className='font-medium'>{cycle.total_slot}</Typography>
                          </div>
                          <div className='flex justify-between items-center'>
                            <Typography variant='body2' color='text.secondary'>
                              Payment:
                            </Typography>
                            <Typography className='font-medium capitalize'>
                              {cycle.payment_frequency}
                            </Typography>
                          </div>
                          {cycle.expected_start_date && (
                            <div className='flex justify-between items-center'>
                              <Typography variant='body2' color='text.secondary'>
                                Start Date:
                              </Typography>
                              <Typography variant='body2'>
                                {new Date(cycle.expected_start_date).toLocaleDateString()}
                              </Typography>
                            </div>
                          )}
                        </div>

                        {cycle.announcement && (
                          <Alert severity='info' icon={<i className='ri-information-line' />} className='mb-3'>
                            <Typography variant='caption' className='line-clamp-2'>
                              {cycle.announcement}
                            </Typography>
                          </Alert>
                        )}

                        <Button
                          variant='outlined'
                          fullWidth
                          onClick={() => {
                            // Navigate to cycle detail page (to be implemented)
                            router.push(`/dashboards/view-klicks/${id}/cycles/${cycle.id}`)
                          }}
                          endIcon={<i className='ri-arrow-right-line' />}
                        >
                          View Details
                        </Button>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </TabPanel>

            {/* Settings Tab */}
            {/* Invite Tab */}
            <TabPanel value='invite' className='space-y-4'>
              <Typography variant='h6' className='font-semibold mb-4'>
                Invite New Member
              </Typography>
              <Card variant='outlined' className='p-6'>
                <Grid container spacing={2} alignItems='center'>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <Typography variant='body1' className='mb-4'>
                      Send an invitation email to add a new member to this Klick.
                    </Typography>
                    <div className='flex gap-3'>
                      <TextField
                        fullWidth
                        type='email'
                        label='Email Address'
                        placeholder='Enter email address'
                        value={inviteEmail}
                        onChange={e => setInviteEmail(e.target.value)}
                        size='small'
                      />
                      <Button
                        variant='contained'
                        onClick={handleInviteMember}
                        startIcon={<i className='ri-send-plane-fill' />}
                        disabled={!inviteEmail}
                        sx={{ minWidth: 120 }}
                      >
                        Invite
                      </Button>
                    </div>
                  </Grid>
                </Grid>
              </Card>
            </TabPanel>
          </CardContent>
        </TabContext>
      </Card>

      {/* Create Cycle Dialog */}
      <Dialog
        open={createCycleOpen}
        onClose={() => setCreateCycleOpen(false)}
        maxWidth='md'
        fullWidth
        PaperProps={{
          sx: { maxHeight: '90vh' }
        }}
      >
        <DialogTitle>
          <Typography variant='h5' className='font-bold'>
            Create New Cycle
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <div className='space-y-6'>
            {/* Basic Details Section */}
            <div>
              <Typography variant='h6' className='font-semibold mb-4'>
                Basic Details
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label='Cycle Name'
                    placeholder='e.g., July Thrift'
                    value={cycleForm.cycle_name}
                    onChange={e => setCycleForm({ ...cycleForm, cycle_name: e.target.value })}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label='Product Type'
                    placeholder='e.g., thrift'
                    value={cycleForm.product_type}
                    onChange={e => setCycleForm({ ...cycleForm, product_type: e.target.value })}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Payment Frequency</InputLabel>
                    <Select
                      value={cycleForm.payment_frequency}
                      label='Payment Frequency'
                      onChange={e => setCycleForm({ ...cycleForm, payment_frequency: e.target.value })}
                    >
                      <MenuItem value='daily'>Daily</MenuItem>
                      <MenuItem value='weekly'>Weekly</MenuItem>
                      <MenuItem value='monthly'>Monthly</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type='number'
                    label='Total Slots'
                    placeholder='Enter number of slots'
                    value={cycleForm.total_slot}
                    onChange={e => setCycleForm({ ...cycleForm, total_slot: e.target.value })}
                    inputProps={{ min: 1 }}
                  />
                </Grid>
              </Grid>
            </div>

            {/* Participant Selection Section - Shows when total_slot > 0 */}
            {participantSlots.length > 0 && (
              <div>
                <Divider className='my-4' />
                <Typography variant='h6' className='font-semibold mb-4'>
                  Select Participants ({participantSlots.filter(s => s.member).length}/{participantSlots.length})
                </Typography>

                {/* Member List */}
                <div>
                  <TextField
                    fullWidth
                    size='small'
                    placeholder='Search members...'
                    value={memberSearch}
                    onChange={e => setMemberSearch(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <i className='ri-search-line' />
                        </InputAdornment>
                      )
                    }}
                    className='mb-3'
                  />
                  <Card variant='outlined' sx={{ maxHeight: 300, overflow: 'auto' }}>
                    <List className='p-0'>
                      {members
                        .filter(
                          member =>
                            !memberSearch ||
                            `${member.user.first_name} ${member.user.last_name} ${member.user.email}`
                              .toLowerCase()
                              .includes(memberSearch.toLowerCase())
                        )
                        .map((member, index) => (
                          <div key={member.id}>
                            <ListItem
                              className='py-2'
                              secondaryAction={
                                <Button
                                  size='small'
                                  variant={isMemberSelected(member.user.id) ? 'outlined' : 'contained'}
                                  disabled={
                                    isMemberSelected(member.user.id) ||
                                    !participantSlots.some(s => !s.member)
                                  }
                                  onClick={() => handleSelectMember(member)}
                                  startIcon={
                                    isMemberSelected(member.user.id) ? (
                                      <i className='ri-check-line' />
                                    ) : (
                                      <i className='ri-add-line' />
                                    )
                                  }
                                >
                                  {isMemberSelected(member.user.id) ? 'Added' : 'Add'}
                                </Button>
                              }
                            >
                              <ListItemAvatar>
                                <CustomAvatar skin='light' size={40}>
                                  {getInitials(`${member.user.first_name} ${member.user.last_name}`)}
                                </CustomAvatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={`${member.user.first_name} ${member.user.last_name}`}
                                secondary={member.user.email}
                              />
                            </ListItem>
                            {index < members.length - 1 && <Divider />}
                          </div>
                        ))}
                    </List>
                  </Card>
                </div>
                {/* Slots Grid */}
                <div className='mb-4'>
                  <Typography variant='body2' color='text.secondary' className='mb-3'>
                    Participant Slots
                  </Typography>
                  <Grid container spacing={2}>
                    {participantSlots.map(slot => (
                      <Grid size={{ xs: 12, sm: 6 }} key={slot.slotNumber}>
                        <Card
                          variant='outlined'
                          className='p-3'
                          sx={{
                            borderColor: slot.member ? 'primary.main' : 'divider',
                            bgcolor: slot.member ? 'action.hover' : 'transparent'
                          }}
                        >
                          <div className='flex items-center justify-between mb-2'>
                            <Typography variant='caption' color='text.secondary' className='font-medium'>
                              Slot {slot.slotNumber}
                            </Typography>
                            {slot.member && (
                              <IconButton
                                size='small'
                                onClick={() => handleRemoveParticipantFromSlot(slot.slotNumber)}
                                color='error'
                              >
                                <i className='ri-close-line' />
                              </IconButton>
                            )}
                          </div>
                          {slot.member ? (
                            <div>
                              <div className='flex items-center gap-2 mb-2'>
                                <CustomAvatar skin='light' size={32}>
                                  {getInitials(`${slot.member.user.first_name} ${slot.member.user.last_name}`)}
                                </CustomAvatar>
                                <div className='flex-1 min-w-0'>
                                  <Typography variant='body2' className='font-medium truncate'>
                                    {slot.member.user.first_name} {slot.member.user.last_name}
                                  </Typography>
                                  <Typography variant='caption' color='text.secondary' className='truncate block'>
                                    {slot.member.user.email}
                                  </Typography>
                                </div>
                              </div>
                              <TextField
                                fullWidth
                                size='small'
                                type='number'
                                label='Amount'
                                value={slot.amount}
                                onChange={e => handleUpdateSlotAmount(slot.slotNumber, e.target.value)}
                                InputProps={{
                                  startAdornment: <InputAdornment position='start'>₦</InputAdornment>
                                }}
                              />
                            </div>
                          ) : (
                            <Typography variant='body2' color='text.secondary' className='text-center py-3'>
                              Empty Slot
                            </Typography>
                          )}
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </div>

              </div>
            )}

            {/* Additional Details Section */}
            <div>
              <Divider className='my-4' />
              <Typography variant='h6' className='font-semibold mb-4'>
                Additional Details
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Currency</InputLabel>
                    <Select
                      value={cycleForm.currency}
                      label='Currency'
                      onChange={e => setCycleForm({ ...cycleForm, currency: e.target.value })}
                    >
                      <MenuItem value='NGN'>NGN (₦)</MenuItem>
                      <MenuItem value='USD'>USD ($)</MenuItem>
                      <MenuItem value='GBP'>GBP (£)</MenuItem>
                      <MenuItem value='EUR'>EUR (€)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type='number'
                    label='Minimum Amount'
                    value={cycleForm.min_amount}
                    onChange={e => setCycleForm({ ...cycleForm, min_amount: e.target.value })}
                    InputProps={{
                      startAdornment: <InputAdornment position='start'>₦</InputAdornment>
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type='number'
                    label='Saving Amount'
                    value={cycleForm.saving_amount}
                    onChange={e => setCycleForm({ ...cycleForm, saving_amount: e.target.value })}
                    InputProps={{
                      startAdornment: <InputAdornment position='start'>₦</InputAdornment>
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Payment Type</InputLabel>
                    <Select
                      value={cycleForm.payment_type}
                      label='Payment Type'
                      onChange={e => setCycleForm({ ...cycleForm, payment_type: e.target.value })}
                    >
                      <MenuItem value='fixed'>Fixed</MenuItem>
                      <MenuItem value='flexible'>Flexible</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type='date'
                    label='Expected Start Date'
                    value={cycleForm.expected_start_date}
                    onChange={e => setCycleForm({ ...cycleForm, expected_start_date: e.target.value })}
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
                    label='Preferred Payment Period'
                    placeholder='e.g., Usually 27th - 31st'
                    value={cycleForm.preffered_payment_period}
                    onChange={e => setCycleForm({ ...cycleForm, preffered_payment_period: e.target.value })}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label='Invite Reference'
                    placeholder='e.g., abc123'
                    value={cycleForm.invite_ref}
                    onChange={e => setCycleForm({ ...cycleForm, invite_ref: e.target.value })}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Disbursement Structure</InputLabel>
                    <Select
                      value={cycleForm.disbursement_structure}
                      label='Disbursement Structure'
                      onChange={e => setCycleForm({ ...cycleForm, disbursement_structure: e.target.value })}
                    >
                      <MenuItem value='individual'>Individual</MenuItem>
                      <MenuItem value='group'>Group</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label='Announcement'
                    placeholder='Add any announcement for this cycle...'
                    value={cycleForm.announcement}
                    onChange={e => setCycleForm({ ...cycleForm, announcement: e.target.value })}
                  />
                </Grid>
              </Grid>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateCycleOpen(false)}>Cancel</Button>
          <Button variant='contained' onClick={handleCreateCycle} size='large'>
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
