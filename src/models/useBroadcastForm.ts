// src/models/useBroadcastForm.ts
import { Media, Message, Setting, Status } from '@/constants'
import useInputMessage from '@/features/broadcast/components/Input/Message/useInputMessage'
import useLicense from '@/hooks/useLicense'
import db, { type Broadcast, type BroadcastContact } from '@/libs/db'
import { storage } from '@/libs/storage'
import wa from '@/libs/wa'
import { useAppStore } from '@/stores/app'
import parse from '@/utils/parse'
import toast from '@/utils/toast'
import {
  formHasErrors,
  isTypeMessageMedia,
  showModalUpgrade,
} from '@/utils/util'
import { useForm } from '@mantine/form'
import { addMinutes, isFuture } from 'date-fns'
import _ from 'lodash'
import { useEffect, useMemo, useState } from 'react'

const defaultValues = {
  name: '',
  numbers: [] as any[],
  isTyping: false,
  validateNumbers: false,
  scheduler: {
    enabled: false,
    scheduledAt: addMinutes(new Date(), 5),
  },
  delayMin: 3,
  delayMax: 6,
  pauseEnabled: false,
  pauseAfter: 50,
  pauseDuration: 5,
}

interface useBroadcastFormProps {
  cloneData?: (Broadcast & { recipients?: any[] }) | null
  onSuccess: () => void
  onClose: () => void
}

/**
 * @hook useBroadcastForm
 * @description Encapsulates all the logic for creating and editing a broadcast campaign.
 * This includes form management, validation, data cloning, and submission handlers.
 */
