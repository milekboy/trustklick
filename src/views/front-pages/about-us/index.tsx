'use client'

// MUI Imports
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

// Third-party Imports
import classnames from 'classnames'

// SVG Imports
import ElementOne from '@/assets/svg/front-pages/landing-page/ElementOne'
import Lines from '@assets/svg/front-pages/landing-page/Lines'

// Styles Imports
import frontCommonStyles from '@views/front-pages/styles.module.css'

const AboutUsWrapper = () => {
    return (
        <section className={classnames('plb-[100px]', frontCommonStyles.layoutSpacing)}>
            {/* Hero Section */}
            <div className='flex flex-col items-center justify-center mbe-16'>
                <div className='flex is-full justify-center items-center relative'>
                    <ElementOne className='absolute inline-start-0' />
                    <div className='flex items-center justify-center mbe-6 gap-3'>
                        <Lines />
                        <Typography variant='h6' className='uppercase font-bold text-primary'>
                            About Us
                        </Typography>
                    </div>
                </div>
                <div className='flex items-baseline flex-wrap gap-2 mbe-3 sm:mbe-2'>
                    <Typography variant='h4' className='font-bold'>
                        Money contribution
                    </Typography>
                    <Typography variant='h5'>made modern & simple</Typography>
                </div>
                <Typography className='font-medium text-center text-textSecondary max-is-[700px]'>
                    Empowering communities to achieve financial goals through collaborative saving and lending, supported by cutting-edge technology.
                </Typography>
            </div>

            {/* Story Section */}
            <Grid container spacing={12} className='mbe-20'>
                <Grid size={{ xs: 12, md: 6 }} className='flex flex-col justify-center gap-6'>
                    <Typography variant='h4' className='font-bold'>
                        Our Story
                    </Typography>
                    <Typography className='text-textSecondary text-lg leading-relaxed'>
                        TrustKlick was born from a simple observation: traditional community savings methods (like Esusu and Ajo) are powerful but often lack transparency and security. We decided to bridge this gap by bringing these age-old traditions into the digital age.
                    </Typography>
                    <Typography className='text-textSecondary text-lg leading-relaxed'>
                        Today, we provide a secure, transparent, and user-friendly platform that allows friends, families, and organizations to pool resources, save together, and access credit without the barriers of traditional banking.
                    </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <div className='relative rounded-xl overflow-hidden shadow-2xl'>
                        <img
                            src='/images/front-pages/landing-page/sitting-girl-with-laptop.png'
                            alt='Community'
                            className='is-full object-cover'
                        />
                    </div>
                </Grid>
            </Grid>

            {/* Values Section */}
            <div className='flex flex-col items-center mbe-12'>
                <Typography variant='h4' className='font-bold mbe-10'>
                    Why Choose TrustKlick?
                </Typography>
                <Grid container spacing={6}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card className='h-full border-t-4 border-primary'>
                            <CardContent className='flex flex-col items-center text-center gap-4 p-8'>
                                <div className='p-4 rounded-full bg-primaryLight opacity-20'>
                                    <i className='ri-shield-check-line text-4xl text-primary' />
                                </div>
                                <Typography variant='h5' className='font-bold'>
                                    Secure & Transparent
                                </Typography>
                                <Typography className='text-textSecondary'>
                                    Every transaction is logged and visible. We use state-of-the-art encryption to ensure your funds and data are always protected.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card className='h-full border-t-4 border-info'>
                            <CardContent className='flex flex-col items-center text-center gap-4 p-8'>
                                <div className='p-4 rounded-full bg-infoLight opacity-20'>
                                    <i className='ri-group-line text-4xl text-info' />
                                </div>
                                <Typography variant='h5' className='font-bold'>
                                    Community First
                                </Typography>
                                <Typography className='text-textSecondary'>
                                    We believe in the power of community. Our features are designed to strengthen bonds and foster financial cooperation.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card className='h-full border-t-4 border-success'>
                            <CardContent className='flex flex-col items-center text-center gap-4 p-8'>
                                <div className='p-4 rounded-full bg-successLight opacity-20'>
                                    <i className='ri-smartphone-line text-4xl text-success' />
                                </div>
                                <Typography variant='h5' className='font-bold'>
                                    Modern & Simple
                                </Typography>
                                <Typography className='text-textSecondary'>
                                    No more complex spreadsheets. Our intuitive interface makes managing contributions as easy as sending a message.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        </section>
    )
}

export default AboutUsWrapper
