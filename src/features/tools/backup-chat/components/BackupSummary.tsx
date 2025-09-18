// src/features/tools/backup-chat/components/BackupSummary.tsx
import { Icon } from '@iconify/react'
import { Card, Group, Stack, Text, ThemeIcon } from '@mantine/core'
import React from 'react'
import type { useChatBackup } from '../hooks/useChatBackup'

interface Props {
  backupHook: ReturnType<typeof useChatBackup>
  groupName?: string
}

const InfoCard = ({
  icon,
  label,
  value,
}: {
  icon: string
  label: string
  value: React.ReactNode
}) => (
  <Card withBorder radius="md" p="sm">
    <Group wrap="nowrap" gap="lg">
      <ThemeIcon variant="light" size={36} radius="md">
        <Icon icon={icon} fontSize={20} />
      </ThemeIcon>
      <div>
        <Text size="xs" c="dimmed">
          {label}
        </Text>
        <Text size="sm" fw={500}>
          {value || '-'}
        </Text>
      </div>
    </Group>
  </Card>
)

const BackupSummary: React.FC<Props> = ({ backupHook, groupName }) => {
  const { form } = backupHook
  const { values } = form

  const dateRangeText =
    values.datePreset === 'custom'
      ? `${values.dateRange[0]?.toLocaleDateString() ?? 'N/A'} - ${
          values.dateRange[1]?.toLocaleDateString() ?? 'N/A'
        }`
      : values.datePreset.charAt(0).toUpperCase() + values.datePreset.slice(1)

  return (
    <Stack>
      <Text ta="center" fw={500} mb="md">
        Please review your backup settings before starting.
      </Text>
      <Stack gap="sm">
        <InfoCard
          icon="tabler:users-group"
          label="Group to Backup"
          value={groupName}
        />
        <InfoCard
          icon="tabler:file-export"
          label="Export Format"
          value={values.exportFormat.toUpperCase()}
        />
        <InfoCard
          icon="tabler:calendar"
          label="Date Range"
          value={dateRangeText}
        />
        <InfoCard
          icon="tabler:message-circle-code"
          label="Included Message Types"
          value={
            values.messageTypes.length > 0
              ? values.messageTypes.join(', ')
              : 'None'
          }
        />
        <InfoCard
          icon="tabler:search"
          label="Keywords"
          value={
            values.keywords.length > 0 ? values.keywords.join(', ') : 'None'
          }
        />
      </Stack>
    </Stack>
  )
}

export default BackupSummary
