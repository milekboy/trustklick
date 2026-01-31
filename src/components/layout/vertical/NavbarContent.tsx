'use client'
// Third-party Imports
import classnames from 'classnames'
import { useState } from 'react'

// MUI Imports
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box'

// Type Imports
import type { ShortcutsType } from '@components/layout/shared/ShortcutsDropdown'
import type { NotificationsType } from '@components/layout/shared/NotificationsDropdown'

// Component Imports
import NavToggle from './NavToggle'
import ModeDropdown from '@components/layout/shared/ModeDropdown'
import ShortcutsDropdown from '@components/layout/shared/ShortcutsDropdown'
import NotificationsDropdown from '@components/layout/shared/NotificationsDropdown'
import UserDropdown from '@components/layout/shared/UserDropdown'
import { useAuth } from '@/components/AuthContext'
import Typography from '@mui/material/Typography'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

// Vars
const shortcuts: ShortcutsType[] = [
  {
    url: '/dashboards/create-klick',
    icon: 'ri-add-line',
    title: 'Start A Klick',
    subtitle: 'Create your own Klick and invite your members'
  },
  {
    url: '/dashboards/join-klick',
    icon: 'ri-group-3-line',
    title: 'Join Existing Klick',
    subtitle: 'Join an existing Klick and start saving'
  }
]

const notifications: NotificationsType[] = [
  {
    avatarImage: '/images/avatars/2.png',
    title: 'Congratulations Flora 🎉',
    subtitle: 'Won the monthly bestseller gold badge',
    time: '1h ago',
    read: false
  },
  {
    title: 'Cecilia Becker',
    subtitle: 'Accepted your connection',
    time: '12h ago',
    read: false
  },
  {
    avatarImage: '/images/avatars/3.png',
    title: 'Bernard Woods',
    subtitle: 'You have new message from Bernard Woods',
    time: 'May 18, 8:26 AM',
    read: true
  },
  {
    avatarIcon: 'ri-bar-chart-line',
    avatarColor: 'info',
    title: 'Monthly report generated',
    subtitle: 'July month financial report is generated',
    time: 'Apr 24, 10:30 AM',
    read: true
  },
  {
    avatarText: 'MG',
    avatarColor: 'success',
    title: 'Application has been approved 🚀',
    subtitle: 'Your Meta Gadgets project application has been approved.',
    time: 'Feb 17, 12:17 PM',
    read: true
  },
  {
    avatarIcon: 'ri-mail-line',
    avatarColor: 'error',
    title: 'New message from Harry',
    subtitle: 'You have new message from Harry',
    time: 'Jan 6, 1:48 PM',
    read: true
  }
]

const NavbarContent = () => {
  const { user } = useAuth()
  const [searchValue, setSearchValue] = useState('')

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
    // TODO: Implement search functionality
  }

  const handleClearSearch = () => {
    setSearchValue('')
  }

  return (
    <div
      className={classnames(
        verticalLayoutClasses.navbarContent,
        'flex items-center justify-between gap-4 is-full px-4 py-2'
      )}
    >
      <div className='flex items-center gap-4 flex-1 min-w-0'>
        <NavToggle />
        <Box className='flex-1 max-w-md lg:max-w-lg xl:max-w-xl'>
          <TextField
            fullWidth
            size='small'
            placeholder='Search Klicks, members, cycles...'
            value={searchValue}
            onChange={handleSearch}
            variant='outlined'
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position='start'>
                    <i className='ri-search-line text-xl text-textSecondary' />
                  </InputAdornment>
                ),
                endAdornment: searchValue && (
                  <InputAdornment position='end'>
                    <Tooltip title='Clear search'>
                      <IconButton
                        size='small'
                        edge='end'
                        onClick={handleClearSearch}
                        className='text-textSecondary hover:text-textPrimary'
                      >
                        <i className='ri-close-line text-lg' />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                )
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'var(--mui-palette-background-paper)',
                borderRadius: 'var(--mui-shape-customBorderRadius-lg)',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: 'var(--mui-palette-action-hover)',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'var(--mui-palette-primary-main)'
                  }
                },
                '&.Mui-focused': {
                  backgroundColor: 'var(--mui-palette-background-paper)',
                  boxShadow: '0 0 0 3px var(--mui-palette-primary-lightOpacity)',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderWidth: '1.5px',
                    borderColor: 'var(--mui-palette-primary-main)'
                  }
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--mui-palette-divider)'
                }
              },
              '& .MuiOutlinedInput-input': {
                padding: '8px 12px',
                fontSize: '0.9375rem'
              }
            }}
          />
        </Box>
      </div>
      <div className='flex items-center gap-1'>
        {user?.first_name && (
          <Typography className='mr-4 font-semibold hidden sm:block' color='text.primary'>
            Welcome {user.first_name}
          </Typography>
        )}
        {/* <LanguageDropdown /> */}
        <ShortcutsDropdown shortcuts={shortcuts} />
        <NotificationsDropdown notifications={notifications} />
        <UserDropdown />
        <ModeDropdown />
      </div>
    </div>
  )
}

export default NavbarContent
