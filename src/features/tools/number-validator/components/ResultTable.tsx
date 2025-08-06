import wa from '@/libs/wa'
import { Icon } from '@iconify/react'
import { ActionIcon, Badge, Group, Tooltip } from '@mantine/core'
import {
  DataTable,
  type DataTableColumn,
  type DataTableSortStatus,
} from 'mantine-datatable'
import React from 'react'
import type { ValidationResult } from '../hooks/useNumberValidator'

interface Props {
  records: ValidationResult[]
  sortStatus: DataTableSortStatus
  onSortStatusChange: (status: DataTableSortStatus) => void
}

const ResultTable: React.FC<Props> = ({
  records,
  sortStatus,
  onSortStatusChange,
}) => {
  const handleStartChat = async (number: string) => {
    await wa.chat.openChatBottom(`${number}@c.us`)
  }

  const columns: DataTableColumn<ValidationResult>[] = [
    {
      accessor: 'number',
      title: 'Phone Number',
      sortable: true,
    },
    {
      accessor: 'status',
      title: 'Status',
      sortable: true,
      render: ({ status }) => {
        const color =
          status === 'Valid' ? 'green' : status === 'Invalid' ? 'red' : 'yellow'
        return <Badge color={color}>{status}</Badge>
      },
    },
    {
      accessor: 'actions',
      title: 'Actions',
      textAlign: 'right',
      render: (record) => (
        <Group gap={4} justify="right" wrap="nowrap">
          {record.status === 'Valid' && (
            <Tooltip label="Start Chat">
              <ActionIcon
                size="sm"
                variant="subtle"
                color="blue"
                onClick={() => handleStartChat(record.number)}
              >
                <Icon icon="tabler:brand-whatsapp" />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
      ),
    },
  ]

  return (
    <DataTable
      records={records}
      columns={columns}
      minHeight={150}
      noRecordsText="No results to display yet."
      withTableBorder
      striped
      highlightOnHover
      //@ts-ignore
      sortStatus={sortStatus}
      //@ts-ignore
      onSortStatusChange={onSortStatusChange}
    />
  )
}

export default ResultTable
