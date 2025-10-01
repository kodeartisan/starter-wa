// src/features/broadcast/components/Form/AntiBlockingSettings.tsx
import { Icon } from '@iconify/react'
import {
  Accordion,
  Grid,
  Group,
  NumberInput,
  Stack,
  Switch,
  Text,
  Tooltip,
} from '@mantine/core'
import type { UseFormReturnType } from '@mantine/form'
import React from 'react'
import { When } from 'react-if'
import InputTyping from '../Input/InputTyping'
import SmartPauseSettings from './SmartPauseSettings'

interface Props {
  form: UseFormReturnType<any>
}

/**
 * @component AntiBlockingSettings
 * @description A sub-component for ModalCreateBroadcast that groups all anti-blocking settings
 * into a single, collapsible accordion to improve UI clarity and user understanding.
 */
const AntiBlockingSettings: React.FC<Props> = ({ form }) => {
  return (
    <Accordion variant="separated">
      <Accordion.Item value="anti-blocking-settings">
        <Tooltip
          label="These settings help simulate human behavior to reduce the risk of your WhatsApp account being blocked. Click to expand and configure."
          position="top-start"
          multiline
          w={500}
          withArrow
        >
          <Accordion.Control>
            <Group gap="xs">
              <Icon icon="tabler:shield-check" />
              <Text fw={500}>Safe Sending Settings (Anti-Blocking)</Text>
            </Group>
          </Accordion.Control>
        </Tooltip>
        <Accordion.Panel>
          <Stack gap="lg" pt="sm">
            <Grid>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <NumberInput
                  label={
                    <Group gap={4} wrap="nowrap">
                      <Text size="sm" fw={500}>
                        Min Delay (sec)
                      </Text>
                      <Tooltip
                        label="Pausing between messages mimics human behavior and significantly reduces the risk of your account being flagged as spam by WhatsApp."
                        position="top-start"
                        multiline
                        withArrow
                        w={300}
                      >
                        <Icon
                          icon="tabler:info-circle"
                          style={{ display: 'block' }}
                        />
                      </Tooltip>
                    </Group>
                  }
                  description="Minimum time between messages."
                  size="sm"
                  min={3}
                  {...form.getInputProps('delayMin')}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <NumberInput
                  label="Max Delay (sec)"
                  description="Maximum time between messages."
                  min={5}
                  size="sm"
                  {...form.getInputProps('delayMax')}
                />
              </Grid.Col>
            </Grid>
            <Grid>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <InputTyping form={form} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Switch
                  label={
                    <Group gap={4} wrap="nowrap">
                      <Text fw={500}>Only send to valid numbers</Text>
                      <Tooltip
                        label="Before sending, check if each number is a valid WhatsApp account and reduce the risk of being flagged."
                        position="top-start"
                        multiline
                        w={300}
                        withArrow
                      >
                        <Icon
                          icon="tabler:info-circle"
                          style={{ display: 'block' }}
                        />
                      </Tooltip>
                    </Group>
                  }
                  {...form.getInputProps('validateNumbers', {
                    type: 'checkbox',
                  })}
                />
              </Grid.Col>
            </Grid>
            <Grid>
              {/* ADDED: Warm-up Mode Toggle */}
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Switch
                  label={
                    <Group gap={4} wrap="nowrap">
                      <Text fw={500}>Warm-up Mode</Text>
                      <Tooltip
                        label="For large broadcasts, this automatically sends the first 20 messages with a longer, more random delay to simulate natural activity and enhance account safety."
                        position="top-start"
                        multiline
                        w={300}
                        withArrow
                      >
                        <Icon
                          icon="tabler:info-circle"
                          style={{ display: 'block' }}
                        />
                      </Tooltip>
                    </Group>
                  }
                  {...form.getInputProps('warmupMode.enabled', {
                    type: 'checkbox',
                  })}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Stack>
                  <Switch
                    label={
                      <Group gap={4} wrap="nowrap">
                        <Text fw={500}>Batch sending</Text>
                        <Tooltip
                          label="Splitting a large broadcast into smaller batches with a pause in between simulates human behavior, reducing the risk of being flagged for spam."
                          position="top-start"
                          multiline
                          w={300}
                          withArrow
                        >
                          <Icon
                            icon="tabler:info-circle"
                            style={{ display: 'block' }}
                          />
                        </Tooltip>
                      </Group>
                    }
                    {...form.getInputProps('batch.enabled', {
                      type: 'checkbox',
                    })}
                  />
                  <When condition={form.values.batch.enabled}>
                    <Group grow align="flex-start">
                      <NumberInput
                        label="Messages per batch"
                        min={1}
                        {...form.getInputProps('batch.size')}
                      />
                      <NumberInput
                        label="Wait time (minutes)"
                        min={1}
                        {...form.getInputProps('batch.delay')}
                      />
                    </Group>
                    {form.errors['batch'] && (
                      <Text c="red" size="xs">
                        {form.errors['batch']}
                      </Text>
                    )}
                  </When>
                </Stack>
              </Grid.Col>
            </Grid>
            <Grid>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <SmartPauseSettings form={form} />
              </Grid.Col>
            </Grid>
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  )
}

export default AntiBlockingSettings
