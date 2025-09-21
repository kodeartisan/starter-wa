// src/features/broadcast/components/Form/AntiBlockingSettings.tsx
import { Icon } from '@iconify/react'
import {
  ActionIcon,
  Fieldset,
  Group,
  NumberInput,
  Popover,
  Stack,
  Switch,
  Text,
  Tooltip,
} from '@mantine/core'
import type { UseFormReturnType } from '@mantine/form'
import React from 'react'
import InputTyping from '../Input/InputTyping'

interface Props {
  form: UseFormReturnType<any>
}

/**
 * @component AntiBlockingSettings
 * @description A sub-component for ModalCreateBroadcast that groups all anti-blocking settings.
 * This includes delay settings and typing effect.
 */
const AntiBlockingSettings: React.FC<Props> = ({ form }) => {
  return (
    <Stack>
      <Group grow>
        {/* MODIFIED: Wrapped the NumberInput in a Tooltip for clarity */}
        <Tooltip
          label="The shortest time to wait before sending the next message. Helps simulate human behavior."
          position="top-start"
          multiline
          withArrow
        >
          <NumberInput
            label="Min Delay (sec)"
            description="Minimum time between messages."
            size="sm"
            min={3}
            {...form.getInputProps('delayMin')}
          />
        </Tooltip>
        {/* MODIFIED: Wrapped the NumberInput in a Tooltip for clarity */}
        <Tooltip
          label="The longest time to wait before sending the next message. A random delay between Min and Max will be chosen for each message."
          position="top-start"
          multiline
          withArrow
        >
          <NumberInput
            label="Max Delay (sec)"
            description="Maximum time between messages."
            min={5}
            size="sm"
            {...form.getInputProps('delayMax')}
          />
        </Tooltip>
      </Group>
      <Tooltip
        label="Verify that each number is a valid WhatsApp account before sending. This can add a small delay before the broadcast starts but greatly increases safety and prevents sending to non-existent numbers."
        refProp="rootRef"
        position="top-start"
        multiline
        w={350}
        withArrow
      >
        <Switch
          label={<Text fw={500}>Only send to valid numbers</Text>}
          {...form.getInputProps('validateNumbers', { type: 'checkbox' })}
        />
      </Tooltip>
      <InputTyping form={form} />
    </Stack>
  )
}

export default AntiBlockingSettings
