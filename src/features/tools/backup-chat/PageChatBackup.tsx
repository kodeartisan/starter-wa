// src/features/tools/chat-backup/PageChatBackup.tsx
import LayoutPage from '@/components/Layout/LayoutPage'
import { Icon } from '@iconify/react'
import { Alert, Box, Card, Stack, Text, Title } from '@mantine/core'
import React from 'react'
import BackupOptions from './components/BackupOptions'
import BackupProgress from './components/BackupProgress'
import { useChatBackup } from './hooks/useChatBackup'

const PageChatBackup: React.FC = () => {
  const backup = useChatBackup()

  return (
    <LayoutPage>
      <Stack>
        {backup.isBackingUp ? (
          <BackupProgress
            progress={backup.progress}
            onCancel={backup.cancelBackup}
          />
        ) : (
          <BackupOptions backupHook={backup} onStart={backup.startBackup} />
        )}
      </Stack>
    </LayoutPage>
  )
}

export default PageChatBackup
