// src/features/label/PageLabel.tsx
import LayoutPage from '@/components/Layout/LayoutPage'
import useDataQuery from '@/hooks/useDataQuery'
import type { Label } from '@/libs/db'
import db from '@/libs/db'
import toast from '@/utils/toast'
import { Icon } from '@iconify/react'
import {
  Badge,
  Button,
  Group,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { DataTable, type DataTableColumn } from 'mantine-datatable'
import React, { useCallback, useMemo, useState } from 'react'
import LabelActions from './components/LabelActions'
import ModalCreateUpdateLabel from './components/ModalCreateUpdateLabel'
import ModalManageContacts from './components/ModalManageContacts'

/**
 * @component PageLabel
 * @description A dedicated page for managing labels. It allows users to create,
 * view, edit, delete, and manage contacts for each label.
 */
const PageLabel: React.FC = () => {
  // Custom hook to handle data fetching, searching, and sorting for the table.
  const dataQuery = useDataQuery<Label>({
    table: db.labels,
    searchField: 'label',
    initialSort: { field: 'label', direction: 'asc' },
  })

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

  // Memoized column definitions for the DataTable for performance.
  const columns = useMemo<DataTableColumn<Label>[]>(
    () => [
      {
        accessor: 'label',
        title: 'Label',
        render: (label) => (
          <Badge color={label.color || 'gray'}>{label.label}</Badge>
        ),
      },
      {
        accessor: 'numbers',
        title: 'Contacts',
        textAlign: 'center',
        render: (label) => <Text size="sm">{label.numbers?.length || 0}</Text>,
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
          />
        ),
      },
    ],
    [handleDelete, handleEdit, handleManageContacts],
  )

  return (
    <>
      <LayoutPage title="Manage Labels">
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
              Add Label
            </Button>
          </Group>
          <DataTable
            minHeight={450}
            records={dataQuery.data}
            columns={columns}
            striped
            highlightOnHover
            withTableBorder
            borderRadius="sm"
            fetching={!dataQuery.data}
            noRecordsText="No labels found. Create one to get started."
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
