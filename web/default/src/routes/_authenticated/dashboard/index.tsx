/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.
*/
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@domains/identity/store/auth-store'
import { DASHBOARD_DEFAULT_SECTION } from '@domains/observability/dashboard/section-registry'
import { ROLE } from '@shared/lib/roles'
import { UserConsole } from '@pages/user-console'

export const Route = createFileRoute('/_authenticated/dashboard/')({
  beforeLoad: () => {
    const userRole = useAuthStore.getState().auth.user?.role

    if (userRole && userRole >= ROLE.ADMIN) {
      throw redirect({
        to: '/dashboard/$section',
        params: { section: DASHBOARD_DEFAULT_SECTION },
      })
    }
  },
  component: UserConsole,
})
