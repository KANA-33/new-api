/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.
*/
import { SkipToMain } from '@shared/ui/composite/skip-to-main'
import { AnimatedOutlet } from '@widgets/page-transition/page-transition'
import { UserWorkspaceHeader } from './user-workspace-header'

type UserWorkspaceLayoutProps = {
  children?: React.ReactNode
}

export function UserWorkspaceLayout(props: UserWorkspaceLayoutProps) {
  return (
    <div className='min-h-svh bg-[#ede3d2] text-[#2e2b26]'>
      <SkipToMain />
      <UserWorkspaceHeader />
      <main
        id='content'
        className='mx-auto min-h-[calc(100svh-4rem)] max-w-7xl px-4 py-6 md:px-6'
      >
        {props.children ?? <AnimatedOutlet />}
      </main>
    </div>
  )
}
