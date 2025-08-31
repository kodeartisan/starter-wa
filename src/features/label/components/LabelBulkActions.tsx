// src/features/label/components/LabelBulkActions.tsx
import { Icon } from '@iconify/react'
import { ActionIcon, Button, Group, Menu, Text, Tooltip } from '@mantine/core'
import React from 'react'

interface Props {
  selectedCount: number
  onDelete: () => void
  onPin: () => void
  onUnpin: () => void
  onClear: () => void
  onExport: (format: 'csv' | 'excel') => void // Added export handler
}

const LabelBulkActions: React.FC<Props> = ({
  selectedCount,
  onDelete,
  onPin,
  onUnpin,
  onClear,
  onExport, // Destructure new prop
}) => {
  return (
    <Group
      justify="space-between"
      p="sm"
      style={{
        border: '1px solid var(--mantine-color-gray-3)',
        borderRadius: 'var(--mantine-radius-md)',
        backgroundColor: 'var(--mantine-color-gray-0)',
      }}
    >
      <Group>
        <Text fw={500} size="sm">
          {selectedCount} selected
        </Text>
        <Button
          size="xs"
          variant="light"
          color="yellow"
          leftSection={<Icon icon="tabler:star" fontSize={16} />}
          onClick={onPin}
        >
          Pin
        </Button>
        <Button
          size="xs"
          variant="light"
          color="gray"
          leftSection={<Icon icon="tabler:star-off" fontSize={16} />}
          onClick={onUnpin}
        >
          Unpin
        </Button>
        {/* START: MODIFIED - Added bulk export button with a format selection menu */}
        <Menu shadow="md" width={150}>
          <Menu.Target>
            <Button
              size="xs"
              variant="light"
              color="blue"
              leftSection={<Icon icon="tabler:file-export" fontSize={16} />}
            >
              Export Selected
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Export as</Menu.Label>
            <Menu.Item
              leftSection={<Icon icon="tabler:file-type-csv" />}
              onClick={() => onExport('csv')}
            >
              CSV
            </Menu.Item>
            <Menu.Item
              leftSection={<Icon icon="tabler:file-type-xls" />}
              onClick={() => onExport('excel')}
            >
              Excel
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
        {/* END: MODIFIED */}
        <Button
          size="xs"
          variant="light"
          color="red"
          leftSection={<Icon icon="tabler:trash" fontSize={16} />}
          onClick={onDelete}
        >
          Delete
        </Button>
      </Group>
      <Tooltip label="Clear selection">
        <ActionIcon variant="light" color="gray" onClick={onClear}>
          <Icon icon="tabler:x" />
        </ActionIcon>
      </Tooltip>
    </Group>
  )
}

export default React.memo(LabelBulkActions)
