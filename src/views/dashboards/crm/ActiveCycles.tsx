'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'

// Components Imports
import OptionMenu from '@core/components/option-menu'

type CycleType = {
  id: number
  klick: string
  cycleNumber: number
  target: string
  collected: string
  progress: number
  members: number
  endDate: string
}

// Dummy data
const cycles: CycleType[] = [
  {
    id: 1,
    klick: 'Office Savings',
    cycleNumber: 3,
    target: '₦200,000',
    collected: '₦150,000',
    progress: 75,
    members: 8,
    endDate: 'Dec 25, 2024'
  },
  {
    id: 2,
    klick: 'Family Fund',
    cycleNumber: 2,
    target: '₦100,000',
    collected: '₦85,000',
    progress: 85,
    members: 5,
    endDate: 'Dec 20, 2024'
  },
  {
    id: 3,
    klick: 'Project Contributors',
    cycleNumber: 1,
    target: '₦500,000',
    collected: '₦320,000',
    progress: 64,
    members: 12,
    endDate: 'Jan 5, 2025'
  }
]

const ActiveCycles = () => {
  return (
    <Card>
      <CardHeader
        title='Active Cycles'
        subheader={`${cycles.length} cycles in progress`}
        action={<OptionMenu options={['View All', 'Create Cycle', 'Refresh']} />}
      />
      <CardContent className='space-y-4'>
        {cycles.map((cycle, index) => (
          <div key={cycle.id}>
            <div className='flex items-start justify-between mb-3'>
              <div className='flex-1'>
                <div className='flex items-center gap-2 mb-1'>
                  <Typography variant='h6' className='font-semibold'>
                    {cycle.klick}
                  </Typography>
                  <Chip label={`Cycle #${cycle.cycleNumber}`} size='small' variant='outlined' />
                </div>
                <Typography variant='body2' color='text.secondary'>
                  {cycle.members} members • Ends {cycle.endDate}
                </Typography>
              </div>
            </div>

            <div className='space-y-2 mb-3'>
              <div className='flex items-center justify-between'>
                <Typography variant='body2' color='text.secondary'>
                  Progress
                </Typography>
                <Typography variant='body2' className='font-semibold'>
                  {cycle.progress}%
                </Typography>
              </div>
              <LinearProgress variant='determinate' value={cycle.progress} className='bs-2' />
              <div className='flex items-center justify-between'>
                <Typography variant='body2' color='text.secondary'>
                  Collected: <span className='font-semibold text-textPrimary'>{cycle.collected}</span>
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Target: <span className='font-semibold text-textPrimary'>{cycle.target}</span>
                </Typography>
              </div>
            </div>

            {index < cycles.length - 1 && <Divider className='my-4' />}
          </div>
        ))}

        <Box className='mt-4'>
          <Button variant='outlined' fullWidth startIcon={<i className='ri-add-line' />}>
            View All Cycles
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

export default ActiveCycles

