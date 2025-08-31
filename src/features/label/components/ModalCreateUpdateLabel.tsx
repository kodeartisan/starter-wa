// src/features/label/components/ModalCreateUpdateLabel.tsx
import Modal from '@/components/Modal/Modal'
import type { Label } from '@/libs/db'
import db from '@/libs/db'
import toast from '@/utils/toast'
import {
  Button,
  Center,
  ColorInput,
  Group,
  Stack,
  Switch,
  Text,
  Textarea, // MODIFIED: Imported Textarea
  TextInput,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import _ from 'lodash'
import React, { useEffect } from 'react'

interface Props {
  opened: boolean
  data?: Label | null
  onClose: () => void
  onSuccess?: () => void
}

// START: MODIFIED - Added a predefined color palette
const PREDEFINED_COLORS = [
  '#25262b',
  '#868e96',
  '#fa5252',
  '#e64980',
  '#be4bdb',
  '#7950f2',
  '#4c6ef5',
  '#228be6',
  '#15aabf',
  '#12b886',
  '#40c057',
  '#82c91e',
  '#fab005',
  '#fd7e14',
]
// END: MODIFIED

const ModalCreateUpdateLabel: React.FC<Props> = ({
  opened,
  data,
  onClose,
  onSuccess,
}: Props) => {
  const form = useForm({
    initialValues: {
      name: '',
      group: '',
      color: '#228be6',
      isPinned: false,
      description: '', // MODIFIED: Added description
    },
    validate: {
      name: (value) => {
        if (_.isEmpty(value)) {
          return 'Required'
        }
        if (value.length > 20) {
          return 'Max 20 characters'
        }
        return null
      },
    },
  })

  useEffect(() => {
    if (data && opened) {
      form.setValues({
        name: data.label || '',
        group: data.group || '',
        color: data.color || '#228be6',
        isPinned: data.isPinned === 1,
        description: data.description || '', // MODIFIED: Set description value
      })
    } else {
      form.reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, opened])

  const handleCreate = async (values: typeof form.values) => {
    const payload = {
      label: values.name,
      value: values.name,
      group: values.group,
      color: values.color,
      isPinned: values.isPinned ? 1 : 0,
      description: values.description, // MODIFIED: Added description
    }
    try {
      await db.labels.add({ ...payload, show: 1, custom: 1, numbers: [] })
      toast.success(`Label "${values.name}" created successfully.`)
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Failed to create label:', error)
      toast.error('An error occurred while creating the label.')
    }
  }

  const handleUpdate = async (values: typeof form.values) => {
    if (!data?.id) return
    const payload = {
      label: values.name,
      value: values.name,
      group: values.group,
      color: values.color,
      isPinned: values.isPinned ? 1 : 0,
      description: values.description, // MODIFIED: Added description
    }
    try {
      await db.labels.update(data.id, payload)
      toast.success(`Label "${values.name}" updated successfully.`)
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Failed to update label:', error)
      toast.error('An error occurred while updating the label.')
    }
  }

  // The main submit handler.
  const handleSubmit = async (values: typeof form.values) => {
    if (data && data.id) {
      await handleUpdate(values)
    } else {
      await handleCreate(values)
    }
    form.reset()
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      w={500}
      withCloseButton
      style={{ zIndex: 9999 }}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack justify="space-between">
          <Stack>
            <Center>
              <Title order={3}>{data ? 'Edit' : 'Create'} Label</Title>
            </Center>
            <TextInput
              label="Name"
              required
              data-autofocus
              {...form.getInputProps('name')}
            />
            <TextInput
              label="Group (Optional)"
              placeholder="e.g., Leads, Customers"
              {...form.getInputProps('group')}
            />
            {/* START: MODIFIED - Added color swatches */}
            <ColorInput
              label="Color"
              placeholder="Pick a color"
              swatches={PREDEFINED_COLORS}
              {...form.getInputProps('color')}
            />
            {/* END: MODIFIED */}

            {/* START: MODIFIED - Added description field */}
            <Textarea
              label="Description (Optional)"
              placeholder="Add notes or context for this label..."
              autosize
              minRows={2}
              {...form.getInputProps('description')}
            />
            {/* END: MODIFIED */}

            <Switch
              mt="md"
              label={
                <Text fw={500} size="sm">
                  Pin to Header
                </Text>
              }
              description="Pinned labels appear first for quick access."
              {...form.getInputProps('isPinned', { type: 'checkbox' })}
            />
          </Stack>
          <Group align="end" justify="end" mt="md">
            <Button type="submit">{data ? 'Save Changes' : 'Submit'}</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}

export default ModalCreateUpdateLabel
