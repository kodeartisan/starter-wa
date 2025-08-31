// src/features/label/components/LabelBulkActions.tsx
import { Icon } from '@iconify/react'
import { ActionIcon, Button, Group, Text, Tooltip } from '@mantine/core'
import React from 'react'

interface Props {
  selectedCount: number
  onDelete: () => void
  onPin: () => void
  onUnpin: () => void
  onClear: () => void
}

const LabelBulkActions: React.FC<Props> = ({
  selectedCount,
  onDelete,
  onPin,
  onUnpin,
  onClear,
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
