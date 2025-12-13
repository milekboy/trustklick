'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/navigation'

const QuickActions = () => {
  const router = useRouter()

  const actions = [
    {
      icon: 'ri-add-circle-line',
      label: 'Create Klick',
      description: 'Start a new contribution group',
      color: 'primary',
      onClick: () => router.push('/dashboards/create-klick')
    },
    {
      icon: 'ri-refresh-line',
      label: 'Start Cycle',
      description: 'Begin a new contribution cycle',
      color: 'success',
      onClick: () => {
        // TODO: Implement cycle creation
      }
    },
    {
      icon: 'ri-user-add-line',
      label: 'Invite Members',
      description: 'Add members to your Klicks',
      color: 'info',
      onClick: () => {
        // TODO: Implement invite
      }
    },
    {
      icon: 'ri-file-list-3-line',
      label: 'View Reports',
      description: 'Check contribution reports',
      color: 'warning',
      onClick: () => {
        // TODO: Implement reports
      }
    }
  ]

  return (
    <Card>
      <CardHeader title='Quick Actions' subheader='Common tasks and shortcuts' />
      <CardContent>
        <Grid container spacing={3}>
          {actions.map((action, index) => (
            <Grid size={{ xs: 12, sm: 6 }} key={index}>
              <Button
                variant='outlined'
                fullWidth
                className='h-full p-4 flex-col items-start gap-2'
                onClick={action.onClick}
                sx={{
                  borderColor: `var(--mui-palette-${action.color}-main)`,
                  '&:hover': {
                    borderColor: `var(--mui-palette-${action.color}-main)`,
                    backgroundColor: `var(--mui-palette-${action.color}-lightOpacity)`
                  }
                }}
              >
                <div className='flex items-center gap-3 w-full'>
                  <div
                    className='flex items-center justify-center w-12 h-12 rounded-lg'
                    style={{
                      backgroundColor: `var(--mui-palette-${action.color}-lightOpacity)`,
                      color: `var(--mui-palette-${action.color}-main)`
                    }}
                  >
                    <i className={`${action.icon} text-2xl`} style={{ color: `var(--mui-palette-${action.color}-main)` }} />
                  </div>
                  <div className='flex-1 text-left'>
                    <Typography variant='body1' className='font-semibold'>
                      {action.label}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {action.description}
                    </Typography>
                  </div>
                  <i className='ri-arrow-right-line text-xl' />
                </div>
              </Button>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default QuickActions

