/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.
*/
import { Link } from '@tanstack/react-router'
import {
  Activity,
  ArrowUpRight,
  BookOpenText,
  CreditCard,
  FlaskConical,
  Key,
  LayoutDashboard,
  LineChart,
  ShieldCheck,
  User,
  Wallet,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@shared/ui/primitives/button'

const quickActions = [
  {
    title: 'Create an API key',
    description: 'Issue, rotate, and organize keys for production traffic.',
    href: '/keys',
    icon: Key,
  },
  {
    title: 'Open Playground',
    description: 'Try models with your current balance and routing rules.',
    href: '/playground',
    icon: FlaskConical,
  },
  {
    title: 'Add balance',
    description: 'Top up, redeem codes, and manage subscription plans.',
    href: '/wallet',
    icon: Wallet,
  },
  {
    title: 'Browse models',
    description: 'Compare prices, capability, and real-time availability.',
    href: '/pricing',
    icon: CreditCard,
  },
] as const

const dashboardEntry = {
  title: 'Data dashboard',
  description:
    'Enter the full analytics view for usage, model activity, balance movement, and platform signals.',
  href: '/dashboard/overview',
} as const

const dashboardMetrics = [
  'Usage analytics',
  'Model activity',
  'Balance movement',
] as const

const insightLinks = [
  { title: 'Usage logs', href: '/usage-logs/common', icon: LineChart },
  { title: 'Profile', href: '/profile', icon: User },
  { title: 'Documentation', href: '/docs', icon: BookOpenText },
] as const

export function UserConsole() {
  const { t } = useTranslation()
  return (
    <main className='min-h-[calc(100svh-8rem)] overflow-x-hidden rounded-[2rem] bg-[#f4efe7] text-[#2e2b26] shadow-[0_24px_80px_rgba(62,50,36,0.10)] ring-1 ring-[#d8ccbb]'>
      <section className='px-5 pt-5 pb-4 sm:px-8 md:px-10'>
        <Link
          to={dashboardEntry.href}
          className='group grid overflow-hidden rounded-[1.75rem] bg-[#2f3542] text-[#f7f1e8] ring-1 ring-[#c7b69f] transition-transform duration-500 hover:-translate-y-1 md:grid-cols-[1fr_auto]'
        >
          <div className='p-6 md:p-8'>
            <div className='flex items-center gap-3 text-sm text-[#d8cdbc]'>
              <span className='flex size-10 items-center justify-center rounded-full bg-[#f1dfbf] text-[#2e2b26]'>
                <LayoutDashboard className='size-5' />
              </span>
              <span>{t('Control panel')}</span>
            </div>
            <h2 className='mt-8 max-w-2xl text-3xl leading-tight font-semibold tracking-normal text-[#fff7ea] md:text-4xl'>
              {t(dashboardEntry.title)}
            </h2>
            <p className='mt-4 max-w-2xl text-sm leading-6 text-[#d8cdbc] md:text-base'>
              {t(dashboardEntry.description)}
            </p>
          </div>

          <div className='flex flex-col justify-between border-t border-[#57606d] bg-[#394150] p-6 md:min-w-80 md:border-t-0 md:border-l md:p-8'>
            <div className='grid gap-3'>
              {dashboardMetrics.map((item) => (
                <div
                  key={item}
                  className='flex items-center justify-between rounded-full bg-[#f7f1e8]/10 px-4 py-3 text-sm text-[#f7f1e8]'
                >
                  <span>{t(item)}</span>
                  <Activity className='size-4 text-[#f1dfbf]' />
                </div>
              ))}
            </div>
            <div className='mt-8 flex items-center justify-between text-sm font-medium text-[#f1dfbf]'>
              <span>{t('Enter dashboard')}</span>
              <ArrowUpRight className='size-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1' />
            </div>
          </div>
        </Link>
      </section>

      <section className='grid-flow-dense grid gap-4 px-5 pb-6 sm:px-8 md:grid-cols-6 md:px-10'>
        {quickActions.map((item, index) => {
          const Icon = item.icon
          const wide = index === 0 || index === 3

          return (
            <Link
              key={item.href}
              to={item.href}
              className={
                wide
                  ? 'group col-span-full overflow-hidden rounded-[1.35rem] bg-[#fbf7ef] p-6 ring-1 ring-[#d8ccbb] transition-transform duration-500 hover:-translate-y-1 md:col-span-3'
                  : 'group col-span-full overflow-hidden rounded-[1.35rem] bg-[#ebe0d0] p-6 ring-1 ring-[#d8ccbb] transition-transform duration-500 hover:-translate-y-1 md:col-span-3 lg:col-span-2'
              }
            >
              <div className='flex items-start justify-between gap-4'>
                <div className='flex size-11 items-center justify-center rounded-full bg-[#2e2b26] text-[#f7f1e8]'>
                  <Icon className='size-5' />
                </div>
                <ArrowUpRight className='size-4 text-[#8a7b68] transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1' />
              </div>
              <h2 className='mt-8 text-2xl font-semibold tracking-normal text-[#2e2b26]'>
                {t(item.title)}
              </h2>
              <p className='mt-3 max-w-md text-sm leading-6 text-[#6d6255]'>
                {t(item.description)}
              </p>
            </Link>
          )
        })}
      </section>

      <section className='px-5 pb-10 sm:px-8 md:px-10 md:pb-14'>
        <div className='grid gap-4 rounded-[1.5rem] bg-[#efe6d8] p-4 ring-1 ring-[#d6c8b6] md:grid-cols-3'>
          {insightLinks.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                to={item.href}
                className='group flex items-center justify-between rounded-[1.1rem] bg-[#f8f2e8] p-4 text-[#2e2b26] transition-colors hover:bg-[#fff8ed]'
              >
                <span className='flex items-center gap-3'>
                  <Icon className='size-4 text-[#81725f]' />
                  <span className='text-sm font-medium'>{t(item.title)}</span>
                </span>
                <ArrowUpRight className='size-4 text-[#81725f] transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1' />
              </Link>
            )
          })}
        </div>
      </section>

      <section className='px-5 pb-10 sm:px-8 md:px-10 md:pb-14'>
        <div className='flex flex-col gap-4 rounded-[1.5rem] border border-[#cfc0ad] bg-[#2f3542] p-6 text-[#f7f1e8] md:flex-row md:items-center md:justify-between'>
          <div>
            <div className='flex items-center gap-2 text-sm text-[#d8cdbc]'>
              <ShieldCheck className='size-4' />
              {t('Production readiness')}
            </div>
            <p className='mt-3 max-w-2xl text-2xl leading-tight font-semibold'>
              {t('Keep credentials current, monitor usage, and recharge before traffic peaks.')}
            </p>
          </div>
          <Button
            className='h-11 rounded-full bg-[#f1dfbf] px-5 text-[#2e2b26] hover:bg-[#ffe6b0]'
            render={<Link to='/wallet' />}
          >
            {t('Manage billing')}
          </Button>
        </div>
      </section>
    </main>
  )
}
