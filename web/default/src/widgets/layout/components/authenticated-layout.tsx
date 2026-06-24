/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.
*/
import { useAuthStore } from '@domains/identity/store/auth-store'
import { ROLE } from '@shared/lib/roles'
import { AdminWorkspaceLayout } from '@widgets/admin-workspace'
import { UserWorkspaceLayout } from '@widgets/user-workspace'

type AuthenticatedLayoutProps = {
  children?: React.ReactNode
}

export function AuthenticatedLayout(props: AuthenticatedLayoutProps) {
  const userRole = useAuthStore((state) => state.auth.user?.role)
  const isAdmin = Boolean(userRole && userRole >= ROLE.ADMIN)

  if (isAdmin) {
    return <AdminWorkspaceLayout>{props.children}</AdminWorkspaceLayout>
  }

  return <UserWorkspaceLayout>{props.children}</UserWorkspaceLayout>
}
