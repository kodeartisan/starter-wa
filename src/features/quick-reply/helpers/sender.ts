// src/features/quick-reply/helpers/sender.ts
import { Media, Message } from '@/constants'
import type { QuickReply } from '@/libs/db'
import wa from '@/libs/wa'
import MediaModel from '@/models/MediaModel'
import parse from '@/utils/parse'
import throwError from '@/utils/throwError'

/**
 * @description Returns the appropriate sending function based on the quick reply type.
 * @param {QuickReply} reply - The quick reply record.
 * @param {string} chatId - The target chat ID.
 * @returns {Function} The async function to send the message.
 */
export const sendQuickReply = async (reply: QuickReply, chatId: string) => {
  const { type, message } = reply

  switch (type) {
    case Message.TEXT: {
      const parsedText = await parse.text(message as string, chatId)
      return wa.send.text(chatId, parsedText)
    }
    case Message.IMAGE: {
      const file = await MediaModel.findFirstByParent(
        reply.id,
        Media.QUICK_REPLY,
      )
      if (!file) throwError.mediaNotFound()
      const parsedCaption = await parse.text(
        (message as { caption?: string }).caption || '',
        chatId,
      )
      return wa.send.file(chatId, file.file, {
        type: 'image',
        caption: parsedCaption,
      })
    }
    case Message.VIDEO: {
      const file = await MediaModel.findFirstByParent(
        reply.id,
        Media.QUICK_REPLY,
      )
      if (!file) throwError.mediaNotFound()
      const parsedCaption = await parse.text(
        (message as { caption?: string }).caption || '',
        chatId,
      )
      return wa.send.file(chatId, file.file, {
        type: 'video',
        caption: parsedCaption,
      })
    }
    case Message.FILE: {
      const file = await MediaModel.findFirstByParent(
        reply.id,
        Media.QUICK_REPLY,
      )
      if (!file) throwError.mediaNotFound()
      const parsedCaption = await parse.text(message as string, chatId)
      return wa.send.file(chatId, file.file, {
        type: 'document',
        caption: parsedCaption,
      })
    }
    case Message.LOCATION: {
      return wa.send.location(chatId, message as any)
    }
    case Message.POLL: {
      const { name, choices } = message as any
      return wa.send.poll(chatId, name, choices)
    }
    case Message.VCARD: {
      const contactIdsToSend = (message as any[]).map((c) => c.id._serialized)
      if (contactIdsToSend.length === 0)
        throw new Error('No contact selected for VCard.')
      return wa.send.vcard(chatId, contactIdsToSend)
    }
    default:
      throw new Error(`Unsupported quick reply message type: ${type}`)
  }
}
