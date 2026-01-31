'use client'

import { useEffect, useState } from 'react'
import NetworkInstance from '@/components/NetworkInstance'
import { useAuth } from '@/components/AuthContext'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid2'
import CircularProgress from '@mui/material/CircularProgress'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import { toast } from 'react-toastify' // Check toast availability

type AccountData = {
    id: number
    account_type: string
    currency: string
    account_number: string
    account_name: string
    sort_code: string
    country_code: string
}

type Props = {
    refreshTrigger: number
    onEdit: (account: AccountData) => void
}

const AccountList = ({ refreshTrigger, onEdit }: Props) => {
    const api = NetworkInstance()
    const { token } = useAuth()
    const [accounts, setAccounts] = useState<AccountData[]>([])
    const [loading, setLoading] = useState(true)

    // Fetch Accounts
    const fetchAccounts = async () => {
        setLoading(true)
        try {
            const res = await api.get('/accounts', {
                headers: { Authorization: `Bearer ${token}` }
            })
            // Assuming response structure matches existing patterns (res.data.data array)
            const data = res.data.data || res.data || []
            // If data is not array (e.g. wrapped), adjust here.
            setAccounts(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error('Error fetching accounts:', err)
            // toast.error('Failed to load accounts')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (token) {
            fetchAccounts()
        }
    }, [token, refreshTrigger])

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this account?')) return

        try {
            await api.delete(`/accounts/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            // toast.success('Account deleted successfully')
            fetchAccounts()
        } catch (err) {
            console.error('Error deleting account:', err)
            // toast.error('Failed to delete account')
        }
    }

    if (loading && accounts.length === 0) {
        return (
            <div className='flex justify-center items-center min-h-[300px]'>
                <CircularProgress />
            </div>
        )
    }

    if (accounts.length === 0) {
        return (
            <Card>
                <CardContent className='p-8 text-center'>
                    <i className='ri-bank-card-line text-5xl text-textSecondary mb-4' />
                    <Typography variant='h6' color='text.secondary' className='mb-2'>
                        No accounts added yet
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                        Add a bank account to get started.
                    </Typography>
                </CardContent>
            </Card>
        )
    }

    return (
        <Grid container spacing={3}>
            {accounts.map(account => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={account.id}>
                    <Card
                        variant='outlined'
                        sx={{
                            borderColor: 'divider',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                borderColor: 'primary.main',
                                boxShadow: 3,
                                transform: 'translateY(-2px)'
                            }
                        }}
                    >
                        <CardContent className='p-5 relative'>
                            <div className='absolute top-3 right-3 flex gap-1 bg-white rounded'>
                                <Tooltip title='Edit'>
                                    <IconButton size='small' onClick={() => onEdit(account)}>
                                        <i className='ri-edit-line text-lg text-primary-500' />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title='Delete'>
                                    <IconButton size='small' color='error' onClick={() => handleDelete(account.id)}>
                                        <i className='ri-delete-bin-line text-lg' />
                                    </IconButton>
                                </Tooltip>
                            </div>

                            <div className='flex items-center gap-3 mb-4'>
                                <div className='flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary'>
                                    <i className='ri-bank-line text-2xl' />
                                </div>
                                <div>
                                    <Typography variant='body2' color='text.secondary'>
                                        {account.account_type.toUpperCase()}
                                    </Typography>
                                    <Typography variant='h6' className='font-bold leading-tight'>
                                        {account.account_name}
                                    </Typography>
                                </div>
                            </div>

                            <Divider className='my-3' />

                            <div className='space-y-2'>
                                <div className='flex justify-between items-center'>
                                    <Typography variant='body2' color='text.secondary'>Account Number</Typography>
                                    <Typography variant='subtitle2' className='font-mono font-bold'>{account.account_number}</Typography>
                                </div>
                                <div className='flex justify-between items-center'>
                                    <Typography variant='body2' color='text.secondary'>Currency</Typography>
                                    <Chip label={account.currency} size='small' color='primary' variant='outlined' className='font-bold' />
                                </div>
                                {account.sort_code && (
                                    <div className='flex justify-between items-center'>
                                        <Typography variant='body2' color='text.secondary'>Sort Code</Typography>
                                        <Typography variant='subtitle2'>{account.sort_code}</Typography>
                                    </div>
                                )}
                                <div className='flex justify-between items-center'>
                                    <Typography variant='body2' color='text.secondary'>Country</Typography>
                                    <Typography variant='subtitle2'>{account.country_code}</Typography>
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    )
}

export default AccountList
