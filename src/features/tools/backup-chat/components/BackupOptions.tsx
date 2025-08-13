// src/features/tools/backup-chat/components/BackupOptions.tsx
import useWa from '@/hooks/useWa'
import { getContactName } from '@/utils/util'
import { Icon } from '@iconify/react'
import {
  Alert,
  Avatar,
  Button,
  Checkbox,
  Group,
  Loader,
  Radio,
  Select,
  Stack,
  TagsInput,
  Text,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import React, { useEffect, useState } from 'react'
import type { useChatBackup } from '../hooks/useChatBackup'

interface Props {
  // Pass the entire hook's return object for cleaner prop management.
  backupHook: ReturnType<typeof useChatBackup>
  onStart: () => void
}

const BackupOptions: React.FC<Props> = ({ backupHook, onStart }) => {
  const {
    form,
    backupPreview,
    isPreparing,
    SUPPORTED_MESSAGE_TYPES,
    estimatedTime,
  } = backupHook
  const wa = useWa()
  const [chatOptions, setChatOptions] =
    useState<{ label: string; value: string; avatar: string }[]>()

  useEffect(() => {
    if (!wa.isReady) return
    // Fetch all user chats for the selector.
    wa.chat.list({ onlyUsers: true }).then((chats) => {
      const labelValueChats = chats.map((chat: any) => ({
        label: getContactName(chat.contact),
        value: chat.id,
        avatar: chat.contact.avatar,
      }))
      setChatOptions(labelValueChats)
    })
  }, [wa.isReady])

  // Helper to format bytes into KB, MB, GB.
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }

  // Custom renderer for select options to display avatars.
  const renderSelectOption = ({
    option,
  }: {
    option: { value: string; label: string; avatar: string }
  }) => (
    <Group>
      <Avatar src={option.avatar} size="md" radius="xl" />
      <div>
        <Text size="sm">{option.label}</Text>
      </div>
    </Group>
  )

  return (
    <Stack>
      <Select
        label="Select chat"
        data={chatOptions ?? []}
        searchable
        clearable
        required
        renderOption={renderSelectOption}
        {...form.getInputProps('chatId')}
      />

      <TagsInput
        label="Filter by Keywords (Optional)"
        placeholder="Add keywords and press Enter"
        description="Only export messages containing any of these keywords. Case-insensitive."
        {...form.getInputProps('keywords')}
        clearable
      />

      {/* MODIFIED: Replaced preset buttons with a Select component. */}
      <Select
        label="Date Range"
        data={[
          { value: 'all', label: 'All Time' },
          { value: 'today', label: 'Today' },
          { value: 'yesterday', label: 'Yesterday' },
          { value: 'last7', label: 'Last 7 Days' },
          { value: 'last30', label: 'Last 30 Days' },
          { value: 'thisMonth', label: 'This Month' },
          { value: 'lastMonth', label: 'Last Month' },
          { value: 'custom', label: 'Custom Range...' },
        ]}
        {...form.getInputProps('datePreset')}
      />

      {/* MODIFIED: Conditionally show DatePickerInput only for 'custom' preset. */}
      {form.values.datePreset === 'custom' && (
        <DatePickerInput
          type="range"
          label="Custom Date Range"
          placeholder="Pick a start and end date"
          {...form.getInputProps('dateRange')}
          required
        />
      )}

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
              label={type.charAt(0).toUpperCase() + type.slice(1)}
            />
          ))}
        </Group>
      </Checkbox.Group>

      <Radio.Group label="Format" {...form.getInputProps('exportFormat')}>
        <Group mt="xs">
          <Radio size="sm" value="html" label="HTML (.zip)" />
          <Radio size="sm" value="pdf" label="PDF" />
        </Group>
      </Radio.Group>

      {isPreparing && (
        <Group>
          <Loader size="xs" />
          <Text size="sm" c="dimmed">
            Preparing preview...
          </Text>
        </Group>
      )}

      {backupPreview && !isPreparing && (
        <Alert
          variant="light"
          color="blue"
          icon={<Icon icon="tabler:info-circle" />}
        >
          <Stack gap="xs">
            <Text size="sm">
              You are about to export{' '}
              <b>{backupPreview.messageCount} message(s)</b>.
            </Text>
            {form.values.messageTypes.length > 0 &&
              backupPreview.estimatedMediaSize > 0 &&
              form.values.exportFormat === 'html' && (
                <Text size="sm">
                  Estimated media download size:{' '}
                  <b>{formatBytes(backupPreview.estimatedMediaSize)}</b>.
                </Text>
              )}
            {estimatedTime && (
              <Text size="sm">
                <b>Estimated Completion Time:</b> {estimatedTime}
              </Text>
            )}
          </Stack>
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
