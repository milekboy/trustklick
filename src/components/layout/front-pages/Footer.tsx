// MUI Imports
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import Link from '@components/Link'
import Logo from '@components/layout/shared/Logo'

// Util Imports
import { frontLayoutClasses } from '@layouts/utils/layoutClasses'

// Styles Imports
import styles from './styles.module.css'
import frontCommonStyles from '@views/front-pages/styles.module.css'

const Footer = () => {
  return (
    <footer className={frontLayoutClasses.footer}>
      <div className='relative'>
        <img
          src='/images/front-pages/footer-bg.png'
          alt='footer bg'
          className='absolute inset-0 is-full bs-full object-cover -z-[1]'
        />
        <div className={classnames('plb-12 text-white', frontCommonStyles.layoutSpacing)}>
          <Grid container rowSpacing={10} columnSpacing={12}>
            <Grid size={{ xs: 12, lg: 5 }}>
              <div className='flex flex-col items-start gap-6'>
                <Link href='/front-pages/landing-page'>
                  <Logo color='var(--mui-palette-common-white)' />
                </Link>
                <Typography color='white' className='lg:max-is-[390px] opacity-[0.78]'>
                  Safe, transparent, and easy group savings. Join a Klick today and reach your financial goals together.
                </Typography>
                <div className='flex gap-4'>
                  <TextField
                    size='small'
                    className={styles.inputBorder}
                    label='Subscribe to newsletter'
                    placeholder='Your email'
                    sx={{
                      ' & .MuiInputBase-root:hover:not(.Mui-focused) fieldset': {
                        borderColor: 'rgb(var(--mui-mainColorChannels-dark) / 0.6) !important'
                      },
                      '& .MuiInputBase-root.Mui-focused fieldset': {
                        borderColor: 'var(--mui-palette-primary-main)!important'
                      },
                      '& .MuiFormLabel-root.Mui-focused': {
                        color: 'var(--mui-palette-primary-main) !important'
                      }
                    }}
                  />
                  <Button variant='contained' color='primary'>
                    Subscribe
                  </Button>
                </div>
              </div>
            </Grid>
            <Grid size={{ xs: 12, sm: 3, lg: 3 }}>
              <Typography color='white' className='font-medium mbe-6 opacity-[0.92]'>
                Platform
              </Typography>
              <div className='flex flex-col gap-4'>
                <Typography component={Link} href='/front-pages/landing-page' color='white' className='opacity-[0.78] hover:opacity-[1]'>
                  Home
                </Typography>
                <Typography component={Link} href='/front-pages/landing-page#features' color='white' className='opacity-[0.78] hover:opacity-[1]'>
                  Features
                </Typography>
                <Typography component={Link} href='/front-pages/landing-page#faq' color='white' className='opacity-[0.78] hover:opacity-[1]'>
                  Faq
                </Typography>
                <Typography component={Link} href='/pages/auth/login-v2' color='white' className='opacity-[0.78] hover:opacity-[1]'>
                  Login
                </Typography>
              </div>
            </Grid>
            <Grid size={{ xs: 12, sm: 3, lg: 3 }}>
              <Typography color='white' className='font-medium mbe-6 opacity-[0.92]'>
                Company
              </Typography>
              <div className='flex flex-col gap-4'>

                <Typography component={Link} href='/front-pages/about-us' color='white' className='opacity-[0.78] hover:opacity-[1]'>
                  About Us
                </Typography>
                <Typography component={Link} href='/front-pages/contact-us' color='white' className='opacity-[0.78] hover:opacity-[1]'>
                  Contact Us
                </Typography>
                <Typography component={Link} href='/front-pages/privacy-policy' color='white' className='opacity-[0.78] hover:opacity-[1]'>
                  Privacy Policy
                </Typography>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>

    </footer>
  )
}

export default Footer
