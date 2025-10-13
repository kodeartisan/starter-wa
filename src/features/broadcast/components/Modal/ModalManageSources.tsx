// src/features/broadcast/components/Modal/ModalManageSources.tsx
import Modal from '@/components/Modal/Modal'
import useLicense from '@/hooks/useLicense'
import db from '@/libs/db'
import toast from '@/utils/toast'
import { showModalUpgrade } from '@/utils/util'
import { Icon } from '@iconify/react'
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Menu,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core'
import { useDebouncedValue, useDisclosure } from '@mantine/hooks'
import _ from 'lodash'
import { DataTable, type DataTableSortStatus } from 'mantine-datatable'
import React, { useEffect, useMemo, useState } from 'react'
import ModalLoadRecipientList from './ModalLoadRecipientList'
import ModalSaveRecipientList from './ModalSaveRecipientList'
import ModalSourceExcel from './ModalSourceExcel'
import ModalSourceGroups from './ModalSourceGroups'

interface Props {
  opened: boolean
  onClose: () => void
  onSubmit: (recipients: any[]) => void
  initialRecipients: any[]
}

const PAGE_SIZE = 10

const ModalManageSources: React.FC<Props> = ({
  opened,
  onClose,
  onSubmit,
  initialRecipients,
}) => {
  const [recipients, setRecipients] = useState<any[]>([])
  const [selectedRecords, setSelectedRecords] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [paginatedRecipients, setPaginatedRecipients] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 300)
  const [isSaving, setIsSaving] = useState(false)
  const [editingCell, setEditingCell] = useState<{
    recordId: string
    columnId: string
  } | null>(null)
  const [editValue, setEditValue] = useState('')
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'name',
    direction: 'asc',
  })
  const [showExcelModal, excelModalHandlers] = useDisclosure(false)
  const [showGroupsModal, groupsModalHandlers] = useDisclosure(false)
  const [showSaveListModal, saveListModalHandlers] = useDisclosure(false)
  const [showLoadListModal, loadListModalHandlers] = useDisclosure(false)
  const license = useLicense()

  useEffect(() => {
    if (opened) {
      setRecipients(_.cloneDeep(initialRecipients))
      setSelectedRecords([])
      setPage(1)
      setSearchQuery('')
      setSortStatus({ columnAccessor: 'name', direction: 'asc' })
    }
  }, [opened, initialRecipients])

  const filteredAndSortedRecipients = useMemo(() => {
    let data = [...recipients]
    if (debouncedSearchQuery) {
      const lowerCaseQuery = debouncedSearchQuery.toLowerCase()
      data = data.filter(
        (r) =>
          r.name?.toLowerCase().includes(lowerCaseQuery) ||
          r.number?.toLowerCase().includes(lowerCaseQuery),
      )
    }
    const { columnAccessor, direction } = sortStatus
    if (columnAccessor) {
      data = _.orderBy(data, [columnAccessor], [direction])
    }
    return data
  }, [recipients, debouncedSearchQuery, sortStatus])

  useEffect(() => {
    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE
    setPaginatedRecipients(filteredAndSortedRecipients.slice(from, to))
  }, [filteredAndSortedRecipients, page])

  useEffect(() => {
    setPage(1)
  }, [searchQuery, sortStatus])

  const handleAddRecipients = (newRecipients: any[]) => {
    const formattedNewRecipients = newRecipients.map((rec) => {
      if (typeof rec === 'string') {
        return { number: rec, name: 'N/A', source: 'Manual' }
      }
      return {
        number: rec.number || rec.phoneNumber,
        name: rec.name || rec.savedName || rec.publicName || 'N/A',
      }
    })
    const initialCount = recipients.length
    const combined = [...recipients, ...formattedNewRecipients]
    const uniqueRecipients = _.uniqBy(combined, 'number')
    const finalCount = uniqueRecipients.length
    setRecipients(uniqueRecipients)
    const addedCount = finalCount - initialCount
    const duplicateCount = combined.length - finalCount
    if (addedCount > 0 && duplicateCount > 0) {
      toast.info(
        `${addedCount} recipient(s) added. ${duplicateCount} duplicate(s) were automatically removed.`,
      )
    } else if (addedCount > 0) {
      toast.success(`${addedCount} recipient(s) added successfully.`)
    } else if (duplicateCount > 0) {
      toast.info(
        `No new recipients added. ${duplicateCount} duplicate(s) were found.`,
      )
    } else {
      toast.info('No new recipients were added.')
    }
  }

  const handleDeleteRecipient = (numberToDelete: string) => {
    setRecipients((current) =>
      current.filter((r) => r.number !== numberToDelete),
    )
  }

  const handleBulkDelete = () => {
    const numbersToDelete = new Set(selectedRecords.map((r) => r.number))
    setRecipients((current) =>
      current.filter((r) => !numbersToDelete.has(r.number)),
    )
    setSelectedRecords([])
    toast.success(`${numbersToDelete.size} recipient(s) deleted.`)
  }

  const handleSaveCellEdit = () => {
    if (!editingCell) return
    const { recordId, columnId } = editingCell
    const finalValue = editValue.trim()
    if (columnId === 'number') {
      if (finalValue === '') {
        toast.error('Number cannot be empty.')
        return
      }
      const isDuplicate = recipients.some(
        (r) => r.number === finalValue && r.number !== recordId,
      )
      if (isDuplicate) {
        toast.error(`The number ${finalValue} already exists in the list.`)
        return
      }
    }
    setRecipients((currentRecipients) =>
      currentRecipients.map((r) => {
        if (r.number === recordId) {
          const valueToSet =
            finalValue === '' && columnId === 'name' ? r.name : finalValue
          return { ...r, [columnId]: valueToSet }
        }
        return r
      }),
    )
    setEditingCell(null)
  }

  const handleOpenSaveListModal = async () => {
    if (license.isFree()) {
      const existingListsCount = await db.broadcastRecipients.count()
      if (existingListsCount >= 1) {
        showModalUpgrade(
          'Unlimited Recipient Lists',
          'Upgrade to Pro to save and manage unlimited recipient lists for easy reuse.',
        )
        return
      }
    }
    saveListModalHandlers.open()
  }

  const handleSaveList = async (name: string) => {
    if (recipients.length === 0) {
      toast.error('Cannot save an empty list.')
      return
    }
    setIsSaving(true)
    try {
      await db.broadcastRecipients.add({
        name,
        recipients,
        createdAt: new Date(),
      })
      toast.success(`List "${name}" saved successfully.`)
      saveListModalHandlers.close()
    } catch (error) {
      console.error('Failed to save list:', error)
      toast.error('Failed to save the list.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleLoadList = (loadedRecipients: any[]) => {
    setRecipients(loadedRecipients)
    toast.success(`Loaded ${loadedRecipients.length} recipients.`)
  }

  const handleClearAll = () => {
    if (
      confirm('Are you sure you want to remove all recipients from this list?')
    ) {
      setRecipients([])
    }
  }

  const handleConfirm = () => {
    onSubmit(recipients)
    onClose()
  }

  const handleExcelButtonClick = () => {
    if (license.isFree()) {
      showModalUpgrade(
        'Import from Excel',
        'Upgrade to Pro to bulk import recipients from an Excel or CSV file instantly.',
      )
      return
    }
    excelModalHandlers.open()
  }

  const columns: any[] = [
    {
      accessor: 'number',
      title: 'Number',
      sortable: true,
      ellipsis: true,
      render: (recipient) => {
        const isEditing =
          editingCell?.recordId === recipient.number &&
          editingCell?.columnId === 'number'
        return isEditing ? (
          <Group gap="xs" wrap="nowrap">
            <TextInput
              value={editValue}
              onChange={(e) => setEditValue(e.currentTarget.value)}
              onBlur={handleSaveCellEdit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleSaveCellEdit()
                } else if (e.key === 'Escape') {
                  setEditingCell(null)
                }
              }}
              autoFocus
              size="xs"
              style={{ flexGrow: 1 }}
            />
            <Tooltip label="Save" withArrow position="top">
              <ActionIcon
                variant="subtle"
                color="teal"
                onClick={handleSaveCellEdit}
              >
                <Icon icon="tabler:check" />
              </ActionIcon>
            </Tooltip>
          </Group>
        ) : (
          <Tooltip label="Click to edit" withArrow position="top">
            <Text
              onClick={() => {
                setEditingCell({
                  recordId: recipient.number,
                  columnId: 'number',
                })
                setEditValue(recipient.number)
              }}
              style={{
                cursor: 'pointer',
                width: '100%',
                padding: '6px 0',
                height: '100%',
              }}
              truncate
            >
              {recipient.number}
            </Text>
          </Tooltip>
        )
      },
    },
    {
      accessor: 'name',
      title: 'Name',
      sortable: true,
      render: (recipient) => {
        const isEditing =
          editingCell?.recordId === recipient.number &&
          editingCell?.columnId === 'name'
        return isEditing ? (
          <Group gap="xs" wrap="nowrap">
            <TextInput
              value={editValue}
              onChange={(e) => setEditValue(e.currentTarget.value)}
              onBlur={handleSaveCellEdit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleSaveCellEdit()
                } else if (e.key === 'Escape') {
                  setEditingCell(null)
                }
              }}
              autoFocus
              size="xs"
              style={{ flexGrow: 1 }}
            />
            <Tooltip label="Save" withArrow position="top">
              <ActionIcon
                variant="subtle"
                color="teal"
                onClick={handleSaveCellEdit}
              >
                <Icon icon="tabler:check" />
              </ActionIcon>
            </Tooltip>
          </Group>
        ) : (
          <Tooltip label="Click to edit" withArrow position="top">
            <Text
              onClick={() => {
                setEditingCell({
                  recordId: recipient.number,
                  columnId: 'name',
                })
                setEditValue(recipient.name)
              }}
              style={{
                cursor: 'pointer',
                width: '100%',
                padding: '6px 0',
                height: '100%',
              }}
              truncate
            >
              {recipient.name}
            </Text>
          </Tooltip>
        )
      },
    },
    {
      accessor: 'actions',
      title: <Text>Actions</Text>,
      textAlign: 'right',
      width: '0%',
      render: (recipient) => (
        <Group gap={4} justify="right" wrap="nowrap">
          <Tooltip label="Delete">
            <ActionIcon
              size="sm"
              variant="subtle"
              color="red"
              onClick={() => handleDeleteRecipient(recipient.number)}
            >
              <Icon icon="tabler:trash" />
            </ActionIcon>
          </Tooltip>
        </Group>
      ),
    },
  ]

  return (
    <>
      <Modal opened={opened} onClose={onClose} w={850} withCloseButton>
        <Stack justify="space-between" h={'calc(80vh)'} p="sm">
          <Stack>
            <Group justify="space-between">
              <Group>
                <Text fw={500}>Current Recipients ({recipients.length})</Text>
                {selectedRecords.length > 0 && (
                  <Button
                    size="xs"
                    variant="light"
                    color="red"
                    leftSection={<Icon icon="tabler:trash" fontSize={16} />}
                    onClick={handleBulkDelete}
                  >
                    Delete Selected ({selectedRecords.length})
                  </Button>
                )}
              </Group>
              <Group>
                <Button.Group>
                  <Button
                    size="xs"
                    variant="default"
                    leftSection={
                      <Icon icon="tabler:file-type-xls" fontSize={16} />
                    }
                    onClick={handleExcelButtonClick}
                  >
                    <Group gap="xs" wrap="nowrap">
                      <Text component="span" size="xs">
                        Excel
                      </Text>
                      {license.isFree() && (
                        <Badge color="yellow" variant="light" size="xs">
                          Pro
                        </Badge>
                      )}
                    </Group>
                  </Button>
                  <Button
                    size="xs"
                    variant="default"
                    leftSection={<Icon icon="tabler:users" fontSize={16} />}
                    onClick={groupsModalHandlers.open}
                  >
                    Groups
                  </Button>

                  <Button
                    size="xs"
                    variant="default"
                    leftSection={
                      <Icon icon="tabler:database-import" fontSize={16} />
                    }
                    onClick={loadListModalHandlers.open}
                  >
                    Load List
                  </Button>
                </Button.Group>
                <Menu shadow="md" withArrow>
                  <Menu.Target>
                    <Button
                      variant="default"
                      size="xs"
                      leftSection={
                        <Icon icon="tabler:settings" fontSize={16} />
                      }
                    >
                      Manage
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      leftSection={
                        <Icon icon="tabler:device-floppy" fontSize={16} />
                      }
                      onClick={handleOpenSaveListModal}
                      disabled={recipients.length === 0}
                    >
                      Save Current List
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
                <Button
                  size="xs"
                  variant="light"
                  color="red"
                  leftSection={<Icon icon="tabler:x" fontSize={16} />}
                  onClick={handleClearAll}
                  disabled={recipients.length === 0}
                >
                  Clear All
                </Button>
              </Group>
            </Group>
            <TextInput
              placeholder={`Search in ${recipients.length} recipients...`}
              leftSection={<Icon icon="tabler:search" fontSize={16} />}
              value={searchQuery}
              size="sm"
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              disabled={recipients.length === 0}
            />
            <DataTable
              height={'calc(70vh - 160px)'}
              records={paginatedRecipients}
              columns={columns}
              totalRecords={filteredAndSortedRecipients.length}
              recordsPerPage={PAGE_SIZE}
              page={page}
              onPageChange={(p) => setPage(p)}
              minHeight={filteredAndSortedRecipients.length === 0 ? 150 : 0}
              noRecordsText={
                searchQuery
                  ? 'No recipients match your search'
                  : 'No recipients added yet.'
              }
              withTableBorder={false}
              striped
              selectedRecords={selectedRecords}
              onSelectedRecordsChange={setSelectedRecords}
              idAccessor="number"
              sortStatus={sortStatus}
              onSortStatusChange={setSortStatus}
            />
          </Stack>
          <Group justify="flex-end">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Confirm & Close</Button>
          </Group>
        </Stack>
      </Modal>
      <ModalSourceExcel
        opened={showExcelModal}
        onClose={excelModalHandlers.close}
        onSubmit={handleAddRecipients}
      />
      <ModalSourceGroups
        opened={showGroupsModal}
        onClose={groupsModalHandlers.close}
        onSubmit={handleAddRecipients}
      />
      <ModalSaveRecipientList
        opened={showSaveListModal}
        onClose={saveListModalHandlers.close}
        onSave={handleSaveList}
        isSaving={isSaving}
      />
      <ModalLoadRecipientList
        opened={showLoadListModal}
        onClose={loadListModalHandlers.close}
        onLoad={handleLoadList}
      />
    </>
  )
}

export default ModalManageSources
