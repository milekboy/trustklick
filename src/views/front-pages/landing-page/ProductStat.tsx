// React Imports
import { useState } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { ThemeColor } from '@/@core/types'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Styles Imports
import frontCommonStyles from '@views/front-pages/styles.module.css'

// Type
type StatData = {
  title: string
  value: string
  icon: string
  color: ThemeColor
  isHover: boolean
}

// Data
const statData: StatData[] = [
  {
    title: 'Active Klicks',
    value: '500+',
    icon: 'ri-group-line',
    color: 'primary',
    isHover: false
  },
  {
    title: 'Members Served',
    value: '10K+',
    icon: 'ri-user-3-line',
    color: 'success',
    isHover: false
  },
  {
    title: 'Successful Cycles',
    value: '2.5K+',
    icon: 'ri-refresh-line',
    color: 'warning',
    isHover: false
  },
  {
    title: 'Money Managed',
    value: '₦50M+',
    icon: 'ri-money-dollar-circle-line',
    color: 'info',
    isHover: false
  }
]

const ProductStat = () => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  return (
    <section className='plb-[84px] bg-backgroundPaper'>
      <div className={frontCommonStyles.layoutSpacing}>
        <Grid container spacing={6}>
          {statData.map((stat, index) => (
            <Grid size={{ xs: 6, md: 3 }} key={index}>
              <div className='flex flex-col items-center justify-center gap-6'>
                <CustomAvatar
                  onMouseEnter={() => {
                    setHoverIndex(index)
                  }}
                  onMouseLeave={() => {
                    setHoverIndex(null)
                  }}
                  skin={hoverIndex === index ? 'filled' : 'light'}
                  color={stat.color}
                  size={82}
                  className='cursor-pointer'
                >
                  <i className={classnames(stat.icon, 'text-[2.625rem]')} />
                </CustomAvatar>
                <div className='text-center'>
                  <Typography color='text.primary' className='font-bold text-[34px]'>
                    {stat.value}
                  </Typography>
                  <Typography className='font-medium'>{stat.title}</Typography>
                </div>
              </div>
            </Grid>
          ))}
        </Grid>
      </div>
    </section>
  )
}

export default ProductStat
