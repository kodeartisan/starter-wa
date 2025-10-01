// src/features/Broadcast/hooks/useBroadcast.ts
import { Status } from '@/constants'
import type { Broadcast, BroadcastContact } from '@/libs/db'
import db from '@/libs/db'
import wa from '@/libs/wa'
import BroadcastContactModel from '@/models/BroadcastContactModel'
import BroadcastModel from '@/models/BroadcastModel'
import toast from '@/utils/toast'
import { delay } from '@/utils/util'
import dayjs from 'dayjs'
import _ from 'lodash'
import { useRef } from 'react'
import { getBroadcastAction } from '../helpers/broadcastActions'

/**
 * @hook useBroadcast
 * @description Manages the entire broadcast queue processing logic.
 * It uses a state machine ('IDLE', 'PROCESSING') to prevent concurrent runs
 * and processes pending messages in a linear loop.
 */
const useBroadcast = () => {
  const processingState = useRef<'IDLE' | 'PROCESSING'>('IDLE')

  const runBroadcast = async (
    broadcast: Broadcast,
    contact: BroadcastContact,
  ) => {
    if (broadcast.validateNumbers) {
      const isValid = await wa.contact.isExist(contact.number)
      if (!isValid) {
        throw new Error('Contact does not exist on WhatsApp.')
      }
    }

    const action = getBroadcastAction(broadcast, contact)
    if (action) {
      await action()
    } else {
      throw new Error(`Unsupported broadcast message type: ${broadcast.type}`)
    }
  }

  const checkAllContactsDone = async (broadcast: Broadcast) => {
    const pendingCount = await db.broadcastContacts
      .where({ broadcastId: broadcast.id, status: Status.PENDING })
      .count()
    const runningCount = await db.broadcastContacts
      .where({ broadcastId: broadcast.id, status: Status.RUNNING })
      .count()

    if (pendingCount === 0 && runningCount === 0) {
      const freshBroadcast = await BroadcastModel.get(broadcast.id)
      if (freshBroadcast.status === Status.PAUSED) {
        return
      }
      await BroadcastModel.success(broadcast.id)
      toast.success(
        `Broadcast "${broadcast.name || 'Untitled'}" has been completed.`,
      )
    }
  }

  const processBroadcastQueue = async () => {
    if (processingState.current === 'PROCESSING') return
    processingState.current = 'PROCESSING'
    try {
      while (true) {
        const contacts = await BroadcastContactModel.getStatusPendingBatch(20)
        if (!contacts.length) break
        const contactsByBroadcast = _.groupBy(contacts, 'broadcastId')

        for (const broadcastIdStr in contactsByBroadcast) {
          const broadcastId = parseInt(broadcastIdStr, 10)
          const contactGroup = contactsByBroadcast[broadcastId]
          const broadcast = await BroadcastModel.get(broadcastId)

          if (!broadcast) {
            const contactIds = contactGroup.map((c) => c.id)
            await db.broadcastContacts
              .bulkUpdate(
                contactIds.map((id) => ({
                  key: id,
                  changes: {
                    status: Status.FAILED,
                    error: 'Broadcast record missing.',
                  },
                })),
              )
              .catch(console.error)
            continue
          }

          // MODIFIED: Fetch the count of successfully sent messages for this broadcast.
          let successfulCountForBroadcast = await db.broadcastContacts
            .where({ broadcastId: broadcast.id, status: Status.SUCCESS })
            .count()

          if (broadcast.smartPauseEnabled) {
            const now = new Date()
            const currentTime = now.getHours() * 60 + now.getMinutes()
            const [startH, startM] = broadcast.smartPauseStart
              .split(':')
              .map(Number)
            const [endH, endM] = broadcast.smartPauseEnd.split(':').map(Number)
            const startTime = startH * 60 + startM
            const endTime = endH * 60 + endM
            if (currentTime < startTime || currentTime > endTime) {
              if (broadcast.status !== Status.PAUSED) {
                await BroadcastModel.pause(broadcast.id)
              }
              continue
            }
          }

          if (broadcast.status !== Status.RUNNING) {
            await BroadcastModel.running(broadcast.id)
          }

          for (const contact of contactGroup) {
            if (!validationRef.current) return
            try {
              await BroadcastContactModel.running(contact.id)

              // MODIFIED: Implemented the core warm-up delay logic.
              const isWarmupPhase =
                broadcast.warmupModeEnabled && successfulCountForBroadcast < 20
              const randomDelay = isWarmupPhase
                ? Math.floor(Math.random() * (30000 - 15000 + 1)) + 15000 // 15-30s delay for warm-up
                : Math.floor(
                    Math.random() *
                      (broadcast.delayMax - broadcast.delayMin + 1),
                  ) + broadcast.delayMin // User-defined delay

              await delay(randomDelay)
              await runBroadcast(broadcast, contact)
              await BroadcastContactModel.success(contact.id)
              successfulCountForBroadcast++ // Increment count for the next message in this broadcast.
            } catch (error: any) {
              await BroadcastContactModel.failed(contact.id, error.message)
            }
          }

          if (broadcast.batchEnabled) {
            const successfulCount = await db.broadcastContacts
              .where({ broadcastId: broadcast.id, status: Status.SUCCESS })
              .count()
            const pendingCount = await db.broadcastContacts
              .where({ broadcastId: broadcast.id, status: Status.PENDING })
              .count()

            if (
              successfulCount > 0 &&
              successfulCount % broadcast.batchSize === 0 &&
              pendingCount > 0
            ) {
              const resumeAt = dayjs()
                .add(broadcast.batchDelay, 'minutes')
                .toDate()
              await db.broadcasts.update(broadcast.id, {
                status: Status.PAUSED,
                resumeAt: resumeAt,
              })
              continue
            }
          }
          await checkAllContactsDone(broadcast)
        }
      }
    } catch (e) {
      console.error(
        'An unexpected error occurred in the broadcast processor:',
        e,
      )
    } finally {
      processingState.current = 'IDLE'
    }
  }

  const checkScheduledAndPaused = async () => {
    const now = new Date()
    await db.broadcastContacts
      .where('status')
      .equals(Status.SCHEDULER)
      .and((contact) => dayjs(contact.scheduledAt).isBefore(now))
      .modify({ status: Status.PENDING })

    const pausedBroadcasts = await db.broadcasts
      .where('status')
      .equals(Status.PAUSED)
      .toArray()
    for (const broadcast of pausedBroadcasts) {
      if (broadcast.smartPauseEnabled && !broadcast.resumeAt) {
        const currentTime = now.getHours() * 60 + now.getMinutes()
        const [startH, startM] = broadcast.smartPauseStart
          .split(':')
          .map(Number)
        const [endH, endM] = broadcast.smartPauseEnd.split(':').map(Number)
        const startTime = startH * 60 + startM
        const endTime = endH * 60 + endM
        if (currentTime >= startTime && currentTime <= endTime) {
          await BroadcastModel.pending(broadcast.id)
        }
      }

      if (
        broadcast.batchEnabled &&
        broadcast.resumeAt &&
        dayjs(broadcast.resumeAt).isBefore(now)
      ) {
        await db.broadcasts.update(broadcast.id, {
          status: Status.PENDING,
          resumeAt: null,
        })
      }
    }
    await processBroadcastQueue()
  }

  const validationRef = useRef(true)

  const cancel = async (broadcastId: number) => {
    validationRef.current = false
    while (processingState.current === 'PROCESSING') {
      await delay(200)
    }
    processingState.current = 'PROCESSING'
    try {
      await db.broadcastContacts
        .where({ broadcastId })
        .and((c) =>
          [Status.PENDING, Status.SCHEDULER, Status.RUNNING].includes(c.status),
        )
        .modify({ status: Status.CANCELLED, error: 'Cancelled by user' })
      await BroadcastModel.cancel(broadcastId)
      toast.info('Broadcast has been cancelled.')
    } catch (e) {
      console.error(`Error during cancellation of broadcast ${broadcastId}:`, e)
      toast.error('Failed to cancel broadcast.')
    } finally {
      validationRef.current = true
      processingState.current = 'IDLE'
    }
  }

  const initializeBroadcaster = async () => {
    await BroadcastContactModel.resetRunningStatuses()
    await processBroadcastQueue()
  }

  return {
    init: initializeBroadcaster,
    checkScheduled: checkScheduledAndPaused,
    cancel,
  }
}

export default useBroadcast
