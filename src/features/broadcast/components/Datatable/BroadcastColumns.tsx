// src/features/Broadcast/Datatable/BroadcastColumns.tsx
import { Message, Status } from '@/constants'
import type { Broadcast } from '@/libs/db'
import { truncate } from '@/utils/util'
import { Icon } from '@iconify/react'
import {
  ActionIcon,
  Box,
  Group,
  Menu,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core'
import type { DataTableColumn } from 'mantine-datatable'
import React from 'react'
import MessageStatus from './MessageStatus'
import MessageType from './MessageType'

interface ColumnActions {
  onViewDetails: (broadcast: Broadcast) => void
  onResendToFailed: (broadcast: Broadcast) => void
  onClone: (broadcast: Broadcast) => void
  onExport: (broadcast: Broadcast, format: string) => void
  onCancel: (broadcastId: number) => void
  onDelete: (broadcast: Broadcast) => void
}

type BroadcastStatsMap = Map<
  number,
  {
    total: number
    success: number
    pending: number
    running: number
    failed: number
    scheduled: number
    cancelled: number
    firstError?: string
  }
>

const renderMessagePreview = (broadcast: Broadcast) => {
  const { type, message } = broadcast
  if (!message) return 'N/A'

  switch (type) {
    case Message.TEXT:
      return typeof message === 'string' ? message : JSON.stringify(message)
    case Message.IMAGE:
    case Message.VIDEO:
    case Message.FILE:
      return (message as any).caption || `Media File (${type})`
    case Message.LOCATION:
      return (message as any).name || (message as any).address || 'Location'
    case Message.POLL:
      return (message as any).name || 'Poll'
    case Message.VCARD:
      return 'Contact Card'
    default:
      return `Unsupported type: ${type}`
  }
}

export const getBroadcastColumns = (
  actions: ColumnActions,
  broadcastStatsMap: BroadcastStatsMap,
): DataTableColumn<Broadcast>[] => {
  const defaultStats = {
    total: 0,
    success: 0,
    pending: 0,
    running: 0,
    failed: 0,
    scheduled: 0,
    cancelled: 0,
  }

  return [
    {
      accessor: 'name',
      title: 'Name',
      render: (broadcast) => <Text truncate>{broadcast.name || 'N/A'}</Text>,
      sortable: true,
      width: 150,
    },
    {
      accessor: 'type',
      title: 'Type',
      render: (broadcast) => <MessageType type={broadcast.type} />,
      width: 130,
    },
    {
      accessor: 'message',
      title: 'Content Preview',
      render: (broadcast) => {
        const fullMessage = renderMessagePreview(broadcast)
        return (
          <Tooltip
            label={fullMessage}
            multiline
            w={220}
            withArrow
            position="top-start"
            disabled={fullMessage.length <= 50}
          >
            <Text truncate>{truncate(fullMessage, 50)}</Text>
          </Tooltip>
        )
      },
      ellipsis: true,
    },
    {
      accessor: 'status',
      title: 'Status',

      render: (broadcast) => {
        const stats = broadcastStatsMap.get(broadcast.id)
        let overallError =
          broadcast.status === Status.FAILED ? 'Broadcast failed' : undefined
        if (!overallError && stats?.failed > 0) {
          overallError = stats.firstError || 'Some recipients failed'
        }
        return <MessageStatus status={broadcast.status} error={overallError} />
      },
      width: 150,
      sortable: true,
    },
    {
      accessor: 'stats',
      title: 'Recipients',

      render: (broadcast) => {
        const stats = broadcastStatsMap.get(broadcast.id) || defaultStats
        return (
          <Stack gap={2}>
            <Text size="xs">Total: {stats.total}</Text>
            {stats.success > 0 && (
              <Text size="xs" c="green">
                {' '}
                Success: {stats.success}{' '}
              </Text>
            )}
            {(stats.pending > 0 || stats.running > 0) && (
              <Text size="xs" c="yellow">
                {' '}
                In Progress: {stats.pending + stats.running}{' '}
              </Text>
            )}
            {stats.failed > 0 && (
              <Text size="xs" c="red">
                {' '}
                Failed: {stats.failed}{' '}
              </Text>
            )}
            {stats.cancelled > 0 && (
              <Text size="xs" c="gray">
                {' '}
                Cancelled: {stats.cancelled}{' '}
              </Text>
            )}
            {stats.scheduled > 0 && (
              <Text size="xs" c="blue">
                {' '}
                Scheduled: {stats.scheduled}{' '}
              </Text>
            )}
          </Stack>
        )
      },
      width: 150,
    },
    {
      accessor: 'actions',
      title: <Box mr="xs">Actions</Box>,
      textAlign: 'right',
      width: '0%',
      render: (broadcast) => {
        const stats = broadcastStatsMap.get(broadcast.id) || defaultStats
        const isFinished = [
          Status.SUCCESS,
          Status.FAILED,
          Status.CANCELLED,
        ].includes(broadcast.status)
        const isRunning = [
          Status.PENDING,
          Status.RUNNING,
          Status.SCHEDULER,
        ].includes(broadcast.status)

        return (
          <Group gap={4} justify="flex-end" wrap="nowrap">
            <Tooltip label="View Details">
              <ActionIcon
                variant="subtle"
                color="blue"
                onClick={() => actions.onViewDetails(broadcast)}
              >
                <Icon icon="tabler:eye" />
              </ActionIcon>
            </Tooltip>
            {isFinished && stats.failed > 0 && (
              <Tooltip label="Resend to Failed">
                <ActionIcon
                  variant="subtle"
                  color="purple"
                  onClick={() => actions.onResendToFailed(broadcast)}
                >
                  <Icon icon="tabler:send-off" />
                </ActionIcon>
              </Tooltip>
            )}
            {!isRunning && (
              <Tooltip label="Clone Broadcast">
                <ActionIcon
                  variant="subtle"
                  color="teal"
                  onClick={() => actions.onClone(broadcast)}
                >
                  <Icon icon="tabler:copy" />
                </ActionIcon>
              </Tooltip>
            )}
            <Menu shadow="md" position="left" withArrow>
              <Menu.Target>
                <ActionIcon variant="subtle">
                  <Icon icon="tabler:download" />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={() => actions.onExport(broadcast, 'csv')}>
                  <Text>Export as CSV</Text>
                </Menu.Item>
                <Menu.Item onClick={() => actions.onExport(broadcast, 'xlsx')}>
                  <Text>Export as XLSX</Text>
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
            {isRunning && (
              <Tooltip label="Cancel Broadcast">
                <ActionIcon
                  variant="subtle"
                  color="orange"
                  onClick={() => actions.onCancel(broadcast.id)}
                >
                  <Icon icon="tabler:player-stop" />
                </ActionIcon>
              </Tooltip>
            )}
            {isFinished && (
              <Tooltip label="Delete Broadcast">
                <ActionIcon
                  variant="subtle"
                  color="red"
                  onClick={() => actions.onDelete(broadcast)}
                >
                  <Icon icon="tabler:trash" />
                </ActionIcon>
              </Tooltip>
            )}
          </Group>
        )
      },
    },
  ]
}
