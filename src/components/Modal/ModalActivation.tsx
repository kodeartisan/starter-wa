// src/components/Modal/ModalActivation.tsx
import Modal from '@/components/Modal/Modal'
import useLicense from '@/hooks/useLicense'
import toast from '@/utils/toast'
import { getStoreId } from '@/utils/util'
import { Icon } from '@iconify/react'
import {
  Button,
  rem,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import _ from 'lodash'
import React, { useState } from 'react'

interface Props {
  opened: boolean
  onClose: () => void
}

const defaultValues = {
  license: '',
}

const ModalActivation: React.FC<Props> = ({ opened, onClose }: Props) => {
  const license = useLicense()
  const form = useForm({
    initialValues: defaultValues,
    validate: {
      license: (value) =>
        _.isEmpty(value) ? 'A license key is required.' : null,
    },
  })

  const [loading, setLoading] = useState<boolean>(false)

  const handleOnClose = () => {
    form.reset()
    onClose()
  }

  const handleSubmit = async () => {
    const { hasErrors } = form.validate()
    if (hasErrors) {
      return
    }

    setLoading(true)
    form.clearErrors()

    try {
      const response = await license.activate(form.values.license)
      if (response.data.error) {
        form.setFieldError('license', response.data.error.replace(/_/g, ' '))
        setLoading(false)
        return
      }

      if (response.data.meta.store_id.toString() !== getStoreId()) {
        form.setFieldError(
          'license',
          'This license key is not valid for this product.',
        )
        setLoading(false)
        return
      }

      toast.success('Successfully activated! 🎉')
      handleOnClose()
    } catch (err) {
      console.error('Activation error:', err)
      form.setFieldError(
        'license',
        'An unexpected error occurred. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={handleOnClose}
      w={500}
      p="xl"
      withCloseButton
    >
      <Stack gap="lg">
        <Stack align="center" gap="xs">
          <ThemeIcon color="teal" size={rem(60)} radius="xl">
            <Icon icon="tabler:key" fontSize={rem(32)} />
          </ThemeIcon>
          <Title order={3} ta="center">
            {' '}
            License Activation{' '}
          </Title>
          <Text c="dimmed" size="sm" ta="center">
            {' '}
            Enter your license key below to unlock all Pro features.{' '}
          </Text>
        </Stack>

        <Stack>
          <TextInput
            label="License Key"
            placeholder="xxxx-xxxx-xxxx-xxxx"
            required
            leftSection={<Icon icon="tabler:key" fontSize={18} />}
            {...form.getInputProps('license')}
          />
          {/* MODIFIED: Replaced text with more reassuring microcopy. */}
          <Text size="xs" c="dimmed">
            {' '}
            Your license key validates your purchase, ensuring you receive
            lifetime access and all future updates.{' '}
          </Text>
        </Stack>

        <Button
          loading={loading}
          onClick={handleSubmit}
          fullWidth
          size="md"
          mt="md"
          leftSection={<Icon icon="tabler:circle-check" fontSize={20} />}
        >
          {' '}
          Activate License{' '}
        </Button>
      </Stack>
    </Modal>
  )
}

export default ModalActivation
