// src/features/broadcast/components/Datatable/MessageStatus.tsx
import { Status } from '@/constants'
import { Icon } from '@iconify/react'
import { Group, Loader, Text, Tooltip } from '@mantine/core'
import React from 'react'

interface Props {
  status: string
  error?: string | null
  overrideText?: string | null
  tooltip?: string | null
}

const MessageStatus: React.FC<Props> = ({
  status,
  error = null,
  overrideText = null,
  tooltip = null,
}: Props) => {
  const statusConfig: {
    [key: string]: { color: string; icon: React.ReactNode; text: string }
  } = {
    [Status.RUNNING]: {
      color: 'yellow',
      icon: <Loader color="yellow" size={16} />,
      text: 'Running',
    },
    [Status.PENDING]: {
      color: 'blue',
      icon: <Icon icon="tabler:clock" fontSize={18} />,
      text: 'Pending',
    },
    [Status.SUCCESS]: {
      color: 'green',
      icon: <Icon icon="tabler:checks" fontSize={18} />,
      text: 'Done',
    },
    [Status.CANCELLED]: {
      color: 'gray',
      icon: <Icon icon="tabler:cancel" fontSize={18} />,
      text: 'Cancelled',
    },
    [Status.FAILED]: {
      color: 'red',
      icon: <Icon icon="tabler:x" fontSize={18} />,
      text: 'Failed',
    },
    [Status.PAUSED]: {
      color: 'gray',
      icon: <Icon icon="tabler:player-pause" fontSize={18} />,
      text: 'Paused',
    },
    [Status.SCHEDULER]: {
      color: 'cyan',
      icon: <Icon icon="tabler:calendar-time" fontSize={18} />,
      text: 'Scheduled',
    },
  }

  const config = statusConfig[status]

  if (!config) {
    return <Text size="sm">{status}</Text>
  }

  const displayText = overrideText || config.text

  const content = (
    <Group gap="xs" wrap="nowrap" align="center">
      <Group gap={4} wrap="nowrap" align="center">
        {config.icon}
        <Text size="sm" c={config.color} fw={500}>
          {displayText}
        </Text>
      </Group>
    </Group>
  )

  const tooltipContent = error || tooltip

  return tooltipContent ? (
    <Tooltip
      label={tooltipContent}
      position="top-start"
      multiline
      w={220}
      withArrow
    >
      {content}
    </Tooltip>
  ) : (
    content
  )
}

export default MessageStatus
