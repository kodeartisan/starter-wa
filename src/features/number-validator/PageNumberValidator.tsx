// src/features/Tools/NumberValidator/PageNumberValidator.tsx
import LayoutPage from '@/components/Layout/LayoutPage'
import ModalSourceExcel from '@/components/Modal/ModalSourceExcel'
import { Icon } from '@iconify/react'
import { Button, Card, Group, Stack, Text, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import React from 'react'
import { When } from 'react-if'
import InputSection from './components/InputSection'
import ResultsSection from './components/ResultsSection'
import SettingsSection from './components/SettingsSection'
import { useNumberValidator } from './hooks/useNumberValidator'

const PageNumberValidator: React.FC = () => {
  const [showExcelModal, excelModalHandlers] = useDisclosure(false)
  const [showGroupsModal, groupsModalHandlers] = useDisclosure(false)

  const validator = useNumberValidator()

  const handleAddFromSource = (newRecipients: any[]) => {
    const newNumbers = newRecipients.map((r) => r.number || r)
    validator.addNumbers(newNumbers)
    excelModalHandlers.close()
    groupsModalHandlers.close()
  }

  return (
    <LayoutPage width={800}>
      <InputSection
        numbers={validator.numbers}
        setNumbers={validator.setNumbers}
        isValidating={validator.isValidating}
        onImportExcel={excelModalHandlers.open}
        onImportGroups={groupsModalHandlers.open}
      />
      <SettingsSection
        validator={validator}
        isValidating={validator.isValidating}
      />
      <When condition={!validator.isValidating && validator.estimatedTime}>
        <Text size="sm" c="dimmed">
          <b>Estimated Completion Time:</b> {validator.estimatedTime}
        </Text>
      </When>
      <Group justify="space-between" mt="sm">
        <Text c="dimmed" size="sm">
          Total numbers to check: {validator.numbers.filter(Boolean).length}
        </Text>
        <Group>
          <Button
            variant="outline"
            color="red"
            onClick={validator.handleClear}
            disabled={validator.isValidating}
            leftSection={<Icon icon="tabler:x" />}
          >
            Clear All
          </Button>
          {validator.isValidating ? (
            <Button
              variant="filled"
              color="red"
              onClick={validator.handleStopValidation}
              leftSection={<Icon icon="tabler:player-stop" />}
            >
              Stop
            </Button>
          ) : (
            <Button
              onClick={validator.handleStartValidation}
              disabled={validator.numbers.filter(Boolean).length === 0}
              leftSection={<Icon icon="tabler:player-play" />}
            >
              Start Validation
            </Button>
          )}
        </Group>
      </Group>
      <When condition={validator.isValidating || validator.results.length > 0}>
        <ResultsSection validator={validator} />
      </When>
      <ModalSourceExcel
        opened={showExcelModal}
        onClose={excelModalHandlers.close}
        onSubmit={handleAddFromSource}
      />
      {/* <ModalSourceMemberGroups
        opened={showGroupsModal}
        onClose={groupsModalHandlers.close}
        onSubmit={handleAddFromSource}
      /> */}
    </LayoutPage>
  )
}

export default PageNumberValidator