export const useBroadcastForm = ({
  cloneData = null,
  onSuccess,
  onClose,
}: useBroadcastFormProps) => {
  const license = useLicense()
  const [isPreviewing, setIsPreviewing] = useState(false)
  const { profile } = useAppStore()
  const form = useForm({
    initialValues: defaultValues,
    validate: {
      numbers: (value) => {
        if (_.isEmpty(value)) return 'At least one recipient is required'
        if (license.isFree() && value.length > 5) {
          form.setFieldValue('numbers', _.initial(value))
          showModalUpgrade()
          return 'Free plan allows up to 5 contacts.'
        }
        return null
      },
      isTyping: (value) => {
        if (license.isFree() && value) {
          form.setFieldValue('isTyping', false)
          showModalUpgrade()
          return 'Typing effect is a Pro feature.'
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
      delayMin: (value) =>
        !value || value < 1 ? 'Minimum delay must be at least 1 second.' : null,
      delayMax: (value, values) => {
        if (!value || value < 1)
          return 'Maximum delay must be at least 1 second.'
        if (values.delayMin && value < values.delayMin) {
          return 'Max delay cannot be less than min delay.'
        }
        return null
      },
      pauseAfter: (value, values) =>
        values.pauseEnabled && (!value || value < 1)
          ? 'Please enter a valid number of messages.'
          : null,
      pauseDuration: (value, values) =>
        values.pauseEnabled && (!value || value < 1)
          ? 'Please enter a valid pause duration in minutes.'
          : null,
    },
    validateInputOnChange: ['numbers'],
  })

  const {
    form: inputMessageForm,
    getMessage,
    insertBroadcastFile,
  } = useInputMessage()

  const estimatedTime = useMemo(() => {
    const {
      numbers,
      delayMin,
      delayMax,
      pauseEnabled,
      pauseAfter,
      pauseDuration,
    } = form.values
    const recipientCount = numbers.length
    if (
      recipientCount === 0 ||
      !delayMin ||
      !delayMax ||
      delayMin <= 0 ||
      delayMax <= 0
    ) {
      return ''
    }

    let minSeconds = recipientCount * delayMin
    let maxSeconds = recipientCount * delayMax

    if (pauseEnabled && pauseAfter > 0 && pauseDuration > 0) {
      const numberOfPauses = Math.floor((recipientCount - 1) / pauseAfter)
      if (numberOfPauses > 0) {
        const totalPauseSeconds = numberOfPauses * pauseDuration * 60
        minSeconds += totalPauseSeconds
        maxSeconds += totalPauseSeconds
      }
    }

    const minMinutes = Math.round(minSeconds / 60)
    const maxMinutes = Math.round(maxSeconds / 60)

    if (maxMinutes < 1) return 'Less than a minute.'
    if (minMinutes === maxMinutes)
      return `About ${minMinutes} minute${minMinutes > 1 ? 's' : ''}.`
    return `About ${minMinutes} to ${maxMinutes} minutes.`
  }, [form.values])

  // Effect for populating form when cloning data
  useEffect(() => {
    const populateForm = async () => {
      if (cloneData) {
        let recipientsToSet: any[] = []
        let nameSuffix = ' (Copy)'
        const broadcastName = `${cloneData.name || 'Broadcast'}`

        if (cloneData.recipients && cloneData.recipients.length > 0) {
          recipientsToSet = cloneData.recipients
          nameSuffix = ' (Resend)'
        } else {
          const originalRecipients = await db.broadcastContacts
            .where({ broadcastId: cloneData.id })
            .toArray()
          recipientsToSet = originalRecipients.map((contact) => ({
            number: contact.number,
            name: contact.name,
          }))
        }

        form.setValues({
          name: `${broadcastName}${nameSuffix}`,
          numbers: recipientsToSet,
          isTyping: !!cloneData.isTyping,
          validateNumbers: cloneData.validateNumbers !== 0,
          scheduler: {
            enabled: false,
            scheduledAt: addMinutes(new Date(), 5),
          },
          delayMin: cloneData.delayMin ? cloneData.delayMin / 1000 : 3,
          delayMax: cloneData.delayMax ? cloneData.delayMax / 1000 : 6,
          pauseEnabled: !!cloneData.pauseEnabled,
          pauseAfter: cloneData.pauseAfter || 50,
          pauseDuration: cloneData.pauseDuration || 5,
        })

        const { type, message } = cloneData
        inputMessageForm.setFieldValue('type', type)

        switch (type) {
          case Message.TEXT:
            inputMessageForm.setFieldValue('inputText', message as string)
            break
          case Message.IMAGE:
          case Message.VIDEO:
          case Message.FILE:
            const mediaFile = await db.media
              .where({ parentId: cloneData.id, type: Media.BROADCAST })
              .first()
            const caption =
              (message as any)?.caption ||
              (typeof message === 'string' ? message : '')
            if (type === Message.IMAGE) {
              inputMessageForm.setFieldValue('inputImage', {
                file: mediaFile?.file || null,
                caption,
              })
            } else if (type === Message.VIDEO) {
              inputMessageForm.setFieldValue('inputVideo', {
                file: mediaFile?.file || null,
                caption,
              })
            } else {
              inputMessageForm.setFieldValue('inputFile', {
                file: mediaFile?.file || null,
                caption,
              })
            }
            break
          case Message.LOCATION:
            inputMessageForm.setFieldValue('inputLocation', message)
            break
          case Message.POLL:
            inputMessageForm.setFieldValue('inputPoll', message)
            break
        }
      }
    }
    if (cloneData) {
      populateForm().catch(console.error)
    } else {
      form.reset()
      inputMessageForm.reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cloneData])

  const handleClose = () => {
    form.reset()
    inputMessageForm.reset()
    onClose()
  }

  const handlePreviewBroadcast = async () => {
    if (formHasErrors(form, inputMessageForm)) return
    setIsPreviewing(true)

    const { type } = inputMessageForm.values
    const myChatId = `${profile?.number}@c.us`
    if (!myChatId) {
      toast.error(
        'Could not retrieve your number for the preview. Please try again.',
      )
      setIsPreviewing(false)
      return
    }
    try {
      switch (type) {
        case Message.TEXT:
          await wa.send.text(
            myChatId,
            await parse.text(inputMessageForm.values.inputText, myChatId),
          )
          break
        case Message.IMAGE:
          if (!inputMessageForm.values.inputImage.file) throw new Error()
          await wa.send.file(
            myChatId,
            inputMessageForm.values.inputImage.file,
            {
              type: 'image',
              caption: await parse.text(
                inputMessageForm.values.inputImage.caption,
                myChatId,
              ),
            },
          )
          break
        // NOTE: Previews for other media types can be added here.
        default:
          toast.info(
            'Preview is currently only available for text and image messages.',
          )
          break
      }
      toast.success('Preview sent to your number!')
    } catch (e) {
      toast.error('Failed to send preview. Please check your message content.')
    } finally {
      setIsPreviewing(false)
    }
  }

  const proceedWithBroadcast = async () => {
    const signatureEnabled = await storage.get(Setting.SIGNATURE_ENABLED)
    const signatureText = await storage.get<string>(Setting.SIGNATURE_TEXT)
    let messagePayload = getMessage()
    const messageType = inputMessageForm.values.type

    if (signatureEnabled && signatureText && signatureText.trim() !== '') {
      const signature = `\n\n${signatureText}`
      if (messageType === Message.TEXT) {
        messagePayload += signature
      } else if (
        (messageType === Message.IMAGE ||
          messageType === Message.VIDEO ||
          messageType === Message.FILE) &&
        typeof messagePayload === 'object' &&
        messagePayload !== null
      ) {
        if ('caption' in messagePayload) {
          messagePayload.caption = (messagePayload.caption || '') + signature
        } else {
          messagePayload = (messagePayload || '') + signature
        }
      }
    }

    const broadcastData = {
      ...form.values,
      type: messageType,
      message: messagePayload,
      validateNumbers: form.values.validateNumbers ? 1 : 0,
      isTyping: form.values.isTyping ? 1 : 0,
      isScheduler: form.values.scheduler.enabled ? 1 : 0,
      status: Status.PENDING,
      delayMin: form.values.delayMin * 1000,
      delayMax: form.values.delayMax * 1000,
      pauseEnabled: form.values.pauseEnabled ? 1 : 0,
    }

    try {
      //@ts-ignore
      const broadcastId = await db.broadcasts.add(broadcastData as Broadcast)

      if (isTypeMessageMedia(inputMessageForm.values.type)) {
        await insertBroadcastFile(broadcastId, Media.BROADCAST)
      }
      //@ts-ignore
      const contacts: BroadcastContact[] = form.values.numbers.map(
        (recipient: any) => ({
          broadcastId,
          number: recipient.number,
          name: recipient.name,
          status: form.values.scheduler.enabled
            ? Status.SCHEDULER
            : Status.PENDING,
          scheduledAt: form.values.scheduler.enabled
            ? form.values.scheduler.scheduledAt
            : null,
        }),
      )
      await db.broadcastContacts.bulkAdd(contacts)
      onSuccess()
    } catch (error) {
      console.error('Failed to save broadcast:', error)
      toast.error('An error occurred while saving the broadcast.')
    }
  }

  const handleSendBroadcast = async () => {
    if (formHasErrors(form, inputMessageForm)) return

    const hasAcknowledged = await storage.get(
      Setting.HAS_ACKNOWLEDGED_BROADCAST_WARNING,
    )

    if (!hasAcknowledged) {
      return false // Indicate that the warning modal should be shown
    }
    await proceedWithBroadcast()
    return true // Indicate that the action was performed
  }

  const handleWarningAccepted = async () => {
    await storage.set(Setting.HAS_ACKNOWLEDGED_BROADCAST_WARNING, true)
    await proceedWithBroadcast()
  }

  return {
    form,
    inputMessageForm,
    isPreviewing,
    estimatedTime,
    handleClose,
    handlePreviewBroadcast,
    handleSendBroadcast,
    handleWarningAccepted,
  }
}
