/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.
*/
import { memo, useCallback, useEffect, useState, type ReactNode } from 'react'
import { Activity, HelpCircle, Megaphone, RotateCw, Route } from 'lucide-react'
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

interface AdminPlatformPanelsProps {
  showApiInfo: boolean
  showAnnouncements: boolean
  showFAQ: boolean
  showUptime: boolean
}

function AdminPanel(props: {
  title: ReactNode
  description?: ReactNode
  loading?: boolean
  empty?: boolean
  emptyMessage: string
  height?: string
  actions?: ReactNode
  children: ReactNode
}) {
  const height = props.height ?? 'h-72'

  let content = props.children

  if (props.loading) {
    content = (
      <div className='p-4 sm:p-5'>
        <Skeleton className={cn('w-full', height)} />
      </div>
    )
  } else if (props.empty) {
    content = (
      <div
        className={cn(
          'text-muted-foreground flex items-center justify-center px-4 text-sm',
          height
        )}
      >
        {props.emptyMessage}
      </div>
    )
  }

  return (
    <div className='bg-card overflow-hidden rounded-2xl border shadow-xs'>
      <div className='border-b px-4 py-3 sm:px-5'>
        <div className='flex items-start justify-between gap-2'>
          <div className='flex flex-col gap-1'>
            <div className='text-sm font-semibold'>{props.title}</div>
            {props.description != null && (
              <div className='text-muted-foreground text-xs'>
                {props.description}
              </div>
            )}
          </div>
          {props.actions}
        </div>
      </div>

      {content}
    </div>
  )
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

function ApiInfoAdminPanel() {
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

  return (
    <AdminPanel
      title={
        <span className='flex items-center gap-2'>
          <Route className='text-muted-foreground/60 size-4' />
          {t('API Info')}
        </span>
      }
      description={t('Configured routes and latency checks')}
      loading={loading}
      empty={!list.length}
      emptyMessage={t('No API routes configured')}
    >
      <ScrollArea className='h-72'>
        {list.map((item: ApiInfoItem, idx: number) => (
          <div
            key={item.url}
            className={idx < list.length - 1 ? 'border-border/60 border-b' : ''}
          >
            <ApiInfoItemComponent
              item={item}
              status={pingStatus[item.url] || getDefaultPingStatus()}
              onTest={handleTest}
            />
          </div>
        ))}
      </ScrollArea>
    </AdminPanel>
  )
}

function AnnouncementsAdminPanel() {
  const { t } = useTranslation()
  const { items: list, loading } = useAnnouncements()
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<AnnouncementItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <AdminPanel
        title={
          <span className='flex items-center gap-2'>
            <Megaphone className='text-muted-foreground/60 size-4' />
            {t('Announcements')}
          </span>
        }
        description={t('Latest platform updates and notices')}
        loading={loading}
        empty={!list.length}
        emptyMessage={t('No announcements at this time')}
      >
        <ScrollArea className='h-72'>
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
                className={cn(
                  'group hover:bg-muted/40 w-full px-3 py-3 text-left transition-colors sm:px-5 sm:py-3.5',
                  idx < list.length - 1 && 'border-border/60 border-b'
                )}
              >
                <div className='flex items-start gap-2.5'>
                  <AnnouncementStatusDot type={item.type} />
                  <div className='flex min-w-0 flex-1 flex-col gap-1'>
                    <p className='line-clamp-1 text-sm font-medium'>
                      {getPreviewText(item.content)}
                    </p>
                    {item.publishDate && (
                      <time className='text-muted-foreground/60 text-xs'>
                        {formatDateTimeObject(new Date(item.publishDate))}
                      </time>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </ScrollArea>
      </AdminPanel>
      <AnnouncementDetailModal
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        announcement={selectedAnnouncement}
      />
    </>
  )
}

const STATUS_COLOR_MAP: Record<number, string> = {
  1: 'bg-emerald-500',
  0: 'bg-red-500',
  2: 'bg-amber-500',
  3: 'bg-blue-500',
}

function UptimeAdminPanel() {
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

  return (
    <AdminPanel
      title={
        <span className='flex items-center gap-2'>
          <Activity className='text-muted-foreground/60 size-4' />
          {t('Uptime')}
        </span>
      }
      description={t('Grouped monitor status from Uptime Kuma')}
      loading={loading}
      empty={!groups.length}
      emptyMessage={t('No uptime monitoring configured')}
      height='h-80'
      actions={
        <Button
          variant='ghost'
          size='sm'
          onClick={handleRefresh}
          disabled={refreshing}
          className='size-7 p-0'
        >
          <RotateCw
            className={cn('size-3.5', refreshing && 'animate-spin')}
            aria-label={t('Refresh')}
          />
        </Button>
      }
    >
      <ScrollArea className='h-80'>
        {groups.map((group) => (
          <div key={group.categoryName}>
            <div className='bg-muted/30 border-border/60 border-b px-3 py-2 sm:px-5'>
              <div className='flex items-center gap-2'>
                <h4 className='text-muted-foreground text-xs font-semibold tracking-wider uppercase'>
                  {group.categoryName}
                </h4>
                <span className='text-muted-foreground/40 font-mono text-xs tabular-nums'>
                  {group.monitors?.length || 0}
                </span>
              </div>
            </div>
            {group.monitors?.map((monitor: UptimeMonitor) => (
              <div
                key={monitor.name}
                className='hover:bg-muted/40 flex items-center justify-between gap-2 border-b px-3 py-2 transition-colors last:border-b-0 sm:px-5 sm:py-2.5'
              >
                <div className='flex min-w-0 items-center gap-2.5'>
                  <span
                    className={cn(
                      'inline-block size-2 rounded-full',
                      STATUS_COLOR_MAP[monitor.status] ?? 'bg-muted-foreground/40'
                    )}
                  />
                  <span className='truncate text-sm'>{monitor.name}</span>
                </div>
                <span className='text-foreground shrink-0 font-mono text-sm font-semibold tabular-nums'>
                  {((monitor.uptime ?? 0) * 100).toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        ))}
      </ScrollArea>
    </AdminPanel>
  )
}

function FAQAdminPanel() {
  const { t } = useTranslation()
  const { items: list, loading } = useFAQ()

  return (
    <AdminPanel
      title={
        <span className='flex items-center gap-2'>
          <HelpCircle className='text-muted-foreground/60 size-4' />
          {t('FAQ')}
        </span>
      }
      description={t('Answers for common access and billing questions')}
      loading={loading}
      empty={!list.length}
      emptyMessage={t('No FAQ entries available')}
      height='h-80'
    >
      <ScrollArea className='h-80'>
        <Accordion className='w-full px-4 sm:px-5'>
          {list.map((item: FAQItem, idx: number) => {
            const key = item.id ?? `faq-${idx}`
            return (
              <AccordionItem
                key={key}
                value={`item-${key}`}
                className='border-border/60'
              >
                <AccordionTrigger className='text-start hover:no-underline'>
                  <Markdown className='text-sm leading-relaxed font-semibold'>
                    {item.question}
                  </Markdown>
                </AccordionTrigger>
                <AccordionContent>
                  <Markdown className='text-muted-foreground/60 text-sm'>
                    {item.answer}
                  </Markdown>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </ScrollArea>
    </AdminPanel>
  )
}

export function AdminPlatformPanels(props: AdminPlatformPanelsProps) {
  const showLeft = props.showApiInfo || props.showAnnouncements || props.showFAQ

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4',
        showLeft && props.showUptime && 'xl:grid-cols-[minmax(0,1fr)_22rem]'
      )}
    >
      {showLeft && (
        <div
          className={cn(
            'grid min-w-0 grid-cols-1 gap-4',
            (props.showApiInfo || props.showAnnouncements || props.showFAQ) &&
              'lg:grid-cols-2'
          )}
        >
          {props.showApiInfo && <ApiInfoAdminPanel />}
          {props.showAnnouncements && <AnnouncementsAdminPanel />}
          {props.showFAQ && <FAQAdminPanel />}
        </div>
      )}
      {props.showUptime && <UptimeAdminPanel />}
    </div>
  )
}
