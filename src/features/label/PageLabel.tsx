import LayoutPage from '@/components/Layout/LayoutPage'
import useDataQuery from '@/hooks/useDataQuery'
import type { Label } from '@/libs/db'
import db from '@/libs/db'
import toast from '@/utils/toast'
import { Icon } from '@iconify/react'
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { DataTable, type DataTableColumn } from 'mantine-datatable'
import React, { useMemo, useState } from 'react'
import ModalCreateUpdateLabel from './components/ModalCreateUpdateLabel'

/**
 * @component PageLabels
 * @description A dedicated page for managing and viewing analytics for all labels.
 */
const PageLabels: React.FC = () => {
  // A custom hook to handle data fetching, searching, and sorting for the table.
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

  // Handlers for CRUD operations
  const handleCreate = () => {
    setEditingLabel(null)
    createUpdateModalHandlers.open()
  }

  const handleEdit = (label: Label) => {
    setEditingLabel(label)
    createUpdateModalHandlers.open()
  }

  const handleManageContacts = (label: Label) => {
    setSelectedLabel(label)
    manageContactsModalHandlers.open()
  }

  const handleDelete = async (label: Label) => {
    if (
      confirm(`Are you sure you want to delete the label "${label.label}"?`)
    ) {
      try {
        await db.labels.delete(label.id)
        toast.success(`Label "${label.label}" has been deleted.`)
      } catch (error) {
        console.error('Failed to delete label:', error)
        toast.error('An error occurred while deleting the label.')
      }
    }
  }

  const columns = useMemo<DataTableColumn<Label>[]>(
    () => [
      {
        accessor: 'label',
        title: 'Name',
        sortable: true,
        render: (label) => (
          <Badge color={label.color || 'gray'}>{label.label}</Badge>
        ),
      },
      {
        accessor: 'group',
        title: 'Group',
        sortable: true,
        render: (label) => label.group || <Text c="dimmed">-</Text>,
      },
      {
        accessor: 'contacts',
        title: 'Contacts',
        // This column is not directly sortable via the query but can be sorted on the client side.
        render: (label) => label.numbers?.length || 0,
      },
      {
        accessor: 'actions',
        title: <Box mr="xs">Actions</Box>,
        textAlign: 'right',
        render: (label) => (
          <Group gap={4} justify="flex-end" wrap="nowrap">
            <Tooltip label="Edit Label">
              <ActionIcon
                variant="subtle"
                color="blue"
                onClick={() => handleEdit(label)}
              >
                <Icon icon="tabler:edit" />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Delete Label">
              <ActionIcon
                variant="subtle"
                color="red"
                onClick={() => handleDelete(label)}
              >
                <Icon icon="tabler:trash" />
              </ActionIcon>
            </Tooltip>
          </Group>
        ),
      },
    ],
    [], // Empty dependency array means this function runs only once.
  )

  return (
    <>
      <LayoutPage title="Labels">
        <Stack gap="md">
          <Group justify="space-between">
            <TextInput
              placeholder="Search by label name..."
              value={dataQuery.search}
              size="sm"
              onChange={(e) => dataQuery.setSearch(e.currentTarget.value)}
              leftSection={<Icon icon="tabler:search" fontSize={16} />}
            />
            <Button
              leftSection={<Icon icon="tabler:plus" fontSize={18} />}
              onClick={handleCreate}
            >
              Add Label
            </Button>
          </Group>
          <DataTable
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
            minHeight={300}
            noRecordsText="No labels found."
            striped
            highlightOnHover
            withTableBorder
            borderRadius="sm"
          />
        </Stack>
      </LayoutPage>
      {/* Modal for Creating/Updating Labels */}
      <ModalCreateUpdateLabel
        opened={showCreateUpdateModal}
        onClose={createUpdateModalHandlers.close}
        data={editingLabel}
        onSuccess={() => {
          // The useLiveQuery in useDataQuery will automatically refresh the data.
          createUpdateModalHandlers.close()
        }}
      />
    </>
  )
}

export default PageLabels
