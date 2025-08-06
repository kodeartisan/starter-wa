// src/features/Tools/NumberValidator/components/SettingsSection.tsx
import {
  Fieldset,
  Group,
  NumberInput,
  Switch,
  Text,
  Title,
} from '@mantine/core'
import React from 'react'
import type { useNumberValidator } from '../hooks/useNumberValidator'

interface Props {
  validator: ReturnType<typeof useNumberValidator>
  isValidating: boolean
}

const SettingsSection: React.FC<Props> = ({ validator, isValidating }) => {
  return (
    <>
      <Title order={4} mt="md">
        2. Configure Settings
      </Title>
      <Fieldset legend="Randomized Delay">
        <Text size="sm" c="dimmed" mb="xs">
          Using a random delay between checks helps mimic human behavior.
        </Text>
        <Group grow>
          <NumberInput
            label="Min Delay (sec)"
            description="Minimum time between checks."
            value={validator.delayMin}
            onChange={(value) => validator.setDelayMin(Number(value))}
            min={1}
            step={1}
            disabled={isValidating}
          />
          <NumberInput
            label="Max Delay (sec)"
            description="Maximum time between checks."
            value={validator.delayMax}
            onChange={(value) => validator.setDelayMax(Number(value))}
            min={1}
            step={1}
            disabled={isValidating}
          />
        </Group>
      </Fieldset>
      <Fieldset legend="Batch Processing">
        <Switch
          checked={validator.isBatchingEnabled}
          onChange={(event) =>
            validator.setIsBatchingEnabled(event.currentTarget.checked)
          }
          label="Process numbers in batches"
          description="For large lists, this pauses validation periodically."
          disabled={isValidating}
        />
        {validator.isBatchingEnabled && (
          <Group grow mt="md">
            <NumberInput
              label="Batch Size"
              description="Numbers to check before pausing."
              value={validator.batchSize}
              onChange={(value) => validator.setBatchSize(Number(value))}
              min={1}
              step={10}
              disabled={isValidating}
            />
            <NumberInput
              label="Pause Duration (minutes)"
              description="How long to pause after each batch."
              value={validator.batchPause}
              onChange={(value) => validator.setBatchPause(Number(value))}
              min={1}
              step={1}
              disabled={isValidating}
            />
          </Group>
        )}
      </Fieldset>
    </>
  )
}

export default SettingsSection
