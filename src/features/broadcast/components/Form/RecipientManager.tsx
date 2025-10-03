// src/features/broadcast/components/Form/RecipientManager.tsx
import useLicense from '@/hooks/useLicense'
import { Icon } from '@iconify/react'
import { Button, Group, Stack, Text, Tooltip } from '@mantine/core'
import React from 'react'

interface Props {
  recipientCount: number
  error?: string | any
  onClear: () => void
  onManage: () => void
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
  onLoad,
}) => {
  const license = useLicense()

  // The Manage button is defined once to avoid code duplication.
  const manageButton = (
    <Button
      variant="outline"
      size="compact-sm"
      onClick={onManage}
      leftSection={<Icon icon="tabler:users-plus" fontSize={16} />}
    >
      Manage
    </Button>
  )

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
          <Button
            variant="outline"
            size="compact-sm"
            onClick={onLoad}
            leftSection={<Icon icon="tabler:database-import" fontSize={16} />}
          >
            Load
          </Button>

          {/* MODIFIED: Conditionally wrap the Manage button with a Tooltip for free users */}
          {license.isFree() ? (
            <Tooltip
              label="Free plan is limited to 5 recipients. Upgrade to Pro for unlimited contacts!"
              position="top"
              withArrow
            >
              {manageButton}
            </Tooltip>
          ) : (
            manageButton
          )}
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
