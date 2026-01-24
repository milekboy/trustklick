'use client'

import { useState } from 'react'
import Toast from '@/components/Toast'
import NetworkInstance from '@/components/NetworkInstance'
import { useRouter } from 'next/navigation'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Slide from '@mui/material/Slide'
import type { TransitionProps } from '@mui/material/transitions'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
import { useAuth } from '@/components/AuthContext'
import React from 'react'

export default function CreateKlick() {
  const api: any = NetworkInstance()
  const router = useRouter()
  const { token } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    whatsapp_group_link: '',
    announcement: '',
    total_shares: '',
    share_value: '',
    type: 'private'
  })
  const [openCongrats, setOpenCongrats] = useState(false)
  const [loading, setLoading] = useState(false)
  const [inviteLink, setInviteLink] = useState('')

  const [toast, setToast] = useState({
    message: '',
    type: ''
  })

  const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement },
    ref: React.Ref<unknown>
  ) {
    return <Slide direction='up' ref={ref} {...props} />
  })

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        whatsapp_group_link: formData.whatsapp_group_link,
        announcement: formData.announcement,
        total_shares: parseInt(formData.total_shares) || 0,
        share_value: parseFloat(formData.share_value) || 0,
        type: formData.type
      }

      const res = await api.post('/klicks', payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setToast({ message: res.data.message, type: 'success' })
      if (res.data.data?.invite_url) {
        setInviteLink(res.data.data.invite_url)
      }
      setOpenCongrats(true)

      setFormData({
        name: '',
        description: '',
        whatsapp_group_link: '',
        announcement: '',
        total_shares: '',
        share_value: '',
        type: 'private'
      })
    } catch (error: any) {
      setToast({
        message: error?.response?.data?.message || 'Something went wrong',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='space-y-6'>
      {/* Success Dialog */}
      <Dialog
        open={openCongrats}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpenCongrats(false)}
        maxWidth='sm'
        fullWidth
      >
        <DialogContent className='text-center p-8'>
          <Box className='mb-4'>
            <div className='inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4'>
              <i className='ri-checkbox-circle-line text-5xl text-primary' />
            </div>
            <DialogTitle className='text-2xl font-bold p-0 mb-2'>🎉 Congratulations!</DialogTitle>
            <Typography variant='body1' color='text.secondary' className='mb-6'>
              Your Klick has been created successfully! Share your invite link and start building your community.
            </Typography>

            {inviteLink && (
              <TextField
                fullWidth
                value={inviteLink}
                label='Invite Link'
                variant='outlined'
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        onClick={() => {
                          navigator.clipboard.writeText(inviteLink)
                          setToast({ message: 'Link copied!', type: 'success' })
                        }}
                        edge='end'
                      >
                        <i className='ri-file-copy-line' />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions className='flex justify-center gap-3 px-6 pb-6'>
          <Button
            variant='contained'
            size='large'
            onClick={() => {
              setOpenCongrats(false)
              router.push('/dashboards/klicks')
            }}
            startIcon={<i className='ri-eye-line' />}
          >
            View All Klicks
          </Button>
          <Button variant='outlined' size='large' onClick={() => setOpenCongrats(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {toast.message && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />
      )}

      {/* Main Content - Form on Left, Hero on Right */}
      <Grid container spacing={4}>
        {/* Left Side - Form */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card className='shadow-lg'>
            <CardHeader
              title={
                <div className='flex items-center gap-3'>
                  <div className='flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10'>
                    <i className='ri-file-edit-line text-xl text-primary' />
                  </div>
                  <div>
                    <Typography variant='h5' className='font-bold'>
                      Klick Details
                    </Typography>
                    <Typography variant='body2' color='text.secondary' className='mt-1'>
                      Fill in the information below to create your Klick
                    </Typography>
                  </div>
                </div>
              }
              className='pb-4'
            />
            <Divider />
            <CardContent className='p-6'>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={4}>
                  {/* Klick Name */}
                  <Grid size={{ xs: 12 }}>
                    <Typography variant='body2' className='font-semibold mb-2 flex items-center gap-2'>
                      <i className='ri-group-line text-lg text-primary' />
                      Klick Name
                    </Typography>
                    <TextField
                      fullWidth
                      name='name'
                      label='Enter a name for your Klick'
                      placeholder='e.g., Office Savings Group, Family Fund...'
                      value={formData.name}
                      onChange={handleChange}
                      required
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position='start'>
                              <i className='ri-group-line text-xl text-primary' />
                            </InputAdornment>
                          )
                        }
                      }}
                    />
                  </Grid>

                  {/* Description */}
                  <Grid size={{ xs: 12 }}>
                    <Typography variant='body2' className='font-semibold mb-2 flex items-center gap-2'>
                      <i className='ri-file-text-line text-lg text-primary' />
                      Description
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      name='description'
                      label='Describe your Klick'
                      placeholder='This is the klick description...'
                      value={formData.description}
                      onChange={handleChange}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position='start' className='self-start mt-2'>
                              <i className='ri-file-text-line text-xl text-primary' />
                            </InputAdornment>
                          )
                        }
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { alignItems: 'flex-start' } }}
                    />
                  </Grid>

                  {/* WhatsApp Group Link */}
                  <Grid size={{ xs: 12 }}>
                    <Typography variant='body2' className='font-semibold mb-2 flex items-center gap-2'>
                      <i className='ri-whatsapp-line text-lg text-success' />
                      WhatsApp Group Link
                    </Typography>
                    <TextField
                      fullWidth
                      type='url'
                      name='whatsapp_group_link'
                      label='Paste your WhatsApp group invite link'
                      placeholder='https://chat.whatsapp.com/...'
                      value={formData.whatsapp_group_link}
                      onChange={handleChange}
                      required
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position='start'>
                              <i className='ri-whatsapp-line text-xl text-success' />
                            </InputAdornment>
                          )
                        }
                      }}
                    />
                  </Grid>

                  {/* Announcement */}
                  <Grid size={{ xs: 12 }}>
                    <Typography variant='body2' className='font-semibold mb-2 flex items-center gap-2'>
                      <i className='ri-megaphone-line text-lg text-warning' />
                      Announcement
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      name='announcement'
                      label='Add an announcement or welcome message'
                      placeholder='Welcome to our Klick! This group is for...'
                      value={formData.announcement}
                      onChange={handleChange}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position='start' className='self-start mt-2'>
                              <i className='ri-megaphone-line text-xl text-warning' />
                            </InputAdornment>
                          )
                        }
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { alignItems: 'flex-start' } }}
                    />
                  </Grid>

                  {/* Total Shares and Share Value */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant='body2' className='font-semibold mb-2 flex items-center gap-2'>
                      <i className='ri-pie-chart-line text-lg text-info' />
                      Total Shares
                    </Typography>
                    <TextField
                      fullWidth
                      type='number'
                      name='total_shares'
                      label='Total shares'
                      placeholder='e.g., 1000000'
                      value={formData.total_shares}
                      onChange={handleChange}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position='start'>
                              <i className='ri-pie-chart-line text-xl text-info' />
                            </InputAdornment>
                          )
                        }
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant='body2' className='font-semibold mb-2 flex items-center gap-2'>
                      <i className='ri-money-dollar-circle-line text-lg text-info' />
                      Share Value
                    </Typography>
                    <TextField
                      fullWidth
                      type='number'
                      name='share_value'
                      label='Value per share'
                      placeholder='e.g., 1'
                      value={formData.share_value}
                      onChange={handleChange}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position='start'>
                              <i className='ri-money-dollar-circle-line text-xl text-info' />
                            </InputAdornment>
                          )
                        }
                      }}
                    />
                  </Grid>

                  {/* Type */}
                  <Grid size={{ xs: 12 }}>
                    <Typography variant='body2' className='font-semibold mb-2 flex items-center gap-2'>
                      <i className='ri-lock-line text-lg text-secondary' />
                      Klick Type
                    </Typography>
                    <TextField
                      fullWidth
                      select
                      name='type'
                      label='Select klick type'
                      value={formData.type}
                      onChange={handleChange}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position='start'>
                              <i className='ri-lock-line text-xl text-secondary' />
                            </InputAdornment>
                          )
                        }
                      }}
                    >
                      <MenuItem value='private'>Private</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid size={{ xs: 12 }} className='mt-2'>
                    <Divider className='mb-4' />
                    <div className='flex flex-col sm:flex-row gap-3 justify-end'>
                      <Button
                        variant='outlined'
                        size='large'
                        onClick={() => router.push('/dashboards/klicks')}
                        startIcon={<i className='ri-arrow-left-line' />}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant='contained'
                        type='submit'
                        size='large'
                        disabled={loading}
                        startIcon={
                          loading ? <i className='ri-loader-4-line animate-spin' /> : <i className='ri-check-line' />
                        }
                        sx={{ minWidth: '160px' }}
                      >
                        {loading ? 'Creating...' : 'Create Klick'}
                      </Button>
                    </div>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Side - Hero Section */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <div className='sticky top-6 space-y-4'>
            {/* Hero Card */}
            <Card className='bg-gradient-to-br from-primary/10 via-background-paper to-primary/5 border-2 border-primary/20 shadow-lg'>
              <CardContent className='p-6'>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10'>
                    <i className='ri-add-circle-line text-3xl text-primary' />
                  </div>
                  <div>
                    <Typography variant='h4' className='font-bold mb-1'>
                      Create Your Klick
                    </Typography>
                    <Chip label='New' color='primary' size='small' variant='tonal' />
                  </div>
                </div>
                <Typography variant='body1' color='text.secondary' className='mb-4'>
                  Start a new contribution group for your community, team, or organization. Set up your Klick in
                  minutes and begin collecting contributions from members.
                </Typography>

                <Divider className='my-4' />

                {/* Quick Actions */}
                <div className='space-y-3'>
                  <Typography variant='body2' className='font-semibold mb-2'>
                    Quick Actions
                  </Typography>
                  <Button
                    variant='outlined'
                    fullWidth
                    onClick={() => router.push('/dashboards/klicks')}
                    startIcon={<i className='ri-list-check' />}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    View All Klicks
                  </Button>
                  <Button
                    variant='text'
                    fullWidth
                    onClick={() => router.push('/dashboards/join-klick')}
                    startIcon={<i className='ri-user-add-line' />}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Join a Klick
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Help Card */}
            <Card variant='outlined' className='bg-info/5'>
              <CardContent className='p-6'>
                <div className='flex items-start gap-3'>
                  <div className='flex items-center justify-center w-10 h-10 rounded-lg bg-info/10 flex-shrink-0'>
                    <i className='ri-question-line text-xl text-info' />
                  </div>
                  <div className='flex-1'>
                    <Typography variant='h6' className='font-semibold mb-2'>
                      Need Help?
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Creating a Klick is simple! Just provide a name, add your WhatsApp group link, and optionally
                      include an announcement. Once created, you'll receive an invite link to share with members.
                    </Typography>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Grid>
      </Grid>
    </div>
  )
}
