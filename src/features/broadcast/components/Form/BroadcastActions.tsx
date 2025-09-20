import { Icon } from '@iconify/react'
import { Button, Group } from '@mantine/core'
import { isFuture } from 'date-fns'
import React from 'react'

interface Props {
  onPreview: () => void
  onSend: () => void
  isPreviewing: boolean
  isScheduled: boolean
  scheduledAt: Date | null
}

/**
 * @component BroadcastActions
 * @description A sub-component for ModalCreateBroadcast that holds the main action buttons.
 * It displays "Send Preview" and a dynamic "Send/Schedule Broadcast" button.
 */
const BroadcastActions: React.FC<Props> = ({
  onPreview,
  onSend,
  isPreviewing,
  isScheduled,
  scheduledAt,
}) => {
  const isScheduledForFuture =
    isScheduled && scheduledAt && isFuture(new Date(scheduledAt))

  return (
    <Group justify="flex-end" mt="lg">
      <Button
        variant="outline"
        leftSection={<Icon icon="tabler:send-2" fontSize={18} />}
        onClick={onPreview}
        loading={isPreviewing}
        disabled={isPreviewing}
      >
        Send Preview
      </Button>
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
