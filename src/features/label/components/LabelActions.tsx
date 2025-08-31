// src/features/label/components/LabelActions.tsx
import type { Label } from '@/libs/db'
import { Icon } from '@iconify/react'
import { ActionIcon, Group, Menu, Tooltip } from '@mantine/core'
import React from 'react'

interface Props {
  label: Label
  onEdit: (label: Label) => void
  onDelete: (label: Label) => void
  onManageContacts: (label: Label) => void
  onExport: (label: Label, format: 'csv' | 'excel') => void
}

/**
 * A memoized component that renders the action icons for a label row.
 * This includes editing, deleting, managing, and exporting contacts.
 */
const LabelActions: React.FC<Props> = ({
  label,
  onEdit,
  onDelete,
  onManageContacts,
  onExport,
}) => {
  return (
    <Group gap="xs" justify="center">
      <Tooltip label="Manage Contacts">
        <ActionIcon variant="light" onClick={() => onManageContacts(label)}>
          <Icon icon="tabler:users-group" />
        </ActionIcon>
      </Tooltip>
      <Menu shadow="md" width={150} position="bottom-end">
        <Menu.Target>
          <Tooltip label="Export Contacts">
            <ActionIcon variant="light" color="blue">
              <Icon icon="tabler:file-export" />
            </ActionIcon>
          </Tooltip>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Export as</Menu.Label>
          <Menu.Item
            leftSection={<Icon icon="tabler:file-type-csv" />}
            onClick={() => onExport(label, 'csv')}
          >
            {' '}
            CSV{' '}
          </Menu.Item>
          <Menu.Item
            leftSection={<Icon icon="tabler:file-type-xls" />}
            onClick={() => onExport(label, 'excel')}
          >
            {' '}
            Excel{' '}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Tooltip label="Edit Label">
        <ActionIcon variant="light" color="blue" onClick={() => onEdit(label)}>
          <Icon icon="tabler:pencil" />
        </ActionIcon>
      </Tooltip>
      <Tooltip label="Delete Label">
        <ActionIcon variant="light" color="red" onClick={() => onDelete(label)}>
          <Icon icon="tabler:trash" />
        </ActionIcon>
      </Tooltip>
    </Group>
  )
}

export default React.memo(LabelActions)
