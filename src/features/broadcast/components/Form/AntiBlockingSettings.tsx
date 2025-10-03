// src/features/broadcast/components/Form/AntiBlockingSettings.tsx
import useLicense from '@/hooks/useLicense'
import { showModalUpgrade } from '@/utils/util'
import { Icon } from '@iconify/react'
import {
  Badge,
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
 * @description A sub-component for ModalCreateBroadcast that groups all anti-blocking settings.
 * Pro features like Warm-up Mode and Batch Sending are now disabled for free users.
 */
const AntiBlockingSettings: React.FC<Props> = ({ form }) => {
  const license = useLicense()

  const handleProFeatureClick = (
    featureName: string,
    featureBenefit: string,
  ) => {
    if (license.isFree()) {
      showModalUpgrade(featureName, featureBenefit)
    }
  }

  return (
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
            {...form.getInputProps('validateNumbers', { type: 'checkbox' })}
          />
        </Grid.Col>
      </Grid>
      <Grid>
        {/* MODIFIED: Warm-up Mode Toggle */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <div>
            <Switch
              label={
                <Group gap={8} wrap="nowrap">
                  <Text fw={500}>Warm-up Mode</Text>
                  <Tooltip
                    label="Automatically sends the first 20 messages with a longer, more random delay to simulate natural activity and enhance account safety."
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
          </div>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack>
            <div
              onClick={() =>
                handleProFeatureClick(
                  'Batch Sending',
                  'Splitting a large broadcast into smaller batches with a pause in between simulates human behavior, reducing the risk of being flagged for spam.',
                )
              }
              style={{ cursor: license.isFree() ? 'not-allowed' : 'pointer' }}
            >
              <Switch
                label={
                  <Group gap={8} wrap="nowrap">
                    <Text fw={500}>Batch sending</Text>
                    {license.isFree() && (
                      <Badge color="yellow" variant="light" size="sm">
                        Pro
                      </Badge>
                    )}
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
                {...form.getInputProps('batch.enabled', { type: 'checkbox' })}
              />
            </div>
            <When condition={form.values.batch.enabled}>
              <Group
                grow
                align="flex-start"
                style={{ opacity: license.isFree() ? 0.5 : 1 }}
              >
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
    </Stack>
  )
}

export default AntiBlockingSettings
