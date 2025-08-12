// src/features/tools/backup-chat/components/BackupOptions.tsx
import useWa from '@/hooks/useWa'
import { getContactName } from '@/utils/util'
import { Icon } from '@iconify/react'
import {
  Button,
  Checkbox,
  Group,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import React, { useEffect, useState } from 'react'
import type { useChatBackup } from '../hooks/useChatBackup'

interface Props {
  // We pass the entire hook's return object for cleaner prop management
  backupHook: ReturnType<typeof useChatBackup>
  onStart: () => void
}

const BackupOptions: React.FC<Props> = ({ backupHook, onStart }) => {
  const { form, estimatedTime, SUPPORTED_MEDIA_TYPES } = backupHook
  const wa = useWa()
  const [chatOptions, setChatOptions] = useState<any[]>()

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

      {/* Replaced single checkbox with a Checkbox.Group for selective media */}
      <Checkbox.Group
        label="Include Media Files (Optional)"
        description="Warning: This can be very slow for large chats."
        {...form.getInputProps('includeMediaTypes')}
      >
        <Group mt="xs">
          {SUPPORTED_MEDIA_TYPES.map((type) => (
            <Checkbox
              key={type}
              value={type}
              label={type.charAt(0).toUpperCase() + type.slice(1)} // e.g., 'image' -> 'Image'
            />
          ))}
        </Group>
      </Checkbox.Group>

      {/* Display the time estimate */}
      {estimatedTime && (
        <Text size="sm" c="dimmed" mt="sm">
          <b>Estimated time:</b> {estimatedTime}
        </Text>
      )}

      <Group justify="flex-end" mt="lg">
        <Button
          leftSection={<Icon icon="tabler:download" />}
          onClick={onStart}
          disabled={!form.values.chatId}
        >
          Start Backup
        </Button>
      </Group>
    </Stack>
  )
}

export default BackupOptions
