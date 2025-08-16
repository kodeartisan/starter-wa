// src/features/tools/backup-chat/PageChatBackup.tsx
import LayoutPage from '@/components/Layout/LayoutPage'
import { Icon } from '@iconify/react'
import {
  Card,
  Divider,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import React from 'react'
import BackupOptions from './components/BackupOptions'
import BackupProgress from './components/BackupProgress'
import BackupResult from './components/BackupResult'
import { useChatBackup } from './hooks/useChatBackup'

const PageChatBackup: React.FC = () => {
  const backup = useChatBackup()

  const renderContent = () => {
    if (backup.isBackingUp) {
      return (
        <BackupProgress
          progress={backup.progress}
          onCancel={backup.cancelBackup}
        />
      )
    }
    if (backup.backupResult) {
      return (
        <BackupResult
          result={backup.backupResult}
          onDone={backup.clearBackupResult}
        />
      )
    }
    return <BackupOptions backupHook={backup} onStart={backup.startBackup} />
  }

  // ADDED: A Data Privacy Guarantee card to build trust on the main feature page.
  const PrivacyGuarantee = () => (
    <Card withBorder radius="md" p="md" shadow="none" mt="xl">
      <Stack>
        <Group justify="space-between">
          <Title order={5}>Data Privacy Guarantee</Title>
          <ThemeIcon variant="light" color="teal">
            <Icon icon="tabler:shield-check" fontSize={20} />
          </ThemeIcon>
        </Group>
        <Divider />
        <Text size="sm" c="dimmed">
          100% Privacy. All your data is processed and stored only on your
          computer. It is never sent to our servers.
        </Text>
      </Stack>
    </Card>
  )

  return (
    <LayoutPage width={700}>
      <Stack>
        {renderContent()}
        {/* ADDED: Show the privacy card only on the options screen. */}
        {!backup.isBackingUp && !backup.backupResult && <PrivacyGuarantee />}
      </Stack>
    </LayoutPage>
  )
}

export default PageChatBackup
