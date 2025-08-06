import InputTyping from '@/components/Input/InputTyping'
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
} from '@mantine/core'
import type { UseFormReturnType } from '@mantine/form'
import React from 'react'

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
        <InputTyping form={form} />
        <Group grow>
          <NumberInput
            label="Min Delay (sec)"
            description="Minimum time between messages."
            min={1}
            {...form.getInputProps('delayMin')}
          />
          <NumberInput
            label="Max Delay (sec)"
            description="Maximum time between messages."
            min={1}
            {...form.getInputProps('delayMax')}
          />
        </Group>
        <Switch
          label="Pause after a number of messages"
          {...form.getInputProps('pauseEnabled', { type: 'checkbox' })}
        />
        {form.values.pauseEnabled && (
          <Group grow>
            <NumberInput
              label="Pause After (messages)"
              description="Number of messages to send before pausing."
              min={1}
              {...form.getInputProps('pauseAfter')}
            />
            <NumberInput
              label="Pause For (minutes)"
              description="How long to pause the broadcast."
              min={1}
              {...form.getInputProps('pauseDuration')}
            />
          </Group>
        )}
      </Stack>
    </Fieldset>
  )
}

export default AntiBlockingSettings
