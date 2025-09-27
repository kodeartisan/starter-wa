// src/models/useBroadcastForm.ts
import { Media, Message, Setting, Status } from '@/constants'
import useInputMessage from '@/features/broadcast/components/Input/Message/useInputMessage'
import useLicense from '@/hooks/useLicense'
import db, { type Broadcast, type BroadcastContact } from '@/libs/db'
import { storage } from '@/libs/storage'
import { useAppStore } from '@/stores/app'
import toast from '@/utils/toast'
import {
  formHasErrors,
  isTypeMessageMedia,
  showModalUpgrade,
} from '@/utils/util'
import { useForm } from '@mantine/form'
import { addMinutes, differenceInHours, isFuture } from 'date-fns'
import _ from 'lodash'
import { useEffect } from 'react'

const defaultValues = {
  name: '',
  numbers: [] as any[],
  isTyping: false,
  validateNumbers: true,
  scheduler: {
    enabled: false,
    scheduledAt: addMinutes(new Date(), 5),
  },
  delayMin: 3,
  delayMax: 6,
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
  const { profile } = useAppStore()
  const form = useForm({
    initialValues: defaultValues,
    validate: {
      numbers: (value) => {
        if (_.isEmpty(value)) return 'At least one recipient is required'
        if (license.isFree() && value.length > 5) {
          form.setFieldValue('numbers', _.initial(value))
          return 'Free plan allows up to 5 contacts.'
        }
        return null
      },
      scheduler: (value) => {
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
        if (
          license.isFree() &&
          value.enabled &&
          value.scheduledAt &&
          differenceInHours(new Date(value.scheduledAt), new Date()) >= 1
        ) {
          showModalUpgrade(
            'Schedule for Any Day',
            'Want to plan your broadcasts for tomorrow, next week, or even next month? Upgrade to Pro and unlock the freedom to schedule messages anytime in the future!',
          )
          form.setFieldValue('scheduler.scheduledAt', new Date())
          return
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
    },
    validateInputOnChange: ['numbers', 'scheduler.scheduledAt'],
  })
  const {
    form: inputMessageForm,
    getMessage,
    insertBroadcastFile,
  } = useInputMessage()

  // MODIFIED: This hook now *only* handles populating the form when cloneData is provided.
  // The reset logic has been centralized in the `handleClose` function to avoid
  // redundancy and ensure a clean state reset every time the modal is closed.
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
          validateNumbers: !!cloneData.validateNumbers,
          scheduler: {
            enabled: false,
            scheduledAt: addMinutes(new Date(), 5),
          },
          delayMin: cloneData.delayMin ? cloneData.delayMin / 1000 : 3,
          delayMax: cloneData.delayMax ? cloneData.delayMax / 1000 : 6,
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
    }
  }, [cloneData])

  // MODIFIED: This function is now the single source of truth for resetting the modal's state.
  // It explicitly resets both forms to their initial default values upon closing.
  const handleClose = () => {
    form.reset()
    inputMessageForm.reset()
    onClose() // This calls the parent's onClose (e.g., to set visibility and clear cloneData).
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
      isTyping: form.values.isTyping ? 1 : 0,
      isScheduler: form.values.scheduler.enabled ? 1 : 0,
      validateNumbers: form.values.validateNumbers ? 1 : 0,
      status: form.values.scheduler.enabled ? Status.SCHEDULER : Status.PENDING,
      delayMin: form.values.delayMin * 1000,
      delayMax: form.values.delayMax * 1000,
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
    handleClose,
    handleSendBroadcast,
    handleWarningAccepted,
  }
}
