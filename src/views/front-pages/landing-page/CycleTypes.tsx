// Next Imports
import Link from 'next/link'

// MUI Imports
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'

// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import frontCommonStyles from '@views/front-pages/styles.module.css'

// SVG Imports
import Lines from '@assets/svg/front-pages/landing-page/Lines'
import Arrow from '@assets/svg/front-pages/landing-page/Arrow'
import ElementTwo from '@/assets/svg/front-pages/landing-page/ElementTwo'

const cycleTypes = [
    {
        title: 'Thrift',
        subtitle: 'Esusu / Ajo',
        icon: 'ri-refresh-line',
        color: 'primary',
        description: 'A rotatory savings system where each member contributes the same amount over a period of time, with each member taking turns to collect.',
        features: [
            'Daily, Weekly, Bi-weekly, Monthly, or Yearly payments',
            'Fixed saving amount per frequency',
            'Slot-based collection schedule',
            'Individual or central disbursement',
            'Automatic schedule generation'
        ],
        idealFor: 'Traditional savings groups, Ajo/Esusu circles, cooperative societies',
        current: true
    },
    {
        title: 'Contribution',
        subtitle: 'One-off Support',
        icon: 'ri-gift-line',
        color: 'success',
        description: 'A one-time contribution for special occasions or to support a member in need. Usually non-profit in nature.',
        features: [
            'One-off payment collection',
            'Optional target amount',
            'Flexible contribution amounts',
            'All members contribute to selected recipients',
            'Perfect for celebrations or emergencies'
        ],
        idealFor: 'Weddings, funerals, medical emergencies, baby showers',
        current: false
    },
    {
        title: 'Investment',
        subtitle: 'Joint Ventures',
        icon: 'ri-line-chart-line',
        color: 'secondary',
        description: 'When members come together to contribute towards a joint business venture with potential returns and dividends.',
        features: [
            'Share/percentage ownership allocation',
            'Dividend distribution support',
            'Flexible or fixed payment types',
            'Daily to yearly payment frequencies',
            'Target amount tracking'
        ],
        idealFor: 'Business partnerships, real estate pools, startup investments',
        current: false
    }
]

const CycleTypes = () => {
    return (
        <section
            id='cycle-types'
            className={classnames('flex flex-col gap-8 lg:gap-12 plb-[100px]', frontCommonStyles.layoutSpacing)}
        >
            <div className='flex flex-col items-center justify-center'>
                <div className='flex is-full justify-center relative'>
                    <ElementTwo className='absolute inline-start-0' />
                    <div className='flex items-center justify-center mbe-6 gap-3 text-center'>
                        <Lines />
                        <Typography variant='h6' className='uppercase'>
                            Cycle Types
                        </Typography>
                    </div>
                </div>
                <div className='flex sm:items-baseline max-sm:items-center max-sm:flex-col gap-x-2 mbe-3 sm:mbe-2'>
                    <Typography variant='h4' className='font-bold'>
                        Three powerful ways
                    </Typography>
                    <Typography variant='h5'>to manage group money</Typography>
                </div>
                <Typography className='font-medium text-center max-w-2xl'>
                    Choose the cycle type that best fits your group's needs. Each type is designed for different use cases and comes with specialized features.
                </Typography>
            </div>

            <Grid container spacing={6}>
                {cycleTypes.map((cycle, index) => (
                    <Grid size={{ xs: 12, lg: 4 }} key={index}>
                        <Card
                            variant='outlined'
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                ...(cycle.current && {
                                    borderWidth: 2,
                                    borderColor: 'primary.main'
                                })
                            }}
                        >
                            <CardContent className='flex flex-col gap-6 p-6 flex-1'>
                                {/* Header */}
                                <Box className='text-center'>
                                    <Box
                                        className='inline-flex items-center justify-center rounded-full p-4 mb-4'
                                        sx={{ bgcolor: `${cycle.color}.lighter` }}
                                    >
                                        <i className={`${cycle.icon} text-3xl`} style={{ color: `var(--mui-palette-${cycle.color}-main)` }} />
                                    </Box>
                                    <Typography variant='h4' className='font-bold'>
                                        {cycle.title}
                                    </Typography>
                                    <Typography color='text.secondary' className='font-medium'>
                                        {cycle.subtitle}
                                    </Typography>
                                    {cycle.current && (
                                        <Chip label='Most Popular' color='primary' size='small' className='mt-2' />
                                    )}
                                </Box>

                                {/* Description */}
                                <Typography className='text-center'>
                                    {cycle.description}
                                </Typography>

                                <Divider />

                                {/* Features */}
                                <div className='flex flex-col gap-3 flex-1'>
                                    {cycle.features.map((feature, idx) => (
                                        <div key={idx} className='flex items-start gap-3'>
                                            <Arrow />
                                            <Typography variant='body2'>{feature}</Typography>
                                        </div>
                                    ))}
                                </div>

                                {/* Ideal For */}
                                <Box className='p-3 rounded-lg' sx={{ bgcolor: 'action.hover' }}>
                                    <Typography variant='caption' className='font-semibold'>
                                        Ideal for:
                                    </Typography>
                                    <Typography variant='body2' color='text.secondary'>
                                        {cycle.idealFor}
                                    </Typography>
                                </Box>

                                {/* CTA */}
                                <Button
                                    component={Link}
                                    href='/register'
                                    variant={cycle.current ? 'contained' : 'outlined'}
                                    color={cycle.color as any}
                                    fullWidth
                                    size='large'
                                >
                                    Start a {cycle.title} Cycle
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </section>
    )
}

export default CycleTypes
