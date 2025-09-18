// src/features/tools/backup-chat/components/BackupOptions.tsx
import ModalUpgrade from '@/components/Modal/ModalUpgrade'
import useLicense from '@/hooks/useLicense'
import useWa from '@/hooks/useWa'
import { getContactName } from '@/utils/util'
import { Icon } from '@iconify/react'
import {
  Avatar,
  Button,
  Checkbox,
  Group,
  Radio,
  Select,
  Stack,
  Stepper,
  TagsInput,
  Text,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { useDisclosure } from '@mantine/hooks'
import React, { useEffect, useMemo, useState } from 'react'
import type { useChatBackup } from '../hooks/useChatBackup'
import BackupSummary from './BackupSummary'

interface Props {
  backupHook: ReturnType<typeof useChatBackup>
  onStart: () => void
}

const MEDIA_MESSAGE_TYPES = ['image', 'video', 'document', 'ptt']

interface ProFeatureInfo {
  name: string
  benefit: string
}

const BackupOptions: React.FC<Props> = ({ backupHook, onStart }) => {
  const { form, SUPPORTED_MESSAGE_TYPES } = backupHook
  const license = useLicense()
  const wa = useWa()
  const [activeStep, setActiveStep] = useState(0)

  const [groupOptions, setGroupOptions] =
    useState<{ label: string; value: string; avatar: string }[]>()

  const [
    isUpgradeModalOpen,
    { open: openUpgradeModal, close: closeUpgradeModal },
  ] = useDisclosure(false)
  const [selectedFeature, setSelectedFeature] = useState<ProFeatureInfo>({
    name: '',
    benefit: '',
  })

  const nextStep = () =>
    setActiveStep((current) => (current < 3 ? current + 1 : current))
  const prevStep = () =>
    setActiveStep((current) => (current > 0 ? current - 1 : current))

  const triggerUpgradeModal = (name: string, benefit: string) => {
    setSelectedFeature({ name, benefit })
    openUpgradeModal()
  }

  const selectedGroupName = useMemo(() => {
    if (!form.values.chatId || !groupOptions) return 'N/A'
    return groupOptions.find((opt) => opt.value === form.values.chatId)?.label
  }, [form.values.chatId, groupOptions])

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
    wa.chat.list({ onlyGroups: true }).then((chats) => {
      const labelValueChats = chats.map((chat: any) => ({
        label: getContactName(chat.contact),
        value: chat.id,
        avatar: chat.contact.avatar,
      }))
      setGroupOptions(labelValueChats)
    })
  }, [wa.isReady])

  const handleDatePresetChange = (value: string | null) => {
    if (!value) return
    const option = datePresets.find((p) => p.value === value)
    if (license.isFree() && option?.pro) {
      triggerUpgradeModal(
        `"${option.label}" Date Range`,
        'Gain the flexibility to back up your chats from any period.',
      )
      return
    }
    form.setFieldValue('datePreset', value)
  }

  const handleExportFormatChange = (value: string) => {
    const format = exportFormats.find((f) => f.value === value)
    if (license.isFree() && format?.pro) {
      triggerUpgradeModal(
        `${format.label} Export`,
        `Exporting as ${
          format.label.split(' ')[0]
        } allows for professional archives.`,
      )
      return
    }
    form.setFieldValue('exportFormat', value)
  }

  const handleMessageTypeChange = (values: string[]) => {
    const newType = values.find((v) => !form.values.messageTypes.includes(v))
    if (license.isFree() && newType && MEDIA_MESSAGE_TYPES.includes(newType)) {
      triggerUpgradeModal(
        'Media Backups',
        'Save not just the text, but also photos, videos, and documents.',
      )
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
    <>
      <ModalUpgrade
        opened={isUpgradeModalOpen}
        onClose={closeUpgradeModal}
        featureName={selectedFeature.name}
        featureBenefit={selectedFeature.benefit}
      />

      <Stepper active={activeStep}>
        <Stepper.Step
          label="Step 1"
          description="Select Group"
          allowStepSelect={activeStep > 0}
        >
          <Stack align="center" justify="center" h={300}>
            <Select
              w="100%"
              maw={400}
              label="Select a group to back up"
              data={groupOptions ?? []}
              searchable
              clearable
              required
              renderOption={renderSelectOption}
              {...form.getInputProps('chatId')}
            />
          </Stack>
        </Stepper.Step>
        <Stepper.Step
          label="Step 2"
          description="Configure Options"
          allowStepSelect={activeStep > 1}
        >
          <Stack my="xl" gap="lg">
            <TagsInput
              label="Filter by Keywords (Optional)"
              placeholder="Add keyword and press Enter"
              description="Only export messages containing any of these keywords."
              value={form.values.keywords}
              onChange={(newKeywords) => {
                if (license.isFree() && newKeywords.length > 1) {
                  triggerUpgradeModal(
                    'Multiple Keyword Filtering',
                    'Search your backups with unlimited keywords to find exactly what you need.',
                  )
                  form.setFieldValue('keywords', [newKeywords[0]])
                  return
                }
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
              value={form.values.messageTypes}
              onChange={handleMessageTypeChange}
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

            <Radio.Group
              label="Format"
              value={form.values.exportFormat}
              onChange={handleExportFormatChange}
            >
              <Group mt="xs">
                {exportFormats.map((format) => (
                  <Radio
                    key={format.value}
                    value={format.value}
                    label={format.label}
                  />
                ))}
              </Group>
            </Radio.Group>
          </Stack>
        </Stepper.Step>
        <Stepper.Step
          label="Step 3"
          description="Confirm & Start"
          allowStepSelect={activeStep > 2}
        >
          <Stack my="xl">
            <BackupSummary
              backupHook={backupHook}
              groupName={selectedGroupName}
            />
          </Stack>
        </Stepper.Step>
      </Stepper>

      <Group justify="flex-end" mt="xl">
        {activeStep !== 0 && (
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
        )}
        {activeStep < 2 && (
          <Button onClick={nextStep} disabled={!form.values.chatId}>
            Next
          </Button>
        )}
        {activeStep === 2 && (
          <Button
            leftSection={<Icon icon="tabler:download" />}
            onClick={onStart}
            color="teal"
          >
            Start Backup
          </Button>
        )}
      </Group>
    </>
  )
}

export default BackupOptions
