// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { ShortcutsType } from '@components/layout/shared/ShortcutsDropdown'
import type { NotificationsType } from '@components/layout/shared/NotificationsDropdown'

// Component Imports
import NavToggle from './NavToggle'
import ModeDropdown from '@components/layout/shared/ModeDropdown'
import ShortcutsDropdown from '@components/layout/shared/ShortcutsDropdown'
import NotificationsDropdown from '@components/layout/shared/NotificationsDropdown'
import UserDropdown from '@components/layout/shared/UserDropdown'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'
import { IconButton } from '@mui/material'
// Vars
const shortcuts: ShortcutsType[] = [
  {
    url: '/dashboards/create-klick',
    icon: 'ri-add-line',
    title: 'Start A Klick',
    subtitle: 'Create your own Klick and invite your members'
  },
  {
    url: '/apps/calendar',

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
  return (
    <div className={classnames(verticalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}>
      <div className='flex items-center gap-[7px]'>
        <NavToggle />
        <div className='lg:w-96 '>
          <div className='relative'>
            <input
              type='text'
              placeholder='Search Klicks...'
              className='
            w-full px-4 py-3 rounded-xl 
            bg-gray-500 text-gray-800
            placeholder-gray-800
            focus:outline-none focus:ring-2 focus:ring-purple-500
          '
            />

            <span
              className='
          absolute right-3 top-1/2 -translate-y-1/2 
          text-purple-600 font-medium
        '
            >
              <IconButton className='text-textPrimary'>
                <i className='ri-search-line' />
              </IconButton>
            </span>
          </div>
        </div>
      </div>
      <div className='flex items-center'>
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
