'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import type { SyntheticEvent } from 'react'

// Components
import NetworkInstance from '@/components/NetworkInstance'
import { useAuth } from '@/components/AuthContext'
import Toast from '@/components/Toast'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import CustomTabList from '@core/components/mui/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Grid from '@mui/material/Grid2'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import LoadingButton from '@mui/lab/LoadingButton'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import CustomAvatar from '@core/components/mui/Avatar'
import { getInitials } from '@/utils/getInitials'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'

// Icons
import Icon from '@mui/material/Icon' // Fallback if specific icons needed, but using class names mostly

type ScheduleType = {
    id: number
    klick_id: number
    cycle_id: number
    slot: number
    completed: boolean
    expected_amount: string
    created_at: string
    updated_at: string
    period_start: string
    period_end: string
    is_active: boolean
}

type UserType = {
    id: number
    first_name: string
    last_name: string
    email: string
    phone?: string
    plan?: string
    [key: string]: any
}

type InvoiceType = {
    id: number
    schedule_id: number
    user_id: number
    account_id: number | null
    amount: string
    file_evidence: string | null
    status: string
    recipient_id: number
    approved_by: number
    created_at: string
    updated_at: string
    user: UserType
    recipient: UserType
}

type RecipientType = {
    cycle_user: {
        id: number
        user_id: number
        klick_id: number
        type: string
        amount: string
        status: string
        approved_by: number | null
        slot: number
        account_id: number | null
        preffered_payment_start: string | null
        preffered_payment_end: string | null
        created_at: string
        updated_at: string
        cycle_id: number
        schedule_id: number
        user: UserType
    }
    user: UserType
    account: any | null
}

type ScheduleInvoiceData = {
    schedule: ScheduleType
    invoices: InvoiceType[]
    recipients: RecipientType[]
}

type KlickType = {
    id: number
    name: string
    [key: string]: any
}

type CycleType = {
    id: number
    cycle_name: string
    announcement?: string
    [key: string]: any
}

type ParticipantType = {
    id: number
    user_id: number
    klick_id: number
    type: string
    amount: string
    status: string
    approved_by: number | null
    slot: number
    account_id: number | null
    preffered_payment_start: string | null
    preffered_payment_end: string | null
    created_at: string
    updated_at: string
    cycle_id: number
    schedule_id: number
    first_name: string
    last_name: string
    user_email: string
}

