// src/features/tools/backup-chat/components/BackupOptions.tsx
import useWa from '@/hooks/useWa'
import { getContactName } from '@/utils/util'
import { Icon } from '@iconify/react'
import {
  Alert,
  Button,
  Checkbox,
  Group,
  Loader,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import {
  endOfDay,
  endOfMonth,
  startOfDay,
  startOfMonth,
  subDays,
} from 'date-fns'
import React, { useEffect, useState } from 'react'
import type { useChatBackup } from '../hooks/useChatBackup'

interface Props {
  // We pass the entire hook's return object for cleaner prop management
  backupHook: ReturnType<typeof useChatBackup>
  onStart: () => void
}

const BackupOptions: React.FC<Props> = ({ backupHook, onStart }) => {
  // ++ MODIFIED: Destructure the new constant and form field.
  const { form, backupPreview, isPreparing, SUPPORTED_MESSAGE_TYPES } =
    backupHook
  const wa = useWa()
  const [chatOptions, setChatOptions] = useState<any[]>()

  // Map internal type names to user-friendly labels.
  const messageTypeLabels: { [key: string]: string } = {
    chat: 'Text',
    image: 'Images',
    video: 'Videos',
    document: 'Documents',
    ptt: 'Voice Messages',
  }

  useEffect(() => {
    if (!wa.isReady) return
    // Fetch all user and group chats for the selector
    wa.chat.list({ onlyUsers: true }).then((chats) => {
      const labelValueChats = chats.map((chat: any) => ({
        label: getContactName(chat.contact),
        value: chat.contact.id,
      }))
      setChatOptions(labelValueChats)
    })
  }, [wa.isReady])

  // Helper to format bytes into KB, MB, GB
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }

  // Handlers for date range presets
  const setDateRange = (preset: 'today' | 'last7' | 'thisMonth') => {
    const now = new Date()
    let start: Date
    let end: Date
    switch (preset) {
      case 'today':
        start = startOfDay(now)
        end = endOfDay(now)
        break
      case 'last7':
        start = startOfDay(subDays(now, 6)) // Include today
        end = endOfDay(now)
        break
      case 'thisMonth':
        start = startOfMonth(now)
        end = endOfMonth(now)
        break
    }
    form.setFieldValue('dateRange', [start, end])
  }

  return (
    <Stack>
      <Select
        label="Select chat"
        data={chatOptions ?? []}
        searchable
        clearable
        required
        {...form.getInputProps('chatId')}
      />
      <TextInput
        label="Filter by Keyword (Optional)"
        placeholder="Only export messages containing this text"
        {...form.getInputProps('keyword')}
      />
      <DatePickerInput
        type="range"
        label="Date Range (Optional)"
        placeholder="Leave blank to export all messages"
        {...form.getInputProps('dateRange')}
        clearable
      />
      <Group gap="xs">
        <Button
          size="compact-xs"
          variant="light"
          onClick={() => setDateRange('today')}
        >
          Today
        </Button>
        <Button
          size="compact-xs"
          variant="light"
          onClick={() => setDateRange('last7')}
        >
          Last 7 Days
        </Button>
        <Button
          size="compact-xs"
          variant="light"
          onClick={() => setDateRange('thisMonth')}
        >
          This Month
        </Button>
      </Group>

      {/* ++ MODIFIED: The Checkbox group now controls which message types are included in the export. */}
      <Checkbox.Group
        label="Include Message Types"
        description="Select the types of messages to include in the backup."
        {...form.getInputProps('messageTypes')}
      >
        <Group mt="xs">
          {SUPPORTED_MESSAGE_TYPES.map((type) => (
            <Checkbox
              key={type}
              value={type}
              label={messageTypeLabels[type] || type}
            />
          ))}
        </Group>
      </Checkbox.Group>

      {isPreparing && (
        <Group>
          <Loader size="xs" />
          <Text size="sm" c="dimmed">
            Preparing preview...
          </Text>
        </Group>
      )}
      {backupPreview && !isPreparing && (
        <Alert variant="light" icon={<Icon icon="tabler:info-circle" />}>
          <Text size="sm">
            You are about to export{' '}
            <b>{backupPreview.messageCount} message(s)</b>.
          </Text>
          {form.values.messageTypes.length > 0 &&
            backupPreview.estimatedMediaSize > 0 && (
              <Text size="sm">
                Estimated media download size:{' '}
                <b>{formatBytes(backupPreview.estimatedMediaSize)}</b>.
              </Text>
            )}
        </Alert>
      )}

      <Group justify="flex-end" mt="lg">
        <Button
          leftSection={<Icon icon="tabler:download" />}
          onClick={onStart}
          disabled={!form.values.chatId || isPreparing}
        >
          Start Backup
        </Button>
      </Group>
    </Stack>
  )
}

export default BackupOptions
