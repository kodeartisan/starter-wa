// src/features/broadcast/components/Input/InputSendLater.tsx
import useLicense from '@/hooks/useLicense'
import { Badge, Group, Switch, Text, Tooltip } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import type { UseFormReturnType } from '@mantine/form'
import dayjs from 'dayjs'
import React from 'react'
import { When } from 'react-if'

interface Props {
  form: UseFormReturnType<any>
}

const InputSendLater: React.FC<Props> = ({ form }: Props) => {
  const license = useLicense()
  return (
    <>
      {/* MODIFIED: Wrapped the Switch component in a Tooltip to explain its function. */}
      <Tooltip
        label="Schedule your broadcast to be sent at a specific date and time in the future."
        position="top-start"
        multiline
        w={350}
        withArrow
        refProp="rootRef"
      >
        <Switch
          label={<Text fw={500}>Send later</Text>}
          {...form.getInputProps('scheduler.enabled', { type: 'checkbox' })}
        />
      </Tooltip>
      <When condition={form.values.scheduler.enabled}>
        <DateTimePicker
          label="Date time"
          size="md"
          minDate={dayjs().add(2, 'minutes').toDate()}
          clearable
          {...form.getInputProps('scheduler.scheduledAt')}
        />
      </When>
    </>
  )
}

export default InputSendLater
