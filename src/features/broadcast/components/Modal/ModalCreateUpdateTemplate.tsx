// src/components/Modal/ModalCreateUpdateTemplate.tsx
import Modal from '@/components/Modal/Modal'
import { Media, Message } from '@/constants'
import db, { type BroadcastTemplate } from '@/libs/db'
import { formHasErrors, isTypeMessageMedia } from '@/utils/util'
import { Button, Center, Group, Stack, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import _ from 'lodash'
import React, { useEffect } from 'react'
import InputMessage from '../Input/Message/InputMessage'
import useInputMessage from '../Input/Message/useInputMessage'

interface Props {
  opened: boolean
  onClose: () => void
  data?: Partial<BroadcastTemplate> | null
  // ADDED: A new prop to accept initial form data for creating a new template.
  initialData?: any | null
}

const ModalCreateUpdateTemplate: React.FC<Props> = ({
  opened,
  onClose,
  data = null,
  // ADDED: Destructure the new prop.
  initialData = null,
}: Props) => {
  const {
    form: inputMessageForm,
    getMessage,
    insertBroadcastFile,
  } = useInputMessage()

  const form = useForm({
    initialValues: {
      name: '',
    },
    validate: {
      name: (value) => (_.isEmpty(value) ? 'Required' : null),
    },
  })

  // MODIFIED: The useEffect hook is updated to prioritize `initialData` for populating the form.
  useEffect(() => {
    if (opened) {
      // If initialData is provided, it's a "new template from composed message" flow.
      if (initialData) {
        inputMessageForm.setValues(initialData)
        form.reset() // Ensure the name field is empty
      } else if (data) {
        // This is the existing "edit" or "clone" flow.
        form.setValues({ name: data.name })
        const messageData = data.message as any
        const type = data.type
        inputMessageForm.reset()
        inputMessageForm.setFieldValue('type', type)
        switch (type) {
          case Message.TEXT:
            inputMessageForm.setFieldValue('inputText', messageData as string)
            break
          case Message.IMAGE:
            inputMessageForm.setFieldValue(
              'inputImage.caption',
              messageData?.caption || '',
            )
            inputMessageForm.setFieldValue('inputImage.file', null)
            break
          case Message.VIDEO:
            inputMessageForm.setFieldValue(
              'inputVideo.caption',
              messageData?.caption || '',
            )
            inputMessageForm.setFieldValue('inputVideo.file', null)
            break
          case Message.FILE:
            inputMessageForm.setFieldValue(
              'inputFile.caption',
              messageData as string,
            )
            inputMessageForm.setFieldValue('inputFile.file', null)
            break
          case Message.LOCATION:
            inputMessageForm.setFieldValue('inputLocation', messageData)
            break
          case Message.POLL:
            inputMessageForm.setFieldValue('inputPoll', messageData)
            break
          default:
            if (typeof messageData === 'string' && !isTypeMessageMedia(type)) {
              inputMessageForm.setFieldValue('inputText', messageData)
            }
            break
        }
      } else {
        // This is the "create new blank template" flow.
        form.reset()
        inputMessageForm.reset()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, initialData, opened])

  // --- START REFACTOR ---
  // Separated logic for creating a new template.
  const handleCreate = async () => {
    const { type } = inputMessageForm.values
    const { name } = form.values
    const templateId = await db.broadcastTemplates.add({
      name,
      type,
      message: getMessage(),
    })
    if (isTypeMessageMedia(type)) {
      if (typeof templateId === 'number') {
        await insertBroadcastFile(templateId, Media.BROADCAST_TEMPLATE)
      } else {
        console.error('Failed to get templateId as number for media upload')
      }
    }
  }

  // Separated logic for updating an existing template.
  const handleUpdate = async () => {
    if (!data?.id) return
    const { type } = inputMessageForm.values
    const { name } = form.values
    const messagePayload = getMessage()
    await db.broadcastTemplates.update(data.id, {
      name,
      type,
      message: messagePayload,
    })

    const newFileIsSelected =
      (type === Message.IMAGE && inputMessageForm.values.inputImage.file) ||
      (type === Message.VIDEO && inputMessageForm.values.inputVideo.file) ||
      (type === Message.FILE && inputMessageForm.values.inputFile.file)

    if (isTypeMessageMedia(type)) {
      if (newFileIsSelected) {
        // If a new file is selected, delete old media and add the new one
        await db.media
          .where({ parentId: data.id, type: Media.BROADCAST_TEMPLATE })
          .delete()
        await insertBroadcastFile(data.id, Media.BROADCAST_TEMPLATE)
      }
      // If no new file is selected, and type is still media, existing media is preserved.
    } else if (isTypeMessageMedia(data.type) && !isTypeMessageMedia(type)) {
      // If type changed from media to non-media, delete old media.
      await db.media
        .where({ parentId: data.id, type: Media.BROADCAST_TEMPLATE })
        .delete()
    }
  }

  // The main submit handler now decides which function to call.
  const handleSubmit = async () => {
    if (formHasErrors(form, inputMessageForm)) return

    if (data && data.id !== undefined) {
      await handleUpdate()
    } else {
      await handleCreate()
    }
    onClose()
  }
  // --- END REFACTOR ---

  const handleClose = () => {
    onClose()
  }

  return (
    <Modal opened={opened} onClose={handleClose} w={750} withCloseButton>
      <Stack justify="space-between">
        <Stack>
          <Center>
            {/* MODIFIED: Title is now dynamic based on whether it's editing, creating from initial data, or creating new. */}
            <Title order={3}>{data?.id ? 'Edit' : 'Create'} Template</Title>
          </Center>
          <TextInput label="Name" required {...form.getInputProps('name')} />
          <InputMessage disabledTemplateButton form={inputMessageForm} />
        </Stack>
        <Group align="end" justify="end">
          <Button onClick={handleSubmit}>Submit</Button>
        </Group>
      </Stack>
    </Modal>
  )
}

export default ModalCreateUpdateTemplate
