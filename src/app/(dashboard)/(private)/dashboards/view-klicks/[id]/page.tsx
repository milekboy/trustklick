'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import NetworkInstance from '@/components/NetworkInstance'
import { useAuth } from '@/components/AuthContext'

import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Chip from '@mui/material/Chip'

export default function SingleKlickPage() {
  const params = useParams()
  const { id } = params
  const { token } = useAuth()
  const api = NetworkInstance()

  const [klick, setKlick] = useState<any>(null)
  const [copied, setCopied] = useState(false)
  const [members, setMembers] = useState<any>(null)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/klicks/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setKlick(res.data.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [id, token])

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await api.get(`/klicks/${id}/members`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setMembers(res.data.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchMembers()
  }, [id, token])

  const copyInvite = () => {
    navigator.clipboard.writeText(klick.invite_url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  if (!klick) {
    return <div className='mt-10 text-center text-lg'>Loading Klick details...</div>
  }

  return (
    <div className='space-y-6'>
      {/* HEADER CARD */}
      <Card className='p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <Typography variant='h5' className='font-bold'>
              {klick.name}
            </Typography>
            <Typography className='text-textSecondary mt-1'>{klick.announcement || 'No announcement yet.'}</Typography>
          </div>

          <div className='flex gap-2'>
            <Tooltip title='Copy invite URL'>
              <IconButton onClick={copyInvite}>
                <i className='ri-file-copy-line text-xl' />
              </IconButton>
            </Tooltip>

            <Button variant='contained' onClick={() => navigator.share && navigator.share({ url: klick.invite_url })}>
              <i className='ri-share-line mr-1' />
              Share
            </Button>
          </div>
        </div>

        {/* Invite link feedback */}
        {copied && <p className='text-green-600 text-sm mt-2'>Invite link copied!</p>}
      </Card>

      {/* DESCRIPTION + LINK */}
      <Card className='p-5 space-y-4'>
        <Typography variant='h6' className='font-semibold'>
          Description
        </Typography>
        <Typography className='text-textSecondary'>{klick.description || 'No description provided.'}</Typography>

        <Divider />

        <Typography variant='h6' className='font-semibold'>
          WhatsApp Link
        </Typography>

        <Button variant='outlined' color='success' href={klick.whatsapp_group_link} target='_blank'>
          <i className='ri-whatsapp-line mr-1' />
          Open Group
        </Button>
      </Card>

      {/* MEMBERS */}
      <Card className='p-5'>
        <div className='flex items-center justify-between'>
          <Typography variant='h6' className='font-semibold'>
            Members
          </Typography>
          <Chip label={`${members?.length || 0} member(s)`} color='primary' />
        </div>

        <div className='flex mt-4 gap-5 flex-wrap'>
          {members?.length ? (
            members.map((m: any) => (
              <div key={m.id} className='flex flex-col items-center p-3 rounded-lg border hover:shadow-md transition'>
                <Avatar className='mx-auto mb-2'>
                  {m.user?.first_name?.[0]}
                  {m.user?.last_name?.[0]}
                </Avatar>

                <p className='text-sm font-medium'>
                  {m.user?.first_name} {m.user?.last_name}
                </p>

                <p className='text-xs text-textSecondary'>{m.is_admin ? 'Admin' : 'Member'}</p>
              </div>
            ))
          ) : (
            <p className='text-textSecondary'>No members added yet.</p>
          )}
        </div>
      </Card>

      {/* CYCLES */}
      <Card className='p-5 space-y-3'>
        <div className='flex items-center justify-between'>
          <Typography variant='h6' className='font-semibold'>
            Cycles
          </Typography>
          <Button variant='outlined'>Start New Cycle</Button>
        </div>

        {klick.cycles?.length ? (
          klick.cycles.map((cycle: any, index: number) => (
            <Card key={index} className='p-4'>
              <Typography className='font-medium'>Cycle {index + 1}</Typography>
              <Typography className='text-textSecondary text-sm mt-1'>Status: {cycle.status}</Typography>
            </Card>
          ))
        ) : (
          <p className='text-textSecondary'>No cycles have been started yet.</p>
        )}
      </Card>
    </div>
  )
}
