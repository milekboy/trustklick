// React Imports
// import { useState, useEffect } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
// import useMediaQuery from '@mui/material/useMediaQuery'
// import type { Theme } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { Mode } from '@core/types'

// Hook Imports
// import { useImageVariant } from '@core/hooks/useImageVariant'

// Styles Imports
// import styles from './styles.module.css'
import frontCommonStyles from '@views/front-pages/styles.module.css'
import HeroDashboard from './HeroDashboard'

const HeroSection = ({ mode }: { mode: Mode }) => {

  return (
    <section id='home' className='relative overflow-hidden pbs-[70px] -mbs-[70px] bg-backgroundPaper z-[1]'>
      {/* Animated Gradient Background */}
      <div
        className="absolute inset-0 z-[-1]"
        style={{
          background: `
          linear-gradient(135deg, rgba(156, 39, 176, 0.03) 0%, rgba(156, 39, 176, 0.08) 100%),
          radial-gradient(circle at 15% 50%, rgba(156, 39, 176, 0.08) 0%, transparent 25%),
          radial-gradient(circle at 85% 30%, rgba(103, 58, 183, 0.08) 0%, transparent 25%)
        `,
          backgroundSize: 'cover'
        }}
      />

      {/* Decorative Circles */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className={classnames('pbs-16 overflow-hidden', frontCommonStyles.layoutSpacing)}>
        <div className='md:max-is-[650px] mlb-0 mli-auto text-center'>
          <Typography className='font-extrabold text-primary sm:text-[38px] text-3xl mbe-4 leading-[44px]'>
            Trust the Klick. Build Wealth Together.
          </Typography>
          <Typography className='font-medium text-lg' color='text.primary'>
            Trustklick is the modern platform for managing group savings, contributions, and investment clubs.
            Create or join a Klick, manage rotating savings (Esusu/Ajo), one-off contributions, or joint investments – all in one secure place.
          </Typography>
          <div className='mlb-8 flex gap-4 justify-center flex-wrap'>
            <Button
              component={Link}
              size='large'
              href='/pages/auth/register-v1'
              variant='contained'
              color='primary'
            >
              Get Started Free
            </Button>
            <Button
              component={Link}
              size='large'
              href='/front-pages/landing-page#cycle-types'
              variant='outlined'
              color='primary'
            >
              Explore Cycle Types
            </Button>
          </div>
        </div>
      </div>
      <div
        className={classnames('relative text-center', frontCommonStyles.layoutSpacing)}
      >
        <HeroDashboard />
      </div>
    </section>
  )
}

export default HeroSection
