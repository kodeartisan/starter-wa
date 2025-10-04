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

// Define presets to avoid magic strings and keep the logic centralized.
const DELAY_PRESETS = {
  fast: { min: 3, max: 6 },
  recommended: { min: 5, max: 10 },
  slow: { min: 10, max: 20 },
}

const defaultValues = {
  name: '',
  numbers: [] as any[],
  tags: [] as string[],
  isTyping: true,
  validateNumbers: true,
  delayPreset: 'recommended', // MODIFIED: Replaced delayMin/Max with a single preset.
  scheduler: {
    enabled: false,
    scheduledAt: addMinutes(new Date(), 5),
  },
  smartPause: {
    enabled: false,
    start: '09:00',
    end: '17:00',
  },
  batch: {
    enabled: false,
    size: 20,
    delay: 15,
  },
  warmupMode: {
    enabled: false,
  },
}

interface useBroadcastFormProps {
  cloneData?: (Broadcast & { recipients?: any[] }) | null
  onSuccess: () => void
  onClose: () => void
}

/**
 * @description A simple hashing function for an object.
 * @param obj The object to hash.
 * @returns A numeric string representing the hash.
 */
const hashMessage = (obj: any): string => {
  const str = JSON.stringify(obj)
  if (str.length === 0) return '0'
  const hash = str
    .split('')
    .reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0)
  return hash.toString()
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
        if (license.isFree()) {
          form.setFieldValue('scheduler.enabled', false)
          return
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
      smartPause: (value) => {
        if (license.isFree()) {
          form.setFieldValue('smartPause.enabled', false)
          return
        }
        if (!value.enabled) return null
        if (!value.start || !value.end) {
          return 'Start and end times are required for Smart Pause.'
        }
        if (value.start >= value.end) {
          return 'Start time must be before end time.'
        }
        return null
      },
      batch: (value) => {
        if (license.isFree()) {
          form.setFieldValue('batch.enabled', false)
          return
        }
        if (!value.enabled) return null
        if (!value.size || value.size < 1) {
          return 'Batch size must be at least 1.'
        }
        if (!value.delay || value.delay < 1) {
          return 'Batch delay must be at least 1 minute.'
        }
        return null
      },
      // MODIFIED: Removed validation for delayMin and delayMax
    },
    validateInputOnChange: [
      'numbers',
      'scheduler.scheduledAt',
      'warmupMode.enabled',
      'batch.enabled',
      'smartPause.enabled',
      'scheduler.enabled',
    ],
  })

  const {
    form: inputMessageForm,
    getMessage,
    insertBroadcastFile,
  } = useInputMessage()

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

        // MODIFIED: Helper to map old delay values (in ms) to a preset key.
        const mapDelayToPreset = (minMs?: number, maxMs?: number) => {
          if (minMs === 3000 && maxMs === 6000) return 'fast'
          if (minMs === 10000 && maxMs === 20000) return 'slow'
          // Default to 'recommended' for any other case, including the old 5-10s default.
          return 'recommended'
        }

        form.setValues({
          name: `${broadcastName}${nameSuffix}`,
          numbers: recipientsToSet,
          tags: cloneData.tags || [],
          isTyping: !!cloneData.isTyping,
          validateNumbers: !!cloneData.validateNumbers,
          scheduler: {
            enabled: false,
            scheduledAt: addMinutes(new Date(), 5),
          },
          smartPause: {
            enabled: !!cloneData.smartPauseEnabled,
            start: cloneData.smartPauseStart || '09:00',
            end: cloneData.smartPauseEnd || '17:00',
          },
          batch: {
            enabled: !!cloneData.batchEnabled,
            size: cloneData.batchSize || 20,
            delay: cloneData.batchDelay || 15,
          },
          warmupMode: {
            enabled: !!cloneData.warmupModeEnabled,
          },
          // MODIFIED: Set the preset based on the cloned broadcast's values.
          delayPreset: mapDelayToPreset(cloneData.delayMin, cloneData.delayMax),
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

  const handleClose = () => {
    form.reset()
    inputMessageForm.reset()
    onClose()
  }

  const saveAndDispatchBroadcast = async () => {
    const messagePayload = getMessage()
    const messageType = inputMessageForm.values.type

    // MODIFIED: Derive min/max delay from the selected preset.
    const selectedPreset =
      DELAY_PRESETS[form.values.delayPreset] || DELAY_PRESETS.recommended
    const delayMinMs = selectedPreset.min * 1000
    const delayMaxMs = selectedPreset.max * 1000

    const broadcastData = {
      name: form.values.name,
      tags: form.values.tags,
      type: messageType,
      message: messagePayload,
      contentHash: hashMessage(messagePayload),
      isTyping: form.values.isTyping ? 1 : 0,
      isScheduler: form.values.scheduler.enabled ? 1 : 0,
      validateNumbers: form.values.validateNumbers ? 1 : 0,
      status: form.values.scheduler.enabled ? Status.SCHEDULER : Status.PENDING,
      delayMin: delayMinMs, // MODIFIED
      delayMax: delayMaxMs, // MODIFIED
      smartPauseEnabled: form.values.smartPause.enabled ? 1 : 0,
      smartPauseStart: form.values.smartPause.start,
      smartPauseEnd: form.values.smartPause.end,
      batchEnabled: form.values.batch.enabled ? 1 : 0,
      batchSize: form.values.batch.size,
      batchDelay: form.values.batch.delay,
      warmupModeEnabled: form.values.warmupMode.enabled ? 1 : 0,
      resumeAt: null,
    }

    try {
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
    if (formHasErrors(form, inputMessageForm)) return 'VALIDATION_ERROR'

    const messagePayload = getMessage()
    const contentHash = hashMessage(messagePayload)
    const lastBroadcast = await db.broadcasts.orderBy('id').last()
    if (lastBroadcast && lastBroadcast.contentHash === contentHash) {
      return 'DUPLICATE'
    }

    const hasAcknowledged = await storage.get(
      Setting.HAS_ACKNOWLEDGED_BROADCAST_WARNING,
    )
    if (!hasAcknowledged) {
      return 'NEEDS_WARNING'
    }

    await saveAndDispatchBroadcast()
    return 'SUCCESS'
  }

  const handleWarningAccepted = async () => {
    await storage.set(Setting.HAS_ACKNOWLEDGED_BROADCAST_WARNING, true)
    await saveAndDispatchBroadcast()
  }

  return {
    form,
    inputMessageForm,
    handleClose,
    handleSendBroadcast,
    handleWarningAccepted,
    forceSendBroadcast: saveAndDispatchBroadcast,
  }
}
