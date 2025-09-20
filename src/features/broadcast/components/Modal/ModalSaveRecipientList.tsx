// src/features/broadcast/components/Modal/ModalSaveRecipientList.tsx
import Modal from '@/components/Modal/Modal'
import { Button, Center, Group, Stack, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import React from 'react'

interface Props {
  opened: boolean
  onClose: () => void
  onSave: (name: string) => void
  isSaving: boolean
}

const ModalSaveRecipientList: React.FC<Props> = ({
  opened,
  onClose,
  onSave,
  isSaving,
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

  const handleSubmit = (values: { name: string }) => {
    onSave(values.name)
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
          <TextInput
            label="List Name"
            placeholder="e.g., Weekly Newsletter Leads"
            {...form.getInputProps('name')}
            data-autofocus
          />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isSaving}>
              Save List
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}

export default ModalSaveRecipientList
