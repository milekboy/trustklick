'use client'

import { useParams } from 'next/navigation'
import { useTheme } from '@mui/material/styles'
import PerfectScrollbar from 'react-perfect-scrollbar'

import { Menu, MenuItem } from '@menu/vertical-menu'
import useVerticalNav from '@menu/hooks/useVerticalNav'
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

import menuItemStyles from '@core/styles/vertical/menuItemStyles'

type Props = {
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

const VerticalMenu = ({ scrollMenu }: Props) => {
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()

  const { isBreakpointReached, transitionDuration } = verticalNavOptions

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
          className: 'bs-full overflow-y-auto overflow-x-hidden',
          onScroll: container => scrollMenu(container, false)
        }
        : {
          options: { wheelPropagation: false, suppressScrollX: true },
          onScrollY: container => scrollMenu(container, true)
        })}
    >
      <Menu
        popoutMenuOffset={{ mainAxis: 17 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => (
          <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
            <i className='ri-arrow-right-s-line' />
          </StyledVerticalNavExpandIcon>
        )}
      >
        {/* Simple Sidebar Menu Items with Spacing */}
        <MenuItem className='!mb-4' icon={<i className='ri-dashboard-line text-xl' />} href={`/dashboards/crm`}>
          KlickBoard
        </MenuItem>

        <MenuItem
          className='!mb-4'
          icon={<i className='ri-add-circle-line text-xl' />}
          href={`/dashboards/create-klick`}
        >
          Create Klick
        </MenuItem>

        <MenuItem className='!mb-4' icon={<i className='ri-list-check-2 text-xl' />} href={`/dashboards/klicks`}>
          All Klicks
        </MenuItem>

        <MenuItem className='!mb-4' icon={<i className='ri-bank-line text-xl' />} href={`/dashboards/accounts`}>
          Accounts
        </MenuItem>

        <MenuItem
          className='!mb-4'
          icon={<i className='ri-timer-flash-line text-xl' />}
          href={`/dashboards/cycles/start`}
        >
          Start Cycle
        </MenuItem>

        <MenuItem className='!mb-4' icon={<i className='ri-settings-3-line text-xl' />} href={`/dashboards/settings`}>
          Settings
        </MenuItem>

        <MenuItem
          className='!mb-4'
          icon={<i className='ri-logout-box-r-line text-xl text-red-500' />}
          href={`/pages/auth/login-v2`}
        >
          Logout
        </MenuItem>
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
