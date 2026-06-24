/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.
*/
import { Link, useLocation } from '@tanstack/react-router'
import {
  BarChart3,
  CreditCard,
  FlaskConical,
  Key,
  LayoutDashboard,
  User,
  Wallet,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@shared/lib/utils'

const USER_NAV_ITEMS = [
  { title: 'Console', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Playground', href: '/playground', icon: FlaskConical },
  { title: 'API Keys', href: '/keys', icon: Key },
  { title: 'Wallet', href: '/wallet', icon: Wallet },
  { title: 'Model Square', href: '/pricing', icon: CreditCard },
  { title: 'Rankings', href: '/rankings', icon: BarChart3 },
  { title: 'Profile', href: '/profile', icon: User },
] as const

export function UserWorkspaceNav() {
  const { t } = useTranslation()
  const pathname = useLocation({ select: (location) => location.pathname })

  return (
    <nav className='scrollbar-none flex min-w-0 items-center gap-1 overflow-x-auto'>
      {USER_NAV_ITEMS.map((item) => {
        const Icon = item.icon
        const isActive =
          pathname === item.href ||
          (item.href !== '/dashboard' && pathname.startsWith(item.href + '/')) ||
          (item.href === '/dashboard' && pathname.startsWith('/dashboard'))

        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              'inline-flex h-9 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <Icon className='size-4' />
            <span>{t(item.title)}</span>
          </Link>
        )
      })}
    </nav>
  )
}
