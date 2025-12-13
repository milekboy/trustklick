'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import MuiTimeline from '@mui/lab/Timeline'
import type { TimelineProps } from '@mui/lab/Timeline'

// Components Imports
import CustomAvatar from '@core/components/mui/Avatar'
import OptionMenu from '@core/components/option-menu'

// Styled Timeline component
const Timeline = styled(MuiTimeline)<TimelineProps>({
  paddingLeft: 0,
  paddingRight: 0,
  '& .MuiTimelineItem-root': {
    width: '100%',
    '&:before': {
      display: 'none'
    }
  }
})

type ActivityType = {
  id: number
  type: 'contribution' | 'cycle' | 'member' | 'klick'
  title: string
  description: string
  time: string
  amount?: string
  member?: string
  avatar?: string
}

// Dummy data
const activities: ActivityType[] = [
  {
    id: 1,
    type: 'contribution',
    title: 'New Contribution Received',
    description: 'John Doe contributed ₦25,000 to Office Savings',
    time: '2 hours ago',
    amount: '₦25,000',
    member: 'John Doe',
    avatar: '/images/avatars/1.png'
  },
  {
    id: 2,
    type: 'cycle',
    title: 'Cycle Started',
    description: 'New cycle #3 started for Office Savings',
    time: '1 day ago',
    amount: '₦200,000 target'
  },
  {
    id: 3,
    type: 'member',
    title: 'New Member Joined',
    description: 'Sarah Williams joined Family Fund',
    time: '2 days ago',
    member: 'Sarah Williams',
    avatar: '/images/avatars/4.png'
  },
  {
    id: 4,
    type: 'klick',
    title: 'Klick Created',
    description: 'You created a new Klick: Project Contributors',
    time: '3 days ago'
  }
]

const ContributionTimeline = () => {
  const getDotColor = (type: string) => {
    switch (type) {
      case 'contribution':
        return 'success'
      case 'cycle':
        return 'primary'
      case 'member':
        return 'info'
      case 'klick':
        return 'warning'
      default:
        return 'grey'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'contribution':
        return 'Contribution'
      case 'cycle':
        return 'Cycle'
      case 'member':
        return 'Member'
      case 'klick':
        return 'Klick'
      default:
        return ''
    }
  }

  return (
    <Card>
      <CardHeader
        title='Activity Timeline'
        subheader='Recent activities across your Klicks'
        action={<OptionMenu options={['View All', 'Filter', 'Export']} />}
      />
      <CardContent>
        <Timeline>
          {activities.map((activity, index) => (
            <TimelineItem key={activity.id}>
              <TimelineSeparator>
                <TimelineDot color={getDotColor(activity.type)} />
                {index < activities.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <div className='flex flex-wrap items-center justify-between gap-x-2 mbe-2.5'>
                  <div className='flex items-center gap-2'>
                    <Typography className='font-medium' color='text.primary'>
                      {activity.title}
                    </Typography>
                    <Chip label={getTypeLabel(activity.type)} size='small' variant='outlined' />
                  </div>
                  <Typography variant='caption' color='text.secondary'>
                    {activity.time}
                  </Typography>
                </div>
                <Typography className='mbe-2' color='text.secondary'>
                  {activity.description}
                </Typography>
                {activity.member && activity.avatar && (
                  <div className='flex items-center gap-2.5'>
                    <CustomAvatar src={activity.avatar} size={32} />
                    <div className='flex flex-col'>
                      <Typography variant='body2' className='font-medium'>
                        {activity.member}
                      </Typography>
                      {activity.amount && (
                        <Typography variant='caption' color='text.secondary'>
                          Amount: {activity.amount}
                        </Typography>
                      )}
                    </div>
                  </div>
                )}
                {activity.amount && !activity.member && (
                  <Chip label={activity.amount} size='small' color='primary' variant='tonal' />
                )}
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </CardContent>
    </Card>
  )
}

export default ContributionTimeline

