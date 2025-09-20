// src/features/broadcast/components/Modal/ModalLoadRecipientList.tsx
import Modal from '@/components/Modal/Modal'
import useDataQuery from '@/hooks/useDataQuery'
import db, { type BroadcastRecipient } from '@/libs/db'
import { Icon } from '@iconify/react'
import {
  ActionIcon,
  Button,
  Center,
  Group,
  Stack,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core'
import dayjs from 'dayjs'
import { DataTable } from 'mantine-datatable'
import React from 'react'

interface Props {
  opened: boolean
  onClose: () => void
  onLoad: (recipients: any[]) => void
}

const ModalLoadRecipientList: React.FC<Props> = ({
  opened,
  onClose,
  onLoad,
}) => {
  const dataQuery = useDataQuery<BroadcastRecipient>({
    table: db.broadcastRecipients,
    searchField: 'name',
    initialSort: { field: 'createdAt', direction: 'desc' },
  })

  const handleDelete = async (list: BroadcastRecipient) => {
    if (confirm(`Are you sure you want to delete the list "${list.name}"?`)) {
      await dataQuery._delete(list.id)
    }
  }

  return (
    <Modal opened={opened} onClose={onClose} w={750} withCloseButton>
      <Stack p="sm" h={500} justify="space-between">
        <Stack>
          <Center>
            <Title order={4}>Load a Saved Recipient List</Title>
          </Center>
          <Group justify="flex-end">
            <TextInput
              placeholder="Search by list name..."
              value={dataQuery.search}
              onChange={(e) => dataQuery.setSearch(e.currentTarget.value)}
            />
          </Group>
          <DataTable
            height={350}
            records={dataQuery.data}
            columns={[
              { accessor: 'name', title: 'List Name' },
              {
                accessor: 'count',
                title: 'Recipients',
                render: (list) => list.recipients.length,
              },
              {
                accessor: 'createdAt',
                title: 'Date Saved',
                render: (list) =>
                  dayjs(list.createdAt).format('DD MMM YYYY, HH:mm'),
              },
              {
                accessor: 'actions',
                title: 'Actions',
                textAlign: 'right',
                render: (list) => (
                  <Group gap={4} justify="right" wrap="nowrap">
                    <Tooltip label="Load this list">
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => {
                          onLoad(list.recipients)
                          onClose()
                        }}
                      >
                        <Icon icon="tabler:upload" />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Delete this list">
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => handleDelete(list)}
                      >
                        <Icon icon="tabler:trash" />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                ),
              },
            ]}
            totalRecords={dataQuery.totalRecords}
            recordsPerPage={dataQuery.pageSize}
            page={dataQuery.page}
            onPageChange={dataQuery.setPage}
            noRecordsText="No saved lists found."
          />
        </Stack>
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose}>
            Close
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}

export default ModalLoadRecipientList
