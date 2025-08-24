import useLicense from '@/hooks/useLicense'
import { Badge, Group, Switch, Text } from '@mantine/core'
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
      <Switch
        label={
          <Group gap="xs">
            <Text fw={500}>Send later</Text>
            <When condition={license.isFree()}>
              <Badge size="sm" variant="light" color="teal">
                PRO
              </Badge>
            </When>
          </Group>
        }
        {...form.getInputProps('scheduler.enabled', { type: 'checkbox' })}
      />
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
