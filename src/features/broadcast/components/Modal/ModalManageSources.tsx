// src/features/broadcast/components/Modal/ModalManageSources.tsx
import Modal from '@/components/Modal/Modal'
import useFile from '@/hooks/useFile'
import db from '@/libs/db'
import toast from '@/utils/toast'
import { Icon } from '@iconify/react'
import {
  ActionIcon,
  Button,
  Group,
  Menu,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import _ from 'lodash'
import { DataTable, type DataTableColumn } from 'mantine-datatable'
import React, { useEffect, useMemo, useState } from 'react'
import ModalEditRecipient from './ModalEditRecipient'
import ModalLoadRecipientList from './ModalLoadRecipientList'
import ModalSaveRecipientList from './ModalSaveRecipientList'
import ModalSourceExcel from './ModalSourceExcel'
import ModalSourceGroups from './ModalSourceGroups'
import ModalSourceManual from './ModalSourceManual'
// ++ ADDED: Import the new component
import ModalSourceMyContacts from './ModalSourceMyContacts'

interface Props {
  opened: boolean
  onClose: () => void
  onSubmit: (recipients: any[]) => void
  initialRecipients: any[]
}

const PAGE_SIZE = 10 // Define page size for pagination

const ModalManageSources: React.FC<Props> = ({
  opened,
  onClose,
  onSubmit,
  initialRecipients,
}) => {
  const [recipients, setRecipients] = useState<any[]>([])
  const [editingRecipient, setEditingRecipient] = useState<any | null>(null)
  const [page, setPage] = useState(1)
  const [paginatedRecipients, setPaginatedRecipients] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const [showManualModal, manualModalHandlers] = useDisclosure(false)
  const [showExcelModal, excelModalHandlers] = useDisclosure(false)
  const [showGroupsModal, groupsModalHandlers] = useDisclosure(false)
  const [showEditModal, editModalHandlers] = useDisclosure(false)
  const [showMyContactsModal, myContactsModalHandlers] = useDisclosure(false)
  const [showSaveListModal, saveListModalHandlers] = useDisclosure(false)
  const [showLoadListModal, loadListModalHandlers] = useDisclosure(false)

  const fileExporter = useFile()

  // Sync with initial recipients when modal opens
  useEffect(() => {
    if (opened) {
      setRecipients(_.cloneDeep(initialRecipients))
      setPage(1) // Reset to first page on open
      setSearchQuery('')
    }
  }, [opened, initialRecipients])

  // Memoize filtered results for performance
  const filteredRecipients = useMemo(() => {
    if (!searchQuery) return recipients
    const lowerCaseQuery = searchQuery.toLowerCase()
    return recipients.filter(
      (r) =>
        r.name?.toLowerCase().includes(lowerCaseQuery) ||
        r.number?.toLowerCase().includes(lowerCaseQuery),
    )
  }, [recipients, searchQuery])

  // Effect to update paginated data when filtered recipients or page changes
  useEffect(() => {
    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE
    setPaginatedRecipients(filteredRecipients.slice(from, to))
  }, [filteredRecipients, page])

  // Reset page to 1 when search query changes
  useEffect(() => {
    setPage(1)
  }, [searchQuery])

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

  const handleOpenEditModal = (recipient: any) => {
    setEditingRecipient(recipient)
    editModalHandlers.open()
  }

  const handleUpdateRecipient = (updatedData: {
    number: string
    name: string
  }) => {
    setRecipients((currentRecipients) =>
      currentRecipients.map((r) =>
        r.number === updatedData.number ? { ...r, name: updatedData.name } : r,
      ),
    )
    editModalHandlers.close()
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

  const handleExport = async (format: string) => {
    if (recipients.length === 0) {
      toast.info('No recipients to export.')
      return
    }
    const dataForExport = recipients.map((r) => ({
      number: r.number,
      name: r.name,
    }))
    const filename = `recipients_${new Date().toISOString().slice(0, 10)}`
    await fileExporter.saveAs(format, dataForExport, filename)
  }

  const handleClearAll = () => {
    setRecipients([])
  }

  const handleConfirm = () => {
    onSubmit(recipients)
    onClose()
  }

  const columns: DataTableColumn<any>[] = [
    { accessor: 'name', title: 'Name', ellipsis: true },
    { accessor: 'number', title: 'Number', ellipsis: true },
    {
      accessor: 'actions',
      title: <Text>Actions</Text>,
      textAlign: 'right',
      width: '0%',
      render: (recipient) => (
        <Group gap={4} justify="right" wrap="nowrap">
          <Tooltip label="Edit">
            <ActionIcon
              size="sm"
              variant="subtle"
              color="blue"
              onClick={() => handleOpenEditModal(recipient)}
            >
              <Icon icon="tabler:edit" />
            </ActionIcon>
          </Tooltip>
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
      <Modal opened={opened} onClose={onClose} w={750} withCloseButton>
        <Stack justify="space-between" h={'calc(80vh)'} p="sm">
          <Stack>
            <Group justify="space-between">
              <Text fw={500}>Current Recipients ({recipients.length})</Text>
              <Group>
                <Menu shadow="md">
                  <Menu.Target>
                    <Button
                      size="xs"
                      leftSection={<Icon icon="tabler:plus" fontSize={16} />}
                    >
                      Add Recipients
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label>Sources</Menu.Label>
                    <Menu.Item
                      leftSection={
                        <Icon icon="tabler:keyboard" fontSize={16} />
                      }
                      onClick={manualModalHandlers.open}
                    >
                      Manual
                    </Menu.Item>
                    <Menu.Item
                      leftSection={
                        <Icon icon="tabler:file-type-xls" fontSize={16} />
                      }
                      onClick={excelModalHandlers.open}
                    >
                      Excel
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<Icon icon="tabler:users" fontSize={16} />}
                      onClick={groupsModalHandlers.open}
                    >
                      Groups
                    </Menu.Item>
                    <Menu.Item
                      leftSection={
                        <Icon icon="tabler:address-book" fontSize={16} />
                      }
                      onClick={myContactsModalHandlers.open}
                    >
                      My Contacts
                    </Menu.Item>
                    <Menu.Item
                      leftSection={
                        <Icon icon="tabler:database-import" fontSize={16} />
                      }
                      onClick={loadListModalHandlers.open}
                    >
                      Load Saved List
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
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
                      onClick={saveListModalHandlers.open}
                      disabled={recipients.length === 0}
                    >
                      Save Current List
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Label>Export List</Menu.Label>
                    <Menu.Item
                      leftSection={
                        <Icon icon="tabler:file-type-csv" fontSize={16} />
                      }
                      onClick={() => handleExport('csv')}
                      disabled={recipients.length === 0}
                    >
                      Export as CSV
                    </Menu.Item>
                    <Menu.Item
                      leftSection={
                        <Icon icon="tabler:file-type-xls" fontSize={16} />
                      }
                      onClick={() => handleExport('xlsx')}
                      disabled={recipients.length === 0}
                    >
                      Export as XLSX
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                      color="red"
                      leftSection={<Icon icon="tabler:x" fontSize={16} />}
                      onClick={handleClearAll}
                      disabled={recipients.length === 0}
                    >
                      Clear All Recipients
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
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
              totalRecords={filteredRecipients.length}
              recordsPerPage={PAGE_SIZE}
              page={page}
              onPageChange={(p) => setPage(p)}
              minHeight={filteredRecipients.length === 0 ? 150 : 0}
              noRecordsText={
                searchQuery
                  ? 'No recipients match your search'
                  : 'No recipients added yet.'
              }
              withTableBorder={false}
              striped
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

      <ModalEditRecipient
        opened={showEditModal}
        onClose={editModalHandlers.close}
        onSubmit={handleUpdateRecipient}
        recipientData={editingRecipient}
      />
      <ModalSourceManual
        opened={showManualModal}
        onClose={manualModalHandlers.close}
        onSubmit={handleAddRecipients}
      />
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
      {/* ++ ADDED: Render the new modal component */}
      <ModalSourceMyContacts
        opened={showMyContactsModal}
        onClose={myContactsModalHandlers.close}
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
