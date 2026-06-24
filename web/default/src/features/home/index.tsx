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
  BadgeCheck,
  Blocks,
  LineChart,
  LockKeyhole,
  Sparkles,
  WalletCards,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@domains/identity/store/auth-store'
import { Markdown } from '@shared/ui/primitives/markdown'
import { Button } from '@shared/ui/primitives/button'
import { PublicLayout } from '@widgets/layout'
import { Footer } from '@widgets/layout/components/footer'
import { useHomePageContent } from './hooks'

const capabilities = [
  {
    title: 'Unified model access',
    body: 'Route requests across providers while keeping one account, one balance, and one operational surface.',
    icon: Blocks,
    image: 'https://picsum.photos/seed/oatmeal-console/960/720',
  },
  {
    title: 'Credential discipline',
    body: 'Create scoped keys, rotate them safely, and keep production traffic separated from experiments.',
    icon: LockKeyhole,
    image: 'https://picsum.photos/seed/champagne-keys/960/720',
  },
  {
    title: 'Clear consumption signals',
    body: 'Understand spend, requests, and remaining credit without digging through administrative screens.',
    icon: LineChart,
    image: 'https://picsum.photos/seed/taupe-analytics/960/720',
  },
  {
    title: 'Billing that stays close',
    body: 'Recharge, subscribe, and review billing history in a calm workspace designed for repeat use.',
    icon: WalletCards,
    image: 'https://picsum.photos/seed/parchment-billing/960/720',
  },
] as const

const accordions = [
  'Stable routing for daily API traffic',
  'Playground experiments before production',
  'Personal balance, subscriptions, and rewards',
  'Administrator controls remain unchanged',
] as const

