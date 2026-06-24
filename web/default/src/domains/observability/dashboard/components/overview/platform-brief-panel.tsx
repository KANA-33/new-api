/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.
*/
import { memo, useCallback, useEffect, useState } from 'react'
import {
  Activity,
  HelpCircle,
  Megaphone,
  RadioTower,
  RotateCw,
  Route,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getAnnouncementColorClass } from '@shared/lib/colors'
import { formatDateTimeObject } from '@shared/lib/time'
import { cn } from '@shared/lib/utils'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@shared/ui/primitives/accordion'
import { Button } from '@shared/ui/primitives/button'
import { Markdown } from '@shared/ui/primitives/markdown'
import { ScrollArea } from '@shared/ui/primitives/scroll-area'
import { Skeleton } from '@shared/ui/primitives/skeleton'
import { getUptimeStatus } from '../../api'
import {
  useAnnouncements,
  useApiInfo,
  useFAQ,
} from '../../hooks/use-status-data'
import {
  getDefaultPingStatus,
  testUrlLatency,
} from '../../lib/api-info'
import { getPreviewText } from '../../lib/text'
import type {
  AnnouncementItem,
  ApiInfoItem,
  FAQItem,
  PingStatusMap,
  UptimeGroupResult,
  UptimeMonitor,
} from '../../types'
import { AnnouncementDetailModal } from './announcement-detail-dialog'
import { ApiInfoItemComponent } from './api-info-item'

interface PlatformBriefPanelProps {
  showApiInfo: boolean
  showAnnouncements: boolean
  showFAQ: boolean
  showUptime: boolean
}

const STATUS_COLOR_MAP: Record<number, string> = {
  1: 'bg-emerald-500',
  0: 'bg-rose-500',
  2: 'bg-amber-500',
  3: 'bg-sky-500',
}

const AnnouncementStatusDot = memo(function AnnouncementStatusDot(props: {
  type?: string
}) {
  return (
    <span
      className={cn(
        'mt-1.5 inline-block size-2 shrink-0 rounded-full',
        getAnnouncementColorClass(props.type)
      )}
    />
  )
})

function BriefSection(props: {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
  className?: string
}) {
  const Icon = props.icon

  return (
    <section className={cn('scroll-mt-4', props.className)}>
      <div className='mb-3 flex items-start gap-3'>
        <span className='flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#302c26] text-[#f8efe1] shadow-[0_12px_32px_rgba(54,45,35,0.18)]'>
          <Icon className='size-4' />
        </span>
        <div className='min-w-0'>
          <h3 className='text-sm font-semibold tracking-normal text-[#302c26]'>
            {props.title}
          </h3>
          <p className='mt-0.5 text-xs leading-5 text-[#756958]'>
            {props.description}
          </p>
        </div>
      </div>
      {props.children}
    </section>
  )
}

function SectionState(props: { loading?: boolean; empty?: boolean; message: string }) {
  if (props.loading) {
    return (
      <div className='grid gap-2 rounded-2xl bg-[#fff9ef]/80 p-3 ring-1 ring-[#ded0bd]'>
        <Skeleton className='h-4 w-28 bg-[#d8c9b5]' />
        <Skeleton className='h-12 w-full bg-[#e6d9c8]' />
        <Skeleton className='h-4 w-2/3 bg-[#d8c9b5]' />
      </div>
    )
  }

  if (props.empty) {
    return (
      <div className='rounded-2xl bg-[#fff9ef]/75 px-4 py-5 text-sm text-[#7a6d5b] ring-1 ring-[#ded0bd]'>
        {props.message}
      </div>
    )
  }

  return null
}

