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
import { Badge, Stack, Switch, Text, Tooltip } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { DataTable, type DataTableColumn } from 'mantine-datatable'
import React, { useCallback, useMemo, useState } from 'react'
import EditableCell from './components/EditableCell'
import LabelActions from './components/LabelActions'
import LabelBulkActions from './components/LabelBulkActions'
import LabelContactsVisualization from './components/LabelContactsVisualization'
import LabelPageHeader from './components/LabelPageHeader'
import ModalCreateUpdateLabel from './components/ModalCreateUpdateLabel'
import ModalImportLabels from './components/ModalImportLabels' // ++ IMPORT NEW MODAL
import ModalManageContacts from './components/ModalManageContacts'

const PageLabel: React.FC = () => {
  const dataQuery = useDataQuery<Label>({
    table: db.labels,
    searchField: 'label',
    initialSort: { field: 'label', direction: 'asc' },
    initialPageSize: 10,
  })

  const wa = useWa()
  const { saveAs } = useFile()
  const [showCreateUpdateModal, createUpdateModalHandlers] =
    useDisclosure(false)
  const [editingLabel, setEditingLabel] = useState<Label | null>(null)
  const [showManageContactsModal, manageContactsModalHandlers] =
    useDisclosure(false)
  const [selectedLabel, setSelectedLabel] = useState<Label | null>(null)
  const [showImportModal, importModalHandlers] = useDisclosure(false)

  // Memoize handlers to prevent re-rendering of the header component
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

  const handleExportAll = useCallback(async () => {
    try {
      toast.info('Preparing backup file...')
      const allLabels = await db.labels.toArray()
      if (allLabels.length === 0) {
        toast.info('There are no labels to back up.')
        return
      }
      const exportableLabels = allLabels.map(({ id, ...rest }) => rest)
      const fileName = `whats-status-labels-backup-${new Date().toISOString().slice(0, 10)}`
      await saveAs(SaveAs.JSON, exportableLabels, fileName, {
        skipSerialization: true,
      })
      toast.success('All labels have been backed up successfully.')
    } catch (error) {
      console.error('Failed to export all labels:', error)
      toast.error('An error occurred while creating the backup.')
    }
  }, [saveAs])

  const handleDelete = useCallback(
    async (label: Label) => {
      if (
        confirm(`Are you sure you want to delete the label "${label.label}"?`)
      ) {
        try {
          if (label.id) {
            await db.labels.delete(label.id)
            toast.success(`Label "${label.label}" has been deleted.`)
            dataQuery.setSelectedRecords((prev) =>
              prev.filter((r) => r.id !== label.id),
            )
          }
        } catch (error) {
          console.error('Failed to delete label:', error)
          toast.error('An error occurred while deleting the label.')
        }
      }
    },
    [dataQuery],
  )

  const handleInlineUpdate = useCallback(
    async (label: Label, field: keyof Label, value: string | number) => {
      if (!label.id) return
      try {
        await db.labels.update(label.id, { [field]: value })
        toast.success(`Label field updated successfully.`)
      } catch (error) {
        console.error(`Failed to update label field "${field}":`, error)
        toast.error('An error occurred while saving the changes.')
        throw error
      }
    },
    [],
  )

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

  const handleExportSelected = useCallback(
    async (format: 'csv' | 'excel') => {
      const selectedLabels = dataQuery.selectedRecords
      if (selectedLabels.length === 0) {
        toast.info('No labels selected for export.')
        return
      }
      if (!wa.isReady) {
        toast.error('WhatsApp is not connected yet. Please wait.')
        return
      }
      toast.info('Preparing bulk export... This may take a moment.')
      try {
        let allContactsToExport: {
          name: string
          number: string
          label: string
        }[] = []
        for (const label of selectedLabels) {
          if (label.numbers && label.numbers.length > 0) {
            const contactDetails = await Promise.all(
              label.numbers.map(async (number: string) => {
                try {
                  const contact = await wa.contact.get(number)
                  return {
                    name: getContactName(contact),
                    number: number.replace('@c.us', ''),
                    label: label.label, // Add the source label for context
                  }
                } catch (e) {
                  return {
                    name: 'N/A',
                    number: number.replace('@c.us', ''),
                    label: label.label,
                  }
                }
              }),
            )
            allContactsToExport = allContactsToExport.concat(contactDetails)
          }
        }
        if (allContactsToExport.length === 0) {
          toast.info('Selected labels have no contacts to export.')
          return
        }
        const fileName = `whats-status-bulk-export-${new Date().toISOString().slice(0, 10)}`
        const saveFormat = format === 'csv' ? SaveAs.CSV : SaveAs.EXCEL
        await saveAs(saveFormat, allContactsToExport, fileName, {
          skipSerialization: true,
        })
        toast.success(
          `${allContactsToExport.length} contacts from ${selectedLabels.length} labels exported successfully.`,
        )
      } catch (error) {
        console.error('Failed to export selected contacts:', error)
        toast.error('An error occurred during the bulk export.')
      }
    },
    [dataQuery.selectedRecords, wa.isReady, wa.contact, saveAs],
  )

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
        dataQuery.setSelectedRecords([])
      } catch (error) {
        console.error('Failed to delete selected labels:', error)
        toast.error('An error occurred while deleting the labels.')
      }
    }
  }, [dataQuery])

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
        dataQuery.setSelectedRecords([])
      } catch (error) {
        console.error(
          `Failed to ${pin ? 'pin' : 'unpin'} selected labels:`,
          error,
        )
        toast.error('An error occurred while updating the labels.')
      }
    },
    [dataQuery],
  )

  const columns = useMemo<DataTableColumn<Label>[]>(
    () => [
      {
        accessor: 'label',
        title: 'Label',
        render: (label) => (
          <EditableCell
            value={label.label}
            onSave={(newValue) => handleInlineUpdate(label, 'label', newValue)}
          >
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
          </EditableCell>
        ),
      },
      {
        accessor: 'group',
        title: 'Group',
        render: (label) => (
          <EditableCell
            value={label.group || ''}
            onSave={(newValue) => handleInlineUpdate(label, 'group', newValue)}
          >
            <Text size="sm" truncate>
              {label.group || '-'}
            </Text>
          </EditableCell>
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
        accessor: 'show',
        title: 'Visible',
        textAlign: 'center',
        render: (label) => (
          <Tooltip
            label={
              label.show
                ? 'Visible in header filters'
                : 'Hidden from header filters'
            }
          >
            <Switch
              checked={!!label.show}
              onChange={(event) =>
                handleInlineUpdate(
                  label,
                  'show',
                  event.currentTarget.checked ? 1 : 0,
                )
              }
              onClick={(e) => e.stopPropagation()} // Prevent row click event
            />
          </Tooltip>
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
    [
      handleDelete,
      handleEdit,
      handleManageContacts,
      handleExport,
      handleInlineUpdate,
    ],
  )

  return (
    <>
      <LayoutPage>
        <Stack gap="md">
          {/* ++ USE THE NEW HEADER COMPONENT ++ */}
          <LabelPageHeader
            dataQuery={dataQuery}
            onAdd={handleCreate}
            onBackup={handleExportAll}
            onRestore={importModalHandlers.open}
          />

          {dataQuery.selectedRecords.length > 0 && (
            <LabelBulkActions
              selectedCount={dataQuery.selectedRecords.length}
              onDelete={handleDeleteSelected}
              onPin={() => handlePinToggleSelected(true)}
              onUnpin={() => handlePinToggleSelected(false)}
              onClear={() => dataQuery.setSelectedRecords([])}
              onExport={handleExportSelected}
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
            totalRecords={dataQuery.totalRecords}
            recordsPerPage={dataQuery.pageSize}
            page={dataQuery.page}
            onPageChange={dataQuery.setPage}
            recordsPerPageOptions={[10, 20, 50, 100]}
            onRecordsPerPageChange={dataQuery.setPageSize}
          />
        </Stack>
      </LayoutPage>

      <ModalCreateUpdateLabel
        opened={showCreateUpdateModal}
        data={editingLabel}
        onClose={createUpdateModalHandlers.close}
        onSuccess={dataQuery.clearFilters}
      />
      <ModalManageContacts
        opened={showManageContactsModal}
        label={selectedLabel}
        onClose={manageContactsModalHandlers.close}
      />
      <ModalImportLabels
        opened={showImportModal}
        onClose={importModalHandlers.close}
        onSuccess={() => {
          dataQuery.clearFilters() // Refresh data after successful import
        }}
      />
    </>
  )
}

export default PageLabel
