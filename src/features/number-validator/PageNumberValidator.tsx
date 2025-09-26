// src/features/number-validator/PageNumberValidator.tsx
import LayoutPage from '@/components/Layout/LayoutPage'
import ModalSourceExcel from '@/components/Modal/ModalSourceExcel'
import useLicense from '@/hooks/useLicense'
import { showModalUpgrade } from '@/utils/util' // 1. Impor fungsi global showModalUpgrade
import { Icon } from '@iconify/react'
import { Button, Group, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import React from 'react' // 2. Hapus useState karena tidak lagi dibutuhkan
import { When } from 'react-if'
import InputSection from './components/InputSection'
import ResultsSection from './components/ResultsSection'
import SettingsSection from './components/SettingsSection'
import { useNumberValidator } from './hooks/useNumberValidator'

const VALIDATION_LIMIT_FREE = 5

const PageNumberValidator: React.FC = () => {
  const [showExcelModal, excelModalHandlers] = useDisclosure(false)
  // 3. Hapus state yang tidak lagi diperlukan untuk ModalUpgrade
  // const [showUpgradeModal, upgradeModalHandlers] = useDisclosure(false)
  // const [upgradeInfo, setUpgradeInfo] = useState({ name: '', benefit: '' })

  const validator = useNumberValidator()
  const license = useLicense()

  const handleAddFromSource = (newRecipients: any[]) => {
    const newNumbers = newRecipients.map((r) => r.number || r)
    validator.addNumbers(newNumbers)
    excelModalHandlers.close()
  }

  // 4. Hapus fungsi trigger lokal, karena kita akan menggunakan fungsi global secara langsung
  // const triggerUpgradeModal = (name: string, benefit: string) => {
  //   setUpgradeInfo({ name, benefit })
  //   upgradeModalHandlers.open()
  // }

  const handleStart = () => {
    const numbersToValidate = validator.numbers.filter(Boolean).length
    if (license.isFree() && numbersToValidate > VALIDATION_LIMIT_FREE) {
      // 5. Panggil showModalUpgrade secara langsung
      showModalUpgrade(
        'Unlimited Number Validation',
        `The free version is limited to ${VALIDATION_LIMIT_FREE} numbers per validation. Upgrade to Pro to validate unlimited numbers.`,
      )
      return
    }
    validator.handleStartValidation()
  }

  return (
    <LayoutPage width={700}>
      <InputSection
        numbers={validator.numbers}
        setNumbers={validator.setNumbers}
        isValidating={validator.isValidating}
        onImportExcel={excelModalHandlers.open}
        onShowUpgradeModal={showModalUpgrade} // 6. Teruskan fungsi showModalUpgrade sebagai prop
      />
      <SettingsSection
        validator={validator}
        isValidating={validator.isValidating}
        onShowUpgradeModal={showModalUpgrade} // 6. Teruskan fungsi showModalUpgrade sebagai prop
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
              onClick={handleStart}
              disabled={validator.numbers.filter(Boolean).length === 0}
              leftSection={<Icon icon="tabler:player-play" />}
            >
              Start Validation
            </Button>
          )}
        </Group>
      </Group>

      <When condition={validator.isValidating || validator.results.length > 0}>
        <ResultsSection
          validator={validator}
          onShowUpgradeModal={showModalUpgrade} // 6. Teruskan fungsi showModalUpgrade sebagai prop
        />
      </When>

      <ModalSourceExcel
        opened={showExcelModal}
        onClose={excelModalHandlers.close}
        onSubmit={handleAddFromSource}
      />

      {/* 7. Hapus instance ModalUpgrade dari file ini */}
      {/* <ModalUpgrade
        opened={showUpgradeModal}
        onClose={upgradeModalHandlers.close}
        featureName={upgradeInfo.name}
        featureBenefit={upgradeInfo.benefit}
      /> */}
    </LayoutPage>
  )
}

export default PageNumberValidator
