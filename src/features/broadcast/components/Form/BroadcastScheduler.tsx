import InputSendLater from '@/components/Input/InputSendLater'
import { Icon } from '@iconify/react'
import { Group, Stack, Text } from '@mantine/core'
import type { UseFormReturnType } from '@mantine/form'
import React from 'react'

interface Props {
  form: UseFormReturnType<any>
  estimatedTime: string
}

/**
 * @component BroadcastScheduler
 * @description A sub-component for ModalCreateBroadcast that handles scheduling.
 * It contains the "Send Later" switch and date/time picker, and displays the estimated completion time.
 */
const BroadcastScheduler: React.FC<Props> = ({ form, estimatedTime }) => {
  return (
    <Stack>
      <InputSendLater form={form} />
      {estimatedTime && (
        <Group
          justify="flex-start"
          mt="lg"
          p="xs"
          style={{
            backgroundColor: 'var(--mantine-color-gray-0)',
            borderRadius: 'var(--mantine-radius-sm)',
            border: '1px solid var(--mantine-color-gray-2)',
          }}
        >
          <Icon
            icon="tabler:clock-hour-4"
            style={{
              verticalAlign: 'middle',
              color: 'var(--mantine-color-dimmed)',
            }}
          />
          <Text size="sm" c="dimmed">
            <b>Estimated Completion:</b> {estimatedTime}
          </Text>
        </Group>
      )}
    </Stack>
  )
}

export default BroadcastScheduler
