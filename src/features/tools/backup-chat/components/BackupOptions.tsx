// src/features/tools/backup-chat/components/BackupOptions.tsx
import ModalUpgrade from '@/components/Modal/ModalUpgrade'
import useLicense from '@/hooks/useLicense'
import useWa from '@/hooks/useWa'
import { getContactName } from '@/utils/util'
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
  Tooltip,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { useDisclosure } from '@mantine/hooks'
import React, { useEffect, useState } from 'react'
import type { useChatBackup } from '../hooks/useChatBackup'

interface Props {
  // Pass the entire hook's return object for cleaner prop management.
  backupHook: ReturnType<typeof useChatBackup>
  onStart: () => void
}

// English: Define which message types are considered media for easier checking.
const MEDIA_MESSAGE_TYPES = ['image', 'video', 'document', 'ptt']

// English: Define a type for the feature details to display in the upgrade modal.
interface ProFeatureInfo {
  name: string
  benefit: string
}

const BackupOptions: React.FC<Props> = ({ backupHook, onStart }) => {
  // Destructure properties from the hook
  const { form, SUPPORTED_MESSAGE_TYPES } = backupHook
  const license = useLicense()
  const wa = useWa()
  const [chatOptions, setChatOptions] =
    useState<{ label: string; value: string; avatar: string }[]>()

  // MODIFIED: Added state management for the new upgrade modal.
  const [
    isUpgradeModalOpen,
    { open: openUpgradeModal, close: closeUpgradeModal },
  ] = useDisclosure(false)
  const [selectedFeature, setSelectedFeature] = useState<ProFeatureInfo>({
    name: '',
    benefit: '',
  })

  // English: A helper function to set feature details and open the upgrade modal.
  const triggerUpgradeModal = (name: string, benefit: string) => {
    setSelectedFeature({ name, benefit })
    openUpgradeModal()
  }

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

  // MODIFIED: Instead of redirecting, this now shows a contextual modal.
  const handleDatePresetChange = (value: string | null) => {
    if (!value) return
    const option = datePresets.find((p) => p.value === value)
    if (license.isFree() && option?.pro) {
      triggerUpgradeModal(
        `"${option.label}" Date Range`,
        'Gain the flexibility to back up your chats from any period, not just the last 7 days. Perfect for archiving older conversations.',
      )
      return // English: Prevent setting the form value for the Pro feature.
    }
    form.setFieldValue('datePreset', value)
  }

  // MODIFIED: Instead of redirecting, this now shows a contextual modal.
  const handleExportFormatChange = (value: string) => {
    const format = exportFormats.find((f) => f.value === value)
    if (license.isFree() && format?.pro) {
      triggerUpgradeModal(
        `${format.label} Export`,
        `Exporting as ${
          format.label.split(' ')[0]
        } allows for professional, easily shareable, or data-friendly archives of your chats.`,
      )
      return // English: Prevent setting the form value for the Pro feature.
    }
    form.setFieldValue('exportFormat', value)
  }

  // MODIFIED: Instead of redirecting, this now shows a contextual modal for media types.
  const handleMessageTypeChange = (values: string[]) => {
    // Find if a new type was just added to the values array.
    const newType = values.find((v) => !form.values.messageTypes.includes(v))

    // If a new type was selected, and it's a media type, and the user is on the Free plan, redirect.
    if (license.isFree() && newType && MEDIA_MESSAGE_TYPES.includes(newType)) {
      triggerUpgradeModal(
        'Media Backups',
        'Save not just the text, but also the photos, videos, documents, and voice notes that make your conversations complete.',
      )
      return // English: Prevent setting the form value for the Pro feature.
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
    <>
      {/* ADDED: Render the new upgrade modal, controlled by component state. */}
      <ModalUpgrade
        opened={isUpgradeModalOpen}
        onClose={closeUpgradeModal}
        featureName={selectedFeature.name}
        featureBenefit={selectedFeature.benefit}
      />
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
        <Group justify="space-between" align="flex-end" wrap="nowrap">
          <TagsInput
            label="Filter by Keywords (Optional)"
            placeholder={'Add keyword and press Enter'}
            description="Only export messages containing any of these keywords."
            value={form.values.keywords}
            // MODIFIED: Show modal if a free user exceeds the keyword limit.
            onChange={(newKeywords) => {
              if (license.isFree() && newKeywords.length > 1) {
                triggerUpgradeModal(
                  'Multiple Keyword Filtering',
                  'Search your backups with unlimited keywords to find exactly what you need, instantly.',
                )
                // English: Only allow the first keyword to be set for free users.
                form.setFieldValue('keywords', [newKeywords[0]])
                return
              }
              form.setFieldValue('keywords', newKeywords)
            }}
            maxTags={license.isFree() ? 1 : undefined} // English: Limit free users to one keyword.
            error={form.errors.keywords}
            clearable
            style={{ flexGrow: 1 }}
          />
        </Group>
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
    </>
  )
}

export default BackupOptions
