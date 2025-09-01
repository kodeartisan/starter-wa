// src/features/label/components/ModalCreateUpdateLabel.tsx
import Modal from '@/components/Modal/Modal'
import useLicense from '@/hooks/useLicense' // ++ IMPORT
import type { Label } from '@/libs/db'
import db from '@/libs/db'
import toast from '@/utils/toast'
import { showModalUpgrade } from '@/utils/util' // ++ IMPORT
import {
  Button,
  Center,
  ColorInput,
  Group,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useLiveQuery } from 'dexie-react-hooks' // ++ IMPORT
import _ from 'lodash'
import React, { useEffect } from 'react'

interface Props {
  opened: boolean
  data?: Label | null
  onClose: () => void
  onSuccess?: () => void
}

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

const ModalCreateUpdateLabel: React.FC<Props> = ({
  opened,
  data,
  onClose,
  onSuccess,
}: Props) => {
  const license = useLicense() // ++ ADD
  const labelCount = useLiveQuery(() => db.labels.count(), []) // ++ ADD

  const form = useForm({
    initialValues: {
      name: '',
      group: '',
      color: '#228be6',
      isPinned: false,
      description: '',
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
        description: data.description || '',
      })
    } else {
      form.reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, opened])

  const handleCreate = async (values: typeof form.values) => {
    // ++ ADD: License check for label creation limit
    if (license.isFree() && (labelCount || 0) >= 3) {
      showModalUpgrade(
        'Unlimited Labels',
        'Create up to 3 labels on the Free plan. Upgrade to Pro for unlimited labels.',
      )
      return
    }

    const payload = {
      label: values.name,
      value: values.name,
      group: values.group,
      color: values.color,
      isPinned: values.isPinned ? 1 : 0,
      description: values.description,
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
      description: values.description,
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
            <ColorInput
              label="Color"
              placeholder="Pick a color"
              swatches={PREDEFINED_COLORS}
              {...form.getInputProps('color')}
            />
            <Textarea
              label="Description (Optional)"
              placeholder="Add notes or context for this label..."
              autosize
              minRows={2}
              {...form.getInputProps('description')}
            />
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
