'use client'

import { useState, useEffect } from 'react'
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
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import CircularProgress from '@mui/material/CircularProgress'

import Logo from '@components/layout/shared/Logo'
import { useImageVariant } from '@core/hooks/useImageVariant'
import { getLocalizedUrl } from '@/utils/i18n'
import NetworkInstance from '@/components/NetworkInstance'
import { useAuth } from '@components/AuthContext'
import type { Mode } from '@core/types'
import Toast from '@/components/Toast'

type Country = {
  name: string
  code: string
  flagUrl: string
  cca2: string
}

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
  const [countries, setCountries] = useState<Country[]>([])
  const [loadingCountries, setLoadingCountries] = useState(true)
  const [countryCode, setCountryCode] = useState('+234') // Default to a common code, e.g., Nigeria
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,idd,flags,cca2')
        const data = await response.json()

        const formattedCountries: Country[] = data
          .map((country: any) => {
            const countryCode = country.idd.root && country.idd.suffixes ? `${country.idd.root}${country.idd.suffixes[0]}` : ''
            return {
              name: country.name.common,
              code: countryCode,
              flagUrl: country.flags.svg,
              cca2: country.cca2
            }
          })
          .filter((country: Country) => country.code) // Filter out countries without a valid calling code
          .sort((a: Country, b: Country) => a.name.localeCompare(b.name)) // Sort alphabetically

        setCountries(formattedCountries)
        // Set initial selected country based on default countryCode
        const defaultCountry = formattedCountries.find(c => c.code === '+234')
        if (defaultCountry) {
          setSelectedCountry(defaultCountry)
        }
      } catch (error) {
        console.error('Error fetching countries:', error)
      } finally {
        setLoadingCountries(false)
      }
    }

    fetchCountries()
  }, [])

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (password !== confirm) {
      console.log('passwords do not match')
      return
    }
    setLoading(true)
    try {
      const { data } = await api.post('/register', {
        first_name: firstName,
        last_name: lastName,
        phone: `${countryCode}${phone}`, // Prepend country code to phone number
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
          <Typography variant='h4'>Join the TrustKlick Community 🚀</Typography>
          <Typography className='mbs-1'>Money contribution made modern & simple.</Typography>

          <form noValidate autoComplete='off' onSubmit={handleSubmit} className='flex flex-col gap-5 mt-5'>
            {/* Row 1: First Name | Last Name */}
            <div className='flex flex-col sm:flex-row gap-4'>
              <TextField fullWidth label='First Name' value={firstName} onChange={e => setFirstName(e.target.value)} />
              <TextField fullWidth label='Last Name' value={lastName} onChange={e => setLastName(e.target.value)} />
            </div>

            {/* Row 2: Phone Number | Email */}
            <div className='flex flex-col sm:flex-row gap-4'>
              <TextField
                fullWidth
                type='tel'
                label='Phone Number'
                value={phone}
                onChange={e => setPhone(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      {loadingCountries ? (
                        <CircularProgress size={20} />
                      ) : (
                        <Select
                          value={countryCode}
                          onChange={e => {
                            setCountryCode(e.target.value)
                            const country = countries.find(c => c.code === e.target.value)
                            if (country) setSelectedCountry(country)
                          }}
                          variant='standard'
                          disableUnderline
                          sx={{ '& .MuiSelect-select': { paddingRight: '16px !important' }, minWidth: 100 }}
                          renderValue={selected => (
                            <div className='flex items-center gap-2'>
                              {selectedCountry && (
                                <img
                                  src={selectedCountry.flagUrl}
                                  alt={selectedCountry.name}
                                  width='20'
                                  height='15'
                                  style={{ objectFit: 'cover' }}
                                />
                              )}
                              <span>{selected}</span>
                            </div>
                          )}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 300,
                                width: 250
                              }
                            }
                          }}
                        >
                          {countries.map(country => (
                            <MenuItem key={`${country.cca2}-${country.code}`} value={country.code}>
                              <div className='flex items-center gap-2'>
                                <img
                                  src={country.flagUrl}
                                  alt={country.name}
                                  width='20'
                                  height='15'
                                  style={{ objectFit: 'cover' }}
                                />
                                <span className='truncate'>{country.name}</span>
                                <span className='text-gray-500'>({country.code})</span>
                              </div>
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    </InputAdornment>
                  )
                }}
              />
              <TextField fullWidth type='email' label='Email' value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            {/* Row 3: Create Password | Confirm Password */}
            <div className='flex flex-col sm:flex-row gap-4'>
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
            <div className='flex justify-center items-center flex-wrap gap-2'>
              <Typography>Already have an account?</Typography>
              <Link href='/pages/auth/login-v2' className='text-primary'>
                Login Here
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
      <img src={authBackground} className='absolute bottom-[5%] z-[-1] is-full max-md:hidden' />
    </div>
  )
}

export default RegisterV1
