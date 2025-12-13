'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'

// Components Imports
import OptionMenu from '@core/components/option-menu'
import CustomAvatar from '@core/components/mui/Avatar'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

type ContributionType = {
  id: number
  member: string
  klick: string
  amount: string
  status: 'completed' | 'pending' | 'failed'
  date: string
  avatar?: string
}

// Dummy data
const data: ContributionType[] = [
  {
    id: 1,
    member: 'John Doe',
    klick: 'Office Savings',
    amount: '₦25,000',
    status: 'completed',
    date: '2 hours ago',
    avatar: '/images/avatars/1.png'
  },
  {
    id: 2,
    member: 'Jane Smith',
    klick: 'Family Fund',
    amount: '₦15,000',
    status: 'completed',
    date: '5 hours ago',
    avatar: '/images/avatars/2.png'
  },
  {
    id: 3,
    member: 'Michael Johnson',
    klick: 'Project Contributors',
    amount: '₦30,000',
    status: 'pending',
    date: '1 day ago',
    avatar: '/images/avatars/3.png'
  },
  {
    id: 4,
    member: 'Sarah Williams',
    klick: 'Office Savings',
    amount: '₦20,000',
    status: 'completed',
    date: '2 days ago',
    avatar: '/images/avatars/4.png'
  },
  {
    id: 5,
    member: 'David Brown',
    klick: 'Family Fund',
    amount: '₦18,000',
    status: 'completed',
    date: '3 days ago',
    avatar: '/images/avatars/5.png'
  }
]

const RecentContributions = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'pending':
        return 'warning'
      case 'failed':
        return 'error'
      default:
        return 'default'
    }
  }

  return (
    <Card>
      <CardHeader
        title='Recent Contributions'
        subheader='Latest contribution activities'
        action={<OptionMenu options={['View All', 'Export', 'Refresh']} />}
      />
      <div className='overflow-x-auto pbe-3'>
        <table className={tableStyles.table}>
          <thead className='uppercase'>
            <tr className='border-be'>
              <th className='bg-transparent bs-11 font-normal'>Member</th>
              <th className='bg-transparent bs-11 font-normal'>Klick</th>
              <th className='bg-transparent bs-11 text-end font-normal'>Amount</th>
              <th className='bg-transparent bs-11 text-center font-normal'>Status</th>
              <th className='bg-transparent bs-11 text-end font-normal'>Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={row.id} className={index < data.length - 1 ? 'border-be' : 'border-0'}>
                <td>
                  <div className='flex items-center gap-3'>
                    <CustomAvatar src={row.avatar} size={34} skin='light' />
                    <Typography color='text.primary' className='font-medium'>
                      {row.member}
                    </Typography>
                  </div>
                </td>
                <td>
                  <Typography variant='body2'>{row.klick}</Typography>
                </td>
                <td className='text-end'>
                  <Typography color='text.primary' className='font-semibold'>
                    {row.amount}
                  </Typography>
                </td>
                <td className='text-center'>
                  <Chip label={row.status} size='small' color={getStatusColor(row.status)} variant='tonal' />
                </td>
                <td className='text-end'>
                  <Typography variant='body2' color='text.secondary'>
                    {row.date}
                  </Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Divider />
      <div className='flex justify-center p-4'>
        <Button variant='text' size='small' startIcon={<i className='ri-arrow-right-line' />}>
          View All Contributions
        </Button>
      </div>
    </Card>
  )
}

export default RecentContributions

