// src/features/number-validator/components/InputSection.tsx
import useLicense from '@/hooks/useLicense'
import { Icon } from '@iconify/react'
import {
  Badge,
  Button,
  Group,
  ScrollArea,
  Stack,
  Textarea,
} from '@mantine/core'
import React from 'react'
import { When } from 'react-if'

interface Props {
  numbers: string[]
  setNumbers: (numbers: string[]) => void
  isValidating: boolean
  onImportExcel: () => void
  onShowUpgradeModal: (featureName: string, benefit: string) => void
}

const InputSection: React.FC<Props> = ({
  numbers,
  setNumbers,
  isValidating,
  onImportExcel,
  onShowUpgradeModal,
}) => {
  const license = useLicense()

  const handleImportExcel = () => {
    if (license.isFree()) {
      onShowUpgradeModal(
        'Import from Excel',
        'Upgrade to Pro to quickly import thousands of numbers from an Excel or CSV file.',
      )
      return
    }
    onImportExcel()
  }

  return (
    <Stack gap={1}>
      <ScrollArea h={230}>
        <Textarea
          label="Manual Input"
          value={numbers.join('\n')}
          onChange={(e) => {
            setNumbers(e.currentTarget.value.split('\n'))
          }}
          placeholder="Paste numbers here, one per line, with country code. E.g., 6281234567890"
          minRows={7}
          disabled={isValidating}
          autosize
        />
      </ScrollArea>
      <Group>
        <Button
          variant="outline"
          leftSection={<Icon icon="tabler:file-type-xls" />}
          onClick={handleImportExcel}
          size="xs"
          disabled={isValidating}
          rightSection={
            <When condition={license.isFree()}>
              <Badge size="sm" variant="light" color="teal">
                PRO
              </Badge>
            </When>
          }
        >
          Import from Excel
        </Button>
      </Group>
    </Stack>
  )
}

export default InputSection
