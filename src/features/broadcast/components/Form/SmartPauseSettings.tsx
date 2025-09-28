// src/features/broadcast/components/Form/SmartPauseSettings.tsx
import { Icon } from '@iconify/react'
import { Group, Stack, Switch, Text, Tooltip } from '@mantine/core'
import { TimeInput } from '@mantine/dates'
import type { UseFormReturnType } from '@mantine/form'
import React from 'react'
import { When } from 'react-if'

interface Props {
  form: UseFormReturnType<any>
}

/**
 * @component SmartPauseSettings
 * @description A sub-component for managing Smart Pause settings, allowing users
 * to define working hours during which broadcasts can be sent.
 */
const SmartPauseSettings: React.FC<Props> = ({ form }) => {
  return (
    <Stack>
      <Switch
        label={
          <Group gap={4} wrap="nowrap">
            <Text fw={500}>Smart Pause</Text>
            <Tooltip
              label="Automatically pause the broadcast outside of specified hours and resume the next day. This helps simulate human behavior and avoid sending messages at inappropriate times."
              position="top-start"
              multiline
              w={300}
              withArrow
            >
              <Icon icon="tabler:info-circle" style={{ display: 'block' }} />
            </Tooltip>
          </Group>
        }
        {...form.getInputProps('smartPause.enabled', { type: 'checkbox' })}
      />
      <When condition={form.values.smartPause.enabled}>
        <Stack gap={4}>
          <Group grow align="flex-start">
            <TimeInput
              label="Send between"
              description="Start time"
              {...form.getInputProps('smartPause.start')}
            />
            <TimeInput
              label="And"
              description="End time"
              {...form.getInputProps('smartPause.end')}
            />
          </Group>
          {form.errors['smartPause'] && (
            <Text c="red" size="xs">
              {' '}
              {form.errors['smartPause']}{' '}
            </Text>
          )}
        </Stack>
      </When>
    </Stack>
  )
}

export default SmartPauseSettings
