'use client'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'

// Third Party Imports
import type { ApexOptions } from 'apexcharts'

// Components Imports
import OptionMenu from '@core/components/option-menu'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

const series = [
  {
    name: 'Contributions',
    type: 'column',
    data: [45000, 52000, 48000, 61000, 55000, 67000, 72000]
  },
  {
    type: 'line',
    name: 'Target',
    data: [50000, 50000, 50000, 50000, 50000, 50000, 50000]
  }
]

const ContributionTrends = () => {
  // Hooks
  const theme = useTheme()

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: '40%',
        colors: {
          ranges: [
            {
              to: 50000,
              from: 0,
              color: 'var(--mui-palette-primary-main)'
            }
          ]
        }
      }
    },
    markers: {
      size: 4,
      strokeWidth: 2,
      fillOpacity: 1,
      strokeOpacity: 1,
      colors: 'var(--mui-palette-background-paper)',
      strokeColors: 'var(--mui-palette-success-main)'
    },
    stroke: {
      width: [0, 2],
      colors: ['var(--mui-palette-primary-main)', 'var(--mui-palette-success-main)']
    },
    legend: { show: false },
    dataLabels: { enabled: false },
    colors: ['var(--mui-palette-primary-main)', 'var(--mui-palette-success-main)'],
    grid: {
      strokeDashArray: 7,
      borderColor: 'var(--mui-palette-divider)',
      padding: {
        left: -2,
        right: 8
      }
    },
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      tickPlacement: 'on',
      labels: {
        style: {
          fontSize: '0.8125rem',
          colors: 'var(--mui-palette-text-disabled)'
        }
      },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: {
      min: 0,
      max: 80000,
      show: true,
      tickAmount: 4,
      labels: {
        offsetX: -10,
        formatter: value => `₦${value > 999 ? `${(value / 1000).toFixed(0)}k` : value}`,
        style: {
          fontSize: '0.8125rem',
          colors: 'var(--mui-palette-text-disabled)'
        }
      }
    },
    responsive: [
      {
        breakpoint: theme.breakpoints.values.md,
        options: {
          chart: {
            height: 210
          },
          plotOptions: {
            bar: { columnWidth: '35%' }
          }
        }
      }
    ]
  }

  return (
    <Card>
      <CardHeader
        title='Contribution Trends'
        subheader='Weekly contribution overview'
        action={<OptionMenu options={['Last 7 Days', 'Last 30 Days', 'Last 3 Months']} />}
      />
      <CardContent className='flex flex-col gap-6'>
        <AppReactApexCharts type='line' height={240} width='100%' series={series} options={options} />
        <div className='flex items-center justify-between'>
          <div>
            <Typography variant='h4' className='font-bold'>
              ₦450,000
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Total contributions this week
            </Typography>
          </div>
          <Button variant='outlined' size='small' startIcon={<i className='ri-eye-line' />}>
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ContributionTrends

