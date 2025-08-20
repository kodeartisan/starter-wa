// src/features/tools/backup-chat/components/BackupOptions.tsx
import useLicense from '@/hooks/useLicense'
import useWa from '@/hooks/useWa'
import { getContactName, goToLandingPage } from '@/utils/util'
import { Icon } from '@iconify/react'
import {
  Avatar,
  Badge,
  Button,
  Checkbox,
  Group,
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

// ADDED: Define which message types are considered media for easier checking.
const MEDIA_MESSAGE_TYPES = ['image', 'video', 'document', 'ptt']

const BackupOptions: React.FC<Props> = ({ backupHook, onStart }) => {
  // Destructure properties from the hook
  const { form, SUPPORTED_MESSAGE_TYPES } = backupHook
  const license = useLicense()
  const wa = useWa()
  const [chatOptions, setChatOptions] =
    useState<{ label: string; value: string; avatar: string }[]>()

  const datePresets = [
    { value: 'today', label: 'Today', pro: false },
    { value: 'yesterday', label: 'Yesterday', pro: false },
    { value: 'last7', label: 'Last 7 Days', pro: false },
    { value: 'last30', label: 'Last 30 Days', pro: true },
    { value: 'thisMonth', label: 'This Month', pro: true },
    { value: 'lastMonth', label: 'Last Month', pro: true },
    { value: 'all', label: 'All Time', pro: true },
    { value: 'custom', label: 'Custom Range...', pro: true },
  ]

  const exportFormats = [
    { value: 'html', label: 'HTML (.zip)', pro: false },
    { value: 'txt', label: 'TXT', pro: true },
    { value: 'json', label: 'JSON', pro: true },
    { value: 'pdf', label: 'PDF', pro: true },
    { value: 'csv', label: 'CSV', pro: true },
    { value: 'xlsx', label: 'Excel', pro: true },
  ]

  useEffect(() => {
    if (!wa.isReady) return
    wa.chat.list({ onlyUsers: true }).then((chats) => {
      const labelValueChats = chats.map((chat: any) => ({
        label: getContactName(chat.contact),
        value: chat.id,
        avatar: chat.contact.avatar,
      }))
      setChatOptions(labelValueChats)
    })
  }, [wa.isReady])

  const handleDatePresetChange = (value: string | null) => {
    if (!value) return
    const option = datePresets.find((p) => p.value === value)
    if (license.isFree() && option?.pro) {
      goToLandingPage()
      return
    }
    form.setFieldValue('datePreset', value)
  }

  const handleExportFormatChange = (value: string) => {
    const format = exportFormats.find((f) => f.value === value)
    if (license.isFree() && format?.pro) {
      goToLandingPage()
      return
    }
    form.setFieldValue('exportFormat', value)
  }

  // ADDED: A handler to check for Pro-only message types upon selection.
  const handleMessageTypeChange = (values: string[]) => {
    // Find if a new type was just added to the values array.
    const newType = values.find((v) => !form.values.messageTypes.includes(v))

    // If a new type was selected, and it's a media type, and the user is on the Free plan, redirect.
    if (license.isFree() && newType && MEDIA_MESSAGE_TYPES.includes(newType)) {
      goToLandingPage()
      return
    }

    form.setFieldValue('messageTypes', values)
  }

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
        value={form.values.keywords}
        onChange={(newKeywords) => {
          form.setFieldValue('keywords', newKeywords)
        }}
        error={form.errors.keywords}
        clearable
      />
      <Select
        label="Date Range"
        data={datePresets}
        value={form.values.datePreset}
        onChange={handleDatePresetChange}
        renderOption={({ option }) => {
          const preset = datePresets.find((p) => p.value === option.value)
          return (
            <Group justify="space-between">
              <Text>{option.label}</Text>
              {license.isFree() && preset?.pro && (
                <Badge size="sm" variant="light" color="teal">
                  PRO
                </Badge>
              )}
            </Group>
          )
        }}
      />
      {form.values.datePreset === 'custom' && (
        <DatePickerInput
          type="range"
          label="Custom Date Range"
          placeholder="Pick a start and end date"
          {...form.getInputProps('dateRange')}
          required
        />
      )}
      {/* MODIFIED: Checkbox group now uses the new handler and displays PRO badges for media types. */}
      <Checkbox.Group
        label="Include Message Types"
        description="Select the types of messages to include in the backup."
        value={form.values.messageTypes}
        onChange={handleMessageTypeChange}
      >
        <Group mt="xs">
          {SUPPORTED_MESSAGE_TYPES.map((type) => (
            <Group key={type} gap="xs" align="center">
              <Checkbox
                key={type}
                value={type}
                label={type.charAt(0).toUpperCase() + type.slice(1)}
              />
              {license.isFree() && MEDIA_MESSAGE_TYPES.includes(type) && (
                <Badge size="xs" variant="light" color="teal">
                  PRO
                </Badge>
              )}
            </Group>
          ))}
        </Group>
      </Checkbox.Group>
      <Radio.Group
        label="Format"
        value={form.values.exportFormat}
        onChange={handleExportFormatChange}
      >
        <Group mt="xs">
          {exportFormats.map((format) => (
            <Group key={format.value} gap="xs" align="center">
              <Radio size="sm" value={format.value} label={format.label} />
              {license.isFree() && format.pro && (
                <Badge size="xs" variant="light" color="teal">
                  PRO
                </Badge>
              )}
            </Group>
          ))}
        </Group>
      </Radio.Group>
      <Group justify="flex-end" mt={'xl'}>
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
