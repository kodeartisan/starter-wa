import { Group, TagsInput, Text, Tooltip } from '@mantine/core'
import type { UseFormReturnType } from '@mantine/form'
import React from 'react'
import ExcelUploadPopover from './Excel/ExcelUploadPopover'

interface Props {
  form: UseFormReturnType<any>
}

const InputContact: React.FC<Props> = ({ form }) => {
  const handleAddNumbers = (newNumbers: (string | number)[]) => {
    const currentValues = form.values.numbers
    const uniqueNumbers = [
      ...new Set([...currentValues, ...newNumbers.map(String)]),
    ]
    form.setFieldValue('numbers', uniqueNumbers)
  }

  // This function is passed to the ExcelUploadPopover to handle the data once confirmed.
  const handleConfirmExcelUpload = (parsedData: any[]) => {
    const newNumbers = parsedData
      .map((item) => item.number?.toString())
      .filter(Boolean)
    if (newNumbers.length > 0) {
      handleAddNumbers(newNumbers)
    }
  }

  return (
    <>
      <TagsInput
        label={
          <Group justify="space-between" w={687}>
            <Text fw={500}>
              Numbers{' '}
              {form.values.numbers.length
                ? `(${form.values.numbers.length})`
                : ''}
            </Text>
            <Group mb={6}>
              <ExcelUploadPopover onConfirm={handleConfirmExcelUpload} />
            </Group>
          </Group>
        }
        placeholder="Number with country code, Press Enter to submit"
        {...form.getInputProps('numbers')}
        clearable
      />
    </>
  )
}

export default InputContact
