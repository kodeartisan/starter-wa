import InputMessage from '@/components/Input/Message/InputMessage'
import useInputMessage from '@/components/Input/Message/useInputMessage'
import LayoutPage from '@/components/Layout/LayoutPage'
import { Message } from '@/constants'
import wa from '@/libs/wa'
import toast from '@/utils/toast'
import { formHasErrors } from '@/utils/util'
import { Icon } from '@iconify/react'
import { Button, Group, Stack, Text, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import _ from 'lodash'
import React, { useState } from 'react'

const defaultValues = {
  number: '',
}

/**
 * @component PageDirectChat
 * @description Allows users to start a chat without saving the number, now with support for sending text, media, and VCards.
 */
const PageDirectChat: React.FC = () => {
  const { form: inputMessageForm, getMessage } = useInputMessage()

  const form = useForm({
    initialValues: defaultValues,
    validate: {
      number: (value) =>
        _.isEmpty(value) ? 'The phone number is required.' : null,
    },
  })

  const [loading, setLoading] = useState<boolean>(false)

  // Handles sending the message directly using wa-js functions
  const handleSubmit = async () => {
    // Validate both the number input form and the message input form
    if (formHasErrors(form, inputMessageForm)) {
      return
    }

    setLoading(true)
    form.clearErrors()

    try {
      const fullNumber = form.values.number.replace(/\D/g, '') // Remove non-numeric chars
      const chatId = `${fullNumber}@c.us`

      // Check if the number exists on WhatsApp.
      const isExist = await wa.contact.isExist(chatId)
      if (!isExist) {
        form.setFieldError(
          'number',
          'This number is not registered on WhatsApp.',
        )
        setLoading(false)
        return
      }

      const { type } = inputMessageForm.values
      const message = getMessage()

      let result
      switch (type) {
        case Message.TEXT:
          result = await wa.send.text(chatId, message as string)
          break
        case Message.IMAGE:
          if (!inputMessageForm.values.inputImage.file)
            throw new Error('Image file is required.')
          result = await wa.send.file(
            chatId,
            inputMessageForm.values.inputImage.file,
            {
              type: 'image',
              caption: (message as { caption: string }).caption,
            },
          )
          break
        case Message.VIDEO:
          if (!inputMessageForm.values.inputVideo.file)
            throw new Error('Video file is required.')
          result = await wa.send.file(
            chatId,
            inputMessageForm.values.inputVideo.file,
            {
              type: 'video',
              caption: (message as { caption: string }).caption,
            },
          )
          break
        case Message.FILE:
          if (!inputMessageForm.values.inputFile.file)
            throw new Error('File is required.')
          result = await wa.send.file(
            chatId,
            inputMessageForm.values.inputFile.file,
            {
              type: 'document',
              caption: message as string,
            },
          )
          break
        case Message.LOCATION:
          //@ts-ignore
          result = await wa.send.location(chatId, message)
          break
        case Message.POLL:
          const { name, choices } = message as {
            name: string
            choices: string[]
          }
          result = await wa.send.poll(chatId, name, choices)
          break
        case Message.VCARD:
          // Extract the serialized ID from each selected contact object
          const contactIdsToSend = (message as any[]).map(
            (c) => c.id._serialized,
          )
          if (contactIdsToSend.length === 0)
            throw new Error('No contact selected to send.')
          result = await wa.send.vcard(chatId, contactIdsToSend)
          break
        default:
          toast.error('Unsupported message type for Direct Chat.')
          setLoading(false)
          return
      }

      if (result.status === 'SUCCESS') {
        toast.success('Message sent successfully!')
        // Open the chat to see the sent message
        await wa.chat.openChatBottom(chatId)
        // Reset message form, but keep the number
        inputMessageForm.reset()
      } else {
        toast.error(result.error || 'Failed to send message.')
      }
    } catch (error: any) {
      console.error('Failed to send direct chat:', error)
      toast.error(error.message || 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <LayoutPage title="Direct Chat">
        <Stack>
          <Stack align="center" gap={4} mb={'xl'}>
            <Icon
              icon="tabler:message-circle-plus"
              fontSize={48}
              color="var(--mantine-color-teal-6)"
            />
            <Title order={3} ta="center">
              Direct Chat
            </Title>
            <Text c="dimmed" size="sm" ta="center">
              Start a conversation without saving the number to your contacts.
            </Text>
          </Stack>

          <TextInput
            label="WhatsApp Number"
            placeholder="e.g., 6281234567890"
            description="Enter the full number with country code, without '+' or spaces."
            required
            {...form.getInputProps('number')}
          />

          {/* Use InputMessage component for message composition */}
          <Stack gap="xs" mt="md">
            <InputMessage form={inputMessageForm} />
          </Stack>

          <Group justify="flex-end" mt="md">
            <Button
              loading={loading}
              onClick={handleSubmit}
              leftSection={<Icon icon="tabler:brand-whatsapp" fontSize={20} />}
            >
              Send Message
            </Button>
          </Group>
        </Stack>
      </LayoutPage>
    </>
  )
}

export default PageDirectChat
