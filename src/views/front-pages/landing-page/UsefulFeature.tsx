// React Imports
import { useEffect, useRef } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'

// Third-party Imports
import classnames from 'classnames'

// Hook Imports
import { useIntersection } from '@/hooks/useIntersection'

// SVG Imports
import Lines from '@assets/svg/front-pages/landing-page/Lines'
import LaptopCharging from '@assets/svg/front-pages/landing-page/LaptopCharging'
import TransitionUp from '@assets/svg/front-pages/landing-page/TransitionUp'
import Edit from '@assets/svg/front-pages/landing-page/Edit'
import Cube from '@assets/svg/front-pages/landing-page/Cube'
import LifeBuoy from '@assets/svg/front-pages/landing-page/Lifebuoy'
import Document from '@assets/svg/front-pages/landing-page/Document'

// Styles Imports
import styles from './styles.module.css'
import frontCommonStyles from '@views/front-pages/styles.module.css'

// Data
const feature = [
  {
    icon: <LaptopCharging />,
    title: 'Create Klicks',
    description: 'Start your own savings group in minutes. Invite members via email or phone and manage everything from one dashboard.'
  },
  {
    icon: <TransitionUp />,
    title: 'Flexible Cycles',
    description: 'Choose from Thrift (rotating savings), Contribution (one-off support), or Investment (joint ventures) based on your needs.'
  },
  {
    icon: <Edit />,
    title: 'Easy Payments',
    description: 'Track payments, upload evidence, and confirm receipts. Know exactly who has paid and who has received funds.'
  },
  {
    icon: <Cube />,
    title: 'Transparent Tracking',
    description: 'Every transaction is logged. View schedules, invoices, and payment history for complete transparency.'
  },
  {
    icon: <LifeBuoy />,
    title: 'Secure & Private',
    description: 'Your financial data is encrypted and protected. Private Klicks ensure only invited members can participate.'
  },
  {
    icon: <Document />,
    title: 'Multi-Currency Support',
    description: 'Operate in NGN, USD, GBP, or EUR. Perfect for local groups and international communities alike.'
  }
]

const UsefulFeature = () => {
  // Refs
  const skipIntersection = useRef(true)
  const ref = useRef<null | HTMLDivElement>(null)

  // Hooks
  const { updateIntersections } = useIntersection()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (skipIntersection.current) {
          skipIntersection.current = false

          return
        }

        updateIntersections({ [entry.target.id]: entry.isIntersecting })
      },
      { threshold: 0.35 }
    )

    ref.current && observer.observe(ref.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section id='features' ref={ref} className='bg-backgroundPaper'>
      <div className={classnames('flex flex-col gap-12 plb-[100px]', frontCommonStyles.layoutSpacing)}>
        <div className={classnames('flex flex-col items-center justify-center')}>
          <div className='flex items-center justify-center mbe-6 gap-3'>
            <Lines />
            <Typography color='text.primary' className='font-medium uppercase'>
              Why Trustklick?
            </Typography>
          </div>
          <div className='flex items-baseline max-sm:flex-col gap-x-2 mbe-3 sm:mbe-2'>
            <Typography variant='h4' className='font-bold'>
              Everything you need
            </Typography>
            <Typography variant='h5'>to manage group finances</Typography>
          </div>
          <Typography className='font-medium text-center max-w-2xl'>
            Whether you're running an Esusu, Ajo, contribution pool, or investment club – Trustklick gives you the tools to organize, track, and grow together.
          </Typography>
        </div>
        <div>
          <Grid container rowSpacing={12} columnSpacing={6}>
            {feature.map((item, index) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={index}>
                <div className='flex flex-col gap-2 justify-center items-center'>
                  <div className={classnames('mbe-2', styles.featureIcon)}>
                    <div className='flex items-center border-2 rounded-full p-5 is-[82px] bs-[82px]'>{item.icon}</div>
                  </div>
                  <Typography variant='h5'>{item.title}</Typography>
                  <Typography className='max-is-[364px] text-center'>{item.description}</Typography>
                </div>
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
    </section>
  )
}

export default UsefulFeature
