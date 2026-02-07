'use client'

// MUI Imports
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'

// Third-party Imports
import classnames from 'classnames'

// SVG Imports
import ElementOne from '@/assets/svg/front-pages/landing-page/ElementOne'
import Lines from '@assets/svg/front-pages/landing-page/Lines'

// Styles Imports
import frontCommonStyles from '@views/front-pages/styles.module.css'

const PrivacyPolicyWrapper = () => {
    return (
        <section className={classnames('plb-[100px]', frontCommonStyles.layoutSpacing)}>
            <div className='flex flex-col items-center justify-center mbe-16'>
                <div className='flex is-full justify-center items-center relative'>
                    <ElementOne className='absolute inline-end-0' />
                    <div className='flex items-center justify-center mbe-6 gap-3'>
                        <Lines />
                        <Typography variant='h6' className='uppercase font-bold text-primary'>
                            Trust & Security
                        </Typography>
                    </div>
                </div>
                <div className='flex items-baseline flex-wrap gap-2 mbe-3 sm:mbe-2'>
                    <Typography variant='h4' className='font-bold'>
                        Privacy
                    </Typography>
                    <Typography variant='h5'>Policy</Typography>
                </div>
                <Typography className='font-medium text-center text-textSecondary max-is-[600px]'>
                    We are committed to protecting your personal information and your right to privacy.
                </Typography>
            </div>

            <Card className='shadow-lg'>
                <CardContent className='flex flex-col gap-8 p-10'>
                    <div>
                        <Typography variant='h5' className='font-bold mbe-4'>
                            1. Introduction
                        </Typography>
                        <Typography variant='body1' className='text-textSecondary leading-loose'>
                            This Privacy Policy describes how TrustKlick collects, uses, and discloses your Personal Information when you visit or use our website. By using our services, you agree to the collection and use of information in accordance with this policy.
                        </Typography>
                    </div>

                    <Divider />

                    <div>
                        <Typography variant='h5' className='font-bold mbe-4'>
                            2. Information We Collect
                        </Typography>
                        <Typography variant='body1' className='text-textSecondary leading-loose mbe-3'>
                            We collect information that you provide directly to us, such as when you create an account, update your profile, or communicate with us. This may include:
                        </Typography>
                        <ul className='list-disc pl-5 flex flex-col gap-2 text-textSecondary'>
                            <li>Personal identifiers (Name, Email address, Phone number)</li>
                            <li>Financial information (Payment details, Transaction history)</li>
                            <li>Device and usage information (IP address, Browser type)</li>
                        </ul>
                    </div>

                    <Divider />

                    <div>
                        <Typography variant='h5' className='font-bold mbe-4'>
                            3. How We Use Your Information
                        </Typography>
                        <Typography variant='body1' className='text-textSecondary leading-loose mbe-3'>
                            We use the collected information for various purposes, including:
                        </Typography>
                        <ul className='list-disc pl-5 flex flex-col gap-2 text-textSecondary'>
                            <li>To provide and maintain our Service</li>
                            <li>To notify you about changes to our Service</li>
                            <li>To provide customer support</li>
                            <li>To monitor the usage of the Service</li>
                            <li>To detect, prevent and address technical issues</li>
                        </ul>
                    </div>

                    <Divider />

                    <div>
                        <Typography variant='h5' className='font-bold mbe-4'>
                            4. Data Sharing & Security
                        </Typography>
                        <Typography variant='body1' className='text-textSecondary leading-loose'>
                            We may share your information with third-party vendors, consultants, and other service providers who need access to such information to carry out work on our behalf. We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
                        </Typography>
                    </div>

                    <Divider />

                    <div>
                        <Typography variant='h5' className='font-bold mbe-4'>
                            5. Your Rights
                        </Typography>
                        <Typography variant='body1' className='text-textSecondary leading-loose'>
                            You have the right to access, update, or delete the information we have on you. Whenever made possible, you can access, update or request deletion of your Personal Data directly within your account settings section. If you are unable to perform these actions yourself, please contact us to assist you.
                        </Typography>
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}

export default PrivacyPolicyWrapper
