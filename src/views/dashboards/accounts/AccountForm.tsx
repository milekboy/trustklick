'use client'

import { useEffect, useState } from 'react'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import CircularProgress from '@mui/material/CircularProgress'
import { toast } from 'react-toastify' // Assuming react-toastify is used, will check or use global toast if available

import NetworkInstance from '@/components/NetworkInstance'
import { useAuth } from '@/components/AuthContext'

type AccountData = {
    id?: number
    account_type: string
    currency: string
    account_number: string
    account_name: string
    sort_code: string
    country_code: string
}

type Props = {
    open: boolean
    onClose: () => void
    onSuccess: () => void
    initialData?: AccountData | null
}

const initialFormState: AccountData = {
    account_type: 'bank',
    currency: 'NGN',
    account_number: '',
    account_name: '',
    sort_code: '',
    country_code: 'NG'
}

const AccountForm = ({ open, onClose, onSuccess, initialData }: Props) => {
    const api = NetworkInstance()
    const { token } = useAuth()
    const [formData, setFormData] = useState<AccountData>(initialFormState)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (open) {
            if (initialData) {
                setFormData(initialData)
            } else {
                setFormData(initialFormState)
            }
        }
    }, [open, initialData])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const payload = {
                account_type: formData.account_type,
                currency: formData.currency,
                account_number: formData.account_number,
                account_name: formData.account_name,
                sort_code: formData.sort_code,
                country_code: formData.country_code
            }

            if (initialData?.id) {
                // Edit Mode
                await api.put(`/accounts/${initialData.id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                // toast.success('Account updated successfully')
            } else {
                // Add Mode
                await api.post('/accounts', payload, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                // toast.success('Account added successfully')
            }
            onSuccess()
            onClose()
        } catch (error) {
            console.error('Error submitting account:', error)
            // toast.error('Failed to submit account')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Drawer
            open={open}
            anchor='right'
            variant='temporary'
            onClose={onClose}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
        >
            <Box className='flex items-center justify-between p-5'>
                <Typography variant='h5' className='font-bold'>
                    {initialData ? 'Edit Account' : 'Add Account'}
                </Typography>
                <IconButton size='small' onClick={onClose}>
                    <i className='ri-close-line text-2xl' />
                </IconButton>
            </Box>

            <Box className='p-5 pt-0 flex-1 overflow-y-auto'>
                <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
                    <TextField
                        fullWidth
                        select
                        label='Account Type'
                        name='account_type'
                        value={formData.account_type}
                        onChange={handleChange}
                    >
                        <MenuItem value='bank'>Bank</MenuItem>
                        {/* Add more types if needed */}
                    </TextField>

                    <TextField
                        fullWidth
                        select
                        label='Currency'
                        name='currency'
                        value={formData.currency}
                        onChange={handleChange}
                    >
                        <MenuItem value='NGN'>NGN</MenuItem>
                        <MenuItem value='USD'>USD</MenuItem>
                        <MenuItem value='EUR'>EUR</MenuItem>
                        <MenuItem value='GBP'>GBP</MenuItem>
                    </TextField>

                    <TextField
                        fullWidth
                        select
                        label='Country Code'
                        name='country_code'
                        value={formData.country_code}
                        onChange={handleChange}
                    >
                        <MenuItem value='NG'>Nigeria (NG)</MenuItem>
                        <MenuItem value='UK'>United Kingdom (UK)</MenuItem>
                        <MenuItem value='US'>United States (US)</MenuItem>
                        {/* Add more countries if needed */}
                    </TextField>

                    <TextField
                        fullWidth
                        label='Account Number'
                        name='account_number'
                        value={formData.account_number}
                        onChange={handleChange}
                        required
                    />

                    <TextField
                        fullWidth
                        label='Account Name'
                        name='account_name'
                        value={formData.account_name}
                        onChange={handleChange}
                        required
                    />

                    <TextField
                        fullWidth
                        label='Sort Code'
                        name='sort_code'
                        value={formData.sort_code}
                        onChange={handleChange}
                        placeholder='Optional'
                    />

                    <div className='flex items-center gap-4 mt-4'>
                        <Button variant='contained' type='submit' fullWidth disabled={loading}>
                            {loading ? <CircularProgress size={24} color='inherit' /> : initialData ? 'Update' : 'Add'}
                        </Button>
                        <Button variant='outlined' color='secondary' fullWidth onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </Box>
        </Drawer>
    )
}

export default AccountForm
