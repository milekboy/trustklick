'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'

import Logo from '@components/layout/shared/Logo'
import { useImageVariant } from '@core/hooks/useImageVariant'
import { getLocalizedUrl } from '@/utils/i18n'
import NetworkInstance from '@/components/NetworkInstance'
import { useAuth } from '@components/AuthContext'
import type { Mode } from '@core/types'
import Toast from '@/components/Toast'
const RegisterV1 = ({ mode }: { mode: Mode }) => {
  const { lang: locale } = useParams()
  const authBackground = useImageVariant(
    mode,
    '/images/pages/auth-v1-mask-2-light.png',
    '/images/pages/auth-v1-mask-2-dark.png'
  )
  const api = NetworkInstance()
  const { login } = useAuth()
  const router = useRouter()
  // Form state
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [showConfirmPwd, setShowConfirmPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<any>(null)

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (password !== confirm) {
      console.log('passwords do not match')
      return
    }
    setLoading(true)
    try {
      const { data } = await api.post('/api/register', {
        first_name: firstName,
        last_name: lastName,
        phone,
        email,
        password,
        password_confirmation: confirm
      })
      console.log('Registration successful:', data)
      setToast({ message: 'Signup successful!', type: 'success' })
      setTimeout(() => router.push('/pages/auth/login-v2'), 1200)
    } catch (err: any) {
      setToast({ message: err.response?.data?.message || 'Something went wrong', type: 'error' })
      console.log('Registration error:', err.response?.data || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col justify-center items-center min-bs-[100dvh] is-full relative p-6'>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <Card className='flex flex-col lg:w-[897px]'>
        <CardContent className='p-6 sm:!p-12'>
          <Link href={'/'} className='flex justify-center items-start mbe-6'>
            <Logo />
          </Link>
          <Typography variant='h4'>Adventure starts here 🚀</Typography>
          <Typography className='mbs-1'>Make your app management easy and fun!</Typography>

          <form noValidate autoComplete='off' onSubmit={handleSubmit} className='flex flex-col gap-5 mt-5'>
            {/* Row 1: First Name | Last Name */}
            <div className='flex gap-4'>
              <TextField fullWidth label='First Name' value={firstName} onChange={e => setFirstName(e.target.value)} />
              <TextField fullWidth label='Last Name' value={lastName} onChange={e => setLastName(e.target.value)} />
            </div>

            {/* Row 2: Phone Number | Email */}
            <div className='flex gap-4'>
              <TextField
                fullWidth
                type='tel'
                label='Phone Number'
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
              <TextField fullWidth type='email' label='Email' value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            {/* Row 3: Create Password | Confirm Password */}
            <div className='flex gap-4'>
              <TextField
                fullWidth
                label='Create Password'
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        size='small'
                        edge='end'
                        onClick={() => setShowPwd(!showPwd)}
                        onMouseDown={e => e.preventDefault()}
                      >
                        <i className={showPwd ? 'ri-eye-off-line' : 'ri-eye-line'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <TextField
                fullWidth
                label='Confirm Password'
                type={showConfirmPwd ? 'text' : 'password'}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        size='small'
                        edge='end'
                        onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                        onMouseDown={e => e.preventDefault()}
                      >
                        <i className={showConfirmPwd ? 'ri-eye-off-line' : 'ri-eye-line'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </div>

            {/* Terms & Submit */}
            <FormControlLabel
              control={<Checkbox />}
              label={
                <>
                  <span>I agree to </span>
                  <Link className='text-primary' href='/' onClick={e => e.preventDefault()}>
                    privacy policy & terms
                  </Link>
                </>
              }
            />

            <Button fullWidth variant='contained' type='submit' disabled={loading}>
              {loading ? 'Signing up...' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
      </Card>
      <img src={authBackground} className='absolute bottom-[5%] z-[-1] is-full max-md:hidden' />
    </div>
  )
}

export default RegisterV1
