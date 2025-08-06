// src/features/quick-reply/components/Modal/ModalCreateUpdateQuickReply.tsx
import InputMessage from '@/components/Input/Message/InputMessage'
import useInputMessage from '@/components/Input/Message/useInputMessage'
import Modal from '@/components/Modal/Modal'
import { Media, Message } from '@/constants'
import db, { type QuickReply } from '@/libs/db'
import { formHasErrors, isTypeMessageMedia } from '@/utils/util'
import {
  Button,
  Center,
  Group,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import _ from 'lodash'
import React, { useEffect } from 'react'

interface Props {
  opened: boolean
  onClose: () => void
  data?: Partial<QuickReply> | null
}

const ModalCreateUpdateQuickReply: React.FC<Props> = ({
  opened,
  onClose,
  data = null,
}: Props) => {
  const {
    form: inputMessageForm,
    getMessage,
    insertBroadcastFile,
  } = useInputMessage({ isEditing: !!data?.id })

  const form = useForm({
    initialValues: {
      name: '',
      isPinned: false,
    },
    validate: {
      name: (value) => (_.isEmpty(value) ? 'Required.' : null),
    },
  })

  // Effect to populate the form when editing an existing template.
  useEffect(() => {
    const populateForm = async () => {
      if (data) {
        form.setValues({
          name: data.name,
          isPinned: data.isPinned === 1,
        })
        const messageData = data.message as any
        const type = data.type
        inputMessageForm.reset()
        inputMessageForm.setFieldValue('type', type)

        if (isTypeMessageMedia(type) && data.id) {
          const media = await db.media
            .where({ parentId: data.id, type: Media.QUICK_REPLY })
            .first()

          // If media is found, set it in the form to trigger the preview.
          if (media?.file) {
            switch (type) {
              case Message.IMAGE:
                inputMessageForm.setFieldValue(
                  'inputImage.caption',
                  messageData?.caption || '',
                )
                inputMessageForm.setFieldValue('inputImage.file', media.file)
                break
              case Message.VIDEO:
                inputMessageForm.setFieldValue(
                  'inputVideo.caption',
                  messageData?.caption || '',
                )
                inputMessageForm.setFieldValue('inputVideo.file', media.file)
                break
              case Message.FILE:
                inputMessageForm.setFieldValue(
                  'inputFile.caption',
                  messageData as string,
                )
                inputMessageForm.setFieldValue('inputFile.file', media.file)
                break
            }
          }
        } else if (type === Message.TEXT) {
          inputMessageForm.setFieldValue('inputText', messageData as string)
        }
      } else {
        form.reset()
        inputMessageForm.reset()
      }
    }

    if (opened) {
      populateForm()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, opened])

  const handleCreate = async () => {
    const { type } = inputMessageForm.values
    const { name, isPinned } = form.values
    const id = await db.quickReplies.add({
      name,
      type,
      message: getMessage(),
      isPinned: isPinned ? 1 : 0,
      createdAt: new Date(),
    })
    if (isTypeMessageMedia(type)) {
      await insertBroadcastFile(id, Media.QUICK_REPLY)
    }
  }

  const handleUpdate = async () => {
    if (!data?.id) return
    const { type } = inputMessageForm.values
    const { name, isPinned } = form.values
    const messagePayload = getMessage()
    await db.quickReplies.update(data.id, {
      name,
      type,
      message: messagePayload,
      isPinned: isPinned ? 1 : 0,
    })

    const newFileIsSelected =
      (type === Message.IMAGE && inputMessageForm.values.inputImage.file) ||
      (type === Message.VIDEO && inputMessageForm.values.inputVideo.file) ||
      (type === Message.FILE && inputMessageForm.values.inputFile.file)

    if (isTypeMessageMedia(type)) {
      if (newFileIsSelected) {
        await db.media
          .where({ parentId: data.id, type: Media.QUICK_REPLY })
          .delete()
        await insertBroadcastFile(data.id, Media.QUICK_REPLY)
      }
    } else if (
      data.type &&
      isTypeMessageMedia(data.type) &&
      !isTypeMessageMedia(type)
    ) {
      await db.media
        .where({ parentId: data.id, type: Media.QUICK_REPLY })
        .delete()
    }
  }

  const handleSubmit = async () => {
    if (formHasErrors(form, inputMessageForm)) return
    if (data && data.id !== undefined) {
      await handleUpdate()
    } else {
      await handleCreate()
    }
    onClose()
  }

  return (
    <Modal opened={opened} onClose={onClose} w={900} withCloseButton>
      <Stack justify="space-between">
        <Stack>
          <Center>
            <Title order={3}>{data?.id ? 'Edit' : 'Create'} Quick Reply</Title>
          </Center>
          <TextInput label="Name" required {...form.getInputProps('name')} />
          <Switch
            mt="md"
            label={
              <Text fw={500} size="sm">
                Pin to Top
              </Text>
            }
            description="Pinned replies always appear at the top of the list for quick access."
            {...form.getInputProps('isPinned', { type: 'checkbox' })}
          />
          <InputMessage form={inputMessageForm} />
        </Stack>
        <Group justify="end" mt="lg">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save</Button>
        </Group>
      </Stack>
    </Modal>
  )
}

export default ModalCreateUpdateQuickReply
