// src/features/broadcast/components/Form/RecipientManager.tsx
import { Icon } from '@iconify/react'
import { Button, Group, Stack, Text } from '@mantine/core'
import React from 'react'

interface Props {
  recipientCount: number
  error?: string | any
  onClear: () => void
  onManage: () => void
  // ADDED: New prop for the "Load List" button handler.
  onLoad: () => void
}

/**
 * @component RecipientManager
 * @description A sub-component for ModalCreateBroadcast that handles the UI for managing recipients.
 * It displays the recipient count and provides buttons to clear or manage the recipient list.
 */
const RecipientManager: React.FC<Props> = ({
  recipientCount,
  error,
  onClear,
  onManage,
  // ADDED: Destructure the new prop.
  onLoad,
}) => {
  return (
    <Stack gap="xs">
      <Group justify="space-between">
        <Text fw={500}>Recipients ({recipientCount})</Text>
        <Group>
          <Button
            variant="outline"
            color="red"
            size="compact-sm"
            onClick={onClear}
            disabled={recipientCount === 0}
            leftSection={<Icon icon="tabler:x" fontSize={16} />}
          >
            Clear
          </Button>
          {/* ADDED: "Load List" button to quickly load a saved recipient list. */}
          <Button
            variant="outline"
            size="compact-sm"
            onClick={onLoad}
            leftSection={<Icon icon="tabler:database-import" fontSize={16} />}
          >
            Load List
          </Button>
          <Button
            variant="outline"
            size="compact-sm"
            onClick={onManage}
            leftSection={<Icon icon="tabler:users-plus" fontSize={16} />}
          >
            Manage Recipients
          </Button>
        </Group>
      </Group>
      {error && (
        <Text c="red" size="sm">
          {error}
        </Text>
      )}
    </Stack>
  )
}

export default RecipientManager
