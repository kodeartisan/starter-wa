// src/features/broadcast/components/Form/BroadcastActions.tsx
import { Icon } from '@iconify/react'
import { Button, Group } from '@mantine/core'
import { isFuture } from 'date-fns'
import React from 'react'

interface Props {
  onSend: () => void
  isScheduled: boolean
  scheduledAt: Date | null
}

/**
 * @component BroadcastActions
 * @description A sub-component for ModalCreateBroadcast that holds the main action buttons.
 * It displays a dynamic "Send/Schedule Broadcast" button.
 */
const BroadcastActions: React.FC<Props> = ({
  onSend,
  isScheduled,
  scheduledAt,
}) => {
  const isScheduledForFuture =
    isScheduled && scheduledAt && isFuture(new Date(scheduledAt))

  return (
    <Group justify="flex-end" mt="lg">
      <Button
        leftSection={<Icon icon="tabler:send" fontSize={18} />}
        onClick={onSend}
      >
        {isScheduledForFuture ? 'Schedule Broadcast' : 'Send Broadcast'}
      </Button>
    </Group>
  )
}

export default BroadcastActions
