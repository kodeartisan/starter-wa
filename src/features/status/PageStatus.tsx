// src/components/Pages/Status/PageStatus.tsx
import LayoutPage from '@/components/Layout/LayoutPage'
import { Status as StatusState, StatusType } from '@/constants'
import useDataQuery from '@/hooks/useDataQuery'
import db, { type UserStatus } from '@/libs/db'
// ++ ADDED: Import the new toast utility.
import toast from '@/utils/toast'
import { Icon } from '@iconify/react'
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import dayjs from 'dayjs'
import { DataTable, type DataTableColumn } from 'mantine-datatable'
import React, { useState } from 'react'
import ModalCreateUpdateStatus from './components/ModalCreateUpdateStatus'
import StatusListener from './components/StatusListener'
import useStatusScheduler from './hooks/useStatusScheduler'

const PageStatus: React.FC = () => {
  const [showModalCreateUpdate, modalCreateUpdateHandlers] =
    useDisclosure(false)
  const [editingStatus, setEditingStatus] = useState<UserStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const statusScheduler = useStatusScheduler()
  const dataQuery = useDataQuery<UserStatus>({
    table: db.userStatuses,
    initialPageSize: 10,
    searchField: 'name',
    initialSort: { field: 'createdAt', direction: 'desc' },
  })

  const handleCreateNew = () => {
    setEditingStatus(null)
    modalCreateUpdateHandlers.toggle()
  }

  const handleEdit = (status: UserStatus) => {
    setEditingStatus(status)
    modalCreateUpdateHandlers.open()
  }

  const handleDelete = async (statusId: number) => {
    const statusToDelete = await db.userStatuses.get(statusId)
    if (!statusToDelete) return

    if (
      confirm(
        `Are you sure you want to delete this status: "${
          statusToDelete.name || 'Unnamed Status'
        }"?`,
      )
    ) {
      setIsLoading(true)
      try {
        if (
          (statusToDelete.type === StatusType.IMAGE ||
            statusToDelete.type === StatusType.VIDEO) &&
          (statusToDelete.message as any)?.fileId
        ) {
          const fileId = (statusToDelete.message as any).fileId
          if (fileId) {
            await db.media.delete(fileId)
          }
        }
        await dataQuery._delete(statusId)
      } catch (error) {
        console.error('Failed to delete status:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handlePostStatusNow = async (status: UserStatus) => {
    if (!confirm('Are you sure you want to post this status to WhatsApp now?'))
      return
    setIsLoading(true)
    try {
      //@ts-ignore
      await db.userStatuses.update(status.id, {
        status: StatusState.PENDING,
        isScheduled: false,
        scheduledAt: null,
      })
    } catch (error: any) {
      console.error('Error queueing status for posting:', error)
      // ++ MODIFIED: Replaced alert with a toast notification.
      toast.error(`Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelSchedule = async (statusId: number) => {
    if (
      !confirm(
        'Are you sure you want to cancel this scheduled status? It will be moved to drafts.',
      )
    )
      return

    setIsLoading(true)
    try {
      await statusScheduler.cancelScheduledStatus(statusId)
    } catch (error: any) {
      console.error('Error cancelling schedule:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const columns: DataTableColumn<UserStatus>[] = [
    {
      accessor: 'name',
      title: 'Name',
      render: (status) => (
        <Text truncate>
          {status.name ||
            (status.type === StatusType.TEXT ? 'Text Status' : 'Media Status')}
        </Text>
      ),
      sortable: true,
      width: 180,
    },
    {
      accessor: 'type',
      title: 'Type',
      render: (status) => {
        let icon = 'tabler:file-text'
        let typeLabel = status.type.replace('_STATUS', '')
        if (status.type === StatusType.IMAGE) {
          icon = 'tabler:photo'
        } else if (status.type === StatusType.VIDEO) {
          icon = 'tabler:video'
        }
        return (
          <Group gap="xs" wrap="nowrap">
            <Icon icon={icon} fontSize={18} />
            <Text size="sm">{typeLabel}</Text>
          </Group>
        )
      },
      width: 130,
    },
    {
      accessor: 'message',
      title: 'Content',
      render: (status) => {
        // ++ START: MODIFIED - The entire render logic for the 'Content' column is updated.
        // It now consistently uses a Tooltip for both text and media captions to show full content on hover.
        if (status.type === StatusType.TEXT) {
          const fullMessage = status.message as string
          return (
            <Tooltip
              label={fullMessage}
              multiline
              w={220}
              withArrow
              position="top-start"
              disabled={fullMessage.length <= 50}
            >
              <Text truncate>{fullMessage}</Text>
            </Tooltip>
          )
        } else if (
          status.type === StatusType.IMAGE ||
          status.type === StatusType.VIDEO
        ) {
          const messageDetails = status.message as {
            caption?: string
            fileId?: number
          }
          const caption =
            messageDetails.caption ||
            (status.type === StatusType.IMAGE ? 'Image' : 'Video')

          return (
            <Tooltip
              label={caption}
              multiline
              w={220}
              withArrow
              position="top-start"
              disabled={caption.length <= 50}
            >
              <Text truncate>{caption}</Text>
            </Tooltip>
          )
        }
        // ++ END: MODIFIED
        return <Text c="dimmed">N/A</Text>
      },
      ellipsis: true,
      width: 200,
    },
    {
      accessor: 'status',
      title: 'Status Info',
      render: (status) => (
        <Stack gap={4}>
          <Badge
            color={
              status.status === StatusState.POSTED
                ? 'green'
                : status.status === StatusState.SCHEDULER
                  ? 'blue'
                  : status.status === StatusState.FAILED
                    ? 'red'
                    : status.status === StatusState.PENDING ||
                        status.status === StatusState.RUNNING
                      ? 'yellow'
                      : 'gray'
            }
            variant="light"
          >
            {status.status}
          </Badge>
          {status.isScheduled &&
            status.scheduledAt &&
            status.status === StatusState.SCHEDULER && (
              <Tooltip
                label={`Scheduled for: ${dayjs(status.scheduledAt).format(
                  'DD MMM YYYY, HH:mm',
                )}`}
              >
                <Text size="xs" c="dimmed">
                  <Icon
                    icon="tabler:clock"
                    fontSize={12}
                    style={{ verticalAlign: 'middle', marginRight: '2px' }}
                  />
                  {dayjs(status.scheduledAt).format('DD/MM HH:mm')}
                </Text>
              </Tooltip>
            )}
          {status.status === StatusState.POSTED && status.postedAt && (
            <Tooltip
              label={`Posted on: ${dayjs(status.postedAt).format(
                'DD MMM YYYY, HH:mm',
              )}`}
            >
              <Text size="xs" c="dimmed">
                <Icon
                  icon="tabler:circle-check"
                  fontSize={12}
                  style={{ verticalAlign: 'middle', marginRight: '2px' }}
                />
                {dayjs(status.postedAt).format('DD/MM HH:mm')}
              </Text>
            </Tooltip>
          )}
        </Stack>
      ),
      sortable: true,
      width: 150,
    },
    {
      accessor: 'actions',
      title: <Box mr="xs">Actions</Box>,
      textAlign: 'right',
      width: 120,
      render: (status: UserStatus) => (
        <Group gap={4} justify="flex-end" wrap="nowrap">
          {status.status === StatusState.SCHEDULER && (
            <Tooltip label="Cancel Schedule">
              <ActionIcon
                variant="subtle"
                color="orange"
                onClick={() => handleCancelSchedule(status.id)}
                disabled={isLoading}
              >
                <Icon icon="tabler:calendar-off" fontSize={18} />
              </ActionIcon>
            </Tooltip>
          )}
          {(status.status === StatusState.DRAFT ||
            status.status === StatusState.FAILED ||
            (status.status === StatusState.SCHEDULER &&
              dayjs(status.scheduledAt).isAfter(new Date()))) && (
            <Tooltip
              label={
                status.status === StatusState.SCHEDULER
                  ? 'Post Now'
                  : 'Post to WhatsApp'
              }
            >
              <ActionIcon
                variant="subtle"
                color="teal"
                onClick={() => handlePostStatusNow(status)}
                disabled={isLoading}
              >
                <Icon icon="tabler:upload" fontSize={18} />
              </ActionIcon>
            </Tooltip>
          )}
          <Tooltip label="Edit">
            <ActionIcon
              variant="subtle"
              color="blue"
              onClick={() => handleEdit(status)}
              disabled={
                isLoading ||
                status.status === StatusState.RUNNING ||
                status.status === StatusState.PENDING
              }
            >
              <Icon icon="tabler:edit" fontSize={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete">
            <ActionIcon
              variant="subtle"
              color="red"
              onClick={() => handleDelete(status.id)}
              disabled={
                isLoading ||
                status.status === StatusState.RUNNING ||
                status.status === StatusState.PENDING
              }
            >
              <Icon icon="tabler:trash" fontSize={18} />
            </ActionIcon>
          </Tooltip>
        </Group>
      ),
    },
  ]

  return (
    <>
      <LayoutPage width={700}>
        <Stack style={{ height: '100%' }}>
          <Group justify="space-between" mb="md">
            <TextInput
              placeholder={`Search by ${dataQuery.searchField || 'name'}...`}
              value={dataQuery.search}
              size="sm"
              onChange={(e) => dataQuery.setSearch(e.currentTarget.value)}
              leftSection={<Icon icon="tabler:search" fontSize={16} />}
            />
            <Button
              leftSection={<Icon icon="tabler:plus" fontSize={16} />}
              onClick={handleCreateNew}
            >
              New Status
            </Button>
          </Group>
          <ScrollArea style={{ flexGrow: 1 }}>
            <DataTable
              records={dataQuery.data || []}
              columns={columns}
              totalRecords={dataQuery.totalRecords}
              recordsPerPage={dataQuery.pageSize}
              page={dataQuery.page}
              onPageChange={dataQuery.setPage}
              sortStatus={
                dataQuery.sort
                  ? {
                      columnAccessor: dataQuery.sort.field,
                      direction: dataQuery.sort.direction,
                    }
                  : undefined
              }
              onSortStatusChange={(sortStatus) => {
                if (typeof sortStatus.columnAccessor === 'string') {
                  dataQuery.toggleSort(sortStatus.columnAccessor)
                }
              }}
              fetching={dataQuery.data === undefined}
              minHeight={500}
              withTableBorder
              borderRadius="sm"
              shadow="xs"
              striped
              highlightOnHover
              verticalAlign="top"
            />
          </ScrollArea>
        </Stack>
        <ModalCreateUpdateStatus
          opened={showModalCreateUpdate}
          onClose={modalCreateUpdateHandlers.close}
          data={editingStatus}
        />
      </LayoutPage>
      <StatusListener />
    </>
  )
}

export default PageStatus
