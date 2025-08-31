// src/features/label/components/LabelActions.tsx
import type { Label } from '@/libs/db'
import { Icon } from '@iconify/react'
import { ActionIcon, Group, Tooltip } from '@mantine/core'
import React from 'react'

interface Props {
  label: Label
  onEdit: (label: Label) => void
  onDelete: (label: Label) => void
  onManageContacts: (label: Label) => void
}

/**
 * A memoized component that renders the action icons for a label row.
 * This includes editing, deleting, and managing contacts.
 */
const LabelActions: React.FC<Props> = ({
  label,
  onEdit,
  onDelete,
  onManageContacts,
}) => {
  return (
    <Group gap="xs" justify="center">
      <Tooltip label="Manage Contacts">
        <ActionIcon variant="light" onClick={() => onManageContacts(label)}>
          <Icon icon="tabler:users-group" />
        </ActionIcon>
      </Tooltip>
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
