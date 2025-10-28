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

  return (
    <LayoutPage width={600}>
      <Stack>{renderContent()}</Stack>
    </LayoutPage>
  )
}

export default PageChatBackup
