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

  /**
   * Executes the sending logic for a single contact.
   * @param {Broadcast} broadcast - The parent broadcast.
   * @param {BroadcastContact} contact - The recipient contact.
   */
  const runBroadcast = async (
    broadcast: Broadcast,
    contact: BroadcastContact,
  ) => {
    const randomDelay =
      Math.floor(
        Math.random() * (broadcast.delayMax - broadcast.delayMin + 1),
      ) + broadcast.delayMin
    await delay(randomDelay)

    const action = getBroadcastAction(broadcast, contact)
    if (action) {
      await action()
    } else {
      throw new Error(`Unsupported broadcast message type: ${broadcast.type}`)
    }
  }

  /**
   * Checks if all contacts for a broadcast are done and updates the status.
   * @param {Broadcast} broadcast - The broadcast to check.
   */
  const checkAllContactsDone = async (broadcast: Broadcast) => {
    // This query is now more efficient due to the compound index.
    const pendingCount = await db.broadcastContacts
      .where({ broadcastId: broadcast.id, status: Status.PENDING })
      .count()
    const runningCount = await db.broadcastContacts
      .where({ broadcastId: broadcast.id, status: Status.RUNNING })
      .count()

    if (pendingCount === 0 && runningCount === 0) {
      await BroadcastModel.success(broadcast.id)
      toast.success(
        `Broadcast "${broadcast.name || 'Untitled'}" has been completed.`,
      )
    }
  }

  // ++ MODIFIED: The main processing loop is heavily refactored for performance.
  /**
   * The main processing loop for the broadcast queue.
   */
  const processBroadcastQueue = async () => {
    if (processingState.current === 'PROCESSING') return
    processingState.current = 'PROCESSING'

    try {
      while (true) {
        // 1. Fetch contacts in a batch instead of one by one.
        const contacts = await BroadcastContactModel.getStatusPendingBatch(20)
        if (!contacts.length) break // No more pending contacts, exit the loop.

        // 2. Group contacts by their parent broadcast ID.
        const contactsByBroadcast = _.groupBy(contacts, 'broadcastId')

        // 3. Process each group.
        for (const broadcastIdStr in contactsByBroadcast) {
          const broadcastId = parseInt(broadcastIdStr, 10)
          const contactGroup = contactsByBroadcast[broadcastId]

          // 4. Fetch the parent broadcast object ONCE per group.
          const broadcast = await BroadcastModel.get(broadcastId)

          if (!broadcast) {
            // Mark contacts as failed if their parent broadcast is missing.
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
            continue // Skip to the next group.
          }

          if (broadcast.status !== Status.RUNNING) {
            await BroadcastModel.running(broadcast.id)
          }

          // 5. Process each contact within the group.
          for (const contact of contactGroup) {
            if (!validationRef.current) return // Allow cancellation mid-batch

            if (broadcast.validateNumbers === 1) {
              const isValid = await wa.contact.isExist(contact.number)
              if (!isValid) {
                await BroadcastContactModel.failed(
                  contact.id,
                  'Number is not a valid WhatsApp account.',
                )
                continue // Skip to the next contact
              }
            }
            try {
              await BroadcastContactModel.running(contact.id)
              await runBroadcast(broadcast, contact)
              await BroadcastContactModel.success(contact.id)
            } catch (error: any) {
              await BroadcastContactModel.failed(contact.id, error.message)
            }
          }

          // 6. Check if the entire broadcast is done after processing a batch.
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

  /**
   * Checks for scheduled items.
   */
  const checkScheduled = async () => {
    const now = new Date()

    // Mark scheduled contacts as 'PENDING'
    await db.broadcastContacts
      .where('status')
      .equals(Status.SCHEDULER)
      .and((contact) => dayjs(contact.scheduledAt).isBefore(now))
      .modify({ status: Status.PENDING })

    await processBroadcastQueue()
  }

  const validationRef = useRef(true) // Added for cancellation logic
  /**
   * Cancels a running or scheduled broadcast.
   */
  const cancel = async (broadcastId: number) => {
    validationRef.current = false // Stop processing loop
    while (processingState.current === 'PROCESSING') {
      await delay(200) // Wait for current message to finish
    }
    processingState.current = 'PROCESSING'
    try {
      await db.broadcastContacts
        .where({ broadcastId })
        .and((c) => [Status.PENDING, Status.SCHEDULER].includes(c.status))
        .modify({ status: Status.CANCELLED, error: 'Cancelled by user' })
      await BroadcastModel.cancel(broadcastId)
      toast.info('Broadcast has been cancelled.')
    } catch (e) {
      console.error(`Error during cancellation of broadcast ${broadcastId}:`, e)
      toast.error('Failed to cancel broadcast.')
    } finally {
      validationRef.current = true // Reset for next run
      processingState.current = 'IDLE'
    }
  }

  const initializeBroadcaster = async () => {
    await BroadcastContactModel.resetRunningStatuses()
    await processBroadcastQueue()
  }

  return { init: initializeBroadcaster, checkScheduled, cancel }
}

export default useBroadcast
