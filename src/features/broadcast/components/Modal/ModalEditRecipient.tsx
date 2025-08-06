import Modal from '@/components/Modal/Modal'
import { Button, Center, Group, Stack, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import React, { useEffect } from 'react'

interface Props {
  opened: boolean
  onClose: () => void
  onSubmit: (recipient: { number: string; name: string }) => void
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
    onSubmit(values)
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
          <TextInput
            label="Number"
            readOnly
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
