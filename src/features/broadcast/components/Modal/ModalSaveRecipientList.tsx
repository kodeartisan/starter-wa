import Modal from '@/components/Modal/Modal'
import db from '@/libs/db'
import toast from '@/utils/toast'
import {
  Button,
  Center,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import React from 'react'

interface Props {
  opened: boolean
  onClose: () => void
  recipients: any[]
}

const ModalSaveRecipientList: React.FC<Props> = ({
  opened,
  onClose,
  recipients,
}) => {
  const form = useForm({
    initialValues: {
      name: '',
    },
    validate: {
      name: (value) =>
        value.trim().length > 0 ? null : 'List name is required',
    },
  })

  const handleSubmit = async (values: { name: string }) => {
    try {
      await db.broadcastRecipients.add({
        name: values.name,
        recipients: recipients,
        createdAt: new Date(),
      })

      toast.success(`Recipient list "${values.name}" saved successfully!`)
      handleClose()
    } catch (error) {
      console.error('Failed to save recipient list:', error)

      toast.error('An error occurred while saving the list.')
    }
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Modal opened={opened} onClose={handleClose} withCloseButton w={500}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <Center>
            <Title order={4}>Save Recipient List</Title>
          </Center>
          <Text ta="center" size="sm" c="dimmed">
            Save the current {recipients.length} recipients as a list for future
            use.
          </Text>
          <TextInput
            label="List Name"
            placeholder="e.g., Weekly Newsletter Subscribers"
            required
            {...form.getInputProps('name')}
            data-autofocus
          />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Save List</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}

export default ModalSaveRecipientList
