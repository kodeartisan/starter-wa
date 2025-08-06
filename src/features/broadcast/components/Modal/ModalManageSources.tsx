// src/features/broadcast/components/Modal/ModalManageSources.tsx
import Modal from '@/components/Modal/Modal'
import toast from '@/utils/toast'
import { Icon } from '@iconify/react'
import {
  ActionIcon,
  Button,
  Group,
  Menu,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import _ from 'lodash'
import { DataTable, type DataTableColumn } from 'mantine-datatable'
import React, { useEffect, useState } from 'react'
import ModalEditRecipient from './ModalEditRecipient'
import ModalLoadRecipientList from './ModalLoadRecipientList'
import ModalSaveRecipientList from './ModalSaveRecipientList'
import ModalSourceExcel from './ModalSourceExcel'
import ModalSourceGroups from './ModalSourceGroups'
import ModalSourceManual from './ModalSourceManual'

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

  const [showManualModal, manualModalHandlers] = useDisclosure(false)
  const [showExcelModal, excelModalHandlers] = useDisclosure(false)
  const [showGroupsModal, groupsModalHandlers] = useDisclosure(false)
  const [showEditModal, editModalHandlers] = useDisclosure(false)
  const [showSaveListModal, saveListModalHandlers] = useDisclosure(false)
  const [showLoadListModal, loadListModalHandlers] = useDisclosure(false)

  // Sync with initial recipients when modal opens
  useEffect(() => {
    if (opened) {
      setRecipients(_.cloneDeep(initialRecipients))
      setPage(1) // Reset to first page on open
    }
  }, [opened, initialRecipients])

  useEffect(() => {
    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE
    setPaginatedRecipients(recipients.slice(from, to))
  }, [recipients, page])

  const handleAddRecipients = (newRecipients: any[]) => {
    const formattedNewRecipients = newRecipients.map((rec) => {
      if (typeof rec === 'string') {
        return { number: rec, name: 'N/A', source: 'Manual' }
      }
      return {
        number: rec.number || rec.phoneNumber,
        name: rec.name || rec.savedName || rec.publicName || 'N/A',
        source: rec.source || 'Import',
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
      <Modal opened={opened} onClose={onClose} w={900} withCloseButton>
        <Stack justify="space-between" h={'calc(80vh)'} p="sm">
          <Stack>
            <Group justify="space-between">
              <Text fw={500}>Current Recipients ({recipients.length})</Text>
              <Group>
                <Button
                  size="xs"
                  color="blue"
                  variant="outline"
                  onClick={saveListModalHandlers.open}
                  disabled={recipients.length === 0}
                  leftSection={
                    <Icon icon="tabler:device-floppy" fontSize={16} />
                  }
                >
                  Save List
                </Button>
                <Button
                  size="xs"
                  color="red"
                  variant="outline"
                  onClick={handleClearAll}
                  disabled={recipients.length === 0}
                  leftSection={<Icon icon="tabler:x" fontSize={16} />}
                >
                  Clear All
                </Button>
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
                    <Menu.Label>Saved Lists</Menu.Label>
                    <Menu.Item
                      leftSection={
                        <Icon icon="tabler:list-check" fontSize={16} />
                      }
                      onClick={loadListModalHandlers.open}
                    >
                      Load from Saved List
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Label>Sources</Menu.Label>
                    <Menu.Item
                      leftSection={
                        <Icon icon="tabler:keyboard" fontSize={16} />
                      }
                      onClick={manualModalHandlers.open}
                    >
                      Manual Input
                    </Menu.Item>
                    <Menu.Item
                      leftSection={
                        <Icon icon="tabler:file-type-xls" fontSize={16} />
                      }
                      onClick={excelModalHandlers.open}
                    >
                      From Excel
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<Icon icon="tabler:users" fontSize={16} />}
                      onClick={groupsModalHandlers.open}
                    >
                      From Groups
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>
            </Group>

            {/* ++ MODIFIED: Replaced ScrollArea with a paginated DataTable */}
            <DataTable
              height={'calc(70vh - 120px)'}
              records={paginatedRecipients}
              columns={columns}
              totalRecords={recipients.length}
              recordsPerPage={PAGE_SIZE}
              page={page}
              onPageChange={(p) => setPage(p)}
              minHeight={recipients.length === 0 ? 150 : 0}
              noRecordsText="No recipients added yet."
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
      <ModalSaveRecipientList
        opened={showSaveListModal}
        onClose={saveListModalHandlers.close}
        recipients={recipients}
      />
      <ModalLoadRecipientList
        opened={showLoadListModal}
        onClose={loadListModalHandlers.close}
        onLoad={handleAddRecipients}
      />
    </>
  )
}

export default ModalManageSources
