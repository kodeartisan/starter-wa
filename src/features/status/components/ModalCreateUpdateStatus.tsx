// src/components/Pages/Status/Modal/ModalCreateUpdateStatus.tsx
import InputSendLater from '@/components/Input/InputSendLater'
import Upload from '@/components/Input/Upload'
import Modal from '@/components/Modal/Modal'
import { Media, Status as StatusState, StatusType } from '@/constants'
import useLicense from '@/hooks/useLicense'
import db, { type UserStatus } from '@/libs/db'
import toast from '@/utils/toast'
import { showModalUpgrade } from '@/utils/util'
import { Icon } from '@iconify/react'
import {
  Button,
  ColorInput,
  Group,
  Radio,
  ScrollArea,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { addMinutes, isFuture } from 'date-fns'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'

interface Props {
  opened: boolean
  onClose: () => void
  data?: UserStatus | null
}
const ModalCreateUpdateStatus: React.FC<Props> = ({
  opened,
  onClose,
  data = null,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const license = useLicense()
  const form = useForm({
    initialValues: {
      name: '',
      type: StatusType.TEXT,
      text: '',
      caption: '',
      file: null as File | null,
      backgroundColor: '#008069',
      font: 0,
      scheduler: {
        enabled: false,
        scheduledAt: addMinutes(new Date(), 5),
      },
    },
    validate: {
      type: (value) => (_.isEmpty(value) ? 'Status type is required' : null),
      text: (value, values) =>
        values.type === StatusType.TEXT && _.isEmpty(value)
          ? 'Text content is required'
          : null,
      file: (value, values) => {
        if (
          !data &&
          (values.type === StatusType.IMAGE || values.type === StatusType.VIDEO)
        ) {
          return !value ? 'File is required' : null
        }
        return null
      },
      scheduler: (value) => {
        if (license.isFree() && value.enabled) {
          form.setFieldValue('scheduler.enabled', false)
          showModalUpgrade()
          return 'Scheduler is a Pro feature.'
        }
        if (value.enabled && !value.scheduledAt) {
          return 'Scheduled date and time is required.'
        }
        if (
          value.enabled &&
          value.scheduledAt &&
          !isFuture(new Date(value.scheduledAt))
        ) {
          return 'Scheduled time must be in the future.'
        }
        return null
      },
    },
    validateInputOnChange: ['scheduler.enabled'],
  })

  const handleTypeChange = (value: string) => {
    if (
      license.isFree() &&
      (value === StatusType.IMAGE || value === StatusType.VIDEO)
    ) {
      showModalUpgrade()
      return
    }
    form.setFieldValue('type', value)
  }

  useEffect(() => {
    if (opened) {
      if (data) {
        form.setValues({
          name: data.name || '',
          type: data.type,
          text: data.type === StatusType.TEXT ? (data.message as string) : '',
          caption:
            data.type === StatusType.IMAGE || data.type === StatusType.VIDEO
              ? (data.message as { caption?: string })?.caption || ''
              : '',
          file: null,
          backgroundColor: data.backgroundColor || '#008069',
          font: data.font || 1,
          scheduler: {
            enabled: !!data.isScheduled,
            scheduledAt: data.scheduledAt || addMinutes(new Date(), 5),
          },
        })
      } else {
        form.reset()
        form.setFieldValue('scheduler', {
          enabled: false,
          scheduledAt: addMinutes(new Date(), 5),
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, opened])

  // --- START REFACTOR ---
  // Helper to prepare the status payload from form values.
  const prepareStatusPayload = async (attemptToPost: boolean) => {
    const {
      type,
      text,
      caption,
      file,
      name,
      backgroundColor,
      font,
      scheduler,
    } = form.values
    let targetDbStatus: string = StatusState.DRAFT
    let isActuallyScheduled = scheduler.enabled
    let actualScheduledAt = null

    if (
      scheduler.enabled &&
      scheduler.scheduledAt &&
      isFuture(scheduler.scheduledAt)
    ) {
      actualScheduledAt = scheduler.scheduledAt
      targetDbStatus = StatusState.SCHEDULER
    } else {
      isActuallyScheduled = false
    }

    if (attemptToPost) {
      if (
        !isActuallyScheduled ||
        (isActuallyScheduled && !isFuture(actualScheduledAt!))
      ) {
        targetDbStatus = StatusState.PENDING
      }
    }

    const basePayload = {
      name:
        name ||
        (type === StatusType.TEXT
          ? text.substring(0, 30)
          : caption?.substring(0, 30) || 'Media Status'),
      type,
      message: '', // Will be populated below
      backgroundColor: type === StatusType.TEXT ? backgroundColor : undefined,
      font: type === StatusType.TEXT ? font : undefined,
      isScheduled: isActuallyScheduled ? 1 : 0,
      scheduledAt: actualScheduledAt,
    }

    let mediaFileId: number | undefined = undefined
    if (type === StatusType.TEXT) {
      basePayload.message = text
    } else if (
      (type === StatusType.IMAGE || type === StatusType.VIDEO) &&
      file
    ) {
      const mediaId = await db.media.add({
        parentId: 0, // Temp parentId
        type: Media.STATUS_CONTENT,
        name: file.name,
        file: file,
        ext: file.type,
      })
      mediaFileId = mediaId
      //@ts-ignore
      basePayload.message = { caption: caption || '', fileId: mediaId }
    } else if (
      data &&
      (data.type === StatusType.IMAGE || data.type === StatusType.VIDEO) &&
      (data.message as any)?.fileId
    ) {
      // Re-use existing file if a new one isn't uploaded
      mediaFileId = (data.message as any).fileId
      //@ts-ignore
      basePayload.message = {
        caption: caption || '',
        fileId: (data.message as any).fileId,
      }
    }

    return { payload: basePayload, status: targetDbStatus, mediaFileId }
  }

  // Separated logic for creating a new status.
  const handleCreate = async (attemptToPost: boolean) => {
    const { payload, status, mediaFileId } =
      await prepareStatusPayload(attemptToPost)
    const statusId = await db.userStatuses.add({
      ...(payload as UserStatus),
      createdAt: new Date(),
      status: status,
      postedAt: status === StatusState.POSTED ? new Date() : null,
      message: payload.message,
    })

    if (
      mediaFileId &&
      (payload.type === StatusType.IMAGE || payload.type === StatusType.VIDEO)
    ) {
      await db.media.update(mediaFileId, { parentId: statusId })
    }
  }

  // Separated logic for updating an existing status.
  const handleUpdate = async (attemptToPost: boolean) => {
    if (!data?.id) return
    const { payload, status, mediaFileId } =
      await prepareStatusPayload(attemptToPost)
    const updateData: Partial<UserStatus> = {
      ...payload,
      status: status,
      message: payload.message,
    }
    if (status === StatusState.POSTED) updateData.postedAt = new Date()

    await db.userStatuses.update(data.id, updateData)

    if (
      mediaFileId &&
      (payload.type === StatusType.IMAGE ||
        payload.type === StatusType.VIDEO) &&
      form.values.file
    ) {
      const oldFileId = (data.message as any)?.fileId
      if (oldFileId && oldFileId !== mediaFileId) {
        await db.media.delete(oldFileId)
      }
      await db.media.update(mediaFileId, { parentId: data.id })
    }
  }

  // The main submit handler now decides which function to call.
  const handleSubmit = async (attemptToPost: boolean = false) => {
    if (form.validate().hasErrors) return
    setIsSubmitting(true)
    try {
      if (data && data.id) {
        await handleUpdate(attemptToPost)
      } else {
        await handleCreate(attemptToPost)
      }
      form.reset()
      onClose()
    } catch (error: any) {
      console.error('Failed to save/post status:', error)
      toast.error(`Error: ${error.message || 'Failed to process status.'}`)
    } finally {
      setIsSubmitting(false)
    }
  }
  // --- END REFACTOR ---

  const fontOptions = [
    { value: '0', label: 'Default' },
    { value: '1', label: 'Serif' },
    { value: '2', label: 'Sans-Serif' },
  ]

  const getSubmitButtonLabel = () => {
    const isScheduledForFuture =
      form.values.scheduler.enabled &&
      form.values.scheduler.scheduledAt &&
      isFuture(form.values.scheduler.scheduledAt)

    if (isScheduledForFuture) {
      return data && data.status === StatusState.POSTED
        ? 'Schedule Again'
        : 'Schedule Post'
    }
    return data && data.status === StatusState.POSTED
      ? 'Post Again'
      : 'Post Now'
  }

  return (
    <Modal
      opened={opened}
      onClose={() => {
        form.reset()
        onClose()
      }}
      w={600}
      withCloseButton
    >
      <ScrollArea h={650}>
        <Stack>
          <TextInput
            label="Status Name"
            placeholder="e.g., Morning Update"
            {...form.getInputProps('name')}
          />
          <Radio.Group
            label={<Text fw={500}>Status Type</Text>}
            value={form.values.type}
            onChange={handleTypeChange}
          >
            <Group>
              <Radio
                value={StatusType.TEXT}
                label={
                  <Group gap="xs" wrap="nowrap">
                    <Icon icon="tabler:file-text" fontSize={20} />
                    <Text>Text</Text>
                  </Group>
                }
              />
              <Radio
                value={StatusType.IMAGE}
                label={
                  <Group gap="xs" wrap="nowrap">
                    <Icon icon={'tabler:photo'} fontSize={20} />
                    <Text>Image</Text>
                  </Group>
                }
              />
              <Radio
                value={StatusType.VIDEO}
                label={
                  <Group gap="xs" wrap="nowrap">
                    <Icon icon={'tabler:video'} fontSize={20} />
                    <Text>Video</Text>
                  </Group>
                }
              />
            </Group>
          </Radio.Group>
          {form.values.type === StatusType.TEXT && (
            <>
              <Textarea
                label="Text"
                placeholder="What's on your mind?"
                autosize
                minRows={4}
                {...form.getInputProps('text')}
              />
              <ColorInput
                label="Background Color"
                placeholder="Choose color"
                format="hex"
                {...form.getInputProps('backgroundColor')}
              />
              <Select
                label="Font Style"
                placeholder="Select font"
                data={fontOptions}
                {...form.getInputProps('font')}
                value={form.values.font?.toString()}
                onChange={(value) =>
                  form.setFieldValue('font', value ? parseInt(value) : 0)
                }
              />
            </>
          )}
          {(form.values.type === StatusType.IMAGE ||
            form.values.type === StatusType.VIDEO) && (
            <>
              <Upload
                type={form.values.type === StatusType.IMAGE ? 'image' : 'video'}
                value={form.values.file}
                onDrop={(droppedFile) =>
                  form.setFieldValue('file', droppedFile)
                }
              />
              {form.errors.file && (
                <Text c="red" size="sm">
                  {form.errors.file}
                </Text>
              )}
              <Textarea
                label="Caption (Optional)"
                placeholder="Add a caption..."
                autosize
                minRows={2}
                {...form.getInputProps('caption')}
              />
            </>
          )}

          <InputSendLater form={form} />
        </Stack>
        <Group justify="flex-end" mt="xl">
          <Button
            onClick={() => handleSubmit(true)}
            loading={isSubmitting}
            disabled={isSubmitting}
            color="green"
          >
            {getSubmitButtonLabel()}
          </Button>
        </Group>
      </ScrollArea>
    </Modal>
  )
}
export default ModalCreateUpdateStatus
