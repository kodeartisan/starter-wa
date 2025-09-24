import { Icon } from '@iconify/react'
import { Group, Stack, Text } from '@mantine/core'
import type { UseFormReturnType } from '@mantine/form'
import React from 'react'
import InputSendLater from '../Input/InputSendLater'

interface Props {
  form: UseFormReturnType<any>
}

/**
 * @component BroadcastScheduler
 * @description A sub-component for ModalCreateBroadcast that handles scheduling.
 * It contains the "Send Later" switch and date/time picker.
 */
const BroadcastScheduler: React.FC<Props> = ({ form }) => {
  return (
    <Stack>
      <InputSendLater form={form} />
    </Stack>
  )
}

export default BroadcastScheduler
