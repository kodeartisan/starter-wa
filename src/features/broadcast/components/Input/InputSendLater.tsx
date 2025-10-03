// src/features/broadcast/components/Input/InputSendLater.tsx
import useLicense from '@/hooks/useLicense'
import { showModalUpgrade } from '@/utils/util'
import { Icon } from '@iconify/react'
import {
  Badge,
  Group,
  Stack,
  Switch,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import type { UseFormReturnType } from '@mantine/form'
import { endOfDay } from 'date-fns'
import dayjs from 'dayjs'
import React from 'react'
import { When } from 'react-if'

interface Props {
  form: UseFormReturnType<any>
}

const InputSendLater: React.FC<Props> = ({ form }: Props) => {
  const license = useLicense()
  return (
    <Stack
      onClick={() => {
        if (license.isFree()) {
          showModalUpgrade(
            'Schedule for Later',
            'Schedule your broadcasts to be sent at a specific date and time in the future.',
          )
        }
      }}
    >
      <Switch
        label={
          <Group gap={4} wrap="nowrap">
            <Text fw={500}>Send later</Text>
            {license.isFree() && (
              <Badge color="yellow" variant="light" size="sm">
                Pro
              </Badge>
            )}
            <Tooltip
              label="Schedule your broadcast to be sent at a specific date and time in the future."
              position="top-start"
              multiline
              w={350}
              withArrow
            >
              <Icon icon="tabler:info-circle" style={{ display: 'block' }} />
            </Tooltip>
          </Group>
        }
        {...form.getInputProps('scheduler.enabled', { type: 'checkbox' })}
      />
      <When condition={form.values.scheduler.enabled}>
        <TextInput
          label="Date time"
          size="md"
          type="datetime-local"
          {...form.getInputProps('scheduler.scheduledAt')}
        />
      </When>
    </Stack>
  )
}

export default InputSendLater
