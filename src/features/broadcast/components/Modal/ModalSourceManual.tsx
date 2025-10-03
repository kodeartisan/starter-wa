// src/features/broadcast/components/Modal/ModalSourceManual.tsx
import Modal from '@/components/Modal/Modal'
import {
  Button,
  Center,
  Group,
  ScrollArea,
  Stack,
  Textarea,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import React from 'react'

interface Props {
  opened: boolean
  onClose: () => void
  onSubmit: (numbers: string[]) => void
}

const ModalSourceManual: React.FC<Props> = ({ opened, onClose, onSubmit }) => {
  const form = useForm({
    // MODIFIED: Changed initial value to a string to support the Textarea component.
    initialValues: {
      numbers: '',
    },
    // MODIFIED: Adapted validation to check if the trimmed string is empty.
    validate: {
      numbers: (value) =>
        value.trim().length === 0 ? 'Please enter at least one number.' : null,
    },
  })

  /**
   * English: Handles form submission by parsing the newline-separated numbers
   * from the textarea, cleaning them, ensuring uniqueness, and then
   * passing the result to the parent component.
   */
  const handleSubmit = (values: { numbers: string }) => {
    // 1. Split the string by newlines.
    // 2. Clean each line by removing non-numeric characters (except '+') and trimming whitespace.
    // 3. Filter out any empty lines that might result from the split.
    const cleanedNumbers = values.numbers
      .split('\n')
      .map((num) => num.replace(/[^0-9+]/g, '').trim())
      .filter((num) => num.length > 0)

    // Use a Set to automatically handle duplicates before submitting.
    const uniqueNumbers = [...new Set(cleanedNumbers)]

    onSubmit(uniqueNumbers)
    form.reset()
    onClose()
  }

  return (
    <>
      <Modal opened={opened} onClose={onClose} withCloseButton w={500}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <Center>
              <Title order={4}>Add Numbers Manually</Title>
            </Center>
            {/* MODIFIED: Replaced TagsInput with a more suitable Textarea for lists. */}
            <ScrollArea h={200}>
              <Textarea
                label="Phone Numbers"
                placeholder="Enter one number per line, including the country code."
                {...form.getInputProps('numbers')}
                autosize
                minRows={5}
                data-autofocus
              />
            </ScrollArea>

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
