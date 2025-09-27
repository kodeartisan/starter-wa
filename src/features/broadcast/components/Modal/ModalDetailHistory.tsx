// src/features/broadcast/components/Modal/ModalDetailHistory.tsx
import Modal from '@/components/Modal/Modal'
import { Status } from '@/constants'
import type { Broadcast, BroadcastContact } from '@/libs/db'
import db from '@/libs/db'
import { Icon } from '@iconify/react'
import {
  Button,
  Card,
  Center,
  Group,
  Menu,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import dayjs from 'dayjs'
import { useLiveQuery } from 'dexie-react-hooks'
import { DataTable } from 'mantine-datatable'
import React, { useEffect, useMemo, useState } from 'react'
import MessageStatus from '../Datatable/MessageStatus'

const PAGE_SIZE = 15

// ++ ADDED: Prop for the new follow-up action handler.
interface Props {
  opened: boolean
  onClose: () => void
  data?: Broadcast | null
  onCreateFollowUp: (
    broadcast: Broadcast,
    type: 'SUCCESS' | 'FAILED' | 'ALL',
  ) => void
}

const ModalDetailHistory: React.FC<Props> = ({
  opened,
  onClose,
  data = null,
  onCreateFollowUp,
}) => {
  const contacts =
    useLiveQuery(async () => {
      if (!data?.id) return []
      return await db.broadcastContacts
        .where({ broadcastId: data.id })
        .toArray()
    }, [data]) || []

  const [page, setPage] = useState(1)
  const [records, setRecords] = useState<BroadcastContact[]>([])

  useEffect(() => {
    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE
    setRecords(contacts.slice(from, to))
  }, [page, contacts])

  const { summaryData, scheduledAt, recipientStats } = useMemo(() => {
    if (!contacts || contacts.length === 0) {
      return { summaryData: [], scheduledAt: null, recipientStats: {} }
    }

    const scheduledAt = contacts[0]?.scheduledAt || null

    const stats = {
      success: contacts.filter((c) => c.status === Status.SUCCESS).length,
      failed: contacts.filter((c) => c.status === Status.FAILED).length,
      pending: contacts.filter((c) => c.status === Status.PENDING).length,
      running: contacts.filter((c) => c.status === Status.RUNNING).length,
      scheduled: contacts.filter((c) => c.status === Status.SCHEDULER).length,
      cancelled: contacts.filter((c) => c.status === Status.CANCELLED).length,
    }

    const summaryItems = [
      {
        title: 'Success',
        value: stats.success,
        color: 'teal',
        icon: 'tabler:circle-check',
      },
      {
        title: 'Failed',
        value: stats.failed,
        color: 'red',
        icon: 'tabler:circle-x',
      },
      {
        title: 'Pending',
        value: stats.pending,
        color: 'yellow',
        icon: 'tabler:clock',
      },
      {
        title: 'Running',
        value: stats.running,
        color: 'orange',
        icon: 'tabler:player-play',
      },
      {
        title: 'Scheduled',
        value: stats.scheduled,
        color: 'blue',
        icon: 'tabler:calendar-event',
      },
      {
        title: 'Cancelled',
        value: stats.cancelled,
        color: 'gray',
        icon: 'tabler:ban',
      },
    ].filter((item) => item.value > 0)

    return { summaryData: summaryItems, scheduledAt, recipientStats: stats }
  }, [contacts])

  const renderSummaryCards = () => {
    return summaryData.map((item) => (
      <Card withBorder radius="md" p="sm" key={item.title} shadow="none">
        <Group wrap="nowrap">
          <ThemeIcon color={item.color} variant="light" size={40} radius="md">
            <Icon icon={item.icon} fontSize={24} />
          </ThemeIcon>
          <div>
            <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
              {item.title}
            </Text>
            <Text fw={700} size="xl">
              {item.value}
            </Text>
          </div>
        </Group>
      </Card>
    ))
  }

  return (
    <Modal opened={opened} onClose={onClose} w={850} withCloseButton>
      <Stack p="md">
        {contacts && contacts.length > 0 && data ? (
          <>
            <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="lg">
              {renderSummaryCards()}
            </SimpleGrid>

            {scheduledAt && (
              <Card withBorder radius="md" mt="md" p="xs" shadow="none">
                <Center>
                  <Group>
                    <Icon
                      icon="tabler:calendar-time"
                      color="var(--mantine-color-blue-7)"
                    />
                    <Text size="sm" c="blue.7" fw={500}>
                      Scheduled for:{' '}
                      {dayjs(scheduledAt).format('DD MMMM YYYY, HH:mm')}
                    </Text>
                  </Group>
                </Center>
              </Card>
            )}
            <Group justify="space-end">
              {/* ++ MODIFIED: Replaced the simple "Resend" button with a more versatile "Follow-up" menu. */}
              <Menu shadow="md" withArrow>
                <Menu.Target>
                  <Button
                    size="xs"
                    leftSection={<Icon icon="tabler:send" fontSize={18} />}
                  >
                    Create Follow-up
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Create a new campaign for...</Menu.Label>
                  <Menu.Item
                    leftSection={<Icon icon="tabler:send-off" fontSize={16} />}
                    disabled={
                      !recipientStats.failed || recipientStats.failed === 0
                    }
                    onClick={() => onCreateFollowUp(data, 'FAILED')}
                  >
                    Failed Recipients ({recipientStats.failed || 0})
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<Icon icon="tabler:checks" fontSize={16} />}
                    disabled={
                      !recipientStats.success || recipientStats.success === 0
                    }
                    onClick={() => onCreateFollowUp(data, 'SUCCESS')}
                  >
                    Successful Recipients ({recipientStats.success || 0})
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<Icon icon="tabler:users" fontSize={16} />}
                    onClick={() => onCreateFollowUp(data, 'ALL')}
                  >
                    All Recipients ({contacts.length})
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
            <DataTable
              height={350}
              records={records}
              totalRecords={contacts.length}
              recordsPerPage={PAGE_SIZE}
              page={page}
              onPageChange={(p) => setPage(p)}
              noRecordsText="No recipient data available"
              striped
              highlightOnHover
              withTableBorder
              columns={[
                {
                  accessor: 'name',
                  title: 'Name',
                  render: (contact) => contact.name || '-',
                },
                {
                  accessor: 'number',
                  title: 'Number',
                  render: (contact) => contact.number.split('@')[0],
                },
                {
                  accessor: 'status',
                  title: 'Status',
                  render: (contact) => (
                    <MessageStatus
                      status={contact.status}
                      error={contact.error}
                    />
                  ),
                },
                {
                  accessor: 'sentAt',
                  title: 'Sent At',
                  render: (contact) =>
                    contact.sendAt
                      ? dayjs(contact.sendAt).format('DD/MM/YYYY HH:mm')
                      : '-',
                },
              ]}
            />
          </>
        ) : (
          <Center h={200}>
            <Stack align="center">
              <Icon icon="tabler:database-off" fontSize={48} color="gray" />
              <Text c="dimmed">
                No recipient data found for this broadcast.
              </Text>
            </Stack>
          </Center>
        )}
      </Stack>
    </Modal>
  )
}

export default ModalDetailHistory
