// src/features/broadcast/components/Modal/ModalEditRecipient.tsx
import Modal from '@/components/Modal/Modal'
import { Button, Center, Group, Stack, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import React, { useEffect } from 'react'

interface Props {
  opened: boolean
  onClose: () => void
  // MODIFIED: The onSubmit signature is updated to pass the original number
  // along with the new data, allowing the parent to identify the correct record.
  onSubmit: (
    originalNumber: string,
    updatedData: { name: string; number: string },
  ) => void
  recipientData: { number: string; name: string } | null
}

const ModalEditRecipient: React.FC<Props> = ({
  opened,
  onClose,
  onSubmit,
  recipientData,
}) => {
  const form = useForm({
    initialValues: {
      name: '',
      number: '',
    },
    validate: {
      name: (value) =>
        value.trim().length > 0 ? null : 'Name cannot be empty',
      // ADDED: Validation to ensure the number field is not empty.
      number: (value) =>
        value.trim().length > 0 ? null : 'Number cannot be empty',
    },
  })

  useEffect(() => {
    if (recipientData) {
      form.setValues({
        name: recipientData.name,
        number: recipientData.number,
      })
    } else {
      form.reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipientData, opened])

  const handleSubmit = (values: { name: string; number: string }) => {
    // MODIFIED: Passes the original recipient's number to the submit handler
    // to ensure the correct record is updated, even if the number itself was changed.
    if (recipientData) {
      onSubmit(recipientData.number, values)
    }
    onClose()
  }

  return (
    <Modal opened={opened} onClose={onClose} withCloseButton w={500}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <Center>
            <Title order={4}>Edit Recipient</Title>
          </Center>
          <TextInput
            label="Name"
            placeholder="Enter contact name"
            {...form.getInputProps('name')}
            data-autofocus
          />
          {/* MODIFIED: The `readOnly` prop has been removed to allow editing of the recipient's number. */}
          <TextInput
            label="Number"
            placeholder="Enter number with country code"
            {...form.getInputProps('number')}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}

export default ModalEditRecipient
