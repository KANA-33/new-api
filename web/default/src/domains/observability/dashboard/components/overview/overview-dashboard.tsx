/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.
*/
import { useAuthStore } from '@domains/identity/store/auth-store'
import { ROLE } from '@shared/lib/roles'
import {
  CardStaggerContainer,
  CardStaggerItem,
} from '@widgets/page-transition/page-transition'
import { useDashboardContentVisibility } from '../../hooks/use-status-data'
import { AdminPlatformPanels } from './admin-platform-panels'
import { PerformanceHealthPanel } from './performance-health-panel'
import { SummaryCards } from './summary-cards'
import { UserOverviewDashboard } from './user-overview-dashboard'

function AdminOverviewDashboard() {
  const {
    apiInfo: showApiInfoPanel,
    announcements: showAnnouncementsPanel,
    faq: showFAQPanel,
    uptimeKuma: showUptimePanel,
  } = useDashboardContentVisibility()
  const showAdminPanels =
    showApiInfoPanel || showAnnouncementsPanel || showFAQPanel || showUptimePanel

  return (
    <div className='flex flex-col gap-4'>
      <SummaryCards />

      <CardStaggerContainer className='grid grid-cols-1 gap-4'>
        <CardStaggerItem>
          <PerformanceHealthPanel />
        </CardStaggerItem>

        {showAdminPanels && (
          <CardStaggerItem>
            <AdminPlatformPanels
              showApiInfo={showApiInfoPanel}
              showAnnouncements={showAnnouncementsPanel}
              showFAQ={showFAQPanel}
              showUptime={showUptimePanel}
            />
          </CardStaggerItem>
        )}
      </CardStaggerContainer>
    </div>
  )
}

export function OverviewDashboard() {
  const isAdmin = useAuthStore(
    (state) => (state.auth.user?.role ?? 0) >= ROLE.ADMIN
  )

  return isAdmin ? <AdminOverviewDashboard /> : <UserOverviewDashboard />
}
