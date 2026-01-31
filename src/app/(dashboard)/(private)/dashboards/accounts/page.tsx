'use client'

import { useState } from 'react'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import AccountList from '@/views/dashboards/accounts/AccountList'
import AccountForm from '@/views/dashboards/accounts/AccountForm'

// Define this type locally if not exported from form
type AccountData = {
    id?: number
    account_type: string
    currency: string
    account_number: string
    account_name: string
    sort_code: string
    country_code: string
}

export default function AccountsPage() {
    const [formOpen, setFormOpen] = useState(false)
    const [editingAccount, setEditingAccount] = useState<AccountData | null>(null)
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    const handleAddAccount = () => {
        setEditingAccount(null)
        setFormOpen(true)
    }

    const handleEditAccount = (account: any) => {
        setEditingAccount(account)
        setFormOpen(true)
    }

    const handleFormSuccess = () => {
        setRefreshTrigger(prev => prev + 1)
    }

    const handleFormClose = () => {
        setFormOpen(false)
        setEditingAccount(null)
    }

    return (
        <div className='space-y-6'>
            {/* Header Section */}
            <Card className='bg-gradient-to-r from-primary/5 to-transparent border-none shadow-none'>
                <CardContent className='p-0'>
                    <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                        <div className='flex items-center gap-3'>
                            <div className='flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-white shadow-lg shadow-primary/30'>
                                <i className='ri-bank-card-2-line text-2xl' />
                            </div>
                            <div>
                                <Typography variant='h4' className='font-bold mb-1'>
                                    Bank Accounts
                                </Typography>
                                <Typography variant='body1' color='text.secondary'>
                                    Manage your linked bank accounts for payments and payouts.
                                </Typography>
                            </div>
                        </div>

                        <Button
                            variant='contained'
                            size='large'
                            startIcon={<i className='ri-add-line' />}
                            onClick={handleAddAccount}
                            className='shadow-lg shadow-primary/20'
                        >
                            Add New Account
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <AccountList refreshTrigger={refreshTrigger} onEdit={handleEditAccount} />

            <AccountForm
                open={formOpen}
                onClose={handleFormClose}
                onSuccess={handleFormSuccess}
                initialData={editingAccount}
            />
        </div>
    )
}
