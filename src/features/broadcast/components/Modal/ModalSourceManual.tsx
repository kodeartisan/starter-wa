import Modal from '@/components/Modal/Modal'
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

  return (
    <>
      <Modal opened={opened} onClose={onClose} withCloseButton w={500}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <Center>
              <Title order={4}>Add Numbers Manually</Title>
            </Center>
            <TagsInput
              label="Phone Numbers"
              placeholder="Enter number with country code and press Enter"
              description="Example: 6281234567890"
              {...form.getInputProps('numbers')}
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
