// src/features/number-validator/components/SettingsSection.tsx
import useLicense from '@/hooks/useLicense'
import {
  Badge,
  Box,
  Fieldset,
  Group,
  NumberInput,
  Switch,
  Text,
} from '@mantine/core'
import React from 'react'
import { When } from 'react-if'
import type { useNumberValidator } from '../hooks/useNumberValidator'

interface Props {
  validator: ReturnType<typeof useNumberValidator>
  isValidating: boolean
  onShowUpgradeModal: (featureName: string, benefit: string) => void
}

const SettingsSection: React.FC<Props> = ({
  validator,
  isValidating,
  onShowUpgradeModal,
}) => {
  const license = useLicense()

  const handleFieldsetClick = (featureName: string, benefit: string) => {
    if (license.isFree()) {
      onShowUpgradeModal(featureName, benefit)
    }
  }

  return (
    <>
      <Box>
        <Fieldset
          legend={
            <Group gap="xs">
              <Text fw={500}>Randomized Delay</Text>
            </Group>
          }
        >
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
              size="sm"
              disabled={isValidating}
            />
            <NumberInput
              label="Max Delay (sec)"
              description="Maximum time between checks."
              value={validator.delayMax}
              onChange={(value) => validator.setDelayMax(Number(value))}
              min={1}
              step={1}
              size="sm"
              disabled={isValidating}
            />
          </Group>
        </Fieldset>
      </Box>

      <Box
        onClick={() =>
          handleFieldsetClick(
            'Batch Processing',
            'For large lists, this pauses validation periodically to enhance safety. Upgrade to Pro to enable and configure batch processing.',
          )
        }
        style={{ cursor: license.isFree() ? 'pointer' : 'default' }}
      >
        <Fieldset
          legend={
            <Group gap="xs">
              <Text fw={500}>Batch Processing</Text>
              <When condition={license.isFree()}>
                <Badge size="sm" variant="light" color="teal">
                  PRO
                </Badge>
              </When>
            </Group>
          }
        >
          <Switch
            checked={validator.isBatchingEnabled}
            onChange={(event) =>
              validator.setIsBatchingEnabled(event.currentTarget.checked)
            }
            label="Process numbers in batches"
            description="For large lists, this pauses validation periodically."
            disabled={isValidating || license.isFree()}
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
                size="sm"
                disabled={isValidating || license.isFree()}
              />
              <NumberInput
                label="Pause Duration (minutes)"
                description="How long to pause after each batch."
                value={validator.batchPause}
                onChange={(value) => validator.setBatchPause(Number(value))}
                min={1}
                step={1}
                size="sm"
                disabled={isValidating || license.isFree()}
              />
            </Group>
          )}
        </Fieldset>
      </Box>
    </>
  )
}

export default SettingsSection
