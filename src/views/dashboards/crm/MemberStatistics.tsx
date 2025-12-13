'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'
import AvatarGroup from '@mui/material/AvatarGroup'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'

// Components Imports
import CustomAvatar from '@core/components/mui/Avatar'

const MemberStatistics = () => {
  return (
    <Card>
      <CardHeader
        title='Member Statistics'
        subheader='Overview of your Klick members'
        action={
          <Button size='small' variant='text' startIcon={<i className='ri-user-add-line' />}>
            Invite
          </Button>
        }
      />
      <CardContent>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <div className='text-center p-4 rounded-lg bg-primary/5'>
              <i className='ri-group-line text-4xl text-primary mb-2' />
              <Typography variant='h4' className='font-bold mb-1'>
                45
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Total Members
              </Typography>
            </div>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <div className='text-center p-4 rounded-lg bg-success/5'>
              <i className='ri-vip-crown-line text-4xl text-success mb-2' />
              <Typography variant='h4' className='font-bold mb-1'>
                8
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Admins
              </Typography>
            </div>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Divider className='my-2' />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant='body2' className='font-semibold mb-3'>
              Recent Members
            </Typography>
            <AvatarGroup total={45} max={6} className='justify-start'>
              <CustomAvatar src='/images/avatars/1.png' size={32} />
              <CustomAvatar src='/images/avatars/2.png' size={32} />
              <CustomAvatar src='/images/avatars/3.png' size={32} />
              <CustomAvatar src='/images/avatars/4.png' size={32} />
              <CustomAvatar src='/images/avatars/5.png' size={32} />
              <CustomAvatar src='/images/avatars/6.png' size={32} />
            </AvatarGroup>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <div className='flex items-center justify-between p-3 rounded-lg bg-actionHover'>
              <div>
                <Typography variant='body2' className='font-semibold mb-1'>
                  New This Month
                </Typography>
                <Typography variant='h6' className='font-bold'>
                  +12 members
                </Typography>
              </div>
              <Chip label='+26%' size='small' color='success' variant='tonal' />
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default MemberStatistics

