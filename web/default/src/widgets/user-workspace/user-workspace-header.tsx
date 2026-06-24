/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.
*/
import { useNotifications } from '@shared/hooks/use-notifications'
import { LanguageSwitcher } from '@shared/ui/composite/language-switcher'
import { ThemeSwitch } from '@shared/ui/composite/theme-switch'
import { NotificationPopover } from '@widgets/notification-popover/notification-popover'
import { ProfileDropdown } from '@widgets/profile-dropdown/profile-dropdown'
import { SystemBrand } from '@widgets/layout/components/system-brand'
import { UserWorkspaceNav } from './user-workspace-nav'

export function UserWorkspaceHeader() {
  const notifications = useNotifications()

  return (
    <header className='sticky top-0 z-40 border-b border-[#d8ccbb] bg-[#f4efe7]/86 text-[#2e2b26] backdrop-blur-xl supports-[backdrop-filter]:bg-[#f4efe7]/72'>
      <div className='mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 md:px-6'>
        <SystemBrand variant='inline' />

        <div className='hidden min-w-0 flex-1 md:block'>
          <UserWorkspaceNav />
        </div>

        <div className='ms-auto flex items-center gap-1.5'>
          <NotificationPopover
            open={notifications.popoverOpen}
            onOpenChange={notifications.setPopoverOpen}
            unreadCount={notifications.unreadCount}
            activeTab={notifications.activeTab}
            onTabChange={notifications.setActiveTab}
            notice={notifications.notice}
            announcements={notifications.announcements}
            loading={notifications.loading}
          />
          <LanguageSwitcher />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </div>

      <div className='border-t border-[#d8ccbb] md:hidden'>
        <div className='mx-auto max-w-7xl px-4 py-2'>
          <UserWorkspaceNav />
        </div>
      </div>
    </header>
  )
}
