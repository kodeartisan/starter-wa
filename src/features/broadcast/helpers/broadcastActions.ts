// src/features/broadcast/helpers/broadcastActions.ts
import { Media, Message } from '@/constants'
import type { Broadcast, BroadcastContact } from '@/libs/db'
import db from '@/libs/db'
import wa from '@/libs/wa'
import MediaModel from '@/models/MediaModel'
import parse from '@/utils/parse'
import throwError from '@/utils/throwError'
import { generateRandomDelay } from '@/utils/util'

/**
 * @description Returns the appropriate sending function based on broadcast type.
 * @param {Broadcast} broadcast - The parent broadcast record.
 * @param {BroadcastContact} contact - The recipient contact.
 * @returns {Function | null} The async function to send the message, or null.
 */
export const getBroadcastAction = (
  broadcast: Broadcast,
  contact: BroadcastContact,
) => {
  const sendOptions = {
    ...(broadcast.isTyping && { delay: generateRandomDelay(1000, 3000) }),
  }

  const actions: { [key: string]: () => Promise<any> } = {
    [Message.TEXT]: async () => {
      const text = await parse.text(broadcast.message as string, contact.number)
      return wa.send.text(contact.number, text, sendOptions)
    },
    [Message.IMAGE]: async () => {
      const file = await MediaModel.findFirstByParent(
        broadcast.id,
        Media.BROADCAST,
      )
      if (!file) throwError.mediaNotFound()
      const message = broadcast.message as { caption?: string }
      return wa.send.file(contact.number, file.file, {
        type: 'image',
        caption: message.caption,
        ...sendOptions,
      })
    },
    [Message.VIDEO]: async () => {
      const file = await MediaModel.findFirstByParent(
        broadcast.id,
        Media.BROADCAST,
      )
      if (!file) throwError.mediaNotFound()
      const message = broadcast.message as { caption?: string }
      return wa.send.file(contact.number, file.file, {
        type: 'video',
        caption: message.caption,
        ...sendOptions,
      })
    },
    [Message.FILE]: async () => {
      const file = await MediaModel.findFirstByParent(
        broadcast.id,
        Media.BROADCAST,
      )
      if (!file) throwError.mediaNotFound()
      return wa.send.file(contact.number, file.file, {
        type: 'document',
        caption: broadcast.message as string,
        ...sendOptions,
      })
    },
    [Message.LOCATION]: async () => {
      const message = broadcast.message as any
      return wa.send.location(contact.number, { ...message, ...sendOptions })
    },
    [Message.POLL]: async () => {
      const { name, choices } = broadcast.message as any
      return wa.send.poll(contact.number, name, choices, sendOptions)
    },
    [Message.VCARD]: async () => {
      return wa.send.vcard(
        contact.number,
        broadcast.message as any[],
        sendOptions,
      )
    },
  }
  return actions[broadcast.type] || null
}