export function Home() {
  const { t } = useTranslation()
  const { auth } = useAuthStore()
  const isAuthenticated = !!auth.user
  const { content, isLoaded, isUrl } = useHomePageContent()

  if (!isLoaded) {
    return (
      <PublicLayout showMainContainer={false}>
        <main className='flex min-h-screen items-center justify-center bg-[#f4efe7] text-[#62594d]'>
          <div>{t('Loading...')}</div>
        </main>
      </PublicLayout>
    )
  }

  if (content) {
    return (
      <PublicLayout showMainContainer={false}>
        <main className='w-full max-w-full overflow-x-hidden bg-[#f4efe7]'>
          {isUrl ? (
            <iframe
              src={content}
              className='h-screen w-full border-none'
              title={t('Custom Home Page')}
            />
          ) : (
            <div className='container mx-auto py-8'>
              <Markdown className='custom-home-content'>{content}</Markdown>
            </div>
          )}
        </main>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout showMainContainer={false}>
      <main className='w-full max-w-full overflow-x-hidden bg-[#f4efe7] text-[#2e2b26]'>
        <section className='relative isolate min-h-[92svh] overflow-hidden px-5 pt-32 pb-24 sm:px-8 md:px-12 md:pt-40'>
          <div className='absolute inset-0 -z-10 bg-[radial-gradient(circle_at_16%_18%,rgba(229,210,178,0.9),transparent_32%),radial-gradient(circle_at_78%_12%,rgba(63,70,84,0.18),transparent_28%),linear-gradient(135deg,#f7f1e8_0%,#ede3d2_52%,#d8c9b6_100%)]' />
          <div className='absolute bottom-0 right-0 -z-10 h-[58rem] w-[46rem] translate-x-1/4 rounded-full bg-[#2f3542]/10 blur-3xl' />

          <div className='mx-auto grid max-w-7xl gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.72fr)] lg:items-end'>
            <div>
              <p className='mb-7 max-w-xl text-sm leading-7 tracking-[0.24em] text-[#81725f] uppercase'>
                {t('A quieter way to operate model access')}
              </p>
              <h1 className='max-w-6xl text-[clamp(3rem,5vw,5.5rem)] leading-[0.95] font-semibold tracking-normal text-[#2e2b26]'>
                {t('Premium AI infrastructure, shaped for everyday momentum.')}
              </h1>
              <p className='mt-8 max-w-2xl text-lg leading-9 text-[#62594d]'>
                {t(
                  'A warm, precise workspace for API keys, model routing, usage insight, and billing. Ordinary users get a refined front office; administrators keep the full control room.'
                )}
              </p>
              <div className='mt-10 flex flex-wrap gap-3'>
                <Button
                  className='h-12 rounded-full bg-[#2e2b26] px-6 text-[#f7f1e8] hover:bg-[#4a4238]'
                  render={<Link to={isAuthenticated ? '/dashboard' : '/sign-in'} />}
                >
                  {isAuthenticated ? t('Enter console') : t('Start now')}
                  <ArrowUpRight className='size-4' />
                </Button>
                <Button
                  variant='outline'
                  className='h-12 rounded-full border-[#b9ab98] bg-[#f8f2e8]/70 px-6 text-[#2e2b26] hover:bg-[#efe5d6]'
                  render={<Link to='/pricing' />}
                >
                  {t('View model pricing')}
                </Button>
              </div>
            </div>

            <div className='group relative overflow-hidden rounded-[2rem] bg-[#2f3542] p-3 shadow-[0_32px_100px_rgba(62,50,36,0.22)]'>
              <img
                src='https://picsum.photos/seed/midnight-editorial-api/1120/1320'
                alt=''
                className='h-[34rem] w-full rounded-[1.45rem] object-cover opacity-90 grayscale contrast-125 transition-transform duration-700 ease-out group-hover:scale-105'
              />
              <div className='absolute inset-3 rounded-[1.45rem] bg-gradient-to-t from-[#252a34]/85 via-[#252a34]/10 to-transparent' />
              <div className='absolute right-8 bottom-8 left-8 text-[#f7f1e8]'>
                <p className='text-sm text-[#d8cdbc]'>{t('Current surface')}</p>
                <p className='mt-2 text-3xl leading-tight font-semibold'>
                  {t('Frontend for users. Full platform management for admins.')}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className='px-5 py-32 sm:px-8 md:px-12 md:py-44'>
          <div className='mx-auto max-w-7xl'>
            <h2 className='max-w-5xl text-[clamp(2.4rem,4vw,4.5rem)] leading-none font-semibold tracking-normal'>
              {t('Everything ordinary users need, without the weight of an admin console.')}
            </h2>

            <div className='mt-16 grid-flow-dense grid gap-4 md:grid-cols-6'>
              {capabilities.map((item, index) => {
                const Icon = item.icon
                let className = 'md:col-span-3 lg:col-span-2'
                if (index === 0) {
                  className = 'md:col-span-3 md:row-span-2'
                } else if (index === 1) {
                  className = 'md:col-span-3'
                }

                return (
                  <article
                    key={item.title}
                    className={`${className} group overflow-hidden rounded-[1.5rem] bg-[#fbf7ef] ring-1 ring-[#d8ccbb]`}
                  >
                    <div className='overflow-hidden'>
                      <img
                        src={item.image}
                        alt=''
                        className='h-56 w-full object-cover opacity-85 grayscale contrast-125 transition-transform duration-700 ease-out group-hover:scale-105'
                      />
                    </div>
                    <div className='p-6'>
                      <div className='flex size-11 items-center justify-center rounded-full bg-[#2e2b26] text-[#f7f1e8]'>
                        <Icon className='size-5' />
                      </div>
                      <h3 className='mt-7 text-2xl font-semibold tracking-normal'>
                        {t(item.title)}
                      </h3>
                      <p className='mt-3 text-sm leading-7 text-[#6d6255]'>
                        {t(item.body)}
                      </p>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className='px-5 py-32 sm:px-8 md:px-12 md:py-44'>
          <div className='mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.72fr_1fr] lg:items-start'>
            <div className='lg:sticky lg:top-28'>
              <h2 className='max-w-xl text-[clamp(2.4rem,4vw,4.3rem)] leading-none font-semibold tracking-normal'>
                {t('Soft on the eyes. Hard on operational ambiguity.')}
              </h2>
              <p className='mt-6 max-w-md text-base leading-8 text-[#62594d]'>
                {t(
                  'The ordinary user surface becomes calmer and more editorial, while every platform-management pathway remains available to administrators.'
                )}
              </p>
            </div>

            <div className='space-y-4'>
              {accordions.map((item) => (
                <div
                  key={item}
                  className='group overflow-hidden rounded-[1.5rem] bg-[#efe6d8] p-6 ring-1 ring-[#d6c8b6] transition-all duration-700 hover:bg-[#fbf7ef] lg:hover:translate-x-3'
                >
                  <div className='flex items-center justify-between gap-6'>
                    <p className='text-2xl font-semibold tracking-normal'>
                      {t(item)}
                    </p>
                    <BadgeCheck className='size-5 shrink-0 text-[#81725f]' />
                  </div>
                  <p className='mt-5 max-w-2xl text-sm leading-7 text-[#6d6255] opacity-80 transition-opacity duration-700 group-hover:opacity-100'>
                    {t(
                      'Designed as a daily-use control surface: restrained contrast, warm materials, and direct access to the workflows users repeat most.'
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className='px-5 py-32 sm:px-8 md:px-12 md:py-44'>
          <div className='mx-auto overflow-hidden rounded-[2rem] bg-[#2f3542] px-6 py-16 text-[#f7f1e8] shadow-[0_32px_100px_rgba(47,53,66,0.25)] md:px-12 md:py-24'>
            <div className='flex max-w-5xl flex-col gap-8'>
              <Sparkles className='size-8 text-[#e7cf9b]' />
              <h2 className='text-[clamp(2.5rem,5vw,5rem)] leading-none font-semibold tracking-normal'>
                {t('A premium front office for users. The same command center for admins.')}
              </h2>
              <div className='flex flex-wrap gap-3'>
                <Button
                  className='h-12 rounded-full bg-[#f1dfbf] px-6 text-[#2e2b26] hover:bg-[#ffe6b0]'
                  render={<Link to={isAuthenticated ? '/dashboard' : '/sign-in'} />}
                >
                  {isAuthenticated ? t('Open console') : t('Create account')}
                </Button>
                <Button
                  variant='outline'
                  className='h-12 rounded-full border-[#f7f1e8]/25 bg-transparent px-6 text-[#f7f1e8] hover:bg-[#f7f1e8]/10'
                  render={<Link to='/about' />}
                >
                  {t('Learn more')}
                </Button>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </PublicLayout>
  )
}
