import { Status } from '@/constants'
import { Icon } from '@iconify/react'
import { ActionIcon, Group, Loader, Text, Tooltip } from '@mantine/core'
import _ from 'lodash'
import React from 'react'

interface Props {
  status: string
  error?: string | null
}

const MessageStatus: React.FC<Props> = ({ status, error = null }: Props) => {
  const statuses = {
    [Status.RUNNING]: (
      <Group gap={2}>
        <Loader color="yellow" size={16} />
        <Text fw={500} c={'yellow'}>
          {' '}
          Running{' '}
        </Text>
      </Group>
    ),
    [Status.PENDING]: (
      <Group gap={0}>
        <ActionIcon variant="transparent">
          <Icon icon="tabler:clock" fontSize={18} />
        </ActionIcon>
        <Text fw={500}>Pending</Text>
      </Group>
    ),
    [Status.SUCCESS]: (
      <Group gap={0}>
        <ActionIcon variant="transparent" color="green">
          <Icon icon="tabler:checks" fontSize={18} />
        </ActionIcon>
        <Text fw={500} c={'green'}>
          {' '}
          Done{' '}
        </Text>
      </Group>
    ),
    [Status.CANCELLED]: (
      <Group gap={0}>
        <ActionIcon variant="transparent" color="red">
          <Icon icon="tabler:cancel" fontSize={18} />
        </ActionIcon>
        <Text fw={500} c={'red'}>
          {' '}
          Cancelled{' '}
        </Text>
      </Group>
    ),
    [Status.FAILED]: (
      <Tooltip label={error} position="top">
        <Group gap={0}>
          <ActionIcon variant="transparent" color="red">
            <Icon icon="tabler:x" fontSize={18} />
          </ActionIcon>
          <Text fw={500} c={'red'}>
            {' '}
            Failed{' '}
          </Text>
        </Group>
      </Tooltip>
    ),
    // ++ ADDED: A new status for PAUSED broadcasts.
    [Status.PAUSED]: (
      <Group gap={2}>
        <ActionIcon variant="transparent" color="gray">
          <Icon icon="tabler:player-pause" fontSize={18} />
        </ActionIcon>
        <Text fw={500} c={'gray'}>
          Paused
        </Text>
      </Group>
    ),
    [Status.SCHEDULER]: (
      <Group gap={0}>
        <Text fw={500}>In queue</Text>
      </Group>
    ),
  }
  return statuses[status]
}

export default MessageStatus
