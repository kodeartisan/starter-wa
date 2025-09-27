// src/features/broadcast/components/Modal/ModalManageTemplate.tsx
import Modal from '@/components/Modal/Modal'
import { Media, Message } from '@/constants'
import useDataQuery from '@/hooks/useDataQuery'
import useLicense from '@/hooks/useLicense'
import type { BroadcastTemplate } from '@/libs/db'
import db from '@/libs/db'
import { showModalUpgrade } from '@/utils/util'
import { Icon } from '@iconify/react'
import {
  ActionIcon,
  Button,
  Center,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { DataTable } from 'mantine-datatable'
import React, { useState } from 'react'
import MessageType from '../Datatable/MessageType'
import ModalCreateUpdateTemplate from './ModalCreateUpdateTemplate'

interface Props {
  opened: boolean
  onClose: () => void
}

const ModalManageTemplate: React.FC<Props> = ({ opened, onClose }) => {
  const license = useLicense()
  const dataQuery = useDataQuery<BroadcastTemplate>({
    table: db.broadcastTemplates,
  })
  const [editingTemplate, setEditingTemplate] =
    useState<Partial<BroadcastTemplate> | null>(null)
  const [showModalCreateUpdate, modalCreateUpdate] = useDisclosure(false)

  const handleDelete = async (template: BroadcastTemplate) => {
    if (!confirm('Are you sure you want to delete this template?')) return
    await db.media
      .where({ type: Media.BROADCAST_TEMPLATE, parentId: template.id })
      .delete()
    await db.broadcastTemplates.delete(template.id)
  }

  const handleEdit = (template: BroadcastTemplate) => {
    setEditingTemplate(template)
    modalCreateUpdate.open()
  }

  const handleClone = (template: BroadcastTemplate) => {
    const { id, ...restOfTemplate } = template
    const clonedTemplate = {
      ...restOfTemplate,
      name: `${template.name} (Copy)`,
    }
    setEditingTemplate(clonedTemplate)
    modalCreateUpdate.open()
  }

  const handleOpenCreateModal = () => {
    if (license.isFree() && dataQuery.totalRecords >= 1) {
      showModalUpgrade(
        'Unlimited Templates',
        'Upgrade to Pro to create and save an unlimited number of message templates.',
      )
      return
    }
    setEditingTemplate(null)
    modalCreateUpdate.open()
  }

  const renderMessage = (broadcastTemplate: BroadcastTemplate) => {
    const { message } = broadcastTemplate
    if (!message) return '-'
    const typeContent = {
      [Message.TEXT]:
        typeof message === 'string' ? message : JSON.stringify(message),
      [Message.MEDIA]: (message as any).caption,
      [Message.IMAGE]: (message as any).caption,
      [Message.VIDEO]: (message as any).caption,
      [Message.FILE]:
        typeof message === 'string' ? message : (message as any).caption,
      [Message.BUTTON]: (message as any).title,
      [Message.LIST]: (message as any).title,
      [Message.LOCATION]: (message as any).name,
      [Message.POLL]: (message as any).name,
      [Message.VCARD]: '-',
    }
    return typeContent[broadcastTemplate.type] || JSON.stringify(message)
  }

  return (
    <Modal opened={opened} onClose={onClose} w={850} withCloseButton>
      <Stack>
        <Center>
          <Title order={3}>Manage Templates</Title>
        </Center>
        <Stack gap="md" p={'md'}>
          {/* MODIFIED: Added a search input and grouped it with the add button */}
          <Group justify="space-between">
            <TextInput
              placeholder={`Search by ${dataQuery.searchField}...`}
              size="sm"
              value={dataQuery.search}
              onChange={(e) => dataQuery.setSearch(e.currentTarget.value)}
              leftSection={<Icon icon="tabler:search" fontSize={16} />}
              style={{ flex: 1 }}
            />
            <Button
              size="sm"
              leftSection={<Icon icon="tabler:plus" fontSize={18} />}
              onClick={handleOpenCreateModal}
            >
              Add Template
            </Button>
          </Group>
          <DataTable
            records={dataQuery?.data}
            totalRecords={dataQuery?.totalRecords}
            recordsPerPage={dataQuery?.pageSize}
            page={dataQuery?.page}
            onPageChange={dataQuery?.setPage}
            minHeight={300}
            noRecordsText="No templates found"
            columns={[
              { accessor: 'name' },
              {
                accessor: 'type',
                render: (record) => <MessageType type={record.type} />,
              },
              { accessor: 'message', title: 'Message', render: renderMessage },
              {
                accessor: 'actions',
                title: <Text mr="xs">Actions</Text>,
                textAlign: 'right',
                width: '0%',
                render: (template: BroadcastTemplate) => (
                  <Group gap={4} justify="right" wrap="nowrap">
                    <Tooltip label="Edit Template" position="top">
                      <ActionIcon
                        color="blue"
                        variant="subtle"
                        onClick={() => handleEdit(template)}
                      >
                        <Icon icon="tabler:edit" fontSize={22} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Clone Template" position="top">
                      <ActionIcon
                        color="teal"
                        variant="subtle"
                        onClick={() => handleClone(template)}
                      >
                        <Icon icon="tabler:copy" fontSize={22} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Delete Template" position="top">
                      <ActionIcon
                        color="red"
                        variant="subtle"
                        onClick={async () => await handleDelete(template)}
                      >
                        <Icon icon="tabler:trash" fontSize={22} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                ),
              },
            ]}
          />
        </Stack>
        <ModalCreateUpdateTemplate
          opened={showModalCreateUpdate}
          onClose={() => {
            modalCreateUpdate.close()
            setEditingTemplate(null)
          }}
          data={editingTemplate}
        />
      </Stack>
    </Modal>
  )
}

export default ModalManageTemplate
