/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.
*/
import { Link } from '@tanstack/react-router'
import {
  ArrowUpRight,
  BookOpenText,
  CreditCard,
  FlaskConical,
  Key,
  LineChart,
  ShieldCheck,
  Sparkles,
  User,
  Wallet,
} from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@domains/identity/store/auth-store'
import { formatCompactNumber, formatQuota } from '@shared/lib/format'
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

const insightLinks = [
  { title: 'Usage logs', href: '/usage-logs/common', icon: LineChart },
  { title: 'Profile', href: '/profile', icon: User },
  { title: 'Documentation', href: '/docs', icon: BookOpenText },
] as const

export function UserConsole() {
  const { t } = useTranslation()
  const user = useAuthStore((state) => state.auth.user)

  const displayName = user?.display_name || user?.username || t('there')
  const remainingQuota = user?.quota ?? 0
  const usedQuota = user?.used_quota ?? 0
  const requestCount = user?.request_count ?? 0

  const usagePercent = useMemo(() => {
    const total = remainingQuota + usedQuota
    if (total <= 0) return 0
    return Math.min(100, Math.round((usedQuota / total) * 100))
  }, [remainingQuota, usedQuota])

  return (
    <main className='min-h-[calc(100svh-8rem)] overflow-x-hidden rounded-[2rem] bg-[#f4efe7] text-[#2e2b26] shadow-[0_24px_80px_rgba(62,50,36,0.10)] ring-1 ring-[#d8ccbb]'>
      <section className='relative isolate overflow-hidden px-5 py-10 sm:px-8 md:px-10 md:py-14'>
        <div className='absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(221,203,174,0.75),transparent_34%),radial-gradient(circle_at_88%_18%,rgba(81,89,102,0.16),transparent_32%),linear-gradient(135deg,#f7f1e8_0%,#ece2d3_54%,#d9ccba_100%)]' />
        <div className='absolute right-10 top-8 -z-10 hidden h-44 w-44 rounded-full bg-[#fbf7ef]/50 blur-3xl md:block' />

        <div className='grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.64fr)] lg:items-end'>
          <div className='max-w-4xl'>
            <p className='mb-5 text-sm font-medium uppercase tracking-[0.24em] text-[#81725f]'>
              {t('Personal console')}
            </p>
            <h1 className='max-w-4xl text-[clamp(2.6rem,5vw,5.25rem)] leading-[0.96] font-semibold tracking-normal text-[#2e2b26]'>
              {t('Welcome back, {{name}}. Your API workspace is ready.', {
                name: displayName,
              })}
            </h1>
            <p className='mt-6 max-w-2xl text-base leading-8 text-[#62594d] md:text-lg'>
              {t(
                'Manage keys, balance, model access, and testing from a quieter workspace built for daily production use.'
              )}
            </p>
            <div className='mt-8 flex flex-wrap gap-3'>
              <Button
                className='h-11 rounded-full bg-[#2e2b26] px-5 text-[#f7f1e8] hover:bg-[#4a4238]'
                render={<Link to='/keys' />}
              >
                {t('Create API key')}
                <ArrowUpRight className='size-4' />
              </Button>
              <Button
                variant='outline'
                className='h-11 rounded-full border-[#b9ab98] bg-[#f8f2e8]/70 px-5 text-[#2e2b26] hover:bg-[#efe5d6]'
                render={<Link to='/playground' />}
              >
                {t('Open Playground')}
              </Button>
            </div>
          </div>

          <div className='rounded-[1.5rem] bg-[#2f3542] p-5 text-[#f7f1e8] shadow-2xl shadow-[#6d5d47]/20'>
            <div className='flex items-center justify-between gap-4'>
              <div>
                <p className='text-sm text-[#cfc5b7]'>{t('Available balance')}</p>
                <p className='mt-2 text-4xl font-semibold tracking-normal'>
                  {formatQuota(remainingQuota)}
                </p>
              </div>
              <div className='flex size-12 items-center justify-center rounded-full bg-[#f1dfbf]/15'>
                <Sparkles className='size-5 text-[#f1dfbf]' />
              </div>
            </div>
            <div className='mt-8 space-y-3'>
              <div className='flex items-center justify-between text-sm text-[#d8cdbc]'>
                <span>{t('Consumed')}</span>
                <span>{usagePercent}%</span>
              </div>
              <div className='h-2 overflow-hidden rounded-full bg-[#f7f1e8]/12'>
                <div
                  className='h-full rounded-full bg-[#e7cf9b]'
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            </div>
            <div className='mt-8 grid grid-cols-2 gap-3 text-sm'>
              <div className='rounded-2xl bg-[#f7f1e8]/8 p-4'>
                <p className='text-[#cfc5b7]'>{t('Used quota')}</p>
                <p className='mt-2 text-lg font-medium'>{formatQuota(usedQuota)}</p>
              </div>
              <div className='rounded-2xl bg-[#f7f1e8]/8 p-4'>
                <p className='text-[#cfc5b7]'>{t('Requests')}</p>
                <p className='mt-2 text-lg font-medium'>
                  {formatCompactNumber(requestCount)}
                </p>
              </div>
            </div>
          </div>
        </div>
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
