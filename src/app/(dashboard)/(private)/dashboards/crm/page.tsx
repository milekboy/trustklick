import Grid from '@mui/material/Grid2'

// Components Imports
import Award from '@views/dashboards/crm/Award'
import CardStatVertical from '@components/card-statistics/Vertical'
import DonutChart from '@views/dashboards/crm/DonutChart'
import KlickList from '@views/dashboards/crm/UserTable'
import ContributionTrends from '@views/dashboards/crm/ContributionTrends'
import RecentContributions from '@views/dashboards/crm/RecentContributions'
import ActiveCycles from '@views/dashboards/crm/ActiveCycles'
import MemberStatistics from '@views/dashboards/crm/MemberStatistics'
import QuickActions from '@views/dashboards/crm/QuickActions'
import ContributionTimeline from '@views/dashboards/crm/ContributionTimeline'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import { getUserData } from '@/app/server/actions'

const DashboardCRM = async () => {
  // Vars
  const data = await getUserData()
  const serverMode = await getServerMode()

  return (
    <Grid container spacing={6}>
      {/* Row 1: Wallet, Total Klicks, Donut Chart */}
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

      {/* Row 2: Klicks List */}
      <Grid size={{ xs: 12, md: 12 }}>
        <KlickList />
      </Grid>

      {/* Row 3: Contribution Trends (Full Width) */}
      {/* <Grid size={{ xs: 12 }}>
        <ContributionTrends />
      </Grid> */}

      {/* Row 4: Recent Contributions and Active Cycles */}
      {/* <Grid size={{ xs: 12, md: 12 }}>
        <RecentContributions />
      </Grid> */}
      {/* <Grid size={{ xs: 12, md: 4 }}>
        <ActiveCycles />
      </Grid> */}

      {/* Row 5: Member Statistics and Quick Actions */}
      {/* <Grid size={{ xs: 12, md: 12 }}>
        <MemberStatistics />
      </Grid> */}
      {/* <Grid size={{ xs: 12, md: 6 }}>
        <QuickActions />
      </Grid> */}

      {/* Row 6: Activity Timeline (Full Width) */}
      {/* <Grid size={{ xs: 12 }}>
        <ContributionTimeline />
      </Grid> */}
    </Grid>
  )
}

export default DashboardCRM
