// src/features/broadcast/PageBroadcast.tsx
import LayoutPage from '@/components/Layout/LayoutPage'
import { Media, Status } from '@/constants'
import useDataQuery from '@/hooks/useDataQuery'
import useFile from '@/hooks/useFile'
import useLicense from '@/hooks/useLicense'
import type { Broadcast } from '@/libs/db'
import db from '@/libs/db'
import toast from '@/utils/toast'
import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Group,
  LoadingOverlay,
  Stack,
  TextInput,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useLiveQuery } from 'dexie-react-hooks'
import { DataTable } from 'mantine-datatable'
import React, { useMemo, useState } from 'react'
import { getBroadcastColumns } from './components/Datatable/BroadcastColumns'
import ModalCreateBroadcast from './components/Modal/ModalCreateBroadcast'
import ModalDetailHistory from './components/Modal/ModalDetailHistory'
import useBroadcast from './hooks/useBroadcast'

const PageBroadcast: React.FC = () => {
  const dataQuery = useDataQuery<Broadcast>({
    table: db.broadcasts,
    initialPageSize: 10,
    searchField: 'name',
    initialSort: { field: 'id', direction: 'desc' },
  })
  const broadcastHook = useBroadcast()
  const fileExporter = useFile()
  const license = useLicense()
  const allBroadcastContacts =
    useLiveQuery(() => db.broadcastContacts.toArray(), []) || []

  const [showModalCreate, modalCreateHandlers] = useDisclosure(false)
  const [showModalDetail, modalDetailHandlers] = useDisclosure(false)
  const [detailData, setDetailData] = useState<Broadcast | null>(null)
  const [cloneData, setCloneData] = useState<
    (Broadcast & { recipients?: any[] }) | null
  >(null)
  const [isExporting, setIsExporting] = useState(false)
  const [selectedRecords, setSelectedRecords] = useState<Broadcast[]>([])

  const broadcastStatsMap = useMemo(() => {
    const statsMap = new Map<
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
        scheduledAt?: Date // ++ ADDED: Add optional scheduledAt property
      }
    >()

    for (const contact of allBroadcastContacts) {
      if (!statsMap.has(contact.broadcastId)) {
        statsMap.set(contact.broadcastId, {
          total: 0,
          success: 0,
          pending: 0,
          running: 0,
          failed: 0,
          scheduled: 0,
          cancelled: 0,
        })
      }

      const stats = statsMap.get(contact.broadcastId)!
      stats.total++

      switch (contact.status) {
        case Status.SUCCESS:
          stats.success++
          break
        case Status.PENDING:
          stats.pending++
          break
        case Status.RUNNING:
          stats.running++
          break
        case Status.FAILED:
          stats.failed++
          if (!stats.firstError && contact.error) {
            stats.firstError = contact.error
          }
          break
        case Status.SCHEDULER:
          stats.scheduled++
          // ++ ADDED: Capture the scheduled date from the first relevant contact found.
          if (!stats.scheduledAt && contact.scheduledAt) {
            stats.scheduledAt = contact.scheduledAt
          }
          break
        case Status.CANCELLED:
          stats.cancelled++
          break
      }
    }
    return statsMap
  }, [allBroadcastContacts])

  const handleOpenCreateModal = (
    dataToClone: (Broadcast & { recipients?: any[] }) | null = null,
  ) => {
    setCloneData(dataToClone)
    modalCreateHandlers.open()
  }

  const handleResendToFailed = async (broadcast: Broadcast) => {
    const failedRecipients = await db.broadcastContacts
      .where({ broadcastId: broadcast.id, status: Status.FAILED })
      .toArray()
    if (failedRecipients.length === 0) {
      toast.info('No failed recipients to resend to.')
      return
    }
    const recipients = failedRecipients.map((c) => ({
      number: c.number,
      name: c.name,
    }))
    handleOpenCreateModal({ ...broadcast, recipients })
  }

  const handleViewDetails = (broadcast: Broadcast) => {
    setDetailData(broadcast)
    modalDetailHandlers.open()
  }

  const deleteBroadcasts = async (broadcastsToDelete: Broadcast[]) => {
    if (broadcastsToDelete.length === 0) return
    const isPlural = broadcastsToDelete.length > 1
    const confirmationMessage = `Are you sure you want to delete ${
      broadcastsToDelete.length
    } broadcast${isPlural ? 's' : ''}? This action is irreversible.`

    if (!confirm(confirmationMessage)) return

    try {
      const broadcastIds = broadcastsToDelete.map((b) => b.id)

      await db.transaction(
        'rw',
        db.broadcasts,
        db.broadcastContacts,
        db.media,
        async () => {
          await db.broadcastContacts
            .where('broadcastId')
            .anyOf(broadcastIds)
            .delete()

          await db.media
            .where('parentId')
            .anyOf(broadcastIds)
            .and((item) => item.type === Media.BROADCAST)
            .delete()

          await db.broadcasts.bulkDelete(broadcastIds)
        },
      )
      toast.success(
        `${broadcastsToDelete.length} broadcast${
          isPlural ? 's' : ''
        } deleted successfully.`,
      )
      setSelectedRecords([])
    } catch (error) {
      console.error('Failed to delete broadcast(s):', error)
      toast.error('Failed to delete the broadcast(s).')
    }
  }

  const handleDelete = (broadcast: Broadcast) => {
    deleteBroadcasts([broadcast])
  }

  const handleBulkDelete = () => {
    deleteBroadcasts(selectedRecords)
  }

  const handleClearAll = async () => {
    const allBroadcasts = await db.broadcasts.toArray()
    if (allBroadcasts.length === 0) {
      toast.info('There are no broadcasts to clear.')
      return
    }
    await deleteBroadcasts(allBroadcasts)
  }

  const handleExport = async (broadcast: Broadcast, format: string) => {
    setIsExporting(true)
    try {
      const contacts = await db.broadcastContacts
        .where({ broadcastId: broadcast.id })
        .toArray()

      if (contacts.length === 0) {
        toast.info('No data to export.')
        return
      }

      const dataForExport = contacts.map((c) => ({
        Name: c.name || '-',
        'Number/ID': c.number.split('@')[0],
        Status: c.status,
        'Sent At': c.sendAt ? new Date(c.sendAt).toLocaleString() : '-',
        Error: c.error || '-',
      }))
      const filename = `broadcast_${
        broadcast.name || broadcast.id
      }_${new Date().toISOString().slice(0, 10)}`
      await fileExporter.saveAs(format, dataForExport, filename)
    } catch (error) {
      console.error('Failed to export broadcast data:', error)
      toast.error('An error occurred during export.')
    } finally {
      setIsExporting(false)
    }
  }

  const columns = getBroadcastColumns(
    {
      onViewDetails: handleViewDetails,
      onResendToFailed: handleResendToFailed,
      onClone: handleOpenCreateModal,
      onExport: handleExport,
      onCancel: broadcastHook.cancel,
      onDelete: handleDelete,
    },
    broadcastStatsMap,
  )

  return (
    <LayoutPage title="Broadcast">
      <Stack style={{ height: '100%' }}>
        <Group justify="space-between" mb="md">
          <TextInput
            placeholder="Search by Name"
            value={dataQuery.search}
            size="sm"
            onChange={(e) => dataQuery.setSearch(e.currentTarget.value)}
            leftSection={<Icon icon="tabler:search" fontSize={16} />}
          />

          <Group>
            {selectedRecords.length > 0 && (
              <Button
                variant="outline"
                color="red"
                size="sm"
                leftSection={<Icon icon="tabler:trash" fontSize={18} />}
                onClick={handleBulkDelete}
              >
                Delete Selected ({selectedRecords.length})
              </Button>
            )}

            {dataQuery.data &&
              dataQuery.data.length > 0 &&
              selectedRecords.length === 0 && (
                <Button
                  variant="default"
                  color="red"
                  size="sm"
                  leftSection={<Icon icon="tabler:clear-all" fontSize={18} />}
                  onClick={handleClearAll}
                >
                  Clear All
                </Button>
              )}
            <Button
              size="sm"
              leftSection={<Icon icon="tabler:plus" fontSize={18} />}
              onClick={() => handleOpenCreateModal()}
            >
              Create Broadcast
            </Button>
          </Group>
        </Group>

        <Box style={{ position: 'relative' }}>
          <LoadingOverlay
            visible={isExporting || dataQuery.data === undefined}
            zIndex={1000}
            overlayProps={{ radius: 'sm', blur: 2 }}
          />
          <DataTable
            selectedRecords={selectedRecords}
            onSelectedRecordsChange={setSelectedRecords}
            records={dataQuery.data}
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
            onSortStatusChange={(status) => {
              if (typeof status.columnAccessor === 'string') {
                dataQuery.toggleSort(status.columnAccessor)
              }
            }}
            minHeight={500}
            noRecordsText="No broadcasts found"
            striped
            highlightOnHover
            withTableBorder
            borderRadius="sm"
            shadow="xs"
            verticalAlign="top"
          />
        </Box>
      </Stack>

      <ModalCreateBroadcast
        opened={showModalCreate}
        onClose={() => {
          modalCreateHandlers.close()
          setCloneData(null)
        }}
        onSuccess={() => {
          modalCreateHandlers.close()
          setCloneData(null)
        }}
        cloneData={cloneData}
      />
      <ModalDetailHistory
        opened={showModalDetail}
        onClose={modalDetailHandlers.close}
        data={detailData}
      />
    </LayoutPage>
  )
}

export default PageBroadcast