export default function ViewCyclePage() {
    const params = useParams()
    const router = useRouter()
    // ID is klick id, cycleId is cycle id
    const { id, cycleId } = params as { id: string; cycleId: string }
    const { token, user } = useAuth()
    const api = NetworkInstance()

    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('description') // Default to schedule as requested
    const [schedules, setSchedules] = useState<ScheduleType[]>([])
    const [klick, setKlick] = useState<KlickType | null>(null)
    const [cycle, setCycle] = useState<CycleType | null>(null)

    // Invoice data for each schedule
    const [scheduleInvoices, setScheduleInvoices] = useState<Record<number, ScheduleInvoiceData>>({})
    const [loadingInvoices, setLoadingInvoices] = useState<Record<number, boolean>>({})

    // Participants State
    const [participants, setParticipants] = useState<ParticipantType[]>([])
    const [loadingParticipants, setLoadingParticipants] = useState(false)
    const [deletingParticipantId, setDeletingParticipantId] = useState<number | null>(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedParticipant, setSelectedParticipant] = useState<ParticipantType | null>(null)

    // File Upload State
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)

    // Confirm Payment Dialog State
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
    const [selectedInvoice, setSelectedInvoice] = useState<InvoiceType | null>(null)
    const [confirming, setConfirming] = useState(false)

    const [toast, setToast] = useState({
        message: '',
        type: ''
    })

    // Edit Cycle Announcement State
    const [editCycleAnnouncementOpen, setEditCycleAnnouncementOpen] = useState(false)
    const [cycleAnnouncementText, setCycleAnnouncementText] = useState('')
    const [isUpdatingCycleAnnouncement, setIsUpdatingCycleAnnouncement] = useState(false)

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            if (!token || !id || !cycleId) return

            try {
                setLoading(true)

                // 1. Fetch Klick Details (to get name)
                const klickRes = await api.get(`/klicks/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setKlick(klickRes.data.data)

                // 2. Fetch Cycle Details (We might need to look it up from list or specific endpoint if exists)
                // Trying generic cycles list and finding it, or specific endpoint if standard REST
                // User didn't give specific GET /cycles/ID endpoint, but gave /cycles/ID/schedules. 
                // We'll try to find it in the klick's cycles list for now to get the name.
                const cyclesRes = await api.get(`/klicks/${id}/cycles`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                const foundCycle = cyclesRes.data.data?.find((c: any) => c.id === parseInt(cycleId))
                if (foundCycle) {
                    setCycle(foundCycle)
                } else {
                    // Fallback if not in list
                    setCycle({ id: parseInt(cycleId), cycle_name: `Cycle ${cycleId}` })
                }

                // 3. Fetch Schedules
                const schedulesRes = await api.get(`/cycles/${cycleId}/schedules`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setSchedules(schedulesRes.data.data || [])

            } catch (error: any) {
                console.error('Error fetching data:', error)
                setToast({
                    message: error?.response?.data?.message || 'Failed to load cycle details',
                    type: 'error'
                })
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [id, cycleId, token])

    // Fetch Participants
    useEffect(() => {
        const fetchParticipants = async () => {
            if (!token || !cycleId) return

            try {
                setLoadingParticipants(true)
                const res = await api.get(`/cycles/${cycleId}/participants`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setParticipants(res.data.data || [])
            } catch (error: any) {
                console.error('Error fetching participants:', error)
                setToast({
                    message: error?.response?.data?.message || 'Failed to load participants',
                    type: 'error'
                })
            } finally {
                setLoadingParticipants(false)
            }
        }

        fetchParticipants()
    }, [cycleId, token])

    const handleTabChange = (event: SyntheticEvent, newValue: string) => {
        setActiveTab(newValue)
    }

    // Fetch invoices for a specific schedule
    const fetchScheduleInvoices = async (scheduleId: number) => {
        if (!token || !cycleId || scheduleInvoices[scheduleId]) return // Already loaded

        try {
            setLoadingInvoices(prev => ({ ...prev, [scheduleId]: true }))
            const res = await api.get(`/cycles/${cycleId}/schedules/${scheduleId}/invoices`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setScheduleInvoices(prev => ({
                ...prev,
                [scheduleId]: res.data.data
            }))
        } catch (error: any) {
            console.error('Error fetching invoices:', error)
            setToast({
                message: error?.response?.data?.message || 'Failed to load invoice data',
                type: 'error'
            })
        } finally {
            setLoadingInvoices(prev => ({ ...prev, [scheduleId]: false }))
        }
    }

    // Check if current user is a recipient for a schedule
    const isUserRecipient = (scheduleId: number): boolean => {
        const invoiceData = scheduleInvoices[scheduleId]
        if (!invoiceData || !user?.email) return false

        return invoiceData.recipients.some(
            recipient => recipient.user.email === user.email
        )
    }

    // Check if current user is a payer for a schedule
    const isUserPayer = (scheduleId: number): boolean => {
        const invoiceData = scheduleInvoices[scheduleId]
        if (!invoiceData || !user?.email) return false

        return invoiceData.invoices.some(
            invoice => invoice.user.email === user.email
        )
    }

    // Get user's invoice for a schedule (if they are a payer)
    const getUserInvoice = (scheduleId: number): InvoiceType | null => {
        const invoiceData = scheduleInvoices[scheduleId]
        if (!invoiceData || !user?.email) return null

        return invoiceData.invoices.find(
            invoice => invoice.user.email === user.email
        ) || null
    }

    // Get recipients for a schedule
    const getScheduleRecipients = (scheduleId: number): RecipientType[] => {
        const invoiceData = scheduleInvoices[scheduleId]
        return invoiceData?.recipients || []
    }

    // Handle accordion expansion - fetch invoices when expanded
    const handleAccordionChange = (scheduleId: number, expanded: boolean) => {
        if (expanded) {
            fetchScheduleInvoices(scheduleId)
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0])
        }
    }

    const handleUploadEvidence = async (scheduleId: number) => {
        if (!file) {
            setToast({ message: 'Please select a file first', type: 'error' })
            return
        }

        const userInvoice = getUserInvoice(scheduleId)
        if (!userInvoice) {
            setToast({ message: 'Invoice not found', type: 'error' })
            return
        }

        try {
            setUploading(true)
            const formData = new FormData()
            formData.append('file', file)

            const res = await api.post(`/invoices/${userInvoice.id}/evidence`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })

            setToast({ message: res.data.message || 'Evidence uploaded successfully', type: 'success' })
            setFile(null)
            // Refresh invoice data
            await fetchScheduleInvoices(scheduleId)
        } catch (error: any) {
            console.error('Upload error:', error)
            setToast({
                message: error?.response?.data?.message || 'Failed to upload evidence',
                type: 'error'
            })
        } finally {
            setUploading(false)
        }
    }

    // Handle confirm payment
    const handleConfirmPayment = async () => {
        if (!selectedInvoice) return

        try {
            setConfirming(true)
            const res = await api.post(`/invoices/${selectedInvoice.id}/confirm`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            })

            setToast({ message: res.data.message || 'Payment confirmed successfully', type: 'success' })
            setConfirmDialogOpen(false)
            setSelectedInvoice(null)

            // Refresh invoice data
            if (selectedInvoice.schedule_id) {
                await fetchScheduleInvoices(selectedInvoice.schedule_id)
            }
        } catch (error: any) {
            console.error('Confirm payment error:', error)
            setToast({
                message: error?.response?.data?.message || 'Failed to confirm payment',
                type: 'error'
            })
        } finally {
            router.refresh()
            setConfirming(false)
        }
    }

    // Open confirm payment dialog
    const openConfirmDialog = (invoice: InvoiceType) => {
        setSelectedInvoice(invoice)
        setConfirmDialogOpen(true)
    }

    // Handle delete participant
    const handleDeleteParticipant = async () => {
        if (!selectedParticipant) return

        try {
            setDeletingParticipantId(selectedParticipant.id)
            const res = await api.delete(`/cycles/${cycleId}/participants/${selectedParticipant.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })

            setToast({ message: res.data.message || 'Participant removed successfully', type: 'success' })
            setDeleteDialogOpen(false)
            setSelectedParticipant(null)

            // Refresh participants
            const participantsRes = await api.get(`/cycles/${cycleId}/participants`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setParticipants(participantsRes.data.data || [])
        } catch (error: any) {
            console.error('Error deleting participant:', error)
            setToast({
                message: error?.response?.data?.message || 'Failed to remove participant',
                type: 'error'
            })
        } finally {
            setDeletingParticipantId(null)
        }
    }

    // Open delete participant dialog
    const openDeleteDialog = (participant: ParticipantType) => {
        setSelectedParticipant(participant)
        setDeleteDialogOpen(true)
    }

    // Edit Cycle Announcement Handlers
    const handleOpenEditCycleAnnouncement = () => {
        setCycleAnnouncementText(cycle?.announcement || '')
        setEditCycleAnnouncementOpen(true)
    }

    const handleUpdateCycleAnnouncement = async () => {
        setIsUpdatingCycleAnnouncement(true)
        try {
            const res = await api.patch(`/cycles/${cycleId}/announcement`, {
                announcement: cycleAnnouncementText
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setToast({ message: res.data.message || 'Announcement updated successfully', type: 'success' })
            setCycle((prev: any) => ({ ...prev, announcement: cycleAnnouncementText }))
            setEditCycleAnnouncementOpen(false)
        } catch (error: any) {
            setToast({
                message: error?.response?.data?.message || 'Failed to update announcement',
                type: 'error'
            })
        } finally {
            setIsUpdatingCycleAnnouncement(false)
        }
    }

    // Active Schedule Helpers
    const activeSchedule = schedules.find(s => s.is_active)
    const isActiveScheduleRecipient = activeSchedule ? isUserRecipient(activeSchedule.id) : false
    const isActiveSchedulePayer = activeSchedule ? isUserPayer(activeSchedule.id) : false
    const activeScheduleRecipients = activeSchedule ? getScheduleRecipients(activeSchedule.id) : []

    // Fetch invoices for active schedule on mount
    useEffect(() => {
        const active = schedules.find(s => s.is_active)
        if (active && token && cycleId && !scheduleInvoices[active.id]) {
            fetchScheduleInvoices(active.id)
        }
    }, [schedules, token, cycleId])

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
            <Card>
                <CardContent className='p-6'>
                    <div className='flex items-center gap-2 mb-2'>
                        <Button
                            startIcon={<i className="ri-arrow-left-line" />}
                            onClick={() => router.back()}
                            variant="text"
                            color="inherit"
                        >
                            Back to Cycle List
                        </Button>
                    </div>
                    <Typography variant='h4' className='font-bold mb-1'>
                        {klick?.name || 'Klick Details'}
                    </Typography>
                    <Typography variant='h6' color='text.secondary'>
                        {cycle?.cycle_name || `Cycle #${cycleId}`}
                    </Typography>
                </CardContent>
            </Card>

            {/* Tabs & Content */}
            <Card>
                <TabContext value={activeTab}>
                    <div className='border-b'>
                        <CustomTabList onChange={handleTabChange} variant='scrollable' scrollButtons='auto'>
                            <Tab value='description' label='Description' icon={<i className='ri-file-text-line' />} iconPosition='start' />
                            <Tab value='participants' label='Participants' icon={<i className='ri-group-line' />} iconPosition='start' />

                            <Tab value='schedule' label='Schedule' icon={<i className='ri-calendar-line' />} iconPosition='start' />
                        </CustomTabList>
                    </div>

                    <CardContent>
                        <TabPanel value='participants' className='p-0'>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Typography variant="h6" className="font-semibold">
                                        Participants ({participants.length})
                                    </Typography>
                                </div>

                                {loadingParticipants ? (
                                    <Box className="flex justify-center py-8">
                                        <CircularProgress />
                                    </Box>
                                ) : participants.length === 0 ? (
                                    <Card variant="outlined" className="p-8 text-center">
                                        <i className="ri-group-line text-5xl text-textSecondary mb-4" />
                                        <Typography variant="h6" color="text.secondary" className="mb-2">
                                            No participants yet
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Participants will appear here once they join the cycle.
                                        </Typography>
                                    </Card>
                                ) : (
                                    <Grid container spacing={3}>
                                        {participants.map((participant) => (
                                            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={participant.id}>
                                                <Card
                                                    variant="outlined"
                                                    className="p-4 hover:shadow-lg transition-all duration-200 relative group overflow-hidden"
                                                    sx={{
                                                        '&:hover': {
                                                            borderColor: 'primary.main',
                                                            borderWidth: 2,
                                                            '& .card-content': {
                                                                filter: 'blur(4px)',
                                                                opacity: 0.7
                                                            },
                                                            '& .delete-button': {
                                                                opacity: 1,
                                                                pointerEvents: 'auto'
                                                            }
                                                        }
                                                    }}
                                                >
                                                    {/* Card Content */}
                                                    <Box className="card-content transition-all duration-200">
                                                        <Box className="flex items-start justify-between mb-3">
                                                            <CustomAvatar
                                                                skin="light"
                                                                color="primary"
                                                                size={48}
                                                                className="mb-2"
                                                            >
                                                                {getInitials(`${participant.first_name} ${participant.last_name}`)}
                                                            </CustomAvatar>
                                                            <Chip
                                                                label={`Slot ${participant.slot}`}
                                                                size="small"
                                                                color="info"
                                                                variant="outlined"
                                                            />
                                                        </Box>

                                                        <Typography variant="h6" className="font-semibold mb-1">
                                                            {participant.first_name} {participant.last_name}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" className="mb-3">
                                                            {participant.user_email}
                                                        </Typography>

                                                        <Divider className="my-3" />

                                                        <Box className="space-y-2">
                                                            <div className="flex justify-between items-center">
                                                                <Typography variant="caption" color="text.secondary">
                                                                    Amount:
                                                                </Typography>
                                                                <Typography variant="body2" className="font-semibold">
                                                                    {participant.amount}
                                                                </Typography>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <Typography variant="caption" color="text.secondary">
                                                                    Status:
                                                                </Typography>
                                                                <Chip
                                                                    label={participant.status}
                                                                    size="small"
                                                                    color={
                                                                        participant.status === 'approved'
                                                                            ? 'success'
                                                                            : participant.status === 'pending'
                                                                                ? 'warning'
                                                                                : 'default'
                                                                    }
                                                                    variant="outlined"
                                                                />
                                                            </div>
                                                            {participant.account_id && (
                                                                <div className="flex justify-between items-center">
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        Account:
                                                                    </Typography>
                                                                    <Typography variant="caption" className="font-medium">
                                                                        {participant.account_id}
                                                                    </Typography>
                                                                </div>
                                                            )}
                                                        </Box>
                                                    </Box>

                                                    {/* Delete Button - Shows on Hover */}
                                                    <Box
                                                        className="delete-button"
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            right: 0,
                                                            bottom: 0,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            zIndex: 10,
                                                            opacity: 0,
                                                            transition: 'opacity 0.2s ease-in-out',
                                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                            backdropFilter: 'blur(4px)',
                                                            borderRadius: '4px',
                                                            pointerEvents: 'none'
                                                        }}
                                                    >
                                                        <Button
                                                            variant="contained"
                                                            size="medium"
                                                            onClick={() => openDeleteDialog(participant)}
                                                            startIcon={<i className="ri-delete-bin-line" />}
                                                            sx={{
                                                                backgroundColor: '#d32f2f',
                                                                color: '#ffffff',
                                                                fontWeight: 600,
                                                                textTransform: 'none',
                                                                boxShadow: '0 2px 8px rgba(211, 47, 47, 0.3)',
                                                                pointerEvents: 'auto',
                                                                '&:hover': {
                                                                    backgroundColor: '#b71c1c',
                                                                    color: '#ffffff',
                                                                    boxShadow: '0 4px 12px rgba(211, 47, 47, 0.4)'
                                                                },
                                                                '& .MuiSvgIcon-root': {
                                                                    color: '#ffffff'
                                                                }
                                                            }}
                                                        >
                                                            Delete Participant
                                                        </Button>
                                                    </Box>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                )}
                            </div>
                        </TabPanel>

                        <TabPanel value='description' className='p-0'>
                            <div className="space-y-4">
                                <Typography variant="h6" className="font-semibold">
                                    Cycle Description
                                </Typography>
                                {cycle?.announcement ? (
                                    <Alert
                                        severity='info'
                                        icon={<i className='ri-megaphone-line' />}
                                        action={
                                            <IconButton
                                                size='small'
                                                color='inherit'
                                                onClick={handleOpenEditCycleAnnouncement}
                                                title='Edit Announcement'
                                            >
                                                <i className='ri-edit-line' />
                                            </IconButton>
                                        }
                                    >
                                        <AlertTitle className='font-semibold'>Announcement</AlertTitle>
                                        <Typography variant="body2" className="whitespace-pre-wrap">
                                            {cycle.announcement}
                                        </Typography>
                                    </Alert>
                                ) : (
                                    <Alert
                                        severity='info'
                                        icon={<i className='ri-information-line' />}
                                        action={
                                            <IconButton
                                                size='small'
                                                color='inherit'
                                                onClick={handleOpenEditCycleAnnouncement}
                                                title='Edit Announcement'
                                            >
                                                <i className='ri-edit-line' />
                                            </IconButton>
                                        }
                                    >
                                        <AlertTitle className='font-semibold'>No Announcement</AlertTitle>
                                        This cycle doesn't have a description or announcement yet. Click edit to add one.
                                    </Alert>
                                )}

                                {/* Active Schedule Action Section - Moved from Schedule Tab */}
                                {activeSchedule && (
                                    <Card variant="outlined" className='mb-6 bg-primary-50 border-primary'>
                                        <CardHeader
                                            title="Current Active Schedule"
                                            subheader={`Slot ${activeSchedule.slot} • ${new Date(activeSchedule.period_start).toLocaleDateString()} - ${new Date(activeSchedule.period_end).toLocaleDateString()}`}
                                            avatar={<i className="ri-timer-flash-line text-2xl text-primary" />}
                                        />
                                        <CardContent>
                                            <Grid container spacing={4}>
                                                <Grid size={{ xs: 12, md: 8 }}>
                                                    <Typography variant="body1" className='mb-2'>
                                                        <strong>Expected Amount:</strong> {activeSchedule.expected_amount}
                                                    </Typography>

                                                    {/* Show Recipient Info */}
                                                    {activeScheduleRecipients.length > 0 && (
                                                        <Box className="mt-4 mb-4">
                                                            <Typography variant="body2" className="font-semibold mb-2">
                                                                Recipient{activeScheduleRecipients.length > 1 ? 's' : ''}:
                                                            </Typography>
                                                            <div className="flex flex-wrap gap-3 mb-3">
                                                                {activeScheduleRecipients.map((recipient, idx) => (
                                                                    <Chip
                                                                        key={idx}
                                                                        avatar={
                                                                            <CustomAvatar skin="light" color="primary" size={24}>
                                                                                {getInitials(`${recipient.user.first_name} ${recipient.user.last_name}`)}
                                                                            </CustomAvatar>
                                                                        }
                                                                        label={`${recipient.user.first_name} ${recipient.user.last_name}`}
                                                                        variant="outlined"
                                                                        size="small"
                                                                    />
                                                                ))}
                                                            </div>
                                                            {activeScheduleRecipients.map((recipient, idx) => (
                                                                <Box key={idx} className="mb-2 p-2 bg-gray-50 rounded">
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        Account:
                                                                    </Typography>
                                                                    <Typography variant="body2" className="font-medium">
                                                                        {recipient.account ? JSON.stringify(recipient.account) : 'Not set'}
                                                                    </Typography>
                                                                </Box>
                                                            ))}
                                                        </Box>
                                                    )}

                                                    {/* Show different message based on user role */}
                                                    {isActiveScheduleRecipient && (
                                                        <Alert severity="info" className="mt-3">
                                                            <AlertTitle>You are the recipient</AlertTitle>
                                                            Please confirm when you receive payments from contributors.
                                                        </Alert>
                                                    )}
                                                    {isActiveSchedulePayer && !isActiveScheduleRecipient && (
                                                        <Typography variant="body2" color="text.secondary" className="mt-2">
                                                            Please upload your payment evidence for this period to verify your contribution.
                                                        </Typography>
                                                    )}
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 4 }}>
                                                    {isActiveScheduleRecipient ? (
                                                        // Show Confirm Payment section for recipients
                                                        <Box className="flex flex-col gap-3">
                                                            {(() => {
                                                                const allUnpaidInvoices = scheduleInvoices[activeSchedule.id]?.invoices
                                                                    .filter(inv => inv.status === 'not_paid') || []
                                                                const unpaidInvoicesForUser = allUnpaidInvoices
                                                                    .filter(inv => inv.recipient.email === user?.email) || []

                                                                if (unpaidInvoicesForUser.length === 0) {
                                                                    return (
                                                                        <Alert severity="success">
                                                                            All your payments confirmed
                                                                        </Alert>
                                                                    )
                                                                }

                                                                return (
                                                                    <Box className="space-y-3">
                                                                        {unpaidInvoicesForUser.length > 0 && allUnpaidInvoices.length > unpaidInvoicesForUser.length && (
                                                                            <Alert severity="info">
                                                                                <Typography variant="caption">
                                                                                    You can only confirm payments where you are the recipient.
                                                                                    {allUnpaidInvoices.length - unpaidInvoicesForUser.length} other payment{allUnpaidInvoices.length - unpaidInvoicesForUser.length > 1 ? 's' : ''} {allUnpaidInvoices.length - unpaidInvoicesForUser.length > 1 ? 'are' : 'is'} pending for other recipients.
                                                                                </Typography>
                                                                            </Alert>
                                                                        )}
                                                                        {unpaidInvoicesForUser.map((invoice) => (
                                                                            <Card key={invoice.id} variant="outlined" className="p-3">
                                                                                <Box className="space-y-2">
                                                                                    <Typography variant="body2" className="font-semibold">
                                                                                        Payment from {invoice.user.first_name} {invoice.user.last_name}
                                                                                    </Typography>
                                                                                    <Typography variant="h6" className="font-bold text-primary">
                                                                                        {invoice.amount}
                                                                                    </Typography>
                                                                                    <Divider />
                                                                                    <LoadingButton
                                                                                        variant="contained"
                                                                                        color="success"
                                                                                        fullWidth
                                                                                        size="small"
                                                                                        onClick={() => openConfirmDialog(invoice)}
                                                                                        startIcon={<i className="ri-check-line" />}
                                                                                    >
                                                                                        Mark as Paid
                                                                                    </LoadingButton>
                                                                                </Box>
                                                                            </Card>
                                                                        ))}
                                                                    </Box>
                                                                )
                                                            })()}
                                                        </Box>
                                                    ) : isActiveSchedulePayer ? (
                                                        // Show Upload Evidence for payers
                                                        <div className="flex flex-col gap-3">
                                                            <input
                                                                accept="application/pdf,image/*"
                                                                style={{ display: 'none' }}
                                                                id="raised-button-file"
                                                                mask-type="String"
                                                                type="file"
                                                                onChange={handleFileChange}
                                                            />
                                                            <label htmlFor="raised-button-file">
                                                                <Button variant="outlined" component="span" fullWidth startIcon={<i className="ri-upload-2-line" />}>
                                                                    {file ? file.name : 'Select Evidence (PDF/Image)'}
                                                                </Button>
                                                            </label>
                                                            <LoadingButton
                                                                loading={uploading}
                                                                variant="contained"
                                                                color="primary"
                                                                fullWidth
                                                                onClick={() => handleUploadEvidence(activeSchedule.id)}
                                                                disabled={!file}
                                                            >
                                                                Upload Evidence
                                                            </LoadingButton>
                                                        </div>
                                                    ) : (
                                                        <Alert severity="info" >
                                                            You are not involved in this schedule
                                                        </Alert>
                                                    )}
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </TabPanel>

                        <TabPanel value='schedule' className='space-y-6 p-0'>

                            <TabPanel value='schedule' className='space-y-6 p-0'>

                                {/* Schedule List */}
                                <Typography variant="h6" className="mb-4 mt-4">All Schedules</Typography>

                                {schedules.length === 0 ? (
                                    <Typography color="text.secondary">No schedules found for this cycle.</Typography>
                                ) : (
                                    schedules.map((schedule) => {
                                        const recipients = getScheduleRecipients(schedule.id)
                                        const invoiceData = scheduleInvoices[schedule.id]
                                        const isLoading = loadingInvoices[schedule.id]

                                        return (
                                            <Accordion
                                                key={schedule.id}
                                                defaultExpanded={false}
                                                onChange={(_, expanded) => handleAccordionChange(schedule.id, expanded)}
                                            >
                                                <AccordionSummary expandIcon={<i className="ri-arrow-down-s-line" />}>
                                                    <div className="flex items-center gap-4 w-full mr-4">
                                                        <Typography className="font-semibold min-w-[80px]">
                                                            Slot {schedule.slot}
                                                        </Typography>
                                                        <div className="flex-1 flex flex-wrap gap-2 text-sm text-gray-600">
                                                            <span>{new Date(schedule.period_start).toLocaleDateString()}</span>
                                                            <span>-</span>
                                                            <span>{new Date(schedule.period_end).toLocaleDateString()}</span>
                                                        </div>
                                                        {recipients.length > 0 && (
                                                            <Chip
                                                                label={`Recipient: ${recipients[0].user.first_name} ${recipients[0].user.last_name}${recipients.length > 1 ? ` +${recipients.length - 1}` : ''}`}
                                                                size="small"
                                                                variant="outlined"
                                                                color="info"
                                                            />
                                                        )}
                                                        <Chip
                                                            label={schedule.is_active ? 'Active' : schedule.completed ? 'Completed' : 'Pending'}
                                                            color={schedule.is_active ? 'success' : schedule.completed ? 'default' : 'default'}
                                                            size="small"
                                                            variant={schedule.is_active ? 'filled' : 'outlined'}
                                                        />
                                                    </div>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    {isLoading ? (
                                                        <Box className="flex justify-center py-4">
                                                            <CircularProgress size={24} />
                                                        </Box>
                                                    ) : (
                                                        <Grid container spacing={3}>
                                                            <Grid size={{ xs: 12 }}>
                                                                <Divider className="mb-3" />
                                                            </Grid>
                                                            <Grid size={{ xs: 6, sm: 3 }}>
                                                                <Typography variant="caption" color="text.secondary">Expected Amount</Typography>
                                                                <Typography variant="body2" className="font-medium">{schedule.expected_amount}</Typography>
                                                            </Grid>
                                                            <Grid size={{ xs: 6, sm: 3 }}>
                                                                <Typography variant="caption" color="text.secondary">Status</Typography>
                                                                <Typography variant="body2" className="font-medium">
                                                                    {schedule.completed ? 'Completed' : 'Incomplete'}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid size={{ xs: 6, sm: 3 }}>
                                                                <Typography variant="caption" color="text.secondary">Created At</Typography>
                                                                <Typography variant="body2">{new Date(schedule.created_at).toLocaleDateString()}</Typography>
                                                            </Grid>

                                                            {/* Recipients Section */}
                                                            {recipients.length > 0 && (
                                                                <>
                                                                    <Grid size={{ xs: 12 }}>
                                                                        <Divider className="my-2" />
                                                                        <Typography variant="subtitle2" className="font-semibold mb-2">
                                                                            Recipient{recipients.length > 1 ? 's' : ''}:
                                                                        </Typography>
                                                                        <div className="flex flex-wrap gap-2 mb-2">
                                                                            {recipients.map((recipient, idx) => (
                                                                                <Chip
                                                                                    key={idx}
                                                                                    avatar={
                                                                                        <CustomAvatar skin="light" color="primary" size={24}>
                                                                                            {getInitials(`${recipient.user.first_name} ${recipient.user.last_name}`)}
                                                                                        </CustomAvatar>
                                                                                    }
                                                                                    label={`${recipient.user.first_name} ${recipient.user.last_name}`}
                                                                                    variant="outlined"
                                                                                    size="small"
                                                                                />
                                                                            ))}
                                                                        </div>
                                                                        {recipients.map((recipient, idx) => (
                                                                            <Box key={idx} className="mb-2 p-2 bg-gray-50 rounded">
                                                                                <Typography variant="caption" color="text.secondary">
                                                                                    Account:
                                                                                </Typography>
                                                                                <Typography variant="body2" className="font-medium">
                                                                                    {recipient.account ? JSON.stringify(recipient.account) : 'Not set'}
                                                                                </Typography>
                                                                            </Box>
                                                                        ))}
                                                                    </Grid>
                                                                </>
                                                            )}

                                                            {/* Invoices Summary */}
                                                            {invoiceData && invoiceData.invoices.length > 0 && (
                                                                <>
                                                                    <Grid size={{ xs: 12 }}>
                                                                        <Divider className="my-2" />
                                                                        <Typography variant="subtitle2" className="font-semibold mb-2">
                                                                            Payment Summary:
                                                                        </Typography>
                                                                        <Box className="space-y-2">
                                                                            {invoiceData.invoices.map((invoice) => (
                                                                                <Box key={invoice.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                                                    <div className="flex items-center gap-2">
                                                                                        <CustomAvatar skin="light" color="secondary" size={32}>
                                                                                            {getInitials(`${invoice.user.first_name} ${invoice.user.last_name}`)}
                                                                                        </CustomAvatar>
                                                                                        <div>
                                                                                            <Typography variant="body2" className="font-medium">
                                                                                                {invoice.user.first_name} {invoice.user.last_name}
                                                                                            </Typography>
                                                                                            <Typography variant="caption" color="text.secondary">
                                                                                                → {invoice.recipient.first_name} {invoice.recipient.last_name}
                                                                                            </Typography>
                                                                                            <Typography variant="caption" color="text.secondary" className="block mt-1">
                                                                                                Account: {invoice.account_id ? invoice.account_id : 'Not set'}
                                                                                            </Typography>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="text-right">
                                                                                        <Typography variant="body2" className="font-semibold">
                                                                                            {invoice.amount}
                                                                                        </Typography>
                                                                                        <Chip
                                                                                            label={invoice.status.replace('_', ' ')}
                                                                                            size="small"
                                                                                            color={invoice.status === 'paid' ? 'success' : 'default'}
                                                                                            variant="outlined"
                                                                                        />
                                                                                    </div>
                                                                                </Box>
                                                                            ))}
                                                                        </Box>
                                                                    </Grid>
                                                                </>
                                                            )}
                                                        </Grid>
                                                    )}
                                                </AccordionDetails>
                                            </Accordion>
                                        )
                                    })
                                )}
                            </TabPanel>
                        </TabPanel>
                    </CardContent>
                </TabContext>
            </Card>

            {/* Confirm Payment Dialog */}
            <Dialog
                open={confirmDialogOpen}
                onClose={() => {
                    if (!confirming) {
                        setConfirmDialogOpen(false)
                        setSelectedInvoice(null)
                    }
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Typography variant="h6" className="font-bold">
                        Confirm Payment
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    {selectedInvoice && (
                        <Box className="space-y-4">
                            <Alert severity="warning">
                                <AlertTitle>Are you sure you received this payment?</AlertTitle>
                                Please verify that you have received the payment before confirming.
                            </Alert>
                            <Divider />
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12 }}>
                                    <Typography variant="caption" color="text.secondary">From:</Typography>
                                    <Typography variant="body1" className="font-medium">
                                        {selectedInvoice.user.first_name} {selectedInvoice.user.last_name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {selectedInvoice.user.email}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <Typography variant="caption" color="text.secondary">Amount:</Typography>
                                    <Typography variant="h6" className="font-bold text-primary">
                                        {selectedInvoice.amount}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <Typography variant="caption" color="text.secondary">Invoice ID:</Typography>
                                    <Typography variant="body2">#{selectedInvoice.id}</Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setConfirmDialogOpen(false)
                            setSelectedInvoice(null)
                        }}
                        disabled={confirming}
                    >
                        Cancel
                    </Button>
                    <LoadingButton
                        loading={confirming}
                        variant="contained"
                        color="success"
                        onClick={handleConfirmPayment}
                        startIcon={<i className="ri-check-line" />}
                    >
                        Mark as Paid
                    </LoadingButton>
                </DialogActions>
            </Dialog>

            {/* Delete Participant Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => {
                    if (!deletingParticipantId) {
                        setDeleteDialogOpen(false)
                        setSelectedParticipant(null)
                    }
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Typography variant="h6" className="font-bold">
                        Remove Participant
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    {selectedParticipant && (
                        <Box className="space-y-4">
                            <Alert severity="warning">
                                <AlertTitle>Are you sure you want to remove this participant?</AlertTitle>
                                This action cannot be undone.
                            </Alert>
                            <Divider />
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12 }}>
                                    <Typography variant="caption" color="text.secondary">Participant:</Typography>
                                    <Typography variant="body1" className="font-medium">
                                        {selectedParticipant.first_name} {selectedParticipant.last_name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {selectedParticipant.user_email}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <Typography variant="caption" color="text.secondary">Slot:</Typography>
                                    <Typography variant="body2" className="font-medium">
                                        {selectedParticipant.slot}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <Typography variant="caption" color="text.secondary">Amount:</Typography>
                                    <Typography variant="body2" className="font-medium">
                                        {selectedParticipant.amount}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setDeleteDialogOpen(false)
                            setSelectedParticipant(null)
                        }}
                        disabled={deletingParticipantId !== null}
                    >
                        Cancel
                    </Button>
                    <LoadingButton
                        loading={deletingParticipantId !== null}
                        variant="contained"
                        color="error"
                        onClick={handleDeleteParticipant}
                        startIcon={<i className="ri-delete-bin-line" />}
                    >
                        Remove Participant
                    </LoadingButton>
                </DialogActions>
            </Dialog>

            {/* Edit Cycle Announcement Dialog */}
            <Dialog open={editCycleAnnouncementOpen} onClose={() => setEditCycleAnnouncementOpen(false)} fullWidth maxWidth='sm'>
                <DialogTitle>Edit Cycle Announcement</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Announcement"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        value={cycleAnnouncementText}
                        onChange={(e) => setCycleAnnouncementText(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditCycleAnnouncementOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleUpdateCycleAnnouncement}
                        variant="contained"
                        disabled={isUpdatingCycleAnnouncement}
                    >
                        {isUpdatingCycleAnnouncement ? <CircularProgress size={24} color="inherit" /> : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
