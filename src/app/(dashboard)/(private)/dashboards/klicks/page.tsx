'use client'

import { useEffect, useState } from 'react'
import KlickList from '@/views/dashboards/crm/UserTable'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import { useRouter } from 'next/navigation'
import NetworkInstance from '@/components/NetworkInstance'
import { useAuth } from '@/components/AuthContext'
import CustomAvatar from '@core/components/mui/Avatar'

export default function Klicks() {
  const router = useRouter()
  const api = NetworkInstance()
  const { token } = useAuth()
  const [stats, setStats] = useState({
    totalKlicks: 0,
    totalMembers: 0,
    activeCycles: 0,
    totalContributions: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/klicks', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const klicks = res.data.data || []

        // Calculate stats (using dummy data for now)
        setStats({
          totalKlicks: klicks.length,
          totalMembers: 45, // Dummy
          activeCycles: 3, // Dummy
          totalContributions: 450000 // Dummy
        })
      } catch (err) {
        console.error('Error fetching stats:', err)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchStats()
    }
  }, [token])

  const statCards = [
    {
      title: 'Total Klicks',
      value: stats.totalKlicks,
      icon: 'ri-group-line',
      color: 'primary',
      trend: '+12%',
      bgGradient: 'linear-gradient(135deg, var(--mui-palette-primary-main) 0%, var(--mui-palette-primary-dark) 100%)'
    },
    {
      title: 'Total Members',
      value: stats.totalMembers,
      icon: 'ri-user-3-line',
      color: 'success',
      trend: '+8%',
      bgGradient: 'linear-gradient(135deg, var(--mui-palette-success-main) 0%, var(--mui-palette-success-dark) 100%)'
    },
    {
      title: 'Active Cycles',
      value: stats.activeCycles,
      icon: 'ri-refresh-line',
      color: 'info',
      trend: '+2',
      bgGradient: 'linear-gradient(135deg, var(--mui-palette-info-main) 0%, var(--mui-palette-info-dark) 100%)'
    },
    {
      title: 'Total Contributions',
      value: `₦${(stats.totalContributions / 1000).toFixed(0)}k`,
      icon: 'ri-money-dollar-circle-line',
      color: 'warning',
      trend: '+24%',
      bgGradient: 'linear-gradient(135deg, var(--mui-palette-warning-main) 0%, var(--mui-palette-warning-dark) 100%)'
    }
  ]

  return (
    <div className='space-y-6'>
      {/* Hero Header Section */}
      <Card className='bg-gradient-to-br from-primary/10 via-background-paper to-primary/5 border-2 border-primary/20 shadow-lg'>
        <CardContent className='p-6 sm:p-8'>
          <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-6'>
            <div className='flex-1'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10'>
                  <i className='ri-dashboard-3-line text-3xl text-primary' />
                </div>
                <div>
                  <Typography variant='h3' className='font-bold mb-1'>
                    Klicks Dashboard
                  </Typography>
                  <Typography variant='body1' color='text.secondary'>
                    Manage your Klicks, share invite links, and monitor group activity
                  </Typography>
                </div>
              </div>

              {/* Action Buttons */}
              <div className='flex flex-wrap gap-3 mt-4'>
                <Button
                  variant='contained'
                  size='large'
                  onClick={() => router.push('/dashboards/create-klick')}
                  startIcon={<i className='ri-add-circle-line' />}
                  sx={{
                    background:
                      'linear-gradient(135deg, var(--mui-palette-primary-main) 0%, var(--mui-palette-primary-dark) 100%)',
                    boxShadow: '0 4px 12px var(--mui-palette-primary-mainOpacity)',
                    '&:hover': {
                      background:
                        'linear-gradient(135deg, var(--mui-palette-primary-dark) 0%, var(--mui-palette-primary-main) 100%)',
                      boxShadow: '0 6px 16px var(--mui-palette-primary-mainOpacity)'
                    }
                  }}
                >
                  Create Klick
                </Button>
                <Button
                  variant='outlined'
                  size='large'
                  onClick={() => router.push('/dashboards/join-klick')}
                  startIcon={<i className='ri-user-add-line' />}
                  sx={{
                    borderColor: 'var(--mui-palette-success-main)',
                    color: 'var(--mui-palette-success-main)',
                    '&:hover': {
                      borderColor: 'var(--mui-palette-success-dark)',
                      backgroundColor: 'var(--mui-palette-success-lightOpacity)'
                    }
                  }}
                >
                  Join Klick
                </Button>

              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      {/* <Grid container spacing={4}>
        {statCards.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Card
              className='relative overflow-hidden hover:shadow-lg transition-all duration-300'
              sx={{
                background: stat.bgGradient,
                color: 'white',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                }
              }}
            >
              <CardContent className='p-5'>
                <div className='flex items-center justify-between mb-4'>
                  <CustomAvatar
                    skin='filled'
                    color={'primary'}
                    size={56}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white'
                    }}
                  >
                    <i className={`${stat.icon} text-2xl`} />
                  </CustomAvatar>
                  <Chip
                    label={stat.trend}
                    size='small'
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontWeight: 600
                    }}
                  />
                </div>
                <Typography variant='h3' className='font-bold mb-1' sx={{ color: 'white' }}>
                  {stat.value}
                </Typography>
                <Typography variant='body2' sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  {stat.title}
                </Typography>
              </CardContent>
              <Box
                className='absolute bottom-0 right-0 opacity-10'
                sx={{
                  width: '120px',
                  height: '120px',
                  background: 'radial-gradient(circle, white 0%, transparent 70%)',
                  transform: 'translate(20%, 20%)'
                }}
              />
            </Card>
          </Grid>
        ))}
      </Grid> */}

      {/* Klicks Table */}
      <KlickList />
    </div>
  )
}
