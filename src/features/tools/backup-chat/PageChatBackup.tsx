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
    <LayoutPage title="Chat Backup & Export">
      <Stack>
        {backup.isBackingUp ? (
          <BackupProgress
            progress={backup.progress}
            onCancel={backup.cancelBackup}
          />
        ) : (
          // Pass the entire hook object as a single prop
          <BackupOptions backupHook={backup} onStart={backup.startBackup} />
        )}
        <Box mt="md">
          <Alert
            variant="light"
            color="orange"
            title="Important Considerations"
            icon={<Icon icon="tabler:alert-triangle" />}
          >
            - Backing up chats with many media files can be slow and consume
            significant memory.
            <br />- For very large chats, consider exporting without media or
            using a date range.
            <br />- Ensure you have a stable internet connection during the
            process.
          </Alert>
        </Box>
      </Stack>
    </LayoutPage>
  )
}

export default PageChatBackup
