// src/hooks/useStatusScheduler.ts
import { Status as StatusState, StatusType } from '@/constants'
import db, { type Media as MediaRecord, type UserStatus } from '@/libs/db'
import wa from '@/libs/wa'
// ++ ADDED: Import the toast utility for user feedback.
import toast from '@/utils/toast'
import { delay, generateRandomDelay } from '@/utils/util'
import dayjs from 'dayjs'
import _ from 'lodash'
import { useRef } from 'react'

const useStatusScheduler = () => {
  const isProcessing = useRef(false)

  const initializeScheduler = async () => {
    await db.userStatuses
      .where('status')
      .equals(StatusState.RUNNING)
      .modify({ status: StatusState.PENDING })
    await checkScheduled()
  }

  const checkScheduled = async () => {
    if (isProcessing.current) {
      return
    }
    const now = new Date()
    const dueScheduled = await db.userStatuses
      .where('status')
      .equals(StatusState.SCHEDULER)
      .and(
        (status) =>
          dayjs(status.scheduledAt).isBefore(now) ||
          dayjs(status.scheduledAt).isSame(now),
      )
      .modify({ status: StatusState.PENDING })

    if (dueScheduled > 0) {
      console.log(
        `StatusScheduler: Found ${dueScheduled} scheduled statuses due. Changed to PENDING.`,
      )
    }
    await init()
  }

  const init = async () => {
    if (isProcessing.current) {
      return
    }
    isProcessing.current = true
    try {
      const statusToPost = await db.userStatuses
        .where('status')
        .equals(StatusState.PENDING)
        .first()

      if (!statusToPost) {
        isProcessing.current = false
        return
      }
      await postStatus(statusToPost)
    } catch (error) {
      console.error('StatusScheduler: Error during init or posting:', error)
    } finally {
    }
  }

  const postStatus = async (status: UserStatus) => {
    try {
      await db.userStatuses.update(status.id, { status: StatusState.RUNNING })
      await delay(generateRandomDelay(1000, 3000))
      let result: any

      if (status.type === StatusType.TEXT) {
        result = await wa.status.sendTextStatus(status.message as string, {
          backgroundColor: status.backgroundColor,
          font: status.font,
        })
      } else if (
        (status.type === StatusType.IMAGE ||
          status.type === StatusType.VIDEO) &&
        (status.message as any)?.fileId
      ) {
        const media: MediaRecord | undefined = await db.media.get(
          (status.message as any).fileId,
        )
        if (!media || !media.file) {
          throw new Error(
            `Media file not found for status ID: ${status.id}, fileId: ${
              (status.message as any).fileId
            }`,
          )
        }
        const caption = (status.message as { caption?: string })?.caption

        if (status.type === StatusType.IMAGE) {
          result = await wa.status.sendImageStatus(media.file, { caption })
        } else {
          result = await wa.status.sendVideoStatus(media.file, { caption })
        }
      } else {
        throw new Error(
          `Invalid status type or missing media for status ID: ${status.id}`,
        )
      }

      if (
        result &&
        (result.id ||
          result.ack === 2 ||
          result.status === 'SUCCESS' ||
          (typeof result === 'object' && Object.keys(result).length > 0))
      ) {
        await db.userStatuses.update(status.id, {
          status: StatusState.POSTED,
          postedAt: new Date(),
        })
        // ++ ADDED: Notify the user when a status is successfully posted.
        toast.success(
          `Status "${status.name || 'Untitled'}" has been successfully posted.`,
        )
      } else {
        throw new Error(
          `Failed to post status ID ${status.id}: ${
            result?.error || result?.message || 'Unknown WPP error'
          }`,
        )
      }
    } catch (error: any) {
      console.error(
        `StatusScheduler: Failed to post status ID ${status.id}. Error:`,
        error,
      )
      await db.userStatuses.update(status.id, {
        status: StatusState.FAILED,
      })
    } finally {
      isProcessing.current = false
      await init()
    }
  }

  const cancelScheduledStatus = async (statusId: number) => {
    // MODIFIED: When cancelling, `isScheduled` is set to 0 (false).
    const updated = await db.userStatuses
      .where({ id: statusId, status: StatusState.SCHEDULER })
      .modify({ status: StatusState.DRAFT, isScheduled: 0, scheduledAt: null })

    if (updated > 0) {
    } else {
      console.log(
        `StatusScheduler: Status ID ${statusId} not found or not in SCHEDULER state.`,
      )
    }
  }

  return {
    initializeScheduler,
    checkScheduled,
    cancelScheduledStatus,
  }
}
export default useStatusScheduler
