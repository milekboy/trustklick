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
import { useAuth } from '@/components/AuthContext'
import React from 'react'
export default function CreateKlick() {
  const api: any = NetworkInstance()
  const router = useRouter()
  const { token } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    whatsapp_group_link: '',
    announcement: ''
  })
  const [openCongrats, setOpenCongrats] = useState(false)

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

    try {
      const res = await api.post('/klicks', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setToast({ message: res.data.message, type: 'success' })
      setOpenCongrats(true)

      setFormData({
        name: '',
        whatsapp_group_link: '',
        announcement: ''
      })
    } catch (error: any) {
      setToast({
        message: error?.response?.data?.message || 'Something went wrong',
        type: 'error'
      })
    }
  }

  return (
    <div className='space-y-6'>
      <Dialog
        open={openCongrats}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpenCongrats(false)}
        maxWidth='xs'
        fullWidth
      >
        <DialogTitle className='text-center text-xl font-semibold'>🎉 Congratulations!</DialogTitle>

        <DialogContent dividers>
          <p className='text-center text-textSecondary'>
            This is the beginning of something amazing!
            <br />
            Your Klick has been created successfully.
            <br />
            Share your link, invite your people, and watch your community grow.
          </p>
        </DialogContent>

        <DialogActions className='flex justify-between px-4 pb-4'>
          <Button
            variant='contained'
            onClick={() => {
              setOpenCongrats(false)
              router.push('/dashboards/klicks')
            }}
          >
            View All Klicks
          </Button>

          <Button variant='outlined' color='secondary' onClick={() => setOpenCongrats(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Top Intro Section */}
      <div className='flex flex-col gap-2'>
        <h2 className='text-2xl font-semibold text-textPrimary'>Start a New Klick</h2>
        <p className='text-textSecondary max-w-xl'>
          Create a private or public Klick for your community, team, class, friends or organization. Add your WhatsApp
          link, make announcements, and share the invite link instantly.
        </p>

        <div className='flex gap-3 mt-3'>
          <Button variant='outlined' onClick={() => router.push('/dashboards/klicks')}>
            View All Klicks
          </Button>
          <Button variant='text' onClick={() => router.push('/klicks/join')}>
            Join a Klick
          </Button>
        </div>
      </div>

      {toast.message && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />
      )}

      {/* Form Card */}
      <Card>
        <CardHeader title='Create a Klick and share' subheader='Fill in the details below to set up your new Klick' />

        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={5}>
              {/* Name */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  name='name'
                  label='Klick Name'
                  placeholder='Organisation 1...'
                  value={formData.name}
                  onChange={handleChange}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position='start'>
                          <i className='ri-group-line' />
                        </InputAdornment>
                      )
                    }
                  }}
                />
              </Grid>

              {/* WhatsApp link */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  type='url'
                  name='whatsapp_group_link'
                  label='Whatsapp Group Link'
                  placeholder='https://'
                  value={formData.whatsapp_group_link}
                  onChange={handleChange}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position='start'>
                          <i className='ri-links-line' />
                        </InputAdornment>
                      )
                    }
                  }}
                />
              </Grid>

              {/* Announcement */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  name='announcement'
                  label='Announcement'
                  placeholder='Leave a message'
                  value={formData.announcement}
                  onChange={handleChange}
                  sx={{ '& .MuiOutlinedInput-root': { alignItems: 'baseline' } }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position='start'>
                          <i className='ri-message-2-line' />
                        </InputAdornment>
                      )
                    }
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Button variant='contained' type='submit' fullWidth>
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
