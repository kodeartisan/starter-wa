// src/features/broadcast/components/Datatable/BroadcastColumns.tsx
import { Message, Status } from '@/constants'
import type { Broadcast } from '@/libs/db'
import { truncate } from '@/utils/util'
import { Icon } from '@iconify/react'
import {
  ActionIcon,
  Badge,
  Box,
  Group,
  Menu,
  Progress,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core'
import dayjs from 'dayjs'
import type { DataTableColumn } from 'mantine-datatable'
import React from 'react'
import MessageStatus from './MessageStatus'
import MessageType from './MessageType'

interface ColumnActions {
  onViewDetails: (broadcast: Broadcast) => void
  onClone: (broadcast: Broadcast) => void
  onExport: (broadcast: Broadcast, format: string) => void
  onCancel: (broadcastId: number) => void
  onDelete: (broadcast: Broadcast) => void
  onEditSchedule: (broadcast: Broadcast) => void
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
    scheduledAt?: Date
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
    // ++ ADDED: New column to display campaign tags.

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
      accessor: 'tags',
      title: 'Tags',
      render: (broadcast) =>
        broadcast.tags && broadcast.tags.length > 0 ? (
          <Group gap={4}>
            {broadcast.tags.map((tag) => (
              <Badge key={tag} variant="light" size="sm">
                {tag}
              </Badge>
            ))}
          </Group>
        ) : (
          <Text c="dimmed" fs="italic" size="xs">
            No tags
          </Text>
        ),
      width: 150,
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
        const stats: any = broadcastStatsMap.get(broadcast.id) || defaultStats
        const isProcessing = broadcast.status === Status.RUNNING
        const processed = stats.success + stats.failed + stats.cancelled
        const progress =
          stats.total > 0 ? Math.round((processed / stats.total) * 100) : 0
        return (
          <Stack gap={4}>
            {isProcessing && stats.total > 0 && (
              <Box mb={4}>
                <Text size="xs" fw={500}>
                  Sending: {processed} of {stats.total}
                </Text>
                <Progress value={progress} size="sm" striped animated mt={2} />
              </Box>
            )}
            <Text size="xs">Total: {stats.total}</Text>
            {stats.success > 0 && (
              <Text size="xs" c="green">
                Success: {stats.success}
              </Text>
            )}
            {(stats.pending > 0 || stats.running > 0) && (
              <Text size="xs" c="yellow">
                In Progress: {stats.pending + stats.running}
              </Text>
            )}
            {stats.failed > 0 && (
              <Text size="xs" c="red">
                Failed: {stats.failed}
              </Text>
            )}
            {stats.cancelled > 0 && (
              <Text size="xs" c="gray">
                Cancelled: {stats.cancelled}
              </Text>
            )}
            {stats.scheduled > 0 && (
              <Text size="xs" c="blue">
                Scheduled: {stats.scheduled}
              </Text>
            )}
            {stats.scheduledAt && (
              <Text size="xs" c="dimmed">
                On: {dayjs(stats.scheduledAt).format('DD MMM, HH:mm')}
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
        const isFinished = [
          Status.SUCCESS,
          Status.FAILED,
          Status.CANCELLED,
        ].includes(broadcast.status)
        const isRunning = [Status.PENDING, Status.RUNNING].includes(
          broadcast.status,
        )
        const isScheduled = broadcast.status === Status.SCHEDULER
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

            {isScheduled && (
              <Tooltip label="Edit Schedule">
                <ActionIcon
                  variant="subtle"
                  color="cyan"
                  onClick={() => actions.onEditSchedule(broadcast)}
                >
                  <Icon icon="tabler:clock-edit" />
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

            {(isRunning || isScheduled) && (
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