function ApiBrief() {
  const { t } = useTranslation()
  const { items: list, loading } = useApiInfo()
  const [pingStatus, setPingStatus] = useState<PingStatusMap>({})

  const handleTest = useCallback(async (url: string) => {
    setPingStatus((prev) => ({
      ...prev,
      [url]: { latency: null, testing: true, error: false },
    }))

    const result = await testUrlLatency(url)
    setPingStatus((prev) => ({ ...prev, [url]: result }))
  }, [])

  const state = (
    <SectionState
      loading={loading}
      empty={!list.length}
      message={t('No API routes configured')}
    />
  )
  if (state) return state

  return (
    <div className='overflow-hidden rounded-2xl bg-[#fff9ef]/80 ring-1 ring-[#ded0bd]'>
      {list.map((item: ApiInfoItem, idx: number) => (
        <div
          key={item.url}
          className={cn(idx < list.length - 1 && 'border-b border-[#e0d3c2]')}
        >
          <ApiInfoItemComponent
            item={item}
            status={pingStatus[item.url] || getDefaultPingStatus()}
            onTest={handleTest}
          />
        </div>
      ))}
    </div>
  )
}

function AnnouncementsBrief() {
  const { t } = useTranslation()
  const { items: list, loading } = useAnnouncements()
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<AnnouncementItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const state = (
    <SectionState
      loading={loading}
      empty={!list.length}
      message={t('No announcements at this time')}
    />
  )
  if (state) return state

  return (
    <>
      <div className='grid gap-2'>
        {list.map((item: AnnouncementItem, idx: number) => {
          const key = item.id ?? `announcement-${idx}`
          return (
            <button
              key={key}
              type='button'
              onClick={() => {
                setSelectedAnnouncement(item)
                setIsDialogOpen(true)
              }}
              className='group rounded-2xl bg-[#fff9ef]/80 px-4 py-3 text-left ring-1 ring-[#ded0bd] transition duration-300 hover:-translate-y-0.5 hover:bg-[#fff4e3]'
            >
              <div className='flex items-start gap-3'>
                <AnnouncementStatusDot type={item.type} />
                <div className='min-w-0 flex-1'>
                  <p className='line-clamp-2 text-sm leading-5 font-medium text-[#302c26]'>
                    {getPreviewText(item.content)}
                  </p>
                  {item.publishDate && (
                    <time className='mt-2 block text-xs text-[#8b7d69]'>
                      {formatDateTimeObject(new Date(item.publishDate))}
                    </time>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>
      <AnnouncementDetailModal
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        announcement={selectedAnnouncement}
      />
    </>
  )
}

function UptimeBrief() {
  const { t } = useTranslation()
  const [groups, setGroups] = useState<UptimeGroupResult[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const abortController = new AbortController()

    void getUptimeStatus()
      .then((res) => {
        if (abortController.signal.aborted) return
        setGroups(res?.data || [])
      })
      .catch(() => {
        if (abortController.signal.aborted) return
        setGroups([])
      })
      .finally(() => {
        if (!abortController.signal.aborted) setLoading(false)
      })

    return () => abortController.abort()
  }, [])

  const handleRefresh = () => {
    const abortController = new AbortController()
    setRefreshing(true)

    void getUptimeStatus()
      .then((res) => {
        if (abortController.signal.aborted) return
        setGroups(res?.data || [])
      })
      .catch(() => {
        if (abortController.signal.aborted) return
        setGroups([])
      })
      .finally(() => {
        if (!abortController.signal.aborted) setRefreshing(false)
      })
  }

  const state = (
    <SectionState
      loading={loading}
      empty={!groups.length}
      message={t('No uptime monitoring configured')}
    />
  )
  if (state) return state

  return (
    <div className='overflow-hidden rounded-2xl bg-[#fff9ef]/80 ring-1 ring-[#ded0bd]'>
      <div className='flex items-center justify-between border-b border-[#e0d3c2] px-4 py-3'>
        <span className='text-xs font-medium text-[#756958]'>
          {t('Live monitor groups')}
        </span>
        <Button
          variant='ghost'
          size='sm'
          onClick={handleRefresh}
          disabled={refreshing}
          className='size-8 rounded-full text-[#756958] hover:bg-[#eee1ce]'
        >
          <RotateCw
            className={cn('size-3.5', refreshing && 'animate-spin')}
            aria-label={t('Refresh')}
          />
        </Button>
      </div>
      {groups.map((group) => (
        <div key={group.categoryName} className='border-b border-[#e0d3c2] last:border-b-0'>
          <div className='bg-[#f3eadc] px-4 py-2'>
            <div className='flex items-center justify-between gap-3'>
              <h4 className='text-xs font-semibold tracking-[0.12em] text-[#756958] uppercase'>
                {group.categoryName}
              </h4>
              <span className='font-mono text-xs text-[#8b7d69]'>
                {group.monitors?.length || 0}
              </span>
            </div>
          </div>
          {group.monitors?.map((monitor: UptimeMonitor) => (
            <div
              key={monitor.name}
              className='flex items-center justify-between gap-3 px-4 py-2.5'
            >
              <div className='flex min-w-0 items-center gap-2.5'>
                <span
                  className={cn(
                    'inline-block size-2 rounded-full',
                    STATUS_COLOR_MAP[monitor.status] ?? 'bg-[#8b7d69]'
                  )}
                />
                <span className='truncate text-sm text-[#302c26]'>
                  {monitor.name}
                </span>
              </div>
              <span className='shrink-0 font-mono text-sm font-semibold text-[#302c26] tabular-nums'>
                {((monitor.uptime ?? 0) * 100).toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function FAQBrief() {
  const { t } = useTranslation()
  const { items: list, loading } = useFAQ()

  const state = (
    <SectionState
      loading={loading}
      empty={!list.length}
      message={t('No FAQ entries available')}
    />
  )
  if (state) return state

  return (
    <Accordion className='rounded-2xl bg-[#fff9ef]/80 px-4 ring-1 ring-[#ded0bd]'>
      {list.map((item: FAQItem, idx: number) => {
        const key = item.id ?? `faq-${idx}`
        return (
          <AccordionItem
            key={key}
            value={`item-${key}`}
            className='border-[#e0d3c2]'
          >
            <AccordionTrigger className='text-start hover:no-underline'>
              <Markdown className='text-sm leading-relaxed font-semibold text-[#302c26]'>
                {item.question}
              </Markdown>
            </AccordionTrigger>
            <AccordionContent>
              <Markdown className='text-sm leading-6 text-[#756958]'>
                {item.answer}
              </Markdown>
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}

export function PlatformBriefPanel(props: PlatformBriefPanelProps) {
  const { t } = useTranslation()

  return (
    <aside className='overflow-hidden rounded-[1.75rem] bg-[#efe4d4] shadow-[0_30px_80px_rgba(74,59,41,0.14)] ring-1 ring-[#d5c4ad]'>
      <div className='border-b border-[#d8c8b4] bg-[#f7efe4] px-5 py-5'>
        <div className='flex items-center gap-3'>
          <span className='flex size-10 items-center justify-center rounded-full bg-[#302c26] text-[#f8efe1]'>
            <RadioTower className='size-4' />
          </span>
          <div>
            <p className='text-xs font-medium tracking-[0.18em] text-[#8b7d69] uppercase'>
              {t('Platform brief')}
            </p>
            <h2 className='mt-1 text-xl font-semibold tracking-normal text-[#302c26]'>
              {t('Signals, notices, and help')}
            </h2>
          </div>
        </div>
      </div>

      <ScrollArea className='h-[38rem]'>
        <div className='grid gap-6 p-5'>
          {props.showApiInfo && (
            <BriefSection
              title={t('API Info')}
              description={t('Configured routes and latency checks')}
              icon={Route}
            >
              <ApiBrief />
            </BriefSection>
          )}

          {props.showAnnouncements && (
            <BriefSection
              title={t('Announcements')}
              description={t('Latest platform updates and notices')}
              icon={Megaphone}
            >
              <AnnouncementsBrief />
            </BriefSection>
          )}

          {props.showUptime && (
            <BriefSection
              title={t('Uptime')}
              description={t('Grouped monitor status from Uptime Kuma')}
              icon={Activity}
            >
              <UptimeBrief />
            </BriefSection>
          )}

          {props.showFAQ && (
            <BriefSection
              title={t('FAQ')}
              description={t('Answers for common access and billing questions')}
              icon={HelpCircle}
            >
              <FAQBrief />
            </BriefSection>
          )}
        </div>
      </ScrollArea>
    </aside>
  )
}
