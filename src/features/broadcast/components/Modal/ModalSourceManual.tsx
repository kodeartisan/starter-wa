// src/features/broadcast/components/Modal/ModalSourceManual.tsx
import Modal from '@/components/Modal/Modal'
import { Icon } from '@iconify/react'
import { Button, Center, Group, Stack, TagsInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import React from 'react'

interface Props {
  opened: boolean
  onClose: () => void
  onSubmit: (numbers: string[]) => void
}

const ModalSourceManual: React.FC<Props> = ({ opened, onClose, onSubmit }) => {
  const form = useForm({
    initialValues: {
      numbers: [] as string[],
    },
    validate: {
      numbers: (value) =>
        value.length === 0 ? 'Please enter at least one number.' : null,
    },
  })

  const handleSubmit = (values: { numbers: string[] }) => {
    onSubmit(values.numbers)
    form.reset()
    onClose()
  }

  // ++ ADDED: Function to handle input changes and perform real-time cleaning.
  const handleInputChange = (values: string[]) => {
    // This function is triggered when tags are added or removed.
    // We process the last added item to clean it.
    if (values.length > form.values.numbers.length) {
      const lastValue = values[values.length - 1]
      // Remove any non-numeric characters except for a leading '+'
      const cleanedValue = lastValue.replace(/[^0-9+]/g, '')

      // Replace the last entered value with the cleaned one
      const newValues = [...values.slice(0, -1), cleanedValue]

      // Update form state with the cleaned and unique values
      form.setFieldValue('numbers', Array.from(new Set(newValues)))
    } else {
      // Handle tag removal normally
      form.setFieldValue('numbers', values)
    }
  }

  return (
    <>
      <Modal opened={opened} onClose={onClose} withCloseButton w={500}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <Center>
              <Title order={4}>Add Numbers Manually</Title>
            </Center>
            {/* ++ MODIFIED: Added onChange handler and right section for validation icon */}
            <TagsInput
              label="Phone Numbers"
              placeholder="Enter number with country code and press Enter"
              description="Example: 6281234567890. Non-numeric characters will be removed."
              {...form.getInputProps('numbers')}
              onChange={handleInputChange} // Handle cleaning
              clearable
            />
            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Add Numbers</Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  )
}

export default ModalSourceManual
