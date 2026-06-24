/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.
*/
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@domains/identity/store/auth-store'
import { ROLE } from '@shared/lib/roles'
import { SectionPageLayout } from '@widgets/layout'
import { UserSurfacePage } from '@widgets/user-workspace'
import { ApiKeysDialogs } from './components/api-keys-dialogs'
import { ApiKeysPrimaryButtons } from './components/api-keys-primary-buttons'
import { ApiKeysProvider } from './components/api-keys-provider'
import { ApiKeysTable } from './components/api-keys-table'

export function ApiKeys() {
  const { t } = useTranslation()
  const isAdmin = useAuthStore(
    (state) => (state.auth.user?.role ?? 0) >= ROLE.ADMIN
  )

  const content = (
    <SectionPageLayout fixedContent>
      <SectionPageLayout.Title>{t('API Keys')}</SectionPageLayout.Title>
      <SectionPageLayout.Actions>
        <ApiKeysPrimaryButtons />
      </SectionPageLayout.Actions>
      <SectionPageLayout.Content>
        <ApiKeysTable />
      </SectionPageLayout.Content>
    </SectionPageLayout>
  )

  return (
    <ApiKeysProvider>
      {isAdmin ? (
        content
      ) : (
        <UserSurfacePage
          eyebrow={t('API keys')}
          title={t('Production credentials, kept precise.')}
          description={t(
            'Create, rotate, limit, and audit keys from a calmer credential workspace.'
          )}
          compact
          showHeader={false}
        >
          {content}
        </UserSurfacePage>
      )}

      <ApiKeysDialogs />
    </ApiKeysProvider>
  )
}
