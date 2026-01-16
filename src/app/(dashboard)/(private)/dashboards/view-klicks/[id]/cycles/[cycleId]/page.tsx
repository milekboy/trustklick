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

type KlickType = {
    id: number
    name: string
    [key: string]: any
}

type CycleType = {
    id: number
    cycle_name: string
    [key: string]: any
}

export default function ViewCyclePage() {
    const params = useParams()
    const router = useRouter()
    // ID is klick id, cycleId is cycle id
    const { id, cycleId } = params as { id: string; cycleId: string }
    const { token } = useAuth()
    const api = NetworkInstance()

    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('schedule') // Default to schedule as requested
    const [schedules, setSchedules] = useState<ScheduleType[]>([])
    const [klick, setKlick] = useState<KlickType | null>(null)
    const [cycle, setCycle] = useState<CycleType | null>(null)

    // File Upload State
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)

    const [toast, setToast] = useState({
        message: '',
        type: ''
    })

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

    const handleTabChange = (event: SyntheticEvent, newValue: string) => {
        setActiveTab(newValue)
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

        try {
            setUploading(true)
            const formData = new FormData()
            formData.append('file', file)

            // Using scheduleId as invoiceId based on user request context
            const res = await api.post(`/api/invoices/${scheduleId}/evidence`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })

            setToast({ message: res.data.message || 'Evidence uploaded successfully', type: 'success' })
            setFile(null)
            // Refresh schedules potentially?
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

    // Active Schedule Helpers
    const activeSchedule = schedules.find(s => s.is_active)

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
                            <Tab value='participants' label='Participants' icon={<i className='ri-group-line' />} iconPosition='start' />
                            <Tab value='description' label='Description' icon={<i className='ri-file-text-line' />} iconPosition='start' />
                            <Tab value='schedule' label='Schedule' icon={<i className='ri-calendar-line' />} iconPosition='start' />
                        </CustomTabList>
                    </div>

                    <CardContent>
                        <TabPanel value='participants' className='p-0'>
                            <Alert severity="info" variant="outlined">
                                <AlertTitle>Participants</AlertTitle>
                                Participants view is under construction.
                            </Alert>
                        </TabPanel>

                        <TabPanel value='description' className='p-0'>
                            <Alert severity="info" variant="outlined">
                                <AlertTitle>Description</AlertTitle>
                                Description view is under construction.
                            </Alert>
                        </TabPanel>

                        <TabPanel value='schedule' className='space-y-6 p-0'>

                            {/* Active Schedule Action Section */}
                            {activeSchedule && (
                                <Card variant="outlined" className='mb-6 bg-primary-50 border-primary'>
                                    <CardHeader
                                        title="Current Active Schedule"
                                        subheader={`Slot ${activeSchedule.slot} • ${new Date(activeSchedule.period_start).toLocaleDateString()} - ${new Date(activeSchedule.period_end).toLocaleDateString()}`}
                                        avatar={<i className="ri-timer-flash-line text-2xl text-primary" />}
                                    />
                                    <CardContent>
                                        <Grid container spacing={4} alignItems="center">
                                            <Grid size={{ xs: 12, md: 8 }}>
                                                <Typography variant="body1" className='mb-2'>
                                                    <strong>Expected Amount:</strong> {activeSchedule.expected_amount}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Please upload your payment evidence for this period to verify your contribution.
                                                </Typography>
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 4 }}>
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
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Schedule List */}
                            <Typography variant="h6" className="mb-4 mt-4">All Schedules</Typography>

                            {schedules.length === 0 ? (
                                <Typography color="text.secondary">No schedules found for this cycle.</Typography>
                            ) : (
                                schedules.map((schedule) => (
                                    <Accordion key={schedule.id} defaultExpanded={schedule.is_active}>
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
                                                <Chip
                                                    label={schedule.is_active ? 'Active' : schedule.completed ? 'Completed' : 'Pending'}
                                                    color={schedule.is_active ? 'success' : schedule.completed ? 'default' : 'default'}
                                                    size="small"
                                                    variant={schedule.is_active ? 'filled' : 'outlined'}
                                                />
                                            </div>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Grid container spacing={2}>
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
                                                {/* Add more details here as needed */}
                                            </Grid>
                                        </AccordionDetails>
                                    </Accordion>
                                ))
                            )}
                        </TabPanel>
                    </CardContent>
                </TabContext>
            </Card>
        </div>
    )
}
