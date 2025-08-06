// src/features/quick-reply/PageQuickReply.tsx
import LayoutPage from '@/components/Layout/LayoutPage'
import { Media } from '@/constants'
import MessageType from '@/features/broadcast/components/Datatable/MessageType'
import useDataQuery from '@/hooks/useDataQuery'
import db, { type QuickReply } from '@/libs/db'
import toast from '@/utils/toast'
import { Icon } from '@iconify/react'
import {
  ActionIcon,
  Button,
  Center,
  Group,
  Stack,
  TextInput,
  Tooltip,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { DataTable } from 'mantine-datatable'
import React, { useState } from 'react'
import MediaPreviewCell from './components/MediaPreviewCell'
import ModalCreateUpdateQuickReply from './components/Modal/ModalCreateUpdateQuickReply'

const PageQuickReply: React.FC = () => {
  const dataQuery = useDataQuery<QuickReply>({
    table: db.quickReplies,
  })
  const [editingTemplate, setEditingTemplate] =
    useState<Partial<QuickReply> | null>(null)
  const [showModal, modalHandlers] = useDisclosure(false)
  const [selectedRecords, setSelectedRecords] = useState<QuickReply[]>([])

  const handleEdit = (template: QuickReply) => {
    setEditingTemplate(template)
    modalHandlers.open()
  }

  const handleDelete = async (template: QuickReply) => {
    if (
      confirm(
        `Are you sure you want to delete the template "${template.name}"?`,
      )
    ) {
      await db.media
        .where({ parentId: template.id, type: Media.QUICK_REPLY })
        .delete()
      await db.quickReplies.delete(template.id)
      toast.success(`Template "${template.name}" deleted.`)
    }
  }

  // Clones a quick reply by creating a copy and opening the editor modal.
  const handleClone = (template: QuickReply) => {
    const { id, ...rest } = template
    const clonedTemplate = {
      ...rest,
      name: `${template.name} (Copy)`,
    }
    setEditingTemplate(clonedTemplate)
    modalHandlers.open()
  }

  // Deletes all selected quick replies and their associated media.
  const handleBulkDelete = async () => {
    if (!selectedRecords.length) return
    if (
      !confirm(
        `Are you sure you want to delete ${selectedRecords.length} selected quick replies?`,
      )
    ) {
      return
    }

    try {
      const idsToDelete = selectedRecords.map((reply) => reply.id)
      await db.transaction('rw', db.quickReplies, db.media, async () => {
        // Delete associated media files for all selected replies
        await db.media
          .where('parentId')
          .anyOf(idsToDelete)
          .and((media) => media.type === Media.QUICK_REPLY)
          .delete()
        // Bulk delete the quick replies themselves
        await db.quickReplies.bulkDelete(idsToDelete)
      })
      toast.success(`${selectedRecords.length} quick replies deleted.`)
      setSelectedRecords([]) // Clear selection after deletion
    } catch (error) {
      console.error('Failed to bulk delete quick replies:', error)
      toast.error('An error occurred during bulk deletion.')
    }
  }

  const handleCreate = () => {
    setEditingTemplate(null)
    modalHandlers.open()
  }

  return (
    <>
      <LayoutPage title="Quick Reply">
        <Stack>
          <Group justify="space-between">
            <TextInput
              placeholder="Search by name..."
              size="sm"
              value={dataQuery.search}
              onChange={(e) => dataQuery.setSearch(e.currentTarget.value)}
              leftSection={<Icon icon="tabler:search" fontSize={16} />}
            />
            <Group>
              <Button
                size="sm"
                color="red"
                variant="outline"
                leftSection={<Icon icon="tabler:trash" fontSize={20} />}
                onClick={handleBulkDelete}
                disabled={selectedRecords.length === 0}
              >
                Delete Selected ({selectedRecords.length})
              </Button>
              <Button
                size="sm"
                leftSection={<Icon icon="tabler:plus" fontSize={20} />}
                onClick={handleCreate}
              >
                Add New
              </Button>
            </Group>
          </Group>
          <DataTable
            records={dataQuery?.data}
            totalRecords={dataQuery?.totalRecords}
            recordsPerPage={dataQuery?.pageSize}
            page={dataQuery?.page}
            onPageChange={dataQuery?.setPage}
            minHeight={400}
            noRecordsText="No quick reply templates found."
            selectedRecords={selectedRecords}
            onSelectedRecordsChange={setSelectedRecords}
            idAccessor="id"
            columns={[
              {
                accessor: 'isPinned',
                title: <Icon icon="tabler:pin" />,
                width: 60,
                render: (template) =>
                  template.isPinned ? (
                    <Center>
                      <Icon
                        icon="tabler:pin-filled"
                        color="var(--mantine-color-yellow-6)"
                      />
                    </Center>
                  ) : null,
              },
              { accessor: 'name' },
              {
                accessor: 'type',
                render: (record) => <MessageType type={record.type} />,
              },
              {
                accessor: 'message',
                title: 'Content',
                render: (template) => <MediaPreviewCell reply={template} />,
              },
              {
                accessor: 'actions',
                title: 'Actions',
                textAlign: 'right',
                width: '0%',
                render: (template) => (
                  <Group gap={4} justify="right" wrap="nowrap">
                    <Tooltip label="Clone Template">
                      <ActionIcon
                        variant="subtle"
                        color="teal"
                        onClick={() => handleClone(template)}
                      >
                        <Icon icon="tabler:copy" />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Edit Template">
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => handleEdit(template)}
                      >
                        <Icon icon="tabler:edit" />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Delete Template">
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => handleDelete(template)}
                      >
                        <Icon icon="tabler:trash" />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                ),
              },
            ]}
          />
        </Stack>
      </LayoutPage>
      <ModalCreateUpdateQuickReply
        opened={showModal}
        onClose={() => {
          modalHandlers.close()
          setEditingTemplate(null)
        }}
        data={editingTemplate}
      />
    </>
  )
}

export default PageQuickReply
