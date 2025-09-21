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
 * This includes delay settings, typing effect, and message pausing.
 */
const AntiBlockingSettings: React.FC<Props> = ({ form }) => {
  return (
    <Fieldset
      legend={
        <Group gap="xs">
          <Text fw={500}>Anti-Blocking Settings</Text>
          <Popover width={300} position="top" withArrow shadow="md">
            <Popover.Target>
              <ActionIcon variant="transparent" radius="xl" size="sm">
                <Icon icon="tabler:help-circle" />
              </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown style={{ pointerEvents: 'none' }}>
              <Text size="sm">
                These settings help mimic human-like sending behavior to reduce
                the risk of your account being blocked by WhatsApp. It is highly
                recommended to use random delays and pauses, especially when
                sending to a large number of contacts.
              </Text>
            </Popover.Dropdown>
          </Popover>
        </Group>
      }
    >
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
        <InputTyping form={form} />
        <Tooltip
          label="Automatically pause the broadcast after a certain number of messages to reduce the risk of being blocked."
          refProp="rootRef"
          position="top-start"
          multiline
          w={350}
          withArrow
        >
          <Switch
            label={<Text fw={500}>Pause after a number of messages</Text>}
            {...form.getInputProps('pauseEnabled', { type: 'checkbox' })}
          />
        </Tooltip>
        {form.values.pauseEnabled && (
          <Group grow>
            <NumberInput
              label="Pause After (messages)"
              description="Number of messages to send before pausing."
              min={1}
              size="sm"
              {...form.getInputProps('pauseAfter')}
            />
            <NumberInput
              label="Pause For (minutes)"
              description="How long to pause the broadcast."
              min={1}
              size="sm"
              {...form.getInputProps('pauseDuration')}
            />
          </Group>
        )}
      </Stack>
    </Fieldset>
  )
}

export default AntiBlockingSettings
