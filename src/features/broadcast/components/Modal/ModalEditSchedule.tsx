// src/features/broadcast/components/Modal/ModalEditSchedule.tsx
import Modal from '@/components/Modal/Modal'
import type { Broadcast } from '@/libs/db'
import toast from '@/utils/toast'
import { Button, Center, Group, Stack, Title } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { isFuture } from 'date-fns'
import React, { useEffect } from 'react'

interface Props {
  opened: boolean
  onClose: () => void
  onSubmit: (broadcastId: number, newScheduledAt: Date) => void
  broadcastData: Broadcast | null
}

/**
 * @component ModalEditSchedule
 * @description A modal for editing the scheduled time of a broadcast.
 * It ensures the new time is in the future and provides a clean interface.
 */
const ModalEditSchedule: React.FC<Props> = ({
  opened,
  onClose,
  onSubmit,
  broadcastData,
}) => {
  const form = useForm({
    initialValues: {
      scheduledAt: null as Date | null,
    },
    validate: {
      scheduledAt: (value) => {
        if (!value) {
          return 'A date and time are required.'
        }
        if (!isFuture(new Date(value))) {
          return 'Scheduled time must be in the future.'
        }
        return null
      },
    },
  })

  useEffect(() => {
    // Populate form with existing scheduled time when the modal opens
    if (broadcastData && opened) {
      // Since the data comes from a map, we need to find the actual scheduledAt
      // This part will be handled by passing the correct date to the modal.
      // For now, let's assume `broadcastData` has a `scheduledAt` property.
      // We will adjust this in PageBroadcast.tsx.
      // @ts-ignore
      if (broadcastData.scheduledAt) {
        // @ts-ignore
        form.setValues({ scheduledAt: new Date(broadcastData.scheduledAt) })
      }
    } else if (!opened) {
      form.reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [broadcastData, opened])

  const handleSubmit = (values: { scheduledAt: Date | null }) => {
    if (!broadcastData || !values.scheduledAt) {
      toast.error('Invalid data provided.')
      return
    }
    onSubmit(broadcastData.id, values.scheduledAt)
  }

  return (
    <Modal opened={opened} onClose={onClose} withCloseButton w={500} h={500}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <Center>
            <Title order={4}>Edit Broadcast Schedule</Title>
          </Center>
          <DateTimePicker
            label="New Scheduled Time"
            placeholder="Pick date and time"
            minDate={new Date()}
            required
            {...form.getInputProps('scheduledAt')}
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

export default ModalEditSchedule
