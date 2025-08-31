// src/features/label/PageLabel.tsx
import LayoutPage from '@/components/Layout/LayoutPage'
import { SaveAs } from '@/constants'
import useDataQuery from '@/hooks/useDataQuery'
import useFile from '@/hooks/useFile'
import useWa from '@/hooks/useWa'
import type { Label } from '@/libs/db'
import db from '@/libs/db'
import toast from '@/utils/toast'
import { getContactName } from '@/utils/util'
import { Icon } from '@iconify/react'
import { Badge, Button, Group, Stack, TextInput, Tooltip } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { DataTable, type DataTableColumn } from 'mantine-datatable'
import React, { useCallback, useMemo, useState } from 'react'
import LabelActions from './components/LabelActions'
import LabelBulkActions from './components/LabelBulkActions'
import LabelContactsVisualization from './components/LabelContactsVisualization'
import ModalCreateUpdateLabel from './components/ModalCreateUpdateLabel'
import ModalManageContacts from './components/ModalManageContacts'

/**
 * @component PageLabel
 * @description A dedicated page for managing labels. It allows users to create,
 * view, edit, delete, and manage contacts for each label. Now includes bulk actions and pagination.
 */
const PageLabel: React.FC = () => {
  const dataQuery = useDataQuery<Label>({
    table: db.labels,
    searchField: 'label',
    initialSort: { field: 'label', direction: 'asc' },
    initialPageSize: 10, // Set initial page size
  })

  const wa = useWa()
  const { saveAs } = useFile()
  const [showCreateUpdateModal, createUpdateModalHandlers] =
    useDisclosure(false)
  const [editingLabel, setEditingLabel] = useState<Label | null>(null)
  const [showManageContactsModal, manageContactsModalHandlers] =
    useDisclosure(false)
  const [selectedLabel, setSelectedLabel] = useState<Label | null>(null)

  // --- Handlers for CRUD operations ---
  const handleCreate = useCallback(() => {
    setEditingLabel(null)
    createUpdateModalHandlers.open()
  }, [createUpdateModalHandlers])

  const handleEdit = useCallback(
    (label: Label) => {
      setEditingLabel(label)
      createUpdateModalHandlers.open()
    },
    [createUpdateModalHandlers],
  )

  const handleManageContacts = useCallback(
    (label: Label) => {
      setSelectedLabel(label)
      manageContactsModalHandlers.open()
    },
    [manageContactsModalHandlers],
  )

  const handleDelete = useCallback(async (label: Label) => {
    if (
      confirm(`Are you sure you want to delete the label "${label.label}"?`)
    ) {
      try {
        if (label.id) {
          await db.labels.delete(label.id)
          toast.success(`Label "${label.label}" has been deleted.`)
        }
      } catch (error) {
        console.error('Failed to delete label:', error)
        toast.error('An error occurred while deleting the label.')
      }
    }
  }, [])

  // --- Handlers for Export Action ---
  const handleExport = useCallback(
    async (label: Label, format: 'csv' | 'excel') => {
      if (!wa.isReady) {
        toast.error('WhatsApp is not connected yet. Please wait.')
        return
      }
      if (!label.numbers || label.numbers.length === 0) {
        toast.info(`Label "${label.label}" has no contacts to export.`)
        return
      }
      toast.info('Preparing export... This may take a moment.')
      try {
        const contactDetails = await Promise.all(
          label.numbers.map(async (number: string) => {
            try {
              const contact = await wa.contact.get(number)
              return {
                name: getContactName(contact),
                number: number.replace('@c.us', ''),
              }
            } catch (e) {
              return { name: 'N/A', number: number.replace('@c.us', '') }
            }
          }),
        )

        const fileName = `whats-status-export-${label.label.replace(
          /\s/g,
          '_',
        )}`
        const saveFormat = format === 'csv' ? SaveAs.CSV : SaveAs.EXCEL
        await saveAs(saveFormat, contactDetails, fileName, {
          skipSerialization: true,
        })
        toast.success(
          `${contactDetails.length} contacts exported successfully.`,
        )
      } catch (error) {
        console.error('Failed to export contacts:', error)
        toast.error('An error occurred while exporting contacts.')
      }
    },
    [wa.isReady, wa.contact, saveAs],
  )

  // --- Handlers for Bulk Actions ---
  const handleDeleteSelected = useCallback(async () => {
    const selectedIds = dataQuery.selectedRecords
      .map((label) => label.id)
      .filter(Boolean) as number[]
    if (selectedIds.length === 0) return
    if (
      confirm(
        `Are you sure you want to delete ${selectedIds.length} selected labels?`,
      )
    ) {
      try {
        await db.labels.bulkDelete(selectedIds)
        toast.success(`${selectedIds.length} labels have been deleted.`)
        dataQuery.setSelectedRecords([]) // Clear selection
      } catch (error) {
        console.error('Failed to delete selected labels:', error)
        toast.error('An error occurred while deleting the labels.')
      }
    }
  }, [dataQuery.selectedRecords, dataQuery.setSelectedRecords])

  const handlePinToggleSelected = useCallback(
    async (pin: boolean) => {
      const selectedLabels = dataQuery.selectedRecords
      if (selectedLabels.length === 0) return

      const updatedLabels = selectedLabels.map((label) => ({
        ...label,
        isPinned: pin ? 1 : 0,
      }))

      try {
        await db.labels.bulkPut(updatedLabels)
        toast.success(
          `${selectedLabels.length} labels have been ${
            pin ? 'pinned' : 'unpinned'
          }.`,
        )
        dataQuery.setSelectedRecords([]) // Clear selection
      } catch (error) {
        console.error(
          `Failed to ${pin ? 'pin' : 'unpin'} selected labels:`,
          error,
        )
        toast.error('An error occurred while updating the labels.')
      }
    },
    [dataQuery.selectedRecords, dataQuery.setSelectedRecords],
  )

  const columns = useMemo<DataTableColumn<Label>[]>(
    () => [
      {
        accessor: 'label',
        title: 'Label',
        render: (label) => (
          <Tooltip
            label={label.description}
            position="top-start"
            withArrow
            multiline
            w={220}
            disabled={!label.description}
          >
            <Badge color={label.color || 'gray'}>{label.label}</Badge>
          </Tooltip>
        ),
      },
      {
        accessor: 'numbers',
        title: 'Contacts',
        render: (label) => (
          <LabelContactsVisualization contactIds={label.numbers || []} />
        ),
      },
      {
        accessor: 'isPinned',
        title: 'Pinned',
        textAlign: 'center',
        render: (label) =>
          label.isPinned ? (
            <Tooltip label="Pinned">
              <Icon
                icon="tabler:star-filled"
                color="var(--mantine-color-yellow-6)"
              />
            </Tooltip>
          ) : null,
      },
      {
        accessor: 'actions',
        title: 'Actions',
        textAlign: 'center',
        render: (label) => (
          <LabelActions
            label={label}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onManageContacts={handleManageContacts}
            onExport={handleExport}
          />
        ),
      },
    ],
    [handleDelete, handleEdit, handleManageContacts, handleExport],
  )

  return (
    <>
      <LayoutPage>
        <Stack gap="md">
          <Group justify="space-between">
            <TextInput
              placeholder="Search by label name..."
              value={dataQuery.search}
              size="sm"
              onChange={(e) => dataQuery.setSearch(e.currentTarget.value)}
              leftSection={<Icon icon="tabler:search" fontSize={16} />}
              style={{ flex: 1, maxWidth: 400 }}
            />
            <Button
              leftSection={<Icon icon="tabler:plus" fontSize={18} />}
              onClick={handleCreate}
            >
              {' '}
              Add Label{' '}
            </Button>
          </Group>

          {dataQuery.selectedRecords.length > 0 && (
            <LabelBulkActions
              selectedCount={dataQuery.selectedRecords.length}
              onDelete={handleDeleteSelected}
              onPin={() => handlePinToggleSelected(true)}
              onUnpin={() => handlePinToggleSelected(false)}
              onClear={() => dataQuery.setSelectedRecords([])}
            />
          )}

          <DataTable
            minHeight={420}
            records={dataQuery.data}
            columns={columns}
            striped
            highlightOnHover
            withTableBorder
            borderRadius="sm"
            fetching={!dataQuery.data}
            noRecordsText="No labels found. Create one to get started."
            selectedRecords={dataQuery.selectedRecords}
            onSelectedRecordsChange={dataQuery.setSelectedRecords}
            idAccessor="id"
            // START: MODIFIED - Added pagination properties
            totalRecords={dataQuery.totalRecords}
            recordsPerPage={dataQuery.pageSize}
            page={dataQuery.page}
            onPageChange={dataQuery.setPage}
            recordsPerPageOptions={[10, 20, 50, 100]}
            onRecordsPerPageChange={dataQuery.setPageSize}
            // END: MODIFIED
          />
        </Stack>
      </LayoutPage>

      <ModalCreateUpdateLabel
        opened={showCreateUpdateModal}
        data={editingLabel}
        onClose={createUpdateModalHandlers.close}
      />
      <ModalManageContacts
        opened={showManageContactsModal}
        label={selectedLabel}
        onClose={manageContactsModalHandlers.close}
      />
    </>
  )
}

export default PageLabel
