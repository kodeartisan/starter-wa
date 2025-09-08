// src/features/direct-chat/PageDirectChat.tsx
import InputMessage from '@/components/Broadcast/Input/Message/InputMessage'
import useInputMessage from '@/components/Broadcast/Input/Message/useInputMessage'
import LayoutPage from '@/components/Layout/LayoutPage'
import ModalUpgrade from '@/components/Modal/ModalUpgrade'
import { Message } from '@/constants'
import useLicense from '@/hooks/useLicense'
import wa from '@/libs/wa'
import toast from '@/utils/toast'
import { formHasErrors } from '@/utils/util'
import { Button, Group, Stack, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'

const defaultValues = {
  number: '',
}

// English: Define which message types are pro features.
const PRO_MESSAGE_TYPES = [
  Message.IMAGE,
  Message.VIDEO,
  Message.FILE,
  Message.LOCATION,
  Message.POLL,
  Message.VCARD,
]

// English: Define a type for the feature details to display in the upgrade modal.
interface ProFeatureInfo {
  name: string
  benefit: string
}

/**
 * @component PageDirectChat
 * @description Allows users to start a chat without saving the number, now with support for sending text, media, and VCards.
 * It also displays an upgrade modal for Pro features.
 */
const PageDirectChat: React.FC = () => {
  const { form: inputMessageForm, getMessage } = useInputMessage()
  const license = useLicense()
  const [
    isUpgradeModalOpen,
    { open: openUpgradeModal, close: closeUpgradeModal },
  ] = useDisclosure(false)
  const [selectedFeature, setSelectedFeature] = useState<ProFeatureInfo>({
    name: '',
    benefit: '',
  })

  const form = useForm({
    initialValues: defaultValues,
    validate: {
      number: (value) =>
        _.isEmpty(value) ? 'The phone number is required.' : null,
    },
  })

  const [loading, setLoading] = useState<boolean>(false)

  // English: A helper function to set feature details and open the upgrade modal.
  const triggerUpgradeModal = (name: string, benefit: string) => {
    setSelectedFeature({ name, benefit })
    openUpgradeModal()
  }

  // English: This effect watches for changes in the message type. If a user on the
  // free plan selects a Pro feature, it shows the upgrade modal and reverts the selection.
  useEffect(() => {
    const { type } = inputMessageForm.values
    if (license.isFree() && PRO_MESSAGE_TYPES.includes(type)) {
      const featureNameMap: Record<string, ProFeatureInfo> = {
        [Message.IMAGE]: {
          name: 'Sending Images',
          benefit: 'Share photos and screenshots directly in your messages.',
        },
        [Message.VIDEO]: {
          name: 'Sending Videos',
          benefit: 'Send video files to your contacts.',
        },
        [Message.FILE]: {
          name: 'Sending Files',
          benefit:
            'Attach documents, archives, and other files to your messages.',
        },
        [Message.LOCATION]: {
          name: 'Sending Locations',
          benefit: 'Share a map with a specific location.',
        },
        [Message.POLL]: {
          name: 'Creating Polls',
          benefit: 'Create polls to easily gather opinions from a contact.',
        },
        [Message.VCARD]: {
          name: 'Sending Contacts (VCard)',
          benefit: 'Share contact information quickly and easily.',
        },
      }
      const featureInfo = featureNameMap[type]

      if (featureInfo) {
        triggerUpgradeModal(featureInfo.name, featureInfo.benefit)
        // Revert to the default message type after showing the modal.
        inputMessageForm.setFieldValue('type', Message.TEXT)
      }
    }
  }, [inputMessageForm.values.type, license])

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
        await wa.chat.openChatBottom(chatId)
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
      <ModalUpgrade
        opened={isUpgradeModalOpen}
        onClose={closeUpgradeModal}
        featureName={selectedFeature.name}
        featureBenefit={selectedFeature.benefit}
      />
      <LayoutPage title="Direct Chat">
        <Stack>
          <TextInput
            label="WhatsApp Number"
            placeholder="e.g., 6281234567890"
            description="Enter the full number with country code, without '+' or spaces."
            required
            {...form.getInputProps('number')}
          />
          {/* Use InputMessage component for message composition */}
          <Stack gap="xs" mt="md">
            <InputMessage
              form={inputMessageForm}
              disabledTemplateButton={false}
            />
          </Stack>
          <Group justify="flex-end" mt="md">
            <Button loading={loading} onClick={handleSubmit}>
              {' '}
              Send Message{' '}
            </Button>
          </Group>
        </Stack>
      </LayoutPage>
    </>
  )
}

export default PageDirectChat
