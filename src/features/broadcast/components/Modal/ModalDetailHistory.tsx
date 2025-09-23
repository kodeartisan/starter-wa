// src/features/broadcast/components/Modal/ModalDetailHistory.tsx
import Modal from '@/components/Modal/Modal'
import { Status } from '@/constants'
import type { Broadcast, BroadcastContact } from '@/libs/db'
import db from '@/libs/db'
import { Icon } from '@iconify/react'
import {
  Box,
  Card,
  Center,
  Divider,
  Grid,
  Group,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
  useMantineTheme,
} from '@mantine/core'
import dayjs from 'dayjs'
import { useLiveQuery } from 'dexie-react-hooks'
import { DataTable } from 'mantine-datatable'
import React, { useEffect, useMemo, useState } from 'react'
import MessageStatus from '../Datatable/MessageStatus'

// This component displays campaign performance as a series of stacked, colored trapezoids.
const FunnelChart = ({ stats }: { stats: any }) => {
  const theme = useMantineTheme()
  // Define the stages for the funnel, ensuring that stages with zero value are not rendered.
  const funnelData = [
    {
      label: 'Total Recipients',
      value: stats.total,
      color: theme.colors.blue[7],
    },
    { label: 'Successful', value: stats.success, color: theme.colors.teal[6] },
    { label: 'Failed', value: stats.failed, color: theme.colors.red[6] },
    {
      label: 'Cancelled',
      value: stats.cancelled,
      color: theme.colors.gray[6],
    },
  ]
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value) // Sort from largest to smallest for visual consistency.

  if (stats.total === 0) {
    return <Text c="dimmed">No data to visualize.</Text>
  }

  return (
    <Stack align="center" gap={0}>
      {funnelData.map((item, index) => {
        // Calculate the width of the segment. This creates the funnel effect.
        const segmentWidth = 200 * (1 - index * 0.15)
        const percentageOfTotal = (item.value / stats.total) * 100
        return (
          <Box
            key={item.label}
            style={{ textAlign: 'center', marginBottom: -1 }}
          >
            {/* The trapezoid shape is created using CSS clip-path */}
            <Box
              style={{
                height: 50,
                width: segmentWidth,
                backgroundColor: item.color,
                clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0% 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <Stack gap={0} align="center">
                <Text
                  fw={700}
                  size="sm"
                  style={{ textShadow: '1px 1px 2px black' }}
                >
                  {item.label}
                </Text>
                <Text size="xs" style={{ textShadow: '1px 1px 2px black' }}>
                  {item.value} ({percentageOfTotal.toFixed(1)}%)
                </Text>
              </Stack>
            </Box>
          </Box>
        )
      })}
    </Stack>
  )
}

const PAGE_SIZE = 15 // Define page size for pagination

const ModalDetailHistory: React.FC<{
  opened: boolean
  onClose: () => void
  data?: Broadcast | null
}> = ({ opened, onClose, data = null }) => {
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

  const { stats, summaryData, scheduledAt } = useMemo(() => {
    const defaultStats = {
      total: 0,
      success: 0,
      failed: 0,
      pending: 0,
      running: 0,
      scheduled: 0,
      cancelled: 0,
    }

    if (!contacts || contacts.length === 0) {
      return { stats: defaultStats, summaryData: [], scheduledAt: null }
    }

    const scheduledAt = contacts[0]?.scheduledAt || null

    const total = contacts.length
    const success = contacts.filter((c) => c.status === Status.SUCCESS).length
    const failed = contacts.filter((c) => c.status === Status.FAILED).length
    const pending = contacts.filter((c) => c.status === Status.PENDING).length
    const running = contacts.filter((c) => c.status === Status.RUNNING).length
    const scheduled = contacts.filter(
      (c) => c.status === Status.SCHEDULER,
    ).length
    const cancelled = contacts.filter(
      (c) => c.status === Status.CANCELLED,
    ).length

    const calculatedStats = {
      total,
      success,
      failed,
      pending,
      running,
      scheduled,
      cancelled,
    }
    const summaryItems = [
      {
        title: 'Success',
        value: success,
        color: 'teal',
        icon: 'tabler:circle-check',
      },
      { title: 'Failed', value: failed, color: 'red', icon: 'tabler:circle-x' },
      {
        title: 'Pending',
        value: pending,
        color: 'yellow',
        icon: 'tabler:clock',
      },
      {
        title: 'Running',
        value: running,
        color: 'orange',
        icon: 'tabler:player-play',
      },
      {
        title: 'Scheduled',
        value: scheduled,
        color: 'blue',
        icon: 'tabler:calendar-event',
      },
      {
        title: 'Cancelled',
        value: cancelled,
        color: 'gray',
        icon: 'tabler:ban',
      },
    ].filter((item) => item.value > 0)
    return { stats: calculatedStats, summaryData: summaryItems, scheduledAt }
  }, [contacts])

  const renderSummaryCards = () => {
    return summaryData.map((item) => (
      <Card withBorder radius="md" p="sm" key={item.title}>
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
        {contacts && contacts.length > 0 ? (
          <>
            <Card withBorder radius="md" mt="md" shadow="none">
              <Grid align="center">
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Center h={230}>
                    <FunnelChart stats={stats} />
                  </Center>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 8 }}>
                  <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="lg">
                    {renderSummaryCards()}
                  </SimpleGrid>
                </Grid.Col>
              </Grid>
            </Card>
            {scheduledAt && (
              <Card withBorder radius="md" mt="md" p="xs" bg="blue.0">
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
                  accessor: 'recipient',
                  title: 'Recipient',
                  render: (contact) => contact.name || contact.number,
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
