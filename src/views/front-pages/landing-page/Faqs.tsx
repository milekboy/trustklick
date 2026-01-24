// React Imports
import { useEffect, useRef } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Grid from '@mui/material/Grid2'

// Third-party Imports
import classnames from 'classnames'

// Hook Imports
import { useIntersection } from '@/hooks/useIntersection'

// SVG Imports
import ElementOne from '@/assets/svg/front-pages/landing-page/ElementOne'
import Lines from '@assets/svg/front-pages/landing-page/Lines'

// Styles Imports
import frontCommonStyles from '@views/front-pages/styles.module.css'

type FaqsDataTypes = {
  id: string
  question: string
  active?: boolean
  answer: string
}

const FaqsData: FaqsDataTypes[] = [
  {
    id: 'panel1',
    question: 'What is Trustklick?',
    answer:
      'Trustklick is a platform for managing group savings, contributions, and investments. Whether you call it Esusu, Ajo, Rotating Savings, or a contribution pool – Trustklick helps you organize, track, and manage group finances transparently.'
  },
  {
    id: 'panel2',
    question: 'What are the different cycle types?',
    active: true,
    answer:
      'Trustklick offers three cycle types: 1) Thrift – rotating savings where members take turns collecting (like Esusu/Ajo); 2) Contribution – one-off collections for events like weddings or emergencies; 3) Investment – joint business ventures where members can own shares and receive dividends.'
  },
  {
    id: 'panel3',
    question: 'Is Trustklick free to use?',
    answer:
      'Yes! Creating a Klick and managing your group is completely free. You can invite unlimited members, create multiple cycles, and access all core features at no cost. Premium features may be introduced in the future.'
  },
  {
    id: 'panel4',
    question: 'How do I invite members to my Klick?',
    answer:
      'After creating a Klick, you can invite members via email or phone number. Each Klick also has a unique invite link that you can share directly with potential members through WhatsApp, SMS, or any messaging platform.'
  },
  {
    id: 'panel5',
    question: 'Is my financial information secure?',
    answer:
      'Absolutely. Trustklick uses industry-standard encryption to protect your data. All Klicks are private by default, meaning only invited members can see group activities. We never share your personal or financial information with third parties.'
  },
  {
    id: 'panel6',
    question: 'What currencies are supported?',
    answer:
      'Trustklick currently supports NGN (Nigerian Naira), USD (US Dollar), GBP (British Pound), and EUR (Euro). This makes it perfect for both local Nigerian groups and international communities.'
  }
]

const Faqs = () => {
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
    <section
      id='faq'
      ref={ref}
      className={classnames('flex flex-col gap-16 plb-[100px]', frontCommonStyles.layoutSpacing)}
    >
      <div className='flex flex-col items-center justify-center'>
        <div className='flex is-full justify-center items-center relative'>
          <ElementOne className='absolute inline-end-0' />
          <div className='flex items-center justify-center mbe-6 gap-3'>
            <Lines />
            <Typography variant='h6' className='uppercase'>
              FAQ
            </Typography>
          </div>
        </div>
        <div className='flex items-baseline flex-wrap gap-2 mbe-3 sm:mbe-2'>
          <Typography variant='h5'>Frequently asked</Typography>
          <Typography variant='h4' className='font-bold'>
            questions
          </Typography>
        </div>
        <Typography className='font-medium text-center'>
          Have questions about Trustklick? Find answers to common questions below.
        </Typography>
      </div>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12, lg: 5 }} className='text-center'>
          <img
            src='/images/front-pages/landing-page/sitting-girl-with-laptop.png'
            alt='girl with laptop'
            className='is-[80%] max-is-[320px]'
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 7 }}>
          {FaqsData.map((data, index) => {
            return (
              <Accordion key={index} defaultExpanded={data.active}>
                <AccordionSummary aria-controls={data.id + '-content'} id={data.id + '-header'} className='font-medium'>
                  {data.question}
                </AccordionSummary>
                <AccordionDetails>{data.answer}</AccordionDetails>
              </Accordion>
            )
          })}
        </Grid>
      </Grid>
    </section>
  )
}

export default Faqs
