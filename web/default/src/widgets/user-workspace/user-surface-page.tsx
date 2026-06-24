/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.
*/
import { cn } from '@shared/lib/utils'

type UserSurfacePageProps = {
  eyebrow: string
  title: string
  description: string
  children: React.ReactNode
  className?: string
  contentClassName?: string
  compact?: boolean
  showHeader?: boolean
}

export function UserSurfacePage(props: UserSurfacePageProps) {
  return (
    <main
      className={cn(
        'relative min-h-[calc(100svh-8rem)] overflow-hidden rounded-[2rem] bg-[#f4efe7] text-[#2e2b26] shadow-[0_24px_80px_rgba(62,50,36,0.10)] ring-1 ring-[#d8ccbb]',
        props.className
      )}
    >
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_8%,rgba(228,210,180,0.86),transparent_30%),radial-gradient(circle_at_88%_12%,rgba(52,61,78,0.14),transparent_28%),linear-gradient(135deg,#f8f2e8_0%,#efe4d4_54%,#d9cab7_100%)]' />
      <div className='pointer-events-none absolute right-[-10%] top-[-18%] h-80 w-80 rounded-full bg-[#2f3542]/10 blur-3xl' />

      {props.showHeader !== false && (
        <section
          className={cn(
            'relative px-5 pt-10 sm:px-8 md:px-10',
            props.compact ? 'pb-5' : 'pb-8 md:pt-14 md:pb-10'
          )}
        >
          <p className='text-xs font-medium uppercase tracking-[0.24em] text-[#81725f]'>
            {props.eyebrow}
          </p>
          <div className='mt-4 grid gap-5 lg:grid-cols-[minmax(0,0.78fr)_minmax(280px,0.42fr)] lg:items-end'>
            <h1 className='max-w-5xl text-[clamp(2.3rem,4vw,4.45rem)] leading-[0.98] font-semibold tracking-normal text-[#2e2b26]'>
              {props.title}
            </h1>
            <p className='max-w-xl text-sm leading-7 text-[#62594d] md:text-base md:leading-8'>
              {props.description}
            </p>
          </div>
        </section>
      )}

      <section
        className={cn(
          'relative px-5 py-5 sm:px-8 md:px-10 md:py-10',
          '[&_[data-slot=card]]:rounded-[1.25rem] [&_[data-slot=card]]:bg-[#fbf7ef]/92 [&_[data-slot=card]]:shadow-[0_18px_55px_rgba(62,50,36,0.08)] [&_[data-slot=card]]:ring-[#d8ccbb]',
          '[&_[data-slot=card-header]]:border-[#d8ccbb] [&_[data-slot=card-footer]]:border-[#d8ccbb] [&_[data-slot=card-footer]]:bg-[#efe6d8]/70',
          '[&_[data-slot=button]]:rounded-full [&_[data-slot=input]]:rounded-full [&_[data-slot=input]]:border-[#cdbda8] [&_[data-slot=input]]:bg-[#fffaf2]',
          '[&_.bg-card]:bg-[#fbf7ef]/92 [&_.bg-background]:bg-[#f4efe7] [&_.border]:border-[#d8ccbb]',
          '[&_.text-foreground]:text-[#2e2b26] [&_.text-muted-foreground]:text-[#6d6255]',
          props.contentClassName
        )}
      >
        {props.children}
      </section>
    </main>
  )
}
