// src/features/Tools/NumberValidator/components/InputSection.tsx
import { Icon } from '@iconify/react'
import { Button, Group, ScrollArea, Textarea, Title } from '@mantine/core'
import React from 'react'

interface Props {
  numbers: string[]
  setNumbers: (numbers: string[]) => void
  isValidating: boolean
  onImportExcel: () => void
  onImportGroups: () => void
}

const InputSection: React.FC<Props> = ({
  numbers,
  setNumbers,
  isValidating,
  onImportExcel,
  onImportGroups,
}) => {
  return (
    <>
      <Title order={4}>1. Input Numbers</Title>
      <ScrollArea h={250}>
        <Textarea
          label="Manual Input"
          value={numbers.join('\n')}
          onChange={(e) => {
            setNumbers(e.currentTarget.value.split('\n'))
          }}
          placeholder="Paste numbers here, one per line, with country code. E.g., 6281234567890"
          minRows={8}
          disabled={isValidating}
          autosize
        />
      </ScrollArea>
      <Group>
        <Button
          variant="outline"
          leftSection={<Icon icon="tabler:file-type-xls" />}
          onClick={onImportExcel}
          disabled={isValidating}
        >
          Import from Excel
        </Button>
        <Button
          variant="outline"
          leftSection={<Icon icon="tabler:users" />}
          onClick={onImportGroups}
          disabled={isValidating}
        >
          Import from Groups
        </Button>
      </Group>
    </>
  )
}

export default InputSection
