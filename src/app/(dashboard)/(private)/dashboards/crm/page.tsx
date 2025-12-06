import Grid from '@mui/material/Grid2'

// Components Imports
import Award from '@views/dashboards/crm/Award'
import CardStatVertical from '@components/card-statistics/Vertical'
import StackedBarChart from '@views/dashboards/crm/StackedBarChart'
import DonutChart from '@views/dashboards/crm/DonutChart'
import OrganicSessions from '@views/dashboards/crm/OrganicSessions'
import ProjectTimeline from '@views/dashboards/crm/ProjectTimeline'
import WeeklyOverview from '@views/dashboards/crm/WeeklyOverview'
import SocialNetworkVisits from '@views/dashboards/crm/SocialNetworkVisits'
import MonthlyBudget from '@views/dashboards/crm/MonthlyBudget'
import MeetingSchedule from '@views/dashboards/crm/MeetingSchedule'
import ExternalLinks from '@views/dashboards/crm/ExternalLinks'
import PaymentHistory from '@views/dashboards/crm/PaymentHistory'
import SalesInCountries from '@views/dashboards/crm/SalesInCountries'
import UserTable from '@views/dashboards/crm/UserTable'
import KlickList from '@views/dashboards/crm/UserTable'
// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

import { getUserData } from '@/app/server/actions'

const DashboardCRM = async () => {
  // Vars
  const data = await getUserData()
  const serverMode = await getServerMode()

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Award />
      </Grid>
      <Grid size={{ xs: 12, md: 4, sm: 3 }}>
        <CardStatVertical
          stats='5'
          title='Total Klicks'
          trendNumber='2'
          chipText='Last 4 Month'
          avatarColor='primary'
          avatarIcon='ri-shopping-cart-line'
          avatarSkin='light'
          chipColor='secondary'
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 4, md: 4 }}>
        <DonutChart />
      </Grid>
      <Grid size={{ xs: 12, md: 12 }}>
        <KlickList />
      </Grid>
      {/* <Grid size={{ xs: 12, md: 4 }}>
        <OrganicSessions />
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <ProjectTimeline />
      </Grid> */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <WeeklyOverview />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SocialNetworkVisits />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <MonthlyBudget />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <MeetingSchedule />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <ExternalLinks />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <PaymentHistory serverMode={serverMode} />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <SalesInCountries />
      </Grid>
    </Grid>
  )
}

export default DashboardCRM
