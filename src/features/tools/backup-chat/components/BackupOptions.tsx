// src/features/tools/backup-chat/components/BackupOptions.tsx
import useLicense from '@/hooks/useLicense'
import useWa from '@/hooks/useWa'
import { getContactName, showModalUpgrade } from '@/utils/util'
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

  // MODIFIED: Added CSV and XLSX export formats.
  const exportFormats = [
    { value: 'html', label: 'HTML (.zip)' },
    { value: 'pdf', label: 'PDF' },
    { value: 'csv', label: 'CSV' },
    { value: 'xlsx', label: 'Excel' },
    { value: 'txt', label: 'TXT' },
    { value: 'json', label: 'JSON' },
    { value: 'md', label: 'Markdown' },
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
      showModalUpgrade()
      return
    }
    form.setFieldValue('datePreset', value)
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
                  {' '}
                  PRO{' '}
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
      <Checkbox.Group
        label="Include Message Types"
        description="Select the types of messages to include in the backup."
        value={form.values.messageTypes}
        onChange={(values) => {
          form.setFieldValue('messageTypes', values)
        }}
      >
        <Group mt="xs">
          {SUPPORTED_MESSAGE_TYPES.map((type) => (
            <Group key={type} gap="xs">
              <Checkbox
                key={type}
                value={type}
                label={type.charAt(0).toUpperCase() + type.slice(1)}
              />
            </Group>
          ))}
        </Group>
      </Checkbox.Group>
      <Radio.Group
        label="Format"
        value={form.values.exportFormat}
        onChange={(value) => {
          form.setFieldValue('exportFormat', value)
        }}
      >
        <Group mt="xs">
          {exportFormats.map((format) => (
            <Group key={format.value} gap="xs">
              <Radio size="sm" value={format.value} label={format.label} />
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
